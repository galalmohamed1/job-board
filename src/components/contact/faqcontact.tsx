'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';

/**
 * الصورة المطلوبة: public/images/contact/contact-faq.jpg  (740 × 680)
 * (إيد ماسكة موبايل وفوقه فقاعة شات)
 */

// العمود الأيمن ثم العمود الأيسر - عدّل الإجابات براحتك
const FAQ_COLUMNS = [
  [
    {
      q: 'كيف يمكنني التسجيل في المنصة؟',
      a: 'اضغط على زر "سجل الآن"، واملأ بياناتك الأساسية، وسنراجع طلبك ونفعّل حسابك في أقرب وقت.',
    },
    {
      q: 'هل هناك رسوم على استخدام المنصة؟',
      a: 'التسجيل مجاني. بعض الخدمات المميزة قد تكون لها رسوم نوضحها لك بالتفصيل قبل الاشتراك.',
    },
    {
      q: 'كيف يمكنني إضافة منتجات أو خدمات؟',
      a: 'بعد تفعيل حسابك، ادخل إلى لوحة التحكم الخاصة بك واختر "إضافة منتج أو خدمة" ثم أكمل البيانات.',
    },
  ],
  [
    {
      q: 'كيف أتتبع طلبي بعد الشراء؟',
      a: 'من صفحة "طلباتي" في حسابك تستطيع متابعة حالة كل طلب خطوة بخطوة حتى التسليم.',
    },
    {
      q: 'هل تقدمون دعمًا فنيًا؟',
      a: 'نعم، فريق الدعم الفني متاح خلال ساعات العمل عبر الدردشة والهاتف والبريد الإلكتروني.',
    },
    {
      q: 'كيف يمكنني الانضمام كشريك أو مورد؟',
      a: 'من صفحة "انضم إلينا" املأ نموذج التسجيل واختر نوع نشاطك، وسيتواصل معك فريقنا.',
    },
  ],
];

export default function FaqContact() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_230px] bg-[#F4F9FE] rounded-lg border border-[#DCE8F5] shadow-2xs overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-black text-[#0A2150]">الأسئلة الشائعة</h2>
            <p className="text-xs text-slate-500 mt-1.5 mb-5">
              إجابات على أكثر الأسئلة التي ترد إلينا
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3 items-start">
              {FAQ_COLUMNS.map((col, ci) => (
                <div key={ci} className="space-y-3">
                  {col.map(({ q, a }) => {
                    const isOpen = open === q;
                    return (
                      <div
                        key={q}
                        className="bg-white border border-[#DCE8F5] rounded-md overflow-hidden"
                      >
                        <button
                          type="button"
                          onClick={() => setOpen(isOpen ? null : q)}
                          aria-expanded={isOpen}
                          className="w-full flex items-center justify-between gap-2 px-3 h-10 text-right cursor-pointer"
                        >
                          <span className="flex items-center gap-1.5 text-[11px] font-black text-[#0A2150]">
                            {ci === 1 && <Sparkles className="w-3 h-3 text-[#0A2150]" />}
                            {q}
                          </span>
                          <ChevronDown
                            className={`w-3.5 h-3.5 text-slate-500 shrink-0 transition-transform ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        {isOpen && (
                          <p className="px-3 pb-3 text-[11px] text-slate-600 leading-loose">{a}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="relative hidden md:block rounded-tr-[90px] overflow-hidden">
            <Image
              src="/img/faqcontact.png"
              alt=""
              fill
              sizes="230px"
              className="object-fill"
            />
          </div>
        </div>
      </div>
    </section>
  );
}