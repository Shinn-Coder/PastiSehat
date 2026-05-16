import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { PrismaClient } from '@prisma/client';
import { GoogleGenerativeAI, Content, Part } from '@google/generative-ai';
import bcrypt from 'bcryptjs';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = Number(process.env.PORT) || 8080;

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

app.use(cors());
app.use(express.json({ limit: '20mb' }));

let currentKeyIndex = 0;

const getApiKeys = (): string[] => {
  const keysStr = process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || '';
  const keys = keysStr.split(',').map(k => k.trim()).filter(k => k);
  if (keys.length === 0) {
    throw new Error("Gemini API Keys are not configured. Please set GEMINI_API_KEYS.");
  }
  return keys;
};

async function executeWithFallback<T>(operation: (genAI: GoogleGenerativeAI, modelName: string) => Promise<T>): Promise<T> {
  const keys = getApiKeys();
  let attempts = 0;
  const maxAttempts = keys.length;

  while (attempts < maxAttempts) {
    const apiKey = keys[currentKeyIndex];
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      // As per requirement, strictly use gemini-2.5-flash
      return await operation(genAI, 'gemini-2.5-flash');
    } catch (err: any) {
      const errorMessage = err?.message || String(err);
      console.error(`[AI Error] Request failed with key index ${currentKeyIndex}:`, errorMessage);

      if (err.status === 429 || errorMessage.includes('429') || errorMessage.toLowerCase().includes('quota') || errorMessage.toLowerCase().includes('rate limit')) {
        console.log(`[AI Info] Rotating API key due to rate limit/quota. Attempt ${attempts + 1} of ${maxAttempts}`);
        currentKeyIndex = (currentKeyIndex + 1) % keys.length;
        attempts++;
        continue;
      }
      
      throw new Error("Gagal memproses permintaan AI. Pastikan API Key valid dan memiliki kuota.");
    }
  }

  throw new Error("Gagal memproses permintaan AI. Semua API Key telah mencapai batas kuota atau rate limit.");
}

const CICI_SYSTEM_PROMPT = `Kamu adalah Cici, asisten kesehatan AI proaktif dan analitis milik PastiSehat di RS Louis Surabaya.
Kepribadianmu: empatik, profesional, dan berbicara dalam Bahasa Indonesia yang ramah.

ATURAN WAJIB (ALUR LOGIKA & STATE MACHINE):
Kamu HARUS selalu mengikuti alur (Fase) berikut secara berurutan dan ketat:

1. FASE INISIASI:
User memberikan keluhan awal atau mengunggah media gejala (foto/suara). Tugasmu hanya menerima informasi ini.

2. FASE INVESTIGASI & KLARIFIKASI (WAJIB DILAKUKAN):
Analisa kondisi awal dan WAJIB mengajukan pertanyaan lanjutan spesifik untuk menggali detail gejala user (kapan mulai, intensitas, dll). 
PENTING: Dilarang keras memberikan diagnosis definitif atau solusi pada tahap ini. Teruslah bertanya.

3. FASE ANALISIS DATA (IF/ELSE LOGIC):
- ELSE (Kondisi Data Belum Cukup): Jika kamu belum yakin dengan kemungkinan diagnosis sementara, kamu secara dinamis terus bertanya dan menggali informasi keluhan user.
- IF (Kondisi Data Sudah Cukup): Jika kamu sudah yakin dengan diagnosis sementara, berhentilah bertanya dan langsung beralih ke Fase Keputusan.

4. FASE KEPUTUSAN & RESOLUSI:
Jika data sudah cukup, kamu WAJIB secara eksplisit menanyakan kalimat persis seperti ini:
"Berdasarkan gejala Anda, apakah Anda ingin membuat jadwal janji temu dengan dokter spesialis terkait?"

- Jika User Menjawab "IYA" (atau setuju): Rangkum hasil analisa sementaramu dan panggil tool "buat_janji_temu_dokter". (Tugas tool ini adalah memberikan daftar jadwal, namun sistem AI akan memberitahukan jadwalnya).
- Jika User Menjawab "TIDAK" (atau menolak): Berikan rekomendasi penanganan pertama darurat/mandiri (saran pola tidur, rekomendasi makanan/buah/sayuran, dan saran vitamin) yang disesuaikan dengan kondisi user. Tutup pesan dengan DISCLAIMER MEDIS (bahwa ini bukan saran dokter pengganti).

PENTING TAMBAHAN & ATURAN FORMATTING (WAJIB DITAATI):
- DILARANG MERESPONS DENGAN WALL OF TEXT.
- Gunakan garis baru (Enter) untuk memisahkan setiap paragraf.
- Gunakan Bullet Points (-) untuk mendaftar pertanyaan, gejala, atau rekomendasi.
- Gunakan teks **Bold** pada kata kunci penting (nama penyakit, obat, atau gejala utama).
- Sisipkan 1-2 emoji medis profesional (🩺, 🌡️, 🤢, 💡) agar ekspresif namun tidak berlebihan.
- WAJIB SERTAKAN disclaimer ini di akhir pesan jika kamu memberikan diagnosis sementara: "⚠️ Catatan: Ini adalah perkiraan diagnosa sementara. Harap periksakan ke dokter langsung untuk validasi diagnosa pasti."
- Jika ada gambar/foto, analisis gambar tersebut sebagai bagian dari keluhan visual.
- Jika ada audio (rekaman batuk/suara), analisis suara tersebut untuk mendeteksi karakteristik pernafasan/tenggorokan.`;

