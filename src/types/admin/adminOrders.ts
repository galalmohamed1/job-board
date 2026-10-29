import { ProductImage } from "../product";

export interface AdminOrderItem {
  _id?: string;
  product?:
    | {
        _id?: string;
        title?: string;
        images?: ProductImage[] | string[];
      }
    | string;
  name?: string; // أو title لو الباك إند مسجل الاسم Snapshotted
  quantity?: number;
  price?: number;
  size?: string;
  color?: string;
}

export interface AdminOrderShippingAddress {
  fullName?: string;
  phoneNumber?: string;
  country?: string;
  governorate?: string;
  city?: string;
  area?: string;
  street?: string;
  building?: string;
  apartment?: string;
  postalCode?: string;
  notes?: string;
}

export interface AdminOrder {
  _id: string;
  orderNumber?: string;
  user?:
    | {
        _id: string;
        name?: string;
        fullName?: string;
        email: string;
      }
    | string;
  contactEmail?: string;
  orderStatus: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  paymentMethod?: string;
  isPaid?: boolean;
  isDeleted?: boolean;
  totalPrice: number;
  discountAmount?: number;
  finalPrice: number;
  couponCode?: string;
  createdAt: string;
  updatedAt?: string;
  items?: AdminOrderItem[];
  shippingAddress?: AdminOrderShippingAddress;
}
