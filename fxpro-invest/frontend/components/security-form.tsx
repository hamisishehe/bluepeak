'use client';

import { useState } from 'react';
import { api, apiErrorMessage, clearAuth } from '@/lib/api/client';

export function SecurityForm() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function submit(formData: FormData) {
    setMessage('');
    setError('');
    const newPassword = String(formData.get('newPassword') ?? '');
    const confirmPassword = String(formData.get('confirmPassword') ?? '');
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    try {
      await api.post('/api/v1/users/me/change-password', {
        currentPassword: String(formData.get('currentPassword') ?? ''),
        newPassword,
      });
      setMessage('Password changed. Please sign in again.');
      clearAuth();
      setTimeout(() => { window.location.href = '/login'; }, 1200);
    } catch (err) {
      setError(apiErrorMessage(err));
    }
  }

  return (
    <section className="mt-6 rounded-xl border border-line bg-white p-6 shadow-ambient">
      <form action={submit} className="max-w-xl">
        <h2 className="font-headline text-xl font-bold">Change Password</h2>
        <label className="mt-5 block text-sm font-semibold text-muted">Current password</label>
        <input name="currentPassword" className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3" type="password" required />
        <label className="mt-4 block text-sm font-semibold text-muted">New password</label>
        <input name="newPassword" className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3" type="password" minLength={8} required />
        <label className="mt-4 block text-sm font-semibold text-muted">Confirm new password</label>
        <input name="confirmPassword" className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3" type="password" minLength={8} required />
        <button className="mt-5 rounded-lg bg-royal px-5 py-3 text-sm font-bold text-white">Change Password</button>
        {message ? <p className="mt-4 text-sm font-semibold text-emerald-700">{message}</p> : null}
        {error ? <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p> : null}
      </form>
    </section>
  );
}

