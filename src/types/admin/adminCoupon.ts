export interface Coupon {
  _id: string;
  code: string;
  discountPercentage: number;
  expireDate: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}
