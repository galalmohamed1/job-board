export interface ProductImage {
  public_id: string;
  secure_url: string;
}

export interface SubCategory {
  _id: string;
  name: string;
  slug: string;
  category?: string | { _id: string; name: string; slug: string } | null;
}

export interface Product {
  _id: string;
  title: string;
  slug: string;
  discription: string;
  price: number;
  discountPrice?: number;
  image: ProductImage[];
  video?: string;
  category: { _id: string; name: string; slug: string } | null;
  subcategory: SubCategory;
  averageRating: number;
  numReviews: number;
  sizes: string[];
  colors: string[];
  isFeatured: boolean;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  stock: number;
  __v: number;
}
