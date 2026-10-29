'use client';
import { useState } from "react";
import Link from "next/link";
import { Product } from "@/types/product";
import {
  Home,
  ChevronRight as ChevronRightBreadcrumb,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Heart,
  ShoppingCart,
  Star,
  Shield,
  ShieldCheck,
  Truck,
  RotateCcw,
  Droplet,
  Activity,
  Battery,
  TabletSmartphone,
  ArrowLeftRight,
  Minus,
  Plus,
  CreditCard,
  Loader2,
} from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { toast } from "react-toastify";

// ==========================================
// Props
// ==========================================
type Props = {
  /* API: معرف المنتج الفريد لجلب بيانات المنتج من الباك إند - product ID */
  id?: string;
  /* API: يمكن تمرير كائن المنتج مباشرة إن وجد - Product */
  initialProduct?: Product;
};

// ==========================================
// Initial / Mock Product Data (Typed as Product)
// ==========================================
/* API: البيانات الافتراضية المماثلة للتصميم تماماً وفق واجهة Product من @/types/product */
const INITIAL_PRODUCT: Product = {
  /* API: معرف المنتج - product._id */
  _id: "hw-watch-fit-3",

  /* API: عنوان واسم المنتج - product.title */
  title: "ساعة هواوي الذكية Watch Fit 3",

  /* API: الرابط اللطيف للمنتج - product.slug */
  slug: "huawei-watch-fit-3",

  /* API: الوصف الكامل والتفصيلي - product.discription */
  description:
    "ساعة هواوي Watch Fit 3 تجمع بين التصميم العصري والميزات الذكية لتمنحك تجربة استخدام متكاملة سواء في العمل أو أثناء ممارسة الرياضة أو في حياتك اليومية.",

  /* API: السعر الأصلي قبل الخصم - product.price */
  price: 3099,

  /* API: السعر بعد الخصم - product.discountPrice */
  discountPrice: 2499,

  /* API: مصفوفة صور المنتج - product.image */
  images: [
    {
      public_id: "img-1",
      secure_url: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80",
    },
    {
      public_id: "img-2",
      secure_url: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80",
    },
    {
      public_id: "img-3",
      secure_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    },
    {
      public_id: "img-4",
      secure_url: "https://images.unsplash.com/photo-1510017803434-a899398421b3?auto=format&fit=crop&w=800&q=80",
    },
    {
      public_id: "img-5",
      secure_url: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80",
    },
  ],

  /* API: التصنيف الرئيسي - product.category */
  category: {
    _id: "cat-1",
    title: "الالكترونيات",
    slug: "electronics",
    description:"",
    image:""
  },

  /* API: التصنيف الفرعي - product.subcategory */
  subcategory: {
    _id: "sub-1",
    name: "الساعات الذكيه",
    slug: "smart-watches",
    category: "cat-1",
  },

  /* API: متوسط التقييم - product.averageRating */
  averageRating: 4.5,

  /* API: إجمالي عدد التقييمات - product.numReviews */
  numReviews: 228,

  /* API: المقاسات - product.sizes */
  sizes: ["Universal"],

  /* API: الألوان - product.colors */
  colors: ["black"],

  /* API: مميز - product.isFeatured */
  isFeatured: true,

  /* API: نشط - product.isActive */
  isActive: true,

  /* API: محذوف - product.isDeleted */
  isDeleted: false,

  /* API: تاريخ الإنشاء - product.createdAt */
  createdAt: "2024-01-01T00:00:00.000Z",

  /* API: تاريخ التحديث - product.updatedAt */
  updatedAt: "2024-01-01T00:00:00.000Z",

  /* API: الكمية المتوفرة بالمخزون - product.stock */
  stock: 24,

  videos:[]
};

// ==========================================
// Static UI Specifications & Store Policies
// ==========================================
/* API: الخصائص السريعة والمميزات الإضافية للمنتج */
const PRODUCT_HIGHLIGHTS = [
  { id: "h-1", label: "مقاومة للماء", value: "5 ATM", icon: Droplet },
  { id: "h-2", label: "أكثر من 100 وضع", value: "رياضي", icon: Activity },
  { id: "h-3", label: "عمر البطارية", value: "حتى 10 أيام", icon: Battery },
  { id: "h-4", label: "شاشة AMOLED", value: "1.82 بوصة", icon: TabletSmartphone },
];

/* API: قائمة النقاط البارزة للمنتج */
const PRODUCT_BULLET_POINTS = [
  "شاشة AMOLED عالية الدقة 1.82 بوصة",
  "عمر بطارية يصل إلى 10 أيام",
  "أكثر من 100 وضع رياضي",
  "مراقبة معدل ضربات القلب على مدار الساعة",
  "مقاومة للماء حتى عمق 5 أمتار (5 ATM)",
  "تدعم أنظمة التشغيل Android و iOS",
];

/* API: المواصفات الفنية التفصيلية في التبويب */
const PRODUCT_SPECIFICATIONS = [
  { label: "نوع الشاشة", value: "AMOLED دائرية الزوايا بحجم 1.82 بوصة" },
  { label: "دقة الشاشة", value: "480 × 408 بكسل، 347 PPI" },
  { label: "سعة البطارية", value: "400 مللي أمبير، حتى 10 أيام استخدام عادي" },
  { label: "مقاومة الماء", value: "مقاومة للماء بمعيار 5 ATM (حتى 50 متر)" },
  { label: "الاتصال", value: "Bluetooth 5.2, BLE" },
  { label: "المستشعرات", value: "مستشعر IMU 9 محاور، نبض القلب، SpO2" },
  { label: "التوافق", value: "Android 8.0 أو أحدث / iOS 13.0 أو أحدث" },
  { label: "الوزن", value: "حوالي 26 جم (بدون السوار)" },
];

