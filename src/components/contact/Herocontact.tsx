import Image from 'next/image';

export default function HeroContact() {
  return (
    <section className="relative overflow-hidden bg-[#0A2150] min-h-[200px] md:min-h-[250px]">
      <Image
        src="/img/hero_contact.png"
        alt="تواصل معنا"
        fill
        priority
        sizes="100vw"
        className="object-cover object-left"
      />
      <div className="absolute inset-0 bg-linear-to-l from-[#0A2150] from-35% via-[#0A2150]/75 via-55% to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[200px] md:min-h-[250px] flex items-center py-8">
        <div className="max-w-md">
          <h1 className="text-3xl md:text-4xl font-black text-white">تواصل معنا</h1>
          <h2 className="text-base md:text-lg font-black text-[#E0A82E] mt-2">
            نحن دائماً في خدمتك
          </h2>
          <p className="text-xs md:text-sm text-slate-200 leading-loose mt-3">
            سواء كان لديك استفسار، أو تحتاج إلى مساعدة، أو ترغب في الانضمام إلى منصة سوق
            حورس، نحن هنا لنستمع إليك ونساعدك.
          </p>
        </div>
      </div>
    </section>
  );
}