'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signIn, getSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import HorusLogo from '@/components/logo/HorusLogo';
import { LoginSchema, LoginSchemaType } from '@/schemas/auth.schema';

export default function LoginPage() {
  const { data: sessionData, status, update } = useSession();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (status === 'authenticated' && sessionData?.user) {
      const role = (sessionData.user as any)?.role;
      window.location.href = role === 'admin' ? '/dashboard' : '/';
    }
  }, [status, sessionData]);

  const form = useForm<LoginSchemaType>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(LoginSchema),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = form;

  async function mySubmit(data: LoginSchemaType) {
    setLoading(true);
    setErrorMessage(null);

    const response = await signIn('credentials', {
      ...data,
      redirect: false,
    });

    if (response?.ok) {
      // Update session then fetch to get the freshest role
      await update();
      const session = await getSession();
      const role = (session?.user as any)?.role;

      if (role === 'admin') {
        toast.success('Welcome back, Admin!');
        window.location.replace('/dashboard');
      } else {
        toast.success('Hey! Good to see you. Welcome back! You are now logged in ❤️💕');
        window.location.replace('/');
      }
    } else {
      console.log("SIGNIN RESPONSE:", response);
      const errorMsg =
        response?.error && response.error !== "CredentialsSignin"
          ? response.error
          : "الإيميل أو الباسورد غير صحيح، أو الحساب غير مفعّل.";
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
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

        <h1 className="text-2xl font-black text-[#08101E] mb-2">تسجيل الدخول</h1>
        <p className="text-xs sm:text-sm text-slate-500 mb-6">
          مرحباً بك مجدداً في سوق حورس، أدخل بياناتك للمتابعة
        </p>

        {errorMessage && (
          <div className="mb-5 flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs text-right">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(mySubmit)} className="space-y-4 text-right">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              البريد الإلكتروني
            </label>
            <div className="relative">
              <input
                type="email"
                {...register('email')}
                placeholder="example@domain.com"
                className={`w-full rounded-xl border bg-slate-50 px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#D49B35] ${
                  errors.email ? 'border-red-400' : 'border-slate-200'
                }`}
              />
              <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700">كلمة المرور</label>
              <Link
                href="/forget-password"
                className="text-xs font-bold text-[#D49B35] hover:underline"
              >
                نسيت كلمة المرور؟
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                placeholder="••••••••"
                className={`w-full rounded-xl border bg-slate-50 px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#D49B35] ${
                  errors.password ? 'border-red-400' : 'border-slate-200'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-3 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {errors.password.message}
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
                <span>جاري تسجيل الدخول...</span>
              </>
            ) : (
              <span>تسجيل الدخول</span>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-600">
          <span>ليس لديك حساب؟</span>
          <Link
            href="/register"
            className="font-bold text-[#D49B35] hover:underline flex items-center gap-1"
          >
            <span>إنشاء حساب جديد</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
