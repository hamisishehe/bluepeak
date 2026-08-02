'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
import { Menu, X } from 'lucide-react';
import { SidebarContent } from './sidebar';
import { SiteHeader } from './site-header';
import type { Role } from '@/lib/navigation';

export function AppShell({ role, title, roleLabel, children }: { role: Role; title: string; roleLabel: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <main className="min-h-screen bg-surface lg:pl-[280px]">
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[280px] lg:block">
        <SidebarContent role={role} title={roleLabel} />
      </aside>
      <div className={`${open ? 'fixed' : 'hidden'} inset-0 z-50 lg:hidden`}>
        <button className="absolute inset-0 bg-slate-950/50" onClick={() => setOpen(false)} aria-label="Close menu" type="button" />
        <aside className="relative h-full w-[min(86vw,320px)] bg-navy shadow-focus">
          <button className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white" onClick={() => setOpen(false)} aria-label="Close menu" type="button">
            <X size={20} />
          </button>
          <SidebarContent role={role} title={roleLabel} onNavigate={() => setOpen(false)} />
        </aside>
      </div>
      <SiteHeader title={title} roleLabel={roleLabel} menuButton={<button className="flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-white text-muted lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu" type="button"><Menu size={20} /></button>} />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">{children}</div>
    </main>
  );
}
