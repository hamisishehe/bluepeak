import { ChevronRight, Home } from 'lucide-react';

export function FeaturePage({ eyebrow, title, description }: { eyebrow: string; title: string; description: string; actions?: string[] }) {
  return (
    <header className="mb-6">
      <nav className="flex flex-wrap items-center gap-2 text-sm font-semibold text-muted" aria-label="Breadcrumb">
        <a className="inline-flex items-center gap-1 hover:text-royal" href={eyebrow === 'Investor' ? '/dashboard' : '/admin'}>
          <Home size={15} />
          {eyebrow}
        </a>
        <ChevronRight size={15} />
        <span className="text-ink">{title}</span>
      </nav>
      <div className="mt-4 flex flex-col gap-3 border-b border-line pb-5">
        <h1 className="font-headline text-3xl font-bold text-ink">{title}</h1>
        <p className="max-w-3xl text-sm leading-6 text-muted">{description}</p>
      </div>
    </header>
  );
}
