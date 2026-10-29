import { Category } from "./category";

export interface ProductImage {
  public_id: string;
  secure_url: string;
}

export interface SubCategory {
  _id: string;
  name: string;
  slug: string;
  category?: string | { _id: string; title?: string; name?: string }|null;
}
export interface DetailsSubCategory {
  _id?: string;
  name: string;
  subcategory: SubCategory;
  slug: string;
  isDeleted: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  _id: string;
  title: string;
  slug: string;
  description: string;
  discription?: string;
  price: number;
  discountPrice?: number;
  images: ProductImage[];
  image?: ProductImage[];
  videos?: string[];
  category: Category | { _id: string; title?: string; name?: string; slug?: string } | null;
  subcategory: SubCategory[] | any;
  detailsSubCategory?: DetailsSubCategory[];
  averageRating: number;
  numReviews: number;
  sizes?: string[];
  colors?: string[];
  isFeatured: boolean;
  isActive: boolean;
  isDeleted: boolean;
  stock: number;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  pages: number;
}

export interface ApiListResponse<T> {
  success: boolean;
  count: number;
  data: T[];
}

export interface ApiSingleResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}