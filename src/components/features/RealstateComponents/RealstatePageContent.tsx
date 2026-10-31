'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Home,
  ChevronLeft,
  ArrowLeft,
  Search,
  Building2,
  Home as HomeIcon,
  Store,
  Briefcase,
  TrendingUp,
  LandPlot,
  ShieldCheck,
  Scale,
  Award,
  CircleDollarSign,
  SlidersHorizontal,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import { Category } from '@/types/category';
import { RealEstateItem } from '@/types/realestate';
import RealstateCard from './RealstateCard';


// بيانات تجريبية احتياطية متناسقة في حال لم توجد منتجات عقارية في الـ Database بعد
const FALLBACK_PROPERTIES: RealEstateItem[] = [
  {
    id: 'f-1',
    title: 'أرض استثمارية - 6 أكتوبر',
    location: '6 أكتوبر',
    typeBadge: 'للبيع',
    typeBadgeColor: 'bg-[#D49B35]',
    price: '4,500,000 EGP',
    area: '1000 م²',
    rooms: null,
    baths: null,
    image: '/img/realstate/card_land.jpg',
    category: 'أرض',
  },
  {
    id: 'f-2',
    title: 'شقة سكنية فاخرة - التجمع الخامس',
    location: 'التجمع الخامس',
    typeBadge: 'للبيع',
    typeBadgeColor: 'bg-[#D49B35]',
    price: '6,800,000 EGP',
    area: '180 م²',
    rooms: 3,
    baths: 2,
    image: '/img/realstate/card_apartment.jpg',
    category: 'شقة',
  },
  {
    id: 'f-3',
    title: 'فيلا مستقلة - الشيخ زايد',
    location: 'الشيخ زايد',
    typeBadge: 'للبيع',
    typeBadgeColor: 'bg-[#D49B35]',
    price: '12,500,000 EGP',
    area: '350 م²',
    rooms: 5,
    baths: 4,
    image: '/img/realstate/card_villa.jpg',
    category: 'فيلا',
  },
  {
    id: 'f-4',
    title: 'مكتب إداري فاخر - القاهرة الجديدة',
    location: 'القاهرة الجديدة',
    typeBadge: 'للإيجار',
    typeBadgeColor: 'bg-[#1E40AF]',
    price: '35,000 EGP',
    period: 'شهرياً',
    area: '120 م²',
    rooms: 3,
    baths: 1,
    image: '/img/realstate/card_office.jpg',
    category: 'مكتب',
  },
];

// تصنيفات العقارات للأيقونات
const PROPERTY_CATEGORIES = [
  { id: 'apartments', name: 'شقق سكنية', icon: HomeIcon, count: '120+' },
  { id: 'villas', name: 'فلل', icon: Building2, count: '45+' },
  { id: 'commercial', name: 'وحدات تجارية', icon: Store, count: '30+' },
  { id: 'offices', name: 'مكاتب إدارية', icon: Briefcase, count: '55+' },
  { id: 'lands', name: 'أراضي', icon: LandPlot, count: '18+' },
  { id: 'investment', name: 'مشاريع استثمارية', icon: TrendingUp, count: '25+' },
];

// مميزات سوق حورس للعقارات
const WHY_US_FEATURES = [
  {
    icon: CircleDollarSign,
    title: 'أسعار مناسبة',
    description: 'أفضل الفرص بأعلى قيمة استثمارية وأسعار تنافسية',
  },
  {
    icon: Award,
    title: 'خبرة موثوقة',
    description: 'فريق متخصص بخبرة عريقة في السوق العقاري المصري',
  },
  {
    icon: Scale,
    title: 'دعم قانوني',
    description: 'تعاقدات آمنة واستشارات قانونية متكاملة لراحة بالك',
  },
  {
    icon: ShieldCheck,
    title: 'تنوع الخيارات',
    description: 'أكثر من نوع من العقارات تلبي جميع رغباتك في مختلف المناطق',
  },
];

