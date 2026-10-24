import { Product } from "@/types/product";
import ProductCard from "../features/ProductComponents/productCart"
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

const products: Product[] = [
  {
    _id: "1", title: "سماعات رأس لاسلكية", slug: "p1", discription: "وصف تجريبي للمنتج",
    price: 3000, discountPrice: 2550,
    image:[{public_id: "p1", secure_url:"/img/law.png"}],
    category: { _id: "cat1", name: "إلكترونيات", slug: "electronics" },
    subcategory: { _id: "sub1", name: "سماعات", slug: "headphones" },
    averageRating: 4, numReviews: 124, sizes: [], colors: ["black"],
    isFeatured: false, isActive: true, isDeleted: false,
    createdAt: "2026-10-01T10:00:00.000Z", updatedAt: "2026-10-01T10:00:00.000Z",
    stock: 15, __v: 0,
  },
  {
    _id: "2", title: "ساعة ذكية رياضية", slug: "p2", discription: "وصف تجريبي للمنتج",
    price: 1800,
    image: [{ public_id: "p2", secure_url: "https://placehold.co/400x400/png?text=P2" }],
    category: { _id: "cat1", name: "إلكترونيات", slug: "electronics" },
    subcategory: { _id: "sub2", name: "ساعات", slug: "watches" },
    averageRating: 5, numReviews: 58, sizes: [], colors: ["black"],
    isFeatured: false, isActive: true, isDeleted: false,
    createdAt: "2026-10-01T10:00:00.000Z", updatedAt: "2026-10-01T10:00:00.000Z",
    stock: 30, __v: 0,
  },
  {
    _id: "3", title: "سماعة بلوتوث صغيرة", slug: "p3", discription: "وصف تجريبي للمنتج",
    price: 900, discountPrice: 720,
    image: [{ public_id: "p3", secure_url: "https://placehold.co/400x400/png?text=P3" }],
    category: { _id: "cat1", name: "إلكترونيات", slug: "electronics" },
    subcategory: { _id: "sub1", name: "سماعات", slug: "headphones" },
    averageRating: 3, numReviews: 12, sizes: [], colors: ["white"],
    isFeatured: false, isActive: true, isDeleted: false,
    createdAt: "2026-10-01T10:00:00.000Z", updatedAt: "2026-10-01T10:00:00.000Z",
    stock: 8, __v: 0,
  },
  {
    _id: "4", title: "سبيكر محمول مقاوم للماء", slug: "p4", discription: "وصف تجريبي للمنتج",
    price: 1500, discountPrice: 1200,
    image: [{ public_id: "p4", secure_url: "https://placehold.co/400x400/png?text=P4" }],
    category: { _id: "cat1", name: "إلكترونيات", slug: "electronics" },
    subcategory: { _id: "sub3", name: "سبيكرات", slug: "speakers" },
    averageRating: 0, numReviews: 0, sizes: [], colors: ["blue"],
    isFeatured: false, isActive: true, isDeleted: false,
    createdAt: "2026-10-01T10:00:00.000Z", updatedAt: "2026-10-01T10:00:00.000Z",
    stock: 0, __v: 0,
  },
  {
    _id: "5", title: "كيبورد ميكانيكي RGB", slug: "p5", discription: "وصف تجريبي للمنتج",
    price: 1200, discountPrice: 960,
    image: [{ public_id: "p5", secure_url: "https://placehold.co/400x400/png?text=P5" }],
    category: { _id: "cat2", name: "إكسسوارات الكمبيوتر", slug: "pc-accessories" },
    subcategory: { _id: "sub4", name: "كيبورد", slug: "keyboards" },
    averageRating: 4, numReviews: 87, sizes: [], colors: ["black"],
    isFeatured: false, isActive: true, isDeleted: false,
    createdAt: "2026-10-01T10:00:00.000Z", updatedAt: "2026-10-01T10:00:00.000Z",
    stock: 22, __v: 0,
  },
  {
    _id: "6", title: "ماوس جيمنج لاسلكي", slug: "p6", discription: "وصف تجريبي للمنتج",
    price: 650,
    image: [{ public_id: "p6", secure_url: "https://placehold.co/400x400/png?text=P6" }],
    category: { _id: "cat2", name: "إكسسوارات الكمبيوتر", slug: "pc-accessories" },
    subcategory: { _id: "sub5", name: "ماوس", slug: "mouse" },
    averageRating: 4, numReviews: 41, sizes: [], colors: ["black"],
    isFeatured: false, isActive: true, isDeleted: false,
    createdAt: "2026-10-01T10:00:00.000Z", updatedAt: "2026-10-01T10:00:00.000Z",
    stock: 40, __v: 0,
  },
  {
    _id: "7", title: "شاحن سريع 65 واط", slug: "p7", discription: "وصف تجريبي للمنتج",
    price: 450, discountPrice: 360,
    image: [{ public_id: "p7", secure_url: "https://placehold.co/400x400/png?text=P7" }],
    category: { _id: "cat3", name: "إكسسوارات الموبايل", slug: "mobile-accessories" },
    subcategory: { _id: "sub6", name: "شواحن", slug: "chargers" },
    averageRating: 5, numReviews: 203, sizes: [], colors: ["white"],
    isFeatured: false, isActive: true, isDeleted: false,
    createdAt: "2026-10-01T10:00:00.000Z", updatedAt: "2026-10-01T10:00:00.000Z",
    stock: 60, __v: 0,
  },
  {
    _id: "8", title: "باور بانك 20000 مللي أمبير", slug: "p8", discription: "وصف تجريبي للمنتج",
    price: 800, discountPrice: 680,
    image: [{ public_id: "p8", secure_url: "https://placehold.co/400x400/png?text=P8" }],
    category: { _id: "cat3", name: "إكسسوارات الموبايل", slug: "mobile-accessories" },
    subcategory: { _id: "sub7", name: "باور بانك", slug: "power-banks" },
    averageRating: 3, numReviews: 35, sizes: [], colors: ["black"],
    isFeatured: false, isActive: true, isDeleted: false,
    createdAt: "2026-10-01T10:00:00.000Z", updatedAt: "2026-10-01T10:00:00.000Z",
    stock: 18, __v: 0,
  },
  {
    _id: "9", title: "كاميرا مراقبة واي فاي", slug: "p9", discription: "وصف تجريبي للمنتج",
    price: 2200, discountPrice: 1760,
    image: [{ public_id: "p9", secure_url: "https://placehold.co/400x400/png?text=P9" }],
    category: { _id: "cat1", name: "إلكترونيات", slug: "electronics" },
    subcategory: { _id: "sub8", name: "كاميرات", slug: "cameras" },
    averageRating: 4, numReviews: 66, sizes: [], colors: ["white"],
    isFeatured: false, isActive: true, isDeleted: false,
    createdAt: "2026-10-01T10:00:00.000Z", updatedAt: "2026-10-01T10:00:00.000Z",
    stock: 12, __v: 0,
  },
  {
    _id: "10", title: "ستاند لابتوب ألمنيوم", slug: "p10", discription: "وصف تجريبي للمنتج",
    price: 500,
    image: [{ public_id: "p10", secure_url: "https://placehold.co/400x400/png?text=P10" }],
    category: { _id: "cat2", name: "إكسسوارات الكمبيوتر", slug: "pc-accessories" },
    subcategory: { _id: "sub9", name: "ستاند", slug: "stands" },
    averageRating: 2, numReviews: 9, sizes: [], colors: ["silver"],
    isFeatured: false, isActive: true, isDeleted: false,
    createdAt: "2026-10-01T10:00:00.000Z", updatedAt: "2026-10-01T10:00:00.000Z",
    stock: 25, __v: 0,
  },
];
function ProductSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      // scroll exactly one card width + gap (16px)
      const card = scrollRef.current.firstElementChild as HTMLElement | null;
      const cardWidth = card ? card.offsetWidth + 16 : 280;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -cardWidth : cardWidth,
        behavior: 'smooth',
      });
    }
  };
  
  return (
    <section className="py-12 bg-white font-['Cairo'] relative">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
            {/*Section Header*/}
            <div className="flex items-center justify-between mb-7">
                {/* Section Title */}
                <h2 className="text-xl sm:text-2xl font-black text-[#0B1325] tracking-tight font-['Cairo']">
                    منتجات مميزه
                </h2>
                {/* View All Link */}
                <Link
                    href="#all-products"
                    className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-500 hover:text-[#D49B35] transition-colors"
                >
                    <span>عرض الكل</span>
                    <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
                </Link>
            </div>
            {/* Carousel Container with Arrows */}
            <div className="relative">
            {/* Left Arrow */}
            <button
                type="button"
                onClick={() => scroll('left')}
                aria-label="السابق"
                className="absolute -left-3 md:-left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white shadow-md border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-50 hover:text-[#D49B35] transition-colors cursor-pointer"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Right Arrow */}
            <button
                type="button"
                onClick={() => scroll('right')}
                aria-label="التالي"
                className="absolute -right-3 md:-right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white shadow-md border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-50 hover:text-[#D49B35] transition-colors cursor-pointer"
            >
                <ChevronRight className="w-5 h-5" />
            </button>

            {/* 5 Product Cards Carousel */}
            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto pb-4 scrollbar-none scroll-smooth"
              style={{ scrollSnapType: 'x mandatory' }}
            >
              {products.map((p) => (
                <div
                  key={p._id}
                  className="flex-none"
                  style={{
                    width: 'calc((100% - 64px) / 5)',
                    minWidth: '200px',
                    scrollSnapAlign: 'start',
                  }}
                >
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
            </div>
          </div>
          
    
    </section>
  )
}

export default ProductSection