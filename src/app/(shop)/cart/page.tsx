'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useShop } from '@/context/ShopContext';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Tag,
  CheckCircle2,
  Loader2,
  ShoppingBag,
  Home,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function CartPage() {
  const { status } = useSession();
  const {
    cart,
    cartCount,
    cartSubtotal,
    isCartLoading,
    updateQuantity,
    removeFromCart,
    updatingItemId,
  } = useShop();

  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  // Handle Promo Code
  const handleApplyPromo = () => {
    if (!promoCode.trim()) return;
    setIsApplyingPromo(true);
    setTimeout(() => {
      setIsApplyingPromo(false);
      const code = promoCode.trim().toUpperCase();
      if (code === 'HORUS10' || code === 'SAVE10') {
        const discount = Math.round(cartSubtotal * 0.1);
        setPromoDiscount(discount);
        setAppliedPromo(code);
        toast.success(`تم تطبيق كود الخصم (${code}) بنجاح! خصم 10%`);
      } else if (code === 'HORUS50') {
        setPromoDiscount(50);
        setAppliedPromo(code);
        toast.success(`تم تطبيق كود الخصم (${code}) بنجاح! خصم 50 ج.م`);
      } else {
        toast.error('كود الخصم غير صالح أو منتهي الصلاحية');
      }
    }, 600);
  };

  const handleRemovePromo = () => {
    setPromoDiscount(0);
    setAppliedPromo(null);
    setPromoCode('');
    toast.info('تمت إزالة كود الخصم');
  };

  // Calculations
  const shippingFee = cartSubtotal >= 1000 || cartSubtotal === 0 ? 0 : 50;
  const grandTotal = Math.max(0, cartSubtotal - promoDiscount + shippingFee);

  // Loading indicator for full cart load
  if (isCartLoading && cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#D49B35] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold text-slate-600">جاري تحميل سلة المشتريات...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-6 sm:py-10 text-slate-800" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Breadcrumb ── */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs sm:text-sm text-slate-500">
          <Link href="/" className="flex items-center gap-1 hover:text-[#D49B35] transition-colors">
            <Home className="w-4 h-4" />
            <span>الرئيسية</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 rotate-180 text-slate-400" />
          <span className="text-[#08101E] font-bold">سلة المشتريات</span>
        </nav>

        {/* ── Unauthenticated Notice ── */}
        {status === 'unauthenticated' && (
          <div className="mb-6 rounded-2xl bg-gradient-to-r from-[#08101E] to-[#121c2e] p-4 sm:p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#D49B35]/30 shadow-md">
            <div className="flex items-center gap-3 text-right">
              <div className="w-10 h-10 rounded-xl bg-[#D49B35]/20 text-[#D49B35] flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-white">
                  سجل دخولك لحفظ ومزامنة سلة مشترياتك
                </h2>
                <p className="text-xs text-slate-300">
                  يمكنك حفظ منتجاتك والوصول إليها وإتمام الطلب في أي وقت ومن أي جهاز.
                </p>
              </div>
            </div>
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-xl bg-[#D49B35] hover:bg-[#c38c2b] text-[#08101E] font-black text-xs sm:text-sm whitespace-nowrap transition-colors shadow-sm"
            >
              تسجيل الدخول الآن
            </Link>
          </div>
        )}

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#08101E] text-[#D49B35] shadow-xs">
              <ShoppingCart className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-black text-[#08101E]">
                  سلة المشتريات
                </h1>
                <span className="rounded-full bg-[#D49B35]/15 px-3 py-0.5 text-xs font-bold text-[#845A13] border border-[#D49B35]/30">
                  {cartCount} {cartCount === 1 ? 'عنصر' : 'عناصر'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                راجع عناصر طلبك وتأكد من الكميات قبل الانتقال إلى صفحة الدفع
              </p>
            </div>
          </div>

          <Link
            href="/product"
            className="self-start sm:self-auto flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-[#D49B35] transition-colors"
          >
            <span>متابعة التسوق</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        {/* ── Case 1: Empty Cart ── */}
        {cart.length === 0 ? (
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 sm:p-14 text-center shadow-xs">
            <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#D49B35]/5 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-[#08101E]/5 blur-3xl" />

            <div className="mx-auto max-w-md flex flex-col items-center">
              <div className="relative mb-6">
                <div className="grid h-24 w-24 sm:h-28 sm:w-28 place-items-center rounded-3xl bg-gradient-to-br from-[#FDF8ED] to-[#F5ECE0] border border-[#D49B35]/30 shadow-inner">
                  <ShoppingCart className="h-12 w-12 sm:h-14 sm:w-14 text-[#D49B35] stroke-[1.5]" />
                </div>
                <div className="absolute -bottom-1 -right-1 grid h-8 w-8 place-items-center rounded-full bg-[#08101E] text-white shadow-md">
                  <Sparkles className="h-4 w-4 text-[#D49B35]" />
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-[#08101E] mb-3">
                سلة التسوق فارغة حالياً
              </h2>
              <p className="text-sm sm:text-base text-slate-500 leading-relaxed mb-8">
                لم تقم بإضافة أي منتج إلى سلتك حتى الآن. استكشف مجموعتنا المميزة من المنتجات والعروض وأضف ما يناسبك!
              </p>

              <Link
                href="/product"
                className="flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-[#F25822] hover:bg-[#d94a18] active:scale-[0.99] text-white font-black text-sm sm:text-base shadow-md hover:shadow-lg transition-all"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>تصفح المنتجات الآن</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          /* ── Case 2: Populated Cart ── */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* ── Cart Items List (8 Cols) ── */}
            <div className="lg:col-span-8 space-y-4">
              {cart.map((item) => {
                const prod = item.product;
                const productId = prod?._id ?? item._id;
                const title = prod?.title ?? 'منتج في السلة';
                const image = prod?.images?.[0]?.secure_url || 'https://placehold.co/400x400/1e293b/ffffff?text=Product';
                const unitPrice = item.price ?? prod?.price ?? 0;
                const itemTotal = unitPrice * item.quantity;
                const isUpdating = updatingItemId === productId;

                return (
                  <div
                    key={item._id || productId}
                    className="relative flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white shadow-xs hover:shadow-sm transition-all"
                  >
                    {/* Image & Basic Details */}
                    <div className="flex items-center gap-4 w-full sm:w-auto flex-1">
                      <div className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                        <Image
                          src={image}
                          alt={title}
                          fill
                          sizes="96px"
                          className="object-contain p-2"
                        />
                      </div>

                      <div className="flex-1 min-w-0 text-right">
                        <Link
                          href={`/product`}
                          className="text-sm sm:text-base font-bold text-[#08101E] hover:text-[#D49B35] transition-colors line-clamp-2 leading-snug"
                        >
                          {title}
                        </Link>

                        {/* Variants if any */}
                        {(item.size || item.color) && (
                          <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                            {item.size && (
                              <span className="bg-slate-100 px-2 py-0.5 rounded-md">
                                المقاس: {item.size}
                              </span>
                            )}
                            {item.color && (
                              <span className="bg-slate-100 px-2 py-0.5 rounded-md">
                                اللون: {item.color}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Unit Price */}
                        <div className="mt-1.5 flex items-baseline gap-1 text-xs sm:text-sm font-semibold text-slate-600">
                          <span>سعر القطعة:</span>
                          <span className="font-bold text-[#08101E]">
                            {unitPrice.toLocaleString('ar-EG')} ج.م
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quantity Stepper & Total */}
                    <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() => updateQuantity(productId, 1, item.size, item.color)}
                          aria-label="زيادة الكمية"
                          className="p-2 sm:px-3 text-slate-600 hover:bg-white hover:text-slate-900 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>

                        <span className="px-3 py-1 text-xs sm:text-sm font-black text-slate-900 min-w-[32px] text-center">
                          {isUpdating ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto text-[#D49B35]" />
                          ) : (
                            item.quantity
                          )}
                        </span>

                        <button
                          type="button"
                          disabled={isUpdating || item.quantity <= 1}
                          onClick={() => updateQuantity(productId, -1, item.size, item.color)}
                          aria-label="تقليل الكمية"
                          className="p-2 sm:px-3 text-slate-600 hover:bg-white hover:text-slate-900 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Total for this line */}
                      <div className="text-left sm:text-right min-w-[90px]">
                        <span className="text-base sm:text-lg font-black text-[#08101E] block">
                          {itemTotal.toLocaleString('ar-EG')}{' '}
                          <small className="text-xs font-bold text-slate-500">ج.م</small>
                        </span>
                      </div>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => {
                          removeFromCart(productId, item.size, item.color);
                          toast.info(`تم حذف "${title.slice(0, 20)}..." من السلة`);
                        }}
                        aria-label="إزالة من السلة"
                        className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white hover:bg-red-50 hover:border-red-200 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                        title="إزالة المنتج"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Free Shipping Progress Indicator */}
              <div className="rounded-2xl border border-[#D49B35]/25 bg-gradient-to-r from-[#FDF8ED] to-white p-4 text-xs sm:text-sm text-slate-700 flex items-center gap-3">
                <Truck className="w-5 h-5 text-[#D49B35] shrink-0" />
                {cartSubtotal >= 1000 ? (
                  <span className="font-bold text-emerald-700">
                    تهانينا! طلبيتك مؤهلة لـ <strong>الشحن المجاني</strong> بالكامل.
                  </span>
                ) : (
                  <span>
                    أضف منتجات بقيمة{' '}
                    <strong className="text-[#08101E]">
                      {(1000 - cartSubtotal).toLocaleString('ar-EG')} ج.م
                    </strong>{' '}
                    إضافية للاستفادة من الشحن المجاني!
                  </span>
                )}
              </div>
            </div>

            {/* ── Order Summary (4 Cols) ── */}
            <div className="lg:col-span-4 space-y-5">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-5">
                <h2 className="text-lg font-black text-[#08101E] pb-3 border-b border-slate-100">
                  ملخص الطلب
                </h2>

                {/* Calculation Rows */}
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>المجموع الفرعي ({cartCount} منتجات)</span>
                    <span className="font-bold text-slate-900">
                      {cartSubtotal.toLocaleString('ar-EG')} ج.م
                    </span>
                  </div>

                  {promoDiscount > 0 && (
                    <div className="flex items-center justify-between text-emerald-600 font-semibold">
                      <span className="flex items-center gap-1">
                        <span>خصم الكوبون ({appliedPromo})</span>
                        <button
                          type="button"
                          onClick={handleRemovePromo}
                          className="text-xs text-red-500 hover:underline cursor-pointer"
                        >
                          (إلغاء)
                        </button>
                      </span>
                      <span>-{promoDiscount.toLocaleString('ar-EG')} ج.م</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-slate-600">
                    <span>مصاريف الشحن</span>
                    <span className="font-bold">
                      {shippingFee === 0 ? (
                        <span className="text-emerald-600 font-bold">مجاناً</span>
                      ) : (
                        `${shippingFee.toLocaleString('ar-EG')} ج.م`
                      )}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between">
                    <span className="text-base font-black text-[#08101E]">الإجمالي الكلي</span>
                    <div className="text-left">
                      <span className="text-2xl font-black text-[#F25822]">
                        {grandTotal.toLocaleString('ar-EG')}
                      </span>
                      <span className="text-xs font-bold text-slate-500 mr-1">جنيه مصري</span>
                    </div>
                  </div>
                </div>

                {/* Promo Code Box */}
                <div className="pt-3 border-t border-slate-100">
                  <label className="text-xs font-bold text-slate-600 block mb-2">
                    هل لديك كود خصم أو كوبون؟
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="أدخل الكود (مثال: HORUS10)"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 pr-9 pl-3 py-2 text-xs font-semibold uppercase text-slate-800 placeholder:normal-case placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#D49B35]"
                      />
                    </div>
                    <button
                      type="button"
                      disabled={isApplyingPromo || !promoCode.trim()}
                      onClick={handleApplyPromo}
                      className="px-4 py-2 rounded-xl bg-[#08101E] hover:bg-[#1a273e] text-white text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {isApplyingPromo ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        'تطبيق'
                      )}
                    </button>
                  </div>
                </div>

                {/* Primary Checkout CTA */}
                <Link
                  href="/checkout"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#F25822] hover:bg-[#d94a18] active:scale-[0.99] text-white py-3.5 text-base font-black shadow-md hover:shadow-lg transition-all"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>الانتقال لإتمام الطلب</span>
                </Link>

                {/* Trust Badges */}
                <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>دفع آمن ومشفر 100% عبر بوابات معتمدة</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-[#D49B35] shrink-0" />
                    <span>إمكانية الاسترجاع والاستبدال خلال 14 يوماً</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>توصيل سريع وموثوق لجميع محافظات مصر</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}