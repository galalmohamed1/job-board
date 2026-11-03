import Image from 'next/image';
import { ArrowLeft, Gavel, ShieldCheck, Users } from 'lucide-react';
import Link from 'next/link';

/**
 * الصورة المطلوبة: public/images/about/stats-bg.jpg  (1698 × 224)
 */
const GOLD_TEXT = 'text-[#C9972B]';

const STATS = [
  { icon: ShieldCheck, value: '98%', label: 'معدل رضا العملاء' },
  { icon: Users, value: '1200+', label: 'عميل موثوق' },
  { icon: Gavel, value: '500+', label: 'قضية وخدمة منفذة' },
  { icon: ShieldCheck, value: '25+', label: 'عام من الخبرة' },
];

export default function NavbarAbout() {
    return (
      <>
        <section className="relative overflow-hidden bg-[#0A2150]">
        <Image
            src="/img/navbar_about-page1.png"
            alt=""
            fill
            sizes="100vw"
            className="object-scale-down object-left"
        />
        <div className="absolute inset-0 bg-linear-to-l from-[#0A2150] from-45% via-[#0A2150]/80 via-65% to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-lg md:text-xl font-black text-white mb-6">أرقام تعكس ثقتكم بنا</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 md:gap-0 md:w-[68%]">
            {STATS.map(({ icon: Icon, value, label }, i) => (
                <div
                key={label}
                className={`flex flex-col items-start md:items-center px-4 ${
                    i !== STATS.length - 1 ? 'md:border-l md:border-white/20' : ''
                }`}
                >
                <div className="flex items-center gap-2 text-[#F3C053]">
                    <Icon className="w-6 h-6" />
                    <span className="text-2xl md:text-3xl font-black text-[#F3C053]">{value}</span>
                </div>
                <span className="text-xs text-slate-200 mt-1">{label}</span>
                </div>
            ))}
            </div>
        </div>
        </section>
        {/* ───────── لماذا سوق حورس؟ + انضم ───────── */}
        <section className="py-8 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-[#FBF8F2] shadow-2xs">
                <Image
                src="/img/navbar_about-page2.png"
                alt=""
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-contain object-left opacity-90"
                />
                <div className="absolute inset-0 bg-linear-to-l from-[#FBF8F2] from-50% via-[#FBF8F2]/90 via-65% to-transparent" />

                <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-6 md:p-8">
                {/* انضم إلى المجتمع (يمين) */}
                <div className="md:col-span-4 border-e-2 border-slate-300">
                    <h3 className={`text-sm font-black ${GOLD_TEXT}`}>انضم إلى مجتمع سوق حورس الآن</h3>
                    <p className="text-[11px] text-slate-500 mt-1">كن جزءًا من منصة تحفظك بالفرص</p>
                    <Link
                    href="/register"
                    className="inline-flex items-center justify-center gap-2 mt-4 px-8 py-2.5 rounded-md bg-[#C9972B] hover:bg-[#b5851f] text-white text-xs font-bold transition-colors"
                    >
                    <span>سجل الآن</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                    </Link>
                </div>

                {/* لماذا سوق حورس؟ (وسط) */}
                <div className="md:col-span-5 ">
                    <h3 className="text-xl font-black text-[#0A2150]">لماذا سوق حورس؟</h3>
                    <p className="text-[15px] md:text-xs text-slate-600 leading-loose mt-2">
                    لأننا نؤمن بأن المستقبل يبدأ من فرصة، وأن النجاح لا يتحقق إلا بالشراكات
                    الحقيقية. لذلك صممنا سوق حورس ليكون أكثر من مجرد منصة... بل مجتمع متكامل يجمع
                    بين الأشخاص والأعمال والأفكار.
                    </p>
                </div>

                <div className="hidden md:block md:col-span-3" />
                </div>
            </div>
            </div>
        </section>
    </>
  );
}