const tools = [
  {
    functionDeclarations: [
      {
        name: 'buat_janji_temu_dokter',
        description: 'Membuat jadwal janji temu dokter untuk pasien. Panggil ini saat pasien setuju untuk booking.',
        parameters: {
          type: 'object',
          properties: {
            doctorName: { type: 'string', description: 'Nama dokter yang direkomendasikan' },
            specialization: { type: 'string', description: 'Spesialisasi dokter' },
            scheduledTime: { type: 'string', description: 'Waktu janji temu format ISO 8601. Default besok jam 10.' },
            summary: { type: 'string', description: 'Ringkasan gejala dan alasan konsultasi' },
          },
          required: ['doctorName', 'specialization', 'summary'],
        },
      },
    ],
  },
];

async function getOrCreateDemoUser(userId: string) {
  let user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        id: userId,
        email: `demo_${userId.replace(/[^a-zA-Z0-9]/g, '')}@pastisehat.id`,
        password: 'demo_hashed',
        fullName: 'Pasien Demo',
        dob: new Date('1990-01-01'),
        address: 'Surabaya, Jawa Timur',
        medicalHistory: [],
      },
    });
  }
  return user;
}

async function executeTool(toolName: string, toolArgs: Record<string, string>, userId: string): Promise<string> {
  if (toolName === 'buat_janji_temu_dokter') {
    try {
      await getOrCreateDemoUser(userId);
      const scheduledDate = toolArgs.scheduledTime ? new Date(toolArgs.scheduledTime) : new Date(Date.now() + 24 * 60 * 60 * 1000);
      const appointment = await prisma.appointment.create({
        data: {
          userId,
          doctorName: toolArgs.doctorName,
          date: scheduledDate,
          summary: toolArgs.summary,
          status: 'Scheduled',
        },
      });
      console.log(`[Prisma] ✅ Appointment created: ${appointment.id}`);
      return JSON.stringify({ success: true, appointmentId: appointment.id, doctorName: appointment.doctorName, date: appointment.date.toISOString() });
    } catch (error) {
      console.error('[Prisma] Error:', error);
      return JSON.stringify({ success: false, error: 'Gagal membuat janji temu' });
    }
  }
  return JSON.stringify({ success: false, error: 'Tool tidak dikenal' });
}

