'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Home,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  Search,
  Heart,
  MapPin,
  Maximize2,
  BedDouble,
  Bath,
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
  PhoneCall,
  SlidersHorizontal,
} from 'lucide-react';

export default function RealEstatePage() {
  const [propertyType, setPropertyType] = useState('');
  const [purpose, setPurpose] = useState('');
  const [location, setLocation] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [likedProperties, setLikedProperties] = useState<number[]>([]);

  const toggleLike = (id: number) => {
    setLikedProperties((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Property categories
  const categories = [
    { id: 'apartments', name: 'شقق سكنية', icon: HomeIcon, count: '120+' },
    { id: 'villas', name: 'فلل', icon: Building2, count: '45+' },
    { id: 'commercial', name: 'وحدات تجارية', icon: Store, count: '30+' },
    { id: 'offices', name: 'مكاتب إدارية', icon: Briefcase, count: '55+' },
    { id: 'lands', name: 'أراضي', icon: LandPlot, count: '18+' },
    { id: 'investment', name: 'مشاريع استثمارية', icon: TrendingUp, count: '25+' },
  ];

  // Latest properties matching design exactly
  const properties = [
    {
      id: 1,
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
      id: 2,
      title: 'شقة سكنية - التجمع الخامس',
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
      id: 3,
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
      id: 4,
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

  // Why choose Horus market features
  const whyUsFeatures = [
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

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-['Cairo'] text-right" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white pb-16">
        
        {/* Breadcrumb Navigation */}
        <nav
          className="flex items-center gap-1.5 text-sm text-slate-500 py-3 border-b border-slate-100 mb-6"
          aria-label="breadcrumb"
        >
          <Link href="/" className="flex items-center gap-1 text-slate-500 hover:text-[#D49B35] transition-colors">
            <Home className="w-4 h-4" />
            <span>الرئيسية</span>
          </Link>
          <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[#0B2545] font-bold">العقارات</span>
        </nav>

        {/* 1. Hero Section */}
        <section className="relative mb-10 overflow-hidden rounded-2xl border border-slate-200/90 shadow-sm bg-gradient-to-r from-[#0d2238] via-[#102b48] to-[#153a60] min-h-[340px] flex items-center">
          {/* Background cityscape banner image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/img/realstate/hero.jpg"
              alt="العقارات"
              fill
              priority
              className="object-cover object-center mix-blend-overlay opacity-30"
            />
          </div>

          <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 sm:p-10 items-center">
            
            {/* Right text content */}
            <div className="lg:col-span-7 flex flex-col items-start justify-center text-white">
              <span className="text-[#F3C053] font-bold text-sm sm:text-base mb-2 tracking-wide">
                فرص استثمارية .. ومساكن أفضل
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 tracking-tight drop-shadow-sm">
                العقارات
              </h1>
              <p className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-xl mb-6">
                نوفر لك أفضل الفرص العقارية في مصر، من الشقق السكنية والوحدات التجارية والإدارية إلى الأراضي والمشاريع الاستثمارية مع دعم قانوني واستشارات متكاملة.
              </p>
              <a
                href="#search-properties"
                className="inline-flex items-center gap-2 rounded-xl bg-[#F05A28] hover:bg-[#E04D1D] active:scale-95 text-white font-bold px-7 py-3 text-sm sm:text-base shadow-lg transition-all duration-200 group"
              >
                <span>تصفح العقارات المتاحة</span>
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              </a>
            </div>

            {/* Left 3 Feature Pills */}
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
        <section id="search-properties" className="mb-14 bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-xs">
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-black text-[#0B2545] mb-1">
              ابحث عن عقارك المثالي
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm">
              استخدم الفلاتر أدناه للبحث بسهولة عن العقار المناسب لك
            </p>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-end">
            {/* Property Type */}
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

            {/* Purpose */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">الغرض</label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full h-11 px-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#D49B35] text-slate-700 transition-colors cursor-pointer"
              >
                <option value="">للبيع / للإيجار</option>
                <option value="sale">للبيع</option>
                <option value="rent">للإيجار</option>
              </select>
            </div>

            {/* Location */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">الموقع</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full h-11 px-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#D49B35] text-slate-700 transition-colors cursor-pointer"
              >
                <option value="">اختر المنطقة</option>
                <option value="tagamoa">التجمع الخامس</option>
                <option value="sheikh-zayed">الشيخ زايد</option>
                <option value="october">6 أكتوبر</option>
                <option value="new-cairo">القاهرة الجديدة</option>
                <option value="capital">العاصمة الإدارية</option>
              </select>
            </div>

            {/* Min Price */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">السعر من</label>
              <select
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full h-11 px-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#D49B35] text-slate-700 transition-colors cursor-pointer"
              >
                <option value="">الحد الأدنى</option>
                <option value="500k">500,000 EGP</option>
                <option value="1m">1,000,000 EGP</option>
                <option value="3m">3,000,000 EGP</option>
                <option value="5m">5,000,000 EGP</option>
              </select>
            </div>

            {/* Max Price */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">السعر إلى</label>
              <select
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full h-11 px-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#D49B35] text-slate-700 transition-colors cursor-pointer"
              >
                <option value="">الحد الأقصى</option>
                <option value="5m">5,000,000 EGP</option>
                <option value="10m">10,000,000 EGP</option>
                <option value="15m">15,000,000 EGP</option>
                <option value="25m+">25,000,000+ EGP</option>
              </select>
            </div>

            {/* Search Button */}
            <div className="flex flex-col">
              <button
                type="submit"
                className="w-full h-11 bg-[#D49B35] hover:bg-[#C28B2B] active:scale-95 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all duration-200"
              >
                <Search className="w-4 h-4" />
                <span>بحث</span>
              </button>
            </div>
          </form>
        </section>

        {/* 3. Browse By Category ("تصفح حسب النوع") */}
        <section className="mb-14">
          <div className="text-right mb-6">
            <h2 className="text-xl sm:text-2xl font-black text-[#0B2545]">
              تصفح حسب النوع
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {categories.map((cat) => {
              const IconComp = cat.icon;
              return (
                <div
                  key={cat.id}
                  className="bg-white rounded-xl border border-slate-200/90 p-4 flex items-center justify-between shadow-2xs hover:shadow-md hover:border-[#D49B35] transition-all duration-300 cursor-pointer group"
                >
                  <ChevronLeft className="w-4 h-4 text-slate-300 group-hover:text-[#D49B35] group-hover:-translate-x-1 transition-all" />
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-xs sm:text-sm text-[#0B2545] group-hover:text-[#D49B35] transition-colors">
                      {cat.name}
                    </span>
                    <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-[#0B2545] group-hover:bg-[#0B2545] group-hover:text-[#F3C053] transition-colors">
                      <IconComp className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. Latest Properties ("أحدث العقارات المتاحة") */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-black text-[#0B2545]">
              أحدث العقارات المتاحة
            </h2>
            <Link
              href="#search-properties"
              className="text-xs sm:text-sm font-bold text-[#0B2545] hover:text-[#D49B35] flex items-center gap-1 transition-colors"
            >
              <span>عرض جميع العقارات</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {properties.map((item) => {
              const isLiked = likedProperties.includes(item.id);
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col group"
                >
                  {/* Image Container with Badges */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Status badge (للبيع / للإيجار) on right */}
                    <div className="absolute top-3 right-3 z-10">
                      <span className={`text-[11px] font-bold text-white px-2.5 py-1 rounded-md shadow-xs ${item.typeBadgeColor}`}>
                        {item.typeBadge}
                      </span>
                    </div>

                    {/* Favorite / Heart button on left */}
                    <button
                      onClick={() => toggleLike(item.id)}
                      className="absolute top-3 left-3 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-xs flex items-center justify-center text-slate-600 hover:text-red-500 hover:bg-white transition-all shadow-xs"
                      aria-label="إضافة للمفضلة"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isLiked ? 'fill-red-500 text-red-500' : ''
                        }`}
                      />
                    </button>
                  </div>

                  {/* Property Details */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Title */}
                      <h3 className="font-bold text-[#0B2545] text-sm sm:text-base mb-1 line-clamp-1 group-hover:text-[#D49B35] transition-colors">
                        {item.title}
                      </h3>

                      {/* Location */}
                      <div className="flex items-center gap-1 text-slate-500 text-xs mb-3">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.location}</span>
                      </div>

                      {/* Features (Area, Rooms, Baths) */}
                      <div className="flex items-center justify-between text-slate-600 text-[11px] sm:text-xs py-2.5 border-y border-slate-100 mb-3">
                        {item.area && (
                          <div className="flex items-center gap-1">
                            <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                            <span>{item.area}</span>
                          </div>
                        )}
                        {item.rooms !== null && (
                          <div className="flex items-center gap-1">
                            <BedDouble className="w-3.5 h-3.5 text-slate-400" />
                            <span>{item.rooms} غرف</span>
                          </div>
                        )}
                        {item.baths !== null && (
                          <div className="flex items-center gap-1">
                            <Bath className="w-3.5 h-3.5 text-slate-400" />
                            <span>{item.baths} حمام</span>
                          </div>
                        )}
                        {item.rooms === null && (
                          <div className="flex items-center gap-1 text-slate-400">
                            <span>أرض مميزة</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      {/* Price */}
                      <div className="flex items-baseline justify-end gap-1 mb-3">
                        {item.period && (
                          <span className="text-xs text-slate-500 font-normal">{item.period}</span>
                        )}
                        <span className="text-[#0B2545] font-black text-base sm:text-lg">
                          {item.price}
                        </span>
                      </div>

                      {/* View Details Button */}
                      <button className="w-full py-2 border border-slate-200 hover:border-[#D49B35] hover:bg-[#D49B35]/5 text-xs sm:text-sm font-bold text-[#0B2545] hover:text-[#D49B35] rounded-xl transition-all duration-200">
                        عرض التفاصيل
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 5. Consultation CTA & Why Choose Us Section */}
        <section className="mb-14 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Right: Why Choose Horus for Real Estate ("لماذا تختار سوق حورس للعقارات؟") */}
          <div className="order-2 lg:order-1 lg:col-span-7 flex flex-col justify-center">
            <h2 className="text-xl sm:text-2xl font-black text-[#0B2545] mb-6">
              لماذا تختار سوق حورس للعقارات؟
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              {whyUsFeatures.map((feat, idx) => {
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

          {/* Left: Consultation Banner ("هل تحتاج إلى استشارة عقارية؟") */}
          <div className="order-1 lg:order-2 lg:col-span-5 relative overflow-hidden rounded-2xl bg-[#0B2545] p-6 text-white flex flex-col justify-between shadow-md min-h-[220px]">
            {/* Background image preview */}
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

        {/* 6. Bottom Banner ("استثمر في مستقبلك .. واختر المكان المناسب") */}
        <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-100 via-sky-50 to-slate-100 py-10 px-4 text-center">
          {/* Subtle skyline background */}
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