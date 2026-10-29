"use server";

import { Coupon } from "@/types/admin/adminCoupon";
import { AdminCustomer } from "@/types/admin/adminCustomer";
import { AdminOrder } from "@/types/admin/adminOrders";
import { Category, DetailsSubCategory } from "@/types/category";
import {
  ApiListResponse,
  ApiSingleResponse,
  Product,
  ProductsResponse,
  SubCategory,
} from "@/types/product";
import { getAccessToken } from "@/utilities/utilite";

const BASE =
  process.env.NEXT_PUBLIC_BASE_URL || "https://horus-nine.vercel.app/api";
export type StaffRole = "accountant" | "warehouse" | "sales" | "salesManager";
// ─────────────────────────────────────────────────────────────────────────────
// PRODUCTS
// ─────────────────────────────────────────────────────────────────────────────

/** GET /api/products — all products (admin view) */
export async function getAllProductsAdmin(): Promise<Product[] | undefined> {
  try {
    const token = await getAccessToken();
    const res = await fetch(`${BASE}/products`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const data: ProductsResponse = await res.json();
    return data.products;
  } catch {
    return undefined;
  }
}

/** GET /api/products/:id */
export async function getProductByIdAdmin(
  id: string,
): Promise<Product | undefined> {
  try {
    const token = await getAccessToken();
    const res = await fetch(`${BASE}/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const data: ApiSingleResponse<Product> = await res.json();
    return data.data;
  } catch {
    return undefined;
  }
}

export interface ProductPayload {
  title: string; // متوافق مع الـ Schema و Product Interface
  description: string;
  price: string;
  stock: string;
  discountPrice?: string;
  category?: string;
  subCategory?: string;
  detailsSubCategory?: string;
  sizes?: string[];
  colors?: string[];
  images?: string[]; // Base64 strings
}

export async function createProduct(
  payload: ProductPayload,
): Promise<{ success: boolean; data?: Product; message?: string }> {
  try {
    const token = await getAccessToken();

    const formData = new FormData();
    formData.append("title", payload.title);
    formData.append("description", payload.description);
    formData.append("price", payload.price);
    formData.append("stock", payload.stock);
    if (payload.discountPrice)
      formData.append("discountPrice", payload.discountPrice);
    if (payload.category) formData.append("category", payload.category);
    if (payload.subCategory)
      formData.append("subCategory", payload.subCategory);
    if (payload.detailsSubCategory)
      formData.append("detailsSubCategory", payload.detailsSubCategory);

    payload.sizes?.forEach((s) => formData.append("sizes", s));
    payload.colors?.forEach((c) => formData.append("colors", c));

    if (payload.images?.length) {
      for (let i = 0; i < payload.images.length; i++) {
        const base64 = payload.images[i];
        const mimeMatch = base64.match(/data:([^;]+);base64,/);
        const mime = mimeMatch?.[1] ?? "image/jpeg";
        const ext = mime.split("/")[1] ?? "jpg";
        const byteStr = atob(base64.split(",")[1]);
        const bytes = new Uint8Array(byteStr.length);
        for (let j = 0; j < byteStr.length; j++)
          bytes[j] = byteStr.charCodeAt(j);
        const blob = new Blob([bytes], { type: mime });
        formData.append("images", blob, `image_${i}.${ext}`);
      }
    }

    const res = await fetch(`${BASE}/products`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const responseText = await res.text();
    let parsed: any;
    try {
      parsed = JSON.parse(responseText);
    } catch {
      parsed = null;
    }

    if (!res.ok) {
      return {
        success: false,
        message: parsed?.message || "Failed to create product",
      };
    }

    return { success: true, data: parsed?.data, message: parsed?.message };
  } catch (err) {
    return {
      success: false,
      message: (err as Error).message || "An unexpected error occurred",
    };
  }
}

/** PUT /api/products/:id — update existing product */
export async function updateProduct(
  id: string,
  payload: ProductPayload,
): Promise<{ success: boolean; data?: Product; message?: string }> {
  try {
    const token = await getAccessToken();

    const formData = new FormData();
    formData.append("title", payload.title);
    formData.append("description", payload.description);
    formData.append("price", payload.price);
    formData.append("stock", payload.stock);
    if (payload.discountPrice)
      formData.append("discountPrice", payload.discountPrice);
    if (payload.category) formData.append("category", payload.category);
    if (payload.subCategory)
      formData.append("subCategory", payload.subCategory);
    if (payload.detailsSubCategory)
      formData.append("detailsSubCategory", payload.detailsSubCategory);

    payload.sizes?.forEach((s) => formData.append("sizes", s));
    payload.colors?.forEach((c) => formData.append("colors", c));

    if (payload.images?.length) {
      for (let i = 0; i < payload.images.length; i++) {
        const base64 = payload.images[i];
        const mimeMatch = base64.match(/data:([^;]+);base64,/);
        const mime = mimeMatch?.[1] ?? "image/jpeg";
        const ext = mime.split("/")[1] ?? "jpg";
        const byteStr = atob(base64.split(",")[1]);
        const bytes = new Uint8Array(byteStr.length);
        for (let j = 0; j < byteStr.length; j++)
          bytes[j] = byteStr.charCodeAt(j);
        const blob = new Blob([bytes], { type: mime });
        formData.append("images", blob, `image_${i}.${ext}`);
      }
    }

    const res = await fetch(`${BASE}/products/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const responseText = await res.text();
    let parsed: any;
    try {
      parsed = JSON.parse(responseText);
    } catch {
      parsed = null;
    }

    if (!res.ok) {
      return {
        success: false,
        message: parsed?.message || "Failed to update product",
      };
    }

    return { success: true, data: parsed?.data, message: parsed?.message };
  } catch (err) {
    return {
      success: false,
      message: (err as Error).message || "An unexpected error occurred",
    };
  }
}

/** DELETE /api/products/:id */
export async function deleteProduct(id: string): Promise<boolean> {
  try {
    const token = await getAccessToken();
    const res = await fetch(`${BASE}/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok;
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORIES
// ─────────────────────────────────────────────────────────────────────────────

/** GET /api/categories */
export async function getCategoriesAdmin(): Promise<Category[] | undefined> {
  try {
    const res = await fetch(`${BASE}/categories`, { cache: "no-store" });
    const data: ApiListResponse<Category> = await res.json();
    return data.data;
  } catch {
    return undefined;
  }
}

/** GET /api/sub-categories */
export async function getSubCategoriesAdmin(): Promise<
  SubCategory[] | undefined
> {
  try {
    const res = await fetch(`${BASE}/sub-categories`, { cache: "no-store" });
    const data: ApiListResponse<SubCategory> = await res.json();
    return data.data;
  } catch {
    return undefined;
  }
}

/** POST /api/categories */
export async function createCategory(
  formData: FormData,
): Promise<{ success: boolean; data?: Category; message?: string }> {
  try {
    const token = await getAccessToken();
    const res = await fetch(`${BASE}/categories`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      return {
        success: false,
        message: data?.message || "Failed to create category",
      };
    }
    return { success: true, data: data?.data || data, message: data?.message };
  } catch (err) {
    return {
      success: false,
      message: (err as Error).message || "An unexpected error occurred",
    };
  }
}

/** PUT /api/categories/:id */
export async function updateCategory(
  id: string,
  formData: FormData,
): Promise<{ success: boolean; data?: Category; message?: string }> {
  try {
    const token = await getAccessToken();
    const res = await fetch(`${BASE}/categories/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      return {
        success: false,
        message: data?.message || "Failed to update category",
      };
    }
    return { success: true, data: data?.data || data, message: data?.message };
  } catch (err) {
    return {
      success: false,
      message: (err as Error).message || "An unexpected error occurred",
    };
  }
}

/** DELETE /api/categories/:id */
export async function deleteCategory(
  id: string,
): Promise<{ success: boolean; message?: string }> {
  try {
    const token = await getAccessToken();
    const res = await fetch(`${BASE}/categories/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      return {
        success: false,
        message: data?.message || "Failed to delete category",
      };
    }
    return { success: true, message: data?.message };
  } catch (err) {
    return {
      success: false,
      message: (err as Error).message || "An unexpected error occurred",
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-CATEGORIES
// ─────────────────────────────────────────────────────────────────────────────

/** POST /api/sub-categories */
export async function createSubCategory(body: {
  name: string;
  category?: string;
}): Promise<{ success: boolean; data?: SubCategory; message?: string }> {
  try {
    const token = await getAccessToken();
    const res = await fetch(`${BASE}/sub-categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      return {
        success: false,
        message: data?.message || "Failed to create sub-category",
      };
    }
    return { success: true, data: data?.data || data, message: data?.message };
  } catch (err) {
    return {
      success: false,
      message: (err as Error).message || "An unexpected error occurred",
    };
  }
}

/** PUT /api/sub-categories/:id */
export async function updateSubCategory(
  id: string,
  body: { name?: string; category?: string },
): Promise<{ success: boolean; data?: SubCategory; message?: string }> {
  try {
    const token = await getAccessToken();
    const res = await fetch(`${BASE}/sub-categories/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      return {
        success: false,
        message: data?.message || "Failed to update sub-category",
      };
    }
    return { success: true, data: data?.data || data, message: data?.message };
  } catch (err) {
    return {
      success: false,
      message: (err as Error).message || "An unexpected error occurred",
    };
  }
}

/** DELETE /api/sub-categories/:id */
export async function deleteSubCategory(
  id: string,
): Promise<{ success: boolean; message?: string }> {
  try {
    const token = await getAccessToken();
    const res = await fetch(`${BASE}/sub-categories/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      return {
        success: false,
        message: data?.message || "Failed to delete sub-category",
      };
    }
    return { success: true, message: data?.message };
  } catch (err) {
    return {
      success: false,
      message: (err as Error).message || "An unexpected error occurred",
    };
  }
}

/** GET /api/details-subcategories */
export async function getDetailsSubCategoriesAdmin(): Promise<
  DetailsSubCategory[]
> {
  try {
    const token = await getAccessToken();
    const res = await fetch(`${BASE}/details-subcategories`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) return [];
    return data?.data ?? [];
  } catch {
    return [];
  }
}

/** POST /api/details-subcategories */
export async function createDetailsSubCategory(body: {
  name: string;
  category?: string;
  subcategory: string;
}): Promise<{ success: boolean; data?: DetailsSubCategory; message?: string }> {
  try {
    const token = await getAccessToken();
    const res = await fetch(`${BASE}/details-subcategories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      return {
        success: false,
        message: data?.message || "Failed to create details sub-category",
      };
    }
    return { success: true, data: data?.data || data, message: data?.message };
  } catch (err) {
    return {
      success: false,
      message: (err as Error).message || "An unexpected error occurred",
    };
  }
}

/** PUT /api/details-subcategories/:id */
export async function updateDetailsSubCategory(
  id: string,
  body: { name?: string; category?: string; subcategory?: string },
): Promise<{ success: boolean; data?: DetailsSubCategory; message?: string }> {
  try {
    const token = await getAccessToken();
    const res = await fetch(`${BASE}/details-subcategories/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      return {
        success: false,
        message: data?.message || "Failed to update details sub-category",
      };
    }
    return { success: true, data: data?.data || data, message: data?.message };
  } catch (err) {
    return {
      success: false,
      message: (err as Error).message || "An unexpected error occurred",
    };
  }
}

/** DELETE /api/details-subcategories/:id */
export async function deleteDetailsSubCategory(
  id: string,
): Promise<{ success: boolean; message?: string }> {
  try {
    const token = await getAccessToken();
    const res = await fetch(`${BASE}/details-subcategories/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      return {
        success: false,
        message: data?.message || "Failed to delete details sub-category",
      };
    }
    return { success: true, message: data?.message };
  } catch (err) {
    return {
      success: false,
      message: (err as Error).message || "An unexpected error occurred",
    };
  }
}
// async function getDetailsSubCategoriesApi(): Promise<DetailsSubCategory[]> {
//   try {
//     const token = await getAccessToken();
//     const res = await fetch(`${BASE}/details-sub-categories`,

//       { cache: 'no-store' });
//     const data = await res.json();
//     return data?.data ?? [];
//   } catch {
//     return [];
//   }
// }

// ─────────────────────────────────────────────────────────────────────────────
// ORDERS & CUSTOMERS
// ─────────────────────────────────────────────────────────────────────────────

export async function getAllOrdersAdmin(): Promise<AdminOrder[] | undefined> {
  try {
    const token = await getAccessToken();
    const res = await fetch(`${BASE}/orders`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const data: ApiListResponse<AdminOrder> = await res.json();
    return data.data;
  } catch {
    return undefined;
  }
}

export async function updateOrderStatus(
  orderId: string,
  orderStatus: AdminOrder["orderStatus"],
): Promise<{ success: boolean; message?: string }> {
  try {
    const token = await getAccessToken();
    const res = await fetch(`${BASE}/orders/${orderId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ orderStatus }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      return {
        success: false,
        message: data?.message || "Failed to update order status",
      };
    }
    return { success: true, message: data?.message };
  } catch (err) {
    return {
      success: false,
      message: (err as Error).message || "An unexpected error occurred",
    };
  }
}

export async function getAllCustomers(): Promise<AdminCustomer[] | undefined> {
  try {
    const token = await getAccessToken();
    const res = await fetch(`${BASE}/users`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const data: ApiListResponse<AdminCustomer> = await res.json();
    return data.data;
  } catch {
    return undefined;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// COUPONS
// ─────────────────────────────────────────────────────────────────────────────

export async function getCouponsAdmin(): Promise<Coupon[] | undefined> {
  try {
    const token = await getAccessToken();
    const res = await fetch(`${BASE}/coupons`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const data: ApiListResponse<Coupon> = await res.json();
    return data.data;
  } catch {
    return undefined;
  }
}

export async function createCoupon(body: {
  code: string;
  discountPercentage: number;
  expireDate: string;
}): Promise<{ success: boolean; data?: Coupon; message?: string }> {
  try {
    const token = await getAccessToken();

    // الباك إند مستني الحقول دي بالظبط ومن غير زيادات
    const payload = {
      code: body.code,
      discountPercentage: Number(body.discountPercentage),
      expireDate: body.expireDate, // بيبعتها كـ string والباك إند هيحولها لـ Date
    };

    const res = await fetch(`${BASE}/coupons`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return {
        success: false,
        message: data?.message || "Failed to create coupon",
      };
    }

    return {
      success: true,
      data: data?.data || data,
      message: data?.message,
    };
  } catch (err) {
    return {
      success: false,
      message: (err as Error).message || "An unexpected error occurred",
    };
  }
}

export async function createStaffAccount(body: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: StaffRole;
}): Promise<{ success: boolean; message?: string }> {
  try {
    const authToken = await getAccessToken();
    if (!authToken) {
      return { success: false, message: "غير مصرح - يرجى تسجيل الدخول مجدداً" };
    }

    const { role, phone, ...rest } = body;

    // إزالة أي /api مكررة في الرابط
    const cleanBase = BASE.replace(/\/api\/?$/, "");
    const endpoint = `${cleanBase}/api/auth/${role}`;
    console.log("🚀 Creating staff account at:", endpoint);

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        ...rest,
        phoneNumber: phone || undefined,
        phone: phone || undefined,
      }),
    });

    const data = await res.json().catch(() => null);
    console.log("📥 Response status:", res.status, "data:", data);

    if (!res.ok) {
      const errMsg =
        data?.message ||
        data?.error ||
        data?.errors?.[0]?.msg ||
        data?.errors?.[0]?.message ||
        (res.status === 404
          ? `المسار ${endpoint} غير موجود في السيرفر (404)`
          : "فشل إنشاء الحساب");
      return { success: false, message: errMsg };
    }
    return { success: true, message: data?.message ?? "تم إنشاء الحساب بنجاح" };
  } catch (err) {
    return { success: false, message: (err as Error).message };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// USERS
// ─────────────────────────────────────────────────────────────────────────────

/** GET /api/users — all users (admin view) */
export async function getAllUsersAdmin(): Promise<AdminCustomer[] | undefined> {
  try {
    const token = await getAccessToken();
    
    const res = await fetch(`${BASE}/users`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      console.error("Failed to fetch users, status:", res.status, data);
      return undefined;
    }
    if (data && Array.isArray(data.data)) {
      return data.data;
    }
    if (Array.isArray(data)) {
      return data;
    }
    if (data && Array.isArray(data.users)) {
      return data.users;
    }
    return [];
  } catch (err) {
    console.error("Error fetching users admin:", err);
    return undefined;
  }
}
