'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, ChevronDown, Megaphone, ShoppingCart,
  TrendingUp, Users, Vote,
} from 'lucide-react';

type Props = {
  id: string;
  name: string;
  description?: string;
  image?: string;
};

const campaignItems = [
  { title: 'الحملات الانتخابية', icon: Vote, href: '/#elections' },
  { title: 'الحملات الإعلانية', icon: Megaphone, href: '/#advertising' },
  { title: 'الحملات التسويقية', icon: TrendingUp, href: '/#marketing-camp' },
  { title: 'حملات العلاقات والتوعية', icon: Users, href: '/#awareness' },
];

// الاسم (أو جزء منه) → slug
// الترتيب مهم: "التسويق والإعلان" لازم يتفحص قبل أي حاجة تانية فيها كلمة قريبة
const SLUG_RULES: { slug: string; keywords: string[] }[] = [
  { slug: 'campaigns', keywords: ['الحملات الدعائية'] },
  { slug: 'marketing', keywords: ['التسويق والإعلان', 'التسويق والاعلان'] },
  { slug: 'realstate', keywords: ['عقارات', 'العقارات'] },
  { slug: 'product', keywords: ['المتجر', 'السوق'] },
  { slug: 'legal', keywords: ['الخدمات المهنية'] },
  { slug: 'partners', keywords: ['الشركاء والموردون'] },
];

// تطبيع بسيط: شيل المسافات الزيادة ووحّد الهمزات والتاء المربوطة
const normalize = (s: string) =>
  s
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه');

const getSlug = (name: string): string | undefined => {
  const n = normalize(name);
  return SLUG_RULES.find((r) =>
    r.keywords.some((k) => n.includes(normalize(k))),
  )?.slug;
};

// slug → الصفحة
const SLUG_ROUTES: Record<string, string> = {
  realstate: '/realstate',
  product: '/product',
  marketing: '/marketing',
  legal: '/legal',
  partners: '/partners',
};

const btnClass =
  'w-full py-2 px-3 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 hover:border-[#D49B35] transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm';

export default function CategoryCard({ id, name, description, image }: Props) {
  const [open, setOpen] = useState(false);

  const slug = getSlug(name);
  const hasDropdown = slug === 'campaigns';
  const href = (slug && SLUG_ROUTES[slug]) || '/';

  return (
    <div
      data-id={id}
      className="relative overflow-visible flex flex-col bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-300 text-center font-['Cairo']"
    >
      {/* Image */}
      <div className="relative h-44 w-full">
        <div className="absolute inset-0 overflow-hidden rounded-t-2xl bg-slate-100">
          {image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
          )}
        </div>

        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 z-10 w-11 h-11 rounded-full bg-[#1E3A8A] flex items-center justify-center border-2 border-white shadow-md">
          <ShoppingCart className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* Body */}
      <div className="pt-8 pb-5 px-4 flex flex-col flex-1 items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-[#0F172A] mb-2">{name}</h3>
          <p className="text-xs text-slate-500 leading-relaxed min-h-[36px]">
            {description}
          </p>
        </div>

        <div className="w-full mt-4 relative">
          {hasDropdown ? (
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className={btnClass}
            >
              <span>اكتشف المزيد</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
              />
            </button>
          ) : (
            <Link href={href} className={btnClass}>
              <span>اكتشف المزيد</span>
              <ArrowLeft className="w-3.5 h-3.5 text-slate-600" />
            </Link>
          )}

          {hasDropdown && open && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-30 text-right">
              {campaignItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-2.5 text-xs lg:text-sm font-semibold text-slate-700 hover:bg-amber-50 hover:text-[#D49B35] transition-colors"
                  >
                    <span className="w-7 h-7 rounded-lg bg-blue-50 text-[#1E3A8A] flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </span>
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}