'use client';

import { useState } from 'react';
import { ChevronDown, Loader2, Send } from 'lucide-react';
import { toast } from 'react-toastify';

const INQUIRY_TYPES = [
  'استفسار عام',
  'الدعم الفني',
  'الانضمام كشريك أو مورد',
  'إضافة منتجات أو خدمات',
  'شكوى أو اقتراح',
];

const FIELD =
  'w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-[#C9972B] transition-all';
const LABEL = 'block text-[11px] font-black text-[#0A2150] mb-1.5';

export default function ContactForm() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    inquiryType: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const setField =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // TODO: اربط الفورم بالـ API / server action بتاعك هنا
      // await sendContactMessage(form);
      toast.success('تم إرسال رسالتك بنجاح، سنرد عليك قريبًا');
      setForm({ fullName: '', email: '', phone: '', inquiryType: '', message: '' });
    } catch {
      toast.error('تعذّر إرسال الرسالة، حاول مرة أخرى');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      id="contact-form"
      className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden scroll-mt-24"
    >
      <div className="bg-[#0A2150] px-6 py-4">
        <h2 className="text-lg font-black text-white">أرسل لنا رسالة</h2>
        <p className="text-[11px] text-slate-200 mt-1">نحن نرحب بجميع استفساراتك ومقترحاتك</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
          <div>
            <label className={LABEL}>الاسم الكامل *</label>
            <input
              type="text"
              required
              value={form.fullName}
              onChange={setField('fullName')}
              placeholder="أدخل اسمك الكامل"
              className={FIELD}
            />
          </div>

          <div>
            <label className={LABEL}>البريد الإلكتروني *</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={setField('email')}
              placeholder="أدخل بريدك الإلكتروني"
              className={FIELD}
            />
          </div>

          <div>
            <label className={LABEL}>رقم الهاتف</label>
            <input
              type="tel"
              value={form.phone}
              onChange={setField('phone')}
              placeholder="أدخل رقم الهاتف (اختياري)"
              className={FIELD}
            />
          </div>

          <div>
            <label className={LABEL}>نوع الاستفسار</label>
            <div className="relative">
              <select
                value={form.inquiryType}
                onChange={setField('inquiryType')}
                className={`${FIELD} appearance-none cursor-pointer ${
                  form.inquiryType ? '' : 'text-slate-400'
                }`}
              >
                <option value="">اختر نوع الاستفسار</option>
                {INQUIRY_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>
          </div>
        </div>

        <div>
          <label className={LABEL}>رسالتك *</label>
          <textarea
            required
            rows={4}
            value={form.message}
            onChange={setField('message')}
            placeholder="اكتب رسالتك هنا..."
            className="w-full px-3 py-2.5 rounded-md border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-[#C9972B] transition-all resize-y"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full h-10 inline-flex items-center justify-center gap-2 rounded-md bg-[#C9972B] hover:bg-[#b5851f] text-white text-xs font-bold transition-colors disabled:opacity-60 cursor-pointer"
        >
          {submitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4 -scale-x-100" />
          )}
          <span>إرسال الرسالة</span>
        </button>
      </form>
    </div>
  );
}