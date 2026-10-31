'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useShop } from '@/context/ShopContext';
import { addOrder, getShippingFee } from '@/action/order.action';
import { ShippingAddress } from '@/types/order';
import {
  MapPin,
  Phone,
  User,
  CreditCard,
  Banknote,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  Home,
  ShoppingBag,
  ArrowRight,
  Loader2,
  FileText,
  Building,
  Navigation,
  AlertCircle,
  Tag,
  Check,
} from 'lucide-react';
import { toast } from 'react-toastify';

// المحافظات المصرية الشائعة
const EGYPT_GOVERNORATES = [
  'القاهرة',
  'الجيزة',
  'الإسكندرية',
  'القليوبية',
  'الدقهلية',
  'الشرقية',
  'المنوفية',
  'الغربية',
  'كفر الشيخ',
  'البحيرة',
  'دمياط',
  'بورسعيد',
  'الإسماعيلية',
  'السويس',
  'شمال سيناء',
  'جنوب سيناء',
  'بني سويف',
  'المنيا',
  'الفيوم',
  'أسيوط',
  'سوهاج',
  'قنا',
  'الأقصر',
  'أسوان',
  'البحر الأحمر',
  'الوادي الجديد',
  'مطروح',
];

export default function CheckoutPage() {
  const router = useRouter();
  const { status, data: session } = useSession();
  const { cart, cartCount, cartSubtotal, isCartLoading, refreshCart } = useShop();

  // بيانات العنوان
  const [formData, setFormData] = useState<ShippingAddress>({
    fullName: '',
    phoneNumber: '',
    country: 'Egypt',
    governorate: 'القاهرة',
    city: '',
    street: '',
    building: '',
    apartment: '',
    area: '',
    postalCode: '',
    notes: '',
  });

  // طريقة الدفع
  const [paymentMethod, setPaymentMethod] = useState<'CashOnDelivery' | 'CreditCard'>('CashOnDelivery');

  // الكوبون والخصم
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // مصاريف الشحن
  const [shippingFee, setShippingFee] = useState<number>(50);
  const [isShippingLoading, setIsShippingLoading] = useState(true);

  // حالات التنفيذ
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlacedSuccess, setOrderPlacedSuccess] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);

  // جلب قيمة الشحن والتأكد من بيانات المستخدم
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const feeRes = await getShippingFee();
        if (alive && feeRes.success && feeRes.data?.shippingFee) {
          const parsed = parseFloat(feeRes.data.shippingFee);
          if (!isNaN(parsed)) setShippingFee(parsed);
        }
      } catch {
        /* fallback default */
      } finally {
        if (alive) setIsShippingLoading(false);
      }
    })();

    // التعبئة التلقائية لاسم ورقم المستخدم إن وجدا
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || session.user?.name || '',
        phoneNumber: prev.phoneNumber || (session.user as any)?.phone || '',
      }));
    }

    return () => {
      alive = false;
    };
  }, [session]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // تطبيق كوبون الخصم
  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    setIsApplyingCoupon(true);
    setTimeout(() => {
      setIsApplyingCoupon(false);
      const code = couponCode.trim().toUpperCase();
      if (code === 'HORUS10' || code === 'SAVE10') {
        const discount = Math.round(cartSubtotal * 0.1);
        setDiscountAmount(discount);
        setAppliedCoupon(code);
        toast.success(`تم تطبيق كود الخصم (${code}) بنجاح! خصم 10%`);
      } else if (code === 'HORUS50') {
        setDiscountAmount(50);
        setAppliedCoupon(code);
        toast.success(`تم تطبيق كود الخصم (${code}) بنجاح! خصم 50 ج.م`);
      } else {
        toast.error('كود الخصم غير صالح أو منتهي');
      }
    }, 500);
  };

  const handleRemoveCoupon = () => {
    setDiscountAmount(0);
    setAppliedCoupon(null);
    setCouponCode('');
    toast.info('تمت إزالة كود الخصم');
  };

  // الحسابات المالية
  const freeShippingThreshold = 1000;
  const isFreeShipping = cartSubtotal >= freeShippingThreshold || cartSubtotal === 0;
  const activeShippingFee = isFreeShipping ? 0 : shippingFee;
  const grandTotal = Math.max(0, cartSubtotal - discountAmount + activeShippingFee);

  // إرسال الطلب
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      toast.error('سلة المشتريات فارغة!');
      return;
    }

    // التحقق من الحقول الإجبارية
    if (!formData.fullName.trim()) {
      toast.error('يرجى إدخال الاسم بالكامل');
      return;
    }
    if (!formData.phoneNumber.trim()) {
      toast.error('يرجى إدخال رقم الهاتف للتواصل');
      return;
    }
    if (!formData.governorate) {
      toast.error('يرجى اختيار المحافظة');
      return;
    }
    if (!formData.city.trim()) {
      toast.error('يرجى إدخال المدينة أو المركز');
      return;
    }
    if (!formData.street.trim()) {
      toast.error('يرجى إدخال العنوان بالتفصيل (الشارع)');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await addOrder({
        shippingAddress: {
          fullName: formData.fullName.trim(),
          phoneNumber: formData.phoneNumber.trim(),
          country: formData.country || 'Egypt',
          governorate: formData.governorate,
          city: formData.city.trim(),
          street: formData.street.trim(),
          area: formData.area?.trim() || undefined,
          building: formData.building?.trim() || undefined,
          apartment: formData.apartment?.trim() || undefined,
          postalCode: formData.postalCode?.trim() || undefined,
          notes: formData.notes?.trim() || undefined,
        },
        paymentMethod,
        couponCode: appliedCoupon || undefined,
      });

      if (res.success) {
        toast.success(res.message || 'تم تأكيد طلبك بنجاح!');
        const orderData = res.data as any;
        const newId = orderData?._id || orderData?.order?._id || null;
        setCreatedOrderId(newId);
        setOrderPlacedSuccess(true);
        // تحديث السلة لتفريغها
        await refreshCart();
      } else {
        toast.error(res.message || 'حدث خطأ أثناء إتمام الطلب، يرجى المحاولة ثانية');
      }
    } catch (err: any) {
      toast.error(err?.message || 'فشل الاتصال بالخادم، يرجى التحقق من اتصالك بالإنترنت');
    } finally {
      setIsSubmitting(false);
    }
  };

  // شاشة نجاح إتمام الطلب
  if (orderPlacedSuccess) {
    return (
      <div className="min-h-[75vh] bg-[#08101E]/[0.02] flex items-center justify-center px-4 py-16" dir="rtl">
        <div className="max-w-lg w-full bg-white rounded-3xl p-8 md:p-10 text-center shadow-xl border border-slate-100">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-8 ring-emerald-50/50">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <span className="inline-block px-3 py-1 bg-amber-50 text-[#D49B35] text-xs font-black rounded-full mb-3 border border-[#D49B35]/20">
            تم استلام الطلب بنجاح
          </span>

          <h2 className="text-2xl md:text-3xl font-black text-[#08101E] mb-3">
            شكراً لثقتك في متجر حورس!
          </h2>

          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            تم تسجيل طلبك بنجاح وسيتم تجهيزه وشحنه إلى عنوانك بأسرع وقت. سيتواصل معك مندوب الشحن لتأكيد الموعد.
          </p>

          {createdOrderId && (
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 mb-6 text-sm">
              <span className="text-slate-500 block text-xs mb-1">رقم الطلب الخاص بك:</span>
              <span className="font-mono font-bold text-[#08101E] text-base tracking-wider select-all">
                #{createdOrderId}
              </span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#08101E] hover:bg-[#1a273e] text-white text-sm font-bold transition-all shadow-sm"
            >
              <Home className="w-4 h-4 text-[#D49B35]" />
              <span>العودة للرئيسية</span>
            </Link>
            <Link
              href="/marketing"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#D49B35] to-[#B87B22] hover:opacity-95 text-white text-sm font-black transition-all shadow-md shadow-[#D49B35]/20"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>متابعة التسوق</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // في حال كانت السلة فارغة
  if (!isCartLoading && cart.length === 0) {
    return (
      <div className="min-h-[70vh] bg-slate-50/50 flex items-center justify-center px-4 py-16" dir="rtl">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center shadow-lg border border-slate-100">
          <div className="w-20 h-20 bg-amber-50 text-[#D49B35] rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-xl md:text-2xl font-black text-[#08101E] mb-2">سلتك فارغة حالياً</h2>
          <p className="text-slate-500 text-sm mb-6">
            لا توجد منتجات في سلتك لإتمام الطلب. تصفح أحدث المنتجات وأضف ما ترغب به!
          </p>
          <Link
            href="/marketing"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#D49B35] to-[#B87B22] text-white font-black text-sm shadow-md hover:shadow-lg transition-all"
          >
            <span>تصفح المنتجات الآن</span>
            <ArrowRight className="w-4 h-4 rotate-180" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16 pt-4" dir="rtl">
      {/* شريط المسار (Breadcrumbs) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 py-2">
          <Link href="/" className="hover:text-[#D49B35] flex items-center gap-1 transition-colors">
            <Home className="w-3.5 h-3.5" />
            <span>الرئيسية</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 rotate-180" />
          <Link href="/cart" className="hover:text-[#D49B35] transition-colors">
            سلة المشتريات
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 rotate-180" />
          <span className="text-[#08101E] font-black">إتمام الطلب والدفع</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* عنوان الصفحة وخطوات الإتمام */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-[#08101E] flex items-center gap-3">
                <span className="w-2.5 h-7 rounded-full bg-gradient-to-b from-[#D49B35] to-[#B87B22] inline-block" />
                إتمام الطلب
              </h1>
              <p className="text-slate-500 text-xs md:text-sm mt-1">
                املأ بيانات الشحن وحدد وسيلة الدفع لتأكيد وصول شحنتك بسرعة وأمان.
              </p>
            </div>

            {/* مؤشر الخطوات */}
            <div className="flex items-center gap-2 text-xs font-bold bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-xs">
              <span className="flex items-center gap-1 text-emerald-600">
                <CheckCircle2 className="w-4 h-4" />
                <span>السلة</span>
              </span>
              <span className="text-slate-300">───</span>
              <span className="flex items-center gap-1 text-[#D49B35] font-black">
                <span className="w-5 h-5 rounded-full bg-[#D49B35] text-white flex items-center justify-center text-[11px]">2</span>
                <span>بيانات الشحن والدفع</span>
              </span>
              <span className="text-slate-300">───</span>
              <span className="flex items-center gap-1 text-slate-400">
                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-[11px]">3</span>
                <span>التأكيد</span>
              </span>
            </div>
          </div>
        </div>

        {/* الشبكة الرئيسية: النموذج والملخص */}
        <form onSubmit={handleSubmitOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* القسم الأيمن: بيانات الشحن والدفع (8 أعمدة) */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-6">

              {/* بطاقة معلومات الشحن والعنوان */}
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200/80">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 text-[#D49B35] flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-[#08101E]">عنوان وبيانات الشحن</h2>
                    <p className="text-xs text-slate-500">أدخل عنوان التوصيل بدقة لضمان وصول الشحنة دون تأخير</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* الاسم الكامل */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      الاسم بالكامل <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="محمد أحمد علي"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pr-10 pl-3.5 py-2.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D49B35] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* رقم الهاتف */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      رقم الهاتف للتواصل <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="tel"
                        name="phoneNumber"
                        required
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="01012345678"
                        dir="ltr"
                        className="w-full text-right rounded-xl border border-slate-200 bg-slate-50/50 pr-10 pl-3.5 py-2.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D49B35] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* الدولة */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      الدولة
                    </label>
                    <input
                      type="text"
                      name="country"
                      readOnly
                      value="مصر (Egypt)"
                      className="w-full rounded-xl border border-slate-200 bg-slate-100/80 px-3.5 py-2.5 text-sm font-medium text-slate-600 cursor-not-allowed"
                    />
                  </div>

                  {/* المحافظة */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      المحافظة <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="governorate"
                        required
                        value={formData.governorate}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D49B35] focus:border-transparent transition-all cursor-pointer"
                      >
                        {EGYPT_GOVERNORATES.map((gov) => (
                          <option key={gov} value={gov}>
                            {gov}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* المدينة أو المركز */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      المدينة / المركز <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="مدينة نصر / الدقي / المعادي"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pr-10 pl-3.5 py-2.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D49B35] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* المنطقة أو الحي */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      المنطقة / الحي (اختياري)
                    </label>
                    <div className="relative">
                      <Navigation className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        name="area"
                        value={formData.area}
                        onChange={handleInputChange}
                        placeholder="الحي السابع / المربع الذهبي"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pr-10 pl-3.5 py-2.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D49B35] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* اسم الشارع والعنوان التفصيلي */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      اسم الشارع والعنوان بالتفصيل <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="street"
                      required
                      value={formData.street}
                      onChange={handleInputChange}
                      placeholder="شارع عباس العقاد - متفرع من شارع النصر"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D49B35] focus:border-transparent transition-all"
                    />
                  </div>

                  {/* رقم المبنى / العمارة */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      رقم المبنى / العمارة
                    </label>
                    <input
                      type="text"
                      name="building"
                      value={formData.building}
                      onChange={handleInputChange}
                      placeholder="عمارة رقم 14"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D49B35] focus:border-transparent transition-all"
                    />
                  </div>

                  {/* رقم الشقة والدور */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      رقم الشقة والدور
                    </label>
                    <input
                      type="text"
                      name="apartment"
                      value={formData.apartment}
                      onChange={handleInputChange}
                      placeholder="شقة 5 - الدور الثاني"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D49B35] focus:border-transparent transition-all"
                    />
                  </div>

                  {/* ملاحظات التوصيل */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      ملاحظات للمندوب أو علامة مميزة (اختياري)
                    </label>
                    <div className="relative">
                      <FileText className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
                      <textarea
                        name="notes"
                        rows={2}
                        value={formData.notes}
                        onChange={handleInputChange}
                        placeholder="بجوار صيدلية أو علامة مميزة، أو الاتصال قبل الوصول بـ 15 دقيقة..."
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pr-10 pl-3.5 py-2.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D49B35] focus:border-transparent transition-all resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* بطاقة اختيار طريقة الدفع */}
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200/80">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 text-[#D49B35] flex items-center justify-center">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-[#08101E]">طريقة الدفع</h2>
                    <p className="text-xs text-slate-500">اختر الوسيلة الأنسب لك لإتمام عملية الدفع</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* الدفع عند الاستلام */}
                  <label
                    className={`flex items-start gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      paymentMethod === 'CashOnDelivery'
                        ? 'border-[#D49B35] bg-[#FDF8ED]/60 ring-2 ring-[#D49B35]/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="CashOnDelivery"
                      checked={paymentMethod === 'CashOnDelivery'}
                      onChange={() => setPaymentMethod('CashOnDelivery')}
                      className="mt-1 w-4 h-4 text-[#D49B35] focus:ring-[#D49B35]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-black text-[#08101E] flex items-center gap-2">
                          <Banknote className="w-4 h-4 text-[#D49B35]" />
                          الدفع عند الاستلام (COD)
                        </span>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                          الأكثر طلباً
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        ادفع نقداً أو عبر المحفظة الإلكترونية لمندوب الشحن عند استلام وتفقد المنتجات.
                      </p>
                    </div>
                  </label>

                  {/* الدفع الإلكتروني بالبطاقة */}
                  <label
                    className={`flex items-start gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      paymentMethod === 'CreditCard'
                        ? 'border-[#D49B35] bg-[#FDF8ED]/60 ring-2 ring-[#D49B35]/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="CreditCard"
                      checked={paymentMethod === 'CreditCard'}
                      onChange={() => setPaymentMethod('CreditCard')}
                      className="mt-1 w-4 h-4 text-[#D49B35] focus:ring-[#D49B35]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-black text-[#08101E] flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-[#D49B35]" />
                          الدفع الإلكتروني (فيزا / ماستركارد)
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono font-bold">
                          <span>VISA</span>
                          <span>•</span>
                          <span>MasterCard</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        دفع سريع ومؤمّن بالكامل بتشفير SSL عبر بوابات الدفع البنكية المعتمدة.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* القسم الأيسر: ملخص الطلب والكوبون (4 أعمدة) */}
            <div className="lg:col-span-5 xl:col-span-4 space-y-6 lg:sticky lg:top-24">
              
              {/* بطاقة ملخص المشتريات */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                  <h3 className="text-base font-black text-[#08101E] flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-[#D49B35]" />
                    <span>ملخص المشتريات</span>
                  </h3>
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                    {cartCount} {cartCount === 1 ? 'منتج' : 'منتجات'}
                  </span>
                </div>

                {/* قائمة العناصر المختصرة في السلة */}
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1 pl-1 mb-4 scrollbar-thin">
                  {cart.map((item) => {
                    const imgUrl = item.product?.images?.[0]?.secure_url || '/placeholder.png';
                    return (
                      <div key={item._id} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
                        <div className="relative w-14 h-14 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0">
                          <Image
                            src={imgUrl}
                            alt={item.product?.title || 'منتج'}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-800 line-clamp-1">
                            {item.product?.title}
                          </p>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                            <span>الكمية: {item.quantity}</span>
                            {item.size && <span>• المقاس: {item.size}</span>}
                            {item.color && <span>• اللون: {item.color}</span>}
                          </div>
                        </div>
                        <div className="text-left shrink-0">
                          <span className="text-xs font-black text-[#08101E]">
                            {(item.price * item.quantity).toLocaleString('ar-EG')} ج.م
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* كود الخصم (Promo Code) */}
                <div className="pt-3 border-t border-slate-100 mb-4">
                  <label className="text-xs font-bold text-slate-700 block mb-2">
                    هل تمتلك كوبون خصم؟
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="أدخل الكوبون (مثل HORUS10)"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 pr-8 pl-3 py-2 text-xs font-bold uppercase text-slate-800 placeholder:normal-case placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#D49B35]"
                      />
                    </div>
                    <button
                      type="button"
                      disabled={isApplyingCoupon || !couponCode.trim()}
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 rounded-xl bg-[#08101E] hover:bg-[#1a273e] text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {isApplyingCoupon ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'تطبيق'}
                    </button>
                  </div>
                </div>

                {/* الحسابات المالية بالتفصيل */}
                <div className="space-y-2.5 text-xs border-t border-slate-100 pt-4">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>مجموع المنتجات</span>
                    <span className="font-bold text-slate-800">
                      {cartSubtotal.toLocaleString('ar-EG')} ج.م
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex items-center justify-between text-emerald-600 font-bold">
                      <span className="flex items-center gap-1">
                        <span>خصم الكوبون ({appliedCoupon})</span>
                        <button
                          type="button"
                          onClick={handleRemoveCoupon}
                          className="text-[10px] text-red-500 hover:underline mr-1"
                        >
                          (حذف)
                        </button>
                      </span>
                      <span>-{discountAmount.toLocaleString('ar-EG')} ج.م</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-slate-600">
                    <span>تكلفة التوصيل والشحن</span>
                    <span className="font-bold">
                      {isShippingLoading ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400 inline" />
                      ) : activeShippingFee === 0 ? (
                        <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                          شحن مجاني
                        </span>
                      ) : (
                        `${activeShippingFee.toLocaleString('ar-EG')} ج.م`
                      )}
                    </span>
                  </div>

                  {/* تنبيه الشحن المجاني */}
                  {cartSubtotal < freeShippingThreshold && (
                    <div className="p-2.5 bg-amber-50/70 rounded-xl border border-amber-200/50 text-[11px] text-amber-800 flex items-center gap-2">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 text-[#D49B35]" />
                      <span>
                        أضف منتجات بقيمة{' '}
                        <strong>{(freeShippingThreshold - cartSubtotal).toLocaleString('ar-EG')} ج.م</strong>{' '}
                        للحصول على شحن مجاني بالكامل!
                      </span>
                    </div>
                  )}

                  {/* الإجمالي الكلي المطلوب */}
                  <div className="pt-3 border-t border-slate-200 flex items-baseline justify-between">
                    <div>
                      <span className="text-sm font-black text-[#08101E] block">المبلغ الإجمالي</span>
                      <span className="text-[11px] text-slate-400 font-normal">شامل ضريبة القيمة المضافة والشحن</span>
                    </div>
                    <div className="text-left">
                      <span className="text-2xl font-black text-[#D49B35]">
                        {grandTotal.toLocaleString('ar-EG')}
                      </span>
                      <span className="text-xs font-bold text-slate-500 mr-1">ج.م</span>
                    </div>
                  </div>
                </div>

                {/* زر تأكيد الطلب النهائي */}
                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting || cart.length === 0}
                    className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-gradient-to-r from-[#D49B35] to-[#B87B22] hover:opacity-95 active:scale-[0.99] text-white text-base font-black shadow-lg shadow-[#D49B35]/25 transition-all disabled:opacity-60 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>جاري إتمام الطلب...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-5 h-5" />
                        <span>تأكيد الطلب الآن ({grandTotal.toLocaleString('ar-EG')} ج.م)</span>
                      </>
                    )}
                  </button>
                </div>

                {/* مميزات الأمان والضمان */}
                <div className="mt-6 pt-5 border-t border-slate-100 space-y-2.5 text-xs text-slate-500">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>تسوق آمن ومشفر 100% وحماية كاملة لبياناتك</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Truck className="w-4 h-4 text-[#D49B35] shrink-0" />
                    <span>توصيل سريع لباب بيتك خلال 2 - 4 أيام عمل</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <RotateCcw className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>إمكانية الفحص والمعاينة قبل الاستلام والدفع</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </form>
      </div>
    </div>
  );
}
