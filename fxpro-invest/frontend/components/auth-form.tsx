'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { api, storeAuth } from '@/lib/api/client';

export function AuthForm({ mode, admin = false }: { mode: 'login' | 'register'; admin?: boolean }) {
  const [error, setError] = useState('');
  const searchParams = useSearchParams();
  const referralCode = searchParams.get('ref') ?? '';

  async function submit(formData: FormData) {
    setError('');
    try {
      const endpoint = mode === 'register' ? '/api/v1/auth/register' : admin ? '/api/v1/admin/auth/login' : '/api/v1/auth/login';
      const payload = {
        fullName: String(formData.get('fullName') ?? ''),
        email: String(formData.get('email') ?? ''),
        password: String(formData.get('password') ?? ''),
        referralCode: String(formData.get('referralCode') ?? '') || undefined,
      };
      const response = await api.post(endpoint, payload);
      storeAuth(response.data);
      window.location.href = response.data.user.role === 'USER' ? '/dashboard' : '/admin';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in');
    }
  }

  return (
    <form action={submit} className="w-full max-w-md rounded-xl border border-line bg-white p-8 shadow-ambient">
      <a className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-muted hover:text-royal" href="/">
        <ArrowLeft size={16} />
        Back to homepage
      </a>
      <p className="text-sm font-bold uppercase tracking-wider text-royal">{admin ? 'Administrator Portal' : 'Secure Portal'}</p>
      <h1 className="mt-2 font-headline text-3xl font-bold">{mode === 'register' ? 'Create account' : 'Sign in'}</h1>
      {mode === 'register' ? <input name="fullName" className="mt-8 w-full rounded-lg border border-slate-300 px-4 py-3" placeholder="Full name" required /> : null}
      <input name="email" className={`${mode === 'register' ? 'mt-4' : 'mt-8'} w-full rounded-lg border border-slate-300 px-4 py-3`} placeholder={admin ? 'admin@bluepeakcapital.com' : 'investor@bluepeakcapital.com'} type="email" required />
      <input name="password" className="mt-4 w-full rounded-lg border border-slate-300 px-4 py-3" placeholder="Password" type="password" required minLength={8} />
      {mode === 'register' ? <input name="referralCode" className="mt-4 w-full rounded-lg border border-slate-300 px-4 py-3" placeholder="Referral code" defaultValue={referralCode} /> : null}
      {error ? <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{error}</p> : null}
      <button className="mt-6 w-full rounded-lg bg-royal px-5 py-3 text-center text-sm font-bold text-white">{mode === 'register' ? 'Create Account' : 'Sign in'}</button>
      {!admin ? (
        <p className="mt-5 text-center text-sm text-muted">
          {mode === 'register' ? 'Already have an account? ' : 'New to BluePeak Capital? '}
          <a className="font-bold text-royal" href={mode === 'register' ? '/login' : '/register'}>{mode === 'register' ? 'Sign in' : 'Register'}</a>
        </p>
      ) : null}
    </form>
  );
}
