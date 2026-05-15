import { Doctor, Article, Page, Medicine } from './types';

export const DOCTORS: Doctor[] = [
  // Dokter Umum
  { id: 'du1', name: 'dr. Ahmad Fauzi', specialty: 'Dokter Umum', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300', qualifications: ['Universitas Airlangga', 'Sertifikasi ACLS & ATLS'], schedule: [{ day: 'Senin', slots: ['08:00', '10:00', '13:00'] }, { day: 'Selasa', slots: ['08:00', '10:00', '13:00'] }] },
  { id: 'du2', name: 'dr. Siti Aminah', specialty: 'Dokter Umum', image: 'https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=300&h=300', qualifications: ['Universitas Indonesia', 'Sertifikasi Kedokteran Keluarga'], schedule: [{ day: 'Rabu', slots: ['08:00', '11:00'] }, { day: 'Kamis', slots: ['14:00', '16:00'] }] },
  { id: 'du3', name: 'dr. Bambang Heru', specialty: 'Dokter Umum', image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300&h=300', qualifications: ['Universitas Gadjah Mada', 'Praktik Umum 15 Tahun'], schedule: [{ day: 'Senin', slots: ['13:00', '15:00'] }, { day: 'Jumat', slots: ['09:00', '11:00'] }] },
  { id: 'du4', name: 'dr. Lilis Suryani', specialty: 'Dokter Umum', image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300&h=300', qualifications: ['Universitas Diponegoro', 'Edukator Kesehatan'], schedule: [{ day: 'Selasa', slots: ['09:00', '12:00'] }, { day: 'Sabtu', slots: ['08:00', '10:00'] }] },
  { id: 'du5', name: 'dr. Chandra Wijaya', specialty: 'Dokter Umum', image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300&h=300', qualifications: ['Universitas Padjadjaran', 'Dokter Lapangan'], schedule: [{ day: 'Kamis', slots: ['10:00', '14:00'] }, { day: 'Minggu', slots: ['08:00', '12:00'] }] },

  // Spesialis Penyakit Dalam
  { id: 'd1', name: 'dr. Andi Wijaya, Sp.PD', specialty: 'Spesialis Penyakit Dalam', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300', qualifications: ['Lulusan Universitas Airlangga', 'Pengalaman 10+ tahun'], schedule: [{ day: 'Senin', slots: ['09:00', '10:00', '13:00'] }, { day: 'Rabu', slots: ['09:00', '10:00', '15:00'] }] },
  { id: 'd1_2', name: 'dr. Hendra Pratama, Sp.PD', specialty: 'Spesialis Penyakit Dalam', image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300&h=300', qualifications: ['Universitas Brawijaya', 'Ahli Gastroenterologi'], schedule: [{ day: 'Selasa', slots: ['10:00', '14:00'] }] },
  { id: 'd1_3', name: 'dr. Ratna Sari, Sp.PD', specialty: 'Spesialis Penyakit Dalam', image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300&h=300', qualifications: ['Universitas Airlangga', 'Ahli Endokrin'], schedule: [{ day: 'Kamis', slots: ['08:00', '11:00'] }] },
  { id: 'd1_4', name: 'dr. Yusuf Mansur, Sp.PD', specialty: 'Spesialis Penyakit Dalam', image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300&h=300', qualifications: ['Universitas Diponegoro', 'Ahli Geriatri'], schedule: [{ day: 'Jumat', slots: ['13:00', '16:00'] }] },
  { id: 'd1_5', name: 'dr. Maya Indah, Sp.PD', specialty: 'Spesialis Penyakit Dalam', image: 'https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=300&h=300', qualifications: ['Universitas Indonesia', 'Ahli Penyakit Tropis'], schedule: [{ day: 'Sabtu', slots: ['09:00', '11:00'] }] },

  // Spesialis Anak
  { id: 'd2', name: 'dr. Maria Santoso, Sp.A', specialty: 'Spesialis Anak', image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300&h=300', qualifications: ['Lulusan UI', 'Ahli Tumbuh Kembang'], schedule: [{ day: 'Selasa', slots: ['08:00', '11:00'] }, { day: 'Kamis', slots: ['14:00', '16:00'] }] },
  { id: 'd2_2', name: 'dr. Kevin Sanjaya, Sp.A', specialty: 'Spesialis Anak', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300', qualifications: ['Universitas Padjadjaran', 'Neonatologi'], schedule: [{ day: 'Senin', slots: ['10:00', '13:00'] }] },
  { id: 'd2_3', name: 'dr. Linda Wahyuni, Sp.A', specialty: 'Spesialis Anak', image: 'https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=300&h=300', qualifications: ['Universitas Sebelas Maret', 'Kesehatan Remaja'], schedule: [{ day: 'Rabu', slots: ['09:00', '12:00'] }] },
  { id: 'd2_4', name: 'dr. Robby Purba, Sp.A', specialty: 'Spesialis Anak', image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300&h=300', qualifications: ['Universitas Sumatera Utara', 'Infeksi Pediatrik'], schedule: [{ day: 'Jumat', slots: ['14:00', '17:00'] }] },
  { id: 'd2_5', name: 'dr. Sarah Sechan, Sp.A', specialty: 'Spesialis Anak', image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300&h=300', qualifications: ['Universitas Indonesia', 'Alergi Anak'], schedule: [{ day: 'Sabtu', slots: ['08:00', '10:00'] }] },

  // Spesialis Bedah Tulang
  { id: 'd3', name: 'dr. Budi Setiawan, Sp.OT', specialty: 'Spesialis Bedah Tulang', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300', qualifications: ['Lulusan UGM', 'Ahli Ortopedi'], schedule: [{ day: 'Senin', slots: ['13:00', '15:00'] }, { day: 'Jumat', slots: ['09:00', '11:00'] }] },
  { id: 'd3_2', name: 'dr. Farhan Rizky, Sp.OT', specialty: 'Spesialis Bedah Tulang', image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300&h=300', qualifications: ['Universitas Indonesia', 'Trauma Bedah'], schedule: [{ day: 'Selasa', slots: ['09:00', '12:00'] }] },
  { id: 'd3_3', name: 'dr. Dina Lestari, Sp.OT', specialty: 'Spesialis Bedah Tulang', image: 'https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=300&h=300', qualifications: ['Universitas Airlangga', 'Penyakit Sendi'], schedule: [{ day: 'Kamis', slots: ['13:00', '15:00'] }] },
  { id: 'd3_4', name: 'dr. Taufik Hidayat, Sp.OT', specialty: 'Spesialis Bedah Tulang', image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300&h=300', qualifications: ['Universitas Brawijaya', 'Bedah Punggung'], schedule: [{ day: 'Rabu', slots: ['10:00', '13:00'] }] },
  { id: 'd3_5', name: 'dr. Anita Wijaya, Sp.OT', specialty: 'Spesialis Bedah Tulang', image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300&h=300', qualifications: ['Universitas Hasanuddin', 'Kedokteran Olahraga'], schedule: [{ day: 'Sabtu', slots: ['09:00', '11:00'] }] },

  // Spesialis Jantung
  { id: 'dj1', name: 'dr. Ahmad Perkasa, Sp.JP', specialty: 'Spesialis Jantung', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300', qualifications: ['Lulusan Universitas Airlangga', 'Pengalaman 12 Tahun'], schedule: [{ day: 'Senin', slots: ['09:00', '11:00'] }, { day: 'Rabu', slots: ['13:00', '15:00'] }] },
  { id: 'dj2', name: 'dr. Siska Utami, Sp.JP', specialty: 'Spesialis Jantung', image: 'https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=300&h=300', qualifications: ['Lulusan Universitas Indonesia', 'Pengalaman 8 Tahun'], schedule: [{ day: 'Selasa', slots: ['10:00', '12:00'] }, { day: 'Kamis', slots: ['14:00', '16:00'] }] },
  { id: 'dj3', name: 'dr. Budi Santoso, Sp.JP', specialty: 'Spesialis Jantung', image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300&h=300', qualifications: ['Lulusan Universitas Gadjah Mada', 'Pengalaman 15 Tahun'], schedule: [{ day: 'Rabu', slots: ['08:00', '10:00'] }, { day: 'Jumat', slots: ['13:00', '15:00'] }] },
  { id: 'dj4', name: 'dr. Citra Lestari, Sp.JP', specialty: 'Spesialis Jantung', image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300&h=300', qualifications: ['Lulusan Universitas Padjadjaran', 'Pengalaman 10 Tahun'], schedule: [{ day: 'Senin', slots: ['14:00', '16:00'] }, { day: 'Kamis', slots: ['09:00', '11:00'] }] },
  { id: 'dj5', name: 'dr. Dedi Kurniawan, Sp.JP', specialty: 'Spesialis Jantung', image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300&h=300', qualifications: ['Lulusan Universitas Diponegoro', 'Pengalaman 7 Tahun'], schedule: [{ day: 'Selasa', slots: ['08:00', '10:00'] }, { day: 'Rabu', slots: ['15:00', '17:00'] }] },

  // Spesialis Mata
  { id: 'dm1', name: 'dr. Maya Sandrina, Sp.M', specialty: 'Spesialis Mata', image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300&h=300', qualifications: ['Lulusan Universitas Airlangga', 'Pengalaman 9 Tahun'], schedule: [{ day: 'Senin', slots: ['10:00', '12:00'] }, { day: 'Jumat', slots: ['08:00', '10:00'] }] },
  { id: 'dm2', name: 'dr. Hendra Wijaya, Sp.M', specialty: 'Spesialis Mata', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300', qualifications: ['Lulusan Universitas Indonesia', 'Pengalaman 14 Tahun'], schedule: [{ day: 'Selasa', slots: ['13:00', '15:00'] }, { day: 'Kamis', slots: ['10:00', '12:00'] }] },
  { id: 'dm3', name: 'dr. Rina Amalia, Sp.M', specialty: 'Spesialis Mata', image: 'https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=300&h=300', qualifications: ['Lulusan Universitas Brawijaya', 'Pengalaman 6 Tahun'], schedule: [{ day: 'Rabu', slots: ['09:00', '11:00'] }, { day: 'Sabtu', slots: ['08:00', '10:00'] }] },
  { id: 'dm4', name: 'dr. Farhan Azhar, Sp.M', specialty: 'Spesialis Mata', image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300&h=300', qualifications: ['Lulusan Universitas Gadjah Mada', 'Pengalaman 11 Tahun'], schedule: [{ day: 'Senin', slots: ['13:00', '15:00'] }, { day: 'Kamis', slots: ['08:00', '10:00'] }] },
  { id: 'dm5', name: 'dr. Dian Kartika, Sp.M', specialty: 'Spesialis Mata', image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300&h=300', qualifications: ['Lulusan Universitas Sebelas Maret', 'Pengalaman 5 Tahun'], schedule: [{ day: 'Selasa', slots: ['09:00', '11:00'] }, { day: 'Rabu', slots: ['14:00', '16:00'] }] }
];

export const ARTICLES: Article[] = [
  { id: 'a1', title: 'Panduan Piring Makan Sehat Gizi Seimbang untuk Keluarga', author: 'RS Louis Editorial', date: '15 Mei 2026', category: 'Gizi', image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800', content: 'Pengaturan piring makan sehat sangat krusial...' },
  { id: 'a2', title: 'Mengenal Clean Eating dan Manfaatnya bagi Tubuh', author: 'Tim Gizi RS Louis', date: '14 Mei 2026', category: 'Gaya Hidup', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800', content: 'Clean eating adalah gaya hidup yang mengonsumsi makanan utuh...' },
  { id: 'a3', title: 'Pentingnya Vaksinasi Booster Dewasa di Tahun Ini', author: 'Poli Vaksin RS Louis', date: '13 Mei 2026', category: 'Vaksin', image: 'https://images.unsplash.com/photo-1511174511562-5f7f18b874f8?auto=format&fit=crop&q=80&w=800', content: 'Vaksinasi booster memberikan perlindungan ekstra...' },
  { id: 'a4', title: 'Waspada Gejala Virus Baru dan Cara Mencegah Penularannya', author: 'Tim Epidemiologi', date: '12 Mei 2026', category: 'Virus Terbaru', image: 'https://images.unsplash.com/photo-1584032762282-ec511d72f04e?auto=format&fit=crop&q=80&w=800', content: 'Penyebaran virus baru memerlukan kewaspadaan tinggi...' },
  { id: 'a5', title: 'Pilihan Makanan Tinggi Serat untuk Mengatasi Gerd', author: 'dr. Andi Wijaya', date: '11 Mei 2026', category: 'Gizi', image: 'https://images.unsplash.com/photo-1543332164-6e82f3555182?auto=format&fit=crop&q=80&w=800', content: 'Gerd atau asam lambung dapat dikelola dengan diet tepat...' },
  { id: 'a6', title: 'Dampak Buruk Kurang Tidur Terhadap Kesehatan Mental', author: 'Poli Psikologi', date: '10 Mei 2026', category: 'Gaya Hidup', image: 'https://images.unsplash.com/photo-1541480601022-2308c0f02487?auto=format&fit=crop&q=80&w=800', content: 'Kualitas tidur yang buruk memicu kecemasan...' },
  { id: 'a7', title: 'Cara Membedakan Gejala Flu Biasa dengan Infeksi Virus Akut', author: 'dr. Ahmad Fauzi', date: '09 Mei 2026', category: 'Virus', image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800', content: 'Mengenali perbedaan gejala flu dan infeksi berat...' },
  { id: 'a8', title: 'Manfaat Vaksin PCV untuk Melindungi Paru-Paru Anak', author: 'dr. Maria Santoso', date: '08 Mei 2026', category: 'Vaksin', image: 'https://images.unsplash.com/photo-1584032762282-ec511d72f04e?auto=format&fit=crop&q=80&w=800', content: 'Vaksin PCV sangat disarankan untuk balita...' },
  { id: 'a9', title: 'Pengaturan Pola Makan Rendah Gula bagi Penderita Diabetes', author: 'Tim Diet RS Louis', date: '07 Mei 2026', category: 'Gizi', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800', content: 'Kontrol gula darah dimulai dari manajemen nutrisi...' },
  { id: 'a10', title: 'Olahraga Ringan 15 Menit di Rumah untuk Mencegah Hipertensi', author: 'Poli Jantung', date: '06 Mei 2026', category: 'Gaya Hidup', image: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&q=80&w=800', content: 'Konsistensi lebih penting daripada intensitas...' }
];

export const MEDICINES: Medicine[] = [
  { id: 'm1', name: 'Paracetamol', price: 8500, category: 'Obat Bebas', status: 'Tersedia', needRecipe: false },
  { id: 'm2', name: 'Vitamin C 500mg', price: 15000, category: 'Obat Bebas', status: 'Tersedia', needRecipe: false },
  { id: 'm3', name: 'Antasida Doen', price: 7000, category: 'Obat Bebas', status: 'Tersedia', needRecipe: false },
  { id: 'm4', name: 'Minyak Kayu Putih', price: 22000, category: 'Obat Bebas', status: 'Tersedia', needRecipe: false },
  { id: 'm5', name: 'Bedak Salisilat', price: 12000, category: 'Obat Bebas', status: 'Tersedia', needRecipe: false },
  { id: 'm6', name: 'Cetirizine', price: 18000, category: 'Obat Bebas Terbatas', status: 'Tersedia', needRecipe: false },
  { id: 'm7', name: 'Loperamide', price: 10000, category: 'Obat Bebas Terbatas', status: 'Tersedia', needRecipe: false },
  { id: 'm8', name: 'Ibuprofen 200mg', price: 14000, category: 'Obat Bebas Terbatas', status: 'Tersedia', needRecipe: false },
  { id: 'm9', name: 'Dextromethorphan HBr', price: 11500, category: 'Obat Bebas Terbatas', status: 'Tersedia', needRecipe: false },
  { id: 'm10', name: 'Neozep Forte', price: 9000, category: 'Obat Bebas Terbatas', status: 'Tersedia', needRecipe: false },
  { id: 'm11', name: 'Amoxicillin 500mg', price: 25000, category: 'Obat Keras', status: 'Tersedia', needRecipe: true },
  { id: 'm12', name: 'Metformin 500mg', price: 30000, category: 'Obat Keras', status: 'Tersedia', needRecipe: true },
  { id: 'm13', name: 'Amlodipine 5mg', price: 28000, category: 'Obat Keras', status: 'Tersedia', needRecipe: true },
  { id: 'm14', name: 'Captopril 25mg', price: 20000, category: 'Obat Keras', status: 'Tersedia', needRecipe: true },
  { id: 'm15', name: 'Asam Mefenamat', price: 16500, category: 'Obat Keras', status: 'Tersedia', needRecipe: true },
  { id: 'm16', name: 'Tolak Angin Cair', price: 5000, category: 'Jamu', status: 'Tersedia', needRecipe: false },
  { id: 'm17', name: 'Diapet Kapsul', price: 7500, category: 'Jamu', status: 'Tersedia', needRecipe: false },
  { id: 'm18', name: 'Kiranti Sehat Datang Bulan', price: 9000, category: 'Jamu', status: 'Tersedia', needRecipe: false },
  { id: 'm19', name: 'Kuku Bima Energi', price: 3000, category: 'Jamu', status: 'Tersedia', needRecipe: false },
  { id: 'm20', name: 'Beras Kencur Sido Muncul', price: 4500, category: 'Jamu', status: 'Tersedia', needRecipe: false },
  { id: 'm21', name: 'Stimuno Forte', price: 35000, category: 'Obat Herbal', status: 'Tersedia', needRecipe: false },
  { id: 'm22', name: 'Imboost Force', price: 45000, category: 'Obat Herbal', status: 'Tersedia', needRecipe: false },
  { id: 'm23', name: 'Mastin Ekstrak Kulit Manggis', price: 55000, category: 'Obat Herbal', status: 'Tersedia', needRecipe: false },
  { id: 'm24', name: 'Tensigard', price: 6000, category: 'Obat Herbal', status: 'Tersedia', needRecipe: false },
  { id: 'm25', name: 'Propoelix', price: 120000, category: 'Obat Herbal', status: 'Tersedia', needRecipe: false },
];

export const QUICK_MENU = [
  { id: 'daftar', title: 'Daftar/Antri', icon: 'ClipboardList', page: Page.DIRECTORY },
  { id: 'chat', title: 'Chat Keluhan', icon: 'MessageSquare', page: Page.AI_CHAT },
  { id: 'apotek', title: 'Apotek', icon: 'Pill', page: Page.PHARMACY },
  { id: 'riwayat', title: 'Riwayat Medis', icon: 'History', page: Page.HISTORY }
];
