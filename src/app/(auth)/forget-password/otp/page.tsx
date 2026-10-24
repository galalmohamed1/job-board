'use client';

import { useState } from 'react';
import Link from 'next/link';
import { KeyRound, ArrowRight } from 'lucide-react';
import HorusLogo from '@/components/logo/HorusLogo';

export default function ForgetPasswordOtpPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const handleChange = (val: string, index: number) => {
    if (val.length > 1) val = val.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#F8FAFC] py-12 px-4 sm:px-6" dir="rtl">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 p-8 shadow-xs text-center">
        <div className="flex justify-center mb-6">
          <HorusLogo size="md" />
        </div>

        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#FDF8ED] border border-[#D49B35]/30 mx-auto mb-4 text-[#D49B35]">
          <KeyRound className="w-6 h-6" />
        </div>

        <h1 className="text-2xl font-black text-[#08101E] mb-2">تأكيد الرمز (OTP)</h1>
        <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
          أدخل الرمز المكون من 6 أرقام الذي تم إرساله إلى بريدك الإلكتروني.
        </p>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          <div className="flex justify-center gap-2" dir="ltr">
            {otp.map((digit, i) => (
              <input
                key={i}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, i)}
                className="w-11 h-12 text-center text-lg font-black rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#D49B35] focus:bg-white transition-all"
              />
            ))}
          </div>

          <Link
            href="/forget-password/new-password"
            className="w-full block py-3 rounded-xl bg-[#D49B35] hover:bg-[#c38c2b] text-[#08101E] font-black text-sm shadow-md transition-all text-center"
          >
            تأكيد ومتابعة
          </Link>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-center">
          <Link
            href="/forget-password"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#D49B35] transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
            <span>العودة لإعادة الإرسال</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
