"use server";

import { AdminOrder } from "@/types/admin/adminOrders";
import { AdminCustomer } from "@/types/admin/adminCustomer";
import { getAccessToken } from "@/utilities/utilite";
import { getAllUsersAdmin } from "./admin.action";

import { markOrderPaid } from "./order.action";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

/**
 * Fetch all orders for accountant dashboard
 */
export async function getAccountantOrders(): Promise<AdminOrder[]> {
  try {
    const token = await getAccessToken();
    const cleanBase = BASE.replace(/\/api\/?$/, "");
    const res = await fetch(`${cleanBase}/api/orders`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      console.error("Failed to fetch orders for accountant:", res.status, data);
      return [];
    }
    if (data && Array.isArray(data.data)) return data.data;
    if (data && Array.isArray(data.orders)) return data.orders;
    if (Array.isArray(data)) return data;
    return [];
  } catch (err) {
    console.error("Error getAccountantOrders:", err);
    return [];
  }
}

/**
 * Fetch all accounts (users) for accountant dashboard
 */
export async function getAccountantAccounts(): Promise<AdminCustomer[]> {
  try {
    const users = await getAllUsersAdmin();
    return users ?? [];
  } catch (err) {
    console.error("Error getAccountantAccounts:", err);
    return [];
  }
}

/**
 * Update order state dropdown: Delivered | Refused | isPaid
 */
export async function updateAccountantOrderState(
  orderId: string,
  state: "Delivered" | "Refused" | "isPaid"
): Promise<{ success: boolean; message?: string }> {
  try {
    const token = await getAccessToken();
    const cleanBase = BASE.replace(/\/api\/?$/, "");

    if (state === "isPaid") {
      const paidRes = await markOrderPaid(orderId);
      return {
        success: paidRes.success,
        message: paidRes.message,
      };
    }

    // State is 'Delivered' or 'Refused'
    // Try PATCH /api/orders/:id/status
    const res = await fetch(`${cleanBase}/api/orders/${orderId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: state }),
    });
    const data = await res.json().catch(() => null);

    if (!res.ok && !data?.success) {
      // Fallback: PUT /api/orders/:id/status
      const res2 = await fetch(`${cleanBase}/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderStatus: state }),
      });
      const data2 = await res2.json().catch(() => null);
      if (!res2.ok && !data2?.success) {
        return {
          success: false,
          message:
            data?.message ||
            data2?.message ||
            `فشل تحديث حالة الطلب إلى ${state}`,
        };
      }
    }

    return {
      success: true,
      message: `تم تحديث حالة الطلب إلى "${state === "Delivered" ? "تم التوصيل (Delivered)" : "تم الرفض (Refused)"}" بنجاح`,
    };
  } catch (err) {
    return { success: false, message: (err as Error).message };
  }
}
