'use client';

import React, { useState, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import {
  ShieldCheck,
  ArrowRight,
  Loader2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import HorusLogo from '@/components/logo/HorusLogo';
import { verifyResetCode } from '@/action/auth.action';

const OTP_LENGTH = 6;

function RegisterOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  function handleChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, OTP_LENGTH);
    const newDigits = [...digits];
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i];
    }
    setDigits(newDigits);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  }

  async function handleVerify(code: string) {
    if (!email) {
      toast.error('لم يتم العثور على البريد الإلكتروني، يرجى إعادة التسجيل.');
      router.push('/register');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const result = await verifyResetCode(email, { otp: code });
      if (!result?.ok) {
        throw new Error(result?.error || 'رمز التحقق غير صحيح، يرجى المحاولة ثانية.');
      }
      toast.success('تم تأكيد الحساب بنجاح! يمكنك الآن تسجيل الدخول.');
      router.push('/login');
    } catch (err: any) {
      const msg = err?.message || 'حدث خطأ أثناء تأكيد الحساب.';
      setErrorMessage(msg);
      toast.error(msg);
      setLoading(false);
    }
  }

  async function handleResend() {
    setResending(true);
    try {
      toast.info('تم طلب إعادة إرسال الرمز...');
      // Simulated or API call for resend
      setTimeout(() => {
        setResending(false);
        toast.success('إذا كان الحساب مسجلاً، فقد تم إرسال رمز جديد.');
      }, 1000);
    } catch (err: any) {
      setResending(false);
      toast.error(err?.message || 'فشل في إعادة الإرسال.');
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const otp = digits.join('');
    if (otp.length < OTP_LENGTH) {
      setErrorMessage('يرجى إدخال رمز التحقق كاملاً المكون من 6 أرقام.');
      return;
    }
    await handleVerify(otp);
  }

  return (
    <div
      className="min-h-[80vh] flex items-center justify-center bg-[#F8FAFC] py-12 px-4 sm:px-6"
      dir="rtl"
    >
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 p-8 shadow-xs text-center">
        <div className="flex justify-center mb-6">
          <HorusLogo size="md" />
        </div>

        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 border border-emerald-200 mx-auto mb-4 text-emerald-600">
          <ShieldCheck className="w-6 h-6" />
        </div>

        <h1 className="text-2xl font-black text-[#08101E] mb-2">
          تأكيد الحساب (OTP)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mb-2 leading-relaxed">
          أدخل رمز التحقق المكون من 6 أرقام لتفعيل حسابك الجديد في سوق حورس.
        </p>
        {email && (
          <p className="text-xs font-semibold text-[#D49B35] mb-6 dir-ltr text-center">
            {email}
          </p>
        )}

        {errorMessage && (
          <div className="mb-5 flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs text-right">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="flex justify-center gap-2" dir="ltr">
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputRefs.current[i] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={handlePaste}
                className="w-11 h-12 text-center text-lg font-black rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#D49B35] focus:bg-white transition-all text-slate-800"
              />
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 text-xs">
            <span className="text-slate-500">لم يصلك الرمز؟</span>
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="font-bold text-[#D49B35] hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              {resending && <RefreshCw className="w-3 h-3 animate-spin" />}
              <span>إعادة إرسال الرمز</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#D49B35] hover:bg-[#c38c2b] text-[#08101E] font-black text-sm shadow-md transition-all text-center flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري التحقق...</span>
              </>
            ) : (
              <span>تأكيد الحساب والدخول</span>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-center">
          <Link
            href="/register"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#D49B35] transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
            <span>تعديل البيانات</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function RegisterOtpPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#D49B35]" />
        </div>
      }
    >
      <RegisterOtpContent />
    </Suspense>
  );
}
