import Image from 'next/image';
import Link from 'next/link';
import { UserPlus } from 'lucide-react';


export default function HeroJoin() {
  return (
    <section className="relative overflow-hidden bg-[#0A2150] min-h-[240px] md:min-h-[300px]">
      <Image
        src="/img/hero_joinpage.png"
        alt="انضم إلى سوق حورس"
        fill
        priority
        sizes="100vw"
        className="object-contain object-left"
      />
      {/* تدرج يخلي الصورة تدوب في الأزرق ناحية النص */}
      <div className="absolute inset-0 bg-gradient-to-l from-[#0A2150] from-35% via-[#0A2150]/80 via-55% to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[240px] md:min-h-[300px] flex items-center py-8">
        <div className="max-w-lg">
          <h1 className="text-4xl md:text-5xl font-black text-white">انضم إلينا</h1>
          <h2 className="text-base md:text-lg font-black text-[#E0A82E] mt-3 leading-relaxed">
            كن جزءًا من أكبر منصة تجارية وخدمية في مصر
          </h2>
          <p className="text-xs md:text-sm text-slate-200 leading-loose mt-3">
            سواء كنت تاجرًا، موردًا، مقدم خدمة، أو شريكًا استراتيجيًا ..
            <br />
            سوق حورس يفتح أمامك آفاقًا جديدة للنمو والتوسع.
          </p>
          <Link
            href="#join-form"
            className="inline-flex items-center justify-center gap-2 mt-5 px-9 py-2.5 rounded-md bg-[#C9972B] hover:bg-[#b5851f] text-white text-xs font-bold transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>سجل الآن</span>
          </Link>
        </div>
      </div>
    </section>
  );
}