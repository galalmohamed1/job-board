'use client';

import Link from 'next/link';
import { Phone, Mail, MapPin, Heart } from 'lucide-react';
import { FaInstagram, FaFacebookF, FaYoutube, FaXTwitter } from "react-icons/fa6";
import HorusLogo from '@/components/logo/HorusLogo';

export default function Footer() {
  return (
    <footer className="w-full bg-[#071326] text-white font-['Cairo'] border-t border-slate-800/80">
      {/* ── Main Footer Top ── */}
      <div className="px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-8 lg:gap-6">

          {/* ════ 5. Brand & Social (Leftmost in RTL) ════ */}
          <div className="w-full lg:w-[22%] text-right flex flex-col justify-start">
            <HorusLogo size="md" showTagline={false} />
            <p className="text-slate-300 text-xs font-medium mt-2.5 leading-relaxed">
              منصة التجارة والتسويق والخدمات الرقمية
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3.5 mt-4 text-slate-300">
              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="فيسبوك"
                className="hover:text-[#D49B35] transition-colors"
              >
                <FaFacebookF className="w-4 h-4" />
              </a>

              {/* X / Twitter */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="منصة إكس"
                className="hover:text-[#D49B35] transition-colors"
              >
                <FaXTwitter className="w-4 h-4"/>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="إنستغرام"
                className="hover:text-[#D49B35] transition-colors"
              >
                <FaInstagram className="w-4 h-4" />
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="يوتيوب"
                className="hover:text-[#D49B35] transition-colors"
              >
                <FaYoutube  className="w-4 h-4" />
              </a>

              {/* TikTok */}
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="تيك توك"
                className="hover:text-[#D49B35] transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.85.12V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.3 6.3 0 0 0 1.87-4.49v-7.1a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.87.01z" />
                </svg>
              </a>
            </div>
          </div>

          {/* ════ 4. Quick Links (with vertical separator on left) ════ */}
          <div className="w-full lg:w-[17%] text-right lg:border-s lg:border-white/10 lg:ps-6">
            <div className="mb-3">
              <h3 className="text-base sm:text-lg font-black text-white">
                روابط سريعة
              </h3>
              <span className="block w-6 h-0.5 bg-[#D49B35] mt-1 rounded-full" />
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              <li>
                <Link href="/" className="hover:text-[#D49B35] transition-colors">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link href="/product" className="hover:text-[#D49B35] transition-colors">
                  المتجر
                </Link>
              </li>
              <li>
                <Link href="/#marketing" className="hover:text-[#D49B35] transition-colors">
                  التسويق والإعلان
                </Link>
              </li>
              <li>
                <Link href="/#campaigns" className="hover:text-[#D49B35] transition-colors">
                  الحملات الدعائية
                </Link>
              </li>
              <li>
                <Link href="/#about" className="hover:text-[#D49B35] transition-colors">
                  من نحن
                </Link>
              </li>
            </ul>
          </div>

          {/* ════ 3. Customer Service (with vertical separator on left) ════ */}
          <div className="w-full lg:w-[17%] text-right lg:border-s lg:border-white/10 lg:ps-6">
            <div className="mb-3">
              <h3 className="text-base sm:text-lg font-black text-white">
                خدمة العملاء
              </h3>
              <span className="block w-6 h-0.5 bg-[#D49B35] mt-1 rounded-full" />
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              <li>
                <Link href="/#help" className="hover:text-[#D49B35] transition-colors">
                  مركز المساعدة
                </Link>
              </li>
              <li>
                <Link href="/#privacy" className="hover:text-[#D49B35] transition-colors">
                  سياسة الخصوصية
                </Link>
              </li>
              <li>
                <Link href="/#terms" className="hover:text-[#D49B35] transition-colors">
                  الشروط والأحكام
                </Link>
              </li>
              <li>
                <Link href="/#track-order" className="hover:text-[#D49B35] transition-colors">
                  تتبع الطلب
                </Link>
              </li>
            </ul>
          </div>

          {/* ════ 2. Contact Details ════ */}
          <div className="w-full lg:w-[20%] text-right">
            <h3 className="text-base sm:text-lg font-black text-white mb-3">
              تواصل معنا
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
              <li>
                <a
                  href="tel:+201003044257"
                  className="flex items-center gap-2 hover:text-[#D49B35] transition-colors group"
                >
                  <Phone className="w-4 h-4 text-[#D49B35] shrink-0 group-hover:scale-110 transition-transform" />
                  <span dir="ltr" className="font-semibold">+20 10 0304 4257</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@horus-market.com"
                  className="flex items-center gap-2 hover:text-[#D49B35] transition-colors group"
                >
                  <Mail className="w-4 h-4 text-[#D49B35] shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">info@horus-market.com</span>
                </a>
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-[#D49B35] shrink-0" />
                <span>مصر - القاهرة</span>
              </li>
            </ul>
          </div>

          {/* ════ 1. Newsletter (Rightmost in RTL) ════ */}
          <div className="w-full lg:w-[28%] text-right">
            <h3 className="text-base sm:text-lg font-black text-white mb-3">
              اشترك في نشرتنا البريدية
            </h3>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-2.5">
              <input
                type="email"
                placeholder="ادخل بريدك الإلكتروني"
                className="w-full rounded-xl bg-white px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#D49B35] transition-all shadow-xs"
                required
              />
              <button
                type="submit"
                className="w-full rounded-xl bg-[#D49B35] hover:bg-[#c38c2b] active:scale-[0.99] py-2.5 text-sm font-black text-[#071326] shadow-md transition-all cursor-pointer"
              >
                اشتراك
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="w-full border-t border-white/10 bg-[#050D1A] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          {/* Right (in RTL): Links */}
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-slate-300">
              <span>معك دائماً</span>
              <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
            </span>
            <span className="text-white/20">|</span>
            <Link href="/#privacy" className="hover:text-white transition-colors">
              سياسة الخصوصية
            </Link>
            <span className="text-white/20">|</span>
            <Link href="/#terms" className="hover:text-white transition-colors">
              الشروط والأحكام
            </Link>
          </div>

          {/* Center: Copyright */}
          <div className="text-slate-300 font-medium">
            سوق حورس - جميع الحقوق محفوظة
          </div>

          {/* Left (in RTL): Trust slogan */}
          <div className="text-slate-400 hidden sm:block">
            شريكك الموثوق للتجارة والتسويق
          </div>
        </div>
      </div>
    </footer>
  );
}
