/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const API_BASE_URL = (import.meta as any).env.VITE_API_URL || (import.meta as any).env.VITE_BACKEND_URL || '';

export async function login(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Gagal logiPn');
  return data.user;
}

export async function register(userData: any) {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Gagal registrasi');
  return data.user;
}

export const sendMessage = async (message: string, userId: string, history: any[], mediaFile?: File) => {
  const payload: any = {
    message: message || '',
    userId,
    history: JSON.stringify(history)
  };

  if (mediaFile) {
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(mediaFile);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
    payload.mediaBase64 = base64;
    payload.mediaMimeType = mediaFile.type || 'image/jpeg';
  }

  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Gagal kirim pesan');
  return data;
}

export async function getAppointments(userId: string) {
  const response = await fetch(`${API_BASE_URL}/api/appointments/${userId}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Gagal ambil data janji temu');
  return data.appointments;
}

export async function getDoctors() {
  const response = await fetch(`${API_BASE_URL}/api/doctors`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Gagal ambil data dokter');
  return data.doctors;
}

export async function summarizeChat(history: any[]) {
  const response = await fetch(`${API_BASE_URL}/api/chat/summarize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ history }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Gagal membuat ringkasan chat');
  return data.summary;
}

export async function createAppointment(userId: string, doctorName: string, date: string, summary?: string) {
  const response = await fetch(`${API_BASE_URL}/api/appointments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, doctorName, date, summary }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Gagal membuat janji temu');
  return data.appointment;
}
