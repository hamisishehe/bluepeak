import { AuthForm } from '@/components/auth-form';

export default function AdminLoginPage() {
  return <main className="flex min-h-screen items-center justify-center bg-surface px-6"><AuthForm mode="login" admin /></main>;
}

