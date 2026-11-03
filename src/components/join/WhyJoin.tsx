import { Headset, Megaphone, ShieldCheck, TrendingUp, Users } from 'lucide-react';

const REASONS = [
  {
    icon: Headset,
    title: 'دعم متواصل',
    desc: 'فريق دعم متخصص لمساعدتك دائمًا',
  },
  {
    icon: TrendingUp,
    title: 'فرص نمو أكبر',
    desc: 'وسع نشاطك ووصل إلى أسواق جديدة',
  },
  {
    icon: ShieldCheck,
    title: 'بيئة آمنة وموثوقة',
    desc: 'نظام تحقق ومراجعة لجميع الحسابات',
  },
  {
    icon: Megaphone,
    title: 'تسويق مجاني',
    desc: 'ترويج لمنتجاتك وخدماتك عبر قنوات المنصة المتنوعة',
  },
  {
    icon: Users,
    title: 'شراكات حقيقية',
    desc: 'تواصل مع عملاء وموردين وشركاء موثوقين',
  },
];

export default function WhyJoin() {
  return (
    <section className="py-10 bg-[#FAFCFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl md:text-2xl font-black text-[#0A2150]">لماذا تنضم إلى سوق حورس؟</h2>
        <p className="text-xs md:text-sm text-slate-600 mt-2 mb-6">
          لأننا نقدم لك أكثر من مجرد منصة، نحن شريك نجاحك في رحلتك للنمو.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {REASONS.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="flex flex-col items-center text-center bg-white border border-slate-200 rounded-lg px-4 py-6 shadow-2xs hover:shadow-md transition-shadow"
            >
              <Icon className="w-9 h-9 text-[#0A2150]" strokeWidth={1.8} />
              <h3 className="text-sm font-black text-[#0A2150] mt-3">{title}</h3>
              <p className="text-[11px] text-slate-500 leading-loose mt-2">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}