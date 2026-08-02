import { TrendingUp } from 'lucide-react';

export function MetricCard({ label, value, delta }: { label: string; value: string; delta: string }) {
  return (
    <section className="rounded-xl border border-line bg-white p-6 shadow-ambient">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted">{label}</p>
          <h3 className="tabular mt-2 font-headline text-3xl font-bold text-ink">{value}</h3>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
          <TrendingUp size={14} />
          {delta}
        </span>
      </div>
    </section>
  );
}