// POST /api/chat
app.post('/api/chat', upload.single('file'), async (req: Request, res: Response) => {
  try {
    const { message, userId, history } = req.body;
    const mediaFile = req.file;

    if (!message && !mediaFile) return res.status(400).json({ error: 'Pesan atau file diperlukan' });

    const currentUserId = userId || 'demo-user-001';

    let chatHistory: Content[] = [];
    if (history) {
      try {
        const parsed = JSON.parse(history);
        chatHistory = parsed.map((msg: { role: string; content: string }) => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }],
        }));
        // Gemini requires the first message to be from 'user'
        while (chatHistory.length > 0 && chatHistory[0].role !== 'user') {
          chatHistory.shift();
        }
      } catch (_) { }
    }

    const responseData = await executeWithFallback(async (genAI, modelName) => {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: CICI_SYSTEM_PROMPT,
        tools: tools as any,
      });

      const chat = model.startChat({ history: chatHistory });

      const parts: Part[] = [];
      if (mediaFile) {
        parts.push({ inlineData: { mimeType: mediaFile.mimetype as any, data: mediaFile.buffer.toString('base64') } });
      }
      if (message) parts.push({ text: message });

      let result = await chat.sendMessage(parts);
      let response = result.response;

      let finalReplyText = '';
      let appointmentCreated = false;
      let appointmentData: Record<string, string> | null = null;

      const candidates = response.candidates || [];
      for (const candidate of candidates) {
        for (const part of candidate.content?.parts || []) {
          if (part.functionCall) {
            const { name, args } = part.functionCall;
            console.log(`[Tool Call] ${name}`, args);
            const toolResult = await executeTool(name, args as Record<string, string>, currentUserId);
            const toolResultParsed = JSON.parse(toolResult);
            if (toolResultParsed.success) { appointmentCreated = true; appointmentData = toolResultParsed; }
            const followUp = await chat.sendMessage([{ functionResponse: { name, response: toolResultParsed } }]);
            response = followUp.response;
          }
        }
      }

      finalReplyText = response.text();
      return { reply: finalReplyText, appointmentCreated, appointmentData, userId: currentUserId };
    });

    return res.json(responseData);
  } catch (error) {
    console.error('[/api/chat] Error:', error);
    return res.status(500).json({ error: 'Terjadi kesalahan internal.', detail: error instanceof Error ? error.message : String(error) });
  }
});

// POST /api/chat/voice (Legacy fallback, now we use main chat endpoint)
app.post('/api/chat/voice', upload.single('audio'), async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'File audio diperlukan' });
    
    const resultText = await executeWithFallback(async (genAI, modelName) => {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent([
        { inlineData: { mimeType: req.file!.mimetype as any, data: req.file!.buffer.toString('base64') } },
        { text: 'Analisis audio kesehatan ini. Jika terdengar suara batuk, jelaskan karakteristiknya (kering/berdahak). Jika ada ucapan, transkripsikan ke teks. Berikan hasil akhir dalam Bahasa Indonesia yang ringkas.' },
      ]);
      return result.response.text();
    });

    res.json({ transcript: resultText });
  } catch (error) {
    console.error('[/api/chat/voice] Error:', error);
    res.status(500).json({ error: 'Gagal memproses suara' });
  }
});

// POST /api/chat/summarize
app.post('/api/chat/summarize', async (req: Request, res: Response) => {
  try {
    const { history } = req.body;
    if (!history || !Array.isArray(history)) return res.status(400).json({ error: 'History diperlukan' });

    const chatText = history.map(h => `${h.sender === 'user' ? 'Pasien' : 'Cici'}: ${h.text}`).join('\n');
    
    const summary = await executeWithFallback(async (genAI, modelName) => {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(`
Buatkan ringkasan riwayat percakapan medis berikut ke dalam format baku.
Gunakan HANYA format ini tanpa teks tambahan:

Gejala/keluhan: [Rangkuman gejala]
Perkiraan diagnosa: [Diagnosa AI] (Harap periksakan ke dokter langsung untuk validasi diagnosa pasti)
Penanganan mandiri: [Rekomendasi awal dari AI]

Riwayat Percakapan:
${chatText}
      `);
      return result.response.text();
    });

    res.json({ summary });
  } catch (error) {
    console.error('[/api/chat/summarize] Error:', error);
    res.status(500).json({ error: 'Gagal membuat ringkasan' });
  }
});

