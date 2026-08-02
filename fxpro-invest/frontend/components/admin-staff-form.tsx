'use client';

import { useState } from 'react';
import { api, apiErrorMessage } from '@/lib/api/client';

export function AdminStaffForm() {
  const [mode, setMode] = useState<'create' | 'edit' | 'reset-password'>('create');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function submit(formData: FormData) {
    const id = String(formData.get('id') ?? '').trim();
    const payload = clean({
      fullName: String(formData.get('fullName') ?? '').trim(),
      email: String(formData.get('email') ?? '').trim(),
      password: String(formData.get('password') ?? ''),
      newPassword: String(formData.get('newPassword') ?? ''),
      role: String(formData.get('role') ?? ''),
      status: String(formData.get('status') ?? ''),
    });
    setMessage('');
    setError('');

    if (mode !== 'create' && !id) {
      setError('Administrator ID is required.');
      return;
    }
    if (mode === 'create' && (!payload.fullName || !payload.email || !payload.password)) {
      setError('Full name, email, and password are required.');
      return;
    }
    if (mode === 'reset-password' && !payload.newPassword) {
      setError('New password is required.');
      return;
    }

    try {
      if (mode === 'create') {
        await api.post('/api/v1/admin/administrators', payload);
      } else if (mode === 'edit') {
        delete payload.password;
        delete payload.newPassword;
        await api.patch(`/api/v1/admin/administrators/${id}`, payload);
      } else {
        await api.patch(`/api/v1/admin/administrators/${id}/reset-password`, { newPassword: payload.newPassword });
      }
      setMessage(mode === 'create' ? 'Administrator created successfully.' : 'Administrator updated successfully.');
      window.dispatchEvent(new CustomEvent('fxpro:records-changed', { detail: { resource: 'administrators' } }));
    } catch (staffError) {
      setError(apiErrorMessage(staffError));
    }
  }

  return (
    <form action={submit} className="mt-6 rounded-xl border border-line bg-white p-6 shadow-ambient">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="font-headline text-xl font-bold">Administrator Account</h2>
          <p className="mt-2 text-sm text-slate-600">Create admin or super admin accounts, edit details, and reset passwords.</p>
        </div>
        <select className="rounded-lg border border-slate-300 px-4 py-3 text-sm font-bold" value={mode} onChange={(event) => setMode(event.target.value as 'create' | 'edit' | 'reset-password')}>
          <option value="create">create admin</option>
          <option value="edit">edit admin</option>
          <option value="reset-password">reset password</option>
        </select>
      </div>

      {mode !== 'create' ? <input name="id" className="mt-5 w-full rounded-lg border border-slate-300 px-4 py-3" placeholder="administrator id" required /> : null}

      {mode !== 'reset-password' ? (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <input name="fullName" className="w-full rounded-lg border border-slate-300 px-4 py-3" placeholder="full name" required={mode === 'create'} />
          <input name="email" className="w-full rounded-lg border border-slate-300 px-4 py-3" placeholder="email" type="email" required={mode === 'create'} />
          {mode === 'create' ? <input name="password" className="w-full rounded-lg border border-slate-300 px-4 py-3" placeholder="temporary password" type="password" minLength={8} required /> : null}
          <select name="role" className="w-full rounded-lg border border-slate-300 px-4 py-3" defaultValue="ADMIN">
            <option value="ADMIN">ADMIN</option>
            <option value="SUPER_ADMIN">SUPER_ADMIN</option>
          </select>
          <select name="status" className="w-full rounded-lg border border-slate-300 px-4 py-3" defaultValue="ACTIVE">
            <option value="ACTIVE">ACTIVE</option>
            <option value="SUSPENDED">SUSPENDED</option>
            <option value="BLOCKED">BLOCKED</option>
          </select>
        </div>
      ) : (
        <input name="newPassword" className="mt-4 w-full rounded-lg border border-slate-300 px-4 py-3" placeholder="new password" type="password" minLength={8} required />
      )}

      <button className="mt-5 rounded-lg bg-navy px-5 py-3 text-sm font-bold text-white">
        {mode === 'create' ? 'Create Administrator' : mode === 'edit' ? 'Save Administrator' : 'Reset Password'}
      </button>
      {message ? <p className="mt-4 text-sm font-semibold text-emerald-700">{message}</p> : null}
      {error ? <p className="mt-4 text-sm font-semibold text-red-700">{error}</p> : null}
    </form>
  );
}

function clean(values: Record<string, string>) {
  return Object.fromEntries(Object.entries(values).filter(([, value]) => value !== '')) as Record<string, string>;
}
