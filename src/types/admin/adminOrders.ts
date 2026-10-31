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
  orderNumber: string;
  user?:
    | string
    | {
        _id: string;
        name?: string;
        email?: string;
        phoneNumber?: string;
        role?: string;
      };
  bookedBy?: { user: string; name: string; role: string };
  items: {
    product:
      | string
      | { _id: string; title?: string; images?: { secure_url: string }[] };
    title: string;
    image?: string;
    price: number;
    quantity: number;
    size?: string;
    color?: string;
  }[];
  shippingAddress: {
    fullName: string;
    phoneNumber: string;
    country?: string;
    governorate: string;
    city: string;
    street: string;
    area?: string;
    building?: string;
    apartment?: string;
    postalCode?: string;
    notes?: string;
  };
  paymentMethod: "CashOnDelivery" | "CreditCard";
  totalPrice: number;
  shippingFee: number;
  discountAmount: number;
  finalPrice: number;
  orderStatus:
    "Pending" | "Preparing" | "Shipped" | "Delivered" | "Refused" | "Cancelled";
  statusHistory: {
    status: string;
    changedBy?: string | { _id: string; name: string; role: string };
    changedAt: string;
    note?: string;
  }[];
  shipping?: {
    method: "Company" | "Courier";
    companyName?: string;
    courierName?: string;
    courierPhone?: string;
    trackingNumber?: string;
    shippedAt?: string;
  };
  isPaid: boolean;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}
