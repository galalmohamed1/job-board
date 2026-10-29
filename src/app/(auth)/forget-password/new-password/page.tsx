'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import {
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  KeyRound,
  ArrowRight,
} from 'lucide-react';
import HorusLogo from '@/components/logo/HorusLogo';
import {
  ResetPasswordSchema,
  ResetPasswordSchemaType,
} from '@/schemas/auth.schema';
import { resetPassword } from '@/action/auth.action';

export default function NewPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { email: '', newPassword: '', rePassword: '' },
  });

  async function onSubmit(data: ResetPasswordSchemaType) {
    // Prefer the stored email, fall back to what user types in the hidden field
    const storedEmail =
      typeof window !== 'undefined'
        ? sessionStorage.getItem('reset_email') || ''
        : '';
    const payload: ResetPasswordSchemaType = {
      ...data,
      email: storedEmail || data.email,
    };

    if (!payload.email) {
      toast.error('لم يتم العثور على البريد الإلكتروني، يرجى المحاولة من البداية.');
      router.push('/forget-password');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    const result = await resetPassword(payload);

    if (result?.ok) {
      toast.success('تم إعادة تعيين كلمة المرور بنجاح! يرجى تسجيل الدخول.');
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('reset_email');
      }
      router.push('/login');
    } else {
      const msg = result?.error || 'حدث خطأ ما، يرجى المحاولة مرة أخرى.';
      setErrorMessage(msg);
      toast.error(msg);
      setLoading(false);
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

        <h1 className="text-2xl font-black text-[#08101E] mb-2">
          تعيين كلمة مرور جديدة
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
          يرجى إدخال كلمة المرور الجديدة وتأكيدها للمتابعة.
        </p>

        {errorMessage && (
          <div className="mb-5 flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs text-right">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-right">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              كلمة المرور الجديدة
            </label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                {...register('newPassword')}
                placeholder="••••••••"
                className={`w-full rounded-xl border bg-slate-50 px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#D49B35] ${
                  errors.newPassword ? 'border-red-400' : 'border-slate-200'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute left-3 top-3 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              تأكيد كلمة المرور الجديدة
            </label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                {...register('rePassword')}
                placeholder="••••••••"
                className={`w-full rounded-xl border bg-slate-50 px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#D49B35] ${
                  errors.rePassword ? 'border-red-400' : 'border-slate-200'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute left-3 top-3 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                {showConfirm ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.rePassword && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {errors.rePassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#D49B35] hover:bg-[#c38c2b] text-[#08101E] font-black text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري حفظ كلمة المرور...</span>
              </>
            ) : (
              <span>حفظ كلمة المرور</span>
            )}
          </button>
        </form>

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
