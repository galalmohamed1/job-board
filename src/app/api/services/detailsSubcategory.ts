import { DetailsSubCategory } from "@/types/category";

const BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://tasweeq-six.vercel.app/api";
/** GET /api/details-subcategories */
export async function getDetailsSubCategories(): Promise<DetailsSubCategory[]> {
  try {
    const res = await fetch(`${BASE}/details-subcategories`, {
      next: { revalidate: 60 },
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) return [];
    return data?.data ?? [];
  } catch {
    return [];
  }
}

/** GET /api/details-subcategories/subcategory/:subCategoryId */
export async function getDetailsBySubCategory(
  subCategoryId: string,
): Promise<DetailsSubCategory[]> {
  try {
    const res = await fetch(
      `${BASE}/details-subcategories/subcategory/${subCategoryId}`,
      { next: { revalidate: 60 } },
    );
    const data = await res.json().catch(() => null);
    if (!res.ok) return [];
    return data?.data ?? [];
  } catch {
    return [];
  }
}

/** GET /api/details-subcategories/:id */
export async function getDetailsSubCategoryById(
  id: string,
): Promise<DetailsSubCategory | null> {
  try {
    const res = await fetch(`${BASE}/details-subcategories/${id}`, {
      next: { revalidate: 60 },
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) return null;
    return data?.data ?? null;
  } catch {
    return null;
  }
}
