'use client';

import { useEffect, useState } from 'react';
import { api, apiErrorMessage } from '@/lib/api/client';

type Profile = {
  email: string;
  fullName: string;
  phoneNumber: string | null;
  status: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  referralCode: string;
  createdAt: string;
};

export function ProfileForm() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/api/v1/users/me/profile').then((response) => setProfile(response.data)).catch((err) => setError(apiErrorMessage(err)));
  }, []);

  async function submit(formData: FormData) {
    setMessage('');
    setError('');
    try {
      const response = await api.patch('/api/v1/users/me/profile', {
        fullName: String(formData.get('fullName') ?? ''),
        phoneNumber: String(formData.get('phoneNumber') ?? ''),
      });
      setProfile(response.data);
      setMessage('Profile saved.');
    } catch (err) {
      setError(apiErrorMessage(err));
    }
  }

  return (
    <section className="mt-6 rounded-xl border border-line bg-white p-6 shadow-ambient">
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <form action={submit}>
          <h2 className="font-headline text-xl font-bold">Profile Details</h2>
          <label className="mt-5 block text-sm font-semibold text-muted">Full name</label>
          <input name="fullName" className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3" defaultValue={profile?.fullName ?? ''} required />
          <label className="mt-4 block text-sm font-semibold text-muted">Phone number</label>
          <input name="phoneNumber" className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3" defaultValue={profile?.phoneNumber ?? ''} />
          <label className="mt-4 block text-sm font-semibold text-muted">Email</label>
          <input className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-muted" value={profile?.email ?? ''} readOnly />
          <button className="mt-5 rounded-lg bg-royal px-5 py-3 text-sm font-bold text-white">Save Profile</button>
          {message ? <p className="mt-4 text-sm font-semibold text-emerald-700">{message}</p> : null}
          {error ? <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p> : null}
        </form>
        <div className="rounded-xl bg-slate-50 p-5">
          <p className="text-sm font-bold uppercase tracking-wider text-muted">Account Status</p>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-muted">Status</dt><dd className="font-bold">{profile?.status ?? '-'}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted">Email verified</dt><dd className="font-bold">{profile?.emailVerified ? 'Yes' : 'No'}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted">Phone verified</dt><dd className="font-bold">{profile?.phoneVerified ? 'Yes' : 'No'}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted">Referral code</dt><dd className="font-bold">{profile?.referralCode ?? '-'}</dd></div>
          </dl>
        </div>
      </div>
    </section>
  );
}

