"use server";

import { getAccessToken } from "@/utilities/utilite";

const getBaseUrl = () =>
  (
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.BASE_URL ||
    "http://localhost:5000/api"
  )
    .trim()
    .replace(/;+$/, "")
    .replace(/\/api$/, "") + "/api";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface CartProductRef {
  _id: string;
  title: string;
  price: number;
  images: { public_id: string; secure_url: string }[];
}

export interface CartItem {
  _id: string;
  product: CartProductRef;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
}

export interface Cart {
  _id: string;
  items: CartItem[];
}

// ─── GET /cart ────────────────────────────────────────────────────────────────

export async function getLoggedUserCart(): Promise<
  { success: true; data: Cart } | { success: false; data: null }
> {
  const token = await getAccessToken();
  if (!token) return { success: false, data: null };

  try {
    const res = await fetch(`${getBaseUrl()}/cart`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) return { success: false, data: null };

    return {
      success: true,
      data: {
        _id: data?.data?._id ?? data?._id ?? "",
        items: data?.data?.items ?? data?.items ?? [],
      },
    };
  } catch {
    return { success: false, data: null };
  }
}

// ─── POST /cart ───────────────────────────────────────────────────────────────

export async function AddToCart(payload: {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
}) {
  const token = await getAccessToken();
  if (!token) return { success: false, message: "Please login to add items to your cart" };

  try {
    const res = await fetch(`${getBaseUrl()}/cart`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    return { success: res.ok, message: data?.message };
  } catch {
    return { success: false, message: "Failed to add to cart" };
  }
}

// ─── DELETE /cart/:productId ──────────────────────────────────────────────────

export async function RemoveProduct(
  productId: string,
  size?: string,
  color?: string,
) {
  const token = await getAccessToken();
  if (!token) return { success: false, message: "Please login" };

  try {
    const params = new URLSearchParams();
    if (size) params.append("size", size);
    if (color) params.append("color", color);
    const query = params.toString() ? `?${params.toString()}` : "";

    const res = await fetch(`${getBaseUrl()}/cart/${productId}${query}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json().catch(() => null);
    return { success: res.ok, message: data?.message };
  } catch {
    return { success: false, message: "Could not remove item" };
  }
}

// ─── PUT /cart/:cartId ────────────────────────────────────────────────────────

export async function UpdateProductQuantity(
  cartId: string,
  productId: string,
  quantity: number,
  size?: string,
  color?: string,
) {
  const token = await getAccessToken();
  if (!token) return { success: false, message: "Please login" };

  try {
    const res = await fetch(`${getBaseUrl()}/cart/${cartId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId, quantity, size, color }),
    });

    const data = await res.json();
    return { success: res.ok, message: data?.message };
  } catch {
    return { success: false, message: "Failed to update quantity" };
  }
}
