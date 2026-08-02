import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#0F172A',
        royal: '#2563EB',
        surface: '#F8FAFC',
        ink: '#0B1C30',
        muted: '#64748B',
        line: '#E2E8F0',
      },
      fontFamily: {
        headline: ['var(--font-jakarta)'],
        body: ['var(--font-inter)'],
      },
      boxShadow: {
        ambient: '0 4px 12px rgba(15, 23, 42, 0.04)',
        focus: '0 12px 32px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
};

export default config;

