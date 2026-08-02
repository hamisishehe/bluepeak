'use client';

import { useEffect, useState } from 'react';
import { api, apiErrorMessage } from '@/lib/api/client';

const intervalOptions = [
  { label: 'One minute', value: '1' },
  { label: 'One day', value: '1440' },
  { label: 'Three days', value: '4320' },
  { label: 'One week', value: '10080' },
];

type Settings = {
  minimumDeposit: string;
  maximumDeposit: string;
  weeklyReturnPercentage: string;
  profitIntervalMinutes: number;
  minimumWithdrawal: string;
  maximumWithdrawal: string;
  withdrawalFeePercentage: string;
  withdrawalFlatFee: string;
  depositsEnabled: boolean;
  withdrawalsEnabled: boolean;
  registrationEnabled: boolean;
};

const initialSettings: Settings = {
  minimumDeposit: '1000.00',
  maximumDeposit: '10000.00',
  weeklyReturnPercentage: '12.00',
  profitIntervalMinutes: 10080,
  minimumWithdrawal: '100.00',
  maximumWithdrawal: '10000.00',
  withdrawalFeePercentage: '0.00',
  withdrawalFlatFee: '0.00',
  depositsEnabled: true,
  withdrawalsEnabled: true,
  registrationEnabled: true,
};

export function AdminSettingsForm() {
  const [settings, setSettings] = useState<Settings>(initialSettings);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const response = await api.get('/api/v1/admin/settings');
        setSettings({ ...initialSettings, ...response.data });
      } catch (loadError) {
        setError(apiErrorMessage(loadError));
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  function update<K extends keyof Settings>(key: K, value: Settings[K]) {
    setSettings((current) => ({ ...current, [key]: value }));
  }

  async function submit() {
    setMessage('');
    setError('');
    try {
      await api.patch('/api/v1/admin/settings', {
        ...settings,
        profitIntervalMinutes: Number(settings.profitIntervalMinutes),
        profitIntervalDays: Number(settings.profitIntervalMinutes) / 1440,
      });
      setMessage('Settings saved successfully.');
    } catch (saveError) {
      setError(apiErrorMessage(saveError));
    }
  }

  if (loading) return <div className="mt-6 rounded-xl border border-line bg-white p-6 text-sm text-slate-600 shadow-ambient">Loading settings...</div>;

  return (
    <form action={submit} className="mt-6 rounded-xl border border-line bg-white p-6 shadow-ambient">
      <h2 className="font-headline text-xl font-bold">Investment Rules</h2>
      <p className="mt-2 text-sm text-slate-600">Set return timing and account limits used by deposits, withdrawals, and profit processing.</p>

      <label className="mt-5 block text-sm font-bold text-slate-700">
        Profit return interval
        <select className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 font-normal" value={settings.profitIntervalMinutes} onChange={(event) => update('profitIntervalMinutes', Number(event.target.value))}>
          {intervalOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      </label>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <NumberField label="Return percentage per interval" value={settings.weeklyReturnPercentage} onChange={(value) => update('weeklyReturnPercentage', value)} />
        <NumberField label="Minimum deposit" value={settings.minimumDeposit} onChange={(value) => update('minimumDeposit', value)} />
        <NumberField label="Maximum deposit" value={settings.maximumDeposit} onChange={(value) => update('maximumDeposit', value)} />
        <NumberField label="Minimum withdrawal" value={settings.minimumWithdrawal} onChange={(value) => update('minimumWithdrawal', value)} />
        <NumberField label="Maximum withdrawal" value={settings.maximumWithdrawal} onChange={(value) => update('maximumWithdrawal', value)} />
        <NumberField label="Withdrawal fee percentage" value={settings.withdrawalFeePercentage} onChange={(value) => update('withdrawalFeePercentage', value)} />
        <NumberField label="Withdrawal flat fee" value={settings.withdrawalFlatFee} onChange={(value) => update('withdrawalFlatFee', value)} />
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <Toggle label="Deposits enabled" checked={settings.depositsEnabled} onChange={(value) => update('depositsEnabled', value)} />
        <Toggle label="Withdrawals enabled" checked={settings.withdrawalsEnabled} onChange={(value) => update('withdrawalsEnabled', value)} />
        <Toggle label="Registration enabled" checked={settings.registrationEnabled} onChange={(value) => update('registrationEnabled', value)} />
      </div>

      <button className="mt-5 rounded-lg bg-navy px-5 py-3 text-sm font-bold text-white">Save Settings</button>
      {message ? <p className="mt-4 text-sm font-semibold text-emerald-700">{message}</p> : null}
      {error ? <p className="mt-4 text-sm font-semibold text-red-700">{error}</p> : null}
    </form>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block text-sm font-bold text-slate-700">
      {label}
      <input className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 font-normal" inputMode="decimal" value={value} onChange={(event) => onChange(event.target.value)} required />
    </label>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="flex items-center gap-3 rounded-lg border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      {label}
    </label>
  );
}
