'use client';

import Autoplay from 'embla-carousel-autoplay';
import { ShoppingBag, Megaphone, Briefcase, ArrowLeft } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { useEffect, useRef, useState } from 'react';

const slides = [
  {
    image: '/img/bannerimg.png',
    alt: 'تمثال حورس الذهبي والأهرامات',
    kicker: 'كل ما تحتاجه في مكان واحد',
    title: 'سوق حورس',
    subtitle: 'منصة تجمع بين التجارة والتسويق والخدمات المهنية',
  },
  {
    image: '/img/bannerimg.png',
    alt: 'خدمات تسويقية',
    kicker: 'حلول تسويقية متكاملة',
    title: 'حملات تصنع الفرق',
    subtitle: 'حملات انتخابية وإعلانية وتسويقية بأعلى جودة',
  },
  {
    image: '/img/bannerimg.png',
    alt: 'استشارات مهنية',
    kicker: 'خبرة تثق فيها',
    title: 'خدمات مهنية',
    subtitle: 'استشارات موثوقة من فريق متخصص',
  },
];

const features = [
  { icon: ShoppingBag, text: 'منتجات متنوعة' },
  { icon: Megaphone, text: 'خدمات تسويقية متكاملة' },
  { icon: Briefcase, text: 'استشارات مهنية موثوقة' },
];

export default function Banner() {
  const plugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on('select', () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  return (
    <section dir="rtl" className="relative w-full overflow-hidden bg-[#0B1325]">
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        opts={{ loop: true, direction: 'rtl' }}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent className="m-0">
          {slides.map((slide, index) => (
            <CarouselItem key={index} className="p-0">
              <div className="relative w-full min-h-85 md:min-h-100 lg:min-h-110 flex items-center">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={slide.image}
                    alt={slide.alt}
                    className="w-full h-full object-cover object-[center_right] md:object-center"
                    referrerPolicy="no-referrer"
                  />
                  {/* الداكن من الشمال عشان الكلام يتقري */}
                  <div className="absolute inset-0 bg-linear-to-r from-[#08101E]/95 via-[#08101E]/75 to-transparent" />
                  <div className="absolute inset-0 bg-[#0B1325]/30" />
                </div>

                {/* Content (شمال الصورة) */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
                  <div className="max-w-2xl text-right ml-0 mr-auto">
                    <div className="mb-2">
                      <span className="text-white text-lg sm:text-xl md:text-2xl font-bold tracking-tight font-['Cairo']">
                        {slide.kicker}
                      </span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 tracking-tight font-['Cairo']">
                      <span
                        className="bg-linear-to-r from-[#F3C053] via-[#E5A93C] to-[#C88A2E] bg-clip-text text-transparent drop-shadow-sm"
                        style={{ textShadow: '0 2px 20px rgba(212, 155, 53, 0.3)' }}
                      >
                        {slide.title}
                      </span>
                    </h1>

                    <p className="text-base sm:text-lg md:text-xl text-slate-100 font-semibold mb-6 leading-relaxed max-w-xl font-['Cairo']">
                      {slide.subtitle}
                    </p>

                    <div className="flex flex-wrap items-center justify-end gap-3 md:gap-4 mb-8 text-xs sm:text-sm text-white font-medium">
                      {features.map((f) => {
                        const Icon = f.icon;
                        return (
                          <div
                            key={f.text}
                            className="flex items-center gap-2 bg-black/40 backdrop-blur-sm border border-white/10 px-3 py-1.5 rounded-lg"
                          >
                            <span className="text-[#D49B35]">
                              <Icon className="w-4 h-4" />
                            </span>
                            <span>{f.text}</span>
                          </div>
                        );
                      })}
                    </div>

                    <div>
                      <a
                        href="/categories"
                        className="inline-flex items-center gap-2.5 px-7 py-3 rounded-lg font-bold text-slate-900 text-sm sm:text-base bg-[#D49B35] hover:bg-[#F3C053] transition-all duration-300 shadow-lg hover:shadow-[#D49B35]/30 hover:scale-[1.02] active:scale-95 cursor-pointer font-['Cairo']"
                      >
                        <ArrowLeft className="w-4 h-4 text-slate-900 stroke-[2.5]" />
                        <span>اكتشف المنصة</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* الأسهم */}
        <CarouselNext className="right-auto left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/40 cursor-pointer text-white border-white/10 backdrop-blur-sm" />
        <CarouselPrevious className="left-auto right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/40 cursor-pointer text-white border-white/10 backdrop-blur-sm" />
      </Carousel>

      {/* Pagination Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => api?.scrollTo(i)}
            aria-label={`شريحة ${i + 1}`}
            className={`transition-all duration-300 rounded-full ${
              current === i
                ? 'w-6 h-2 bg-[#D49B35]'
                : 'w-2 h-2 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </section>
  );
}