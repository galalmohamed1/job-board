'use client';

import React from 'react';
import Link from 'next/link';
import {
  Warehouse,
  Store,
  LogOut,
  ShieldCheck,
  PackageCheck,
} from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';

export default function DashboardWarehouseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-right flex flex-col font-['Cairo']" dir="rtl">
      {/* ── شريط الملاحة العلوي لأمين المستودع ── */}
      <header className="sticky top-0 z-40 bg-[#08101E] text-white border-b border-[#1D2A44] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* الشعار وشارة دور أمين المستودع */}
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard-warehouse"
                className="flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-[#F3C053] to-[#D49B35] flex items-center justify-center text-[#08101E] font-black shadow-md group-hover:scale-105 transition-transform">
                  <Warehouse className="w-5 h-5 text-[#08101E]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-white text-base">سوق حورس</span>
                    <span className="bg-[#1D2A44] text-[#F3C053] text-[10px] font-black px-2.5 py-0.5 rounded-full border border-[#D49B35]/40 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-[#F3C053]" />
                      <span>أمين المستودع (Warehouse)</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    لوحة تجهيز الشحنات وإدارة المخزون والتسليم للشحن
                  </p>
                </div>
              </Link>
            </div>

            {/* الإجراءات السريعة ومعلومات المستخدم */}
            <div className="flex items-center gap-3">
              {/* الرجوع للمتجر */}
              <Link
                href="/"
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-200 hover:text-[#F3C053] hover:bg-white/5 border border-white/10 transition-colors"
                title="الرجوع للمتجر الرئيسي"
              >
                <Store className="w-3.5 h-3.5 text-[#F3C053]" />
                <span className="hidden sm:inline">الرجوع للمتجر</span>
              </Link>

              {/* اسم المستخدم وتسجيل الخروج */}
              <div className="flex items-center gap-2 pr-3 border-r border-white/10">
                <div className="hidden md:flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-100">
                    {session?.user?.name || 'أمين مستودع'}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {session?.user?.email}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="p-2 rounded-xl text-slate-300 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                  title="تسجيل الخروج"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}

