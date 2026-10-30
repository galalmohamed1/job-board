'use client';

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Product, SubCategory, DetailsSubCategory } from "@/types/product";
import {
  Home,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Heart,
  ShoppingCart,
  Star,
  Shield,
  ShieldCheck,
  Truck,
  RotateCcw,
  CreditCard,
  Loader2,
  ImageIcon,
  Package,
  Layers,
  Sparkles,
  Check,
  ArrowRight,
} from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { getAllProducts, getSingelProduct } from "@/app/api/services/product.services";
import ProductCard from "./productCart";
import { toast } from "react-toastify";

// ==========================================
// Props
// ==========================================
type Props = {
  id?: string;
  slug?: string;
  initialProduct?: Product;
};

// ==========================================
// Helper: Image URL Resolver
// ==========================================
const API_ORIGIN = process.env.NEXT_PUBLIC_API_ORIGIN ?? "";
const getFullImageUrl = (url?: string): string => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
    return url;
  }
  return `${API_ORIGIN}${url}`;
};

// ==========================================
// Helper: Extract Subcategory / Brand Names
// ==========================================
function getSubcategoryNames(subcategory?: SubCategory[] | SubCategory | any): string[] {
  if (!subcategory) return [];
  if (Array.isArray(subcategory)) {
    return subcategory
      .map((s) => (typeof s === "string" ? s : s?.name))
      .filter((name): name is string => Boolean(name && name.trim()));
  }
  if (typeof subcategory === "object" && subcategory?.name) {
    return [subcategory.name];
  }
  if (typeof subcategory === "string") {
    return [subcategory];
  }
  return [];
}

function getDetailsSubCategoryNames(details?: DetailsSubCategory[] | any): string[] {
  if (!details) return [];
  if (Array.isArray(details)) {
    return details
      .map((d) => (typeof d === "string" ? d : d?.name))
      .filter((name): name is string => Boolean(name && name.trim()));
  }
  return [];
}

// ==========================================
// Shipping Info Constants
// ==========================================
const SHIPPING_INFO = {
  deliveryTime: "التوصيل: من 2 إلى 5 أيام عمل",
  deliveryScope: "شحن سريع لجميع محافظات مصر",
  shippingFeeNote: "رسوم الشحن: مجاناً للطلبات فوق 1000 ج.م",
  shippingFeeDetail: "تطبق رسوم رمزية حسب منطقتك",
  returnPolicyTitle: "سياسة الاستبدال والاسترجاع",
  returnPolicyDetail: "إمكانية الاسترجاع أو الاستبدال خلال 14 يوماً من تاريخ الاستلام",
};

