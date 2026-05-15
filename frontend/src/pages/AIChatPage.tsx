/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mic,
  Image as ImageIcon,
  Send,
  MoreVertical,
  HeartPulse,
  Stethoscope,
  Calendar,
  AlertTriangle,
  User as UserIcon,
  Bot,
  Plus,
  Camera,
  ChevronLeft,
  X,
  RefreshCw,
  SwitchCamera
} from 'lucide-react';
import { Page, ChatMessage, User } from '../types';
import { DOCTORS } from '../constants';
import { sendMessage, getDoctors, summarizeChat } from '../api';

interface AIChatPageProps {
  user: User | null;
  onNavigate: (page: Page) => void;
  onShowToast?: (message: string, type?: 'success' | 'info' | 'error' | 'warning') => void;
  addAppointment: (doctor: { id: string, name: string, specialty: string }, date: string, time: string) => void;
  onSaveChat: (summary: string) => void;
}

export default function AIChatPage({ user, onNavigate, onShowToast, addAppointment, onSaveChat }: AIChatPageProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'ai', text: 'Halo! Saya Cici, asisten AI pribadi Anda. Ada keluhan yang ingin dikonsultasikan hari ini?', timestamp: new Date() }
  ]);
  const [inputText, setInputText] = useState('');
  const [state, setState] = useState<'chatting' | 'suggesting_appointment' | 'showing_schedule' | 'confirmed' | 'disclaimer'>('chatting');
  const [availableDoctors, setAvailableDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [stagedMedia, setStagedMedia] = useState<{file: File, type: 'image' | 'audio', url: string} | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [capturedPhoto, setCapturedPhoto] = useState<{blob: Blob, url: string} | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    // chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const addAiMessage = (text: string) => {
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'ai', text, timestamp: new Date() }]);
  };

  const startCameraStream = async () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode } });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      if (onShowToast) onShowToast("Gagal mengakses kamera", "error");
      setShowCamera(false);
    }
  };

  useEffect(() => {
    if (showCamera && !capturedPhoto) {
      startCameraStream();
    }
  }, [showCamera, facingMode, capturedPhoto]);

  const handleSend = async (textOverride?: string) => {
    const text = textOverride || inputText;
    const media = stagedMedia;
    
    if (!text.trim() && !media) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: text || (media ? `[Mengirim ${media.type === 'image' ? 'foto' : 'rekaman suara'}]` : ''),
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    if (!textOverride) setInputText('');
    setStagedMedia(null);

    setLoading(true);
    try {
      const history = messages.map(m => ({ role: m.sender === 'ai' ? 'model' : 'user', content: m.text }));
      const response = await sendMessage(text, user?.id || 'demo-user-001', history, media?.file);

      addAiMessage(response.reply);

      if (response.reply.includes('apakah Anda ingin membuat jadwal janji temu dengan dokter spesialis terkait?')) {
        setState('suggesting_appointment');
      }

      if (response.appointmentCreated && response.appointmentData) {
        const { doctorName, specialization, date } = response.appointmentData;
        const formattedDate = new Date(date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        const time = new Date(date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

        addAppointment({ id: 'd-auto', name: doctorName, specialty: specialization }, formattedDate, time);
        if (onShowToast) onShowToast("Janji temu otomatis dibuat oleh Cici!", "success");
      }
    } catch (err: any) {
      addAiMessage("Maaf, saya sedang mengalami gangguan koneksi. Mohon coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setStagedMedia({ file, type: 'image', url: URL.createObjectURL(file) });
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/ogg';
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        const ext = mimeType.split('/')[1] || 'webm';
        const file = new File([blob], `recording.${ext}`, { type: mimeType });
        setStagedMedia({ file, type: 'audio', url: URL.createObjectURL(blob) });
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      if (onShowToast) onShowToast("Mulai merekam... Silakan bersuara atau batuk untuk diidentifikasi.", "info");
    } catch (err) {
      if (onShowToast) onShowToast("Gagal mengakses mikrofon", "error");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const openCamera = () => {
    setCapturedPhoto(null);
    setShowCamera(true);
  };

  const closeCamera = () => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    setShowCamera(false);
    setCapturedPhoto(null);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(videoRef.current, 0, 0);
      
      canvas.toBlob((blob) => {
        if (blob) {
          setCapturedPhoto({ blob, url: URL.createObjectURL(blob) });
          streamRef.current?.getTracks().forEach(track => track.stop());
        }
      }, 'image/jpeg');
    }
  };

  const confirmPhoto = () => {
    if (capturedPhoto) {
      const file = new File([capturedPhoto.blob], "camera_capture.jpg", { type: "image/jpeg" });
      setStagedMedia({ file, type: 'image', url: capturedPhoto.url });
      setShowCamera(false);
      setCapturedPhoto(null);
    }
  };

  const handleAiDecision = async (wantsAppointment: boolean) => {
    if (wantsAppointment) {
      try {
        const docs = await getDoctors();
        setAvailableDoctors(docs);
        addAiMessage('Tentu, ini adalah jadwal dokter yang tersedia untuk besok. Silakan pilih jam kunjungan Anda:');
        setState('showing_schedule');
      } catch (err) {
        addAiMessage('Maaf, saya tidak dapat memuat jadwal dokter saat ini.');
      }
    } else {
      addAiMessage('Baiklah, saya mengerti. Untuk penanganan mandiri sementara, Anda disarankan: 1. Hindari makanan asam & pedas, 2. Atur pola tidur minimal 7 jam, 3. Perbanyak konsumsi Pepaya atau Pisang untuk pencernaan, 4. Minum vitamin B-Complex jika merasa lemas.');
      setTimeout(() => {
        addAiMessage('Penting: Saran ini hanyalah rekomendasi awal berbasis AI dan bukan diagnosa medis final. Jika nyeri berlanjut atau memburuk, segera kunjungi UGD.');
        setTimeout(() => {
          addAiMessage('Apakah ada hal lain yang ingin Anda tanyakan atau Anda ingin berbicara langsung dengan petugas layanan kami?');
          setState('disclaimer');
          handleEndChat();
        }, 1500);
      }, 2000);
    }
  };

  const handleEndChat = async () => {
    try {
      const history = messages.map(m => ({ role: m.sender === 'ai' ? 'model' : 'user', content: m.text }));
      const summary = await summarizeChat(history);
      onSaveChat(summary);
    } catch (e) {
      console.error(e);
    }
  };

  const handleConfirmSchedule = (slot: string, doctor: any) => {
    const date = "Besok, 16 Mei 2026";
    addAiMessage(`Jadwal diterima untuk pukul ${slot}. Sistem kami telah menyinkronkan data ini ke Profil dan Riwayat Anda. Notifikasi pengingat juga telah dijadwalkan. Lekas sembuh!`);
    setState('confirmed');

    // Global State Sync
    addAppointment({ id: doctor.id, name: doctor.name, specialty: doctor.specialty }, date, slot);
    if (onShowToast) onShowToast("Janji temu dikonfirmasi & disinkronkan!", "success");
    handleEndChat();
  };

  const simulateAction = (type: string) => {
    if (onShowToast) onShowToast(`Membuka ${type}...`, 'info');
    setTimeout(() => {
      handleSend(`[Mengirim ${type} keluhan...]`);
    }, 1000);
  };

  const renderFormattedText = (text: string) => {
    return text.split('\n').map((line, idx) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const lineContent = parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>;
        }
        return <span key={i}>{part}</span>;
      });

      const trimmed = line.trim();
      if (trimmed.startsWith('- ')) {
        return <li key={idx} className="ml-4 list-disc my-1">{trimmed.substring(2)}</li>;
      }
      return <p key={idx} className={`mb-2 last:mb-0 ${trimmed === '' ? 'h-2' : ''}`}>{lineContent}</p>;
    });
  };

  return (
    <div className="max-w-4xl mx-auto h-[80vh] flex flex-col bg-white overflow-hidden md:border border-gray-100 md:rounded-[3rem] md:my-8 shadow-2xl relative">
      <div className="absolute top-20 left-6 z-20 md:hidden">
        <button onClick={() => onNavigate(Page.HOME)} className="p-2 bg-white/80 backdrop-blur-md rounded-full shadow-lg"><ChevronLeft /></button>
      </div>

      {/* Header */}
      <div className="p-6 bg-white border-b border-gray-100 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate(Page.HOME)} className="hidden md:block p-2 hover:bg-gray-100 rounded-full transition-colors mr-1">
            <ChevronLeft className="w-5 h-5 text-gray-500" />
          </button>
          <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center text-primary relative">
            <Bot className="w-6 h-6" />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-4 border-white rounded-full"></div>
          </div>
          <div>
            <h2 className="font-bold">Cici (Asisten AI)</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Siap Melayani 24/7</p>
          </div>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-full text-xs font-bold hover:bg-red-100 transition-colors"
          onClick={() => onShowToast && onShowToast("Menghubungkan ke Admin Manusia...", "info")}
        >
          <AlertTriangle className="w-4 h-4" /> Kondisi Kritis?
        </button>
      </div>

      {/* Messages */}
      <div className="flex-grow overflow-y-auto p-6 space-y-6 bg-gray-50/30">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-primary text-white' : 'bg-secondary text-primary'
                  }`}>
                  {msg.sender === 'user' ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.sender === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                  }`}>
                  {msg.sender === 'ai' ? renderFormattedText(msg.text) : msg.text}
                </div>
              </div>
            </motion.div>
          ))}
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="flex gap-3 items-center">
                <div className="w-8 h-8 bg-secondary rounded-xl flex items-center justify-center text-primary">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-4 bg-white rounded-2xl rounded-tl-none border border-gray-100 flex gap-1">
                  <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {state === 'suggesting_appointment' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center gap-3">
            <button
              onClick={() => {
                setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', text: 'Iya, saya mau.', timestamp: new Date() }]);
                handleAiDecision(true);
              }}
              className="px-6 py-3 bg-primary text-white rounded-2xl font-bold text-xs shadow-lg shadow-primary/20"
            >
              Iya, Saya Mau
            </button>
            <button
              onClick={() => {
                setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', text: 'Tidak sekarang.', timestamp: new Date() }]);
                handleAiDecision(false);
              }}
              className="px-6 py-3 bg-white border border-gray-100 text-gray-600 rounded-2xl font-bold text-xs hover:bg-gray-50"
            >
              Tidak Sekarang
            </button>
          </motion.div>
        )}

        {state === 'showing_schedule' && availableDoctors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-[2rem] border border-primary/20 shadow-xl space-y-4 max-w-sm ml-11"
          >
            <div className="flex items-center gap-3 mb-4">
              <img src={availableDoctors[0].image} className="w-12 h-12 rounded-full object-cover border-2 border-primary/10" alt="Doctor" />
              <div>
                <p className="font-bold text-sm tracking-tight">{availableDoctors[0].name}</p>
                <p className="text-[10px] text-primary font-bold uppercase tracking-wider">{availableDoctors[0].specialty}</p>
              </div>
            </div>

            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Pilih Jam (Besok, 16 Mei):</p>
            <div className="grid grid-cols-2 gap-2">
              {['09:00', '10:30', '13:00', '15:30'].map(slot => (
                <button
                  key={slot}
                  onClick={() => handleConfirmSchedule(slot, availableDoctors[0])}
                  className="p-3 border border-gray-100 rounded-2xl text-xs font-bold hover:bg-secondary hover:border-primary/20 hover:text-primary transition-all"
                >
                  {slot} WIB
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {state === 'disclaimer' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4 pt-4">
            <button
              onClick={() => onShowToast && onShowToast("Menghubungkan ke Admin Layanan...", "info")}
              className="w-full max-w-xs px-6 py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-primary/20"
            >
              <UserIcon className="w-5 h-5" /> Bicara dengan Manusia
            </button>
            <button
              onClick={() => onNavigate(Page.HOME)}
              className="text-gray-400 font-bold text-sm hover:text-primary transition-colors"
            >
              Kembali ke Beranda
            </button>
          </motion.div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 md:p-6 bg-white border-t border-gray-100 flex flex-col gap-3">
        {/* Staging Area */}
        {stagedMedia && (
          <div className="flex items-center gap-3 p-2 bg-gray-50 border border-gray-200 rounded-2xl w-max relative pr-10">
            {stagedMedia.type === 'image' ? (
              <img src={stagedMedia.url} alt="Staged" className="w-16 h-16 object-cover rounded-xl" />
            ) : (
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex flex-col items-center justify-center text-primary">
                <Mic className="w-6 h-6 mb-1" />
                <span className="text-[8px] font-bold uppercase">Audio</span>
              </div>
            )}
            <div className="text-sm font-medium text-gray-700 max-w-[150px] truncate">
              {stagedMedia.file.name}
            </div>
            <button 
              onClick={() => setStagedMedia(null)}
              className="absolute right-2 top-2 p-1 bg-white rounded-full shadow-sm text-red-500 hover:bg-red-50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileUpload}
        />
        
        <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-2xl focus-within:ring-2 focus-within:ring-primary/20 transition-all">
          <div className="flex items-center">
            <button
              onClick={openCamera}
              className="p-3 text-gray-400 hover:text-primary transition-colors"
              title="Kamera"
            >
              <Camera className="w-5 h-5" />
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-3 text-gray-400 hover:text-primary transition-colors"
              title="Galeri"
            >
              <ImageIcon className="w-5 h-5" />
            </button>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
            }}
            rows={1}
            placeholder={isRecording ? "Sedang mendengarkan..." : "Tulis keluhan kesehatan Anda..."}
            className="flex-grow bg-transparent border-none outline-none px-2 py-2 text-sm font-medium resize-none overflow-y-auto min-h-[40px] max-h-[120px]"
          />
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`p-3 transition-colors ${isRecording ? 'text-red-500 animate-pulse' : 'text-gray-400 hover:text-primary'}`}
            title="Rekam Suara"
          >
            <Mic className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleSend()}
            disabled={!inputText.trim() && !stagedMedia}
            className={`p-3 rounded-xl transition-all ${inputText.trim() || stagedMedia ? 'bg-primary text-white scale-110' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-[10px] text-gray-400 text-center mt-3 font-medium italic">
          PastiSehat AI memberikan saran berdasarkan pola keluhan Anda. Selalu konsultasikan dengan dokter.
        </p>
      </div>

      {/* Camera Modal */}
      {createPortal(
        <AnimatePresence>
          {showCamera && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center"
            >
              <div className="relative w-full max-w-2xl h-full flex flex-col bg-black">
                {capturedPhoto ? (
                  <img src={capturedPhoto.url} className="w-full h-full object-contain" alt="Captured" />
                ) : (
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className="w-full h-full object-cover"
                  />
                )}
                
                <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
                  <button onClick={closeCamera} className="p-3 bg-black/50 text-white rounded-full backdrop-blur-md">
                    <X className="w-6 h-6" />
                  </button>
                  {!capturedPhoto && (
                    <button onClick={() => setFacingMode(prev => prev === 'user' ? 'environment' : 'user')} className="p-3 bg-black/50 text-white rounded-full backdrop-blur-md">
                      <SwitchCamera className="w-6 h-6" />
                    </button>
                  )}
                </div>

                <div className="absolute bottom-10 left-0 right-0 flex justify-center items-center gap-10">
                  {capturedPhoto ? (
                    <div className="flex gap-6">
                      <button 
                        onClick={() => setCapturedPhoto(null)}
                        className="px-6 py-3 bg-white/20 backdrop-blur-md text-white font-bold rounded-full flex items-center gap-2 transition-all hover:bg-white/30"
                      >
                        <RefreshCw className="w-5 h-5" /> Ulangi
                      </button>
                      <button 
                        onClick={confirmPhoto}
                        className="px-6 py-3 bg-primary text-white font-bold rounded-full shadow-lg transition-all hover:scale-105 active:scale-95"
                      >
                        Gunakan Foto
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={capturePhoto}
                      className="w-20 h-20 bg-white rounded-full border-8 border-white/30 flex items-center justify-center shadow-2xl scale-110 active:scale-95 transition-transform"
                    >
                      <div className="w-full h-full rounded-full border-2 border-primary" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
