'use client';

import { useEffect, useMemo, useState } from 'react';
import { DataTable, type DataRow } from './data-table';
import { MetricCard } from './metric-card';
import { api, apiErrorMessage } from '@/lib/api/client';

type ApiRow = DataRow & { amount?: string; principalAmount?: string; profitAmount?: string; investmentBalance?: string; availableBalance?: string; role?: string; status?: string; type?: string; createdAt?: string };

const endpoints = {
  users: '/api/v1/admin/users',
  deposits: '/api/v1/admin/deposits',
  withdrawals: '/api/v1/admin/withdrawals',
  investments: '/api/v1/admin/investments',
  profits: '/api/v1/admin/profits',
  transactions: '/api/v1/admin/transactions',
};

function money(value: unknown) {
  const amount = Number(value ?? 0);
  return Number.isFinite(amount) ? amount : 0;
}

function formatMoney(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

function sum(rows: ApiRow[], key: keyof ApiRow) {
  return rows.reduce((total, row) => total + money(row[key]), 0);
}

export function AdminDashboard() {
  const [rows, setRows] = useState<Record<keyof typeof endpoints, ApiRow[]>>({
    users: [],
    deposits: [],
    withdrawals: [],
    investments: [],
    profits: [],
    transactions: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      const responses = await Promise.all(Object.entries(endpoints).map(async ([key, url]) => {
        const response = await api.get(url);
        return [key, Array.isArray(response.data) ? response.data : []] as const;
      }));
      setRows(Object.fromEntries(responses) as Record<keyof typeof endpoints, ApiRow[]>);
    } catch (loadError) {
      setError(apiErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const metrics = useMemo(() => {
    const pendingDeposits = rows.deposits.filter((row) => row.status === 'PENDING');
    const openWithdrawals = rows.withdrawals.filter((row) => ['PENDING', 'APPROVED', 'PROCESSING'].includes(String(row.status)));
    const activeInvestments = rows.investments.filter((row) => row.status === 'ACTIVE');
    const creditedProfits = rows.profits.filter((row) => row.status === 'CREDITED');
    return {
      pendingDeposits,
      openWithdrawals,
      activeInvestments,
      pendingDepositAmount: sum(pendingDeposits, 'amount'),
      openWithdrawalAmount: sum(openWithdrawals, 'amount'),
      platformAum: sum(activeInvestments, 'principalAmount'),
      totalProfitCredited: sum(creditedProfits, 'amount') || sum(creditedProfits, 'profitAmount'),
      investorBalances: rows.users.reduce((total, row) => total + money(row.availableBalance) + money(row.investmentBalance), 0),
    };
  }, [rows]);

  const reviewQueue = useMemo(() => {
    const deposits = metrics.pendingDeposits.map((row) => ({ ...row, queueType: 'Deposit', queueAmount: row.amount, action: 'Approve or reject' }));
    const withdrawals = metrics.openWithdrawals.map((row) => ({ ...row, queueType: 'Withdrawal', queueAmount: row.amount, action: 'Review payout' }));
    return [...deposits, ...withdrawals]
      .sort((a, b) => String(b.createdAt ?? '').localeCompare(String(a.createdAt ?? '')))
      .slice(0, 12);
  }, [metrics.openWithdrawals, metrics.pendingDeposits]);

  return (
    <>
      <header className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-muted">Operations</p>
        <h1 className="font-headline text-3xl font-bold">Administration Dashboard</h1>
        {error ? <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p> : null}
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        <MetricCard label="Pending Deposits" value={formatMoney(metrics.pendingDepositAmount)} delta={`${metrics.pendingDeposits.length} pending`} />
        <MetricCard label="Withdrawal Queue" value={formatMoney(metrics.openWithdrawalAmount)} delta={`${metrics.openWithdrawals.length} open`} />
        <MetricCard label="Platform AUM" value={formatMoney(metrics.platformAum)} delta={`${metrics.activeInvestments.length} active`} />
        <MetricCard label="Investors" value={String(rows.users.filter((row) => row.role === 'USER').length)} delta={`${rows.users.filter((row) => row.status === 'ACTIVE').length} active`} />
        <MetricCard label="Profit Credited" value={formatMoney(metrics.totalProfitCredited)} delta={`${rows.profits.length} records`} />
        <MetricCard label="Client Balances" value={formatMoney(metrics.investorBalances)} delta="live total" />
      </div>

      <DataTable
        title="Live Review Queue"
        columns={['queueType', 'id', 'userId', 'queueAmount', 'status', 'action', 'createdAt']}
        rows={reviewQueue}
        loading={loading}
        error=""
        onRefresh={load}
      />

      <DataTable
        title="Recent Transactions"
        columns={['id', 'userId', 'type', 'amount', 'status', 'createdAt']}
        rows={rows.transactions.slice(0, 12)}
        loading={loading}
        error=""
        onRefresh={load}
      />
    </>
  );
}
