import { AuthForm } from '@/components/auth-form';

export default function LoginPage() {
  return (
    <main className="grid min-h-screen bg-surface lg:grid-cols-2">
      <section className="hidden bg-navy p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <a className="font-headline text-2xl font-bold" href="/">BluePeak Capital</a>
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-blue-200">Secure Portal</p>
          <h1 className="mt-4 font-headline text-5xl font-bold leading-tight">Track capital, returns, referrals, and withdrawals with confidence.</h1>
        </div>
      </section>
      <section className="flex items-center justify-center px-6">
        <AuthForm mode="login" />
      </section>
    </main>
  );
}
