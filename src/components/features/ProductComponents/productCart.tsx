'use client';

import { Product } from "@/types/product";
import { Heart, ShoppingCart, Star, Loader2, ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useShop } from "@/context/ShopContext";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: Product;
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${rating} من 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i <= Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-slate-200 text-slate-200"
          }`}
        />
      ))}
    </span>
  );
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, toggleWishlist, isWishlisted } = useShop();
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);

  const { title, price, discountPrice, averageRating, numReviews, _id } = product;
  const isFav = isWishlisted(_id);

  const hasDiscount = discountPrice !== undefined && discountPrice > 0 && discountPrice < price;
  const finalPrice = hasDiscount ? discountPrice : price;
  const discountPercent = hasDiscount ? Math.round(((price - discountPrice) / price) * 100) : 0;
  const API_ORIGIN = process.env.NEXT_PUBLIC_API_ORIGIN ?? '';
  const imgSrc = (url?: string) => !url ? '' : url.startsWith('http') || url.startsWith('data:') ? url : `${API_ORIGIN}${url}`;
  const isNew = !hasDiscount && !product.isFeatured && (product.stock ?? 0) > 20;

  const handleAddToCart = async () => {
  const needsOptions = (product.colors?.length ?? 0) > 0 || (product.sizes?.length ?? 0) > 0;

  if (needsOptions) {
    toast.info("اختر المقاس واللون أولاً");
    router.push(`/product/${_id}`);
    return;
  }

  setIsAdding(true);
  try {
    const res = await addToCart(_id, 1);
    if (res) {
      toast.success(`تمت إضافة "${title.slice(0, 24)}" إلى السلة بنجاح`);
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
    setIsTogglingWishlist(true);
    try {
      await toggleWishlist(_id);
      if (!isFav) {
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

  return (
    <article className="group relative w-full rounded-2xl border border-slate-200 bg-white p-3.5 text-center shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
      {/* Badge Top-Right */}
      {hasDiscount ? (
        <span className="absolute right-3 top-3 z-10 rounded-md bg-[#EF4444] px-2.5 py-0.5 text-xs font-bold text-white shadow-xs">
          خصم {discountPercent}%
        </span>
      ) : product.isFeatured ? (
        <span className="absolute right-3 top-3 z-10 rounded-md bg-[#F97316] px-2.5 py-0.5 text-xs font-bold text-white shadow-xs">
          الأكثر مبيعاً
        </span>
      ) : isNew ? (
        <span className="absolute right-3 top-3 z-10 rounded-md bg-[#10B981] px-2.5 py-0.5 text-xs font-bold text-white shadow-xs">
          جديد
        </span>
      ) : null}

      {/* Wishlist Heart Top-Left */}
      <button
        type="button"
        onClick={handleToggleWishlist}
        disabled={isTogglingWishlist}
        aria-label="أضف إلى المفضلة"
        aria-pressed={isFav}
        className="absolute cursor-pointer left-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-full bg-white/90 border border-slate-100 shadow-xs hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-900 transition-colors"
      >
        <Heart
          className={`h-4.5 w-4.5 transition-colors ${
            isFav ? "fill-red-600 text-red-600" : "text-slate-400 group-hover:text-slate-600"
          }`}
          strokeWidth={2}
        />
      </button>

      {/* Image */}
      <Link href={`/product/${_id}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-slate-50 flex items-center justify-center">
          {product.images?.[0]?.secure_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imgSrc(product.images[0].secure_url)} alt={product.title} className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="w-4 h-4 text-slate-400" />
          )}
        </div>
      </Link>

      {/* Stars Rating */}
      <div className="mt-3 flex items-center justify-center gap-1.5">
        <Stars rating={averageRating ?? 0} />
        <span className="text-xs text-slate-400">({numReviews ?? 0})</span>
      </div>

      {/* Title */}
      <Link href={`/product/${_id}`} className="block">
        <h3 className="my-1.5 text-base font-bold text-primary truncate hover:text-[#D49B35] transition-colors" title={title}>
          {title}
        </h3>
      </Link>

      {/* Price */}
      <div className="mb-3 flex items-baseline justify-center gap-2">
        <span className="text-xl font-black text-primary">
          {finalPrice.toLocaleString('ar-EG')} <small className="text-xs font-semibold text-slate-500">ج.م</small>
        </span>
        {hasDiscount && (
          <del className="text-xs font-medium text-slate-400">
            {price.toLocaleString('ar-EG')} ج.م
          </del>
        )}
      </div>

      {/* Add To Cart Button */}
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={isAdding}
        className="flex w-full items-center cursor-pointer justify-center gap-2 rounded-xl bg-[#F25822] hover:bg-[#d94a18] py-2 text-sm sm:text-base font-bold text-white transition-all shadow-xs hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-900 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isAdding ? (
          <>
            <Loader2 className="h-4.5 w-4.5 animate-spin" />
            جاري الإضافة...
          </>
        ) : (
          <>
            <ShoppingCart className="h-4.5 w-4.5" strokeWidth={2.2} />
            أضف إلى السلة
          </>
        )}
      </button>
    </article>
  );
}