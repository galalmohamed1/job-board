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
} from 'lucide-react';
import HorusLogo from '@/components/logo/HorusLogo';
import SearchBox from '@/components/SearchBox';

interface HeaderProps {
  cartCount?: number;
  onOpenCart?: () => void;
  onOpenLogin?: () => void;
}

export default function Navbar({
  cartCount = 0,
  onOpenCart,
  onOpenLogin,
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
  { title: 'المنتجات', href: '/#products' },
  { title: 'التسويق', href: '/#marketing' },
];

const navLinkAfter = [
  { title: 'الخدمات المهنية', href: '/#legal' },
  { title: 'الشركاء والموردون', href: '/#partners' },
  { title: 'المدونات', href: '/#blog' },
  { title: 'من نحن', href: '/#about' },
  { title: 'تواصل معنا', href: '/#contact' },
];
  return (
    <header dir="rtl" className="w-full relative z-50">
      {/* 1. Main Top Bar */}
      <div className="w-full border-b border-navy-border bg-navy-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          {/* Right: Brand Logo (emblem on the left of the text, like the design) */}
          <Link 
          onClick={() => setActive("/")}
          href="/" 
          className="flex items-center gap-2 shrink-0">
            <HorusLogo size="md" showTagline={true} className="[direction:ltr]" />
          </Link>
 
          {/* Center: Search Bar */}
          <div className="flex-1 max-w-xl mx-2 hidden sm:block">
            <SearchBox />
          </div>
 
          {/* Left: User Actions (Cart & Login) */}
          <div className="flex items-center gap-3 sm:gap-5 text-white text-xs md:text-sm">
            {/* Cart: text first, icon on its left */}
            <button
              type="button"
              onClick={onOpenCart}
              className="relative flex items-center gap-2 text-slate-200 hover:text-gold-primary transition-colors cursor-pointer py-1 px-2 rounded-lg hover:bg-white/5"
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
            </button>
 
            <span className="text-slate-600 hidden sm:inline">|</span>
 
            {/* Login: text first, icon on its left */}
            <button
              type="button"
              onClick={onOpenLogin}
              className="flex items-center gap-2 text-slate-200 hover:text-gold-primary transition-colors cursor-pointer py-1 px-2 rounded-lg hover:bg-white/5"
            >
              <span className="font-semibold whitespace-nowrap">
                تسجيل الدخول / إنشاء حساب
              </span>
              <User className="w-4 h-4" />
            </button>
 
            {/* Mobile Menu Button */}
            <button
              type="button"
              aria-label="القائمة"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-slate-200 hover:text-white p-1"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
 
        {/* Mobile Search input */}
        <div className="sm:hidden px-4 pb-3">
          <SearchBox mobile/>
        </div>
      </div>
 
      {/* 2. Secondary Navigation Bar */}
      <div className="w-full border-b border-navy-border hidden md:block bg-navy-main">
        <div className="max-w-6xl mx-auto ml-7 px-4 sm:px-6 lg:px-8 ">
          <nav className="flex items-center text-xs lg:text-sm text-slate-300 py-2.5 border-b-2 border-b-navy-primary">
            <div className="flex items-center gap-6 lg:gap-8">
              {/* Home (Active) */}
              {navLinkBefore.map((nav,index) => (
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
              <div
                className="relative"
              >
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
                    style={{ direction: 'rtl' }}
                  >
                    <div className="absolute -top-2 right-6 w-4 h-4 bg-white rotate-45 border-t border-r border-slate-100"></div>
 
                    <div className="flex flex-col py-1">
                      {campaignItems.map((item,index) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={index}
                            href={item.href}
                            onClick={() => {
                                setActive(item.href)
                                setIsCampaignsOpen(false)
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
 
              {navLinkAfter.map((nav,index) => (
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
        <div className="md:hidden border-b border-navy-border px-4 py-4 space-y-3 bg-navy-main">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-bold text-gold-light"
          >
            الرئيسية
          </Link>
          <Link
            href="/#products"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-slate-200"
          >
            المنتجات
          </Link>
          <Link
            href="/#marketing"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-slate-200"
          >
            التسويق
          </Link>
          <div className="border-t border-slate-800 pt-2 pb-1">
            <span className="text-xs text-gold-light font-bold block mb-1">
              الحملات الدعائية:
            </span>
            <div className="space-y-1.5 pr-2">
              {campaignItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-xs text-slate-300 hover:text-white py-1"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
          <Link
            href="/#legal"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-slate-200"
          >
            الخدمات المهنية
          </Link>
          <Link
            href="/#partners"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-slate-200"
          >
            الشركاء والموردون
          </Link>
          <Link
            href="/#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-slate-200"
          >
            من نحن
          </Link>
          <Link
            href="/#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-slate-200"
          >
            تواصل معنا
          </Link>
        </div>
      )}
    </header>
  );
}