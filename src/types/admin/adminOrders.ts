import { ProductImage } from "../product";

export interface AdminOrderItem {
  _id?: string;
  product?:
    | {
        _id?: string;
        title?: string;
        image?:
          | { secure_url?: string; public_id?: string }[]
          | { secure_url?: string; public_id?: string };
        images?: ProductImage[] | string[];
      }
    | string;
  name?: string; // أو title لو الباك إند مسجل الاسم Snapshotted
  title?: string;
  quantity?: number;
  price?: number;
  size?: string;
  color?: string;
  image?: string;
}

export interface StatusHistoryItem {
  status: string;
  note?: string;
  changedBy?:
    | {
        _id?: string;
        name?: string;
        fullName?: string;
        email?: string;
        role?: string;
      }
    | string;
  changedAt?: string;
  createdAt?: string;
}

export interface OrderShippingDetails {
  method?: "Company" | "Courier" | string;
  companyName?: string;
  trackingNumber?: string;
  courierName?: string;
  courierPhone?: string;
}

export interface OrderNote {
  _id?: string;
  text: string;
  createdBy?:
    | {
        _id?: string;
        name?: string;
        fullName?: string;
      }
    | string;
  createdAt?: string;
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
        role?: string;
        phoneNumber?: string;
        phone?: string;
      }
    | string;
  customer?: {
    _id?: string;
    name?: string;
    fullName?: string;
    email?: string;
    role?: string;
  };
  contactEmail?: string;
  orderStatus: "Pending" | "Processing" | "Preparing" | "Shipped" | "Delivered" | "Refused" | "Cancelled";
  paymentMethod?: string;
  isPaid?: boolean;
  paidAt?: string;
  paidBy?:
    | string
    | {
        _id: string;
        name?: string;
        fullName?: string;
        email?: string;
      };
  isDeleted?: boolean;
  totalPrice: number;
  discountAmount?: number;
  finalPrice: number;
  couponCode?: string;
  createdAt: string;
  updatedAt?: string;
  items?: AdminOrderItem[];
  shippingAddress?: AdminOrderShippingAddress;
  shipping?: OrderShippingDetails;
  statusHistory?: StatusHistoryItem[];
  notes?: OrderNote[];
}
