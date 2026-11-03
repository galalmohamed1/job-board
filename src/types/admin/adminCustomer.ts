export interface AdminCustomer {
  _id: string;
  name?: string;
  fullName?: string;
  email: string;
  phoneNumber?: string;
  phone?: string;
  role: "user" | "admin" | "accountant" | "warehouse" | "sales" | "salesManager" | "courier" |"shippingCompany"| string;
  isVerified?: boolean;
  isActive?: boolean;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt?: string;
}
