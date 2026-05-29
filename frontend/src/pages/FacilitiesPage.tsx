/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { 
  HeartPulse, 
  Microscope, 
  Radiation, 
  Navigation as NavigationIcon,
  Clock,
  LayoutGrid,
  ShieldCheck,
  Check,
  ChevronLeft
} from 'lucide-react';

interface FacilitiesPageProps {
  onBack: () => void;
}

export default function FacilitiesPage({ onBack }: FacilitiesPageProps) {
  const medicalServices = [
    { title: 'UGD 24 Jam', desc: 'Siaga melayani kondisi darurat kapan saja dengan tim trauma center terbaik.', icon: HeartPulse, color: 'bg-red-50 text-red-600' },
    { title: 'Laboratorium', desc: 'Pengecekan darah dan sampel medis dengan hasil akurat dan terintegrasi.', icon: Microscope, color: 'bg-blue-50 text-blue-600' },
    { title: 'Radiologi', desc: 'Layanan pencitraan modern pendukung diagnosa yang cepat dan efisien.', icon: Radiation, color: 'bg-purple-50 text-purple-600' },
    { title: 'Poli Rawat Jalan', desc: 'Lebih dari 40 poli spesialis tersedia untuk konsultasi rutin Anda.', icon: NavigationIcon, color: 'bg-green-50 text-green-600' },
  ];

  const roomTypes = [
    { 
      name: 'VVIP (Louis Diamond)', 
      price: 'Rp 2.500.000', 
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800',
      features: ['1 Bed Elektrik', 'Ruang Tamu Terpisah', 'Dapur Kecil', 'Smart TV 55"', 'AC & Wifi']
    },
    { 
      name: 'VIP (Louis Emerald)', 
      price: 'Rp 1.800.000', 
      image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800',
      features: ['1 Bed Elektrik', 'Sofa Bed Keluarga', 'Kabin Kamar Mandi Dalam', 'TV Kabel', 'AC & Wifi']
    },
    { 
      name: 'Kelas 1 (Standard)', 
      price: 'Rp 850.000', 
      image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800',
      features: ['2 Bed Pasien', 'Penyekat Gorden Privasi', 'Kabin Kamar Mandi Dalam', 'AC & Wifi']
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-24">
      <div className="flex mb-4">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 p-3 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all font-bold text-primary group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Kembali
        </button>
      </div>
      <div className="space-y-4 max-w-2xl">
        <h1 className="text-4xl font-bold">Fasilitas & Layanan Medis</h1>
        <p className="text-gray-500 text-lg">RS Louis Surabaya didukung oleh infrastruktur modern dan teknologi terkini untuk menjamin kenyamanan dan keselamatan Anda.</p>
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-200">Melayani Pasien BPJS / Reguler</span>
          <span className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100">
            <NavigationIcon className="w-3 h-3"/> Estimasi Jarak: ± 2.5 km dari lokasi Anda
          </span>
        </div>
      </div>

      {/* Services Grid */}
      <section className="space-y-12">
        <div className="flex items-center gap-4">
          <div className="h-0.5 flex-grow bg-gray-100"></div>
          <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-gray-400">Layanan Unggulan</h2>
          <div className="h-0.5 flex-grow bg-gray-100"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {medicalServices.map((service, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-8 rounded-[2.5rem] bg-white border border-gray-100 card-hover space-y-6"
            >
              <div className={`w-16 h-16 ${service.color} rounded-2xl flex items-center justify-center`}>
                <service.icon className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-lg">{service.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">{service.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Hospital Room Tiers */}
      <section className="space-y-12">
        <div className="flex items-center gap-4">
          <div className="h-0.5 flex-grow bg-gray-100"></div>
          <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-gray-400">Tipe Kamar Rawat Inap</h2>
          <div className="h-0.5 flex-grow bg-gray-100"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {roomTypes.map((room, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white rounded-[3rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="h-64 relative overflow-hidden">
                <img src={room.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={room.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-bold">{room.name}</h3>
                  <p className="text-white/80 font-medium">{room.price} <span className="text-[10px] uppercase font-bold opacity-60">/ Malam</span></p>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Fasilitas Utama:</p>
                <div className="grid grid-cols-1 gap-3">
                  {room.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                      <div className="w-5 h-5 bg-green-50 text-green-600 rounded-full flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                      {feature}
                    </div>
                  ))}
                </div>
                <button className="w-full py-4 bg-gray-50 text-gray-700 font-bold rounded-2xl hover:bg-gray-100 transition-colors">
                  Lihat Rincian Kamar
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Support Info */}
      <section className="bg-secondary/30 rounded-[3rem] p-8 md:p-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center items-center">
        <div className="space-y-2">
          <Clock className="w-10 h-10 text-primary mx-auto" />
          <h4 className="font-bold">Hadir 24/7</h4>
          <p className="text-xs text-gray-500">Layanan medis darurat tersedia sepanjang waktu.</p>
        </div>
        <div className="space-y-2">
          <LayoutGrid className="w-10 h-10 text-primary mx-auto" />
          <h4 className="font-bold">Fasilitas Lengkap</h4>
          <p className="text-xs text-gray-500">Infrastruktur penunjang medis komprehensif.</p>
        </div>
        <div className="space-y-2">
          <ShieldCheck className="w-10 h-10 text-primary mx-auto" />
          <h4 className="font-bold">Bersertifikasi</h4>
          <p className="text-xs text-gray-500">Terakreditasi Paripurna (JCI) Standar Internasional.</p>
        </div>
      </section>
    </div>
  );
}
