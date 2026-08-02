'use client';

import { Headphones, Plus } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { menus, type Role } from '@/lib/navigation';
import { LogoutButton } from './logout-button';

export function Sidebar({ role, title }: { role: Role; title: string }) {
  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-[280px] lg:block">
      <SidebarContent role={role} title={title} />
    </aside>
  );
}

export function SidebarContent({ role, title, onNavigate }: { role: Role; title: string; onNavigate?: () => void }) {
  const items = menus[role];
  const pathname = usePathname();
  return (
    <div className="flex h-full min-h-0 flex-col bg-navy px-4 py-6 text-white shadow-ambient">
      <div className="mb-6 flex shrink-0 items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-royal shadow-focus">
          <span className="font-headline text-lg font-bold">FX</span>
        </div>
        <div>
          <h1 className="font-headline text-xl font-bold leading-none">BluePeak Capital</h1>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
        </div>
      </div>
      <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
        {items.map((item, index) => {
          const Icon = item.icon;
          const active = pathname === item.href || (item.href !== '/admin' && item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <a
              className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold transition ${active || index === 0 && pathname === item.href ? 'border-l-4 border-royal bg-white/10 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}
              href={item.href}
              key={item.href}
              onClick={onNavigate}
            >
              <Icon size={20} />
              {item.label}
            </a>
          );
        })}
      </nav>
      <div className="mt-4 shrink-0 border-t border-white/10 pt-4">
        <button className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg bg-royal px-4 py-3 text-sm font-bold shadow-focus">
          <Plus size={18} />
          New Investment
        </button>
        <a className="flex items-center gap-3 px-4 py-2 text-sm font-semibold text-slate-300" href="#">
          <Headphones size={18} />
          Support
        </a>
        <LogoutButton />
      </div>
    </div>
  );
}
