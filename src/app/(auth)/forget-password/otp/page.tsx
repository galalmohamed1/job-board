'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { KeyRound, ArrowRight, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import HorusLogo from '@/components/logo/HorusLogo';
import { verifyResetCode, forgotPasswords } from '@/action/auth.action';

const OTP_LENGTH = 6;

export default function ForgetPasswordOtpPage() {
  const router = useRouter();
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Tick countdown for resend button
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

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

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const otp = digits.join('');
    if (otp.length < OTP_LENGTH) {
      setErrorMessage('يرجى إدخال رمز التحقق كاملاً المكون من 6 أرقام.');
      return;
    }

    const email =
      typeof window !== 'undefined'
        ? sessionStorage.getItem('reset_email') || ''
        : '';
    if (!email) {
      toast.error('انتهت صلاحية الجلسة، يرجى المحاولة من جديد.');
      router.push('/forget-password');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    const result = await verifyResetCode(email, { otp });

    if (result?.ok) {
      toast.success('تم التحقق من الرمز بنجاح! يمكنك الآن تعيين كلمة المرور الجديدة.');
      router.push('/forget-password/new-password');
    } else {
      const msg = result?.error || 'رمز التحقق غير صحيح، يرجى المحاولة مرة أخرى.';
      setErrorMessage(msg);
      toast.error(msg);
      setLoading(false);
    }
  }

  async function handleResend() {
    const email =
      typeof window !== 'undefined'
        ? sessionStorage.getItem('reset_email') || ''
        : '';
    if (!email) {
      toast.error('انتهت صلاحية الجلسة، يرجى المحاولة من جديد.');
      router.push('/forget-password');
      return;
    }
    setResending(true);
    const result = await forgotPasswords({ email });
    setResending(false);
    if (result?.ok) {
      toast.success('تم إرسال رمز جديد إلى بريدك الإلكتروني.');
      setCountdown(60);
      setDigits(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    } else {
      toast.error(result?.error || 'فشل في إعادة إرسال الرمز.');
    }
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

        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#FDF8ED] border border-[#D49B35]/30 mx-auto mb-4 text-[#D49B35]">
          <KeyRound className="w-6 h-6" />
        </div>

        <h1 className="text-2xl font-black text-[#08101E] mb-2">تأكيد الرمز (OTP)</h1>
        <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
          أدخل الرمز المكون من 6 أرقام الذي تم إرساله إلى بريدك الإلكتروني.
        </p>

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
            {countdown > 0 ? (
              <span className="font-bold text-slate-400">
                إعادة الإرسال بعد ({countdown}s)
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="font-bold text-[#D49B35] hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                {resending && <RefreshCw className="w-3 h-3 animate-spin" />}
                <span>إعادة إرسال الرمز</span>
              </button>
            )}
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
              <span>تأكيد ومتابعة</span>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-center">
          <Link
            href="/forget-password"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#D49B35] transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
            <span>العودة للبريد الإلكتروني</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
