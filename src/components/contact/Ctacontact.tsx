import Image from 'next/image';
import Link from 'next/link';
import { UserPlus } from 'lucide-react';

export default function CtaContact() {
  return (
    <section className="relative overflow-hidden bg-[#0A2150]">
      <Image
        src="/img/contact-cta.png"
        alt=""
        fill
        sizes="100vw"
        className="object-fill"
      />
      <div className="absolute inset-0 bg-gradient-to-l from-[#0A2150]/95 from-50% to-[#0A2150]/40" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 flex flex-col sm:flex-row items-center gap-5 sm:gap-8">
        <Link
          href="/register"
          className="inline-flex items-center justify-center gap-2 px-9 h-10 rounded-md bg-[#C9972B] hover:bg-[#b5851f] text-white text-xs font-bold transition-colors whitespace-nowrap"
        >
          <UserPlus className="w-4 h-4" />
          <span>ابدأ الآن</span>
        </Link>

        <div className="text-center sm:text-right">
          <h2 className="text-lg md:text-xl font-black text-[#E0A82E]">
            انضم إلى سوق حورس الآن
          </h2>
          <p className="text-xs text-white mt-1.5">
            كن جزءاً من أكبر منصة متكاملة للتجارة والخدمات والتسويق والعقارات
          </p>
        </div>
      </div>
    </section>
  );
}