import Image from "next/image";
import { Camera, Megaphone, PencilLine, ShieldCheck } from "lucide-react";

const services = [
  { icon: ShieldCheck, title: "تحليل الأداء والتقارير", subtitle: "للتحسين مستمر" },
  { icon: PencilLine, title: "تصميم المحتوى الإبداعي", subtitle: "بصورة احترافية" },
  { icon: Megaphone, title: "إطلاق الحملات الإعلانية", subtitle: "لأفضل النتائج" },
  { icon: Camera, title: "إدارة حسابات التواصل", subtitle: "بمحتوى احترافي" },
];

export default function BusinessCtaBanner() {
  return (
    <section className="py-6 font-['Cairo'] -mb-5.5">
      <div className="relative grid items-center gap-6 overflow-hidden bg-[url('/img/backgroundbanner.jpg')] bg-navy-surface bg-center p-4 text-white shadow-xl lg:grid-cols-2 lg:p-5">
        {/* توهجات الخلفية */}
        <div className="pointer-events-none absolute -top-20 right-1/3 h-64 w-64 rounded-full bg-sky-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/4 h-64 w-64 rounded-full bg-blue-500/25 blur-3xl" />

        {/* الخدمات (يمين) */}
        <div className="relative z-10 grid grid-cols-2 gap-y-6 rounded-xl border border-blue-300/15 bg-[#0A2250]/80 px-2 py-6 sm:grid-cols-4">
          {services.map(({ icon: Icon, title, subtitle }) => (
            <div
              key={title}
              className="flex flex-col items-center px-3 text-center sm:border-s sm:border-blue-300/20 sm:first:border-s-0"
            >
              <Icon className="mb-3 h-9 w-9 text-[#E8B44A]" strokeWidth={1.5} />
              <h4 className="mb-1 text-sm font-bold">{title}</h4>
              <p className="text-[11px] text-slate-300">{subtitle}</p>
            </div>
          ))}
        </div>

        {/* النص + الصورة (شمال) */}
        <div className="relative flex min-h-55 items-center before:absolute before:inset-0 before:bg-linear-to-t before:from-[#020817]/1 before:via-[#020817]/35 before:to-transparent before:content-['']">
          <div className="relative z-10 flex flex-col items-start text-right lg:max-w-[62%]">
            <h2 className="mb-2 text-2xl font-bold leading-snug sm:text-3xl">
              شركتك تستحق أن تصل إلى جمهور أكبر
            </h2>
            <p className="mb-5 text-xs leading-relaxed text-slate-200 sm:text-sm">
              نساعدك في تسويق منتجاتك وخدماتك وبناء علامتك التجارية
            </p>
            <a
              href="#contact"
              className="rounded-xl bg-[#F0BE55] px-8 py-3 text-sm font-bold text-slate-900 shadow-md transition hover:bg-[#F7CC6E] active:scale-95"
            >
              طلب تسويق الآن
            </a>
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-[45%] lg:block">
            <Image
              src="/img/business.png"
              alt=""
              fill
              sizes="300px"
              className="object-cover object-left opacity-80 mix-blend-lighten [mask-image:linear-gradient(to_left,transparent,black_45%)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}