import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Pill, 
  Search, 
  ShoppingCart, 
  Truck, 
  Store, 
  ChevronRight, 
  Plus, 
  Minus,
  CheckCircle2,
  QrCode,
  Wallet,
  CreditCard,
  ChevronLeft,
  Trash2
} from 'lucide-react';
import { MEDICINES } from '../constants';

interface PharmacyPageProps {
  onBack: () => void;
  onAddNotification: (title: string, message: string, category: 'Transaksi') => void;
}

export default function PharmacyPage({ onBack, onAddNotification }: PharmacyPageProps) {
  const [step, setStep] = useState<'service' | 'checkout' | 'payment' | 'success' | 'buying'>('service');
  const [serviceType, setServiceType] = useState<'recipe' | 'otc' | null>(null);
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('delivery');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<{ [id: string]: number }>({});

  const paymentMethods = [
    { id: 'qris', name: 'QRIS', icon: QrCode },
    { id: 'wallet', name: 'E-Wallet', icon: Wallet },
    { id: 'transfer', name: 'Transfer Bank', icon: CreditCard },
  ];

  const updateCart = (id: string, delta: number) => {
    setCart(prev => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: next };
    });
  };

  const filteredMeds = MEDICINES.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const cartItems = Object.entries(cart).map(([id, qty]) => {
    const med = MEDICINES.find(m => m.id === id)!;
    return { ...med, qty };
  });

  const cartTotal = cartItems.reduce((acc: number, item) => acc + (item.price * (item.qty as number)), 0);
  const cartQty = cartItems.reduce((acc: number, item) => acc + (item.qty as number), 0);

  const handlePayment = () => {
    setStep('success');
    onAddNotification(
      "Pembayaran Obat Berhasil",
      `Pesanan ORD-RSL-882910 sedang diproses oleh Tim Apoteker. ${deliveryType === 'delivery' ? 'Kurir akan segera mengantar ke alamat Anda.' : 'Silakan ambil di konter apotek RS Louis.'}`,
      'Transaksi'
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      <div className="flex mb-4">
        <button 
          onClick={step === 'service' ? onBack : () => setStep('service')}
          className="flex items-center gap-2 p-3 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all font-bold text-primary group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> 
          <span className="dark:text-slate-200">{step === 'service' ? 'Kembali' : 'Kembali Ke Layanan'}</span>
        </button>
      </div>
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Apotek Digital</h1>
        <p className="text-gray-500">Pesan obat dengan mudah dan aman langsung dari RS Louis Surabaya.</p>
      </div>

      <AnimatePresence mode="wait">
        {step === 'service' && (
          <motion.div 
            key="service"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <button 
              onClick={() => { setServiceType('recipe'); setStep('checkout'); }}
              className="group bg-white p-10 rounded-[3rem] border border-gray-100 hover:border-primary/20 text-left space-y-6 card-hover"
            >
              <div className="w-20 h-20 bg-secondary rounded-3xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Pill className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Ambil Obat Resep</h3>
                <p className="text-gray-500 mt-2">Gunakan nomor resep dari dokter untuk menebus obat Anda.</p>
              </div>
              <div className="pt-4 flex items-center gap-2 text-primary font-bold">
                Mulai Penebusan <ChevronRight className="w-4 h-4" />
              </div>
            </button>

            <button 
              onClick={() => { setServiceType('otc'); setStep('buying'); }}
              className="group bg-white p-10 rounded-[3rem] border border-gray-100 hover:border-primary/20 text-left space-y-6 card-hover"
            >
              <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                <Search className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Beli Obat</h3>
                <p className="text-gray-500 mt-2">Cari dan beli kebutuhan obat umum, vitamin, atau alat kesehatan.</p>
              </div>
              <div className="pt-4 flex items-center gap-2 text-blue-600 font-bold">
                Cari Produk <ChevronRight className="w-4 h-4" />
              </div>
            </button>
          </motion.div>
        )}

        {step === 'buying' && (
          <motion.div
            key="buying"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-grow">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari obat (misal: Paracetamol)..." 
                  className="w-full pl-14 pr-6 py-5 bg-white border border-gray-100 rounded-[2rem] shadow-sm outline-none focus:ring-2 focus:ring-primary/20 font-medium"
                />
              </div>
              <div className="bg-primary text-white px-8 py-5 rounded-[2rem] flex items-center gap-4 shadow-xl shadow-primary/20">
                <div className="relative">
                  <ShoppingCart className="w-6 h-6" />
                  {cartQty > 0 && <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-[10px] flex items-center justify-center rounded-full border-2 border-primary">{cartQty}</span>}
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase opacity-70">Total Belanja</p>
                  <p className="font-bold text-lg leading-none">Rp {cartTotal.toLocaleString()}</p>
                </div>
                {cartQty > 0 && (
                  <button 
                    onClick={() => setStep('checkout')}
                    className="ml-4 py-2 px-6 bg-white text-primary rounded-xl font-bold text-sm hover:scale-105 transition-transform"
                  >
                    Lanjut
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredMeds.map((med) => (
                <div key={med.id} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:border-primary/10 transition-all flex flex-col justify-between group">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        med.category === 'Obat Keras' ? 'bg-red-50 text-red-600' : 
                        med.category === 'Jamu' ? 'bg-green-50 text-green-600' :
                        'bg-blue-50 text-blue-600'
                      }`}>
                        {med.category}
                      </div>
                      {med.needRecipe && <span className="text-[10px] font-bold text-red-400">Pake Resep</span>}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-primary">{med.name}</h3>
                      <p className="font-black text-gray-900 mt-1 italic opacity-60 group-hover:opacity-100 transition-opacity">Rp {med.price.toLocaleString()}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{med.status}</p>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    {cart[med.id] ? (
                      <div className="flex items-center justify-between bg-secondary/50 p-2 rounded-2xl">
                        <button 
                          onClick={() => updateCart(med.id, -1)} 
                          className={`p-2 bg-white rounded-xl shadow-sm transition-all ${cart[med.id] === 1 ? 'text-red-500 hover:bg-red-50' : 'text-primary hover:bg-primary hover:text-white'}`}
                        >
                          {cart[med.id] === 1 ? <Trash2 className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                        </button>
                        <span className="font-bold">{cart[med.id]}</span>
                        <button onClick={() => updateCart(med.id, 1)} className="p-2 bg-white rounded-xl shadow-sm text-primary hover:bg-primary hover:text-white transition-all"><Plus className="w-4 h-4" /></button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => updateCart(med.id, 1)}
                        className={`w-full flex items-center justify-center gap-2 py-3 bg-white border border-primary/20 text-primary font-bold rounded-2xl hover:bg-primary hover:text-white transition-all group-hover:shadow-lg group-hover:scale-[1.02] ${med.status === 'Habis' ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                        disabled={med.status === 'Habis'}
                      >
                        <Plus className="w-4 h-4" /> {med.status === 'Habis' ? 'Stok Habis' : 'Tambah'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {filteredMeds.length === 0 && (
              <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                <p className="text-gray-400 font-bold">Obat "{searchQuery}" tidak ditemukan.</p>
              </div>
            )}
          </motion.div>
        )}

        {step === 'checkout' && (
          <motion.div 
            key="checkout"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 space-y-6">
                <h2 className="text-xl font-bold">Pilih Metode Pengambilan</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button 
                    onClick={() => setDeliveryType('pickup')}
                    className={`p-6 rounded-[2rem] border-2 flex items-center gap-4 transition-all ${
                      deliveryType === 'pickup' ? 'border-primary bg-secondary/30 text-primary' : 'border-gray-100 text-gray-500'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${deliveryType === 'pickup' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
                      <Store className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold">Ambil di RS</p>
                      <p className="text-xs opacity-70">Tanpa Biaya Layanan</p>
                    </div>
                  </button>
                  <button 
                    onClick={() => setDeliveryType('delivery')}
                    className={`p-6 rounded-[2rem] border-2 flex items-center gap-4 transition-all ${
                      deliveryType === 'delivery' ? 'border-primary bg-secondary/30 text-primary' : 'border-gray-100 text-gray-500'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${deliveryType === 'delivery' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
                      <Truck className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold">Diantar ke Rumah</p>
                      <p className="text-xs opacity-70">Estimasi 1-2 Jam</p>
                    </div>
                  </button>
                </div>
              </div>

              {serviceType === 'recipe' && (
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 space-y-4">
                  <h2 className="text-xl font-bold">Nomor Resep Dokter</h2>
                  <input type="text" placeholder="Masukkan Kode Resep (misal: RSL-12345)" className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary/20 font-bold" />
                  <p className="text-xs text-gray-400 italic">Pesanan akan diverifikasi oleh apoteker kami dalam 5 menit.</p>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                <h2 className="text-xl font-bold">Ringkasan Pesanan</h2>
                <div className="space-y-4">
                  {cartItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-800">{item.name}</span>
                        <span className="text-gray-400 text-xs">x{item.qty}</span>
                      </div>
                      <span className="font-bold">Rp {(item.price * (item.qty as number)).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-gray-100 space-y-2">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Biaya Layanan</span>
                    <span>Rp {deliveryType === 'delivery' ? '15.000' : '0'}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-primary pt-2">
                    <span>Total</span>
                    <span>Rp {(cartTotal + (deliveryType === 'delivery' ? 15000 : 0)).toLocaleString()}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setStep('payment')}
                  className="w-full btn-primary py-4"
                  disabled={cartQty === 0 && serviceType !== 'recipe'}
                >
                  Pilih Pembayaran
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'payment' && (
          <motion.div 
            key="payment"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-xl mx-auto bg-white p-10 rounded-[3rem] border border-gray-100 shadow-2xl space-y-8"
          >
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">Pilih Pembayaran</h2>
              <p className="text-gray-500">Integrasi pembayaran aman & praktis</p>
            </div>

            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <button 
                  key={method.id}
                  onClick={handlePayment}
                  className="w-full p-6 border border-gray-100 rounded-3xl flex items-center justify-between group hover:border-primary transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <method.icon className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-gray-700">{method.name}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300" />
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto text-center space-y-8 py-12"
          >
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Pembayaran Berhasil!</h2>
              <p className="text-gray-500">Pesan Anda sedang disiapkan oleh tim Apoteker RS Louis. Mohon tunggu notifikasi selanjutnya.</p>
            </div>
            <div className="p-6 bg-secondary/30 rounded-3xl border border-primary/10">
              <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">ID Pesanan</p>
              <p className="font-bold text-lg">ORD-RSL-882910</p>
            </div>
            <button 
              onClick={() => { setCart({}); setStep('service'); }}
              className="w-full btn-primary py-4"
            >
              Kembali ke Apotek
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
