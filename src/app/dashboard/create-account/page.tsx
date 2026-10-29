'use client';

import React, { useState, useTransition } from 'react';
import {
  UserPlus,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Loader2,
  User,
  Mail,
  Lock,
  Phone,
  ChevronDown,
  ShieldCheck,
  Users,
  Calculator,
  Warehouse,
  TrendingUp,
  BadgeCheck,
} from 'lucide-react';
import { createStaffAccount } from '@/action/admin.action';

type AccountRole = 'accountant' | 'warehouse' | 'sales' | 'salesManager';
type Toast = { type: 'success' | 'error'; message: string } | null;

interface RoleOption {
  value: AccountRole;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
}

const roleOptions: RoleOption[] = [
  {
    value: 'accountant',
    label: 'محاسب',
    description: 'إدارة الفواتير والمدفوعات والتقارير المالية',
    icon: Calculator,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  {
    value: 'warehouse',
    label: 'أمين المستودع',
    description: 'إدارة المخزون وتتبع الشحنات والمخازن',
    icon: Warehouse,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
  },
  {
    value: 'sales',
    label: 'موظف مبيعات',
    description: 'إدارة الطلبات وخدمة العملاء ومتابعة المبيعات',
    icon: TrendingUp,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
  },
  {
    value: 'salesManager',
    label: 'مدير المبيعات',
    description: 'الإشراف على فريق المبيعات وتحليل الأداء',
    icon: BadgeCheck,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
  },
];



export default function CreateAccountPage() {
  const [selectedRole, setSelectedRole] = useState<AccountRole>("sales");
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [toast, setToast] = useState<Toast>(null);
  const [isPending, startTransition] = useTransition();

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 5000);
  };

  const resetForm = () => {
    setForm({ name: '', email: '', password: '', confirmPassword: '', phone: '' });
    setSelectedRole('sales');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) { showToast('error', 'يرجى إدخال الاسم الكامل'); return; }
    if (!form.email.trim()) { showToast('error', 'يرجى إدخال البريد الإلكتروني'); return; }
    if (!form.password) { showToast('error', 'يرجى إدخال كلمة المرور'); return; }
    if (form.password.length < 6) { showToast('error', 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'); return; }
    if (form.password !== form.confirmPassword) { showToast('error', 'كلمتا المرور غير متطابقتين'); return; }

    startTransition(async () => {
      const result = await createStaffAccount({
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone || undefined,
        role: selectedRole,
      });
      if (result.success) {
        showToast('success', result.message ?? 'تم إنشاء الحساب بنجاح ✓');
        resetForm();
      } else {
        showToast('error', result.message ?? 'فشل إنشاء الحساب');
      }
    });
  };

  const inputClass =
    'w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-[#D49B35] focus:ring-1 focus:ring-[#D49B35]/30 transition-colors placeholder:text-slate-400';
  const labelClass = 'block text-xs font-bold text-slate-600 mb-1.5';

  const selectedRoleInfo = roleOptions.find((r) => r.value === selectedRole)!;

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-4xl space-y-6 text-right">
        {/* Toast */}
        {toast && (
          <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-xl shadow-xl text-sm font-bold transition-all ${toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
            {toast.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {toast.message}
          </div>
        )}

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#F3C053] to-[#D49B35] flex items-center justify-center shadow-sm">
          <UserPlus className="w-5 h-5 text-[#0B2545]" />
        </div>
        <div>
          <h1 className="text-xl font-black text-slate-800">إنشاء حساب موظف</h1>
          <p className="text-slate-500 text-xs mt-0.5">أضف عضواً جديداً لفريق العمل مع تحديد صلاحياته</p>
        </div>
      </div>

      {/* Role Selection */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
        <h2 className="text-sm font-black text-slate-700 mb-4">اختر نوع الحساب</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {roleOptions.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.value;
            return (
              <button
                key={role.value}
                type="button"
                onClick={() => setSelectedRole(role.value)}
                className={`flex flex-col items-center gap-2.5 p-4 rounded-xl border-2 transition-all text-center ${
                  isSelected
                    ? `${role.bgColor} ${role.borderColor} shadow-sm`
                    : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? role.bgColor : 'bg-slate-100'}`}>
                  <Icon className={`w-5 h-5 ${isSelected ? role.color : 'text-slate-400'}`} />
                </div>
                <div>
                  <p className={`text-xs font-black ${isSelected ? role.color : 'text-slate-600'}`}>
                    {role.label}
                  </p>
                </div>
                {isSelected && (
                  <div className={`w-5 h-5 rounded-full ${role.bgColor} ${role.color} border ${role.borderColor} flex items-center justify-center`}>
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected role description */}
        <div className={`mt-4 flex items-start gap-3 p-3 rounded-xl ${selectedRoleInfo.bgColor} border ${selectedRoleInfo.borderColor}`}>
          <ShieldCheck className={`w-5 h-5 shrink-0 mt-0.5 ${selectedRoleInfo.color}`} />
          <div>
            <p className={`text-xs font-bold ${selectedRoleInfo.color}`}>صلاحيات {selectedRoleInfo.label}</p>
            <p className="text-slate-600 text-xs mt-0.5">{selectedRoleInfo.description}</p>
          </div>
        </div>
      </div>

      {/* Account Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-xs">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-sm font-black text-slate-800">بيانات الحساب</h2>
          <p className="text-slate-500 text-xs mt-0.5">أدخل معلومات الموظف الجديد</p>
        </div>

        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Name */}
          <div className="md:col-span-2">
            <label className={labelClass}>الاسم الكامل *</label>
            <div className="relative">
              <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                className={`${inputClass} pr-9`}
                placeholder="مثال: أحمد محمد"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className={labelClass}>البريد الإلكتروني *</label>
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="email"
                className={`${inputClass} pr-9`}
                placeholder="example@horusmarket.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className={labelClass}>رقم الهاتف (اختياري)</label>
            <div className="relative">
              <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="tel"
                className={`${inputClass} pr-9`}
                placeholder="01xxxxxxxxx"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                dir="ltr"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className={labelClass}>كلمة المرور *</label>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                className={`${inputClass} pr-9 pl-9`}
                placeholder="6 أحرف على الأقل"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                minLength={6}
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {form.password && (
              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      form.password.length >= i * 3
                        ? form.password.length >= 10
                          ? 'bg-emerald-500'
                          : form.password.length >= 7
                          ? 'bg-amber-400'
                          : 'bg-red-400'
                        : 'bg-slate-100'
                    }`}
                  />
                ))}
                <span className={`text-[10px] font-bold mr-1 ${form.password.length >= 10 ? 'text-emerald-600' : form.password.length >= 7 ? 'text-amber-500' : 'text-red-500'}`}>
                  {form.password.length >= 10 ? 'قوية' : form.password.length >= 7 ? 'متوسطة' : 'ضعيفة'}
                </span>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className={labelClass}>تأكيد كلمة المرور *</label>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                className={`${inputClass} pr-9 pl-9 ${
                  form.confirmPassword && form.password !== form.confirmPassword
                    ? 'border-red-300 focus:border-red-400 focus:ring-red-200'
                    : form.confirmPassword && form.password === form.confirmPassword
                    ? 'border-emerald-300 focus:border-emerald-400'
                    : ''
                }`}
                placeholder="أعد إدخال كلمة المرور"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                required
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              {form.confirmPassword && (
                <div className={`absolute left-9 top-1/2 -translate-y-1/2 ${form.password === form.confirmPassword ? 'text-emerald-500' : 'text-red-400'}`}>
                  {form.password === form.confirmPassword ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                </div>
              )}
            </div>
            {form.confirmPassword && form.password !== form.confirmPassword && (
              <p className="text-red-500 text-[11px] mt-1 font-medium">كلمتا المرور غير متطابقتين</p>
            )}
          </div>
        </div>

        {/* Summary Card */}
        <div className="mx-5 mb-5 p-4 bg-slate-50 rounded-xl border border-slate-200">
          <h3 className="text-xs font-bold text-slate-600 mb-3">ملخص الحساب الجديد</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] text-slate-400 mb-0.5">الاسم</p>
              <p className="text-xs font-bold text-slate-700">{form.name || '—'}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 mb-0.5">البريد</p>
              <p className="text-xs font-bold text-slate-700 truncate">{form.email || '—'}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 mb-0.5">الدور</p>
              <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${selectedRoleInfo.bgColor} ${selectedRoleInfo.color}`}>
                <selectedRoleInfo.icon className="w-3 h-3" />
                {selectedRoleInfo.label}
              </span>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 mb-0.5">الهاتف</p>
              <p className="text-xs font-bold text-slate-700">{form.phone || '—'}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-start gap-3">
          <button
            type="button"
            onClick={resetForm}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-bold transition-colors"
          >
            إعادة تعيين
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#D49B35] hover:bg-[#C28B2B] active:scale-95 text-white rounded-xl text-sm font-bold shadow-sm transition-all disabled:opacity-60"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                جاري الإنشاء...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                إنشاء الحساب
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  </div>
);
}
