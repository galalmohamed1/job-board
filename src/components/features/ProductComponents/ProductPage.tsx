'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import ProductCard from './productCart';
import BannerProduct from './bannerProduct';
import { useShop } from '@/context/ShopContext';
import { getDetailsSubCategories, getSubCategories } from '@/app/api/services/category.services';
import {
  ShoppingBag,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  RotateCcw,
  Home,
  ChevronRight as ChevronRightBreadcrumb,
  ChevronDown,
  ImageIcon,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-toastify';

/* ─── Mock Data ─────────────────────────────────────────────────── */
const SORT_OPTIONS = [
  { value: 'best-seller', label: 'الأكثر مبيعاً' },
  { value: 'newest', label: 'الأحدث' },
  { value: 'price-asc', label: 'السعر: الأقل أولاً' },
  { value: 'price-desc', label: 'السعر: الأعلى أولاً' },
  { value: 'rating', label: 'الأعلى تقييماً' },
];
const ITEMS_PER_PAGE = 8;

/* ─── Stars helper ───────────────────────────────────────────────── */
function StarRow({ rating }: { rating: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={`w-3.5 h-3.5 ${i <= rating ? 'text-amber-400' : 'text-slate-300'}`}
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

/* ─── Filter Content Component ───────────────────────────────────── */
interface FilterBodyProps {
  categories: string[];
  brands: string[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  selectedBrands: string[];
  toggleBrand: (brand: string) => void;
  minRating: number;
  setMinRating: (r: number) => void;
  resetFilters: () => void;
  setCurrentPage: (p: number) => void;
  onApply?: () => void;
  filteredCount?: number;
}

function FilterBody({
  categories,
  brands,
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
  selectedBrands,
  toggleBrand,
  minRating,
  setMinRating,
  resetFilters,
  setCurrentPage,
  onApply,
  filteredCount,
}: FilterBodyProps) {

  return (
    <div>
      {/* Categories */}
      <div className="mb-5">
        <h3 className="font-bold text-primary text-sm mb-3">الأقسام</h3>
        <ul className="space-y-2.5">
          {categories.map((cat) => (
            <li key={cat}>
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="radio"
                  name="category-input"
                  checked={selectedCategory === cat}
                  onChange={() => {
                    setSelectedCategory(cat);
                    setCurrentPage(1);
                  }}
                  className="accent-[#D49B35] w-4 h-4 cursor-pointer"
                />
                <span
                  className={`text-sm transition-colors ${
                    selectedCategory === cat
                      ? 'text-[#D49B35] font-bold'
                      : 'text-slate-600 group-hover:text-primary'
                  }`}
                >
                  {cat}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Range */}
      <div className="mb-5 pt-4 border-t border-slate-100">
        <h3 className="font-bold text-primary text-sm mb-3">السعر</h3>
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
          <span>من {priceRange[0]} ج.م</span>
          <span>إلى {priceRange[1]} ج.م</span>
        </div>
        <input
          type="range"
          min={50}
          max={5000}
          step={50}
          value={priceRange[1]}
          onChange={(e) => {
            setPriceRange([priceRange[0], Number(e.target.value)]);
            setCurrentPage(1);
          }}
          className="w-full accent-[#D49B35] cursor-pointer"
        />
      </div>

      {/* Brand / Subcategories */}
      {brands.length > 0 && (
        <div className="mb-5 pt-4 border-t border-slate-100">
          <h3 className="font-bold text-primary text-sm mb-3">الأقسام الفرعية</h3>
          <ul className="space-y-2.5 max-h-56 overflow-y-auto pl-1">
            {brands.map((brand) => (
              <li key={brand}>
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => {
                      toggleBrand(brand);
                      setCurrentPage(1);
                    }}
                    className="accent-[#D49B35] w-4 h-4 rounded cursor-pointer"
                  />
                  <span className="text-sm text-slate-600 group-hover:text-primary transition-colors">
                    {brand}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Rating */}
      <div className="mb-5 pt-4 border-t border-slate-100">
        <h3 className="font-bold text-primary text-sm mb-3">التقييم</h3>
        <ul className="space-y-2">
          {[
            { stars: 5, label: 'نجوم' },
            { stars: 4, label: 'نجوم فأكثر' },
            { stars: 3, label: 'نجوم فأكثر' },
            { stars: 0, label: 'أو أقل' },
          ].map(({ stars, label }) => (
            <li key={stars}>
              <button
                type="button"
                onClick={() => {
                  setMinRating(stars);
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-2 w-full text-right py-0.5 transition-opacity cursor-pointer ${
                  minRating === stars ? 'opacity-100' : 'opacity-55 hover:opacity-80'
                }`}
              >
                <StarRow rating={stars === 0 ? 1 : stars} />
                <span className="text-xs text-slate-500">{label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
        <button
          type="button"
          onClick={resetFilters}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:border-[#D49B35] hover:text-[#D49B35] transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          إعادة تعيين الفلاتر
        </button>

        {onApply && (
          <button
            type="button"
            onClick={onApply}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#F25822] hover:bg-[#d94a18] text-white text-sm font-bold shadow-xs transition-colors cursor-pointer"
          >
            تطبيق الفلتر {filteredCount !== undefined ? `(${filteredCount} منتج)` : ''}
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────── */
export default function ProductPage() {
  const { products, addToCart } = useShop();
  const [categories, setCategories] = useState<string[]>(['جميع الأقسام']);
  const [brands, setBrands] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('جميع الأقسام');
  const [priceRange, setPriceRange] = useState<[number, number]>([50, 5000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('best-seller');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    async function loadFilters() {
      try {
        const [catsData, subsData] = await Promise.all([
          getSubCategories(),
          getDetailsSubCategories(),
        ]);

        if (catsData && Array.isArray(catsData)) {
          const catTitles = catsData
            .map((c) => c.name)
            .filter((t): t is string => Boolean(t && t.trim()));
          setCategories(['جميع الأقسام', ...Array.from(new Set(catTitles))]);
        }

        if (subsData && Array.isArray(subsData)) {
          const subNames = subsData
            .map((s) => s.name)
            .filter((n): n is string => Boolean(n && n.trim()));
          setBrands(Array.from(new Set(subNames)));
        }
      } catch (err) {
        console.error('Failed to load categories/subcategories:', err);
      }
    }

    loadFilters();
  }, []);

  const productList = Array.isArray(products) ? products : [];
  const API_ORIGIN = process.env.NEXT_PUBLIC_API_ORIGIN ?? '';
  const imgSrc = (url?: string) => !url ? '' : url.startsWith('http') || url.startsWith('data:') ? url : `${API_ORIGIN}${url}`;

  /* ── Filter & Sort ── */
  const getProductFinalPrice = (p: Product) =>
    p.discountPrice != null && p.discountPrice > 0 && p.discountPrice < p.price
      ? p.discountPrice
      : p.price;

  const filtered = productList
    .filter((p) =>
      selectedCategory === 'جميع الأقسام' || p.category?.title === selectedCategory
    )
    .filter((p) => {
      if (selectedBrands.length === 0) return true;
      if (Array.isArray(p.subcategory)) {
        return p.subcategory.some((sub: any) =>
          selectedBrands.includes(typeof sub === 'string' ? sub : sub?.name)
        );
      }
      if (p.subcategory && typeof p.subcategory === 'object') {
        const subName = (p.subcategory as any).name;
        return selectedBrands.includes(subName);
      }
      return false;
    })
    .filter((p) => {
      const fp = getProductFinalPrice(p);
      return fp >= priceRange[0] && fp <= priceRange[1];
    })
    .filter((p) => (p.averageRating ?? 0) >= minRating)
    .sort((a, b) => {
      if (sortBy === 'price-asc') return getProductFinalPrice(a) - getProductFinalPrice(b);
      if (sortBy === 'price-desc') return getProductFinalPrice(b) - getProductFinalPrice(a);
      if (sortBy === 'rating') return (b.averageRating ?? 0) - (a.averageRating ?? 0);
      if (sortBy === 'newest') return (b._id ?? '').localeCompare(a._id ?? '');
      return (b.numReviews ?? 0) - (a.numReviews ?? 0);
    });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const activeFiltersCount =
    (selectedCategory !== 'جميع الأقسام' ? 1 : 0) +
    (priceRange[0] !== 50 || priceRange[1] !== 5000 ? 1 : 0) +
    selectedBrands.length +
    (minRating > 0 ? 1 : 0);

  const toggleBrand = (brand: string) =>
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );

  const resetFilters = () => {
    setSelectedCategory('جميع الأقسام');
    setPriceRange([50, 5000]);
    setSelectedBrands([]);
    setMinRating(0);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-['Cairo'] text-right">
      <div className="max-w-7xl mx-auto mt-3 px-4 sm:px-6 lg:px-8 bg-white">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-base sm:text-lg text-slate-500 py-3" aria-label="breadcrumb">
          <Link href="/" className="flex items-center gap-1 hover:text-[#D49B35] transition-colors">
            <Home className="w-4 h-4" />
            <span>الرئيسية</span>
          </Link>
          <ChevronRightBreadcrumb className="w-3.5 h-3.5 text-slate-400 rotate-180" />
          <span className="text-primary font-bold">المنتجات</span>
        </nav>
      </div>

      {/* ── Hero Banner ── */}
      <BannerProduct />

      {/* ── Main Layout ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6 items-start">
          {/* ════════════ Products Area ════════════ */}
          <div className="flex-1 min-w-0">
            {/* ── Mobile Toolbar (Row 1 from design) ── */}
            <div className="lg:hidden flex items-center justify-between gap-2.5 mb-3 bg-white rounded-xl border border-slate-200 px-3 py-2.5 shadow-xs">
              {/* View Mode Switcher (Left) */}
              <div className="flex items-center rounded-xl border border-slate-200 bg-white p-0.5">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    viewMode === 'grid'
                      ? 'border border-[#17223E]/20 bg-slate-100 text-[#17223E]'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                  aria-label="عرض شبكي"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    viewMode === 'list'
                      ? 'border border-[#17223E]/20 bg-slate-100 text-[#17223E]'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                  aria-label="عرض قائمة"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Sort Dropdown (Center) */}
              <div className="relative flex-1 max-w-[200px]">
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-1.5 pr-7 pl-6 text-xs font-bold text-primary focus:outline-none focus:border-[#D49B35] cursor-pointer text-center"
                  style={{ direction: 'rtl' }}
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      الترتيب حسب: {o.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              </div>

              {/* Filter Button (Right) */}
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen((v) => !v)}
                className={`relative p-2 rounded-xl border transition-colors cursor-pointer flex items-center justify-center ${
                  isMobileFilterOpen || activeFiltersCount > 0
                    ? 'border-[#D49B35] bg-[#D49B35]/10 text-[#D49B35]'
                    : 'border-slate-200 bg-white text-primary hover:border-[#D49B35]'
                }`}
                aria-label="تصفية النتائج"
              >
                <SlidersHorizontal className="w-4 h-4" />
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#F25822] text-white text-[10px] font-bold flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>

            {/* ── Mobile Filter Toggle Bar (Row 2 from design) ── */}
            <div className="lg:hidden mb-5">
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen((v) => !v)}
                className="w-full flex items-center justify-between bg-white rounded-xl border border-slate-200 px-4 py-3 shadow-xs hover:border-[#D49B35] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#D49B35]" />
                  <span className="font-black text-primary text-sm sm:text-base">تصفية النتائج</span>
                  {activeFiltersCount > 0 && (
                    <span className="bg-[#D49B35] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {activeFiltersCount} مفعل
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <span className="text-xs font-semibold">{isMobileFilterOpen ? 'إخفاء' : 'عرض الفلاتر'}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isMobileFilterOpen ? 'rotate-180 text-[#D49B35]' : ''
                    }`}
                  />
                </div>
              </button>

              {/* Collapsible Filter Body */}
              {isMobileFilterOpen && (
                <div className="mt-3 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                  <FilterBody
                    categories={categories}
                    brands={brands}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    selectedBrands={selectedBrands}
                    toggleBrand={toggleBrand}
                    minRating={minRating}
                    setMinRating={setMinRating}
                    resetFilters={resetFilters}
                    setCurrentPage={setCurrentPage}
                    onApply={() => setIsMobileFilterOpen(false)}
                    filteredCount={filtered.length}
                  />
                </div>
              )}
            </div>

            {/* ── Desktop Toolbar ── */}
            <div className="hidden lg:flex items-center justify-between mb-5 bg-white rounded-xl border border-slate-200 px-4 py-3 shadow-sm">
              <span className="text-sm text-slate-500">
                عرض{' '}
                <span className="font-bold text-primary">
                  {paginated.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0} - {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}
                </span>{' '}
                من{' '}
                <span className="font-bold text-primary">{filtered.length}</span>{' '}
                منتج
              </span>

              <div className="flex items-center gap-3 mr-auto">
                {/* Sort */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500">ترتيب حسب</span>
                  <select
                    id="sort-select"
                    value={sortBy}
                    onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                    className="text-sm font-semibold text-primary border border-slate-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:border-[#D49B35] cursor-pointer"
                    style={{ direction: 'rtl' }}
                  >
                    {SORT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>

                {/* View toggle */}
                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                  <button
                    type="button"
                    id="view-grid-btn"
                    onClick={() => setViewMode('grid')}
                    className={`p-2 transition-colors cursor-pointer ${
                      viewMode === 'grid'
                        ? 'bg-[#17223E] text-white'
                        : 'bg-white text-slate-500 hover:bg-slate-50'
                    }`}
                    aria-label="عرض شبكي"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    id="view-list-btn"
                    onClick={() => setViewMode('list')}
                    className={`p-2 transition-colors cursor-pointer ${
                      viewMode === 'list'
                        ? 'bg-[#17223E] text-white'
                        : 'bg-white text-slate-500 hover:bg-slate-50'
                    }`}
                    aria-label="عرض قائمة"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Empty state */}
            {paginated.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-slate-400">
                <ShoppingBag className="w-16 h-16 mb-4 opacity-30" />
                <p className="text-lg font-bold">لا توجد منتجات تطابق الفلاتر</p>
                <button
                  onClick={resetFilters}
                  className="mt-4 text-[#D49B35] font-bold hover:underline cursor-pointer"
                >
                  إعادة تعيين الفلاتر
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              /* Grid View */
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {paginated.map((product) => (
                  <div key={product._id} className="flex justify-center">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              /* List View */
              <div className="flex flex-col gap-3">
                {paginated.map((product) => {
                  const hasDiscount =
                    product.discountPrice != null &&
                    product.discountPrice > 0 &&
                    product.discountPrice < product.price;
                  const fp = hasDiscount ? product.discountPrice : product.price;

                  return (
                    <div
                      key={product._id}
                      className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <Link
                        href={`/product/${product._id}`}
                        className="flex items-center gap-4 flex-1 min-w-0 group"
                      >
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                          {product.images?.[0]?.secure_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={imgSrc(product.images[0].secure_url)} alt={product.title} className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon className="w-4 h-4 text-slate-400" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-primary text-sm mb-1 truncate group-hover:text-[#D49B35] transition-colors">
                            {product.title}
                          </h3>
                          <div className="flex items-center gap-1.5 mb-1">
                            <StarRow rating={product.averageRating ?? 0} />
                            <span className="text-xs text-slate-400">({product.numReviews ?? 0})</span>
                          </div>
                          <div className="flex items-baseline gap-2">
                            <span className="font-extrabold text-primary">
                              {fp} <small className="text-xs text-[#D49B35]">ج.م</small>
                            </span>
                            {hasDiscount && (
                              <del className="text-xs text-slate-400">{product.price} ج.م</del>
                            )}
                          </div>
                        </div>
                      </Link>

                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            const ok = await addToCart(product._id, 1);
                            if (ok) {
                              toast.success(`تمت إضافة "${product.title.slice(0, 24)}" إلى السلة بنجاح`);
                            } else {
                              toast.info("يرجى تسجيل الدخول أولاً لإضافة المنتج إلى السلة");
                            }
                          } catch {
                            toast.error("حدث خطأ أثناء إضافة المنتج إلى السلة");
                          }
                        }}
                        className="shrink-0 flex items-center gap-1.5 bg-[#BA874E] hover:bg-[#ba874eda] text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        أضف إلى السلة
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-1.5 mt-8" dir="ltr">
                {/* Prev */}
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 hover:border-[#D49B35] hover:text-[#D49B35] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Pages */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-bold transition-colors ${
                      currentPage === page
                        ? 'bg-[#17223E] text-white border border-[#17223E]'
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-[#D49B35] hover:text-[#D49B35]'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                {/* Next */}
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 hover:border-[#D49B35] hover:text-[#D49B35] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* ════════════ Sidebar (Desktop Only) ════════════ */}
          <aside className="hidden lg:flex flex-col gap-5 w-64 shrink-0 sticky top-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              {/* Header */}
              <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-100">
                <SlidersHorizontal className="w-4 h-4 text-[#D49B35]" />
                <h2 className="font-black text-primary text-base">تصفية النتائج</h2>
              </div>

              <FilterBody
                categories={categories}
                brands={brands}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                selectedBrands={selectedBrands}
                toggleBrand={toggleBrand}
                minRating={minRating}
                setMinRating={setMinRating}
                resetFilters={resetFilters}
                setCurrentPage={setCurrentPage}
              />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}