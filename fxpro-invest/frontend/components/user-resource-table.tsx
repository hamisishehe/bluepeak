'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api/client';
import { DataTable, type DataRow } from './data-table';

const columns = {
  deposits: ['id', 'amount', 'paymentNetwork', 'status', 'createdAt'],
  investments: ['id', 'principalAmount', 'weeklyProfitAmount', 'status', 'nextProfitDate'],
  profits: ['id', 'profitAmount', 'status', 'scheduledDate', 'creditedAt'],
  withdrawals: ['id', 'amount', 'netAmount', 'network', 'status'],
  'wallet-addresses': ['id', 'network', 'address', 'active'],
  referrals: ['id', 'referredUserId', 'amount', 'reversed', 'createdAt'],
  transactions: ['id', 'type', 'amount', 'status', 'createdAt'],
  notifications: ['title', 'body', 'read', 'createdAt'],
} as const;

export function UserResourceTable({ resource, title }: { resource: keyof typeof columns; title: string }) {
  const [rows, setRows] = useState<DataRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/api/v1/${resource}`);
      setRows(Array.isArray(response.data) ? response.data : []);
    } catch {
      setError('Unable to load records. Sign in again or check your session.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    window.addEventListener('fxpro:records-changed', load);
    return () => window.removeEventListener('fxpro:records-changed', load);
  }, []);

  return (
    <DataTable title={title} columns={[...columns[resource]]} rows={rows} loading={loading} error={error} onRefresh={load} />
  );
}
