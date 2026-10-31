"use server";

import {
  ActionResult,
  OrderItemInput,
  OrderStatus,
  RawCartItem,
  ShippingAddress,
  ShippingInfo,
} from "@/types/order";
import { AdminOrder } from "@/types/admin/adminOrders";
import { getAccessToken } from "@/utilities/utilite";
import { revalidatePath } from "next/cache";

const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL || "https://tasweeq-six.vercel.app/api"}`;

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

// PATCH /orders/:id/paid (أدوار: محاسب / مدير مبيعات / أدمن)
// PATCH /api/orders/:id/payment  (محاسب / مدير مبيعات / أدمن)
export async function markOrderPaid(
  orderId: string,
): Promise<ActionResult<AdminOrder>> {
  if (!orderId) {
    return { success: false, message: "معرف الطلب غير صالح" };
  }

  const result = await request<AdminOrder>(`/orders/${orderId}/payment`, {
    method: "PATCH",
  });

  if (result.success) {
    revalidatePath("/dashboard-account/orders");
    revalidatePath("/dashboard-account/accounts");
    revalidatePath("/dashboard/order");
  }
  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// SALES ROLE ACTIONS (/dashboard-sales)
// ─────────────────────────────────────────────────────────────────────────────

export interface SalesOrdersResponse {
  orders: AdminOrder[];
  total: number;
  page: number;
  pages: number;
}

/**
 * جلب أوردرات مسؤول المبيعات الحالي (الباك إند يفلتر بـ req.user)
 * GET /orders?status=&page=&limit=
 */
export async function getSalesOrders(
  params: {
    status?: string;
    page?: number;
    limit?: number;
  } = {},
): Promise<ActionResult<SalesOrdersResponse>> {
  try {
    const token = await getAccessToken();
    if (!token) {
      return { success: false, message: "يرجى تسجيل الدخول أولاً" };
    }

    const query = new URLSearchParams();
    if (params.status && params.status !== "all") {
      query.append("status", params.status);
    }
    const page = params.page ?? 1;
    const limit = params.limit ?? 10;
    query.append("page", String(page));
    query.append("limit", String(limit));

    const cleanBase = (
      process.env.NEXT_PUBLIC_BASE_URL || "https://tasweeq-six.vercel.app/api"
    ).replace(/\/+$/, "");

    const res = await fetch(`${cleanBase}/orders?${query.toString()}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await res.json().catch(() => null);

    if (!res.ok || data?.success === false) {
      return {
        success: false,
        message: data?.message || "فشل في جلب طلبات المبيعات",
      };
    }

    // Normalizing different backend response wrappers
    let orders: AdminOrder[] = [];
    let total = 0;
    let currPage = page;
    let totalPages = 1;

    if (
      data?.data &&
      typeof data.data === "object" &&
      !Array.isArray(data.data)
    ) {
      orders = Array.isArray(data.data.orders) ? data.data.orders : [];
      total = data.data.total ?? orders.length;
      currPage = data.data.page ?? page;
      totalPages = data.data.pages ?? Math.max(1, Math.ceil(total / limit));
    } else if (Array.isArray(data?.data)) {
      orders = data.data;
      total = data.total ?? data.count ?? orders.length;
      currPage = data.page ?? page;
      totalPages = data.pages ?? Math.max(1, Math.ceil(total / limit));
    } else if (Array.isArray(data?.orders)) {
      orders = data.orders;
      total = data.total ?? orders.length;
      currPage = data.page ?? page;
      totalPages = data.pages ?? 1;
    }

    return {
      success: true,
      data: {
        orders,
        total,
        page: currPage,
        pages: totalPages,
      },
      message: data?.message,
    };
  } catch (err: unknown) {
    console.error("getSalesOrders error:", err);
    const errorObj = err as {
      cause?: { code?: string };
      code?: string;
      message?: string;
    };
    const errorCode = errorObj?.cause?.code || errorObj?.code;
    return {
      success: false,
      message:
        errorCode === "ECONNREFUSED"
          ? "تعذر الاتصال بالخادم، يرجى التأكد من تشغيل السيرفر"
          : errorObj?.message || "حدث خطأ غير متوقع أثناء جلب الطلبات",
    };
  }
}

/**
 * جلب تفاصيل أوردر محدد بما فيه statusHistory و changedBy
 * GET /orders/:id
 */
