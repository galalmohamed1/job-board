"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useSession } from "next-auth/react";
import { Product } from "@/types/product";
import {
  CartItem,
  getLoggedUserCart,
  AddToCart,
  RemoveProduct,
  UpdateProductQuantity,
} from "@/action/cart.action";
import {
  AddToWishlist,
  getLoggedUserWishlist,
  RemoveFromWishlist,
} from "@/action/wishlist.action";
import { getAllProducts } from "@/app/api/services/product.services";
import { Category } from "@/types/category";
import { getCategories } from "@/app/api/services/category.services";

// ─── Context Shape ────────────────────────────────────────────────────────────

interface ShopContextType {
  // Products
  products: Product[];
  isProductsLoading: boolean;

  // Category
  categories: Category[];
  isCategoriesLoading: boolean;
  // Cart
  cart: CartItem[];
  cartId: string | null;
  cartCount: number;
  cartSubtotal: number;
  isCartLoading: boolean;
  addToCart: (productId: string, quantity?: number, size?: string, color?: string) => Promise<boolean>;
  removeFromCart: (productId: string, size?: string, color?: string) => Promise<void>;
  updateQuantity: (productId: string, delta: number, size?: string, color?: string) => Promise<void>;
  updatingItemId: string | null;
  refreshCart: () => Promise<void>;

  // Wishlist
  wishlist: string[];
  wishlistCount: number;
  isWishlistLoading: boolean;
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (productId: string) => Promise<void>;
  refreshWishlist: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ShopContext = createContext<ShopContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();

  // Products
  const [products, setProducts] = useState<Product[]>([]);
  const [isProductsLoading, setIsProductsLoading] = useState(true);

  //Category 
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);

  // Cart
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartId, setCartId] = useState<string | null>(null);
  const [isCartLoading, setIsCartLoading] = useState(false);
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  // Prevent duplicate fetches on auth change
  const prevStatus = useRef<string>("");

  // ── Fetch products (public, always) ────────────────────────────────────────

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await getAllProducts();
        if (alive && Array.isArray(data)) setProducts(data);
      } catch {
        /* silent */
      } finally {
        if (alive) setIsProductsLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);
  // ── Fetch Category (public, always) ────────────────────────────────────────
  useEffect(() => {
    const fetchCategort = async () => {
      try {
        const data = await getCategories();
        console.log("CATEGORIES", data);
        if (Array.isArray(data)) setCategories(data);
      } catch (error) {
        console.error("Failed to fetch Categort:", error);
      } finally {
        setIsCategoriesLoading(false);
      }
    };
    fetchCategort();
  }, []);

  // ── Refresh cart ────────────────────────────────────────────────────────────

  const refreshCart = useCallback(async () => {
    setIsCartLoading(true);
    try {
      const res = await getLoggedUserCart();
      if (res.success && res.data) {
        setCart(res.data.items ?? []);
        setCartId(res.data._id ?? null);
      } else {
        setCart([]);
        setCartId(null);
      }
    } catch {
      setCart([]);
      setCartId(null);
    } finally {
      setIsCartLoading(false);
    }
  }, []);

  // ── Refresh wishlist ────────────────────────────────────────────────────────

  const refreshWishlist = useCallback(async () => {
    setIsWishlistLoading(true);
    try {
      const res = await getLoggedUserWishlist();
      if (Array.isArray(res?.data)) {
        const ids = res.data
          .map((item: any) => (typeof item === "string" ? item : item?.product?._id ?? item?._id))
          .filter(Boolean) as string[];
        setWishlist(ids);
      } else {
        setWishlist([]);
      }
    } catch {
      setWishlist([]);
    } finally {
      setIsWishlistLoading(false);
    }
  }, []);

  // ── Load user data on auth change ───────────────────────────────────────────

  useEffect(() => {
    if (status === prevStatus.current) return;
    prevStatus.current = status;

    if (status === "authenticated") {
      refreshCart();
      refreshWishlist();
    } else if (status === "unauthenticated") {
      setCart([]);
      setCartId(null);
      setWishlist([]);
    }
  }, [status, refreshCart, refreshWishlist]);

  // ── Cart actions ────────────────────────────────────────────────────────────

  const addToCart = useCallback(
  async (productId: string, quantity = 1, size?: string, color?: string) => {
    const res = await AddToCart({ productId, quantity, size, color });
    if (res.success) await refreshCart();
    return res.success;
  },
  [refreshCart],
);

  const removeFromCart = useCallback(
    async (productId: string, size?: string, color?: string) => {
      const res = await RemoveProduct(productId, size, color);
      if (res.success) await refreshCart();
    },
    [refreshCart],
  );

  const updateQuantity = useCallback(
    async (productId: string, delta: number, size?: string, color?: string) => {
      if (!cartId) return;
      const item = cart.find(
        (i) => i.product._id === productId || i._id === productId,
      );
      if (!item) return;

      const newQty = (item.quantity ?? 1) + delta;
      if (newQty < 1) return;

      setUpdatingItemId(productId);
      try {
        const res = await UpdateProductQuantity(cartId, productId, newQty, size, color);
        if (res.success) await refreshCart();
      } finally {
        setUpdatingItemId(null);
      }
    },
    [cart, cartId, refreshCart],
  );

  // ── Wishlist actions ────────────────────────────────────────────────────────

  const isWishlisted = useCallback(
    (productId: string) => wishlist.includes(productId),
    [wishlist],
  );

  const toggleWishlist = useCallback(
    async (productId: string) => {
      const already = wishlist.includes(productId);
      if (already) {
        setWishlist((prev) => prev.filter((id) => id !== productId));
        await RemoveFromWishlist(productId);
      } else {
        setWishlist((prev) => (prev.includes(productId) ? prev : [...prev, productId]));
        await AddToWishlist(productId);
      }
    },
    [wishlist],
  );

  // ── Derived values ──────────────────────────────────────────────────────────

  const cartCount = useMemo(
    () => cart.reduce((total, item) => total + (item.quantity ?? 0), 0),
    [cart],
  );

  const cartSubtotal = useMemo(
    () => cart.reduce((total, item) => total + (item.price ?? 0) * (item.quantity ?? 0), 0),
    [cart],
  );

  const wishlistCount = wishlist.length;

  // ── Value ───────────────────────────────────────────────────────────────────

  const value = useMemo<ShopContextType>(
    () => ({
      products,
      isProductsLoading,
      cart,
      cartId,
      cartCount,
      cartSubtotal,
      isCartLoading,
      addToCart,
      removeFromCart,
      updateQuantity,
      updatingItemId,
      refreshCart,
      wishlist,
      wishlistCount,
      isWishlistLoading,
      isWishlisted,
      toggleWishlist,
      refreshWishlist,
      categories,
      isCategoriesLoading
    }),
    [
      products, isProductsLoading,
      categories, isCategoriesLoading,
      cart, cartId, cartCount, cartSubtotal, isCartLoading,
      addToCart, removeFromCart, updateQuantity, updatingItemId, refreshCart,
      wishlist, wishlistCount, isWishlistLoading, isWishlisted, toggleWishlist, refreshWishlist,
    ],
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used within ShopProvider");
  return ctx;
}
