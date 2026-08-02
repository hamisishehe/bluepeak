'use client';

import { LogOut } from 'lucide-react';
import { clearAuth } from '@/lib/api/client';

export function LogoutButton({ compact = false }: { compact?: boolean }) {
  function logout() {
    clearAuth();
    window.location.href = '/login';
  }

  return (
    <button
      className={`${compact ? 'h-10 w-10 justify-center rounded-lg border border-line bg-white text-muted' : 'flex w-full items-center gap-3 px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white'}`}
      onClick={logout}
      title="Logout"
      type="button"
    >
      <LogOut size={18} />
      {compact ? null : 'Logout'}
    </button>
  );
}

