import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Bell, 
  Lock, 
  Languages, 
  Smartphone, 
  ShieldCheck, 
  ChevronRight,
  Sun,
  Moon,
  Monitor,
  Eye,
  Camera,
  Mic,
  MessageCircle,
  Key
} from 'lucide-react';
import { Page, AccessibilityState } from '../types';

interface SettingsPageProps {
  access: AccessibilityState;
  onUpdateAccess: (access: AccessibilityState) => void;
  onBack: () => void;
  onShowToast: (message: string, type?: 'success' | 'info') => void;
}

export default function SettingsPage({ access, onUpdateAccess, onBack, onShowToast }: SettingsPageProps) {
  const [notifWeb, setNotifWeb] = useState(true);
  const [notifWA, setNotifWA] = useState(false);
  const [hideMedical, setHideMedical] = useState(false);
  const [lang, setLang] = useState('Indonesian');

  const themes = [
    { id: 'light', label: 'Mode Terang', icon: Sun },
    { id: 'dark', label: 'Mode Gelap', icon: Moon },
    { id: 'system', label: 'Ikuti Sistem', icon: Monitor },
  ];

  const handleThemeChange = (themeId: 'light' | 'dark' | 'system') => {
    onUpdateAccess({ ...access, theme: themeId });
    onShowToast(`Tema diubah ke ${themeId === 'light' ? 'Mode Terang' : themeId === 'dark' ? 'Mode Gelap' : 'Ikuti Sistem'}.`, 'info');
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-12 pb-32">
      <div className="flex items-center gap-6">
        <button 
          onClick={onBack}
          className="p-3 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
          id="back-button"
        >
          <ArrowLeft className="w-5 h-5 dark:text-slate-200" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-primary dark:text-white">Pengaturan</h1>
          <p className="text-gray-500 dark:text-slate-400 font-medium">Personalisasi pengalaman PastiSehat Anda.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Notifikasi */}
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 p-8 md:p-10 shadow-sm space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-secondary/50 dark:bg-slate-700 rounded-2xl flex items-center justify-center text-primary dark:text-white">
              <Bell className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold dark:text-white">Notifikasi Pengingat</h2>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold dark:text-white">Notifikasi Aplikasi</p>
                <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">Terima pengingat janji temu di aplikasi.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={notifWeb} onChange={() => setNotifWeb(!notifWeb)} className="sr-only peer" />
                <div className="w-14 h-8 bg-gray-200 dark:bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold dark:text-white">Notifikasi WhatsApp</p>
                <p className="text-sm text-gray-500 dark:text-slate-400 font-medium text-balance">Kirim pengingat otomatis ke nomor WhatsApp Anda.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={notifWA} onChange={() => setNotifWA(!notifWA)} className="sr-only peer" />
                <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Privasi & Keamanan */}
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 p-8 md:p-10 shadow-sm space-y-8 text-balance">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-secondary/50 dark:bg-slate-700 rounded-2xl flex items-center justify-center text-primary dark:text-white">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold dark:text-white">Privasi & Keamanan</h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-50 dark:bg-slate-900 rounded-xl flex items-center justify-center text-gray-400 dark:text-slate-500">
                    <Eye className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-sm dark:text-white">Sembunyikan Rekam Medis</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">Data medis tidak tampil di dashboard utama.</p>
                  </div>
               </div>
               <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={hideMedical} onChange={() => setHideMedical(!hideMedical)} className="sr-only peer" />
                <div className="w-12 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="pt-4 space-y-4">
              <button className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-all font-bold text-sm dark:text-white">
                <div className="flex items-center gap-4">
                  <Camera className="w-5 h-5 text-gray-400 dark:text-slate-500" /> Izin Akses Kamera
                </div>
                <span className="text-primary dark:text-blue-400">Aktif</span>
              </button>
              <button className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-900 rounded-2xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-all font-bold text-sm dark:text-white">
                <div className="flex items-center gap-4">
                  <Mic className="w-5 h-5 text-gray-400 dark:text-slate-500" /> Izin Akses Mikrofon
                </div>
                <span className="text-primary dark:text-blue-400">Aktif</span>
              </button>
              <button className="w-full flex items-center justify-between p-4 bg-gray-100 dark:bg-slate-700 rounded-2xl hover:bg-gray-200 dark:hover:bg-slate-600 transition-all font-bold text-sm text-primary dark:text-white">
                <div className="flex items-center gap-4 text-gray-600 dark:text-slate-300">
                  <Key className="w-5 h-5 text-gray-400 dark:text-slate-500" /> Ubah Kata Sandi
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Preferensi Tampilan & Bahasa */}
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 p-8 md:p-10 shadow-sm space-y-8">
           <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-secondary/50 dark:bg-slate-700 rounded-2xl flex items-center justify-center text-primary dark:text-white">
              <Monitor className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold dark:text-white">Tampilan & Bahasa</h2>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tema Aplikasi</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleThemeChange(t.id as any)}
                    className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all font-bold text-sm ${
                      access.theme === t.id 
                        ? 'border-primary bg-secondary/30 dark:bg-slate-700 text-primary dark:text-white' 
                        : 'border-transparent bg-gray-50 dark:bg-slate-900 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-300'
                    }`}
                  >
                    <t.icon className="w-5 h-5" /> {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Bahasa</p>
              <div className="relative">
                <Languages className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select 
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-slate-900 dark:text-white rounded-2xl outline-none font-bold text-sm appearance-none border-2 border-transparent focus:border-primary/20"
                >
                  <option value="Indonesian">Bahasa Indonesia</option>
                  <option value="English">English (Coming Soon)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
