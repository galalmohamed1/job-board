'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Package,
  Wallet,
  Store,
  LogOut,
  ChevronLeft,
  ShieldCheck,
} from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function DashboardAccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isOrdersActive =
    pathname === '/dashboard-account' ||
    pathname === '/dashboard-account/orders' ||
    pathname.startsWith('/dashboard-account/orders');

  const isAccountsActive =
    pathname === '/dashboard-account/accounts' ||
    pathname.startsWith('/dashboard-account/accounts');

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-['Cairo'] text-right flex flex-col" dir="rtl">
      {/* ── Top Navigation Bar ── */}
      <header className="sticky top-0 z-40 bg-[#0B2545] text-white border-b border-[#1D2A44] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Role Badge */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#F3C053] to-[#D49B35] flex items-center justify-center text-[#0B2545] font-black shadow-md">
                <span className="text-lg">H</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-white text-base">سوق حورس</span>
                  <span className="bg-[#1D2A44] text-[#F3C053] text-[10px] font-black px-2 py-0.5 rounded-full border border-[#D49B35]/40 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-[#F3C053]" />
                    <span>لوحة المحاسب (Accountant)</span>
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">نظام إدارة الطلبات والحسابات المالية</p>
              </div>
            </div>

            {/* Nav Tabs (Only 2 pages as requested!) */}
            <nav className="flex items-center gap-1.5 bg-[#132A4A] p-1.5 rounded-2xl border border-white/10">
              {/* Page 1: الطلبات (Orders) */}
              <Link
                href="/dashboard-account/orders"
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  isOrdersActive
                    ? 'bg-linear-to-r from-[#F3C053] to-[#D49B35] text-[#0B2545] shadow-md font-black'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>الطلبات (Orders)</span>
              </Link>

              {/* Page 2: الحسابات (Accounts) */}
              <Link
                href="/dashboard-account/accounts"
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  isAccountsActive
                    ? 'bg-linear-to-r from-[#F3C053] to-[#D49B35] text-[#0B2545] shadow-md font-black'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Wallet className="w-4 h-4" />
                <span>الحسابات المالية (Accounts)</span>
              </Link>
            </nav>

            {/* User Controls */}
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                <Store className="w-4 h-4" />
                <span>المتجر</span>
              </Link>

              <button
                type="button"
                onClick={() => signOut({ redirect: true, callbackUrl: '/login' })}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-red-500/20 hover:text-red-300 text-slate-300 transition-colors cursor-pointer"
                title="تسجيل الخروج"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">خروج</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Content Container ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-400">
        سوق حورس © 2026 — نظام إدارة الحسابات والطلبات
      </footer>
    </div>
  );
}
