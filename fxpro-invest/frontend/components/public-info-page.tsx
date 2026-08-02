export function PublicInfoPage({ title, body }: { title: string; body: string }) {
  return (
    <main className="min-h-screen bg-surface">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <a className="font-headline text-xl font-bold" href="/">BluePeak Capital</a>
          <a className="rounded-lg bg-royal px-5 py-2.5 text-sm font-bold text-white" href="/login">Sign in</a>
        </div>
      </header>
      <section className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="font-headline text-4xl font-bold text-ink">{title}</h1>
        <p className="mt-6 text-lg leading-8 text-muted">{body}</p>
      </section>
    </main>
  );
}