/* API: معلومات الشحن وسياسة الإرجاع */
const SHIPPING_INFO = {
  deliveryTime: "التوصيل: من 2 إلى 5 أيام عمل",
  deliveryScope: "لجميع المحافظات",
  shippingFeeNote: "رسوم الشحن: حسب المنطقة",
  shippingFeeDetail: "تطبق رسوم الشحن حسب منطقتك",
  returnPolicyTitle: "سياسة الاستبدال والاسترجاع",
  returnPolicyDetail: "يمكنك استبدال أو إرجاع المنتج خلال 14 يوماً من تاريخ الاستلام",
};

// ==========================================
// Related Products List (Typed with Product)
// ==========================================
/* API: قائمة المنتجات ذات الصلة - relatedProducts */
interface RelatedProductItem {
  _id: string;
  title: string;
  brand: string;
  price: number;
  rating: number;
  reviewsCount: number;
}

const RELATED_PRODUCTS: RelatedProductItem[] = [
  {
    /* API: معرف المنتج - item._id */
    _id: "rel-1",
    /* API: اسم المنتج - item.title */
    title: "سماعات Anker Soundcore",
    /* API: اسم الماركة - item.brand */
    brand: "Anker",
    /* API: السعر - item.price */
    price: 1799,
    /* API: متوسط التقييم - item.rating */
    rating: 4.2,
    /* API: عدد التقييمات - item.reviewsCount */
    reviewsCount: 92,
  },
  {
    /* API: معرف المنتج - item._id */
    _id: "rel-2",
    /* API: اسم المنتج - item.title */
    title: "سماعات JBL TUNE 230NC",
    /* API: اسم الماركة - item.brand */
    brand: "JBL",
    /* API: السعر - item.price */
    price: 1499,
    /* API: متوسط التقييم - item.rating */
    rating: 4.3,
    /* API: عدد التقييمات - item.reviewsCount */
    reviewsCount: 76,
  },
  {
    /* API: معرف المنتج - item._id */
    _id: "rel-3",
    /* API: اسم المنتج - item.title */
    title: "سوار ذكي Xiaomi Mi Band 8",
    /* API: اسم الماركة - item.brand */
    brand: "Xiaomi",
    /* API: السعر - item.price */
    price: 999,
    /* API: متوسط التقييم - item.rating */
    rating: 4.4,
    /* API: عدد التقييمات - item.reviewsCount */
    reviewsCount: 110,
  },
  {
    /* API: معرف المنتج - item._id */
    _id: "rel-4",
    /* API: اسم المنتج - item.title */
    title: "هاتف Samsung Galaxy A55",
    /* API: اسم الماركة - item.brand */
    brand: "Samsung",
    /* API: السعر - item.price */
    price: 12999,
    /* API: متوسط التقييم - item.rating */
    rating: 4.5,
    /* API: عدد التقييمات - item.reviewsCount */
    reviewsCount: 163,
  },
  {
    /* API: معرف المنتج - item._id */
    _id: "rel-5",
    /* API: اسم المنتج - item.title */
    title: "شاحن لاسلكي Ugreen",
    /* API: اسم الماركة - item.brand */
    brand: "Ugreen",
    /* API: السعر - item.price */
    price: 649,
    /* API: متوسط التقييم - item.rating */
    rating: 4.1,
    /* API: عدد التقييمات - item.reviewsCount */
    reviewsCount: 18,
  },
];

// ==========================================
// Huawei Brand Logo SVG Component
// ==========================================
function HuaweiLogo() {
  return (
    <div className="flex items-center gap-1.5" aria-label="شعار Huawei">
      <svg className="w-6 h-6 text-[#ED1C24]" viewBox="0 0 100 100" fill="currentColor">
        <path d="M50 8 C48 18 45 28 42 36 C45 36 47 36 50 36 C53 36 55 36 58 36 C55 28 52 18 50 8 Z" />
        <path d="M38 14 C33 22 28 31 24 39 C27 41 30 42 33 43 C38 36 42 28 45 20 C42 18 40 16 38 14 Z" />
        <path d="M62 14 C60 16 58 18 55 20 C58 28 62 36 67 43 C70 42 73 41 76 39 C72 31 67 22 62 14 Z" />
        <path d="M25 26 C19 33 14 41 11 49 C14 52 17 54 20 56 C26 49 31 43 36 36 C32 32 29 29 25 26 Z" />
        <path d="M75 26 C71 29 68 32 64 36 C69 43 74 49 80 56 C83 54 86 52 89 49 C86 41 81 33 75 26 Z" />
        <path d="M15 42 C10 49 6 58 4 66 C7 69 11 72 15 74 C20 67 25 61 31 55 C25 50 20 46 15 42 Z" />
        <path d="M85 42 C80 46 75 50 69 55 C75 61 80 67 85 74 C89 72 93 69 96 66 C94 58 90 49 85 42 Z" />
        <path d="M50 42 C47 50 43 59 38 67 C42 69 46 70 50 70 C54 70 58 69 62 67 C57 59 53 50 50 42 Z" />
      </svg>
      <span className="font-bold text-slate-800 text-sm tracking-wide">HUAWEI</span>
    </div>
  );
}

