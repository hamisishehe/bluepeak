'use client';

import { useState } from 'react';
import { api, apiErrorMessage } from '@/lib/api/client';

export function AdminUserForm() {
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function submit(formData: FormData) {
    const id = String(formData.get('id') ?? '').trim();
    const payload = clean({
      email: String(formData.get('email') ?? '').trim(),
      fullName: String(formData.get('fullName') ?? '').trim(),
      phoneNumber: String(formData.get('phoneNumber') ?? '').trim(),
      password: String(formData.get('password') ?? ''),
      status: String(formData.get('status') ?? ''),
      availableBalance: String(formData.get('availableBalance') ?? '').trim(),
      investmentBalance: String(formData.get('investmentBalance') ?? '').trim(),
    });
    setMessage('');
    setError('');

    if (mode === 'edit' && !id) {
      setError('User ID is required when editing.');
      return;
    }
    if (mode === 'create' && (!payload.email || !payload.fullName || !payload.password)) {
      setError('Email, full name, and password are required when creating a user.');
      return;
    }

    try {
      if (mode === 'create') {
        await api.post('/api/v1/admin/users', payload);
      } else {
        delete payload.password;
        await api.patch(`/api/v1/admin/users/${id}`, payload);
      }
      setMessage(mode === 'create' ? 'User created successfully.' : 'User details updated successfully.');
      window.dispatchEvent(new CustomEvent('fxpro:records-changed', { detail: { resource: 'users' } }));
    } catch (userError) {
      setError(apiErrorMessage(userError));
    }
  }

  return (
    <form action={submit} className="mt-6 rounded-xl border border-line bg-white p-6 shadow-ambient">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="font-headline text-xl font-bold">Create or Edit User</h2>
          <p className="mt-2 text-sm text-slate-600">Create an investor account or update profile, status, and balances.</p>
        </div>
        <select className="rounded-lg border border-slate-300 px-4 py-3 text-sm font-bold" value={mode} onChange={(event) => setMode(event.target.value as 'create' | 'edit')}>
          <option value="create">create user</option>
          <option value="edit">edit user</option>
        </select>
      </div>

      {mode === 'edit' ? <input name="id" className="mt-5 w-full rounded-lg border border-slate-300 px-4 py-3" placeholder="user id" required /> : null}

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <input name="email" className="w-full rounded-lg border border-slate-300 px-4 py-3" placeholder="email" type="email" required={mode === 'create'} />
        <input name="fullName" className="w-full rounded-lg border border-slate-300 px-4 py-3" placeholder="full name" required={mode === 'create'} />
        <input name="phoneNumber" className="w-full rounded-lg border border-slate-300 px-4 py-3" placeholder="phone number" />
        {mode === 'create' ? <input name="password" className="w-full rounded-lg border border-slate-300 px-4 py-3" placeholder="temporary password" type="password" minLength={8} required /> : null}
        <select name="status" className="w-full rounded-lg border border-slate-300 px-4 py-3" defaultValue="ACTIVE">
          <option value="ACTIVE">ACTIVE</option>
          <option value="PENDING_VERIFICATION">PENDING_VERIFICATION</option>
          <option value="SUSPENDED">SUSPENDED</option>
          <option value="BLOCKED">BLOCKED</option>
        </select>
        <input name="availableBalance" className="w-full rounded-lg border border-slate-300 px-4 py-3" placeholder="available balance" inputMode="decimal" />
        <input name="investmentBalance" className="w-full rounded-lg border border-slate-300 px-4 py-3" placeholder="investment balance" inputMode="decimal" />
      </div>

      <button className="mt-5 rounded-lg bg-navy px-5 py-3 text-sm font-bold text-white">{mode === 'create' ? 'Create User' : 'Save User Details'}</button>
      {message ? <p className="mt-4 text-sm font-semibold text-emerald-700">{message}</p> : null}
      {error ? <p className="mt-4 text-sm font-semibold text-red-700">{error}</p> : null}
    </form>
  );
}

function clean(values: Record<string, string>) {
  return Object.fromEntries(Object.entries(values).filter(([, value]) => value !== '')) as Record<string, string>;
}
