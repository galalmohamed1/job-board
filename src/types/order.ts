export interface ShippingAddress {
  fullName: string; // إجباري
  phoneNumber: string; // إجباري
  country?: string; // الباك بيحط "Egypt" لو مبعتهاش
  governorate: string; // إجباري (المحافظة)
  city: string; // إجباري
  street: string; // إجباري
  area?: string;
  building?: string;
  apartment?: string;
  postalCode?: string;
  notes?: string;
}
export type OrderStatus =
  "Pending" | "Preparing" | "Shipped" | "Delivered" | "Refused" | "Cancelled";

// بيانات الشحن (بتتبعت مع حالة Shipped): شركة أو مندوب
export type ShippingInfo =
  | { method: "Company"; companyName: string; trackingNumber?: string }
  | { method: "Courier"; courierName: string; courierPhone?: string };

export type OrderItemInput = {
  product: string;
  quantity: number;
  size?: string;
  color?: string;
};

export type ActionResult<T = unknown> = {
  success: boolean;
  data?: T;
  message?: string;
};

// شكل عنصر الـ cart كما يرجع من الباك (populated أو لا)
export type RawCartItem = {
  product?: string | { _id: string } | null;
  productId?: string;
  quantity: number;
  size?: string;
  color?: string;
};