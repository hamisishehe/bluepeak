import { Bell, Search } from 'lucide-react';
import type { ReactNode } from 'react';
import { LogoutButton } from './logout-button';

export function SiteHeader({ title, roleLabel, menuButton }: { title: string; roleLabel: string; menuButton?: ReactNode }) {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-6">
        <div className="flex min-w-0 items-center gap-3">
          {menuButton}
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-muted">{roleLabel}</p>
            <h1 className="truncate font-headline text-xl font-bold text-ink sm:text-2xl">{title}</h1>
          </div>
        </div>
        <div className="hidden min-w-0 flex-1 justify-center md:flex">
          <label className="flex w-full max-w-md items-center gap-2 rounded-full border border-line bg-slate-50 px-4 py-2 text-muted">
            <Search size={18} />
            <input className="w-full bg-transparent text-sm outline-none" placeholder="Search records..." />
          </label>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-white text-muted" type="button">
            <Bell size={18} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
          </button>
          <div className="hidden text-right sm:block">
            <p className="text-sm font-bold text-ink">BluePeak Account</p>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">{roleLabel}</p>
          </div>
          <LogoutButton compact />
        </div>
      </div>
    </header>
  );
}
