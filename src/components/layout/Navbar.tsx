'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingCart,
  User,
  Vote,
  Megaphone,
  TrendingUp,
  Users,
  ChevronDown,
  Menu,
  X,
  Heart,
} from 'lucide-react';
import HorusLogo from '@/components/logo/HorusLogo';
import SearchBox from '@/components/SearchBox';

interface HeaderProps {
  cartCount?: number;
  favoriteCount?: number;
}

export default function Navbar({
  cartCount = 1,
  favoriteCount = 1,
}: HeaderProps) {
  const [isCampaignsOpen, setIsCampaignsOpen] = useState(false);
  const [active, setActive] = useState('/');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const campaignItems = [
    { title: 'الحملات الانتخابية', icon: Vote, href: '/#elections' },
    { title: 'الحملات الإعلانية', icon: Megaphone, href: '/#advertising' },
    { title: 'الحملات التسويقية', icon: TrendingUp, href: '/#marketing-camp' },
    { title: 'حملات العلاقات والتوعية', icon: Users, href: '/#awareness' },
  ];

  const navLinkBefore = [
    { title: 'الرئيسية', href: '/' },
    { title: 'المنتجات', href: '/product' },
    { title: 'التسويق', href: '/marketing' },
    { title: 'العقارات', href: '/#realstate' },
  ];

  const navLinkAfter = [
    { title: 'الخدمات المهنية', href: '/#legal' },
    { title: 'الشركاء والموردون', href: '/#partners' },
    { title: 'المدونات', href: '/#blog' },
    { title: 'من نحن', href: '/#about' },
    { title: 'تواصل معنا', href: '/#contact' },
  ];

  return (
    <header className="w-full relative z-50">
      {/* 1. Main Top Bar */}
      <div className="w-full border-b border-navy-border bg-navy-surface">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-4">
          {/* Right: Brand Logo */}
          <Link
            onClick={() => setActive('/')}
            href="/"
            className="flex items-center gap-2 shrink-0"
          >
            <HorusLogo size="md" showTagline={true} className="[direction:ltr]" />
          </Link>

          {/* Center: Search Bar (ديسكتوب) */}
          <div className="flex-1 max-w-xl mx-2 hidden sm:block">
            <SearchBox />
          </div>

          {/* Left: User Actions (Cart & Login) */}
          <div className="flex items-center gap-1 sm:gap-3 md:gap-5 text-white text-xs md:text-sm shrink-0">
            {/* Cart */}
            <Link
              href='/#cart'
              type="button"
              aria-label="سلة المشتريات"
              className="relative flex items-center gap-2 text-slate-200 hover:text-gold-primary transition-colors cursor-pointer p-2 rounded-lg hover:bg-white/5"
            >
              <span className="hidden md:inline font-semibold">سلة المشتريات</span>
              <div className="relative">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-badge-red text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
            </Link>

            <span className="text-slate-600 hidden md:inline">|</span>
            <Link
              href='/wishlist'
              type="button"
              aria-label="المفضله"
              className="relative flex items-center gap-2 text-slate-200 hover:text-gold-primary transition-colors cursor-pointer p-2 rounded-lg hover:bg-white/5"
            >
              <span className="hidden md:inline font-semibold"> المفضله</span>
              <div className="relative">
                <Heart className="w-5 h-5" />
                {favoriteCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-badge-red text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {favoriteCount}
                  </span>
                )}
              </div>
            </Link>
            <span className="text-slate-600 hidden md:inline">|</span>

            {/* Login */}
            <Link
              type="button"
              href={"/login"}
              aria-label="تسجيل الدخول / إنشاء حساب"
              className="flex items-center gap-2 text-slate-200 hover:text-gold-primary transition-colors cursor-pointer p-2 rounded-lg hover:bg-white/5"
            >
              <span className="hidden md:inline font-semibold whitespace-nowrap">
                تسجيل الدخول / إنشاء حساب
              </span>
              <User className="w-5 h-5 md:w-4 md:h-4" />
            </Link>

            {/* Mobile Menu Button */}
            <button
              type="button"
              aria-label="القائمة"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-slate-200 hover:text-white p-2"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search input */}
        <div className="sm:hidden px-3 pb-3">
          <SearchBox mobile />
        </div>
      </div>

      {/* 2. Secondary Navigation Bar */}
      <div className="w-full border-b border-navy-border hidden md:block bg-navy-main">
        <div className="max-w-6xl mx-auto ml-7 px-4 sm:px-6 lg:px-8 ">
          <nav className="flex items-center text-xs lg:text-sm text-slate-300 py-2.5 border-b-2 border-b-navy-primary">
            <div className="flex items-center gap-6 lg:gap-8">
              {navLinkBefore.map((nav, index) => (
                <Link
                  key={index}
                  href={nav.href}
                  onClick={() => setActive(nav.href)}
                  className={`relative py-1 transition-colors after:content-[''] after:absolute after:-bottom-2.5 after:left-0 after:right-0 after:h-[2.5px] after:bg-gold-light after:rounded-full ${
                    active === nav.href
                      ? 'font-extrabold text-gold-light after:opacity-100'
                      : 'text-slate-300 hover:text-white after:opacity-0'
                  }`}
                >
                  {nav.title}
                </Link>
              ))}

              {/* Promotional Campaigns with Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsCampaignsOpen(!isCampaignsOpen)}
                  className="flex items-center gap-1.5 py-1 text-slate-300 hover:text-gold-light transition-colors cursor-pointer group"
                >
                  <span className="font-semibold">الحملات الدعائية</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-gold-light transition-transform duration-200 ${
                      isCampaignsOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isCampaignsOpen && (
                  <div
                    className="absolute top-full right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  >
                    <div className="absolute -top-2 right-6 w-4 h-4 bg-white rotate-45 border-t border-r border-slate-100"></div>

                    <div className="flex flex-col py-1">
                      {campaignItems.map((item, index) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={index}
                            href={item.href}
                            onClick={() => {
                              setActive(item.href);
                              setIsCampaignsOpen(false);
                            }}
                            className="flex items-center gap-3 px-4 py-2.5 text-xs lg:text-sm font-semibold text-navy-surface hover:bg-gold-soft-bg hover:text-gold-primary transition-colors"
                          >
                            <span className="w-7 h-7 rounded-lg bg-blue-50 text-[#1E3A8A] flex items-center justify-center shrink-0">
                              <Icon className="w-4 h-4" />
                            </span>
                            <span>{item.title}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {navLinkAfter.map((nav, index) => (
                <Link
                  key={index}
                  href={nav.href}
                  onClick={() => setActive(nav.href)}
                  className={`relative py-1 transition-colors after:content-[''] after:absolute after:-bottom-2.5 after:left-0 after:right-0 after:h-[2.5px] after:bg-gold-light after:rounded-full ${
                    active === nav.href
                      ? 'font-extrabold text-gold-light after:opacity-100'
                      : 'text-slate-300 hover:text-white after:opacity-0'
                  }`}
                >
                  {nav.title}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-navy-border px-4 py-3 bg-navy-main max-h-[70vh] overflow-y-auto">
          <div className="flex flex-col">
            {navLinkBefore.map((nav, index) => (
              <Link
                key={index}
                href={nav.href}
                onClick={() => {
                  setActive(nav.href);
                  setMobileMenuOpen(false);
                }}
                className={`py-2.5 text-sm border-b border-slate-800/70 ${
                  active === nav.href
                    ? 'font-extrabold text-gold-light'
                    : 'text-slate-200'
                }`}
              >
                {nav.title}
              </Link>
            ))}

            {/* الحملات الدعائية */}
            <div className="py-2.5 border-b border-slate-800/70">
              <span className="text-sm text-gold-light font-bold block mb-1">
                الحملات الدعائية
              </span>
              <div className="flex flex-col pr-3">
                {campaignItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    onClick={() => {
                      setActive(item.href);
                      setMobileMenuOpen(false);
                    }}
                    className={`py-1.5 text-xs ${
                      active === item.href
                        ? 'font-extrabold text-gold-light'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>

            {navLinkAfter.map((nav, index) => (
              <Link
                key={index}
                href={nav.href}
                onClick={() => {
                  setActive(nav.href);
                  setMobileMenuOpen(false);
                }}
                className={`py-2.5 text-sm border-b border-slate-800/70 last:border-b-0 ${
                  active === nav.href
                    ? 'font-extrabold text-gold-light'
                    : 'text-slate-200'
                }`}
              >
                {nav.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}