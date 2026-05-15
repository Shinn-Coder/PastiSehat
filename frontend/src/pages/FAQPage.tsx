/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronDown, 
  HelpCircle, 
  ShieldCheck, 
  Info,
  CheckCircle2,
  FileText,
  ChevronLeft
} from 'lucide-react';

interface FAQPageProps {
  onBack: () => void;
}

export default function FAQPage({ onBack }: FAQPageProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    { 
      q: 'Bagaimana cara menggunakan BPJS di RS Louis?', 
      a: 'Pastikan Anda membawa surat rujukan dari Faskes Tingkat 1 dan Kartu BPJS aktif. Pendaftaran dapat dilakukan langsung melalui aplikasi PastiSehat ini di menu "Daftar".' 
    },
    { 
      q: 'Apakah pendaftaran online harus dilakukan jauh hari?', 
      a: 'Pendaftaran online dapat dilakukan maksimal H-7 hingga H-1 sebelum jadwal dokter yang dipilih untuk memastikan ketersediaan kuota.' 
    },
    { 
      q: 'Bagaimana alur pengambilan obat dari fitur Apotek?', 
      a: 'Anda bisa memilih "Ambil di RS" untuk datang langsung ke loket farmasi tanpa antre, atau "Diantar ke Rumah" menggunakan layanan kurir instan kami.' 
    },
    { 
      q: 'Apakah diagnosa Cici AI bersifat final?', 
      a: 'Tidak. Diagnosa Cici AI hanyalah bantuan awal (pre-diagnosis) untuk memberikan gambaran kondisi. Anda tetap disarankan berkonsultasi dengan dokter spesialis.' 
    }
  ];

  const insuranceLogos = [
    { name: 'Prudential', color: 'bg-red-50 text-red-600' },
    { name: 'Manulife', color: 'bg-green-50 text-green-600' },
    { name: 'Allianz', color: 'bg-blue-50 text-blue-600' },
    { name: 'AIA', color: 'bg-red-50 text-red-700' },
    { name: 'AXA', color: 'bg-blue-100 text-blue-800' },
    { name: 'Sequis', color: 'bg-blue-50 text-blue-500' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-24">
      <div className="flex mb-4">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 p-3 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all font-bold text-primary group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Kembali
        </button>
      </div>
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Bantuan & Informasi</h1>
        <p className="text-gray-500">Semua yang perlu Anda ketahui tentang layanan RS Louis dan mitra asuransi kami.</p>
      </div>

      {/* Accordion FAQ */}
      <section className="space-y-8">
        <div className="flex items-center gap-4 mb-4">
          <HelpCircle className="w-8 h-8 text-primary" />
          <h2 className="text-2xl font-bold">Tanya Jawab (FAQ)</h2>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-sm">
              <button 
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full p-6 md:p-8 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-bold text-gray-800">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${openIndex === idx ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-8 pt-0 text-gray-500 leading-relaxed font-medium">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* BPJS Info */}
      <section className="bg-primary rounded-[3rem] p-8 md:p-16 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">
              Layanan Publik
            </div>
            <h2 className="text-4xl md:text-5xl font-bold">Panduan BPJS Kesehatan</h2>
            <p className="text-white/70 leading-relaxed">
              RS Louis Surabaya mendukung penuh program JKN-KIS. Kami menyediakan alur pendaftaran khusus pasien BPJS agar tetap nyaman dan cepat.
            </p>
            <ul className="space-y-4">
              {[
                'Surat Rujukan Faskes 1 (Asli & Fotokopi)',
                'Kartu BPJS/JKN Digital aktif',
                'KTP / Kartu Identitas Pasien',
                'Pendaftaran Online minimal H-1'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-medium">
                  <CheckCircle2 className="w-5 h-5 text-green-400" /> {item}
                </li>
              ))}
            </ul>
            <button className="bg-white text-primary font-bold px-8 py-4 rounded-2xl hover:bg-white/90 transition-all flex items-center gap-2">
              <FileText className="w-5 h-5" /> Download Panduan Lengkap
            </button>
          </div>
          <div className="hidden lg:block bg-white/10 rounded-[3rem] p-10 backdrop-blur-sm border border-white/10">
            <div className="space-y-6">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary mb-6">
                <Info className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold">Catatan Penting</h3>
              <p className="text-sm text-white/60 leading-relaxed italic">
                "Pastikan nomor rujukan Anda masih berlaku (biasanya 3 bulan sejak diterbitkan) untuk menghindari kendala saat pendaftaran di loket."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Insurance Partners */}
      <section className="space-y-12 text-center">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold">Mitra Asuransi</h2>
          <p className="text-gray-500">Kami bekerja sama dengan berbagai penyedia asuransi nasional dan internasional.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {insuranceLogos.map((ins, i) => (
            <div 
              key={i} 
              className={`p-6 rounded-3xl border border-gray-100 flex items-center justify-center font-black text-xl tracking-tighter transition-all hover:scale-105 hover:shadow-md cursor-default select-none ${ins.color}`}
            >
              {ins.name}
            </div>
          ))}
        </div>
        
        <div className="pt-8">
          <button className="text-primary font-bold hover:underline underline-offset-8">
            Lihat Semua 50+ Mitra Asuransi <ChevronDown className="inline-block w-4 h-4 ml-1" />
          </button>
        </div>
      </section>
    </div>
  );
}
