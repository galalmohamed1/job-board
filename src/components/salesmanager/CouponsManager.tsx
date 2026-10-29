'use client';

import React, { useState, useTransition } from 'react';
import {
  Ticket,
  Plus,
  Search,
  Copy,
  Check,
  Calendar,
  Percent,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { Coupon } from '@/types/admin/adminCoupon';
import { createCoupon, getCouponsAdmin } from '@/action/admin.action';
import { toast } from 'react-toastify';

interface Props {
  initialCoupons: Coupon[];
}

export default function CouponsManager({ initialCoupons }: Props) {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPending, startTransition] = useTransition();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [code, setCode] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState<number | ''>('');
  const [expireDate, setExpireDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Copy helper
  const handleCopy = (couponCode: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(couponCode);
      setCopiedCode(couponCode);
      toast.success(`تم نسخ كود الكوبون: ${couponCode}`);
      setTimeout(() => setCopiedCode(null), 2000);
    }
  };

  // Refresh handler
  const handleRefresh = () => {
    startTransition(async () => {
      const fresh = await getCouponsAdmin();
      if (fresh && Array.isArray(fresh)) {
        setCoupons(fresh);
        toast.info('تم تحديث قائمة الكوبونات');
      }
    });
  };

  // Create Coupon handler
  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      toast.error('يرجى إدخال كود الكوبون');
      return;
    }
    const discount = Number(discountPercentage);
    if (!discount || discount <= 0 || discount > 100) {
      toast.error('نسبة الخصم يجب أن تكون بين 1% و 100%');
      return;
    }
    if (!expireDate) {
      toast.error('يرجى تحديد تاريخ انتهاء الكوبون');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createCoupon({
        code: code.trim().toUpperCase(),
        discountPercentage: discount,
        expireDate: expireDate,
      });

      if (res.success && res.data) {
        toast.success(res.message || 'تم إنشاء الكوبون بنجاح!');
        setCoupons((prev) => [res.data as Coupon, ...prev]);
        // Reset form
        setCode('');
        setDiscountPercentage('');
        setExpireDate('');
        setShowAddForm(false);
      } else {
        toast.error(res.message || 'فشل في إنشاء الكوبون');
      }
    } catch {
      toast.error('حدث خطأ غير متوقع أثناء إضافة الكوبون');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter coupons
  const filteredCoupons = coupons.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    return !q || c.code.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 text-right font-sans" dir="rtl">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <span className="w-10 h-10 rounded-xl bg-linear-to-br from-[#0B2545] to-[#134074] text-[#F3C053] flex items-center justify-center shadow-xs">
              <Ticket className="w-5 h-5" />
            </span>
            <span>كوبونات الخصم</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            إدارة وإنشاء كوبونات الخصم الترويجية للعملاء ومتابعة تواريخ صلاحيتها
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isPending}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isPending ? 'animate-spin' : ''}`} />
            <span>تحديث</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAddForm((prev) => !prev)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D49B35] hover:bg-[#B87B22] text-[#0B2545] font-black text-xs transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{showAddForm ? 'إخفاء النموذج' : 'إضافة كوبون جديد'}</span>
          </button>
        </div>
      </div>

      {/* ── Add Coupon Form (Collapsible) ── */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-2xl border-2 border-[#D49B35]/40 shadow-md animate-in fade-in duration-200">
          <div className="flex items-center gap-2 mb-4 text-[#0B2545] font-black text-sm">
            <Sparkles className="w-4 h-4 text-[#D49B35]" />
            <span>إنشاء كوبون خصم جديد</span>
          </div>

          <form onSubmit={handleCreateCoupon} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Code */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  كود الكوبون <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="مثال: SALE2026"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs sm:text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[#D49B35] focus:bg-white transition-all"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  سيتم تحويل الحروف تلقائياً إلى أحرف كبيرة (Capital)
                </span>
              </div>

              {/* Discount Percentage */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  نسبة الخصم (%) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Percent className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    min={1}
                    max={100}
                    required
                    value={discountPercentage}
                    onChange={(e) =>
                      setDiscountPercentage(
                        e.target.value === '' ? '' : Number(e.target.value)
                      )
                    }
                    placeholder="مثال: 15"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#D49B35] focus:bg-white transition-all"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  نسبة الخصم من 1 إلى 100 بالمئة
                </span>
              </div>

              {/* Expiry Date */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  تاريخ الانتهاء <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={expireDate}
                    onChange={(e) => setExpireDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D49B35] focus:bg-white transition-all"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  تاريخ انتهاء صلاحية الكوبون
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-2 rounded-xl bg-linear-to-r from-[#0B2545] to-[#134074] hover:from-[#134074] hover:to-[#0B2545] text-white font-bold text-xs transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#F3C053]" />
                    <span>جاري الإنشاء...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#F3C053]" />
                    <span>حفظ الكوبون</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Search Bar ── */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث بكود الكوبون..."
            className="w-full pr-9 pl-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D49B35] focus:bg-white transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* ── Coupons List ── */}
      {filteredCoupons.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-2xs">
          <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Ticket className="w-7 h-7 stroke-1" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">لا توجد كوبونات خصم</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? 'لم يتم العثور على أي كوبون يطابق البحث.'
              : 'قم بالضغط على "إضافة كوبون جديد" لإنشاء أول كوبون خصم.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCoupons.map((coupon) => {
            const isExpired =
              coupon.expireDate && new Date(coupon.expireDate) < new Date();

            return (
              <div
                key={coupon._id}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs hover:shadow-md transition-shadow relative overflow-hidden group"
              >
                {/* Decorative background tag */}
                <div className="absolute -left-6 -top-6 w-20 h-20 bg-[#F3C053]/10 rounded-full group-hover:scale-125 transition-transform" />

                <div className="flex items-start justify-between mb-3 relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-slate-900 text-base bg-slate-50 px-3 py-1 rounded-xl border border-slate-200 tracking-wider">
                      {coupon.code}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(coupon.code)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                      title="نسخ الكود"
                    >
                      {copiedCode === coupon.code ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-xs font-black bg-purple-50 text-purple-700 border border-purple-200/60 flex items-center gap-1">
                    <span>{coupon.discountPercentage}%</span>
                    <span>خصم</span>
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>ينتهي في:</span>
                    </span>
                    <span
                      className={`font-bold font-mono ${
                        isExpired ? 'text-red-600' : 'text-slate-800'
                      }`}
                    >
                      {coupon.expireDate
                        ? new Date(coupon.expireDate).toLocaleDateString('ar-EG')
                        : '—'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>الحالة:</span>
                    </span>
                    <span>
                      {isExpired ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md">
                          <XCircle className="w-3 h-3" />
                          <span>منتهي الصلاحية</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>ساري ومفعل</span>
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
