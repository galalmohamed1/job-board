'use client';

import Link from 'next/link';
import {
  Megaphone,
  TrendingUp,
  Target,
  BarChart3,
  CheckCircle2,
  ArrowLeft,
  Users,
  Sparkles,
} from 'lucide-react';

export default function MarketingPage() {
  const services = [
    {
      title: 'إدارة الحملات الإعلانية الممولة',
      desc: 'إعلانات مدروسة ومستهدفة على فيسبوك، إنستغرام، تيك توك، وجوجل لتحقيق أعلى عائد استثماري.',
      icon: Megaphone,
      features: ['استهداف دقيق للشريحة المطلوبة', 'تحسين مستمر لتكلفة النقرة والتحويل', 'تقارير أداء دورية وشاملة'],
    },
    {
      title: 'بناء الهوية واستراتيجيات التسويق',
      desc: 'تطوير خطة تسويقية شاملة تعزز مكانة علامتك التجارية وتزيد من تفاعل العملاء وثقتهم.',
      icon: Target,
      features: ['تحليل المنافسين والسوق', 'صناعة المحتوى الإبداعي', 'خطط نشر وجدولة منتظمة'],
    },
    {
      title: 'تحسين محركات البحث والنمو (Growth & SEO)',
      desc: 'تصدر نتائج البحث الأولى في جوجل وجذب عملاء عضويين ومستمرين لمتجرك أو موقعك.',
      icon: TrendingUp,
      features: ['تحسين الكلمات المفتاحية', 'بناء روابط خلفية موثوقة', 'تحسين سرعة وتجربة الموقع'],
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 sm:py-16 text-slate-800" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D49B35]/15 text-[#845A13] border border-[#D49B35]/30 text-xs font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#D49B35]" />
            <span>خدمات التسويق الرقمي الاحترافية</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#08101E] tracking-tight leading-tight mb-4">
            نمِّ أعمالك وضاعف مبيعاتك مع حلول حورس التسويقية
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            نساعدك في الوصول إلى جمهورك المستهدف، زيادة المبيعات، وبناء حضور رقمي قوي ومستدام لعلامتك التجارية.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {services.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <div
                key={idx}
                className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#08101E] text-[#D49B35] mb-5 shadow-xs">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-lg font-black text-[#08101E] mb-2">{srv.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6">
                    {srv.desc}
                  </p>

                  <ul className="space-y-2.5 mb-6">
                    {srv.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2 text-xs font-bold text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href="/#contact"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#D49B35] hover:bg-[#c38c2b] py-2.5 text-xs sm:text-sm font-black text-[#08101E] transition-all shadow-xs"
                >
                  <span>طلب استشارة تسويقية</span>
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Banner */}
        <div className="rounded-3xl bg-[#08101E] border border-slate-800 p-8 sm:p-12 text-center text-white relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black mb-3">
              جاهز لإطلاق حملتك التسويقية القادمة؟
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
              تواصل مع خبرائنا اليوم لتحديد الخطة المناسبة لأهدافك وميزانيتك.
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#D49B35] hover:bg-[#c38c2b] text-[#08101E] font-black text-sm shadow-lg transition-all"
            >
              <span>تواصل مع الفريق الآن</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
