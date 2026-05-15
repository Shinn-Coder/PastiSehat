import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, ArrowLeft, Check, Trash2, Calendar, CreditCard, User, ClipboardList, Info, XCircle } from 'lucide-react';
import { Page, Notification } from '../types';

interface NotificationPageProps {
  notifications: Notification[];
  onMarkAsRead: (id: string | 'all') => void;
  onDelete: (id: string | 'all') => void;
  onBack: () => void;
}

export default function NotificationPage({ notifications, onMarkAsRead, onDelete, onBack }: NotificationPageProps) {
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const categories = {
    'Akun': { icon: User, color: 'text-blue-500', bg: 'bg-blue-50' },
    'Transaksi': { icon: CreditCard, color: 'text-green-500', bg: 'bg-green-50' },
    'Pengingat': { icon: Calendar, color: 'text-orange-500', bg: 'bg-orange-50' },
    'Riwayat': { icon: ClipboardList, color: 'text-purple-500', bg: 'bg-purple-50' }
  };

  return (
    <div className="min-h-[80vh] pb-20">
      {/* Header */}
      <div className="bg-white sticky top-16 z-30 px-6 py-8 border-b border-gray-100 mb-8">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-3 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
                <Bell className="w-8 h-8" /> Pusat Notifikasi
              </h1>
              <p className="text-gray-500 font-medium">Informasi terbaru seputar akun dan layanan Anda</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => onMarkAsRead('all')}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-secondary/50 text-primary rounded-xl font-bold text-sm hover:bg-secondary transition-all"
            >
              <Check className="w-4 h-4" /> Tandai Semua Dibaca
            </button>
            <button 
              onClick={() => onDelete('all')}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 transition-all"
            >
              <Trash2 className="w-4 h-4" /> Bersihkan
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6">
        {notifications.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
              <Bell className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-400">Belum ada notifikasi</h3>
            <p className="text-gray-500">Kami akan memberitahu Anda saat ada informasi baru.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).map((notif) => {
              const CategoryMeta = categories[notif.category] || categories['Akun'];
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  key={notif.id}
                  className={`group relative p-6 rounded-[2.5rem] transition-all border-2 cursor-pointer ${
                    notif.isRead ? 'bg-white border-transparent grayscale-[0.3] opacity-80' : 'bg-white border-primary/10 shadow-xl shadow-primary/5'
                  }`}
                  onClick={() => {
                    onMarkAsRead(notif.id);
                    setSelectedNotification(notif);
                  }}
                >
                  {!notif.isRead && (
                    <div className="absolute top-6 right-6 w-3 h-3 bg-primary rounded-full animate-pulse shadow-lg shadow-primary/50" />
                  )}
                  
                  <div className="flex gap-6">
                    <div className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center ${CategoryMeta.bg} ${CategoryMeta.color}`}>
                      <CategoryMeta.icon className="w-7 h-7" />
                    </div>
                    
                    <div className="flex-grow">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-1">
                        <span className={`text-xs font-black uppercase tracking-widest ${CategoryMeta.color}`}>
                          {notif.category}
                        </span>
                        <span className="text-xs text-gray-400 font-medium">
                          {notif.timestamp.toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}
                        </span>
                      </div>
                      <h3 className={`font-bold text-lg mb-1 ${notif.isRead ? 'text-gray-600' : 'text-primary'}`}>
                        {notif.title}
                      </h3>
                      <p className="text-gray-500 leading-relaxed font-medium">
                        {notif.message}
                      </p>
                    </div>

                    <button 
                      onClick={(e) => { e.stopPropagation(); onDelete(notif.id); }}
                      className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-50 text-red-500 rounded-xl transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Tip */}
      <div className="max-w-4xl mx-auto px-6 mt-12 text-center">
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-secondary/30 rounded-full text-primary font-bold text-sm">
          <Info className="w-4 h-4" /> Sampaikan keluhan berkala Anda pada Cici jika diperlukan.
        </div>
      </div>

      {/* Notification Detail Modal */}
      <AnimatePresence>
        {selectedNotification && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedNotification(null)}
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
                onClick={() => setSelectedNotification(null)}
                className="absolute right-6 top-6 p-2 bg-gray-50 text-gray-400 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
              
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${categories[selectedNotification.category]?.bg} ${categories[selectedNotification.category]?.color}`}>
                  <Bell className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Detail Notifikasi</h2>
                  <p className="text-sm text-gray-500 uppercase tracking-widest font-bold">{selectedNotification.category}</p>
                </div>
              </div>
              
              <div className="prose prose-sm text-gray-700 whitespace-pre-wrap max-h-[60vh] overflow-y-auto">
                <h3 className="font-bold text-lg mb-2">{selectedNotification.title}</h3>
                <p className="font-medium text-gray-600">{selectedNotification.message}</p>
                <p className="text-xs text-gray-400 mt-6 pt-4 border-t border-gray-100">Diterima pada: {selectedNotification.timestamp.toLocaleString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
              </div>
              
              <button
                onClick={() => setSelectedNotification(null)}
                className="w-full mt-8 py-3 bg-gray-100 font-bold rounded-xl text-gray-700 hover:bg-gray-200 transition-colors"
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
