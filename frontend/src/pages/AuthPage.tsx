/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  ArrowLeft,
  Check,
  User,
  MapPin,
  Activity,
  Lock,
  Mail,
  Info,
  ChevronLeft
} from 'lucide-react';
import { User as UserType } from '../types';
import { login, register } from '../api';

interface AuthPageProps {
  onLogin: (user: UserType) => void;
  onBack: () => void;
}

export default function AuthPage({ onLogin, onBack }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Form States
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    dob: '',
    gender: 'Laki-laki',
    address: '',
    conditions: [] as string[],
    customCondition: ''
  });
  const [termsAccepted, setTermsAccepted] = useState(false);

  const conditions = ['Gerd', 'Diabetes', 'Disabilitas', 'Hipertensi', 'Asma', 'Kolesterol'];

  const toggleCondition = (cond: string) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions.includes(cond)
        ? prev.conditions.filter(c => c !== cond)
        : [...prev.conditions, cond]
    }));
  };

  const handleRegister = async () => {
    setError(null);
    setLoading(true);
    try {
      const userData = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        dob: formData.dob,
        address: formData.address,
        medicalHistory: formData.conditions.includes('Lainnya')
          ? [...formData.conditions.filter(c => c !== 'Lainnya'), formData.customCondition].filter(c => c.trim() !== '')
          : formData.conditions,
      };

      const user = await register(userData);
      // Registration successful, now show onboarding
      setFormData(prev => ({ ...prev, id: user.id })); // Keep track of ID
      setShowOnboarding(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const loginEmail = (document.getElementById('login-email') as HTMLInputElement)?.value;
    const loginPass = (document.getElementById('login-password') as HTMLInputElement)?.value;

    try {
      const user = await login(loginEmail, loginPass);
      onLogin({
        id: user.id,
        name: user.fullName || user.name || 'User',
        email: user.email,
        age: 30,
        gender: user.gender || 'Laki-laki',
        address: user.address,
        medicalHistory: user.medicalHistory || [],
        familyMembers: []
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const finishOnboarding = () => {
    const newUser: UserType = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name || 'User Demo',
      email: formData.email,
      age: 28,
      gender: formData.gender as any,
      address: formData.address,
      medicalHistory: formData.conditions.includes('Lainnya')
        ? [...formData.conditions.filter(c => c !== 'Lainnya'), formData.customCondition].filter(c => c.trim() !== '')
        : formData.conditions,
      familyMembers: []
    };
    onLogin(newUser);
  };

  if (showOnboarding) {
    const onboarding = [
      {
        title: "Di sini Cici berada",
        desc: "Butuh bantuan diagnostik cepat? Cici selalu siap 24/7 di pojok kanan bawah atau menu chat.",
        icon: 'MessageSquare'
      },
      {
        title: "Di sini jadwalmu",
        desc: "Semua antrean dan rencana kunjungan dokter tersimpan rapi di menu Riwayat.",
        icon: 'Calendar'
      },
      {
        title: "Di sini fitur Apotek",
        desc: "Pesan obat resep atau beli obat bebas tanpa perlu antre di rumah sakit.",
        icon: 'Pill'
      }
    ];

    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6 bg-secondary/20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white p-10 rounded-[3rem] shadow-2xl space-y-8 text-center"
        >
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Info className="w-10 h-10" />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">{onboarding[onboardingStep - 1].title}</h2>
            <p className="text-gray-500">{onboarding[onboardingStep - 1].desc}</p>
          </div>

          <div className="flex justify-center gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-1.5 rounded-full transition-all ${onboardingStep === i ? 'w-8 bg-primary' : 'w-2 bg-gray-200'}`} />
            ))}
          </div>

          <button
            onClick={() => {
              if (onboardingStep < 3) setOnboardingStep(prev => prev + 1);
              else finishOnboarding();
            }}
            className="w-full btn-primary"
          >
            {onboardingStep < 3 ? 'Selanjutnya' : 'Mulai Sekarang'}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-6 relative overflow-hidden bg-white/50">
      <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary rounded-full blur-[120px]" />
      </div>

      <motion.div
        layout
        className="max-w-xl w-full bg-white rounded-[3rem] shadow-2xl border border-gray-50 p-8 md:p-12"
      >
        <div className="absolute top-6 left-6 z-20">
          <button
            onClick={onBack}
            className="flex items-center gap-2 p-3 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all font-bold text-primary group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Kembali
          </button>
        </div>

        <div className="text-center mb-10 space-y-2">
          <h1 className="text-3xl font-bold">{isLogin ? 'Selamat Datang Kembali' : 'Bergabunglah Bersama Kami'}</h1>
          <p className="text-gray-500">{isLogin ? 'Masuk untuk akses fitur kesehatan lengkap' : 'Daftar akun PastiSehat sekarang'}</p>
        </div>

        <AnimatePresence mode="wait">
          {isLogin ? (
            <motion.form
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
              onSubmit={handleLoginSubmit}
            >
              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold border border-red-100">
                  {error}
                </div>
              )}
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Email <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="login-email"
                      type="email"
                      required
                      placeholder="Masukkan email Anda"
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Password <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="login-password"
                      type="password"
                      required
                      placeholder="••••••••"
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded text-primary border-gray-300 focus:ring-primary/20" />
                  <span className="text-gray-600">Ingat Saya</span>
                </label>
                <button type="button" className="text-primary font-bold hover:underline">Lupa Password?</button>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-4 text-lg disabled:opacity-50"
              >
                {loading ? 'Memproses...' : 'Masuk'}
              </button>
              <p className="text-center text-sm text-gray-500">
                Belum punya akun? <button type="button" onClick={() => setIsLogin(false)} className="text-primary font-bold hover:underline">Daftar Sekarang</button>
              </p>
            </motion.form>
          ) : (
            <motion.form
              key="register"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
              onSubmit={(e) => {
                e.preventDefault();
                if (step < 4) setStep(prev => prev + 1);
                else handleRegister();
              }}
            >
              {/* Progress Bar */}
              <div className="relative flex justify-between items-center">
                <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-1 bg-gray-100 -z-10 rounded-full" />
                <div
                  className="absolute top-1/2 -translate-y-1/2 left-0 h-1 bg-primary -z-10 rounded-full transition-all duration-500"
                  style={{ width: `${((step - 1) / 3) * 100}%` }}
                />
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 border-4 bg-white ${step >= i ? 'border-primary text-primary shadow-lg shadow-primary/20' : 'border-gray-100 text-gray-300'
                      }`}
                  >
                    {step > i ? <Check className="w-5 h-5" /> : i}
                  </div>
                ))}
              </div>

              <div className="min-h-[300px]">
                {step === 1 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Nama Lengkap <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Nama sesuai KTP"
                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Tanggal Lahir <span className="text-red-500">*</span></label>
                      <input
                        type="date"
                        required
                        value={formData.dob}
                        onChange={(e) => setFormData(prev => ({ ...prev, dob: e.target.value }))}
                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Jenis Kelamin</label>
                      <div className="flex gap-4">
                        {['Laki-laki', 'Perempuan'].map((g) => (
                          <button
                            type="button"
                            key={g}
                            onClick={() => setFormData(prev => ({ ...prev, gender: g as any }))}
                            className={`flex-1 py-4 rounded-2xl font-bold border-2 transition-all ${formData.gender === g ? 'border-primary bg-secondary/40 text-primary' : 'border-gray-100 text-gray-400 hover:bg-gray-50'
                              }`}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Alamat Domisili <span className="text-red-500">*</span></label>
                      <textarea
                        rows={5}
                        required
                        value={formData.address}
                        onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="Alamat lengkap saat ini"
                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium resize-none"
                      />
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-blue-50 text-blue-700 rounded-2xl text-sm">
                      <MapPin className="w-5 h-5 flex-shrink-0" />
                      <p>Gunakan alamat asli untuk keperluan pengiriman obat lewat fitur Apotek nanti.</p>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Riwayat Penyakit</label>
                      <p className="text-sm text-gray-500 mb-4">Pilih yang pernah atau sedang diderita</p>
                      <div className="grid grid-cols-2 gap-3">
                        {conditions.map((cond) => (
                          <button
                            type="button"
                            key={cond}
                            onClick={() => toggleCondition(cond)}
                            className={`px-4 py-3 rounded-xl border-2 text-sm font-bold transition-all text-left flex items-center justify-between ${formData.conditions.includes(cond) ? 'border-primary bg-secondary/40 text-primary' : 'border-gray-100 text-gray-400'
                              }`}
                          >
                            {cond}
                            {formData.conditions.includes(cond) && <Check className="w-4 h-4" />}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            if (formData.conditions.includes('Lainnya')) {
                              setFormData(prev => ({
                                ...prev,
                                conditions: prev.conditions.filter(c => c !== 'Lainnya'),
                                customCondition: ''
                              }));
                            } else {
                              setFormData(prev => ({ ...prev, conditions: [...prev.conditions, 'Lainnya'] }));
                            }
                          }}
                          className={`px-4 py-3 rounded-xl border-2 text-sm font-bold transition-all text-left flex items-center justify-between ${formData.conditions.includes('Lainnya') ? 'border-primary bg-secondary/40 text-primary' : 'border-gray-100 text-gray-400'
                            }`}
                        >
                          Lainnya
                          {formData.conditions.includes('Lainnya') && <Check className="w-4 h-4" />}
                        </button>
                      </div>

                      <AnimatePresence>
                        {formData.conditions.includes('Lainnya') && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="pt-2"
                          >
                            <input
                              type="text"
                              value={formData.customCondition}
                              onChange={(e) => setFormData(prev => ({ ...prev, customCondition: e.target.value }))}
                              placeholder="Ketik riwayat penyakit lainnya..."
                              className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm"
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Email Baru <span className="text-red-500">*</span></label>
                        <input
                          type="email"
                          required
                          placeholder="email@anda.com"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Password <span className="text-red-500">*</span></label>
                        <input
                          type="password"
                          required
                          value={formData.password}
                          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                          placeholder="Min. 8 karakter"
                          className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                        />
                      </div>
                    </div>
                    <label className="flex items-start gap-3 cursor-pointer mt-4">
                      <input
                        type="checkbox"
                        required
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="mt-1 w-4 h-4 rounded text-primary border-gray-300 focus:ring-primary/20"
                      />
                      <span className="text-sm text-gray-500">Saya menyetujui <button type="button" className="text-primary font-bold">Syarat & Ketentuan</button> serta <button type="button" className="text-primary font-bold">Kebijakan Privasi</button> RS Louis Surabaya.</span>
                    </label>
                  </motion.div>
                )}
              </div>

              <div className="flex gap-4">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep(prev => prev - 1)}
                    className="p-4 rounded-2xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
                  >
                    <ArrowLeft className="w-6 h-6" />
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading || (step === 4 && !termsAccepted)}
                  className="flex-grow btn-primary py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? 'Memproses...' : step === 4 ? 'Selesaikan Pendaftaran' : 'Selanjutnya'}
                  {step < 4 && !loading && <ArrowRight className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-center text-sm text-gray-500">
                Sudah punya akun? <button type="button" onClick={() => setIsLogin(true)} className="text-primary font-bold hover:underline">Masuk</button>
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
