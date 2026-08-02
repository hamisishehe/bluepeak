import { ArrowRight, CheckCircle2, Copy, ShieldCheck, Sparkles, TrendingUp, WalletCards } from 'lucide-react';

const steps = [
  ['Create account', 'Register securely and access your investor workspace.'],
  ['Submit deposit', 'Upload transaction details for review and activation.'],
  ['Track returns', 'Monitor weekly returns, balances, referrals, and withdrawals.'],
];

const features = [
  ['Weekly return tracking', 'See profit schedules, credited returns, and next processing dates.'],
  ['Transparent ledger', 'Deposits, investments, withdrawals, and referral commissions stay visible.'],
  ['Referral rewards', 'Share your link and track commission records from your dashboard.'],
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-surface text-ink">
      <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <a className="flex items-center gap-3" href="/">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy text-sm font-bold text-white">FX</div>
            <span className="font-headline text-xl font-bold">BluePeak Capital</span>
          </a>
          <nav className="hidden items-center gap-8 text-sm font-semibold text-muted md:flex">
            <a href="#how">How It Works</a>
            <a href="#plan">Plan</a>
            <a href="#features">Features</a>
            <a href="#security">Security</a>
          </nav>
          <div className="flex items-center gap-3">
            <a className="hidden rounded-lg px-4 py-2.5 text-sm font-bold text-ink hover:bg-slate-100 sm:inline-flex" href="/login">Sign in</a>
            <a className="rounded-lg bg-royal px-5 py-2.5 text-sm font-bold text-white shadow-ambient" href="/register">Register</a>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[1fr_520px] lg:py-24">
        <div className="flex flex-col justify-center">
          <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-royal">
            <ShieldCheck size={16} />
            Secure Investment Workspace
          </div>
          <h1 className="max-w-3xl font-headline text-4xl font-bold leading-tight text-ink sm:text-5xl lg:text-6xl">Build, track, and manage your investment growth with clarity.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">BluePeak Capital gives investors a focused portal for deposits, active investments, weekly return records, withdrawals, wallet addresses, and referral rewards.</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a className="inline-flex items-center gap-2 rounded-xl bg-navy px-7 py-4 font-bold text-white shadow-focus" href="/register">
              Create Account
              <ArrowRight size={18} />
            </a>
            <a className="rounded-xl border border-line bg-white px-7 py-4 font-bold text-ink shadow-ambient" href="/login">Investor Sign in</a>
          </div>
          <div className="mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
            {['$1,000 minimum', '12% weekly target', '0.5% referrals'].map((item) => <div className="rounded-lg border border-line bg-white px-4 py-3 text-sm font-bold shadow-ambient" key={item}>{item}</div>)}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-focus">
          <div className="flex items-center justify-between bg-navy p-4 text-xs font-mono text-slate-300">
            <span>INVESTOR_PORTAL</span>
            <ShieldCheck size={18} />
          </div>
          <div className="space-y-6 p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-line bg-white p-4 shadow-ambient">
                <p className="text-xs font-bold uppercase tracking-wider text-muted">Investment Balance</p>
                <p className="tabular mt-2 font-headline text-3xl font-bold text-royal">$24,000.00</p>
                <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-emerald-700"><TrendingUp size={16} />Active and tracked</p>
              </div>
              <div className="rounded-xl border border-line bg-white p-4 shadow-ambient">
                <p className="text-xs font-bold uppercase tracking-wider text-muted">Weekly Return</p>
                <p className="tabular mt-2 font-headline text-3xl font-bold">$2,880.00</p>
                <div className="mt-4 h-2 rounded-full bg-slate-100"><div className="h-2 w-4/5 rounded-full bg-royal" /></div>
              </div>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <div className="mb-4 flex items-center justify-between">
                <p className="font-headline text-lg font-bold">Recent Activity</p>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">Live</span>
              </div>
              {['Deposit approved', 'Investment activated', 'Referral link copied'].map((item) => (
                <div className="flex items-center justify-between border-t border-line py-3 text-sm" key={item}>
                  <span className="font-semibold">{item}</span>
                  <CheckCircle2 className="text-emerald-600" size={18} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="border-y border-line bg-white py-16">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-sm font-bold uppercase tracking-wider text-royal">How It Works</p>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {steps.map(([title, body], index) => (
              <div className="rounded-xl border border-line p-6" key={title}>
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy text-sm font-bold text-white">{index + 1}</span>
                <h2 className="mt-5 font-headline text-xl font-bold">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="plan" className="mx-auto grid max-w-7xl gap-8 px-6 py-16 lg:grid-cols-[420px_1fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-royal">Plan</p>
          <h2 className="mt-3 font-headline text-3xl font-bold">Clear terms before capital moves.</h2>
          <p className="mt-4 text-muted">Investment settings are centralized so deposit limits, weekly percentage, referral commission, and withdrawal rules remain consistent.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            ['Minimum deposit', '$1,000'],
            ['Maximum deposit', '$10,000'],
            ['Weekly return', '12%'],
            ['Referral commission', '0.5%'],
          ].map(([label, value]) => (
            <div className="rounded-xl border border-line bg-white p-6 shadow-ambient" key={label}>
              <p className="text-sm font-semibold text-muted">{label}</p>
              <p className="tabular mt-2 font-headline text-3xl font-bold">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="mx-auto grid max-w-7xl gap-6 px-6 pb-16 md:grid-cols-3">
        {features.map(([title, body]) => (
          <div className="rounded-xl border border-line bg-white p-6 shadow-ambient" key={title}>
            <Sparkles className="text-royal" />
            <h2 className="mt-4 font-headline text-xl font-bold">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{body}</p>
          </div>
        ))}
      </section>

      <section id="security" className="bg-navy py-16 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <p className="text-sm font-bold uppercase tracking-wider text-blue-200">Security</p>
            <h2 className="mt-3 font-headline text-3xl font-bold">Designed for verified access and financial traceability.</h2>
          </div>
          <div className="space-y-3 text-sm text-slate-300">
            <p className="flex items-center gap-2"><ShieldCheck size={18} /> JWT protected account access</p>
            <p className="flex items-center gap-2"><WalletCards size={18} /> Wallet and withdrawal records</p>
            <p className="flex items-center gap-2"><Copy size={18} /> Referral link tracking</p>
          </div>
        </div>
      </section>
    </main>
  );
}