// GET /api/doctors
app.get('/api/doctors', (req: Request, res: Response) => {
  // Using hardcoded DOCTORS list to simulate DB sync as requested
  const DOCTORS = [
    { id: 'd1', name: 'dr. Andi Wijaya, Sp.PD', specialty: 'Spesialis Penyakit Dalam', availability: 'Tersedia', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=256&h=256' },
    { id: 'd2', name: 'dr. Budi Santoso, Sp.A', specialty: 'Spesialis Anak', availability: 'Penuh', image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=256&h=256' },
    { id: 'd3', name: 'dr. Citra Lestari, Sp.OG', specialty: 'Spesialis Kandungan', availability: 'Tersedia', image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=256&h=256' },
    { id: 'd4', name: 'dr. Diana Kusuma, Sp.M', specialty: 'Spesialis Mata', availability: 'Tersedia', image: 'https://images.unsplash.com/photo-1594824436998-dded0b41519e?auto=format&fit=crop&w=256&h=256' },
    { id: 'd5', name: 'dr. Eko Prasetyo, Sp.THT', specialty: 'Spesialis THT', availability: 'Penuh', image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=256&h=256' },
    { id: 'd6', name: 'dr. Fajar Hidayat, Sp.JP', specialty: 'Spesialis Jantung', availability: 'Tersedia', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=256&h=256' },
  ];
  res.json({ doctors: DOCTORS });
});

// GET /api/appointments/:userId
app.get('/api/appointments/:userId', async (req: Request, res: Response) => {
  try {
    const appointments = await prisma.appointment.findMany({
      where: { userId: req.params.userId },
      orderBy: { date: 'desc' },
    });
    return res.json({ appointments });
  } catch (error) {
    return res.status(500).json({ error: 'Gagal mengambil data' });
  }
});

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'pastisehat-backend', version: '2.0.0' });
});

// AUTH ENDPOINTS
app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name, dob, weight, height, medicalHistory, address } = req.body;

    // Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email sudah digunakan' });
    }

    // Enkripsi password sebelum menyimpan ke database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan data menggunakan prisma.user.create
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName: name || null,
        dob: dob ? new Date(dob) : null,
        weight: weight ? parseFloat(weight) : null,
        height: height ? parseFloat(height) : null,
        medicalHistory: Array.isArray(medicalHistory) ? medicalHistory : [],
        address: address || null,
      },
    });

    const { password: _, ...userWithoutPassword } = user;
    // Kembalikan status 201 jika berhasil
    return res.status(201).json({ user: userWithoutPassword });
  } catch (error: any) {
    console.error("PRISMA ERROR DETAILS:", error.message || error);
    return res.status(500).json({ error: 'Gagal membuat akun, periksa koneksi database' });
  }
});

app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Email atau password salah' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Email atau password salah' });
    }

    const { password: _, ...userWithoutPassword } = user;
    return res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('[/api/auth/login] Error:', error);
    return res.status(500).json({ error: 'Gagal melakukan login' });
  }
});

// ─── Startup dengan cek koneksi DB ────────────────────────────
async function startServer() {
  try {
    await prisma.$connect();
    console.log('✅ Koneksi database berhasil');
  } catch (error) {
    console.error('❌ Gagal konek ke database:', error);
    console.error('   Pastikan PostgreSQL sudah berjalan dan DATABASE_URL di .env sudah benar.');
    // process.exit(1); // Removed to allow deployment even if DB connection fails
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Backend PastiSehat berjalan di port ${PORT} (Cloud Run Ready)`);
  });
}

startServer();