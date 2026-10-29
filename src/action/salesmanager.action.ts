"use server";

import { ActionResult, OrderStatus } from "@/types/order";
import { AdminOrder } from "@/types/admin/adminOrders";
import { getAccessToken } from "@/utilities/utilite";
import { markOrderPaid, updateOrderStatus, addOrderNote } from "./order.action";
import { revalidatePath } from "next/cache";

const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL || "https://horus-nine.vercel.app/api"}`;

/**
 * Fetch orders for Sales Manager with pagination & filters
 */
export async function getSalesManagerOrders(
  params: {
    status?: string;
    page?: number;
    limit?: number;
  } = {}
): Promise<ActionResult<{ orders: AdminOrder[]; total: number; page: number; pages: number }>> {
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

    const cleanBase = BASE_URL.replace(/\/+$/, "");
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

    let orders: AdminOrder[] = [];
    let total = 0;
    let currPage = page;
    let totalPages = 1;

    if (data?.data && typeof data.data === "object" && !Array.isArray(data.data)) {
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
    console.error("getSalesManagerOrders error:", err);
    return {
      success: false,
      message: "حدث خطأ غير متوقع أثناء جلب الطلبات",
    };
  }
}

/**
 * Fetch detailed order for Sales Manager
 */
export async function getSalesManagerOrderById(
  orderId: string
): Promise<ActionResult<AdminOrder>> {
  try {
    const token = await getAccessToken();
    if (!token) {
      return { success: false, message: "يرجى تسجيل الدخول أولاً" };
    }

    const cleanBase = BASE_URL.replace(/\/+$/, "");
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
    console.error("getSalesManagerOrderById error:", err);
    return {
      success: false,
      message: "حدث خطأ أثناء جلب بيانات الطلب",
    };
  }
}

export type SalesManagerState =
  | "Preparing"
  | "Shipped"
  | "Delivered"
  | "Refused"
  | "Cancelled"
  | "isPaid";

/**
 * Update order state for Sales Manager:
 * {Preparing, Shipped, Delivered, Refused, Cancelled, isPaid}
 */
export async function updateSalesManagerOrderState(
  orderId: string,
  state: SalesManagerState
): Promise<{ success: boolean; message?: string; data?: AdminOrder }> {
  try {
    const token = await getAccessToken();
    if (!token) {
      return { success: false, message: "يرجى تسجيل الدخول أولاً" };
    }

    if (!orderId) {
      return { success: false, message: "معرف الطلب غير صالح" };
    }

    // 1. If state is "isPaid", mark order as paid
    if (state === "isPaid") {
      const paidRes = await markOrderPaid(orderId);
      if (paidRes.success) {
        revalidatePath("/dashboard-salesmanger");
        return {
          success: true,
          message: paidRes.message || "تم تأكيد دفع الطلب بنجاح",
          data: paidRes.data,
        };
      }
      return {
        success: false,
        message: paidRes.message || "فشل تأكيد دفع الطلب",
      };
    }

    // 2. Otherwise update orderStatus via PATCH /orders/:id/status
    const cleanBase = BASE_URL.replace(/\/+$/, "");
    let res = await fetch(`${cleanBase}/orders/${orderId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: state }),
    });

    let data = await res.json().catch(() => null);

    // Fallback if needed: try PUT /orders/:id/status
    if (!res.ok && !data?.success) {
      const resPut = await fetch(`${cleanBase}/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderStatus: state, status: state }),
      });
      const dataPut = await resPut.json().catch(() => null);
      if (resPut.ok && dataPut?.success !== false) {
        res = resPut;
        data = dataPut;
      }
    }

    if (!res.ok && !data?.success) {
      return {
        success: false,
        message: data?.message || `فشل تحديث حالة الطلب إلى ${state}`,
      };
    }

    revalidatePath("/dashboard-salesmanger");

    return {
      success: true,
      message: data?.message || `تم تحديث حالة الطلب إلى ${state} بنجاح`,
      data: data?.data ?? data?.order,
    };
  } catch (err: unknown) {
    console.error("updateSalesManagerOrderState error:", err);
    return {
      success: false,
      message: "حدث خطأ أثناء تحديث حالة الطلب",
    };
  }
}

/**
 * Add note to order for Sales Manager
 */
export async function addSalesManagerOrderNote(
  orderId: string,
  text: string
): Promise<ActionResult> {
  const res = await addOrderNote(orderId, text);
  if (res.success) {
    revalidatePath("/dashboard-salesmanger");
  }
  return res;
}
