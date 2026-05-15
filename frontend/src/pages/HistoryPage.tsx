/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, Component, ErrorInfo, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  MessageSquare, 
  ChevronRight, 
  Filter, 
  MoreVertical, 
  MapPin, 
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  ChevronLeft
} from 'lucide-react';
import { DOCTORS } from '../constants';
import { Appointment, User, MedicalHistoryChat } from '../types';
import { getAppointments } from '../api';
import { useEffect } from 'react';

interface HistoryPageProps {
  user: User | null;
  onBack: () => void;
  appointments: Appointment[];
  chatHistory: MedicalHistoryChat[];
}

class HistoryErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('HistoryPage Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-red-500 mb-2">Terjadi Kesalahan</h2>
          <p className="text-gray-500">Gagal memuat riwayat medis.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

function HistoryPageContent({ user, onBack, appointments: realAppointments, chatHistory }: HistoryPageProps) {
  const [activeTab, setActiveTab] = useState<'appointments' | 'chat'>('appointments');
  const [filter, setFilter] = useState<'Semua' | 'Mendatang' | 'Selesai' | 'Batal'>('Semua');
  const [dbAppointments, setDbAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedChat, setSelectedChat] = useState<MedicalHistoryChat | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    if (user) {
      setLoading(true);
      getAppointments(user.id)
        .then(data => {
          const mapped = data.map((app: any) => ({
            id: app.id,
            doctorId: 'd-auto',
            doctorName: app.doctorName,
            specialty: app.summary || 'Konsultasi Umum',
            date: new Date(app.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
            time: new Date(app.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            status: app.status === 'Scheduled' ? 'Mendatang' : 'Selesai'
          }));
          setDbAppointments(mapped);
        })
        .finally(() => setLoading(false));
    }
  }, [user]);

  const defaultAppointments: Appointment[] = [
    {
      id: 'mock-1',
      doctorId: 'd2',
      doctorName: 'dr. Andi Wijaya',
      specialty: 'Spesialis Penyakit Dalam',
      date: '15 Mei 2026',
      time: '14:00',
      status: 'Selesai'
    },
    {
      id: 'mock-2',
      doctorId: 'd4',
      doctorName: 'dr. Maria Santoso',
      specialty: 'Spesialis Anak',
      date: '10 Mei 2026',
      time: '09:00',
      status: 'Batal'
    }
  ];

  const allAppointments = [...realAppointments, ...dbAppointments, ...defaultAppointments];

  const filteredAppointments = allAppointments.filter(a => filter === 'Semua' || a.status === filter);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
      <div className="flex mb-4">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 p-3 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all font-bold text-primary group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Kembali
        </button>
      </div>
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Riwayat Anda</h1>
        <p className="text-gray-500">Pantau semua jadwal kunjungan dan percakapan medis Anda di sini.</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 p-1.5 rounded-2xl w-full max-w-md">
        <button 
          onClick={() => setActiveTab('appointments')}
          className={`flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'appointments' ? 'bg-white shadow-md text-primary' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Calendar className="w-4 h-4" /> Janji Temu
        </button>
        <button 
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'chat' ? 'bg-white shadow-md text-primary' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <MessageSquare className="w-4 h-4" /> Chat Cici
        </button>
      </div>

      {activeTab === 'appointments' ? (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {['Semua', 'Mendatang', 'Selesai', 'Batal'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${
                  filter === f ? 'bg-primary border-primary text-white' : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-10 font-bold text-gray-400">Memuat data...</div>
            ) : filteredAppointments.length > 0 ? (
              filteredAppointments.map((app) => {
                const doctor = DOCTORS.find(d => d.id === app.doctorId);
                return (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={app.id}
                    onClick={() => setSelectedAppointment(app)}
                    className="bg-white border border-gray-100 rounded-[2rem] p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6 group hover:shadow-lg transition-all cursor-pointer"
                  >
                    <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border-4 border-gray-50 group-hover:border-primary/10 transition-colors">
                      <img src={doctor?.image || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop'} className="w-full h-full object-cover" alt={app.doctorName} />
                    </div>
                    
                    <div className="flex-grow space-y-2">
                      <div className="flex justify-between">
                        <h3 className="font-bold text-lg">{app.doctorName}</h3>
                        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${
                          app.status === 'Mendatang' ? 'bg-blue-50 text-blue-600' :
                          app.status === 'Selesai' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                        }`}>
                          {app.status === 'Mendatang' && <Clock className="w-3 h-3" />}
                          {app.status === 'Selesai' && <CheckCircle2 className="w-3 h-3" />}
                          {app.status === 'Batal' && <XCircle className="w-3 h-3" />}
                          {app.status}
                        </div>
                      </div>
                      <p className="text-sm text-primary font-bold">{app.specialty}</p>
                      
                      <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-xs text-gray-500 font-medium">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" /> {app.date}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" /> {app.time} WIB
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" /> Poli Terkait, Lantai 2
                        </div>
                      </div>
                    </div>

                    <div className="flex md:flex-col gap-2 w-full md:w-auto">
                      <ChevronRight className="w-6 h-6 text-gray-300 group-hover:text-primary transition-colors hidden md:block" />
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100">
                <p className="text-gray-400 font-medium">Belum ada riwayat janji temu atau obrolan.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {chatHistory.length > 0 ? chatHistory.map((chat) => (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              key={chat.id} 
              onClick={() => setSelectedChat(chat)}
              className="bg-white border border-gray-100 p-6 rounded-3xl flex items-center justify-between group hover:border-primary transition-all cursor-pointer shadow-sm hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Konsultasi Medis (Cici AI)</h3>
                  <p className="text-xs text-gray-400 mb-1">{chat.date}</p>
                  <p className="text-sm text-gray-500 line-clamp-1">{chat.summary.substring(0, 50)}...</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
            </motion.div>
          )) : (
            <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100">
              <p className="text-gray-400 font-medium">Belum ada riwayat janji temu atau obrolan.</p>
            </div>
          )}
        </div>
      )}

      {/* Chat Summary Modal */}
      <AnimatePresence>
        {selectedChat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedChat(null)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-[2rem] w-full max-w-md p-8 relative shadow-2xl"
            >
              <button
                onClick={() => setSelectedChat(null)}
                className="absolute right-6 top-6 p-2 bg-gray-50 text-gray-400 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
              
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Ringkasan Medis</h2>
                  <p className="text-sm text-gray-500">{selectedChat.date}</p>
                </div>
              </div>
              
              <div className="prose prose-sm text-gray-700 whitespace-pre-wrap max-h-[60vh] overflow-y-auto">
                {selectedChat.summary}
              </div>
              
              <button
                onClick={() => setSelectedChat(null)}
                className="w-full mt-8 py-3 bg-gray-100 font-bold rounded-xl text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Tutup Ringkasan
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Appointment Detail Modal */}
      <AnimatePresence>
        {selectedAppointment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedAppointment(null)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-[2rem] w-full max-w-md p-8 relative shadow-2xl"
            >
              <button
                onClick={() => setSelectedAppointment(null)}
                className="absolute right-6 top-6 p-2 bg-gray-50 text-gray-400 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
              
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Janji Temu {selectedAppointment.status}</h2>
                  <p className="text-sm text-gray-500">{selectedAppointment.date} - {selectedAppointment.time} WIB</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Dokter</p>
                  <p className="font-bold text-lg">{selectedAppointment.doctorName}</p>
                  <p className="text-sm text-primary font-bold">{selectedAppointment.specialty}</p>
                </div>
                <div className="p-4 rounded-xl bg-blue-50 text-blue-700 text-sm font-medium">
                  {selectedAppointment.status === 'Mendatang' && "Mohon datang 15 menit sebelum jadwal dan bawa KTP/Kartu Pasien."}
                  {selectedAppointment.status === 'Selesai' && "Sesi telah berakhir. Catatan medis telah dikirim ke profil Anda."}
                  {selectedAppointment.status === 'Batal' && "Jadwal ini telah dibatalkan. Silakan buat janji temu ulang jika masih memerlukan konsultasi."}
                </div>
              </div>
              
              <button
                onClick={() => setSelectedAppointment(null)}
                className="w-full py-3 bg-gray-100 font-bold rounded-xl text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Tutup
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function HistoryPage(props: HistoryPageProps) {
  return (
    <HistoryErrorBoundary>
      <HistoryPageContent {...props} />
    </HistoryErrorBoundary>
  );
}
