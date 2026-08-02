'use client';

import { useState } from 'react';
import { api } from '@/lib/api/client';

export function ForgotPasswordForm() {
  const [message, setMessage] = useState('');
  async function submit(formData: FormData) {
    await api.post('/api/v1/auth/forgot-password', { email: String(formData.get('email') ?? '') });
    setMessage('Password reset instructions queued.');
  }
  return (
    <form action={submit} className="w-full max-w-md rounded-xl border border-line bg-white p-8 shadow-ambient">
      <h1 className="font-headline text-3xl font-bold">Forgot Password</h1>
      <input name="email" className="mt-8 w-full rounded-lg border border-slate-300 px-4 py-3" placeholder="Email" type="email" required />
      <button className="mt-6 w-full rounded-lg bg-royal px-5 py-3 text-sm font-bold text-white">Send Reset Link</button>
      {message ? <p className="mt-4 text-sm font-semibold text-emerald-700">{message}</p> : null}
    </form>
  );
}

export function ResetPasswordForm() {
  const [message, setMessage] = useState('');
  async function submit(formData: FormData) {
    await api.post('/api/v1/auth/reset-password', { token: String(formData.get('token') ?? ''), password: String(formData.get('password') ?? '') });
    setMessage('Password reset completed.');
  }
  return (
    <form action={submit} className="w-full max-w-md rounded-xl border border-line bg-white p-8 shadow-ambient">
      <h1 className="font-headline text-3xl font-bold">Reset Password</h1>
      <input name="token" className="mt-8 w-full rounded-lg border border-slate-300 px-4 py-3" placeholder="Reset token" required />
      <input name="password" className="mt-4 w-full rounded-lg border border-slate-300 px-4 py-3" placeholder="New password" type="password" required minLength={8} />
      <button className="mt-6 w-full rounded-lg bg-royal px-5 py-3 text-sm font-bold text-white">Reset Password</button>
      {message ? <p className="mt-4 text-sm font-semibold text-emerald-700">{message}</p> : null}
    </form>
  );
}

