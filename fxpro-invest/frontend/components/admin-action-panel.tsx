'use client';

import { useState } from 'react';
import { api, apiErrorMessage } from '@/lib/api/client';

export function AdminActionPanel({ resource }: { resource: 'deposits' | 'withdrawals' }) {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  async function submit(formData: FormData) {
    const id = String(formData.get('id') ?? '').trim();
    const action = String(formData.get('action') ?? '');
    const reason = String(formData.get('reason') ?? '').trim() || 'Reviewed by administrator';
    setMessage('');
    setError('');
    try {
      await api.patch(`/api/v1/admin/${resource}/${id}/${action}`, { reason });
      setMessage(`${resource.slice(0, -1)} ${action} completed.`);
      window.dispatchEvent(new CustomEvent('fxpro:records-changed', { detail: { resource } }));
    } catch (actionError) {
      setError(apiErrorMessage(actionError));
    }
  }
  const actions = resource === 'deposits' ? ['approve', 'reject'] : ['approve', 'process', 'pay', 'reject'];
  return (
    <form action={submit} className="mt-6 rounded-xl border border-line bg-white p-6 shadow-ambient">
      <h2 className="font-headline text-xl font-bold">Admin Action</h2>
      <p className="mt-2 text-sm text-slate-600">Only pending records can be approved or rejected. Copy the ID from the table.</p>
      <input name="id" className="mt-5 w-full rounded-lg border border-slate-300 px-4 py-3" placeholder={`${resource.slice(0, -1)} id`} required />
      <select name="action" className="mt-4 w-full rounded-lg border border-slate-300 px-4 py-3">{actions.map((action) => <option key={action}>{action}</option>)}</select>
      <input name="reason" className="mt-4 w-full rounded-lg border border-slate-300 px-4 py-3" placeholder="Reason" />
      <button className="mt-5 rounded-lg bg-navy px-5 py-3 text-sm font-bold text-white">Run Action</button>
      {message ? <p className="mt-4 text-sm font-semibold text-emerald-700">{message}</p> : null}
      {error ? <p className="mt-4 text-sm font-semibold text-red-700">{error}</p> : null}
    </form>
  );
}
