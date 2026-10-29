'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import {
  User,
  Mail,
  Lock,
  Phone,
  Eye,
  EyeOff,
  ArrowLeft,
  Loader2,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import HorusLogo from '@/components/logo/HorusLogo';
import { RegisterSchema, RegisterSchemaType } from '@/schemas/auth.schema';
import { userRegister } from '@/action/auth.action';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [passwordValue, setPasswordValue] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  function checkPasswordStrength(password: string) {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  }
  const strength = checkPasswordStrength(passwordValue);

  const strengthData: Record<
    number,
    { text: string; color: string; bgt: string; width: string }
  > = {
    0: {
      text: 'ضعيفة جداً',
      color: 'bg-gray-200',
      bgt: 'text-gray-400',
      width: '0%',
    },
    1: {
      text: 'ضعيفة',
      color: 'bg-red-500',
      bgt: 'text-red-500',
      width: '20%',
    },
    2: {
      text: 'مقبولة',
      color: 'bg-orange-500',
      bgt: 'text-orange-500',
      width: '40%',
    },
    3: {
      text: 'جيدة',
      color: 'bg-blue-500',
      bgt: 'text-blue-500',
      width: '60%',
    },
    4: {
      text: 'قوية',
      color: 'bg-green-500',
      bgt: 'text-green-500',
      width: '80%',
    },
    5: {
      text: 'قوية جداً',
      color: 'bg-green-600',
      bgt: 'text-green-600',
      width: '100%',
    },
  };

  const currentStrength = strengthData[strength] || strengthData[0];

  const form = useForm<RegisterSchemaType>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      rePassword: '',
      phone: '',
      terms: false,
    },
    resolver: zodResolver(RegisterSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  async function mySubmit(data: RegisterSchemaType) {
    setLoading(true);
    setErrorMessage(null);

    const isAccountSuccess = await userRegister(data);
    if (isAccountSuccess?.ok) {
      toast.success(
        'Welcome You’re all set! Your account has been created successfully ❤️💕',
      );
      setTimeout(() => {
        router.push(`/register/otp?email=${encodeURIComponent(data.email)}`);
      }, 1500);
    } else {
      const msg =
        isAccountSuccess?.error ??
        'An unexpected error occurred. Please try again.';
      setErrorMessage(msg);
      toast.error(msg);
    }
    setLoading(false);
  }

  return (
    <div
      className="min-h-[85vh] flex items-center justify-center bg-[#F8FAFC] py-12 px-4 sm:px-6"
      dir="rtl"
    >
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 p-8 shadow-xs text-center">
        <div className="flex justify-center mb-6">
          <HorusLogo size="md" />
        </div>

        <h1 className="text-2xl font-black text-[#08101E] mb-2">إنشاء حساب جديد</h1>
        <p className="text-xs sm:text-sm text-slate-500 mb-6">
          انضم إلى سوق حورس واستمتع بتجربة تسوق وخدمات استثنائية
        </p>

        {errorMessage && (
          <div className="mb-5 flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs text-right">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(mySubmit)} className="space-y-4 text-right">
          {/* الاسم الكامل */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              الاسم الكامل
            </label>
            <div className="relative">
              <input
                type="text"
                {...register('name')}
                placeholder="جلال محمد"
                className={`w-full rounded-xl border bg-slate-50 px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#D49B35] ${
                  errors.name ? 'border-red-400' : 'border-slate-200'
                }`}
              />
              <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            </div>
            {errors.name && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* البريد الإلكتروني */}
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

          {/* رقم الهاتف */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              رقم الهاتف (مصري)
            </label>
            <div className="relative">
              <input
                type="tel"
                dir="ltr"
                {...register('phone')}
                placeholder="01012345678"
                className={`w-full rounded-xl border bg-slate-50 px-4 py-2.5 text-sm text-slate-800 text-right focus:outline-none focus:ring-2 focus:ring-[#D49B35] ${
                  errors.phone ? 'border-red-400' : 'border-slate-200'
                }`}
              />
              <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            </div>
            {errors.phone && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* كلمة المرور */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              كلمة المرور
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password', {
                  onChange: (e) => setPasswordValue(e.target.value),
                })}
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

            {/* مؤشر قوة كلمة المرور */}
            {passwordValue && (
              <div className="mt-2 space-y-1">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-500 font-medium">قوة كلمة المرور:</span>
                  <span className={`font-bold ${currentStrength.bgt}`}>
                    {currentStrength.text}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${currentStrength.color}`}
                    style={{ width: currentStrength.width }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* تأكيد كلمة المرور */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              تأكيد كلمة المرور
            </label>
            <div className="relative">
              <input
                type={showRePassword ? 'text' : 'password'}
                {...register('rePassword')}
                placeholder="••••••••"
                className={`w-full rounded-xl border bg-slate-50 px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#D49B35] ${
                  errors.rePassword ? 'border-red-400' : 'border-slate-200'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowRePassword(!showRePassword)}
                className="absolute left-3 top-3 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                {showRePassword ? (
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

          {/* الموافقة على الشروط والأحكام */}
          <div className="pt-1">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register('terms')}
                className="mt-0.5 rounded border-slate-300 text-[#D49B35] focus:ring-[#D49B35] cursor-pointer"
              />
              <span className="text-xs text-slate-600">
                أوافق على{' '}
                <Link href="/legal" className="text-[#D49B35] font-bold hover:underline">
                  شروط الاستخدام
                </Link>{' '}
                و{' '}
                <Link href="/legal" className="text-[#D49B35] font-bold hover:underline">
                  سياسة الخصوصية
                </Link>
              </span>
            </label>
            {errors.terms && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {errors.terms.message}
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
                <span>جاري إنشاء الحساب...</span>
              </>
            ) : (
              <span>إنشاء الحساب</span>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-600">
          <span>لديك حساب بالفعل؟</span>
          <Link
            href="/login"
            className="font-bold text-[#D49B35] hover:underline flex items-center gap-1"
          >
            <span>تسجيل الدخول</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
