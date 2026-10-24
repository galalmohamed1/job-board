'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import HorusLogo from '@/components/logo/HorusLogo';

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#F8FAFC] py-12 px-4 sm:px-6" dir="rtl">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 p-8 shadow-xs text-center">
        <div className="flex justify-center mb-6">
          <HorusLogo size="md" />
        </div>

        <h1 className="text-2xl font-black text-[#08101E] mb-2">استعادة كلمة المرور</h1>
        <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
          أدخل بريدك الإلكتروني المسجل وسنرسل لك رمز التأكيد لإعادة تعيين كلمة المرور.
        </p>

        {submitted ? (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm">
              <ShieldCheck className="w-8 h-8 mx-auto text-emerald-600 mb-2" />
              تم إرسال رمز التحقق إلى بريدك الإلكتروني بنجاح.
            </div>
            <Link
              href="/forget-password/otp"
              className="w-full block py-3 rounded-xl bg-[#D49B35] hover:bg-[#c38c2b] text-[#08101E] font-black text-sm shadow-md transition-all"
            >
              متابعة لإدخال رمز التأكيد
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-right">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@domain.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#D49B35]"
                />
                <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#D49B35] hover:bg-[#c38c2b] text-[#08101E] font-black text-sm shadow-md transition-all cursor-pointer"
            >
              إرسال رمز التأكيد
            </button>
          </form>
        )}

        <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-center">
          <Link
            href="/login"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#D49B35] transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
            <span>العودة لتسجيل الدخول</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
