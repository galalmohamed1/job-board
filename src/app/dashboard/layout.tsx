'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Tag,
  Layers,
  ListTree,
  Users,
  UserPlus,
  Wallet,
  ChevronRight,
  Menu,
  X,
  LogOut,
  Bell,
  Settings,
  ChevronLeft,
  Ticket,
} from 'lucide-react';
import { signOut } from 'next-auth/react';

const navItems = [
  {
    label: 'لوحة التحكم',
    href: '/dashboard',
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: 'المنتجات',
    href: '/dashboard/products',
    icon: Package,
  },
  {
    label: 'كوبونات الخصم',
    href: '/dashboard/coupons',
    icon: Ticket,
  },
  {
    label: 'المستخدمين',
    href: '/dashboard/users',
    icon: Users,
  },
  {
    label: 'الأقسام (Categories)',
    href: '/dashboard/categories',
    icon: Tag,
  },
  {
    label: 'الأقسام الفرعية',
    href: '/dashboard/subcategories',
    icon: Layers,
  },
  {
    label: 'تفاصيل الأقسام',
    href: '/dashboard/details-subcategory',
    icon: ListTree,
  },
  {
    label: 'إنشاء حساب',
    href: '/dashboard/create-account',
    icon: UserPlus,
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const isActive = (item: { href: string; exact?: boolean }) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };
  function mySignOut() {
      signOut({ redirect: true, callbackUrl: '/login' });
    }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-[#1D2A44]">
        <div className="w-9 h-9 rounded-xl bg-linear-to-br from-[#F3C053] to-[#D49B35] flex items-center justify-center shadow-lg">
          <span className="text-[#0B2545] font-black text-sm">H</span>
        </div>
        {sidebarOpen && (
          <div>
            <p className="text-white font-black text-sm leading-none">سوق حورس</p>
            <p className="text-[#94A3B8] text-[10px] mt-0.5">لوحة الإدارة</p>
          </div>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                active
                  ? 'bg-[#D49B35] text-[#0B2545] shadow-md'
                  : 'text-slate-300 hover:bg-[#1D2A44] hover:text-white'
              }`}
            >
              <Icon
                className={`w-5 h-5 shrink-0 transition-colors ${
                  active ? 'text-[#0B2545]' : 'text-slate-400 group-hover:text-white'
                }`}
              />
              {sidebarOpen && (
                <span className="text-sm font-semibold truncate">{item.label}</span>
              )}
              {sidebarOpen && active && (
                <ChevronLeft className="w-4 h-4 mr-auto shrink-0 text-[#0B2545]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-[#1D2A44] px-3 py-3 space-y-1">
        <button className="w-full cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-[#1D2A44] hover:text-white transition-all group">
          <Settings className="w-5 h-5 shrink-0" />
          {sidebarOpen && <span className="text-sm font-semibold">الإعدادات</span>}
        </button>
        <button onClick={mySignOut} className="w-full cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-red-900/30 hover:text-red-400 transition-all group">
          <LogOut className="w-5 h-5 shrink-0" />
          {sidebarOpen && <span className="text-sm font-semibold">تسجيل الخروج</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#F1F5F9] font-['Cairo'] overflow-hidden" dir="rtl">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-[#08101E] border-l border-[#1D2A44] transition-all duration-300 shrink-0 ${
          sidebarOpen ? 'w-60' : 'w-16'
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <aside className="absolute right-0 top-0 bottom-0 w-64 bg-[#08101E] flex flex-col z-10">
            <div className="flex items-center justify-between px-4 py-4 border-b border-[#1D2A44]">
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="text-slate-400 cursor-pointer hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <p className="text-white font-bold text-sm">القائمة</p>
            </div>
            <div className="flex-1 overflow-y-auto">
              <nav className="py-4 px-3 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                        active
                          ? 'bg-[#D49B35] text-[#0B2545]'
                          : 'text-slate-300 hover:bg-[#1D2A44] hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5 shrink-0" />
                      <span className="text-sm font-semibold">{item.label}</span>
                    </Link>
                  );
                })}
                <div className="border-t border-[#1D2A44] px-3 py-3 space-y-1">
                  <button className="w-full cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-[#1D2A44] hover:text-white transition-all group">
                    <Settings className="w-5 h-5 shrink-0" />
                    {sidebarOpen && <span className="text-sm font-semibold">الإعدادات</span>}
                  </button>
                  <button onClick={mySignOut} className="w-full cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-red-900/30 hover:text-red-400 transition-all group">
                    <LogOut className="w-5 h-5 shrink-0" />
                    {sidebarOpen && <span className="text-sm font-semibold">تسجيل الخروج</span>}
                  </button>
                </div>
              </nav>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden text-slate-600 hover:text-[#D49B35] transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            {/* Desktop sidebar toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:flex text-slate-600 hover:text-[#D49B35] transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:block">
              <p className="text-slate-800 font-bold text-sm">
                {navItems.find((i) => isActive(i))?.label ?? 'لوحة التحكم'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 border-r border-slate-200 pr-3">
              <div className="text-right hidden sm:block">
                <p className="text-slate-800 font-bold text-xs leading-none">المشرف</p>
                <p className="text-slate-400 text-[10px]">Admin</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-[#F3C053] to-[#D49B35] flex items-center justify-center text-[#0B2545] font-black text-sm">
                م
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
