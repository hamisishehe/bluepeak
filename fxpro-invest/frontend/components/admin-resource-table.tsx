'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api/client';
import { DataTable, type DataRow } from './data-table';

const columns: Record<string, string[]> = {
  users: ['email', 'role', 'status', 'availableBalance', 'investmentBalance'],
  deposits: ['id', 'userId', 'amount', 'paymentNetwork', 'status'],
  investments: ['id', 'userId', 'principalAmount', 'weeklyProfitAmount', 'status'],
  profits: ['id', 'userId', 'profitAmount', 'status', 'scheduledDate'],
  withdrawals: ['id', 'userId', 'amount', 'netAmount', 'status'],
  referrals: ['id', 'referrerUserId', 'referredUserId', 'amount', 'reversed'],
  transactions: ['id', 'userId', 'type', 'amount', 'status'],
  'audit-logs': ['action', 'entityType', 'entityId', 'createdAt'],
  administrators: ['email', 'role', 'status', 'mustChangePassword'],
};

export function AdminResourceTable({ resource, title }: { resource: keyof typeof columns; title: string }) {
  const [rows, setRows] = useState<DataRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/api/v1/admin/${resource}`);
      setRows(Array.isArray(response.data) ? response.data : []);
    } catch {
      setError('Unable to load records. Sign in again or check API permissions.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    function handleRecordsChanged(event: Event) {
      const changedResource = (event as CustomEvent<{ resource?: string }>).detail?.resource;
      if (!changedResource || changedResource === resource) void load();
    }
    window.addEventListener('fxpro:records-changed', handleRecordsChanged);
    return () => window.removeEventListener('fxpro:records-changed', handleRecordsChanged);
  }, [resource]);

  return (
    <DataTable title={title} columns={columns[resource]} rows={rows} loading={loading} error={error} onRefresh={load} />
  );
}
