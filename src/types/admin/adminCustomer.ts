export interface AdminCustomer {
  _id: string;
  name?: string;
  fullName?: string;
  email: string;
  phoneNumber?: string;
  role: "user" | "admin" | "accountant" | "warehouse";
  isVerified?: boolean;
  isActive?: boolean;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt?: string;
}
