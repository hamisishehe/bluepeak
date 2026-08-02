'use client';

import { useState } from 'react';
import { api, apiErrorMessage } from '@/lib/api/client';

export function AdminDepositForm() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function submit(formData: FormData) {
    const payload = {
      userId: String(formData.get('userId') ?? '').trim(),
      amount: String(formData.get('amount') ?? '').trim(),
      paymentNetwork: String(formData.get('paymentNetwork') ?? ''),
      transactionReference: String(formData.get('transactionReference') ?? '').trim(),
      paymentProofUrl: String(formData.get('paymentProofUrl') ?? '').trim() || undefined,
    };
    setMessage('');
    setError('');
    try {
      await api.post('/api/v1/admin/deposits', payload);
      setMessage('Deposit added as pending. Approve it to create the investment.');
      window.dispatchEvent(new CustomEvent('fxpro:records-changed', { detail: { resource: 'deposits' } }));
    } catch (depositError) {
      setError(apiErrorMessage(depositError));
    }
  }

  return (
    <form action={submit} className="mt-6 rounded-xl border border-line bg-white p-6 shadow-ambient">
      <h2 className="font-headline text-xl font-bold">Add User Deposit</h2>
      <p className="mt-2 text-sm text-slate-600">Create a pending deposit for an investor. Approval will create the investment automatically.</p>
      <input name="userId" className="mt-5 w-full rounded-lg border border-slate-300 px-4 py-3" placeholder="user id" required />
      <input name="amount" className="mt-4 w-full rounded-lg border border-slate-300 px-4 py-3" placeholder="amount" inputMode="decimal" required />
      <select name="paymentNetwork" className="mt-4 w-full rounded-lg border border-slate-300 px-4 py-3" defaultValue="TRC20">
        <option value="TRC20">USDT TRC20</option>
        <option value="BEP20">USDT BEP20</option>
      </select>
      <input name="transactionReference" className="mt-4 w-full rounded-lg border border-slate-300 px-4 py-3" placeholder="transaction reference" required />
      <input name="paymentProofUrl" className="mt-4 w-full rounded-lg border border-slate-300 px-4 py-3" placeholder="payment proof url optional" />
      <button className="mt-5 rounded-lg bg-navy px-5 py-3 text-sm font-bold text-white">Add Deposit</button>
      {message ? <p className="mt-4 text-sm font-semibold text-emerald-700">{message}</p> : null}
      {error ? <p className="mt-4 text-sm font-semibold text-red-700">{error}</p> : null}
    </form>
  );
}
