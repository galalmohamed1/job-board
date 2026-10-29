'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Heart,
  ShoppingCart,
  Trash2,
  ArrowLeft,
  Share2,
  Star,
  ShoppingBag,
  LayoutGrid,
  List as ListIcon,
  Sparkles,
  Home,
  ChevronRight,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { Product } from '@/types/product';
import { useShop } from '@/context/ShopContext';
import { toast } from 'react-toastify';

/* ─── Mock Fallback Products for Demo/Testing ───────────────────── */
const INITIAL_DEMO_PRODUCTS: Product[] = [
  {
    _id: 'w1',
    title: 'سماعات رأس لاسلكية احترافية مع خاصية عزل الضوضاء',
    slug: 'wireless-noise-cancelling-headphones',
    discription: 'صوت محيطي نقي، بطارية تدوم حتى 40 ساعة، مريحة للأذن طوال اليوم.',
    price: 3200,
    discountPrice: 2650,
    image: [
      {
        public_id: 'p1',
        secure_url: 'https://placehold.co/400x400/1e293b/ffffff?text=Headphones',
      },
    ],
    category: { _id: 'c1', name: 'إلكترونيات', slug: 'electronics' },
    subcategory: { _id: 's1', name: 'سماعات', slug: 'headphones' },
    averageRating: 4.8,
    numReviews: 124,
    sizes: [],
    colors: ['black', 'silver'],
    isFeatured: true,
    isActive: true,
    isDeleted: false,
    createdAt: '',
    updatedAt: '',
    stock: 18,
    __v: 0,
  },
  {
    _id: 'w2',
    title: 'ساعة ذكية رياضية سامسونج - مقاومة للماء مع تتبع الصحة',
    slug: 'samsung-smart-watch-waterproof',
    discription: 'شاشة AMOLED، حساس لقياس نبضات القلب، وبطارية ذكية تدوم أياماً.',
    price: 3400,
    discountPrice: 2950,
    image: [
      {
        public_id: 'p2',
        secure_url: 'https://placehold.co/400x400/1e293b/ffffff?text=SmartWatch',
      },
    ],
    category: { _id: 'c1', name: 'إلكترونيات', slug: 'electronics' },
    subcategory: { _id: 's2', name: 'ساعات ذكية', slug: 'watches' },
    averageRating: 4.9,
    numReviews: 98,
    sizes: [],
    colors: ['black'],
    isFeatured: true,
    isActive: true,
    isDeleted: false,
    createdAt: '',
    updatedAt: '',
    stock: 24,
    __v: 0,
  },
  {
    _id: 'w3',
    title: 'حقيبة ظهر عصرية متعددة الجيوب ومقاومة للماء للعمل والسفر',
    slug: 'waterproof-travel-backpack',
    discription: 'سعة 25 لتر، مخرج USB للشحن، وحزام تثبيت على حقائب السفر.',
    price: 850,
    image: [
      {
        public_id: 'p3',
        secure_url: 'https://placehold.co/400x400/1e293b/ffffff?text=Backpack',
      },
    ],
    category: { _id: 'c2', name: 'ملابس وأزياء', slug: 'fashion' },
    subcategory: { _id: 's3', name: 'حقائب', slug: 'bags' },
    averageRating: 4.6,
    numReviews: 76,
    sizes: [],
    colors: ['grey', 'black'],
    isFeatured: false,
    isActive: true,
    isDeleted: false,
    createdAt: '',
    updatedAt: '',
    stock: 5,
    __v: 0,
  },
  {
    _id: 'w4',
    title: 'شاشة ألعاب 24 بوصة IPS بدقة FHD ومعدل تحديث 144Hz',
    slug: 'gaming-monitor-24-inch',
    discription: 'زمن استجابة 1ms، ألوان زاهية، تدعم FreeSync و G-Sync.',
    price: 3800,
    discountPrice: 3200,
    image: [
      {
        public_id: 'p4',
        secure_url: 'https://placehold.co/400x400/1e293b/ffffff?text=Monitor',
      },
    ],
    category: { _id: 'c1', name: 'إلكترونيات', slug: 'electronics' },
    subcategory: { _id: 's5', name: 'شاشات', slug: 'monitors' },
    averageRating: 4.7,
    numReviews: 54,
    sizes: [],
    colors: ['black'],
    isFeatured: false,
    isActive: true,
    isDeleted: false,
    createdAt: '',
    updatedAt: '',
    stock: 0,
    __v: 0,
  },
];

