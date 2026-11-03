'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Briefcase, ChevronDown, FileText, Loader2, Mail, Phone, Send, User } from 'lucide-react';
import { toast } from 'react-toastify';

/**
 * الصورة المطلوبة: public/images/join/join-form.jpg  (760 × 480)
 * (رأس الصقر الذهبي + أفق القاهرة بخلفية فاتحة)
 */

const ACTIVITY_TYPES = [
  'شريك / مستثمر',
  'شركة تسويق وإعلان',
  'مالك عقارات',
  'تاجر / صاحب متجر',
  'مورد / شركة',
  'مقدم خدمات مهنية',
];

const INPUT_WRAP =
  'relative flex items-center bg-white border border-slate-200 rounded-md focus-within:ring-2 focus-within:ring-[#C9972B] transition-all';
const INPUT =
  'w-full h-11 bg-transparent outline-none text-xs text-slate-800 placeholder:text-slate-500 pr-10 pl-3';
const ICON = 'absolute right-3 w-4 h-4 text-[#0A2150] pointer-events-none';

export default function JoinForm() {
  const [form, setForm] = useState({
    fullName: '',
    activityType: '',
    email: '',
    phone: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const setField = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // TODO: اربط الفورم بالـ API / server action بتاعك هنا
      // await submitJoinRequest(form);
      toast.success('تم إرسال طلبك بنجاح، سنتواصل معك قريبًا');
      setForm({ fullName: '', activityType: '', email: '', phone: '', notes: '' });
    } catch {
      toast.error('تعذّر إرسال الطلب، حاول مرة أخرى');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="join-form" className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* الفورم (يمين) */}
        <div className="md:col-span-7">
          <h2 className="text-lg font-black text-[#0A2150]">سجل بياناتك للانضمام إلى المنصة</h2>
          <p className="text-xs text-slate-500 mt-2 mb-5">
            املأ النموذج أدناه وسنتواصل معك لمراجعة بياناتك وتفعيل حسابك.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className={INPUT_WRAP}>
                <User className={ICON} />
                <input
                  type="text"
                  required
                  value={form.fullName}
                  onChange={setField('fullName')}
                  placeholder="الاسم الكامل *"
                  className={INPUT}
                />
              </label>

              <label className={INPUT_WRAP}>
                <Briefcase className={ICON} />
                <select
                  required
                  value={form.activityType}
                  onChange={setField('activityType')}
                  className={`${INPUT} appearance-none cursor-pointer ${
                    form.activityType ? '' : 'text-slate-500'
                  }`}
                >
                  <option value="" disabled>
                    نوع النشاط *
                  </option>
                  {ACTIVITY_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute left-3 w-4 h-4 text-slate-500 pointer-events-none" />
              </label>

              <label className={INPUT_WRAP}>
                <Mail className={ICON} />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={setField('email')}
                  placeholder="البريد الإلكتروني *"
                  className={INPUT}
                />
              </label>

              <label className={INPUT_WRAP}>
                <Phone className={ICON} />
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={setField('phone')}
                  placeholder="رقم الهاتف *"
                  className={INPUT}
                />
              </label>
            </div>

            <label className={INPUT_WRAP}>
              <FileText className={ICON} />
              <input
                type="text"
                value={form.notes}
                onChange={setField('notes')}
                placeholder="معلومات إضافية (اختياري)"
                className={INPUT}
              />
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-md bg-[#C9972B] hover:bg-[#b5851f] text-white text-xs font-bold transition-colors disabled:opacity-60 cursor-pointer"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4 -scale-x-100" />
              )}
              <span>إرسال الطلب</span>
            </button>
          </form>
        </div>

        {/* الصورة (يسار) */}
        <div className="md:col-span-5 relative w-full aspect-372/238 rounded-xl overflow-hidden border border-slate-200">
          <Image
            src="/img/joinform.png"
            alt="سوق حورس"
            fill
            sizes="(min-width: 768px) 40vw, 100vw"
            className="object-fill"
          />
        </div>
      </div>
    </section>
  );
}