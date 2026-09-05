// src/pages/auth/components/AuthLayout.tsx
import type { ReactNode } from 'react';
import AuthBrandPanel from './AuthBrandPanel';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  footer: ReactNode;
}

const AuthLayout = ({ children, title, subtitle, footer }: AuthLayoutProps) => {
  return (
    <div className="relative flex min-h-screen bg-white">
      <AuthBrandPanel />

      <div className="flex w-full flex-col lg:w-1/2">
        <div className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 xl:px-24">
          <div className="mb-10 lg:hidden flex flex-col items-center text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#7B5CF6] shadow-md">
              <img src="/favicon.svg" alt="Pulse" className="h-8 w-8 brightness-0 invert" />
            </div>
            <p className="text-xs font-semibold tracking-[0.3em] text-[#7B5CF6]">PULSE</p>
          </div>

          <div className="mx-auto w-full max-w-md">
            <h2 className="text-3xl font-bold text-zinc-900">{title}</h2>
            <p className="mt-2 text-sm text-zinc-500">{subtitle}</p>

            <div className="mt-8">{children}</div>

            <div className="mt-8 text-center text-sm text-zinc-500">{footer}</div>

            <p className="mt-16 text-center text-[11px] tracking-wide text-zinc-400">
              PULSE NETWORK © 2026
            </p>
          </div>
        </div>
      </div>

      {/* <div className="pointer-events-none fixed bottom-5 right-5 hidden sm:flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs text-zinc-600 shadow-sm">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-[10px]">
          ✓
        </span>
        System Status: All services operational
      </div> */}
    </div>
  );
};

export default AuthLayout;
