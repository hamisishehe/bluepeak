'use client';

import { Copy, WalletCards } from 'lucide-react';
import { useState } from 'react';

const addresses = [
  {
    network: 'USDT TRC20',
    address: 'TWrJr7q6dkPunUAZM6H4UvAEeL2D8qxdsZ',
  },
  {
    network: 'USDT BEP20',
    address: '0x593b59f4f86a27fa9711169bee37d1118cc7e43c',
  },
];

export function DepositAddresses() {
  const [copied, setCopied] = useState('');

  async function copy(address: string) {
    await navigator.clipboard.writeText(address);
    setCopied(address);
  }

  return (
    <section className="mt-6 rounded-xl border border-line bg-white p-6 shadow-ambient">
      <div className="flex items-center gap-2">
        <WalletCards className="text-royal" size={20} />
        <h2 className="font-headline text-xl font-bold">Deposit Address</h2>
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {addresses.map((item) => (
          <div className="rounded-xl border border-line bg-slate-50 p-4" key={item.network}>
            <p className="text-xs font-bold uppercase tracking-wider text-muted">{item.network}</p>
            <p className="mt-3 break-all font-mono text-sm font-semibold text-ink">{item.address}</p>
            <button className="mt-4 inline-flex items-center gap-2 rounded-lg bg-navy px-4 py-2 text-sm font-bold text-white" onClick={() => copy(item.address)} type="button">
              <Copy size={16} />
              {copied === item.address ? 'Copied' : 'Copy Address'}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

