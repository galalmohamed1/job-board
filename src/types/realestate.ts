export interface RealEstateItem {
  id: string | number;
  title: string;
  location?: string;
  typeBadge?: string;
  typeBadgeColor?: string;
  price: string | number;
  discountPrice?: number;
  period?: string;
  area?: string;
  rooms?: number | null;
  baths?: number | null;
  image: string;
  category?: string;
  slug?: string;
}
