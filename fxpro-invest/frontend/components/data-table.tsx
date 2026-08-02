'use client';

import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Copy, Search } from 'lucide-react';

export type DataRow = Record<string, string | number | boolean | null | undefined>;

function formatValue(value: DataRow[string]) {
  if (value === null || value === undefined || value === '') return '-';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  const text = String(value);
  if (/^\d{4}-\d{2}-\d{2}T/.test(text)) return new Date(text).toLocaleString();
  return text;
}

function statusClass(value: string) {
  const normalized = value.toUpperCase();
  if (['ACTIVE', 'APPROVED', 'CREDITED', 'PAID', 'POSTED', 'YES'].includes(normalized)) return 'bg-emerald-50 text-emerald-700';
  if (['PENDING', 'PROCESSING'].includes(normalized)) return 'bg-amber-50 text-amber-700';
  if (['REJECTED', 'FAILED', 'BLOCKED', 'SUSPENDED', 'CANCELLED'].includes(normalized)) return 'bg-red-50 text-red-700';
  return 'bg-slate-100 text-slate-700';
}

export function DataTable({ title, columns, rows, loading, error, onRefresh }: { title: string; columns: string[]; rows: DataRow[]; loading: boolean; error: string; onRefresh: () => void }) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) => columns.some((column) => String(row[column] ?? '').toLowerCase().includes(q)));
  }, [columns, query, rows]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visibleRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <section className="mt-6 rounded-xl border border-line bg-white p-4 shadow-ambient sm:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="font-headline text-xl font-bold">{title}</h2>
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-muted">
            <Search size={16} />
            <input className="w-full bg-transparent text-sm outline-none" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Search table" />
          </label>
          <button className="rounded-lg border border-line px-4 py-2 text-sm font-bold text-muted" onClick={onRefresh} type="button">Refresh</button>
        </div>
      </div>
      {loading ? <p className="mt-6 text-sm font-semibold text-muted">Loading records...</p> : null}
      {error ? <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p> : null}
      {!loading && !error && filtered.length === 0 ? <p className="mt-6 text-sm font-semibold text-muted">No records yet.</p> : null}
      {filtered.length > 0 ? (
        <>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-muted">
                <tr>{columns.map((column) => <th className="p-3" key={column}>{column}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-line">
                {visibleRows.map((row, index) => (
                  <tr className="hover:bg-slate-50" key={String(row.id ?? index)}>
                    {columns.map((column) => {
                      const value = formatValue(row[column]);
                      const isStatus = ['status', 'role', 'active', 'read', 'reversed', 'mustChangePassword'].includes(column);
                      const copyable = ['id', 'userId', 'depositId', 'investmentId'].includes(column) && value !== '-';
                      return (
                        <td className="max-w-[260px] p-3 tabular" key={column}>
                          <span className={isStatus ? `rounded-full px-2.5 py-1 text-xs font-bold ${statusClass(value)}` : 'inline-flex max-w-full items-center gap-2 truncate'}>
                            <span className="truncate">{value}</span>
                            {copyable ? <button type="button" title="Copy" onClick={() => navigator.clipboard.writeText(value)}><Copy size={14} /></button> : null}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm text-muted">
            <span>{filtered.length} records</span>
            <div className="flex items-center gap-2">
              <button className="rounded-lg border border-line p-2 disabled:opacity-40" disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))} type="button"><ChevronLeft size={16} /></button>
              <span className="font-semibold">Page {page} of {totalPages}</span>
              <button className="rounded-lg border border-line p-2 disabled:opacity-40" disabled={page === totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))} type="button"><ChevronRight size={16} /></button>
            </div>
          </div>
        </>
      ) : null}
    </section>
  );
}

