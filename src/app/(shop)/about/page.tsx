import Image from 'next/image';
import Link from 'next/link';

import {
  ArrowLeft,
  Briefcase,
  Eye,
  Gem,
  Home,
  Megaphone,
  ShoppingCart,
  Target,
  Users,
} from 'lucide-react';
import HeroAbout from '@/components/about/Heroabout';
import NavbarAbout from '@/components/about/Navbarabout';

/**
 * الصور المطلوبة (حطها في public/images/about/):
 *  platform.jpg      940  × 464   (صورة الشبكة والأيقونات)
 *  join-bg.jpg       520  × 180   (صقر حورس + الأهرامات - آخر الصفحة)
 */

const GOLD_TEXT = 'text-[#C9972B]';

const SERVICES = [
  {
    icon: ShoppingCart,
    title: 'التجارة الإلكترونية',
    desc: 'منتجات متنوعة من موردين وشركات موثوقة',
    cta: 'تصفح المتجر',
    href: '/shop',
  },
  {
    icon: Megaphone,
    title: 'التسويق والإعلان',
    desc: 'حلول تسويقية مبتكرة لأعمالك',
    cta: 'اكتشف المزيد',
    href: '/marketing',
  },
  {
    icon: Target,
    title: 'الحملات الدعائية',
    desc: 'إدارة حملاتك السياسية والتجارية والإعلامية',
    cta: 'تعرف على خدماتنا',
    href: '/campaigns',
  },
  {
    icon: Briefcase,
    title: 'الخدمات المهنية',
    desc: 'استشارات وخدمات متخصصة في مختلف المجالات',
    cta: 'اطلب الخدمة',
    href: '/services',
  },
  {
    icon: Home,
    title: 'العقارات',
    desc: 'فرص عقارية واستثمارية مميزة',
    cta: 'اعرض العقارات',
    href: '/real-estate',
  },
  {
    icon: Users,
    title: 'الموردون والشركاء',
    desc: 'شركاء النجاح في كل المجالات',
    cta: 'انضم إلينا',
    href: '/partners',
  },
];

const VALUES = [
  'الشفافية والمصداقية',
  'الابتكار والتطوير المستمر',
  'التركيز على العميل',
  'بناء شراكات طويلة الأمد',
  'المسؤولية المجتمعية',
];


export default function AboutPage() {
  return (
    <main className="bg-white font-['Cairo'] text-right" dir="rtl">
      <HeroAbout />

      {/* ───────── منصة سوق حورس ───────── */}
      <section className="py-10 md:py-14 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="relative w-full aspect-[470/232] rounded-xl overflow-hidden shadow-lg border border-slate-200">
            <Image
              src="/img/about-page.png"
              alt="منصة سوق حورس"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-2xl font-black text-[#0A2150]">منصة سوق حورس</h2>
            <p className={`text-sm font-bold mt-1 ${GOLD_TEXT}`}>كل ما تحتاجه ... في مكان واحد</p>
            <p className="text-xs md:text-sm text-slate-600 leading-loose mt-4">
              سوق حورس هو منصة عربية رائدة تهدف إلى ربط الأفراد والشركات بأحدث الفرص والخدمات، من
              خلال بيئة آمنة وموثوقة. تجمع بين التجارة الإلكترونية، التسويق والإعلان، الخدمات
              المهنية، العقارات، والشركاء والموردين، مع محتوى معرفي وإخباري يواكب أحدث التطورات في
              مختلف المجالات.
            </p>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 mt-6 px-6 py-2.5 rounded-md bg-[#C9972B] hover:bg-[#b5851f] text-white text-xs font-bold transition-colors"
            >
              <span>اكتشف خدماتنا</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>

          
        </div>
      </section>

      {/* ───────── رؤيتنا ورسالتنا وقيمنا ───────── */}
      <section className="py-10 bg-[#F8F5EF]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-black text-[#0A2150] mb-6">رؤيتنا ورسالتنا وقيمنا</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0">
            {/* رؤيتنا */}
            <div className="md:pl-8">
              <div className="flex items-center gap-2 mb-3">
                <Eye className={`w-6 h-6 ${GOLD_TEXT}`} />
                <h3 className="font-black text-[#0A2150]">رؤيتنا</h3>
              </div>
              <p className="text-xs text-slate-600 leading-loose">
                أن تكون المنصة الرقمية الأولى في العالم العربي للتجارة والخدمات المتكاملة،
                ونساهم في دعم الاقتصاد الرقمي وتعزيز فرص النمو للأفراد والشركات.
              </p>
            </div>

            {/* رسالتنا */}
            <div className="md:px-8 md:border-x md:border-slate-300/70">
              <div className="flex items-center gap-2 mb-3">
                <Target className={`w-6 h-6 ${GOLD_TEXT}`} />
                <h3 className="font-black text-[#0A2150]">رسالتنا</h3>
              </div>
              <p className="text-xs text-slate-600 leading-loose">
                توفير منصة موثوقة وسهلة الاستخدام تجمع بين أفضل المنتجات والخدمات، وتربط بين
                العملاء والشركاء والموردين، مع تقديم محتوى مفيد وموثق.
              </p>
            </div>

            {/* قيمنا */}
            <div className="md:pr-8">
              <div className="flex items-center gap-2 mb-3">
                <Gem className={`w-6 h-6 ${GOLD_TEXT}`} />
                <h3 className="font-black text-[#0A2150]">قيمنا</h3>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-600 list-disc pr-4 marker:text-[#0A2150]">
                {VALUES.map((v) => (
                  <li key={v}>{v}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── ماذا نقدم؟ ───────── */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-black text-[#0A2150]">ماذا نقدم؟</h2>
          <p className={`text-sm font-bold mt-1 mb-6 ${GOLD_TEXT}`}>
            منصة متكاملة تلبي احتياجاتك في كل المجالات
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {SERVICES.map(({ icon: Icon, title, desc, cta, href }) => (
              <div
                key={title}
                className="flex flex-col items-center text-center bg-white border border-slate-200 rounded-lg px-3 py-5 shadow-2xs hover:shadow-md transition-shadow"
              >
                <Icon className="w-7 h-7 text-[#0A2150]" strokeWidth={2.2} />
                <h3 className="text-sm font-black text-[#0A2150] mt-3">{title}</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed mt-1.5 flex-1">{desc}</p>
                <Link
                  href={href}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0A2150] hover:text-[#C9972B] mt-4 transition-colors"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>{cta}</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <NavbarAbout />

      
    </main>
  );
}