/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User as UserIcon, 
  MapPin, 
  Calendar, 
  Pencil, 
  Shield, 
  Settings, 
  Plus, 
  Trash2,
  ChevronRight,
  Info,
  ChevronLeft,
  Lock,
  Camera,
  LogOut,
  Mail
} from 'lucide-react';
import { User, Page, FamilyMember, Appointment } from '../types';

interface DashboardPageProps {
  user: User | null;
  onUpdateUser: (user: User) => void;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  appointments: Appointment[];
}

export default function DashboardPage({ user, onUpdateUser, onNavigate, onLogout, appointments }: DashboardPageProps) {
  const [isEditingPhysical, setIsEditingPhysical] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showAddFamily, setShowAddFamily] = useState(false);
  
  if (!user) return null;

  const handleUpdatePhysical = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onUpdateUser({
      ...user,
      height: Number(formData.get('height')),
      weight: Number(formData.get('weight'))
    });
    setIsEditingPhysical(false);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateUser({
          ...user,
          photo: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-16 py-12 space-y-12">
      <div className="flex mb-4">
        <button 
          onClick={() => onNavigate(Page.HOME)}
          className="flex items-center gap-2 p-3 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all font-bold text-primary group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Kembali
        </button>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              id="profile-photo-input" 
              onChange={handlePhotoChange}
            />
            <div className="w-24 h-24 md:w-32 md:h-32 bg-secondary rounded-[2.5rem] flex items-center justify-center border-4 border-white shadow-xl overflow-hidden">
               {user.photo ? (
                 <img src={user.photo} className="w-full h-full object-cover" alt="Profile" />
               ) : (
                 <UserIcon className="w-12 h-12 text-primary/30" />
               )}
            </div>
            <button 
              onClick={() => document.getElementById('profile-photo-input')?.click()}
              className="absolute bottom-1 right-1 p-2.5 bg-primary text-white rounded-2xl shadow-lg border-2 border-white hover:scale-110 transition-transform"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">Halo, {user.name}!</h1>
            <p className="text-gray-500 font-medium">{user.email}</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => onNavigate(Page.SETTINGS)}
            className="p-3 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all text-gray-600 hover:text-primary"
          >
            <Settings className="w-6 h-6" />
          </button>
          <button 
            onClick={() => onNavigate(Page.HISTORY)}
            className="btn-primary"
          >
            Lihat Janji Temu
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Basic Info Card */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 md:p-10 shadow-sm space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Informasi Dasar</h2>
              <button 
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="text-primary font-bold text-sm flex items-center gap-2 hover:underline"
              >
                <Pencil className="w-4 h-4" /> {isEditingProfile ? 'Batal' : 'Edit Profil'}
              </button>
            </div>
            
            {isEditingProfile ? (
              <form 
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  onUpdateUser({
                    ...user,
                    name: formData.get('name') as string,
                    age: Number(formData.get('age')),
                    gender: formData.get('gender') as any,
                    address: formData.get('address') as string,
                  });
                  setIsEditingProfile(false);
                }}
              >
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Nama</label>
                  <input name="name" defaultValue={user.name} className="w-full p-4 bg-gray-50 rounded-2xl outline-none border border-transparent focus:border-primary/20" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Umur</label>
                  <input name="age" type="number" defaultValue={user.age} className="w-full p-4 bg-gray-50 rounded-2xl outline-none border border-transparent focus:border-primary/20" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Kelamin</label>
                  <select name="gender" defaultValue={user.gender} className="w-full p-4 bg-gray-50 rounded-2xl outline-none border border-transparent focus:border-primary/20">
                    <option>Laki-laki</option>
                    <option>Perempuan</option>
                  </select>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Alamat</label>
                  <textarea name="address" defaultValue={user.address} className="w-full p-4 bg-gray-50 rounded-2xl outline-none border border-transparent focus:border-primary/20 resize-none h-24" />
                </div>
                <div className="md:col-span-2">
                  <button type="submit" className="btn-primary w-full py-4">Simpan Perubahan</button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center text-primary">
                    <UserIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Nama & Kelamin</p>
                    <p className="font-bold">{user.name} ({user.gender})</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center text-primary">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Umur</p>
                    <p className="font-bold">{user.age} Tahun</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center text-primary">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Email</p>
                    <p className="font-bold">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 md:col-span-2">
                  <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center text-primary shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Alamat</p>
                    <p className="font-bold leading-relaxed">{user.address}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Family Management */}
          <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 md:p-10 shadow-sm space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Manajemen Keluarga</h2>
              <button 
                onClick={() => setShowAddFamily(true)}
                className="btn-primary px-4 py-2 text-sm flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Tambah Keluarga
              </button>
            </div>

            {user.familyMembers.length === 0 ? (
              <div className="p-12 border-2 border-dashed border-gray-100 rounded-3xl text-center space-y-4">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                  <Plus className="w-8 h-8" />
                </div>
                <p className="text-gray-400 font-medium">Belum ada anggota keluarga ditambahkan.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.familyMembers.map((member) => (
                  <div key={member.id} className="p-6 border border-gray-100 rounded-3xl flex justify-between items-center group hover:border-primary/20 transition-all">
                    <div>
                      <p className="font-bold">{member.name}</p>
                      <p className="text-xs text-gray-400">{member.gender} • {member.dob}</p>
                    </div>
                    <button className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Cards */}
        <div className="space-y-8">
          {/* Upcoming Appointment Card */}
          {appointments.length > 0 && (
            <div className="bg-secondary/40 rounded-[2.5rem] p-8 border border-primary/10 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-primary">Janji Temu Mendatang</h2>
                <button onClick={() => onNavigate(Page.HISTORY)} className="text-sm font-bold text-primary flex items-center gap-1">Lengkap <ChevronRight className="w-4 h-4" /></button>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-primary/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center font-bold">
                    {appointments[0].date.split(',')[1].trim().split(' ')[0]}
                  </div>
                  <div>
                    <p className="font-bold">{appointments[0].doctorName}</p>
                    <p className="text-xs text-gray-500">{appointments[0].specialty}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-primary">{appointments[0].time} WIB</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">{appointments[0].date.split(',')[0]}</p>
                </div>
              </div>
            </div>
          )}

          {/* Physical Stats */}
          <div className="bg-primary rounded-[2.5rem] p-8 text-white shadow-xl space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Kondisi Fisik</h2>
              {!isEditingPhysical && (
                <button 
                  onClick={() => setIsEditingPhysical(true)}
                  className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-all"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              )}
            </div>

            {isEditingPhysical ? (
              <form onSubmit={handleUpdatePhysical} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-white/50">Tinggi (cm)</label>
                    <input 
                      name="height"
                      type="number" 
                      defaultValue={user.height || 0}
                      className="w-full bg-white/10 border-none outline-none p-3 rounded-xl focus:ring-1 focus:ring-white/30 text-white font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-white/50">Berat (kg)</label>
                    <input 
                      name="weight"
                      type="number" 
                      defaultValue={user.weight || 0}
                      className="w-full bg-white/10 border-none outline-none p-3 rounded-xl focus:ring-1 focus:ring-white/30 text-white font-bold"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="flex-grow bg-white text-primary font-bold py-3 rounded-xl">Simpan</button>
                  <button type="button" onClick={() => setIsEditingPhysical(false)} className="px-4 py-3 bg-white/10 rounded-xl">Batal</button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/10 rounded-2xl border border-white/5">
                  <p className="text-xs text-white/50 font-bold uppercase tracking-wider mb-1">Tinggi Badan</p>
                  <p className="text-3xl font-bold">{user.height || '-'} <span className="text-sm font-normal opacity-60">cm</span></p>
                </div>
                <div className="p-4 bg-white/10 rounded-2xl border border-white/5">
                  <p className="text-xs text-white/50 font-bold uppercase tracking-wider mb-1">Berat Badan</p>
                  <p className="text-3xl font-bold">{user.weight || '-'} <span className="text-sm font-normal opacity-60">kg</span></p>
                </div>
              </div>
            )}
            
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-start gap-3">
              <Info className="w-4 h-4 text-white/40 shrink-0 mt-0.5" />
              <p className="text-xs text-white/60 leading-relaxed italic">
                Data ini membantu Cici AI memberikan diagnosa yang lebih akurat sesuai indeks massa tubuh Anda.
              </p>
            </div>
          </div>

          {/* Quick Actions / Settings */}
          <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm space-y-4">
            <h2 className="text-xl font-bold mb-6">Keamanan</h2>
            <button className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <Shield className="w-5 h-5" />
                </div>
                <span className="font-bold text-gray-700">Ganti Password</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </button>
            <button className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <span className="font-bold text-gray-700">Dua Langkah Verifikasi</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </button>
          </div>

          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-3 p-6 bg-red-50 text-red-600 rounded-[2rem] font-black uppercase tracking-widest hover:bg-red-100 transition-all border-2 border-red-100"
          >
            <LogOut className="w-6 h-6" /> Keluar dari Akun
          </button>
        </div>
      </div>

      {/* Add Family Modal */}
      {showAddFamily && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-6 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-xl rounded-[3rem] p-10 shadow-2xl space-y-8"
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">Tambah Anggota Keluarga</h2>
              <p className="text-gray-500">Daftarkan keluarga Anda agar bisa buat janji temu lebih mudah.</p>
            </div>
            
            <form className="space-y-6" onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const newMember: FamilyMember = {
                id: Math.random().toString(36).substr(2, 9),
                name: formData.get('name') as string,
                dob: formData.get('dob') as string,
                gender: formData.get('gender') as any,
                address: formData.get('address') as string,
                medicalHistory: []
              };
              onUpdateUser({ ...user, familyMembers: [...user.familyMembers, newMember] });
              setShowAddFamily(false);
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Nama Lengkap</label>
                  <input name="name" required type="text" className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Tgl Lahir</label>
                  <input name="dob" required type="date" className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Gender</label>
                  <select name="gender" className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20">
                    <option>Laki-laki</option>
                    <option>Perempuan</option>
                  </select>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Alamat</label>
                  <textarea name="address" required className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 resize-none h-24" />
                </div>
              </div>
              
              <div className="flex gap-4">
                <button type="submit" className="flex-grow btn-primary py-4">Simpan Anggota</button>
                <button type="button" onClick={() => setShowAddFamily(false)} className="px-8 py-4 border border-gray-200 rounded-2xl font-bold">Batal</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