export async function getSalesOrderById(
  orderId: string,
): Promise<ActionResult<AdminOrder>> {
  try {
    const token = await getAccessToken();
    if (!token) {
      return { success: false, message: "يرجى تسجيل الدخول أولاً" };
    }

    const cleanBase = (
      process.env.NEXT_PUBLIC_BASE_URL || "https://tasweeq-six.vercel.app/api"
    ).replace(/\/+$/, "");

    const res = await fetch(`${cleanBase}/orders/${orderId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await res.json().catch(() => null);

    if (!res.ok || data?.success === false) {
      return {
        success: false,
        message: data?.message || "فشل في جلب تفاصيل الطلب",
      };
    }

    return {
      success: true,
      data: (data?.data ?? data?.order ?? data) as AdminOrder,
      message: data?.message,
    };
  } catch (err: unknown) {
    console.error("getSalesOrderById error:", err);
    const errorObj = err as {
      cause?: { code?: string };
      code?: string;
      message?: string;
    };
    const errorCode = errorObj?.cause?.code || errorObj?.code;
    return {
      success: false,
      message:
        errorCode === "ECONNREFUSED"
          ? "تعذر الاتصال بالخادم، يرجى التأكد من تشغيل السيرفر"
          : errorObj?.message || "حدث خطأ غير متوقع أثناء جلب بيانات الطلب",
    };
  }
}

/**
 * إلغاء الأوردر مع ملاحظة اختيارية
 * PATCH /orders/:id/status { status: "Cancelled", note }
 */
export async function cancelOrder(
  orderId: string,
  note?: string,
): Promise<ActionResult<AdminOrder>> {
  try {
    const token = await getAccessToken();
    if (!token) {
      return { success: false, message: "يرجى تسجيل الدخول أولاً" };
    }

    if (!orderId) {
      return { success: false, message: "معرف الطلب غير صالح" };
    }

    const cleanBase = (
      process.env.NEXT_PUBLIC_BASE_URL || "https://tasweeq-six.vercel.app/api"
    ).replace(/\/+$/, "");

    const res = await fetch(`${cleanBase}/orders/${orderId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status: "Cancelled",
        ...(note?.trim() ? { note: note.trim() } : {}),
      }),
      cache: "no-store",
    });

    const data = await res.json().catch(() => null);

    if (!res.ok || data?.success === false) {
      return {
        success: false,
        message:
          data?.message ||
          "فشل في إلغاء الطلب (لا يمكن إلغاء الطلب بعد مرحلة الشحن)",
      };
    }

    revalidatePath("/dashboard-sales");
    revalidatePath("/dashboard-account/orders");
    revalidatePath("/dashboard/orders");

    return {
      success: true,
      message: data?.message || "تم إلغاء الطلب بنجاح",
      data: (data?.data ?? data?.order ?? data) as AdminOrder,
    };
  } catch (err: unknown) {
    console.error("cancelOrder error:", err);
    const errorObj = err as {
      cause?: { code?: string };
      code?: string;
      message?: string;
    };
    const errorCode = errorObj?.cause?.code || errorObj?.code;
    return {
      success: false,
      message:
        errorCode === "ECONNREFUSED"
          ? "تعذر الاتصال بالخادم، يرجى التأكد من تشغيل السيرفر"
          : errorObj?.message || "حدث خطأ غير متوقع أثناء إلغاء الطلب",
    };
  }
}

/**
 * إضافة ملاحظة للأوردر
 * POST /orders/:id/notes { text }
 */
export async function addOrderNote(
  orderId: string,
  text: string,
): Promise<ActionResult> {
  try {
    const token = await getAccessToken();
    if (!token) {
      return { success: false, message: "يرجى تسجيل الدخول أولاً" };
    }

    if (!orderId) {
      return { success: false, message: "معرف الطلب غير صالح" };
    }

    if (!text?.trim()) {
      return { success: false, message: "يرجى كتابة نص الملاحظة" };
    }

    const cleanBase = (
      process.env.NEXT_PUBLIC_BASE_URL || "https://tasweeq-six.vercel.app/api"
    ).replace(/\/+$/, "");

    const res = await fetch(`${cleanBase}/orders/${orderId}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text: text.trim() }),
      cache: "no-store",
    });

    const data = await res.json().catch(() => null);

    if (!res.ok || data?.success === false) {
      return {
        success: false,
        message: data?.message || "فشل في إضافة الملاحظة",
      };
    }

    revalidatePath("/dashboard-sales");

    return {
      success: true,
      message: data?.message || "تمت إضافة الملاحظة بنجاح",
      data: data?.data,
    };
  } catch (err: unknown) {
    console.error("addOrderNote error:", err);
    const errorObj = err as {
      cause?: { code?: string };
      code?: string;
      message?: string;
    };
    const errorCode = errorObj?.cause?.code || errorObj?.code;
    return {
      success: false,
      message:
        errorCode === "ECONNREFUSED"
          ? "تعذر الاتصال بالخادم، يرجى التأكد من تشغيل السيرفر"
          : errorObj?.message || "حدث خطأ غير متوقع أثناء إضافة الملاحظة",
    };
  }
}
