'use client';

import { useState } from 'react';
import { api, apiErrorMessage } from '@/lib/api/client';

export function DepositForm() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  async function submit(formData: FormData) {
    setError('');
    setMessage('');
    try {
      await api.post('/api/v1/deposits', {
        amount: String(formData.get('amount') ?? ''),
        paymentNetwork: String(formData.get('paymentNetwork') ?? 'TRC20'),
        transactionReference: String(formData.get('transactionReference') ?? ''),
        paymentProofUrl: String(formData.get('paymentProofUrl') ?? '') || undefined,
      });
      setMessage('Deposit submitted for review. It will become an investment after admin approval.');
      window.dispatchEvent(new Event('fxpro:records-changed'));
    } catch (err) {
      setError(apiErrorMessage(err));
    }
  }
  return <WorkflowShell title="Make a Deposit" message={message} error={error} submit={submit} fields={['amount', 'transactionReference', 'paymentProofUrl']} selectName="paymentNetwork" />;
}

export function WithdrawalForm() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  async function submit(formData: FormData) {
    setError('');
    setMessage('');
    try {
      await api.post('/api/v1/withdrawals', {
        amount: String(formData.get('amount') ?? ''),
        network: String(formData.get('network') ?? 'TRC20'),
        walletAddress: String(formData.get('walletAddress') ?? ''),
      });
      setMessage('Withdrawal requested.');
      window.dispatchEvent(new Event('fxpro:records-changed'));
    } catch (err) {
      setError(apiErrorMessage(err));
    }
  }
  return <WorkflowShell title="Request Withdrawal" message={message} error={error} submit={submit} fields={['amount', 'walletAddress']} selectName="network" />;
}

export function WalletForm() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  async function submit(formData: FormData) {
    setError('');
    setMessage('');
    try {
      await api.post('/api/v1/wallet-addresses', {
        network: String(formData.get('network') ?? 'TRC20'),
        address: String(formData.get('address') ?? ''),
      });
      setMessage('Wallet address saved.');
      window.dispatchEvent(new Event('fxpro:records-changed'));
    } catch (err) {
      setError(apiErrorMessage(err));
    }
  }
  return <WorkflowShell title="Add Wallet Address" message={message} error={error} submit={submit} fields={['address']} selectName="network" />;
}

function WorkflowShell({ title, fields, selectName, submit, message, error }: { title: string; fields: string[]; selectName: string; submit: (formData: FormData) => Promise<void>; message: string; error: string }) {
  return (
    <form action={submit} className="mt-6 rounded-xl border border-line bg-white p-6 shadow-ambient">
      <h2 className="font-headline text-xl font-bold">{title}</h2>
      <select name={selectName} className="mt-5 w-full rounded-lg border border-slate-300 px-4 py-3">
        <option value="TRC20">TRC20</option>
        <option value="BEP20">BEP20</option>
      </select>
      {fields.map((field) => <input key={field} name={field} className="mt-4 w-full rounded-lg border border-slate-300 px-4 py-3" placeholder={field} required={field !== 'paymentProofUrl'} />)}
      <button className="mt-5 rounded-lg bg-royal px-5 py-3 text-sm font-bold text-white">Submit</button>
      {message ? <p className="mt-4 text-sm font-semibold text-emerald-700">{message}</p> : null}
      {error ? <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p> : null}
    </form>
  );
}
