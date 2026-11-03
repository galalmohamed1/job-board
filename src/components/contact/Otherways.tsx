import Link from 'next/link';
import { Headset, MessageCircle, MessagesSquare } from 'lucide-react';

const WAYS = [
  {
    icon: Headset,
    title: 'الدعم الفني',
    desc: ['للمساعدة في استخدام الموقع', 'أو حل أي مشكلة'],
    cta: 'تواصل معنا',
    href: '#contact-form',
  },
  {
    icon: MessageCircle,
    title: 'واتساب',
    desc: ['+20 10 1234 5678', 'للاستفسارات السريعة'],
    cta: 'تواصل عبر واتساب',
    href: 'https://wa.me/201012345678',
    external: true,
    ltrFirstLine: true,
  },
  {
    icon: MessagesSquare,
    title: 'الدردشة المباشرة',
    desc: ['تحدث مع فريق الدعم', 'خلال ساعات العمل'],
    cta: 'ابدأ المحادثة',
    href: '/chat',
  },
];

export default function OtherWays() {
  return (
    <div className="bg-[#F4F9FE] rounded-lg border border-[#DCE8F5] shadow-2xs p-6">
      <h2 className="text-xl font-black text-[#0A2150]">طرق أخرى للتواصل</h2>
      <p className="text-xs text-slate-500 mt-1.5 mb-6">يمكنك أيضًا الوصول إلينا من خلال</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-6">
        {WAYS.map(({ icon: Icon, title, desc, cta, href, external, ltrFirstLine }, i) => (
          <div
            key={title}
            className={`flex flex-col items-center text-center px-3 ${
              i !== WAYS.length - 1 ? 'sm:border-l sm:border-[#DCE8F5]' : ''
            }`}
          >
            <span className="w-11 h-11 rounded-full bg-[#0A2150] text-white flex items-center justify-center">
              <Icon className="w-5 h-5" />
            </span>
            <h3 className="text-xs font-black text-[#0A2150] mt-3">{title}</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed mt-1.5 flex-1">
              <span dir={ltrFirstLine ? 'ltr' : undefined} className="block">
                {desc[0]}
              </span>
              <span className="block">{desc[1]}</span>
            </p>
            <Link
              href={href}
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="mt-4 inline-flex items-center justify-center px-4 h-8 rounded-md border border-[#C9972B] text-[#C9972B] hover:bg-[#C9972B] hover:text-white text-[11px] font-bold whitespace-nowrap transition-colors"
            >
              {cta}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}