// ==========================================
// Smart Watch High-Fidelity Vector Asset
// ==========================================
function WatchProductVisual({ viewIndex }: { viewIndex: number }) {
  if (viewIndex === 0) {
    // Front View matching image exactly
    return (
      <div className="relative w-64 h-72 sm:w-72 sm:h-80 mx-auto flex items-center justify-center select-none">
        {/* Upper Strap */}
        <div className="absolute top-0 w-28 h-20 bg-gradient-to-b from-[#181a1d] to-[#23272d] rounded-t-3xl shadow-inner border-t border-slate-700/30" />

        {/* Lower Strap with Holes & Pin */}
        <div className="absolute bottom-0 w-28 h-24 bg-gradient-to-t from-[#181a1d] to-[#23272d] rounded-b-3xl shadow-inner flex flex-col items-center justify-center gap-2 border-b border-slate-700/30">
          <div className="w-2.5 h-3.5 bg-[#0f1114] rounded-full shadow-inner" />
          <div className="w-2.5 h-3.5 bg-[#0f1114] rounded-full shadow-inner" />
          <div className="w-2.5 h-3.5 bg-[#0f1114] rounded-full shadow-inner" />
        </div>

        {/* Watch Body / Metal Frame */}
        <div className="relative z-10 w-52 h-60 bg-gradient-to-br from-[#2c3239] via-[#1b1f24] to-[#0f1216] rounded-[42px] p-2.5 shadow-2xl border border-slate-700/50 flex items-center justify-center">
          {/* Digital Crown on Right Edge */}
          <div className="absolute -right-2.5 top-16 w-3.5 h-9 bg-gradient-to-r from-[#3f4752] to-[#1a1c20] rounded-r-md border border-slate-600/50 shadow-md" />
          {/* Flat Secondary Button */}
          <div className="absolute -right-2 top-32 w-2.5 h-7 bg-[#23272d] rounded-r border border-slate-600/40" />

          {/* AMOLED Bezel & Screen */}
          <div className="relative w-full h-full bg-[#03060a] rounded-[34px] p-3 flex flex-col justify-between overflow-hidden border border-slate-800/80">
            {/* Screen Glass Reflection */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none rounded-[34px]" />

            {/* Watchface Top: Time & Date */}
            <div className="text-center mt-1 z-10">
              <div className="text-[44px] font-black tracking-tight text-white leading-none font-mono flex items-center justify-center">
                <span>10</span>
                <span className="text-emerald-400 mx-0.5 animate-pulse">:</span>
                <span className="text-emerald-400">08</span>
              </div>
              <div className="text-[10px] font-bold text-slate-300 mt-1 tracking-wider uppercase">
                TUE 25 OCT
              </div>
            </div>

            {/* Watchface Center/Bottom 4 Metrics Pills */}
            <div className="grid grid-cols-2 gap-1.5 z-10 mb-1">
              {/* Steps */}
              <div className="bg-[#101726]/90 border border-blue-500/20 rounded-xl p-1.5 flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-[9px] font-bold">
                  👟
                </div>
                <div className="text-right">
                  <div className="text-[8px] text-slate-400 leading-none">Steps</div>
                  <div className="text-[11px] font-bold text-white leading-none mt-0.5">8,420</div>
                </div>
              </div>

              {/* Heart Rate */}
              <div className="bg-[#241318]/90 border border-rose-500/20 rounded-xl p-1.5 flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400 text-[9px] font-bold">
                  ❤️
                </div>
                <div className="text-right">
                  <div className="text-[8px] text-slate-400 leading-none">72</div>
                  <div className="text-[11px] font-bold text-rose-300 leading-none mt-0.5">bpm</div>
                </div>
              </div>

              {/* Calories */}
              <div className="bg-[#25170d]/90 border border-amber-500/20 rounded-xl p-1.5 flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-[9px] font-bold">
                  🔥
                </div>
                <div className="text-right">
                  <div className="text-[8px] text-slate-400 leading-none">315</div>
                  <div className="text-[11px] font-bold text-amber-300 leading-none mt-0.5">kcal</div>
                </div>
              </div>

              {/* Battery */}
              <div className="bg-[#0f241a]/90 border border-emerald-500/20 rounded-xl p-1.5 flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-[9px] font-bold">
                  ⚡
                </div>
                <div className="text-right">
                  <div className="text-[8px] text-slate-400 leading-none">Charge</div>
                  <div className="text-[11px] font-bold text-emerald-300 leading-none mt-0.5">85%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (viewIndex === 1) {
    // Side angle view
    return (
      <div className="relative w-64 h-72 sm:w-72 sm:h-80 mx-auto flex items-center justify-center select-none">
        <div className="w-40 h-64 bg-gradient-to-r from-[#20252b] via-[#323942] to-[#15171b] rounded-[36px] shadow-2xl border border-slate-600/40 p-3 transform rotate-6 flex flex-col justify-between">
          <div className="text-center text-xs font-bold text-slate-300 pt-3">Watch Fit 3 Profile</div>
          <div className="w-full h-36 bg-[#03060a] rounded-2xl flex items-center justify-center border border-slate-800">
            <span className="text-emerald-400 font-mono text-xl font-bold">10:08</span>
          </div>
          <div className="text-[10px] text-center text-slate-400 pb-2">Slim Aluminium Case</div>
        </div>
      </div>
    );
  }

  if (viewIndex === 2) {
    // Back sensor view
    return (
      <div className="relative w-64 h-72 sm:w-72 sm:h-80 mx-auto flex items-center justify-center select-none">
        <div className="w-52 h-60 bg-gradient-to-b from-[#1b1f24] to-[#111317] rounded-[42px] shadow-2xl border border-slate-700 p-6 flex flex-col items-center justify-center gap-4">
          <div className="text-[10px] tracking-widest text-slate-400 font-bold">HUAWEI FIT 3 SENSORS</div>
          <div className="w-20 h-20 rounded-full bg-[#0a0c0f] border-2 border-emerald-500/40 flex items-center justify-center shadow-inner">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center animate-pulse">
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
            </div>
          </div>
          <div className="text-[11px] text-slate-300 font-medium">TrueSeen™ 5.5 Sensor</div>
        </div>
      </div>
    );
  }

  if (viewIndex === 3) {
    // Wrist Lifestyle View
    return (
      <div className="relative w-64 h-72 sm:w-72 sm:h-80 mx-auto flex items-center justify-center select-none">
        <div className="relative w-56 h-64 bg-gradient-to-b from-amber-100 to-amber-200/80 rounded-3xl p-4 flex flex-col items-center justify-center shadow-lg border border-amber-300/40">
          <div className="w-44 h-48 bg-[#181b20] rounded-[32px] p-2 shadow-2xl flex flex-col justify-between">
            <div className="text-center text-emerald-400 font-mono text-2xl font-bold pt-4">10:08</div>
            <div className="text-center text-[10px] text-slate-300 pb-3">Active On Wrist</div>
          </div>
        </div>
      </div>
    );
  }

  // Box / Packaging View
  return (
    <div className="relative w-64 h-72 sm:w-72 sm:h-80 mx-auto flex items-center justify-center select-none">
      <div className="w-52 h-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-5 flex flex-col items-center justify-between text-center">
        <div className="w-full flex justify-between items-center text-[10px] text-slate-400">
          <span>HUAWEI</span>
          <span>ORIGINAL</span>
        </div>
        <div className="w-24 h-28 bg-slate-900 rounded-2xl flex items-center justify-center shadow-md">
          <span className="text-white font-mono text-xs font-bold">Fit 3</span>
        </div>
        <div>
          <div className="font-bold text-slate-800 text-xs">Huawei Watch Fit 3</div>
          <div className="text-[10px] text-slate-400">Box & Magnetic Charger</div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// Main Component: ProductDetailPage
// ==========================================
export default function ProductDetailPage({ id, initialProduct }: Props) {
  const { addToCart, toggleWishlist, isWishlisted } = useShop();
  // ── States ──────────────────────────────
  /* API: استخدام كائن Product المستورد من @/types/product */
  const product: Product = initialProduct || INITIAL_PRODUCT;

  // Selected main gallery image index
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  // Quantity counter
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState<boolean>(false);

  // Wishlist favorite state from context
  const isFavorite = isWishlisted(product._id);
  const [favoritesMap, setFavoritesMap] = useState<Record<string, boolean>>({});

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      const ok = await addToCart(product._id, quantity);
      if (ok) {
        toast.success(`تمت إضافة ${quantity} من "${product.title.slice(0, 24)}" إلى السلة بنجاح`);
      } else {
        toast.info("يرجى تسجيل الدخول أولاً لإضافة المنتج إلى السلة");
      }
    } catch {
      toast.error("حدث خطأ أثناء إضافة المنتج إلى السلة");
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggleWishlist = async () => {
    setIsTogglingWishlist(true);
    try {
      await toggleWishlist(product._id);
      if (!isFavorite) {
        toast.success("تمت الإضافة إلى المفضلة");
      } else {
        toast.info("تمت الإزالة من المفضلة");
      }
    } catch {
      toast.error("حدث خطأ أثناء تعديل المفضلة");
    } finally {
      setIsTogglingWishlist(false);
    }
  };

  // Active tab in middle section: 'description' | 'specs' | 'reviews'
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews">("description");

  // Read more expandable toggle
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState<boolean>(false);

  // Price and Discount Calculation
  /* API: التحقق من وجود خصم وحساب السعر النهائي ونسبة الخصم - product.price & product.discountPrice */
  const hasDiscount =
    product.discountPrice !== undefined &&
    product.discountPrice > 0 &&
    product.discountPrice < product.price;

  const currentPrice = hasDiscount ? product.discountPrice! : product.price;
  const originalPrice = product.price;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 20;

  // Handlers
  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
  };

  const handleDecreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncreaseQuantity = () => {
    /* API: التحقق من ألا تتعدى الكمية المطلوبة كمية المخزون المتاحة - product.stock */
    if (quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const toggleRelatedFavorite = (productId: string) => {
    setFavoritesMap((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-['Cairo'] text-right">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white pb-16">
        <nav
          className="flex items-center gap-1.5 text-base sm:text-lg text-ink-primary py-3"
          aria-label="breadcrumb"
        >
          <Link href="/" className="flex items-center gap-1 hover:text-[#D49B35] transition-colors">
            <Home className="w-4 h-4" />
            <span>الرئيسية</span>
          </Link>
          <ChevronRightBreadcrumb className="w-3.5 h-3.5 text-slate-400 rotate-180" />
          <span className="text-primary font-bold">المنتجات</span>
          <ChevronRightBreadcrumb className="w-3.5 h-3.5 text-slate-400 rotate-180" />
          <span className="text-primary font-bold">
            {/* API: اسم القسم الرئيسي - product.category.name */}
            {product.category?.title || "الالكترونيات"}
          </span>
          <ChevronRightBreadcrumb className="w-3.5 h-3.5 text-slate-400 rotate-180" />
          <span className="text-primary font-bold">
            {/* API: اسم القسم الفرعي - product.subcategory.name */}
            {product.subcategory?.name || "الساعات الذكيه"}
          </span>
        </nav>

        {/* ========================================================= */}
        {/* 1. SECTION: Main Product Showcase Card (قسم المنتج الرئيسي) */}
        {/* ========================================================= */}
        <section
          aria-label="تفاصيل المنتج الرئيسية"
          className="mt-2 rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-6 lg:p-8 shadow-xs"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* ─────────────────────────────────────────────────────────── */}
            {/* Right Column: Title, Rating, Price, Specs, CTA (تفاصيل الشراء) */}
            {/* ─────────────────────────────────────────────────────────── */}
            <div className="lg:col-span-7 flex flex-col justify-between h-full order-1">
              {/* Category & Brand Header Row */}
              <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500 mb-2">
                {/* API: الفئة الرئيسية - product.category.name */}
                <span className="text-slate-600 hover:text-slate-900 cursor-pointer transition-colors">
                  الكترونيات.
                </span>

                {/* API: اسم العلامة التجارية / الشركة المصنعة */}
                <span className="font-semibold text-slate-700">Huawei</span>
              </div>

              {/* Product Title */}
              {/* API: اسم وعنوان المنتج بالكامل - product.title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight mb-2 leading-tight">
                {product.title}
              </h1>

              {/* Rating & Reviews Row */}
              <div className="flex items-center gap-2 mb-3 text-xs sm:text-sm">
                {/* Golden Stars Rating */}
                <div className="flex items-center gap-0.5 text-amber-400" aria-label="تقييم 5 من 5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                {/* API: متوسط التقييم وعدد المقيمين - product.averageRating و product.numReviews */}
                <span className="text-slate-500 font-medium">
                  ({product.averageRating}) {product.numReviews} تقييم
                </span>
              </div>

              {/* Short Description */}
              {/* API: نبذة وصفية سريعة للمنتج - product.discription */}
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                تصميم أنيق وأداء متكامل لمتابعة صحتك ونشاطك اليومي، تتميز الساعة بشاشة AMOLED عالية الدقة، وتدعم أكثر من 100 وضع رياضي.
              </p>

              {/* Price & Discount Row */}
              <div className="flex items-center gap-3 sm:gap-4 mb-2">
                {/* API: السعر الحالي بعد الخصم - product.discountPrice أو product.price */}
                <span className="text-2xl sm:text-3xl font-black text-[#111827] tracking-tight">
                  {currentPrice.toLocaleString("en-US")} EGP
                </span>

                {/* API: السعر الأصلي المشطوب قبل الخصم - product.price */}
                {hasDiscount && (
                  <span className="line-through text-slate-400 text-sm sm:text-base font-medium">
                    {originalPrice.toLocaleString("en-US")} EGP
                  </span>
                )}

                {/* API: شارة نسبة الخصم المحسوبة */}
                {discountPercent > 0 && (
                  <span className="rounded-md bg-[#EF4444] px-2.5 py-1 text-xs font-bold text-white shadow-xs">
                    خصم {discountPercent}%
                  </span>
                )}
              </div>

              {/* Stock Status */}
              {/* API: حالة التوفر بالمخزون والكمية - product.stock */}
              <div className="flex items-center gap-2 mb-6 text-xs sm:text-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="font-bold text-emerald-700">
                  {product.stock > 0 ? "متوفر في المخزون" : "غير متوفر بالمخزون"}
                </span>
              </div>

              {/* 4 Feature Highlights Grid */}
              {/* API: الخصائص السريعة الأربعة - PRODUCT_HIGHLIGHTS */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
                {PRODUCT_HIGHLIGHTS.map((hl) => {
                  const Icon = hl.icon;
                  return (
                    <div
                      key={hl.id}
                      className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3 text-center flex flex-col items-center justify-center hover:border-slate-300 transition-colors"
                    >
                      <Icon className="w-5 h-5 text-slate-600 mb-1" />
                      <span className="text-[11px] text-slate-600 leading-tight">{hl.label}</span>
                      <span className="text-xs font-bold text-slate-900 mt-0.5">{hl.value}</span>
                    </div>
                  );
                })}
              </div>

              {/* Quantity Selector Row */}
              <div className="flex items-center justify-between mb-4 pt-1">
                <span className="text-sm font-bold text-slate-900">الكمية</span>
                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white shadow-xs">
                  <button
                    type="button"
                    onClick={handleIncreaseQuantity}
                    aria-label="زيادة الكمية"
                    className="p-2 sm:px-3 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-1 text-sm font-bold text-slate-900 min-w-[36px] text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={handleDecreaseQuantity}
                    aria-label="تقليل الكمية"
                    className="p-2 sm:px-3 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Add To Cart Primary CTA Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isAdding}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#F25822] hover:bg-[#d94a18] text-white py-3 sm:py-3.5 text-base sm:text-lg font-bold shadow-sm hover:shadow-md transition-all active:scale-[0.99] cursor-pointer mb-3 disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isAdding ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>جاري الإضافة...</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    <span>أضف إلى السلة</span>
                  </>
                )}
              </button>

              {/* Secondary Actions: Comparison & Add to Wishlist */}
              <div className="grid grid-cols-2 gap-3">
                {/* Compare Button */}
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-300/80 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
                >
                  <ArrowLeftRight className="w-4 h-4 text-slate-500" />
                  <span>مقارنة المنتج</span>
                </button>

                {/* Add to Wishlist Button */}
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
                  <span>{isFavorite ? "في المفضلة" : "إضافة إلى المفضلة"}</span>
                </button>
              </div>
            </div>

            {/* ─────────────────────────────────────────────────────────── */}
            {/* Left Column: Image Gallery & Trust Badges (معرض الصور والضمان) */}
            {/* ─────────────────────────────────────────────────────────── */}
            <div className="lg:col-span-5 flex flex-col order-2">
              {/* Main Image Stage */}
              <div className="relative aspect-square w-full rounded-2xl border border-slate-200/90 bg-[#F9FAFB] p-4 flex items-center justify-center overflow-hidden">
                {/* Discount Badge on Main Image */}
                {/* API: نسبة الخصم - discountPercent */}
                {discountPercent > 0 && (
                  <span className="absolute top-3 right-3 z-20 rounded-md bg-[#EF4444] px-2.5 py-1 text-xs font-bold text-white shadow-xs">
                    خصم {discountPercent}%
                  </span>
                )}

                {/* Carousel Previous Arrow Button */}
                <button
                  type="button"
                  onClick={handlePrevImage}
                  aria-label="الصورة السابقة"
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/90 border border-slate-200 shadow-xs flex items-center justify-center text-slate-600 hover:bg-white hover:text-slate-900 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Carousel Next Arrow Button */}
                <button
                  type="button"
                  onClick={handleNextImage}
                  aria-label="الصورة التالية"
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/90 border border-slate-200 shadow-xs flex items-center justify-center text-slate-600 hover:bg-white hover:text-slate-900 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Main Product Visual / Image */}
                {/* API: رابط الصورة الرئيسية الحالية - product.image[selectedImageIndex].secure_url */}
                <div className="w-full h-full flex items-center justify-center transition-all duration-300">
                  <WatchProductVisual viewIndex={selectedImageIndex} />
                </div>
              </div>

              {/* Thumbnails Row */}
              {/* API: مصفوفة صور المنتج المصغرة - product.image */}
              <div className="grid grid-cols-5 gap-2 mt-3" aria-label="صور المنتج المصغرة">
                {product.images.map((img, idx) => (
                  <button
                    key={img.public_id || idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`aspect-square rounded-xl border p-1 bg-white flex items-center justify-center transition-all cursor-pointer overflow-hidden ${
                      selectedImageIndex === idx
                        ? "border-slate-900 ring-2 ring-slate-900/10 shadow-sm"
                        : "border-slate-200 hover:border-slate-400 opacity-80 hover:opacity-100"
                    }`}
                  >
                    {/* Thumbnail Preview */}
                    <div className="scale-[0.28] origin-center w-full h-full flex items-center justify-center pointer-events-none">
                      <WatchProductVisual viewIndex={idx} />
                    </div>
                  </button>
                ))}
              </div>

              {/* 4 Trust & Guarantee Badges */}
              {/* API: سياسات ومزايا المتجر والضمان */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-2">
                {/* 1. Safe Payment */}
                <div className="rounded-xl border border-slate-200/90 bg-white p-2.5 text-center flex flex-col items-center justify-center">
                  <Shield className="w-5 h-5 text-slate-700 mb-1" />
                  <span className="text-[11px] font-bold text-slate-900 leading-tight">دفع آمن</span>
                  <span className="text-[10px] text-slate-500 mt-0.5">بجميع وسائل الدفع</span>
                </div>

                {/* 2. Return & Exchange */}
                <div className="rounded-xl border border-slate-200/90 bg-white p-2.5 text-center flex flex-col items-center justify-center">
                  <RotateCcw className="w-5 h-5 text-slate-700 mb-1" />
                  <span className="text-[11px] font-bold text-slate-900 leading-tight">إرجاع واستبدال</span>
                  <span className="text-[10px] text-slate-500 mt-0.5">خلال 14 يوماً</span>
                </div>

                {/* 3. Fast Shipping */}
                <div className="rounded-xl border border-slate-200/90 bg-white p-2.5 text-center flex flex-col items-center justify-center">
                  <Truck className="w-5 h-5 text-slate-700 mb-1" />
                  <span className="text-[11px] font-bold text-slate-900 leading-tight">شحن سريع</span>
                  <span className="text-[10px] text-slate-500 mt-0.5">لجميع المحافظات</span>
                </div>

                {/* 4. Certified Warranty */}
                <div className="rounded-xl border border-slate-200/90 bg-white p-2.5 text-center flex flex-col items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-slate-700 mb-1" />
                  <span className="text-[11px] font-bold text-slate-900 leading-tight">ضمان معتمد</span>
                  <span className="text-[10px] text-slate-500 mt-0.5">من الوكيل الرسمي</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 2. SECTION: Product Details, Tabs & Sidebar (تفاصيل ومواصفات) */}
        {/* ========================================================= */}
        <section aria-label="مواصفات ومعلومات الشحن" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* ─────────────────────────────────────────────────────────── */}
            {/* Right Card: Tabs (الوصف - المواصفات - مراجعات العملاء)      */}
            {/* ─────────────────────────────────────────────────────────── */}
            <div className="lg:col-span-8 rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs order-1">
              {/* Tab Navigation Headers */}
              <div className="flex items-center gap-6 border-b border-slate-200 pb-3 text-sm sm:text-base font-bold">
                {/* Tab 1: الوصف */}
                <button
                  type="button"
                  onClick={() => setActiveTab("description")}
                  className={`relative pb-3 -mb-3 transition-colors cursor-pointer ${
                    activeTab === "description"
                      ? "text-[#111827] border-b-2 border-[#111827]"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  الوصف
                </button>

                {/* Tab 2: المواصفات */}
                <button
                  type="button"
                  onClick={() => setActiveTab("specs")}
                  className={`relative pb-3 -mb-3 transition-colors cursor-pointer ${
                    activeTab === "specs"
                      ? "text-[#111827] border-b-2 border-[#111827]"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  المواصفات
                </button>

                {/* Tab 3: مراجعات العملاء */}
                {/* API: عدد التقييمات في التبويب - product.numReviews */}
                <button
                  type="button"
                  onClick={() => setActiveTab("reviews")}
                  className={`relative pb-3 -mb-3 transition-colors cursor-pointer ${
                    activeTab === "reviews"
                      ? "text-[#111827] border-b-2 border-[#111827]"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  مراجعات العملاء ({product.numReviews > 0 ? "128" : "0"})
                </button>
              </div>

              {/* Tab 1 Content: Description */}
              {activeTab === "description" && (
                <div className="pt-5 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-4">
                  {/* Paragraph 1 */}
                  {/* API: الوصف الكامل والتفصيلي للمنتج - product.discription */}
                  <p>{product.description}</p>

                  {/* Bullet Points List */}
                  {/* API: قائمة مميزات المنتج البارزة */}
                  <ul className="space-y-2.5 pr-1">
                    {PRODUCT_BULLET_POINTS.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-slate-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Expanded Additional Description (when Read More is toggled) */}
                  {isDescriptionExpanded && (
                    <div className="pt-2 space-y-3 text-slate-600 border-t border-slate-100 mt-3 animate-fadeIn">
                      <p>
                        تتميز الساعة بمستشعر TruSeen™ 5.5 المتطور لمراقبة الأكسجين في الدم ونبضات القلب بدقة متناهية،
                        بالإضافة إلى إمكانية إجراء المكالمات عبر البلوتوث والرد السريع على الرسائل، مما يجعلها المساعد
                        الشخصي المثالي على معصمك طوال اليوم.
                      </p>
                    </div>
                  )}

                  {/* Read More / Read Less Toggle */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setIsDescriptionExpanded((prev) => !prev)}
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-bold text-xs sm:text-sm cursor-pointer transition-colors"
                    >
                      <span>{isDescriptionExpanded ? "عرض أقل" : "اقرأ المزيد"}</span>
                      {isDescriptionExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 2 Content: Specifications */}
              {/* API: جدول المواصفات الفنية الكاملة */}
              {activeTab === "specs" && (
                <div className="pt-5">
                  <div className="divide-y divide-slate-100 text-xs sm:text-sm">
                    {PRODUCT_SPECIFICATIONS.map((spec, idx) => (
                      <div key={idx} className="py-2.5 flex justify-between items-center">
                        <span className="text-slate-500 font-medium">{spec.label}</span>
                        <span className="text-slate-900 font-semibold">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3 Content: Customer Reviews */}
              {/* API: قائمة مراجعات وتقييمات العملاء */}
              {activeTab === "reviews" && (
                <div className="pt-5 space-y-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-black text-slate-900">4.5 / 5.0</div>
                      <div className="text-xs text-slate-500 mt-0.5">بناءً على 128 تقييم موثق من المشترين</div>
                    </div>
                    <div className="flex gap-0.5 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-amber-400" />
                      ))}
                    </div>
                  </div>

                  {/* Sample Review Item */}
                  <div className="border-b border-slate-100 pb-3 text-xs sm:text-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900">محمد أحمد</span>
                      <span className="text-slate-400 text-xs">منذ أسبوع</span>
                    </div>
                    <div className="flex gap-0.5 text-amber-400 mb-1.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-slate-600">
                      الساعة ممتازة جداً وخفيفة على اليد والشاشة ألوانها مبهجة وواضحة تحت الشمس، والبطارية كملت معايا
                      أسبوع كامل بدون شحن. أنصح بها بشدة.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* ─────────────────────────────────────────────────────────── */}
            {/* Left Column: Brand Box & Shipping Details (البراند ومعلومات الشحن) */}
            {/* ─────────────────────────────────────────────────────────── */}
            <div className="lg:col-span-4 flex flex-col gap-4 order-2">
              {/* Brand Information Box */}
              {/* API: بيانات واسم وشعار العلامة التجارية */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">العلامة التجارية</span>
                <HuaweiLogo />
              </div>

              {/* Shipping & Delivery Details Box */}
              {/* API: معلومات الشحن والتوصيل والإرجاع */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
                <h2 className="text-sm sm:text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                  معلومات الشحن والتوصيل
                </h2>

                <div className="space-y-4 text-xs sm:text-sm">
                  {/* Delivery Time */}
                  <div className="flex items-start gap-3">
                    <Truck className="w-5 h-5 text-slate-700 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-900">{SHIPPING_INFO.deliveryTime}</div>
                      <div className="text-slate-500 text-[11px] mt-0.5">
                        {SHIPPING_INFO.deliveryScope}
                      </div>
                    </div>
                  </div>

                  {/* Shipping Fee */}
                  <div className="flex items-start gap-3">
                    <CreditCard className="w-5 h-5 text-slate-700 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-900">{SHIPPING_INFO.shippingFeeNote}</div>
                      <div className="text-slate-500 text-[11px] mt-0.5">
                        {SHIPPING_INFO.shippingFeeDetail}
                      </div>
                    </div>
                  </div>

                  {/* Return Policy */}
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
        {/* 3. SECTION: Related Products ("منتجات ذات صلة")            */}
        {/* ========================================================= */}
        <section aria-label="منتجات ذات صلة" className="mt-8">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs">
            {/* Header: Title, Subtitle, and Carousel Arrow */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">منتجات ذات صلة</h2>
                <p className="text-xs text-slate-400 mt-0.5">قد تعجبك أيضاً</p>
              </div>

              {/* Carousel Left Navigation Arrow Button */}
              <button
                type="button"
                aria-label="عرض المزيد من المنتجات ذات الصلة"
                className="w-8 h-8 rounded-full border border-slate-200 shadow-xs flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            {/* 5 Product Cards Grid */}
            {/* API: قائمة المنتجات المقترحة ذات الصلة - relatedProducts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {RELATED_PRODUCTS.map((relProduct) => {
                const isItemFavorite = favoritesMap[relProduct._id] || false;

                return (
                  <article
                    key={relProduct._id}
                    className="group relative rounded-2xl border border-slate-200/90 bg-white p-3.5 text-center shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    {/* Top-Left Wishlist Heart Icon */}
                    <button
                      type="button"
                      onClick={() => toggleRelatedFavorite(relProduct._id)}
                      aria-label="أضف إلى المفضلة"
                      className="absolute left-3 top-3 z-10 w-7 h-7 rounded-full bg-white/90 border border-slate-200 shadow-xs flex items-center justify-center hover:bg-white transition-colors cursor-pointer"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 transition-colors ${
                          isItemFavorite ? "fill-red-500 text-red-500" : "text-slate-400"
                        }`}
                      />
                    </button>

                    {/* Product Image Stage */}
                    {/* API: صورة المنتج ذي الصلة */}
                    <div className="relative aspect-square w-full rounded-xl bg-slate-50 flex items-center justify-center overflow-hidden mb-3">
                      {relProduct.brand === "Anker" && (
                        <div className="w-24 h-24 bg-white rounded-2xl shadow-sm border border-slate-200 p-2 flex flex-col items-center justify-center">
                          <div className="w-14 h-10 bg-slate-100 rounded-full border border-slate-300 flex items-center justify-center shadow-inner">
                            <div className="w-3 h-3 bg-slate-400 rounded-full" />
                          </div>
                          <span className="text-[9px] text-slate-400 mt-1">Soundcore</span>
                        </div>
                      )}

                      {relProduct.brand === "JBL" && (
                        <div className="w-24 h-24 bg-[#181a1d] rounded-2xl shadow-sm border border-slate-700 p-2 flex flex-col items-center justify-center">
                          <div className="w-14 h-10 bg-[#0f1114] rounded-full border border-slate-600 flex items-center justify-center shadow-inner">
                            <div className="w-3 h-3 bg-slate-500 rounded-full" />
                          </div>
                          <span className="text-[9px] text-slate-400 mt-1">JBL Tune</span>
                        </div>
                      )}

                      {relProduct.brand === "Xiaomi" && (
                        <div className="w-12 h-24 bg-[#1a1d24] rounded-full shadow-md border border-slate-700 p-1 flex flex-col items-center justify-between">
                          <div className="w-2 h-2 bg-slate-600 rounded-full mt-1" />
                          <div className="text-[9px] font-mono text-amber-400 font-bold">10:08</div>
                          <div className="w-2 h-2 bg-slate-600 rounded-full mb-1" />
                        </div>
                      )}

                      {relProduct.brand === "Samsung" && (
                        <div className="w-16 h-28 bg-gradient-to-tr from-slate-200 via-indigo-100 to-indigo-200 rounded-2xl shadow-md border border-slate-300 p-1.5 flex flex-col justify-between">
                          <div className="flex gap-1 justify-start">
                            <div className="w-2 h-2 rounded-full bg-slate-800" />
                            <div className="w-2 h-2 rounded-full bg-slate-800" />
                            <div className="w-2 h-2 rounded-full bg-slate-800" />
                          </div>
                          <div className="text-[9px] font-bold text-center text-slate-700">Galaxy A55</div>
                        </div>
                      )}

                      {relProduct.brand === "Ugreen" && (
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-700 shadow-md flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full border border-dashed border-slate-500 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-emerald-400" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Brand Name */}
                    {/* API: اسم الماركة - item.brand */}
                    <div className="text-[11px] text-slate-400 text-right mb-1">
                      {relProduct.brand}
                    </div>

                    {/* Product Title */}
                    {/* API: عنوان المنتج - item.title */}
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate mb-1.5 text-right">
                      {relProduct.title}
                    </h3>

                    {/* Ratings */}
                    {/* API: التقييم وعدد المراجعات - item.rating & item.reviewsCount */}
                    <div className="flex items-center justify-start gap-1 text-[11px] text-slate-500 mb-2">
                      <span>({relProduct.rating})</span>
                      <div className="flex text-amber-400">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <Star className="w-3 h-3 fill-amber-400" />
                      </div>
                      <span className="text-slate-400">{relProduct.reviewsCount}</span>
                    </div>

                    {/* Price */}
                    {/* API: السعر - item.price */}
                    <div className="text-right mb-3">
                      <span className="text-sm sm:text-base font-black text-slate-900">
                        {relProduct.price.toLocaleString("en-US")} EGP
                      </span>
                    </div>

                    {/* Add To Cart Button */}
                    <button
                      type="button"
                      className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-[#F25822] hover:bg-[#d94a18] text-white py-2 text-xs sm:text-sm font-bold shadow-xs hover:shadow-sm transition-all cursor-pointer"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>أضف إلى السلة</span>
                    </button>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}