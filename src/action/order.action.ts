"use server";

import {
  ActionResult,
  OrderItemInput,
  OrderStatus,
  RawCartItem,
  ShippingAddress,
  ShippingInfo,
} from "@/types/order";
import { getAccessToken } from "@/utilities/utilite";

const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api"}`;

// helper داخلي: بيجيب الـ token ويبعت الطلب ويرجّع نتيجة موحدة
async function request<T = unknown>(
  path: string,
  init: RequestInit = {},
): Promise<ActionResult<T>> {
  try {
    const token = await getAccessToken();
    if (!token) {
      return { success: false, message: "Please login first" };
    }

    const res = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(init.headers || {}),
      },
      cache: "no-store",
    });

    const data = await res.json().catch(() => null);

    if (!res.ok || data?.success === false) {
      console.error(
        `${init.method ?? "GET"} ${path} failed:`,
        res.status,
        data,
      );
      return { success: false, message: data?.message || "Request failed" };
    }

    return {
      success: true,
      data: (data?.data ?? data) as T,
      message: data?.message,
    };
  } catch (err) {
    console.error(`${path} error:`, err);
    return {
      success: false,
      message: (err as Error).message || "An unexpected error occurred",
    };
  }
}

// GET /api/shipping-fee  (عام - للعرض في صفحة الدفع. الباك هو اللي بيحسبها فعليًا مع الأوردر)
export async function getShippingFee(): Promise<
  ActionResult<{ shippingFee: string }>
> {
  try {
    const res = await fetch(`${BASE_URL}/shipping-fee`, { cache: "no-store" });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      return {
        success: false,
        message: data?.message || "Failed to load shipping fee",
      };
    }
    return { success: true, data: data?.data };
  } catch {
    return { success: false, message: "Failed to load shipping fee" };
  }
}

// POST /api/orders
// العميل: بيبعت من الـ cart الحالي (الباك محتاج items فبنجيبها من GET /cart).
// السيلز / مدير المبيعات / الأدمن: بيبعتوا items (و customerId اختياري) مباشرة.
// السعر والشحن واسم اللي حجز الأوردر (bookedBy) بيتحددوا في الباك مش من هنا.
export async function addOrder(body: {
  shippingAddress: ShippingAddress;
  paymentMethod: "CashOnDelivery" | "CreditCard";
  items?: OrderItemInput[];
  customerId?: string;
  couponCode?: string; // الباك لسه مش بيستخدمه
}): Promise<ActionResult> {
  let items = body.items;

  if (!items?.length) {
    const cartResult = await request<{
      items?: RawCartItem[];
      products?: RawCartItem[];
    }>("/cart");

    if (!cartResult.success) {
      return { success: false, message: cartResult.message };
    }

    const cart = cartResult.data;
    const cartItems: RawCartItem[] = cart?.items ?? cart?.products ?? [];

    if (!cartItems.length) {
      return { success: false, message: "Your cart is empty" };
    }

    items = cartItems.map((item) => ({
      product: (item.product && typeof item.product === "object"
        ? item.product._id
        : (item.product ?? item.productId)) as string,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
    }));
  }

  return request("/orders", {
    method: "POST",
    body: JSON.stringify({
      items,
      shippingAddress: body.shippingAddress,
      paymentMethod: body.paymentMethod,
      customerId: body.customerId,
    }),
  });
}

// GET /api/orders/my?page=&limit=   (طلباتي)
export async function getMyOrders(page = 1, limit = 10) {
  return request(`/orders/my?page=${page}&limit=${limit}`);
}

// GET /api/orders/:id   (صاحب الأوردر أو موظف)
export async function getOrderById(id: string) {
  return request(`/orders/${id}`);
}

// GET /api/orders?status=&page=&limit=   (أدمن / محاسب / أمين مخزن)
export async function getAllOrders(
  params: {
    status?: OrderStatus;
    page?: number;
    limit?: number;
  } = {},
) {
  const query = new URLSearchParams();
  if (params.status) query.append("status", params.status);
  query.append("page", String(params.page ?? 1));
  query.append("limit", String(params.limit ?? 20));
  return request(`/orders?${query.toString()}`);
}

// PATCH /api/orders/:id/status
// warehouse: Preparing / Shipped (مع shipping) / Cancelled
// accountant: Delivered / Refused
// user: Cancelled (أوردره هو، وهو Pending أو Preparing)
// salesManager / admin: كل الحالات
export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  extra: { shipping?: ShippingInfo; note?: string } = {},
) {
  return request(`/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status, ...extra }),
  });
}

// PATCH /api/orders/:id/payment   (محاسب / مدير مبيعات / أدمن)
export async function markOrderPaid(id: string) {
  return request(`/orders/${id}/payment`, { method: "PATCH" });
}
