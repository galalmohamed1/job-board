import { ProductImage } from "../product";

export interface AdminOrderItem {
  _id?: string;
  product?:
    | {
        _id?: string;
        title?: string;
        name?: string;
        image?:
          | { secure_url?: string; public_id?: string }[]
          | { secure_url?: string; public_id?: string }
          | string;
        images?:
          | ProductImage[]
          | { secure_url: string; public_id?: string }[]
          | string[];
      }
    | string;
  name?: string;
  title?: string;
  quantity: number;
  price: number;
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
  shippedAt?: string;
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
  phone?: string;
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
    | string
    | {
        _id?: string;
        name?: string;
        fullName?: string;
        email?: string;
        phoneNumber?: string;
        phone?: string;
        role?: string;
      };
  customer?:
    | {
        _id?: string;
        name?: string;
        fullName?: string;
        email?: string;
        phoneNumber?: string;
        phone?: string;
        role?: string;
      }
    | string;
  contactEmail?: string;
  bookedBy?: { user: string; name: string; role: string };
  items: AdminOrderItem[];
  shippingAddress?: AdminOrderShippingAddress;
  paymentMethod?: "CashOnDelivery" | "CreditCard" | string;
  totalPrice?: number;
  shippingFee?: number;
  discountAmount?: number;
  finalPrice?: number;
  couponCode?: string;
  orderStatus:
    | "Pending"
    | "Processing"
    | "Preparing"
    | "Shipped"
    | "Delivered"
    | "Refused"
    | "Cancelled"
    | string;
  statusHistory?: StatusHistoryItem[];
  shipping?: OrderShippingDetails;
  shippingDetails?: OrderShippingDetails;
  isPaid?: boolean;
  paidAt?: string;
  paidBy?: any;
  isDeleted?: boolean;
  notes?: (OrderNote | string)[];
  createdAt?: string;
  updatedAt?: string;
}