export default function RealstatePageContent() {
  const { categories, isCategoriesLoading, products, isProductsLoading } = useShop();

  // فلاتر البحث
  const [propertyType, setPropertyType] = useState('');
  const [purpose, setPurpose] = useState('');
  const [location, setLocation] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [likedProperties, setLikedProperties] = useState<(string | number)[]>([]);

  // استخراج تصنيف العقارات من الكاتيجوريز القادمة من الباك إند
  const realEstateCategory: Category | undefined = useMemo(() => {
    return categories?.find(
      (cat) =>
        cat.title?.trim().includes('عقار') ||
        cat.name?.trim().includes('عقار') ||
        cat.slug?.includes('عقار') ||
        cat.slug?.includes('realstate')
    );
  }, [categories]);

  // استخراج المنتجات التابعة لكاتيجوري العقارات إن وجدت في الباك
  const backendRealStateItems: RealEstateItem[] = useMemo(() => {
    if (!products?.length || !realEstateCategory) return [];

    const filtered = products.filter((p) => {
      const pCat = p.category as any;
      const catId = typeof pCat === 'object' ? pCat?._id : pCat;
      const catTitle = typeof pCat === 'object' ? pCat?.title || pCat?.name : '';
      return (
        catId === realEstateCategory._id ||
        catTitle?.includes('عقار') ||
        p.title?.includes('عقار') ||
        p.title?.includes('شقة') ||
        p.title?.includes('فيلا') ||
        p.title?.includes('أرض')
      );
    });

    return filtered.map((p) => ({
      id: p._id,
      title: p.title,
      price: p.discountPrice || p.price,
      image: p.images?.[0]?.secure_url || p.image?.[0]?.secure_url || '/img/realstate/card_apartment.jpg',
      location: 'مصر',
      typeBadge: 'متاح للطلب',
      typeBadgeColor: 'bg-[#D49B35]',
      slug: p.slug,
      area: 'مساحات متنوعة',
      rooms: null,
      baths: null,
      category: 'عقار',
    }));
  }, [products, realEstateCategory]);

  // دمج العقارات المتاحة (بيانات الباك إند مع الـ Fallback)
  const displayProperties: RealEstateItem[] = useMemo(() => {
    if (backendRealStateItems.length > 0) {
      return [...backendRealStateItems, ...FALLBACK_PROPERTIES];
    }
    return FALLBACK_PROPERTIES;
  }, [backendRealStateItems]);

  const toggleLike = (id: string | number) => {
    setLikedProperties((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-['Cairo'] text-right" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white pb-16">
        {/* شريط المسار (Breadcrumbs) */}
        <nav
          className="flex items-center gap-1.5 text-sm text-slate-500 py-3 border-b border-slate-100 mb-6"
          aria-label="breadcrumb"
        >
          <Link
            href="/"
            className="flex items-center gap-1 text-slate-500 hover:text-[#D49B35] transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>الرئيسية</span>
          </Link>
          <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[#0B2545] font-bold">
            {realEstateCategory?.title || 'العقارات'}
          </span>
        </nav>

        {/* 1. Hero Section - مع صورة ووصف التصنيف من الباك */}
        <section className="relative mb-10 overflow-hidden rounded-2xl border border-slate-200/90 shadow-sm bg-gradient-to-r from-[#0d2238] via-[#102b48] to-[#153a60] min-h-[340px] flex items-center">
          {/* خلفية البانر */}
          <div className="absolute inset-0 z-0">
            <Image
              src={
                realEstateCategory?.image?.secure_url ||
                '/img/realstate/hero.jpg'
              }
              alt={realEstateCategory?.title || 'العقارات'}
              fill
              priority
              className="object-cover object-center mix-blend-overlay opacity-30"
            />
          </div>

          <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 sm:p-10 items-center">
            {/* المحتوى النصي الأيمن */}
            <div className="lg:col-span-7 flex flex-col items-start justify-center text-white">
              <span className="text-[#F3C053] font-bold text-sm sm:text-base mb-2 tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#D49B35]" />
                {realEstateCategory?.description
                  ? realEstateCategory.description
                  : 'فرص استثمارية .. ومساكن أفضل'}
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 tracking-tight drop-shadow-sm">
                {realEstateCategory?.title || 'العقارات'}
              </h1>
              <p className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-xl mb-6">
                نوفر لك أفضل الفرص العقارية في مصر، من الشقق السكنية والوحدات التجارية
                والإدارية إلى الأراضي والمشاريع الاستثمارية مع دعم قانوني واستشارات متكاملة.
              </p>
              <a
                href="#search-properties"
                className="inline-flex items-center gap-2 rounded-xl bg-[#F05A28] hover:bg-[#E04D1D] active:scale-95 text-white font-bold px-7 py-3 text-sm sm:text-base shadow-lg transition-all duration-200 group"
              >
                <span>تصفح العقارات المتاحة</span>
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              </a>
            </div>

            {/* بطاقات المميزات السريعة */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              <div className="flex items-center gap-3.5 bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 rounded-xl p-3.5 text-white transition-all duration-200">
                <div className="w-11 h-11 rounded-lg bg-[#D49B35]/25 border border-[#D49B35]/40 flex items-center justify-center shrink-0 text-[#F3C053]">
                  <CircleDollarSign className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-white">بيع وشراء العقارات</h4>
                  <p className="text-xs text-slate-300">بمصداقية وأمان تام</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 rounded-xl p-3.5 text-white transition-all duration-200">
                <div className="w-11 h-11 rounded-lg bg-[#D49B35]/25 border border-[#D49B35]/40 flex items-center justify-center shrink-0 text-[#F3C053]">
                  <HomeIcon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-white">تأجير الوحدات</h4>
                  <p className="text-xs text-slate-300">سكنية وتجارية وإدارية</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 rounded-xl p-3.5 text-white transition-all duration-200">
                <div className="w-11 h-11 rounded-lg bg-[#D49B35]/25 border border-[#D49B35]/40 flex items-center justify-center shrink-0 text-[#F3C053]">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-white">استشارات استثمارية</h4>
                  <p className="text-xs text-slate-300">لتحقيق أفضل عائد استثماري</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Search & Filter Box */}
        <section
          id="search-properties"
          className="mb-14 bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-xs"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-black text-[#0B2545] mb-1">
              ابحث عن عقارك المثالي
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm">
              استخدم الفلاتر أدناه للبحث بسهولة عن العقار المناسب لك
            </p>
          </div>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-end"
          >
            {/* نوع العقار */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">نوع العقار</label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full h-11 px-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#D49B35] text-slate-700 transition-colors cursor-pointer"
              >
                <option value="">اختر النوع</option>
                <option value="apartment">شقة سكنية</option>
                <option value="villa">فيلا</option>
                <option value="commercial">وحدة تجارية</option>
                <option value="office">مكتب إداري</option>
                <option value="land">أرض</option>
              </select>
            </div>

            {/* الغرض */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">الغرض</label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full h-11 px-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#D49B35] text-slate-700 transition-colors cursor-pointer"
              >
                <option value="">الكل</option>
                <option value="sale">للبيع</option>
                <option value="rent">للإيجار</option>
              </select>
            </div>

            {/* المنطقة / الموقع */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">الموقع / المدينة</label>
              <input
                type="text"
                placeholder="مثال: التجمع الخامس، زايد..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full h-11 px-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#D49B35] text-slate-700 placeholder:text-slate-400"
              />
            </div>

            {/* السعر من */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">السعر من (ج.م)</label>
              <input
                type="number"
                placeholder="الحد الأدنى"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full h-11 px-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#D49B35] text-slate-700 placeholder:text-slate-400"
              />
            </div>

            {/* السعر إلى */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">السعر إلى (ج.م)</label>
              <input
                type="number"
                placeholder="الحد الأقصى"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full h-11 px-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#D49B35] text-slate-700 placeholder:text-slate-400"
              />
            </div>

            {/* زر البحث */}
            <div>
              <button
                type="submit"
                className="w-full h-11 rounded-xl bg-[#0B2545] hover:bg-[#153a60] active:scale-95 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all duration-200 cursor-pointer"
              >
                <Search className="w-4 h-4 text-[#D49B35]" />
                <span>بحث</span>
              </button>
            </div>
          </form>
        </section>

        {/* 3. Property Categories Grid */}
        <section className="mb-14">
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-black text-[#0B2545] mb-1">
              تصنيفات العقارات
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm">
              اختر نوع العقار المناسب لاحتياجاتك
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {PROPERTY_CATEGORIES.map((cat) => {
              const IconComp = cat.icon;
              return (
                <div
                  key={cat.id}
                  className="bg-white border border-slate-200 hover:border-[#D49B35] rounded-2xl p-4 text-center cursor-pointer transition-all duration-300 hover:shadow-md group flex flex-col items-center justify-between min-h-[110px]"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[#0B2545] group-hover:bg-[#0B2545] group-hover:text-[#F3C053] transition-colors mb-2">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-[#0B2545] group-hover:text-[#D49B35] transition-colors mb-0.5">
                      {cat.name}
                    </h3>
                    <span className="text-[10px] text-slate-400">{cat.count} عقار</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. Latest Properties ("أحدث العقارات المتاحة") */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#0B2545]">
                أحدث العقارات المتاحة
              </h2>
              {realEstateCategory && (
                <span className="text-xs text-slate-500 font-semibold block mt-0.5">
                  معروضات قسم ({realEstateCategory.title})
                </span>
              )}
            </div>

            <Link
              href="#search-properties"
              className="text-xs sm:text-sm font-bold text-[#0B2545] hover:text-[#D49B35] flex items-center gap-1 transition-colors"
            >
              <span>عرض جميع العقارات</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* شبكة كروت العقارات باستخدام RealstateCard */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {displayProperties.map((property) => (
              <RealstateCard
                key={property.id}
                property={property}
                isLiked={likedProperties.includes(property.id)}
                onToggleLike={toggleLike}
              />
            ))}
          </div>
        </section>

        {/* 5. Consultation CTA & Why Choose Us Section */}
        <section className="mb-14 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* لماذا تختار سوق حورس للعقارات؟ */}
          <div className="order-2 lg:order-1 lg:col-span-7 flex flex-col justify-center">
            <h2 className="text-xl sm:text-2xl font-black text-[#0B2545] mb-6">
              لماذا تختار سوق حورس للعقارات؟
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              {WHY_US_FEATURES.map((feat, idx) => {
                const IconComp = feat.icon;
                return (
                  <div key={idx} className="flex flex-col items-center">
                    <div className="w-13 h-13 rounded-2xl bg-[#0B2545] text-[#F3C053] flex items-center justify-center mb-3 shadow-xs">
                      <IconComp className="w-6 h-6 text-[#D49B35]" />
                    </div>
                    <h4 className="font-bold text-xs sm:text-sm text-[#0B2545] mb-1">
                      {feat.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      {feat.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* بنر الاستشارة العقارية */}
          <div className="order-1 lg:order-2 lg:col-span-5 relative overflow-hidden rounded-2xl bg-[#0B2545] p-6 text-white flex flex-col justify-between shadow-md min-h-[220px]">
            <div className="absolute inset-0 z-0">
              <Image
                src="/img/realstate/consult_box.jpg"
                alt="استشارة عقارية"
                fill
                className="object-cover object-center opacity-25 mix-blend-luminosity"
              />
            </div>

            <div className="relative z-10 mb-4">
              <h3 className="text-lg sm:text-xl font-black text-white mb-2">
                هل تحتاج إلى استشارة عقارية؟
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 max-w-xs leading-relaxed">
                فريقنا المتخصص جاهز لتقديم أفضل الحلول المناسبة لاحتياجاتك.
              </p>
            </div>

            <div className="relative z-10">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-[#D49B35] hover:bg-[#E5A93C] active:scale-95 text-[#0B2545] font-black px-6 py-2.5 text-xs sm:text-sm shadow-md transition-all duration-200 group"
              >
                <span>تواصل معنا</span>
                <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
              </Link>
            </div>
          </div>
        </section>

        {/* 6. Bottom Banner */}
        <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-100 via-sky-50 to-slate-100 py-10 px-4 text-center">
          <div className="absolute inset-0 z-0 opacity-25">
            <Image
              src="/img/realstate/skyline_footer.jpg"
              alt="سوق حورس للعقارات"
              fill
              className="object-cover object-bottom"
            />
          </div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-black text-[#0B2545] mb-2 tracking-tight">
              &ldquo; استثمر في مستقبلك .. واختر المكان المناسب &rdquo;
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              مع سوق حورس .. العقار ليس مجرد مكان، بل فرصة لحياة أفضل
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

