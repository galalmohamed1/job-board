import Image from 'next/image';
import Link from 'next/link';

/**
 * الصورة المطلوبة: public/images/about/hero.jpg  (1698 × 410)
 */

const GOLD_TEXT = 'text-[#C9972B]';

export default function HeroAbout() {
  return (
    <section className="relative overflow-hidden mt-2 bg-[#0A2150] min-h-65 md:min-h-80">
      <Image
        src="/img/hero_about-page.png"
        alt="سوق حورس"
        fill
        priority
        // sizes="100vw"
        className="object-contain object-left"
      />
      {/* تدرج يخلي الصورة تدوب في الأزرق ناحية النص */}
      <div className="absolute inset-0 bg-linear-to-l from-[#0A2150] from-40% via-[#0A2150]/75 via-60% to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full min-h-65 md:min-h-80 flex flex-col justify-center py-8">
        <nav className="absolute top-4 right-4 sm:right-6 lg:right-8 text-[15px] text-slate-200 flex items-center gap-2">
          <Link href="/" className="hover:text-white">
            الرئيسية
          </Link>
          <span>/</span>
          <span>من نحن</span>
        </nav>

        <div className="max-w-xl mt-6">
          <h1 className="text-4xl md:text-5xl font-black text-white">
            من <span className={GOLD_TEXT}>نحن</span>
          </h1>
          <span className="block w-10 h-1 rounded-full bg-[#C9972B] mt-1 mr-auto md:mr-0 md:w-12" />

          <h2 className="text-lg md:text-xl font-bold text-white mt-5">
            سوق حورس ... أكثر من مجرد متجر إلكتروني
          </h2>
          <p className="text-xs md:text-sm text-slate-200 leading-relaxed mt-3">
            منصة رقمية متكاملة تجمع بين التجارة والخدمات المهنية والتسويق والعقارات، لتكون
            بوابتك إلى فرص حقيقية وشراكات ناجحة في مكان واحد.
          </p>
        </div>
      </div>
    </section>
  );
}