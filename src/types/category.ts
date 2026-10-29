export interface CategoryCardData {
  id: string;
  title: string;
  description: string;
  image: string;
  iconType:
    "store" | "marketing" | "campaigns" | "legal" | "partners" | "realstate";
  ctaText: string;
  hasDropdown?: boolean;
}

export interface Category {
  _id: string;
  title: string;
  name?: string;
  description: string;
  image: { public_id: string; secure_url: string };
  slug: string;
}

export interface DetailsSubCategory {
  _id: string;
  name: string;
  slug?: string;
  subcategory?:
    | string
    | {
        _id: string;
        name?: string;
        category?: string | { _id: string; title?: string } | null;
      }
    | null;
}