// ==========================================
// Main Component
// ==========================================
export default function ProductDetailPage({ id, slug, initialProduct }: Props) {
  const routeParams = useParams();
  const routeIdentifier = (routeParams?.id || routeParams?.slug) as string | undefined;
  const targetIdentifier = id || slug || routeIdentifier || "";

  const {
    products: shopProducts,
    isProductsLoading: shopLoading,
    addToCart,
    toggleWishlist,
    isWishlisted,
  } = useShop();

  const [allProducts, setAllProducts] = useState<Product[]>(shopProducts || []);
  const [product, setProduct] = useState<Product | null>(initialProduct || null);
  const [isLoading, setIsLoading] = useState<boolean>(!initialProduct);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews">("description");
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState<boolean>(false);

  // ── Sync with ShopContext Products ──────────────────────────
  useEffect(() => {
    if (shopProducts && shopProducts.length > 0) {
      setAllProducts(shopProducts);
    }
  }, [shopProducts]);

  // ── Load Products from getAllProducts() or getSingleProduct ─
  useEffect(() => {
    let isCancelled = false;

    async function loadData() {
      // If we already have initialProduct matching target, done
      if (initialProduct && (initialProduct._id === targetIdentifier || initialProduct.slug === targetIdentifier)) {
        setProduct(initialProduct);
        setIsLoading(false);
        return;
      }

      // Check if found in shopProducts
      const inContext = shopProducts.find(
        (p) => p._id === targetIdentifier || p.slug === targetIdentifier
      );
      if (inContext) {
        setProduct(inContext);
        setIsLoading(false);
        return;
      }

      // Otherwise fetch all products from backend service
      setIsLoading(true);
      try {
        const fetched = await getAllProducts();
        if (!isCancelled && fetched && Array.isArray(fetched)) {
          setAllProducts(fetched);
          const matched = fetched.find(
            (p) => p._id === targetIdentifier || p.slug === targetIdentifier
          );
          if (matched) {
            setProduct(matched);
          } else if (targetIdentifier) {
            // Try single product fetch if not found in list
            try {
              const single = await getSingelProduct(targetIdentifier);
              if (!isCancelled && single && single._id) {
                setProduct(single);
              }
            } catch {
              // Product not found
              setProduct(null);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching product data:", err);
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }

    loadData();

    return () => {
      isCancelled = true;
    };
  }, [targetIdentifier, initialProduct, shopProducts]);

  // ── Reset selection when product changes ─────────────────────
  useEffect(() => {
    if (product) {
      setSelectedImageIndex(0);
      setQuantity(1);
      setSelectedSize(product.sizes?.[0] || "");
      setSelectedColor(product.colors?.[0] || "");
    }
  }, [product]);

  // ── Derived Data & Values ───────────────────────────────────
  const categoryName = product?.category?.title  || "المنتجات";
  const subCategoryNamesList = useMemo(() => getSubcategoryNames(product?.subcategory), [product?.subcategory]);
  const subCategoryNames = subCategoryNamesList.join("، ");
  const detailsSubCategoryNamesList = useMemo(() => getDetailsSubCategoryNames(product?.detailsSubCategory), [product?.detailsSubCategory]);

  const hasDiscount = Boolean(
    product &&
    product.discountPrice !== undefined &&
    product.discountPrice > 0 &&
    product.discountPrice < product.price
  );

  const currentPrice = product
    ? hasDiscount
      ? product.discountPrice!
      : product.price
    : 0;
  const originalPrice = product ? product.price : 0;
  const discountPercent =
    hasDiscount && originalPrice > 0
      ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
      : 0;

  const isFavorite = product ? isWishlisted(product._id) : false;

  // ── Related Products ─────────────────────────────────────────
  const relatedProducts = useMemo(() => {
    if (!product || !allProducts || allProducts.length === 0) return [];

    // Filter products in the same category
    const sameCat = allProducts.filter(
      (p) =>
        p._id !== product._id &&
        ((product.category?._id && p.category?._id === product.category._id) ||
         (product.category?.title && p.category?.title === product.category.title))
    );

    // If less than 5, append other products
    if (sameCat.length >= 5) {
      return sameCat.slice(0, 5);
    }

    const others = allProducts.filter(
      (p) => p._id !== product._id && !sameCat.some((c) => c._id === p._id)
    );

    return [...sameCat, ...others].slice(0, 5);
  }, [product, allProducts]);

  // ── Handlers ────────────────────────────────────────────────
  const handlePrevImage = () => {
    if (!product?.images?.length) return;
    setSelectedImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    if (!product?.images?.length) return;
    setSelectedImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
  };

  const handleDecreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncreaseQuantity = () => {
    if (!product) return;
    if (quantity < (product.stock || 99)) {
      setQuantity((prev) => prev + 1);
    } else {
      toast.warning(`الحد الأقصى المتاح بالمخزون هو ${product.stock} قطع`);
    }
  };

  const handleAddToCart = async () => {
  if (!product) return;
  if (product.stock <= 0) {
    toast.error("هذا المنتج غير متوفر في المخزون حالياً");
    return;
  }
  if ((product.colors?.length ?? 0) > 0 && !selectedColor) {
    toast.info("اختر صورة المنتج (اللون) أولاً");
    return;
  }
  if ((product.sizes?.length ?? 0) > 0 && !selectedSize) {
    toast.info("اختر المقاس أولاً");
    return;
  }

  setIsAdding(true);
  try {
    const res = await addToCart(product._id, quantity, selectedSize, selectedColor);
    if (res) {
      toast.success(`تمت إضافة ${quantity} من "${product.title.slice(0, 24)}" إلى السلة بنجاح`);
    } else {
      toast.error("تعذّرت الإضافة إلى السلة");
    }
  } catch {
    toast.error("حدث خطأ أثناء إضافة المنتج إلى السلة");
  } finally {
    setIsAdding(false);
  }
};

  const handleToggleWishlist = async () => {
    if (!product) return;
    setIsTogglingWishlist(true);
    try {
      await toggleWishlist(product._id);
      if (!isFavorite) {
        toast.success("تمت الإضافة إلى المفضلة بنجاح");
      } else {
        toast.info("تمت الإزالة من المفضلة");
      }
    } catch {
      toast.error("حدث خطأ أثناء تعديل المفضلة");
    } finally {
      setIsTogglingWishlist(false);
    }
  };

  // ── Loading Skeleton State ──────────────────────────────────
  if (isLoading || (shopLoading && !product)) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] py-8 text-right font-['Cairo']">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Skeleton */}
          <div className="h-6 w-72 bg-slate-200 rounded-md animate-pulse mb-6" />

          {/* Main Card Skeleton */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Info Column Skeleton */}
              <div className="lg:col-span-7 flex flex-col gap-4 order-1">
                <div className="h-4 w-36 bg-slate-200 rounded animate-pulse" />
                <div className="h-8 w-3/4 bg-slate-200 rounded animate-pulse" />
                <div className="h-5 w-48 bg-slate-200 rounded animate-pulse" />
                <div className="h-16 w-full bg-slate-100 rounded-xl animate-pulse" />
                <div className="h-10 w-44 bg-slate-200 rounded animate-pulse" />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-20 bg-slate-100 rounded-xl animate-pulse" />
                  ))}
                </div>
                <div className="h-12 w-full bg-slate-200 rounded-xl animate-pulse" />
              </div>

              {/* Gallery Column Skeleton */}
              <div className="lg:col-span-5 order-2 flex flex-col gap-3">
                <div className="aspect-square w-full bg-slate-200 rounded-2xl animate-pulse" />
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="aspect-square bg-slate-200 rounded-xl animate-pulse" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Product Not Found State ─────────────────────────────────
  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#F8FAFC] px-4 py-16 text-center font-['Cairo']">
        <div className="w-20 h-20 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-4 shadow-xs">
          <Package className="w-10 h-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
          المنتج غير موجود
        </h1>
        <p className="text-slate-500 max-w-md text-sm mb-6 leading-relaxed">
          عذراً، لم نتمكن من العثور على المنتج المطلوب. قد يكون تم حذفه أو أن الرابط غير صحيح.
        </p>
        <Link
          href="/product"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#D49B35] hover:bg-[#b8852a] text-white text-sm font-bold shadow-sm transition-all"
        >
          <span>تصفح جميع المنتجات</span>
          <ArrowRight className="w-4 h-4 rotate-180" />
        </Link>
      </div>
    );
  }

  const currentImageUrl = getFullImageUrl(product.images?.[selectedImageIndex]?.secure_url);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-['Cairo'] text-right">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* ── Breadcrumb ── */}
        <nav
          className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 py-4 overflow-x-auto"
          aria-label="breadcrumb"
        >
          <Link href="/" className="flex items-center gap-1 hover:text-[#D49B35] transition-colors shrink-0">
            <Home className="w-4 h-4" />
            <span>الرئيسية</span>
          </Link>

          <ChevronRight className="w-3.5 h-3.5 text-slate-400 rotate-180 shrink-0" />
          <Link href="/product" className="hover:text-[#D49B35] transition-colors shrink-0">
            المنتجات
          </Link>

          {categoryName && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 rotate-180 shrink-0" />
              <span className="text-slate-700 font-medium shrink-0">{categoryName}</span>
            </>
          )}

          {subCategoryNames && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 rotate-180 shrink-0" />
              <span className="text-slate-700 font-medium shrink-0">{subCategoryNames}</span>
            </>
          )}

          <ChevronRight className="w-3.5 h-3.5 text-slate-400 rotate-180 shrink-0" />
          <span className="text-[#D49B35] font-bold truncate max-w-[220px]">{product.title}</span>
        </nav>

        {/* ========================================================= */}
        {/* 1. Main Product Showcase Card                             */}
        {/* ========================================================= */}
        <section
          aria-label="تفاصيل المنتج الرئيسية"
          className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-6 lg:p-8 shadow-xs"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* ── Right Column: Info & Actions ── */}
            <div className="lg:col-span-7 flex flex-col justify-between h-full order-1">
              {/* Category & Brand Header Row */}
              <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500 mb-2">
                <span className="text-slate-600 font-medium bg-slate-100 px-2.5 py-1 rounded-md">
                  {categoryName}
                </span>

                {subCategoryNames ? (
                  <span className="font-bold text-slate-700 bg-amber-50 border border-amber-200/70 text-amber-800 px-2.5 py-0.5 rounded-md text-xs">
                    {subCategoryNames}
                  </span>
                ) : null}
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight mb-2 leading-tight">
                {product.title}
              </h1>

              {/* Rating & Reviews Row */}
              <div className="flex items-center gap-2 mb-3 text-xs sm:text-sm">
                <div className="flex items-center gap-0.5 text-amber-400" aria-label={`تقييم ${product.averageRating || 0} من 5`}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i <= Math.round(product.averageRating || 0)
                          ? "fill-amber-400 text-amber-400"
                          : "fill-slate-200 text-slate-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-slate-600 font-medium">
                  ({(product.averageRating ?? 0).toFixed(1)}) • {product.numReviews ?? 0} تقييم
                </span>
              </div>

              {/* Short Description */}
              {product.description && (
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-3">
                  {product.description}
                </p>
              )}

              {/* Price & Discount Row */}
              <div className="flex items-center gap-3 sm:gap-4 mb-3">
                <span className="text-2xl sm:text-3xl font-black text-[#111827] tracking-tight">
                  {currentPrice.toLocaleString("en-US")} ج.م
                </span>

                {hasDiscount && (
                  <span className="line-through text-slate-400 text-base sm:text-lg font-medium">
                    {originalPrice.toLocaleString("en-US")} ج.م
                  </span>
                )}

                {hasDiscount && discountPercent > 0 && (
                  <span className="rounded-md bg-[#EF4444] px-2.5 py-1 text-xs font-bold text-white shadow-xs">
                    خصم {discountPercent}%
                  </span>
                )}

                {product.isFeatured && (
                  <span className="rounded-md bg-[#F97316] px-2.5 py-1 text-xs font-bold text-white shadow-xs flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>مميز</span>
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2 mb-5 text-xs sm:text-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      product.stock > 0 ? "bg-emerald-400" : "bg-red-400"
                    }`}
                  />
                  <span
                    className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                      product.stock > 0 ? "bg-emerald-500" : "bg-red-500"
                    }`}
                  />
                </span>
                <span
                  className={`font-bold ${
                    product.stock > 0 ? "text-emerald-700" : "text-red-600"
                  }`}
                >
                  {product.stock > 0
                    ? `متوفر في المخزون (${product.stock} قطعة)`
                    : "غير متوفر بالمخزون حالياً"}
                </span>
              </div>

              {/* Dynamic Highlights Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
                <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3 text-center flex flex-col items-center justify-center">
                  <Package className="w-4 h-4 text-[#D49B35] mb-1" />
                  <span className="text-[11px] text-slate-500">القسم</span>
                  <span className="text-xs font-bold text-slate-900 truncate max-w-[110px]">
                    {categoryName}
                  </span>
                </div>

                <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3 text-center flex flex-col items-center justify-center">
                  <Layers className="w-4 h-4 text-[#D49B35] mb-1" />
                  <span className="text-[11px] text-slate-500">النوع</span>
                  <span className="text-xs font-bold text-slate-900 truncate max-w-[110px]">
                    {subCategoryNames || "أساسي"}
                  </span>
                </div>

                <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3 text-center flex flex-col items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-[#D49B35] mb-1" />
                  <span className="text-[11px] text-slate-500">الضمان</span>
                  <span className="text-xs font-bold text-slate-900">أصلي 100%</span>
                </div>

                <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3 text-center flex flex-col items-center justify-center">
                  <Truck className="w-4 h-4 text-[#D49B35] mb-1" />
                  <span className="text-[11px] text-slate-500">الشحن</span>
                  <span className="text-xs font-bold text-slate-900">سريع وموثوق</span>
                </div>
              </div>

              {/* Sizes Selection (if available from backend) */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-4">
                  <span className="text-xs font-bold text-slate-900 block mb-2">المقاس:</span>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSelectedSize(s)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                          selectedSize === s
                            ? "border-[#D49B35] bg-[#D49B35] text-white shadow-xs"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors Selection (if available from backend) */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-5">
                  <span className="text-xs font-bold text-slate-900 block mb-2">اللون:</span>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setSelectedColor(c)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                          selectedColor === c
                            ? "border-[#111827] bg-[#111827] text-white shadow-xs"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
                        }`}
                      >
                        {selectedColor === c && <Check className="w-3.5 h-3.5" />}
                        <span>{c}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector Row */}
              <div className="flex items-center justify-between mb-4 pt-1">
                <span className="text-sm font-bold text-slate-900">الكمية</span>
                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white shadow-xs">
                  <button
                    type="button"
                    onClick={handleIncreaseQuantity}
                    disabled={product.stock <= 0}
                    aria-label="زيادة الكمية"
                    className="p-2 sm:px-3 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors disabled:opacity-40 cursor-pointer"
                  >
                    +
                  </button>
                  <span className="px-4 py-1 text-sm font-bold text-slate-900 min-w-[36px] text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={handleDecreaseQuantity}
                    disabled={product.stock <= 0 || quantity <= 1}
                    aria-label="تقليل الكمية"
                    className="p-2 sm:px-3 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors disabled:opacity-40 cursor-pointer"
                  >
                    -
                  </button>
                </div>
              </div>

              {/* Add To Cart Primary CTA Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isAdding || product.stock <= 0}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#F25822] hover:bg-[#d94a18] text-white py-3 sm:py-3.5 text-base sm:text-lg font-bold shadow-sm hover:shadow-md transition-all active:scale-[0.99] cursor-pointer mb-3 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isAdding ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>جاري الإضافة...</span>
                  </>
                ) : product.stock <= 0 ? (
                  <span>نفدت الكمية من المخزون</span>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    <span>أضف إلى السلة</span>
                  </>
                )}
              </button>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={handleToggleWishlist}
                disabled={isTogglingWishlist}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-300/80 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-medium transition-colors cursor-pointer disabled:opacity-75"
              >
                <Heart
                  className={`w-4 h-4 transition-colors ${
                    isFavorite ? "fill-red-500 text-red-500" : "text-slate-500"
                  }`}
                />
                <span>{isFavorite ? "في قائمة المفضلة" : "إضافة إلى المفضلة"}</span>
              </button>
            </div>

            {/* ── Left Column: Real Product Gallery ── */}
            <div className="lg:col-span-5 flex flex-col order-2">
              {/* Main Image Stage */}
              <div className="relative aspect-square w-full rounded-2xl border border-slate-200/90 bg-[#F9FAFB] p-4 flex items-center justify-center overflow-hidden">
                {/* Discount Badge */}
                {hasDiscount && discountPercent > 0 && (
                  <span className="absolute top-3 right-3 z-20 rounded-md bg-[#EF4444] px-2.5 py-1 text-xs font-bold text-white shadow-xs">
                    خصم {discountPercent}%
                  </span>
                )}

                {/* Carousel Previous Arrow Button */}
                {product.images && product.images.length > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    aria-label="الصورة السابقة"
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/90 border border-slate-200 shadow-xs flex items-center justify-center text-slate-600 hover:bg-white hover:text-slate-900 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                )}

                {/* Carousel Next Arrow Button */}
                {product.images && product.images.length > 1 && (
                  <button
                    type="button"
                    onClick={handleNextImage}
                    aria-label="الصورة التالية"
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/90 border border-slate-200 shadow-xs flex items-center justify-center text-slate-600 hover:bg-white hover:text-slate-900 transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}

                {/* Main Product Image */}
                <div className="w-full h-full flex items-center justify-center transition-all duration-300">
                  {currentImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={currentImageUrl}
                      alt={product.title}
                      className="w-full h-full object-contain max-h-[380px] drop-shadow-sm select-none"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400 gap-2">
                      <ImageIcon className="w-16 h-16 stroke-1" />
                      <span className="text-xs">لا توجد صورة للمنتج</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Thumbnails Row */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-5 gap-2 mt-3" aria-label="صور المنتج المصغرة">
                  {product.images.map((img, idx) => {
                    const thumbUrl = getFullImageUrl(img.secure_url);
                    return (
                      <button
                        key={img.public_id || idx}
                        type="button"
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`aspect-square rounded-xl border p-1 bg-white flex items-center justify-center transition-all cursor-pointer overflow-hidden ${
                          selectedImageIndex === idx
                            ? "border-[#D49B35] ring-2 ring-[#D49B35]/30 shadow-xs"
                            : "border-slate-200 hover:border-slate-400 opacity-80 hover:opacity-100"
                        }`}
                      >
                        {thumbUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={thumbUrl}
                            alt={`${product.title} - ${idx + 1}`}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <ImageIcon className="w-4 h-4 text-slate-300" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* 4 Trust & Guarantee Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-2">
                <div className="rounded-xl border border-slate-200/90 bg-white p-2.5 text-center flex flex-col items-center justify-center">
                  <Shield className="w-5 h-5 text-slate-700 mb-1" />
                  <span className="text-[11px] font-bold text-slate-900 leading-tight">دفع آمن</span>
                  <span className="text-[10px] text-slate-500 mt-0.5">بجميع الوسائل</span>
                </div>

                <div className="rounded-xl border border-slate-200/90 bg-white p-2.5 text-center flex flex-col items-center justify-center">
                  <RotateCcw className="w-5 h-5 text-slate-700 mb-1" />
                  <span className="text-[11px] font-bold text-slate-900 leading-tight">إرجاع واستبدال</span>
                  <span className="text-[10px] text-slate-500 mt-0.5">خلال 14 يوماً</span>
                </div>

                <div className="rounded-xl border border-slate-200/90 bg-white p-2.5 text-center flex flex-col items-center justify-center">
                  <Truck className="w-5 h-5 text-slate-700 mb-1" />
                  <span className="text-[11px] font-bold text-slate-900 leading-tight">شحن سريع</span>
                  <span className="text-[10px] text-slate-500 mt-0.5">لكل المحافظات</span>
                </div>

                <div className="rounded-xl border border-slate-200/90 bg-white p-2.5 text-center flex flex-col items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-slate-700 mb-1" />
                  <span className="text-[11px] font-bold text-slate-900 leading-tight">منتج أصلي</span>
                  <span className="text-[10px] text-slate-500 mt-0.5">مضمون 100%</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 2. Product Details, Tabs & Sidebar                        */}
        {/* ========================================================= */}
        <section aria-label="مواصفات ومعلومات الشحن" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* ── Right Card: Tabs ── */}
            <div className="lg:col-span-8 rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs order-1">
              {/* Tab Navigation */}
              <div className="flex items-center gap-6 border-b border-slate-200 pb-3 text-sm sm:text-base font-bold">
                <button
                  type="button"
                  onClick={() => setActiveTab("description")}
                  className={`relative pb-3 -mb-3 transition-colors cursor-pointer ${
                    activeTab === "description"
                      ? "text-[#111827] border-b-2 border-[#D49B35]"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  الوصف
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("specs")}
                  className={`relative pb-3 -mb-3 transition-colors cursor-pointer ${
                    activeTab === "specs"
                      ? "text-[#111827] border-b-2 border-[#D49B35]"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  المواصفات الفنية
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("reviews")}
                  className={`relative pb-3 -mb-3 transition-colors cursor-pointer ${
                    activeTab === "reviews"
                      ? "text-[#111827] border-b-2 border-[#D49B35]"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  مراجعات العملاء ({product.numReviews ?? 0})
                </button>
              </div>

              {/* Tab 1 Content: Description */}
              {activeTab === "description" && (
                <div className="pt-5 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-4">
                  <p className="whitespace-pre-line text-slate-800 font-normal leading-7">
                    {product.description || "لا يوجد وصف مفصل لهذا المنتج حتى الآن."}
                  </p>

                  {/* Details Subcategory Tags */}
                  {detailsSubCategoryNamesList.length > 0 && (
                    <div className="pt-4 border-t border-slate-100">
                      <h4 className="font-bold text-slate-900 text-xs mb-2">التصنيفات الفرعية والتفاصيل:</h4>
                      <div className="flex flex-wrap gap-2">
                        {detailsSubCategoryNamesList.map((tag) => (
                          <span
                            key={tag}
                            className="bg-slate-100 text-slate-700 px-3 py-1 rounded-lg text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {product.description && product.description.length > 250 && (
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setIsDescriptionExpanded((prev) => !prev)}
                        className="inline-flex items-center gap-1 text-[#D49B35] hover:text-[#b8852a] font-bold text-xs sm:text-sm cursor-pointer transition-colors"
                      >
                        <span>{isDescriptionExpanded ? "عرض أقل" : "اقرأ المزيد"}</span>
                        {isDescriptionExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2 Content: Specifications */}
              {activeTab === "specs" && (
                <div className="pt-5">
                  <div className="divide-y divide-slate-100 text-xs sm:text-sm">
                    <div className="py-2.5 flex justify-between items-center">
                      <span className="text-slate-500 font-medium">اسم المنتج</span>
                      <span className="text-slate-900 font-semibold">{product.title}</span>
                    </div>

                    <div className="py-2.5 flex justify-between items-center">
                      <span className="text-slate-500 font-medium">القسم الرئيسي</span>
                      <span className="text-slate-900 font-semibold">{categoryName}</span>
                    </div>

                    {subCategoryNames && (
                      <div className="py-2.5 flex justify-between items-center">
                        <span className="text-slate-500 font-medium">القسم الفرعي</span>
                        <span className="text-slate-900 font-semibold">{subCategoryNames}</span>
                      </div>
                    )}

                    {detailsSubCategoryNamesList.length > 0 && (
                      <div className="py-2.5 flex justify-between items-center">
                        <span className="text-slate-500 font-medium">التصنيف الدقيق</span>
                        <span className="text-slate-900 font-semibold">
                          {detailsSubCategoryNamesList.join("، ")}
                        </span>
                      </div>
                    )}

                    <div className="py-2.5 flex justify-between items-center">
                      <span className="text-slate-500 font-medium">المقاسات</span>
                      <span className="text-slate-900 font-semibold">
                        {product.sizes?.length ? product.sizes.join(" / ") : "قياس موحد"}
                      </span>
                    </div>

                    <div className="py-2.5 flex justify-between items-center">
                      <span className="text-slate-500 font-medium">الألوان</span>
                      <span className="text-slate-900 font-semibold">
                        {product.colors?.length ? product.colors.join(" / ") : "افتراضي"}
                      </span>
                    </div>

                    <div className="py-2.5 flex justify-between items-center">
                      <span className="text-slate-500 font-medium">الكمية المتوفرة بالمخزون</span>
                      <span className="text-slate-900 font-semibold">{product.stock} قطعة</span>
                    </div>

                    <div className="py-2.5 flex justify-between items-center">
                      <span className="text-slate-500 font-medium">حالة المنتج</span>
                      <span className="text-emerald-700 font-semibold">
                        {product.isActive ? "نشط ومتاح للطلب" : "غير متاح"}
                      </span>
                    </div>

                    {product.createdAt && (
                      <div className="py-2.5 flex justify-between items-center">
                        <span className="text-slate-500 font-medium">تاريخ الإضافة</span>
                        <span className="text-slate-700 font-semibold">
                          {new Date(product.createdAt).toLocaleDateString("ar-EG")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 3 Content: Customer Reviews */}
              {activeTab === "reviews" && (
                <div className="pt-5 space-y-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-black text-slate-900">
                        {(product.averageRating ?? 0).toFixed(1)} / 5.0
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        بناءً على {product.numReviews ?? 0} تقييم موثق من المشترين
                      </div>
                    </div>
                    <div className="flex gap-0.5 text-amber-400">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i <= Math.round(product.averageRating || 0)
                              ? "fill-amber-400 text-amber-400"
                              : "fill-slate-200 text-slate-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="py-6 text-center text-slate-500 text-xs sm:text-sm">
                    {product.numReviews > 0 ? (
                      <p>تم تسجيل تقييمات العملاء لهذا المنتج بنجاح ومتوسط التقييم العام هو {(product.averageRating ?? 0).toFixed(1)} نجوم.</p>
                    ) : (
                      <p>لا توجد مراجعات مكتوبة بعد لهذا المنتج. كن أول من يشارك تجربته مع هذا المنتج!</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ── Left Column: Brand & Shipping Details ── */}
            <div className="lg:col-span-4 flex flex-col gap-4 order-2">
              {/* Category / Brand Info Box */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">العلامة والتصنيف</span>
                <span className="font-bold text-slate-800 text-sm">
                  {subCategoryNames || categoryName}
                </span>
              </div>

              {/* Shipping & Delivery Details Box */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
                <h2 className="text-sm sm:text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                  معلومات الشحن والتوصيل
                </h2>

                <div className="space-y-4 text-xs sm:text-sm">
                  <div className="flex items-start gap-3">
                    <Truck className="w-5 h-5 text-slate-700 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-900">{SHIPPING_INFO.deliveryTime}</div>
                      <div className="text-slate-500 text-[11px] mt-0.5">
                        {SHIPPING_INFO.deliveryScope}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CreditCard className="w-5 h-5 text-slate-700 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-900">{SHIPPING_INFO.shippingFeeNote}</div>
                      <div className="text-slate-500 text-[11px] mt-0.5">
                        {SHIPPING_INFO.shippingFeeDetail}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <RotateCcw className="w-5 h-5 text-slate-700 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-900">{SHIPPING_INFO.returnPolicyTitle}</div>
                      <div className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">
                        {SHIPPING_INFO.returnPolicyDetail}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 3. Related Products (Loaded from getAllProducts)          */}
        {/* ========================================================= */}
        {relatedProducts.length > 0 && (
          <section aria-label="منتجات ذات صلة" className="mt-8">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">منتجات ذات صلة</h2>
                  <p className="text-xs text-slate-400 mt-0.5">قد تعجبك أيضاً من متجرنا</p>
                </div>
                <Link
                  href="/product"
                  className="text-xs font-bold text-[#D49B35] hover:underline flex items-center gap-1"
                >
                  <span>عرض الكل</span>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {relatedProducts.map((relProduct) => (
                  <ProductCard key={relProduct._id} product={relProduct} />
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}