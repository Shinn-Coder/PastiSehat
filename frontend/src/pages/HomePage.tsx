/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { 
  ChevronRight, 
  ClipboardList, 
  MessageSquare, 
  Pill, 
  History as HistoryIcon,
  Star,
  Award,
  Users,
  Stethoscope,
  ArrowRight,
  Tag,
  User
} from 'lucide-react';
import { Page } from '../types';
import { ARTICLES, QUICK_MENU } from '../constants';

interface HomePageProps {
  onNavigate: (page: Page) => void;
  onArticleClick: (id: string) => void;
  onOpenDaftarAntri: () => void;
}

export default function HomePage({ onNavigate, onArticleClick, onOpenDaftarAntri }: HomePageProps) {
  const icons: Record<string, any> = { ClipboardList, MessageSquare, Pill, History: HistoryIcon };

  return (
    <div className="space-y-16">
      {/* Headline / Hero */}
      <section className="relative px-6 md:px-16 pt-12 md:pt-24 pb-16 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 bg-secondary text-primary px-4 py-1.5 rounded-full text-sm font-bold tracking-wide">
              <Star className="w-4 h-4 fill-primary" />
              <span>Layanan Kesehatan #1 di Surabaya</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight">
              Kesehatan Anda, <br />
              <span className="text-primary italic">Prioritas Utama</span> Kami.
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed max-w-lg">
              RS Louis Surabaya menghadirkan PastiSehat. Konsultasi AI, pendaftaran antrean, dan layanan medis profesional dalam satu aplikasi.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => onNavigate(Page.AI_CHAT)}
                className="btn-primary group"
              >
                Tanya Cici Sekarang
                <ChevronRight className="inline-block ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => onNavigate(Page.DIRECTORY)}
                className="px-6 py-3 rounded-xl font-semibold text-gray-700 hover:bg-gray-100 transition-colors border border-gray-200"
              >
                Cari Dokter
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative w-full aspect-square md:aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=1200" 
                alt="Friendly Doctor" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent"></div>
            </div>
            
            {/* Quick Stats Overlays */}
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-xl flex items-center gap-4 border border-gray-100 hidden sm:flex">
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">80+</p>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Dokter Profesional</p>
              </div>
            </div>
            
            <div className="absolute top-12 -right-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-gray-100 hidden sm:flex">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-primary">
                <Award className="w-5 h-5" />
              </div>
              <p className="font-bold text-sm">Terakreditasi Paripurna</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Menu Cards */}
      <section className="px-6 md:px-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {QUICK_MENU.map((item, idx) => {
            const IconComp = icons[item.icon];
            return (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => {
                  if (item.id === 'daftar') onOpenDaftarAntri();
                  else onNavigate(item.page);
                }}
                className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 text-left card-hover group"
              >
                <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  <IconComp className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 group-hover:text-primary transition-colors">Akses Cepat</p>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* Article Carousel */}
      <section className="px-6 md:px-16 py-20 bg-secondary/30 relative">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-end gap-4">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest">
                <Tag className="w-3 h-3" /> Informasi Terkini
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Artikel Kesehatan</h2>
              <p className="text-gray-500 font-medium max-w-md">Edukasi kesehatan terpercaya untuk Anda dan keluarga.</p>
            </div>
            <button 
              onClick={() => onNavigate(Page.ALL_ARTICLES)}
              className="px-8 py-4 bg-white text-primary font-black text-sm uppercase tracking-widest rounded-2xl border-2 border-primary/10 flex items-center gap-2 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-xl shadow-primary/5 group"
            >
              Lihat Semua Artikel 
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-10 snap-x no-scrollbar">
            {ARTICLES.map((article, idx) => (
              <motion.div 
                key={article.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="min-w-[320px] md:min-w-[420px] bg-white rounded-[2.5rem] overflow-hidden shadow-sm card-hover snap-start cursor-pointer group flex flex-col border border-white"
                onClick={() => onArticleClick(article.id)}
              >
                <div className="h-64 overflow-hidden relative">
                  <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-primary shadow-lg">
                    {article.category}
                  </div>
                </div>
                <div className="p-8 md:p-10 space-y-4 flex-grow flex flex-col">
                  <h3 className="font-bold text-2xl leading-snug line-clamp-2 text-primary group-hover:text-blue-700 transition-colors">{article.title}</h3>
                  <div className="flex items-center justify-between text-[10px] text-gray-400 font-black uppercase tracking-widest mt-auto pt-4 border-t border-gray-50">
                    <span className="flex items-center gap-2"><User className="w-3.5 h-3.5" /> {article.author}</span>
                    <span>{article.date}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Hospital News / Prestasi */}
      <section className="px-6 md:px-16 max-w-7xl mx-auto py-16">
        <div className="bg-primary rounded-[3rem] p-8 md:p-16 text-white grid grid-cols-1 lg:grid-cols-2 gap-12 items-center overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          
          <div className="space-y-8 relative z-10 text-center lg:text-left">
            <h2 className="text-4xl md:text-5xl font-bold">Pencapaian Kami Untuk Surabaya</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
                <p className="text-3xl font-bold mb-1">98%</p>
                <p className="text-xs text-white/70 uppercase tracking-widest font-semibold">Tingkat Kesembuhan</p>
              </div>
              <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
                <p className="text-3xl font-bold mb-1">24/7</p>
                <p className="text-xs text-white/70 uppercase tracking-widest font-semibold">Layanan Darurat</p>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              RS Louis Surabaya bangga menjadi pusat rujukan di Jawa Timur dengan tim spesialis yang berdedikasi dan fasilitas medis terkini.
            </p>
          </div>

          <div className="relative">
             <img 
               src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800" 
               alt="Hospital Facility" 
               className="rounded-3xl shadow-2xl rotate-3 scale-105"
             />
          </div>
        </div>
      </section>
    </div>
  );
}
