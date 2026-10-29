'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Home,
  ChevronRight as ChevronRightBreadcrumb,
  ChevronLeft,
  ArrowLeft,
  Target,
  Users,
  TrendingUp,
  Megaphone,
  Mail,
  Palette,
  Search,
  PenTool,
  Compass,
  Rocket,
  BarChart3,
} from 'lucide-react';
import { FaInstagram, FaFacebookF, FaYoutube, FaXTwitter } from "react-icons/fa6";

export default function MarketingPage() {
  // 6 Services matching the exact design
  const services = [
    {
      id: 'campaigns',
      title: 'إدارة الحملات الإعلانية',
      description: 'إطلاق وإدارة حملات إعلانية ممولة على فيسبوك، جوجل، يوتيوب وغيرها.',
      icon: Megaphone,
      href: '#contact',
    },
    {
      id: 'social',
      title: 'إدارة وسائل التواصل الإجتماعي',
      description: 'بناء وإدارة حساباتك على منصات التواصل الإجتماعي لزيادة التفاعل والمبيعات.',
      icon: Users,
      customIcon: (
        <div className="flex flex-col items-center justify-center gap-1 text-[#D49B35]">
          <div className="flex items-center gap-1.5">
            {/* Facebook */}
            <FaFacebookF className="w-3.5 h-3.5 fill-current" />
            {/* Instagram */}
            <FaInstagram className="w-3.5 h-3.5 fill-current" />
            
          </div>
          <div className="flex items-center gap-1.5">
            {/* X */}
            <FaXTwitter className="w-3.5 h-3.5 fill-current" />
            {/* Youtube */}
            <FaYoutube className="w-3.5 h-3.5 fill-current" />
          </div>
          
        </div>
      ),
      href: '#contact',
    },
    {
      id: 'content',
      title: 'إنتاج المحتوى الإبداعي',
      description: 'تصميم محتوى جذاب ومؤثر بالنصوص والصور والفيديو والتصاميم الاحترافية.',
      icon: PenTool,
      href: '#contact',
    },
    {
      id: 'seo',
      title: 'تحسين محركات البحث (SEO)',
      description: 'رفع ترتيب موقعك في نتائج البحث لزيادة الزيارات وتحقيق نمو مستدام.',
      icon: Search,
      href: '#contact',
    },
    {
      id: 'email',
      title: 'التسويق عبر البريد الإلكتروني',
      description: 'بناء حملات بريد إلكتروني فعالة للتواصل مع عملائك وزيادة معدلات المبيعات.',
      icon: Mail,
      href: '#contact',
    },
    {
      id: 'branding',
      title: 'تصميم الهوية البصرية',
      description: 'تصميم هوية احترافية تعكس قيمة علامتك التجارية وتميزها في السوق.',
      icon: Palette,
      href: '#contact',
    },
  ];

  // 4 Steps for "كيف نعمل؟"
  const workflowSteps = [
    {
      number: '1',
      title: 'تحديد الأهداف',
      description: 'فهم احتياجاتك وتحديد أهداف الحملة',
      icon: Target,
    },
    {
      number: '2',
      title: 'وضع الإستراتيجية',
      description: 'اختيار القنوات المناسبة والخطة التسويقية',
      icon: Compass,
    },
    {
      number: '3',
      title: 'التنفيذ والمتابعة',
      description: 'إطلاق الحملة ومتابعة الأداء بشكل دوري',
      icon: Rocket,
    },
    {
      number: '4',
      title: 'تحليل النتائج',
      description: 'تقديم تقارير مفصلة وتحسين الأداء',
      icon: BarChart3,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-['Cairo'] text-right">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white pb-16">
        {/* Breadcrumb Navigation */}
        <nav
          className="flex items-center gap-1.5 text-sm sm:text-base text-slate-600 py-3 border-b border-slate-100 mb-6"
          aria-label="breadcrumb"
        >
          <Link href="/" className="flex items-center gap-1 text-slate-500 hover:text-[#D49B35] transition-colors">
            <Home className="w-4 h-4" />
            <span>الرئيسية</span>
          </Link>
          <ChevronRightBreadcrumb className="w-3.5 h-3.5 text-slate-400 rotate-180" />
          <span className="text-ink-primary font-bold">التسويق والإعلان</span>
        </nav>

        {/* 1. Hero Section */}
        <section
            dir="rtl"
            className="relative isolate mb-14 min-h-[320px] overflow-hidden rounded-2xl border border-slate-200/80 bg-[#F8FAFD] shadow-xs"
          >
            {/* Background Image - Middle Area */}
            <div className="absolute inset-y-0 left-0 right-0 z-0 lg:right-[-18.6667%]">
              <Image
                src="/img/marketing/hero.jpg"
                alt=""
                fill
                // sizes="(max-width: 1024px) 100vw, 63vw"
                className="object-contain object-center"
                priority
              />
            </div>

            {/* White Fade - Keeps Text Readable on the Left */}
            <div className="absolute inset-y-0 left-0 right-0 z-10 bg-gradient-to-r from-[#F8FAFD] via-[#F8FAFD]/90 via-[35%] to-transparent to-[78%] lg:right-[16.6667%]" />

            <div className="relative z-20 grid min-h-[320px] grid-cols-1 items-stretch lg:grid-cols-12">

              {/* Right Column - Features */}
              <div className="order-2 flex flex-col justify-center gap-3 border-t border-slate-200/70 bg-[#EEF5FB] p-4 lg:order-none lg:col-span-2 lg:border-r lg:border-t-0 lg:p-4">

                {/* Feature 1 */}
                <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-white/95 p-3 shadow-xs transition-colors hover:border-amber-300">
                  <div className="text-right">
                    <div className="text-sm font-bold leading-snug text-[#0B2545]">
                      استراتيجية مخصصة
                    </div>
                    <div className="text-xs text-slate-500">
                      لكل جهة
                    </div>
                  </div>

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-amber-200 bg-amber-50 text-[#D49B35]">
                    <Target className="h-5 w-5" />
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-white/95 p-3 shadow-xs transition-colors hover:border-amber-300">
                  <div className="text-right">
                    <div className="text-sm font-bold leading-snug text-[#0B2545]">
                      فريق محترف
                    </div>
                    <div className="text-xs text-slate-500">
                      ذو خبرة عالية
                    </div>
                  </div>

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-amber-200 bg-amber-50 text-[#D49B35]">
                    <Users className="h-5 w-5" />
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-white/95 p-3 shadow-xs transition-colors hover:border-amber-300">
                  <div className="text-right">
                    <div className="text-sm font-bold leading-snug text-[#0B2545]">
                      نتائج قابلة للقياس
                    </div>
                    <div className="text-xs text-slate-500">
                      وتحليل مستمر
                    </div>
                  </div>

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-amber-200 bg-amber-50 text-[#D49B35]">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                </div>
              </div>

              {/* Middle Spacer - Reveals the Background Image */}
              <div className="hidden lg:col-span-5 lg:block" />

              {/* Left Column - Marketing Content */}
              <div className="order-1 flex flex-col items-start justify-center p-6 text-right sm:p-8 lg:order-none lg:col-span-5 lg:pl-4 lg:pr-6 lg:py-10">

                {/* Badge */}
                <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-amber-200/60 bg-amber-50/95 px-3 py-1 text-xs font-semibold text-[#D49B35] sm:text-sm">
                  <span>حلول تسويقية متكاملة ... تصنع الفرق</span>
                  <ChevronLeft className="h-3.5 w-3.5 text-[#D49B35]" />
                </div>

                {/* Title */}
                <h1 className="mb-4 text-3xl font-black leading-tight tracking-tight text-[#0B2545] sm:text-4xl lg:text-5xl">
                  التسويق والإعلان
                </h1>

                {/* Description */}
                <p className="mb-6 max-w-lg text-sm leading-relaxed text-slate-600 sm:text-base">
                  نساعدك في الوصول إلى جمهورك المستهدف من خلال استراتيجيات تسويقية مبتكرة
                  وحملات إعلانية احترافية عبر مختلف المنصات الرقمية والتقليدية.
                </p>

                {/* CTA */}
                <Link
                  href="#contact"
                  className="group inline-flex items-center gap-2 rounded-xl bg-[#F05A28] px-6 py-3 text-sm font-bold text-white shadow-md transition-all duration-200 hover:bg-[#E04D1D] hover:shadow-lg active:scale-95 sm:text-base"
                >
                  <span>اطلب استشارة تسويقية</span>
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                </Link>
              </div>

            </div>
          </section>

        {/* 2. Services Section */}
        <section className="mb-16">
          <div className="text-reight mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-ink-primary mb-2">
              خدمات التسويق والإعلان
            </h2>
            <p className="text-slate-500 text-sm sm:text-base max-w-2xl">
              مجموعة متكاملة من الخدمات التي نساعدك على بناء علامتك التجارية وزيادة مبيعاتك
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {services.map((service) => {
              const IconComponent = service.icon;
              return (
                <div
                  key={service.id}
                  className="bg-neutral-page-bg rounded-2xl border border-slate-200/90 p-5 flex flex-col items-center text-center shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
                >
                  {/* Icon Circle */}
                  <div className="w-14 h-14 rounded-full bg-[#0B2545] flex items-center justify-center text-amber-400 mb-4 shadow-sm group-hover:scale-105 transition-transform">
                    {service.customIcon ? (
                      service.customIcon
                    ) : (
                      <IconComponent className="w-6 h-6 text-[#D49B35]" />
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-[#0B2545] text-sm sm:text-base mb-2 group-hover:text-[#D49B35] transition-colors leading-snug min-h-[44px] flex items-center justify-center">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-500 text-xs sm:text-[13px] leading-relaxed mb-4 flex-1">
                    {service.description}
                  </p>

                  {/* Link */}
                  <Link
                    href={service.href}
                    className="text-xs font-bold text-[#0B2545] flex items-center justify-center gap-1 hover:text-[#D49B35] transition-colors mt-auto pt-2 border-t border-slate-100 w-full group/link"
                  >
                    <span>تعرف على المزيد</span>
                    <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover/link:-translate-x-1" />
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* 3. How We Work Section ("كيف نعمل؟") */}
        <section className="mb-16 p-5 rounded-xl bg-neutral-page-bg">
          <div className="text-right mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-[#0B2545] mb-2">
              كيف نعمل؟
            </h2>
            <p className="text-slate-500 text-sm sm:text-base">
              من الفكرة إلى النتائج ... بخطوات واضحة ومنهجية احترافية
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Image on Left (in RTL): Social Media Mobile with Inset Dark Box */}
            <div className="lg:col-span-5 relative">
              <div className="relative h-72 sm:h-80 w-full rounded-2xl overflow-hidden shadow-md border border-slate-200">
                <Image
                  src="/img/marketing/mobile.jpg"
                  alt="حملات إعلانية مستهدفة لنتائج أفضل"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-center"
                />

                {/* Dark Navy Inset Badge Overlay */}
                <div className="absolute bottom-0 right-0 bg-ink-primary text-white p-5 rounded-tl-2xl shadow-xl max-w-[240px] text-right">
                  <h4 className="text-base font-bold leading-tight">
                    حملات إعلانية مستهدفة
                  </h4>
                  <p className="text-sm font-semibold text-slate-200 mt-0.5">
                    لنتائج أفضل
                  </p>
                  <div className="w-12 h-1 bg-[#D49B35] rounded-full mt-2" />
                </div>
              </div>
            </div>

            {/* Workflow Steps on Right (in RTL): 4 Steps Connected */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-2 items-start relative">
                {workflowSteps.map((step, idx) => {
                  const StepIcon = step.icon;
                  return (
                    <div key={step.number} className="flex items-center relative">
                      <div className="flex flex-col items-center text-center w-full px-2">
                        {/* Icon Box with Number Badge */}
                        <div className="relative mb-3">
                          <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-center text-[#0B2545] hover:border-amber-300 transition-colors">
                            <StepIcon className="w-6 h-6 text-[#0B2545]" />
                          </div>
                          {/* Number Badge */}
                          <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#D49B35] text-white text-xs font-black flex items-center justify-center shadow-xs">
                            {step.number}
                          </div>
                        </div>

                        {/* Title */}
                        <h4 className="font-bold text-[#0B2545] text-sm sm:text-base mb-1">
                          {step.title}
                        </h4>

                        {/* Description */}
                        <p className="text-slate-500 text-xs leading-relaxed">
                          {step.description}
                        </p>
                      </div>

                      {/* Chevron Arrow between steps (RTL points left) */}
                      {idx < workflowSteps.length - 1 && (
                        <div className="hidden md:flex absolute -left-2 top-6 text-slate-300 pointer-events-none">
                          <ChevronLeft className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* 4. Bottom CTA Banner */}
        <section id="contact" className="relative overflow-hidden rounded-2xl bg-[#0B2347] p-6 sm:p-8 lg:p-10 shadow-xl border border-slate-800">
          {/* Watermark Falcon/Eye of Horus on Left Side */}
          <div className="absolute left-2 -bottom-6 w-48 h-48 opacity-15 pointer-events-none select-none">
            <svg
              viewBox="0 0 100 80"
              className="w-full h-full"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M 12 24 C 30 14, 70 14, 88 24 C 82 20, 45 12, 12 24 Z"
                fill="#D49B35"
              />
              <path
                d="M 14 36 C 35 20, 68 20, 86 36 C 68 25, 35 25, 14 36 Z"
                fill="#D49B35"
              />
              <circle cx="50" cy="38" r="9.5" fill="#D49B35" />
              <circle cx="50" cy="38" r="4.5" fill="#08101E" />
              <circle cx="52" cy="36" r="2" fill="#FDE047" />
              <path
                d="M 16 38 C 35 48, 68 48, 84 38 C 68 45, 35 45, 16 38 Z"
                fill="#D49B35"
              />
              <path
                d="M 50 48 C 50 64, 38 68, 30 64 C 24 60, 26 54, 32 55 C 38 56, 42 59, 44 54 C 45 49, 46 48, 50 48 Z"
                fill="#D49B35"
              />
              <path
                d="M 64 42 C 65 52, 66 68, 68 76 C 66 76, 62 62, 60 44 Z"
                fill="#D49B35"
              />
              <path
                d="M 85 36 C 92 37, 96 40, 98 42 C 95 42, 90 39, 84 38 Z"
                fill="#D49B35"
              />
            </svg>
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 text-center md:text-right">
            {/* Center / Text */}
            <div className="flex-1">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white mb-2">
                جاهز لبدء حملتك التسويقية؟
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm lg:text-base font-normal">
                تواصل معنا الآن وإحصل على استشارة مجانية من فريق التسويق لدينا
              </p>
            </div>

            {/* Ochre / Golden Button on Right */}
            <div className="flex-1 shrink-0">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-[#D49B35] hover:bg-[#E2A740] active:scale-95 text-slate-950 font-black px-7 py-3.5 text-sm sm:text-base shadow-lg transition-all duration-200 group"
              >
                <span>تواصل معنا</span>
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

