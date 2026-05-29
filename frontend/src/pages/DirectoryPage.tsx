/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  MapPin, 
  Star, 
  ChevronRight, 
  Filter,
  Stethoscope,
  Calendar,
  ChevronLeft,
  X,
  History,
  GraduationCap,
  Briefcase,
  CheckCircle2 as CheckCircle2Icon
} from 'lucide-react';
import { DOCTORS } from '../constants';
import { Page, Doctor } from '../types';
import { createAppointment } from '../api';

interface DirectoryPageProps {
  onNavigate: (page: Page) => void;
  onShowToast: (message: string, type?: 'success' | 'info') => void;
  onBack: () => void;
  addAppointment: (doctor: { id: string, name: string, specialty: string }, date: string, time: string) => void;
}

export default function DirectoryPage({ onNavigate, onShowToast, onBack, addAppointment }: DirectoryPageProps) {
  const [selectedSpec, setSelectedSpec] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isBooking, setIsBooking] = useState(false);

  const specialties = ['Semua', 'Dokter Umum', 'Spesialis Penyakit Dalam', 'Spesialis Anak', 'Spesialis Bedah Tulang', 'Spesialis Jantung', 'Spesialis Mata'];

  const filteredDoctors = DOCTORS.filter(doc => 
    (selectedSpec === 'Semua' || doc.specialty === selectedSpec) &&
    (doc.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleBookAppointment = async (slot: string) => {
    if (!selectedDoctor) return;
    setIsBooking(true);
    
    try {
      const userStr = localStorage.getItem('user');
      const userId = userStr ? JSON.parse(userStr).id : 'demo-user-001';
      
      const isoDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const [hours, minutes] = slot.split(':');
      isoDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      await createAppointment(userId, selectedDoctor.name, isoDate.toISOString(), "Konsultasi dari Direktori");

      const date = "Besok, 16 Mei 2026";
      addAppointment(
        { id: selectedDoctor.id, name: selectedDoctor.name, specialty: selectedDoctor.specialty },
        date,
        slot
      );

      setSelectedDoctor(null);
      onShowToast("Janji temu disinkronkan ke sistem!", "success");
      onNavigate(Page.HISTORY);
    } catch (err: any) {
      onShowToast(err.message || "Gagal membuat janji temu", "error" as any);
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12 relative lg:static">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 p-3 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all font-bold text-primary group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Kembali
        </button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-4 max-w-xl">
          <h1 className="text-4xl font-bold">Direktori Dokter</h1>
          <p className="text-gray-500">Temukan tenaga medis profesional yang tepat untuk kebutuhan kesehatan Anda.</p>
        </div>
        
        <div className="w-full md:w-96 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Cari nama dokter..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 overflow-x-auto pb-4 no-scrollbar">
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full text-gray-400 font-bold shrink-0">
          <Filter className="w-4 h-4" /> Filter Spesialisasi:
        </div>
        {specialties.map((spec) => (
          <button
            key={spec}
            onClick={() => setSelectedSpec(spec)}
            className={`px-5 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-all border ${
              selectedSpec === spec 
                ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-50'
            }`}
          >
            {spec}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredDoctors.map((doc) => (
          <motion.div 
            layout
            key={doc.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden card-hover group"
          >
            <div className="aspect-[4/3] overflow-hidden relative">
              <img 
                src={doc.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name)}&background=0D8BFF&color=fff`} 
                alt={doc.name} 
                onError={(e) => {
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name)}&background=0D8BFF&color=fff`;
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-xl text-primary font-bold flex items-center gap-1 text-xs">
                <Star className="w-3 h-3 fill-primary" /> 4.9
              </div>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="space-y-1">
                <p className="text-primary font-bold text-xs uppercase tracking-widest leading-none">{doc.specialty}</p>
                <h3 className="text-xl font-bold">{doc.name}</h3>
              </div>

              <div className="space-y-3">
                {doc.qualifications.map((q, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-gray-500 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    <span>{q}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <span className="px-2 py-1 bg-green-50 text-green-700 rounded-lg text-[10px] font-bold border border-green-100">BPJS / Reguler</span>
                <span className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-[10px] font-bold border border-blue-100">
                  <MapPin className="w-3 h-3"/> ± 2.5 km
                </span>
              </div>

              <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Jadwal Terdekat</p>
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                    <Calendar className="w-4 h-4 text-primary" /> Besok, 09:00 WIB
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedDoctor(doc)}
                  className="p-4 bg-secondary text-primary rounded-2xl hover:bg-primary hover:text-white transition-all shadow-sm"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {filteredDoctors.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100">
          <p className="text-gray-400 font-medium">Tidak ada dokter yang sesuai dengan pencarian Anda.</p>
        </div>
      )}

      {/* Doctor Profile Layer */}
      <AnimatePresence>
        {selectedDoctor && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedDoctor(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              layoutId={`doctor-${selectedDoctor.id}`}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
            >
              <button 
                onClick={() => setSelectedDoctor(null)}
                className="absolute top-6 right-6 p-3 bg-white/80 backdrop-blur-md rounded-full text-gray-500 hover:text-gray-900 transition-colors z-20"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="md:w-2/5 relative h-64 md:h-auto">
                <img 
                  src={selectedDoctor.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedDoctor.name)}&background=0D8BFF&color=fff`} 
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedDoctor.name)}&background=0D8BFF&color=fff`;
                  }}
                  className="w-full h-full object-cover" 
                  alt={selectedDoctor.name} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>

              <div className="md:w-3/5 p-8 md:p-12 space-y-8 overflow-y-auto">
                <div className="space-y-2">
                  <p className="text-primary font-bold text-xs uppercase tracking-widest">{selectedDoctor.specialty}</p>
                  <h2 className="text-3xl font-bold">{selectedDoctor.name}</h2>
                  
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-200">Tersedia untuk Pasien BPJS / Reguler</span>
                    <span className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100">
                      <MapPin className="w-3 h-3"/> ± 2.5 km dari lokasi Anda
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-primary shrink-0">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Pengalaman Praktik</p>
                      <p className="font-bold">Durasi Pengalaman Praktik: Lebih dari 10 Tahun</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-primary shrink-0">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Riwayat Pendidikan</p>
                      <ul className="text-sm font-medium text-gray-600 space-y-1 pt-1">
                        {selectedDoctor.qualifications.map((q, i) => (
                          <li key={i} className="flex gap-2"><CheckCircle2Icon className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> {q}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <h3 className="font-bold flex items-center gap-2 underline decoration-primary decoration-4 underline-offset-8 mb-6">Pilih Jadwal Besok:</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {['09:00', '10:30', '13:00', '15:30'].map(slot => (
                      <button 
                        key={slot}
                        onClick={() => handleBookAppointment(slot)}
                        disabled={isBooking}
                        className="p-3 border border-gray-100 rounded-2xl text-xs font-bold hover:bg-primary hover:text-white hover:border-primary transition-all text-center disabled:opacity-50"
                      >
                        {slot} WIB
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    onClick={() => handleBookAppointment('09:00')}
                    disabled={isBooking}
                    className="w-full btn-primary py-4 text-center rounded-2xl font-bold disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isBooking ? 'Memproses...' : 'Pilih Jadwal & Buat Janji'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CheckCircle2({ className, ...props }: any) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className} 
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
