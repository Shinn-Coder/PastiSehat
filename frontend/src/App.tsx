/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Bell, 
  User as UserIcon, 
  PhoneCall, 
  Menu, 
  X,
  Accessibility,
  Eye,
  Type,
  ArrowRight,
  LogOut,
  Settings,
  ChevronRight,
  Plus,
  ArrowLeft,
  AlertTriangle,
  Stethoscope,
  MessageCircle,
  CheckCircle2,
  Info as InfoIcon,
  XCircle,
  Home,
  MessageSquare,
  History,
  Pill
} from 'lucide-react';

import { Page, User, AccessibilityState, Toast as ToastType, Notification, Appointment } from './types';
import { DOCTORS, ARTICLES, QUICK_MENU } from './constants';

// Page Components
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import HistoryPage from './pages/HistoryPage';
import AIChatPage from './pages/AIChatPage';
import PharmacyPage from './pages/PharmacyPage';
import DirectoryPage from './pages/DirectoryPage';
import FacilitiesPage from './pages/FacilitiesPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import FAQPage from './pages/FAQPage';
import NotificationPage from './pages/NotificationPage';
import AllArticlesPage from './pages/AllArticlesPage';
import SettingsPage from './pages/SettingsPage';

function LockIcon({ className }: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>(Page.HOME);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [access, setAccess] = useState<AccessibilityState>({
    highContrast: false,
    fontSize: 'normal',
    theme: 'light'
  });
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [globalSearch, setGlobalSearch] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [toasts, setToasts] = useState<ToastType[]>([]);
  const [showEmergency, setShowEmergency] = useState(false);
  const [showAuthWarning, setShowAuthWarning] = useState(false);
  const [showDaftarAntri, setShowDaftarAntri] = useState(false);
  
  // Real-time Synchronized State
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [medicalChatHistory, setMedicalChatHistory] = useState<any[]>([]);

  const addNotification = (title: string, message: string, category: Notification['category']) => {
    const newNotif: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      message,
      category,
      timestamp: new Date(),
      isRead: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const addAppointment = (doctor: { id: string, name: string, specialty: string }, date: string, time: string) => {
    const newAppointment: Appointment = {
      id: Math.random().toString(36).substr(2, 9),
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      date,
      time,
      status: 'Mendatang'
    };
    setAppointments(prev => [newAppointment, ...prev]);
    
    // Sync Notification
    addNotification(
      "Janji temu dikonfirmasi", 
      `Anda dijadwalkan bertemu dengan ${doctor.name} pada hari ${date} jam ${time}. Mohon datang 15 menit sebelum jadwal.`,
      'Transaksi'
    );
    
    // Sync Reminder (Simulated for tomorrow)
    setTimeout(() => {
      addNotification(
        "Reminder",
        `Besok adalah jadwal janji temu Anda di Poliklinik RS Louis Surabaya. Siapkan berkas digital Anda.`,
        'Pengingat'
      );
    }, 5000);
  };

  const showToast = (message: string, type: ToastType['type'] = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const handleSaveChat = (summary: string) => {
    const newChat = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
      summary
    };
    setMedicalChatHistory(prev => [newChat, ...prev]);
  };

  // Apply accessibility classes & theme to body
  useEffect(() => {
    const root = window.document.documentElement;
    const isDark = access.theme === 'dark' || (access.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    document.body.className = `${access.highContrast ? 'high-contrast' : ''} ${access.fontSize === 'large' ? 'font-large' : ''}`;
  }, [access]);

  // Persistence
  useEffect(() => {
    const storedUser = localStorage.getItem('pastisehat_user');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (_) {
        localStorage.removeItem('pastisehat_user');
      }
    }
  }, []);

  const searchFeatures = [
    { label: 'Cari Dokter & Spesialis', page: Page.DIRECTORY, icon: Stethoscope },
    { label: 'Apotek & Obat', page: Page.PHARMACY, icon: Pill },
    { label: 'Chat Keluhan dengan Cici', page: Page.AI_CHAT, icon: MessageCircle },
    { label: 'Riwayat Medis', page: Page.HISTORY, icon: History },
    { label: 'Artikel Kesehatan', page: Page.ALL_ARTICLES, icon: InfoIcon },
    { label: 'Fasilitas RS', page: Page.FACILITIES, icon: Home },
    { label: 'Profil Saya', page: Page.DASHBOARD, icon: UserIcon },
    { label: 'Pengaturan', page: Page.SETTINGS, icon: Settings },
  ];

  const filteredFeatures = globalSearch ? searchFeatures.filter(f => f.label.toLowerCase().includes(globalSearch.toLowerCase())) : searchFeatures;

  const handleGlobalSearch = (query: string) => {
    setGlobalSearch(query);
    setShowSearchDropdown(true);
  };

  const navigateTo = (page: Page) => {
    // Auth-Wall check
    const publicPages = [Page.HOME, Page.ARTICLE, Page.FAQ, Page.FACILITIES, Page.ALL_ARTICLES];
    if (!currentUser && !publicPages.includes(page) && page !== Page.AUTH) {
      setShowAuthWarning(true);
      return;
    }

    if (page === Page.AUTH) {
      setShowAuthWarning(false);
    }

    setCurrentPage(page);
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const handleArticleClick = (id: string) => {
    setSelectedArticleId(id);
    navigateTo(Page.ARTICLE);
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('pastisehat_user', JSON.stringify(user));
    showToast(`Berhasil Masuk! Selamat datang di PastiSehat, ${user.name.split(' ')[0]}.`);
    navigateTo(Page.HOME);
    setShowAuthWarning(false);
    
    // Welcome Notification
    addNotification(
      "Selamat!",
      "Pendaftaran akun PastiSehat Anda berhasil. Lengkapi riwayat medis Anda di menu profil.",
      'Akun'
    );
  };

  const renderPage = () => {
    switch (currentPage) {
      case Page.HOME:
        return <HomePage 
                  onNavigate={navigateTo} 
                  onArticleClick={handleArticleClick} 
                  onOpenDaftarAntri={() => currentUser ? setShowDaftarAntri(true) : setShowAuthWarning(true)}
                />;
      case Page.AUTH:
        return <AuthPage onLogin={handleLogin} onBack={() => navigateTo(Page.HOME)} />;
      case Page.DASHBOARD:
        return <DashboardPage 
                  user={currentUser} 
                  onUpdateUser={(u) => { setCurrentUser(u); localStorage.setItem('pastisehat_user', JSON.stringify(u)); }} 
                  onNavigate={navigateTo} 
                  onLogout={() => { setCurrentUser(null); localStorage.removeItem('pastisehat_user'); navigateTo(Page.HOME); showToast("Anda telah keluar dari akun.", "info"); }}
                  appointments={appointments} 
                />;
      case Page.HISTORY:
        return <HistoryPage user={currentUser} onBack={() => navigateTo(Page.HOME)} appointments={appointments} chatHistory={medicalChatHistory} />;
      case Page.AI_CHAT:
        return <AIChatPage user={currentUser} onNavigate={navigateTo} onShowToast={showToast} addAppointment={addAppointment} onSaveChat={handleSaveChat} />;
      case Page.PHARMACY:
        return <PharmacyPage onBack={() => navigateTo(Page.HOME)} onAddNotification={addNotification} />;
      case Page.DIRECTORY:
        return <DirectoryPage onNavigate={navigateTo} onShowToast={showToast} onBack={() => navigateTo(Page.HOME)} addAppointment={addAppointment} />;
      case Page.FACILITIES:
        return <FacilitiesPage onBack={() => navigateTo(Page.HOME)} />;
      case Page.ARTICLE:
        return <ArticleDetailPage id={selectedArticleId} onBack={() => navigateTo(Page.HOME)} />;
      case Page.SETTINGS:
        return <SettingsPage access={access} onUpdateAccess={setAccess} onBack={() => navigateTo(Page.DASHBOARD)} onShowToast={showToast} />;
      case Page.FAQ:
        return <FAQPage onBack={() => navigateTo(Page.HOME)} />;
      case Page.ALL_ARTICLES:
        return <AllArticlesPage onArticleClick={handleArticleClick} onBack={() => navigateTo(Page.HOME)} />;
      case Page.NOTIFICATIONS:
        return <NotificationPage 
                  notifications={notifications} 
                  onMarkAsRead={(id) => id === 'all' ? setNotifications(prev => prev.map(n => ({ ...n, isRead: true }))) : setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))}
                  onDelete={(id) => id === 'all' ? setNotifications([]) : setNotifications(prev => prev.filter(n => n.id !== id))}
                  onBack={() => navigateTo(Page.HOME)}
                />;
      default:
        return <HomePage onNavigate={navigateTo} onArticleClick={handleArticleClick} onOpenDaftarAntri={() => currentUser ? setShowDaftarAntri(true) : setShowAuthWarning(true)} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300 dark:bg-slate-900">
      {/* Header */}
      <header className={`sticky top-0 z-50 glass shadow-sm px-4 md:px-8 py-3 flex items-center justify-between dark:bg-slate-900/80 dark:border-b dark:border-slate-800 ${currentPage === Page.AUTH ? 'hidden' : ''}`}>
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => navigateTo(Page.HOME)}
        >
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl group-hover:scale-105 transition-transform">
            PS
          </div>
          <div className="block">
            <h1 className="font-bold text-lg sm:text-xl text-primary leading-tight">PastiSehat</h1>
            <p className="text-[9px] sm:text-[10px] text-gray-500 uppercase tracking-widest font-semibold">RS Louis Surabaya</p>
          </div>
        </div>

        {/* Desktop Search Bar */}
        <div className="hidden lg:flex items-center bg-gray-100 rounded-full px-4 py-2 w-96 group focus-within:ring-2 focus-within:ring-primary/20 transition-all relative">
          <Search className="w-4 h-4 text-gray-400 group-focus-within:text-primary" />
          <input 
            type="text" 
            placeholder="Cari fitur aplikasi..." 
            value={globalSearch}
            onChange={(e) => handleGlobalSearch(e.target.value)}
            onFocus={() => setShowSearchDropdown(true)}
            onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
            className="bg-transparent border-none outline-none px-3 text-sm w-full"
          />
          
          <AnimatePresence>
            {showSearchDropdown && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-12 left-0 right-0 bg-white border border-gray-100 shadow-2xl rounded-2xl p-2 z-[100]"
              >
                {filteredFeatures.length > 0 ? (
                  filteredFeatures.map((feat, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        navigateTo(feat.page);
                        setShowSearchDropdown(false);
                        setGlobalSearch('');
                      }}
                      className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 flex items-center gap-3 transition-colors"
                    >
                      <feat.icon className="w-5 h-5 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">{feat.label}</span>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-gray-500">Fitur tidak ditemukan</div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-3">
          {/* Emergency Button */}
          <button 
            onClick={() => setShowEmergency(true)}
            className="bg-emergency hover:bg-red-700 text-white p-2 md:px-4 md:py-2 rounded-full flex items-center gap-2 font-bold transition-all animate-pulse"
          >
            <PhoneCall className="w-4 h-4" />
            <span className="hidden md:inline">Darurat</span>
          </button>

          <button 
            onClick={() => navigateTo(Page.NOTIFICATIONS)}
            className="hidden sm:flex p-2 hover:bg-gray-100 rounded-full transition-colors relative"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            {notifications.some(n => !n.isRead) && (
              <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
            )}
          </button>

          <button 
            onClick={() => currentUser ? navigateTo(Page.DASHBOARD) : navigateTo(Page.AUTH)}
            className="flex items-center gap-2 p-1 pl-1 pr-3 hover:bg-gray-100 rounded-full transition-colors border border-gray-100"
          >
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              {currentUser?.photo ? (
                <img src={currentUser.photo} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-5 h-5 text-gray-500" />
              )}
            </div>
            <span className="hidden md:inline text-sm font-medium">
              {currentUser ? currentUser.name.split(' ')[0] : 'Masuk'}
            </span>
          </button>

          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Navigation Backdrop & Side Menu (Mobile) */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-[60]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 h-full w-4/5 max-w-sm bg-white z-[70] shadow-2xl p-6 flex flex-col"
            >
              <div className="flex justify-between items-center mb-8">
                <span className="font-bold text-xl text-primary underline decoration-2 underline-offset-4">PastiSehat</span>
                <button onClick={() => setIsMenuOpen(false)} className="p-2"><X className="w-6 h-6" /></button>
              </div>

              <nav className="flex flex-col gap-4">
                {[
                  { label: 'Beranda', page: Page.HOME },
                  { label: 'Profil Saya', page: Page.DASHBOARD },
                  { label: 'Riwayat', page: Page.HISTORY },
                  { label: 'Fasilitas RS', page: Page.FACILITIES },
                  { label: 'FAQ & Asuransi', page: Page.FAQ },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => navigateTo(item.page)}
                    className="flex items-center justify-between p-4 rounded-2xl hover:bg-secondary/50 text-left font-medium transition-colors"
                  >
                    {item.label}
                    <ChevronRight className="w-4 h-4 opacity-30" />
                  </button>
                ))}
              </nav>

              <div className="mt-auto">
                {currentUser ? (
                  <button 
                    onClick={() => { setCurrentUser(null); localStorage.removeItem('pastisehat_user'); navigateTo(Page.HOME); }}
                    className="w-full flex items-center justify-center gap-2 p-4 text-red-600 font-bold border-2 border-red-50 border-t-0 rounded-b-2xl hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-5 h-5" /> Keluar
                  </button>
                ) : (
                  <button 
                    onClick={() => navigateTo(Page.AUTH)}
                    className="w-full btn-primary flex items-center justify-center gap-2"
                  >
                    Masuk Akun
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-grow relative z-10 transition-all duration-300">
        <AnimatePresence>
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 lg:hidden px-6 py-3 flex items-center justify-between pb-8 ${currentPage === Page.AUTH ? 'hidden' : ''}`}>
        {[
          { icon: Home, label: 'Beranda', page: Page.HOME },
          { icon: MessageSquare, label: 'Chat', page: Page.AI_CHAT },
          { icon: Stethoscope, label: 'Janji', page: Page.DIRECTORY },
          { icon: History, label: 'Riwayat', page: Page.HISTORY },
          { icon: UserIcon, label: 'Profil', page: Page.DASHBOARD },
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => navigateTo(item.page)}
            className={`flex flex-col items-center gap-1 transition-all ${currentPage === item.page ? 'text-primary scale-110' : 'text-gray-400'}`}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Overlays / Modals */}
      <AnimatePresence>
        {/* Emergency Modal */}
        {showEmergency && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowEmergency(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-[3rem] overflow-hidden shadow-2xl p-8 text-center space-y-8"
            >
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-emergency mx-auto animate-bounce">
                <AlertTriangle className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Butuh bantuan darurat segera?</h2>
                <p className="text-gray-500 font-medium">Tim medis kami siaga 24/7 untuk kondisi kritis Anda.</p>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <a 
                  href="tel:119"
                  className="w-full bg-emergency text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-700 transition-all shadow-lg shadow-red-200"
                >
                  <PhoneCall className="w-5 h-5" /> Panggil Ambulans (119)
                </a>
                <button 
                  onClick={() => { setShowEmergency(false); showToast("Menghubungi UGD RS Louis...", "info"); }}
                  className="w-full bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-800 transition-all"
                >
                  Hubungi UGD RS Louis
                </button>
                <button 
                  onClick={() => setShowEmergency(false)}
                  className="w-full text-gray-400 font-bold py-2 hover:text-gray-600 transition-colors"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Auth Warning Modal */}
        {showAuthWarning && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowAuthWarning(false)}
              className="absolute inset-0 bg-primary/20 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-sm rounded-[3rem] overflow-hidden shadow-2xl p-8 text-center space-y-6"
            >
              <div className="w-16 h-16 bg-blue-50 text-primary rounded-2xl flex items-center justify-center mx-auto">
                <LockIcon className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold">Akses Fitur Terbatas</h2>
                <p className="text-sm text-gray-500 font-medium">Silakan masuk atau daftar akun terlebih dahulu untuk menggunakan fitur ini.</p>
              </div>
              <div className="grid grid-cols-1 gap-3 pt-4">
                <button 
                  onClick={() => navigateTo(Page.AUTH)}
                  className="w-full btn-primary py-4 rounded-2xl"
                >
                  Login / Daftar Sekarang
                </button>
                <button 
                  onClick={() => setShowAuthWarning(false)}
                  className="w-full text-gray-400 font-bold py-2 hover:text-gray-600 transition-colors text-sm"
                >
                  Nanti Saja
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Daftar & Antri Selection Modal */}
        {showDaftarAntri && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowDaftarAntri(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-[3rem] overflow-hidden shadow-2xl p-8 md:p-12 space-y-8"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Daftar & Antri</h2>
                <button onClick={() => setShowDaftarAntri(false)} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100"><X /></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                  onClick={() => { setShowDaftarAntri(false); navigateTo(Page.DIRECTORY); }}
                  className="flex flex-col items-center gap-4 p-8 bg-secondary/50 rounded-[2.5rem] hover:bg-primary hover:text-white transition-all group"
                >
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
                    <Stethoscope className="w-8 h-8" />
                  </div>
                  <span className="font-bold text-center">Langsung Buat Janji Temu</span>
                </button>
                <button 
                  onClick={() => { setShowDaftarAntri(false); navigateTo(Page.AI_CHAT); }}
                  className="flex flex-col items-center gap-4 p-8 bg-blue-50/50 rounded-[2.5rem] hover:bg-primary hover:text-white transition-all group"
                >
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
                    <MessageCircle className="w-8 h-8" />
                  </div>
                  <span className="font-bold text-center">Tanya Cici AI Dulu</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notifications */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[110] flex flex-col gap-3 pointer-events-none w-max max-w-[90vw] px-6">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className={`p-4 rounded-3xl shadow-2xl flex items-center gap-3 border pointer-events-auto ${
                toast.type === 'success' ? 'bg-white border-green-100 text-green-900' : 
                toast.type === 'error' ? 'bg-white border-red-100 text-red-900' :
                'bg-primary border-blue-100 text-white shadow-primary/30'
              }`}
            >
              {toast.type === 'success' && <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center"><CheckCircle2 className="w-6 h-6 text-green-600" /></div>}
              {toast.type === 'info' && <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"><InfoIcon className="w-6 h-6 text-blue-600" /></div>}
              {toast.type === 'error' && <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center"><XCircle className="w-6 h-6 text-red-600" /></div>}
              <div className="pr-4">
                <span className="text-sm font-bold block">{toast.message}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className={`bg-primary text-white pt-16 pb-8 px-8 md:px-16 mt-20 ${currentPage === Page.AUTH ? 'hidden' : ''}`}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">PastiSehat</h2>
            <p className="text-white/70 text-sm leading-relaxed">
              Solusi kesehatan digital terpadu oleh RS Louis Surabaya. Melayani dengan hati, teknologi di genggaman.
            </p>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-primary transition-colors cursor-pointer">
                fb
              </div>
              <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-primary transition-colors cursor-pointer">
                ig
              </div>
              <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-primary transition-colors cursor-pointer">
                tw
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="font-bold text-lg">Kontak Bantuan</h3>
            <ul className="space-y-4 text-sm text-white/70">
              <li>Email: bantuan@rslouis.co.id</li>
              <li>Telp: (031) 555-0123</li>
              <li>WhatsApp: +62 812-3456-7890</li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="font-bold text-lg">Alamat RS Louis</h3>
            <p className="text-sm text-white/70">
              Jl. Mayjen Sungkono No. 123,<br />
              Kec. Sawahan, Kota Surabaya,<br />
              Jawa Timur 60251
            </p>
            <div className="w-full h-32 rounded-xl overflow-hidden grayscale border border-white/10 opacity-50 hover:opacity-100 transition-opacity">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15830.400585641774!2d112.7214!3d-7.2913!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7f955685764d9%3A0xe543594247265bf0!2sKota%20Surabaya%2C%20Jawa%20Timur!5e0!3m2!1sid!2sid!4v1715760000000!5m2!1sid!2sid" 
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
              ></iframe>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="font-bold text-lg">Tautan Cepat</h3>
            <ul className="space-y-4 text-sm text-white/70">
              <li><button onClick={() => navigateTo(Page.FACILITIES)} className="hover:text-white transition-colors">Fasilitas Medis</button></li>
              <li><button onClick={() => navigateTo(Page.DIRECTORY)} className="hover:text-white transition-colors">Cari Dokter</button></li>
              <li><button onClick={() => navigateTo(Page.FAQ)} className="hover:text-white transition-colors">Info BPJS</button></li>
              <li><button className="hover:text-white transition-colors">Kebijakan Privasi</button></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/50">
          <p>© 2026 RS Louis Surabaya. All rights reserved.</p>
          <p>Design & Build with Clarity for All Ages</p>
        </div>
      </footer>
    </div>
  );
}