export default function WishlistPage() {
  const {
    wishlist,
    toggleWishlist,
    addToCart,
    products,
    isWishlistLoading,
  } = useShop();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'rating'>('default');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [demoActive, setDemoActive] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);

  // Map wishlist IDs to product items
  const allAvailableProducts = useMemo(() => {
    return [...products, ...INITIAL_DEMO_PRODUCTS];
  }, [products]);

  const items: Product[] = useMemo(() => {
    if (demoActive) return INITIAL_DEMO_PRODUCTS;
    if (wishlist.length === 0) return [];
    
    // Find matching products
    const matched = wishlist.map((id) => {
      const found = allAvailableProducts.find((p) => p._id === id);
      if (found) return found;
      // Synthesize fallback product if not in list
      return {
        _id: id,
        title: 'منتج في قائمة المفضلة',
        slug: id,
        discription: '',
        price: 0,
        image: [{ public_id: id, secure_url: 'https://placehold.co/400x400/1e293b/ffffff?text=Product' }],
        category: { _id: 'c', name: 'عام', slug: 'general' },
        subcategory: { _id: 's', name: 'منتجات', slug: 'products' },
        averageRating: 5,
        numReviews: 1,
        sizes: [],
        colors: [],
        isFeatured: false,
        isActive: true,
        isDeleted: false,
        createdAt: '',
        updatedAt: '',
        stock: 10,
        __v: 0,
      } as Product;
    });
    return matched;
  }, [wishlist, allAvailableProducts, demoActive]);

  // Remove single item
  const handleRemove = async (productId: string, title: string) => {
    if (demoActive) {
      toast.info(`تمت إزالة "${title.slice(0, 20)}..." من المفضلة التجريبية`);
      return;
    }
    await toggleWishlist(productId);
    toast.info(`تمت إزالة "${title.slice(0, 20)}..." من المفضلة`);
  };

  // Add single item to cart
  const handleAddToCart = async (product: Product) => {
    setAddingId(product._id);
    try {
      const ok = await addToCart(product._id, 1);
      if (ok) {
        toast.success(`تمت إضافة "${product.title.slice(0, 20)}..." إلى السلة بنجاح`);
      } else {
        toast.info("يرجى تسجيل الدخول أولاً لإضافة المنتج إلى السلة");
      }
    } catch {
      toast.error("حدث خطأ أثناء الإضافة إلى السلة");
    } finally {
      setAddingId(null);
    }
  };

  // Move all in-stock items to cart
  const handleMoveAllToCart = async () => {
    const inStockItems = items.filter((p) => p.stock > 0);
    if (inStockItems.length === 0) {
      toast.warning('لا توجد منتجات متوفرة في المخزون حالياً للإضافة إلى السلة');
      return;
    }
    for (const item of inStockItems) {
      await addToCart(item._id, 1);
    }
    toast.success(`تمت إضافة ${inStockItems.length} منتجات متوفرة إلى سلة التسوق`);
  };

  // Share Wishlist
  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('تم نسخ رابط قائمة المفضلة إلى الحافظة');
    }
  };

  // Filter & Sort
  const categories = ['all', ...Array.from(new Set(items.map((p) => p.category?.name).filter(Boolean)))];

  const filteredItems = items
    .filter((p) => (selectedCategory === 'all' ? true : p.category?.name === selectedCategory))
    .sort((a, b) => {
      const priceA = a.discountPrice ?? a.price;
      const priceB = b.discountPrice ?? b.price;
      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'rating') return b.averageRating - a.averageRating;
      return 0;
    });

  const totalValue = items.reduce((acc, p) => acc + (p.discountPrice ?? p.price), 0);
  const inStockItems = items.filter((p) => p.stock > 0);

  if (isWishlistLoading && items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#D49B35] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold text-slate-600">جاري تحميل قائمة المفضلة...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-6 sm:py-10 text-slate-800" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Breadcrumb ── */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs sm:text-sm text-slate-500">
          <Link href="/" className="flex items-center gap-1 hover:text-[#D49B35] transition-colors">
            <Home className="w-4 h-4" />
            <span>الرئيسية</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 rotate-180 text-slate-400" />
          <span className="text-[#08101E] font-bold">قائمة المفضلة</span>
        </nav>

        {/* ── Case 1: Empty State ── */}
        {items.length === 0 ? (
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 sm:p-14 text-center shadow-xs">
            <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#D49B35]/5 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-[#08101E]/5 blur-3xl" />

            <div className="mx-auto max-w-md flex flex-col items-center">
              <div className="relative mb-6">
                <div className="grid h-24 w-24 sm:h-28 sm:w-28 place-items-center rounded-3xl bg-gradient-to-br from-[#FDF8ED] to-[#F5ECE0] border border-[#D49B35]/30 shadow-inner">
                  <Heart className="h-12 w-12 sm:h-14 sm:w-14 text-[#D49B35] stroke-[1.5]" />
                </div>
                <div className="absolute -bottom-1 -right-1 grid h-8 w-8 place-items-center rounded-full bg-[#08101E] text-white shadow-md">
                  <Sparkles className="h-4 w-4 text-[#D49B35]" />
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-[#08101E] mb-3">
                قائمة المفضلة فارغة حالياً
              </h1>
              <p className="text-sm sm:text-base text-slate-500 leading-relaxed mb-8">
                لم تقم بإضافة أي منتج إلى المفضلة بعد. استكشف آلاف المنتجات المميزة واحفظ ما يعجبك لتطلبه لاحقاً بكل سهولة!
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                <Link
                  href="/product"
                  className="flex items-center justify-center gap-2.5 w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#D49B35] hover:bg-[#c38c2b] active:scale-[0.99] text-[#08101E] font-black text-sm sm:text-base shadow-md hover:shadow-lg transition-all"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>تصفح المنتجات الآن</span>
                  <ArrowLeft className="w-4 h-4" />
                </Link>

                <button
                  type="button"
                  onClick={() => setDemoActive(true)}
                  className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3.5 rounded-xl border border-slate-300 hover:border-[#D49B35] bg-slate-50 hover:bg-[#FDF8ED] text-slate-700 hover:text-[#08101E] text-xs sm:text-sm font-bold transition-all cursor-pointer"
                  title="استرجاع عناصر تجريبية لاختبار مظهر القائمة الممتلئة"
                >
                  <RefreshCw className="w-4 h-4 text-[#D49B35]" />
                  <span>معاينة منتجات تجريبية</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ── Case 2: Populated Wishlist State ── */
          <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#08101E] text-[#D49B35] shadow-xs">
                  <Heart className="h-6 w-6 fill-[#D49B35]" />
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h1 className="text-2xl sm:text-3xl font-black text-[#08101E]">
                      قائمة المفضلة
                    </h1>
                    <span className="rounded-full bg-[#D49B35]/15 px-3 py-0.5 text-xs font-bold text-[#845A13] border border-[#D49B35]/30">
                      {items.length} {items.length === 1 ? 'منتج' : 'منتجات'}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    المنتجات التي قمت بحفظها ومتابعتها في متجر حورس
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleMoveAllToCart}
                  className="flex items-center gap-2 rounded-xl bg-[#F25822] hover:bg-[#d94a18] px-4 py-2.5 text-xs sm:text-sm font-black text-white shadow-xs hover:shadow-md transition-all cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>نقل الكل إلى السلة ({inStockItems.length})</span>
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3 py-2.5 text-xs sm:text-sm font-bold text-slate-700 transition-colors cursor-pointer"
                  title="مشاركة قائمة المفضلة"
                >
                  <Share2 className="w-4 h-4 text-slate-500" />
                  <span className="hidden sm:inline">مشاركة</span>
                </button>
              </div>
            </div>

            {/* ── Controls & Filter Bar ── */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {categories.map((cat, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedCategory(cat as string)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-[#08101E] text-[#D49B35] shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat === 'all' ? 'جميع الأقسام' : cat}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-2.5">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#D49B35]"
                >
                  <option value="default">الترتيب: الافتراضي</option>
                  <option value="price-asc">السعر: من الأقل للأعلى</option>
                  <option value="price-desc">السعر: من الأعلى للأقل</option>
                  <option value="rating">الأعلى تقييماً</option>
                </select>

                <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    aria-label="عرض شبكي"
                    className={`rounded-lg p-1.5 transition-colors cursor-pointer ${
                      viewMode === 'grid'
                        ? 'bg-white text-[#D49B35] shadow-xs'
                        : 'text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    aria-label="عرض طولي"
                    className={`rounded-lg p-1.5 transition-colors cursor-pointer ${
                      viewMode === 'list'
                        ? 'bg-white text-[#D49B35] shadow-xs'
                        : 'text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    <ListIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* ── Products Display (Grid / List) ── */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {filteredItems.map((product) => {
                  const hasDiscount =
                    product.discountPrice !== undefined &&
                    product.discountPrice > 0 &&
                    product.discountPrice < product.price;
                  const finalPrice = hasDiscount ? product.discountPrice! : product.price;
                  const discountPercent = hasDiscount
                    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
                    : 0;
                  const inStock = product.stock > 0;
                  const isAdding = addingId === product._id;

                  return (
                    <article
                      key={product._id}
                      className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-xs hover:shadow-lg transition-all"
                    >
                      <div className="absolute top-3 right-3 left-3 z-10 flex items-center justify-between pointer-events-none">
                        <div>
                          {hasDiscount && (
                            <span className="rounded-md bg-red-600 px-2 py-0.5 text-xs font-bold text-white shadow-xs">
                              خصم {discountPercent}%
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemove(product._id, product.title)}
                          aria-label="إزالة من المفضلة"
                          className="pointer-events-auto grid h-8 w-8 place-items-center rounded-full bg-white/95 border border-slate-100 text-red-500 hover:bg-red-50 shadow-xs transition-colors cursor-pointer"
                          title="إزالة من المفضلة"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <Link href={`/product`} className="block">
                        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-50 flex items-center justify-center mb-3">
                          {product.image?.[0]?.secure_url && (
                            <Image
                              src={product.image[0].secure_url}
                              alt={product.title}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
                              className="object-contain p-3 transition-transform duration-500 group-hover:scale-105"
                            />
                          )}
                          {!inStock && (
                            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
                              <span className="rounded-lg bg-red-600 px-3 py-1 text-xs font-black text-white shadow-md">
                                نفد من المخزون
                              </span>
                            </div>
                          )}
                        </div>
                      </Link>

                      <div className="flex-1 flex flex-col text-right">
                        {product.category?.name && (
                          <span className="text-[11px] font-bold text-[#D49B35] mb-1">
                            {product.category.name}
                          </span>
                        )}

                        <Link href={`/product`}>
                          <h3
                            className="text-sm sm:text-base font-bold text-[#08101E] line-clamp-2 leading-snug mb-2 group-hover:text-[#D49B35] transition-colors"
                            title={product.title}
                          >
                            {product.title}
                          </h3>
                        </Link>

                        <div className="flex items-center gap-1.5 mb-3">
                          <div className="flex items-center gap-0.5 text-amber-400">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`h-3 w-3 ${
                                  s <= Math.round(product.averageRating)
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'fill-slate-200 text-slate-200'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-[11px] text-slate-400 font-medium">
                            ({product.numReviews})
                          </span>
                        </div>

                        <div className="mt-auto pt-2 flex items-baseline gap-2 mb-3">
                          <span className="text-lg font-black text-[#08101E]">
                            {finalPrice.toLocaleString('ar-EG')}{' '}
                            <small className="text-xs font-bold text-slate-500">ج.م</small>
                          </span>
                          {hasDiscount && (
                            <del className="text-xs text-slate-400 font-medium">
                              {product.price.toLocaleString('ar-EG')} ج.م
                            </del>
                          )}
                        </div>

                        <button
                          type="button"
                          disabled={!inStock || isAdding}
                          onClick={() => handleAddToCart(product)}
                          className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs sm:text-sm font-black transition-all shadow-xs ${
                            inStock
                              ? 'bg-[#F25822] hover:bg-[#d94a18] active:scale-[0.99] text-white cursor-pointer hover:shadow-md'
                              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          {isAdding ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <ShoppingCart className="w-4 h-4" />
                          )}
                          <span>{inStock ? (isAdding ? 'جاري الإضافة...' : 'أضف إلى السلة') : 'غير متوفر حالياً'}</span>
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              /* List View */
              <div className="space-y-3.5">
                {filteredItems.map((product) => {
                  const hasDiscount =
                    product.discountPrice !== undefined &&
                    product.discountPrice > 0 &&
                    product.discountPrice < product.price;
                  const finalPrice = hasDiscount ? product.discountPrice! : product.price;
                  const inStock = product.stock > 0;
                  const isAdding = addingId === product._id;

                  return (
                    <article
                      key={product._id}
                      className="group flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs hover:shadow-md transition-all text-right"
                    >
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-xl bg-slate-50 flex items-center justify-center">
                          {product.image?.[0]?.secure_url && (
                            <Image
                              src={product.image[0].secure_url}
                              alt={product.title}
                              fill
                              sizes="96px"
                              className="object-contain p-2"
                            />
                          )}
                        </div>

                        <div className="flex-1">
                          <span className="text-[11px] font-bold text-[#D49B35]">
                            {product.category?.name}
                          </span>
                          <h3 className="text-sm sm:text-base font-bold text-[#08101E] group-hover:text-[#D49B35] transition-colors">
                            {product.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-base font-black text-[#08101E]">
                              {finalPrice.toLocaleString('ar-EG')} ج.م
                            </span>
                            {hasDiscount && (
                              <del className="text-xs text-slate-400">
                                {product.price.toLocaleString('ar-EG')} ج.م
                              </del>
                            )}
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                inStock ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
                              }`}
                            >
                              {inStock ? 'متوفر' : 'غير متوفر'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        <button
                          type="button"
                          disabled={!inStock || isAdding}
                          onClick={() => handleAddToCart(product)}
                          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all ${
                            inStock
                              ? 'bg-[#F25822] hover:bg-[#d94a18] text-white cursor-pointer shadow-xs'
                              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          {isAdding ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <ShoppingCart className="w-4 h-4" />
                          )}
                          <span>أضف إلى السلة</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRemove(product._id, product.title)}
                          aria-label="إزالة"
                          className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {/* ── Bottom Summary & Info Card ── */}
            <div className="mt-8 rounded-2xl border border-[#D49B35]/25 bg-gradient-to-r from-[#FDF8ED] to-white p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-slate-500 block mb-1">
                  إجمالي القيمة التقديرية للمفضلة
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-[#08101E]">
                    {totalValue.toLocaleString('ar-EG')}
                  </span>
                  <span className="text-sm font-bold text-[#D49B35]">جنيه مصري</span>
                  <span className="text-xs text-slate-400">
                    ({inStockItems.length} متوفر للشراء الفوري)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Link
                  href="/product"
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 px-5 py-3 text-xs sm:text-sm font-bold text-slate-700 transition-colors"
                >
                  <ShoppingBag className="w-4 h-4 text-[#D49B35]" />
                  <span>متابعة التسوق</span>
                </Link>

                <button
                  type="button"
                  onClick={handleMoveAllToCart}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-xl bg-[#08101E] hover:bg-[#16284D] px-6 py-3 text-xs sm:text-sm font-black text-[#D49B35] shadow-md transition-all cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>شراء الكل الآن</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
