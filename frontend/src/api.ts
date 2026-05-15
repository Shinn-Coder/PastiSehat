/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function login(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Gagal login');
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
  const formData = new FormData();
  if (message) formData.append('message', message);
  formData.append('userId', userId);
  formData.append('history', JSON.stringify(history));
  if (mediaFile) {
    formData.append('file', mediaFile);
  }

  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: 'POST',
    body: formData,
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
