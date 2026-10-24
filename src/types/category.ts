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
