import { BarChart3, Bell, CreditCard, Gauge, HandCoins, Landmark, Lock, Settings, ShieldCheck, UserCircle, Users, WalletCards, type LucideIcon } from 'lucide-react';

export type Role = 'USER' | 'ADMIN' | 'SUPER_ADMIN';

export const menus = {
  USER: [
    { label: 'Dashboard', href: '/dashboard', icon: Gauge },
    { label: 'Investments', href: '/dashboard/investments', icon: Landmark },
    { label: 'Deposits', href: '/dashboard/deposits', icon: CreditCard },
    { label: 'Weekly Returns', href: '/dashboard/profits', icon: HandCoins },
    { label: 'Withdrawals', href: '/dashboard/withdrawals', icon: WalletCards },
    { label: 'Wallet Addresses', href: '/dashboard/wallet-addresses', icon: WalletCards },
    { label: 'Referrals', href: '/dashboard/referrals', icon: Users },
    { label: 'Transactions', href: '/dashboard/transactions', icon: CreditCard },
    { label: 'Notifications', href: '/dashboard/notifications', icon: Bell },
    { label: 'Profile', href: '/dashboard/profile', icon: UserCircle },
    { label: 'Security', href: '/dashboard/security', icon: Lock },
  ],
  ADMIN: [
    { label: 'Dashboard', href: '/admin', icon: BarChart3 },
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'Deposits', href: '/admin/deposits', icon: CreditCard },
    { label: 'Investments', href: '/admin/investments', icon: Landmark },
    { label: 'Weekly Returns', href: '/admin/profits', icon: HandCoins },
    { label: 'Withdrawals', href: '/admin/withdrawals', icon: WalletCards },
    { label: 'Referrals', href: '/admin/referrals', icon: Users },
    { label: 'Transactions', href: '/admin/transactions', icon: CreditCard },
    { label: 'Notifications', href: '/admin/notifications', icon: Bell },
    { label: 'Profile', href: '/admin/profile', icon: UserCircle },
  ],
  SUPER_ADMIN: [
    { label: 'Dashboard', href: '/admin', icon: BarChart3 },
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'Deposits', href: '/admin/deposits', icon: CreditCard },
    { label: 'Investments', href: '/admin/investments', icon: Landmark },
    { label: 'Weekly Returns', href: '/admin/profits', icon: HandCoins },
    { label: 'Withdrawals', href: '/admin/withdrawals', icon: WalletCards },
    { label: 'Referrals', href: '/admin/referrals', icon: Users },
    { label: 'Transactions', href: '/admin/transactions', icon: CreditCard },
    { label: 'Reports', href: '/admin/reports', icon: BarChart3 },
    { label: 'Notifications', href: '/admin/notifications', icon: Bell },
    { label: 'Audit Logs', href: '/admin/audit-logs', icon: ShieldCheck },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
    { label: 'Administrators', href: '/admin/administrators', icon: ShieldCheck },
    { label: 'Roles', href: '/admin/roles', icon: Lock },
    { label: 'Profile', href: '/admin/profile', icon: UserCircle },
  ],
} satisfies Record<Role, Array<{ label: string; href: string; icon: LucideIcon }>>;
