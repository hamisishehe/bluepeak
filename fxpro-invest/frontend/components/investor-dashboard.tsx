'use client';

import { useEffect, useMemo, useState } from 'react';
import { Copy, Link as LinkIcon } from 'lucide-react';
import { MetricCard } from '@/components/metric-card';
import { UserResourceTable } from '@/components/user-resource-table';
import { api } from '@/lib/api/client';

type Profile = {
  fullName: string;
  referralCode: string;
  availableBalance: string;
  reservedBalance: string;
  investmentBalance: string;
  totalProfit: string;
  totalReferralEarnings: string;
  totalWithdrawn: string;
};

function usd(value?: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value ?? 0));
}

export function InvestorDashboard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/api/v1/auth/me').then((response) => setProfile(response.data)).catch(() => setMessage('Sign in again to load account data.'));
  }, []);

  const referralLink = useMemo(() => {
    if (!profile) return '';
    const origin = typeof window === 'undefined' ? 'http://localhost:3000' : window.location.origin;
    return `${origin}/register?ref=${profile.referralCode}`;
  }, [profile]);

  function copyReferral() {
    if (!referralLink) return;
    void navigator.clipboard.writeText(referralLink);
    setMessage('Referral link copied.');
  }

  return (
    <>
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-muted">Welcome back</p>
          <h1 className="font-headline text-3xl font-bold">{profile?.fullName ?? 'Investor'} Overview</h1>
        </div>
        <a className="rounded-lg bg-royal px-5 py-3 text-sm font-bold text-white shadow-ambient" href="/dashboard/deposits">Make a Deposit</a>
      </header>

      {message ? <p className="mb-5 rounded-lg bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">{message}</p> : null}

      <div className="grid gap-6 md:grid-cols-3">
        <MetricCard label="Available Balance" value={usd(profile?.availableBalance)} delta="Live" />
        <MetricCard label="Active Investments" value={usd(profile?.investmentBalance)} delta="Live" />
        <MetricCard label="Total Profit" value={usd(profile?.totalProfit)} delta="Live" />
      </div>

      <section className="mt-6 rounded-xl border border-line bg-white p-6 shadow-ambient">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-royal"><LinkIcon size={18} /><p className="text-sm font-bold uppercase tracking-wider">Referral Link</p></div>
            <p className="mt-2 break-all font-mono text-sm text-ink">{referralLink || 'Loading referral link...'}</p>
            <p className="mt-2 text-sm text-muted">Referral earnings: <span className="tabular font-bold text-ink">{usd(profile?.totalReferralEarnings)}</span></p>
          </div>
          <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-navy px-5 py-3 text-sm font-bold text-white" onClick={copyReferral} type="button">
            <Copy size={16} />
            Copy Link
          </button>
        </div>
      </section>

      <UserResourceTable resource="transactions" title="Recent Transactions" />
    </>
  );
}

