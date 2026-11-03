import Image from 'next/image';
import Link from 'next/link';
import { BadgeCheck, Boxes, UserPlus, Users, UserCog } from 'lucide-react';

/**
 * الصورة المطلوبة: public/images/join/join-cta.jpg  (800 × 400)
 * (الكرة الأرضية + اللاب توب + الصناديق)
 */

const BENEFITS = [
  { icon: UserCog, label: 'إدارة حسابك\nبسهولة' },
  { icon: BadgeCheck, label: 'تعزيز علامتك\nالتجارية' },
  { icon: Users, label: 'الوصول إلى\nعملاء جدد' },
  { icon: Boxes, label: 'عرض منتجاتك\nوخدماتك' },
];

export default function WhatYouGet() {
  return (
    <section className="relative overflow-hidden bg-[#0A2150]">
      {/* صورة اليسار */}
      <div className="absolute inset-y-0 left-0 w-full md:w-[45%]">
        <Image
          src="/img/whatyouget.png"
          alt=""
          fill
          sizes="(min-width: 768px) 45vw, 100vw"
          className="object-cover object-left"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-l from-[#0A2150] from-55% via-[#0A2150]/85 via-70% to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* ماذا ستحصل؟ (يمين) */}
        <div className="md:col-span-6">
          <h2 className="text-lg md:text-xl font-black text-white mb-4">ماذا ستحصل؟</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 border border-white/15 rounded-lg bg-white/5 py-5">
            {BENEFITS.map(({ icon: Icon, label }, i) => (
              <div
                key={label}
                className={`flex flex-col items-center text-center px-2 ${
                  i !== BENEFITS.length - 1 ? 'md:border-l md:border-white/15' : ''
                }`}
              >
                <span className="w-14 h-14 rounded-full border-2 border-[#C9972B] flex items-center justify-center">
                  <Icon className="w-6 h-6 text-[#F3C053]" />
                </span>
                <span className="text-[11px] font-bold text-white mt-3 leading-relaxed whitespace-pre-line">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* انضم إلينا الآن (وسط) */}
        <div className="md:col-span-3 md:pr-4">
          <h3 className="text-lg font-black text-[#E0A82E]">انضم إلينا الآن</h3>
          <p className="text-xs text-white leading-loose mt-2">
            واستفد من مميزات المنصة لتطوير أعمالك وتحقيق المزيد من النجاح.
          </p>
          <Link
            href="#join-form"
            className="inline-flex items-center justify-center gap-2 mt-4 px-8 py-2.5 rounded-md bg-[#C9972B] hover:bg-[#b5851f] text-white text-xs font-bold transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>سجل الآن</span>
          </Link>
        </div>

        <div className="hidden md:block md:col-span-3" />
      </div>
    </section>
  );
}