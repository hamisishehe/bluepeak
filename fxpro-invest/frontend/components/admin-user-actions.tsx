'use client';

import { useState } from 'react';
import { api, apiErrorMessage } from '@/lib/api/client';

export function AdminUserActions() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [selectedAction, setSelectedAction] = useState('block');

  async function submit(formData: FormData) {
    const id = String(formData.get('id') ?? '').trim();
    const action = String(formData.get('action') ?? '');
    const confirmDelete = String(formData.get('confirmDelete') ?? '').trim();
    const newPassword = String(formData.get('newPassword') ?? '');
    setMessage('');
    setError('');

    if (action === 'delete' && confirmDelete !== 'DELETE') {
      setError('Type DELETE to confirm account deletion.');
      return;
    }
    if (action === 'reset-password' && newPassword.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }

    try {
      if (action === 'delete') {
        await api.delete(`/api/v1/admin/users/${id}`);
      } else if (action === 'reset-password') {
        await api.patch(`/api/v1/admin/users/${id}/reset-password`, { newPassword });
      } else {
        await api.patch(`/api/v1/admin/users/${id}/${action}`);
      }
      setMessage(`User ${action} completed.`);
      window.dispatchEvent(new CustomEvent('fxpro:records-changed', { detail: { resource: 'users' } }));
    } catch (actionError) {
      setError(apiErrorMessage(actionError));
    }
  }

  return (
    <form action={submit} className="mt-6 rounded-xl border border-line bg-white p-6 shadow-ambient">
      <h2 className="font-headline text-xl font-bold">User Actions</h2>
      <p className="mt-2 text-sm text-slate-600">Block, activate, reset password, or delete investor accounts. Copy the user ID from the table.</p>
      <input name="id" className="mt-5 w-full rounded-lg border border-slate-300 px-4 py-3" placeholder="user id" required />
      <select name="action" className="mt-4 w-full rounded-lg border border-slate-300 px-4 py-3" value={selectedAction} onChange={(event) => setSelectedAction(event.target.value)}>
        <option value="block">block</option>
        <option value="activate">activate</option>
        <option value="reset-password">reset password</option>
        <option value="delete">delete</option>
      </select>
      {selectedAction === 'reset-password' ? (
        <input name="newPassword" className="mt-4 w-full rounded-lg border border-slate-300 px-4 py-3" placeholder="new password" type="password" minLength={8} required />
      ) : null}
      {selectedAction === 'delete' ? (
        <input name="confirmDelete" className="mt-4 w-full rounded-lg border border-slate-300 px-4 py-3" placeholder="Type DELETE when deleting" />
      ) : null}
      <button className="mt-5 rounded-lg bg-navy px-5 py-3 text-sm font-bold text-white">Run User Action</button>
      {message ? <p className="mt-4 text-sm font-semibold text-emerald-700">{message}</p> : null}
      {error ? <p className="mt-4 text-sm font-semibold text-red-700">{error}</p> : null}
    </form>
  );
}
