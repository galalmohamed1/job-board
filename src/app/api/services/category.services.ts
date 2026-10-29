// export async function getCategories(): Promise<Category[]>{
//     try {
//         const res= await fetch(`${process.env.BASE_URL}/products`);
//     }
// }

import { Category, DetailsSubCategory } from "@/types/category";
import { ApiListResponse, SubCategory } from "@/types/product";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function getCategories(): Promise<Category[] | undefined> {
  try {
    const res = await fetch(`${BASE}/categories`, { cache: "no-store" });
    const data: ApiListResponse<Category> = await res.json();
    return data.data;
  } catch {
    return undefined;
  }
}

export async function getSubCategories(): Promise<SubCategory[] | undefined> {
  try {
    const res = await fetch(`${BASE}/sub-categories`, { cache: "no-store" });
    const data: ApiListResponse<SubCategory> = await res.json();
    return data.data;
  } catch {
    return undefined;
  }
}

/** GET /api/details-subcategories */
export async function getDetailsSubCategories(): Promise<DetailsSubCategory[]> {
  try {
    const res = await fetch(`${BASE}/details-subcategories`, {
      cache: "no-store",
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) return [];
    return data?.data ?? [];
  } catch {
    return [];
  }
}
