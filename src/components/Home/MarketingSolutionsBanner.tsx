import React from 'react'
import {
  Headphones,
  Sparkles,
  Award,
  Layers,
  ArrowLeft,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
function MarketingSolutionsBanner() {
    const features = [
    {
      title: 'فريق دعم متميز',
      subtitle: 'لخدمتك دائماً',
      icon: Headphones,
    },
    {
      title: 'سهولة الاستخدام',
      subtitle: 'تجربة مريحة وسريعة',
      icon: Sparkles,
    },
    {
      title: 'جودة واحترافية',
      subtitle: 'خدمات مضمونة وموثوقة',
      icon: Award,
    },
    {
      title: 'تنوع الخدمات',
      subtitle: 'شركاء متخصصون',
      icon: Layers,
    },
  ];
  return (
    <section className="w-full overflow-hidden py-6 font-['Cairo'] ">
      <div className="grid items-center gap-6 bg-[linear-gradient(to_right,#0A1A3D_0%,#1B2F5E_22%,#9AA9C4_45%,#E9EDF5_65%,#F7F8FB_100%)] p-12 lg:grid-cols-2">
        {/* الميزات (على اليمين في RTL) */}
        <div className="grid grid-cols-2 gap-y-6 sm:grid-cols-4">
          {features.map(({ icon: Icon, title, subtitle }) => (
            <div
              key={title}
              className="flex flex-col items-center px-3 text-center sm:border-s-2 sm:border-slate-300 sm:first:border-s-0"
            >
              <div className="mb-3 grid h-14 w-14 place-items-center rounded-full border border-amber-300 bg-white/70">
                <Icon className="h-6 w-6 text-[#D49B35]" strokeWidth={1.8} />
              </div>
              <h4 className="mb-1 text-sm font-bold text-blue-950">{title}</h4>
              <p className="text-xs text-slate-500">{subtitle}</p>
            </div>
          ))}
        </div>
 
        {/* البانر الكحلي (على الشمال في RTL) */}
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-linear-to-br from-[#070F1E] via-[#0B1933] to-[#0F2347] p-5 text-white shadow-xl sm:flex-row sm:p-6">
          <div className="flex flex-1 flex-col items-start text-right">
            <h2 className="mb-2 text-xl font-bold leading-snug sm:text-2xl">حلول تسويقية متكاملة</h2>
            <p className="mb-5 text-xs leading-relaxed text-slate-300 sm:text-sm">
              لنجاح أعمالك والوصول إلى جمهورك المستهدف بأحدث الأدوات والتقنيات
            </p>
            <Link
              href="#contact"
              className="inline-flex items-center gap-2 rounded-lg bg-[#E3B04B] px-6 py-2.5 text-xs font-bold text-slate-900 shadow-md transition hover:bg-[#F0C25E] active:scale-95 sm:text-sm"
            >
              تواصل معنا
              <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
            </Link>
          </div>
 
          <div className="w-48 shrink-0 sm:w-56">
            <Image
              src="/img/social.png"
              alt="حلول تسويقية متكاملة"
              width={448}
              height={336}
              className="h-auto w-full rounded-xl object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default MarketingSolutionsBanner