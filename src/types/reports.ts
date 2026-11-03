export type Period = "daily" | "weekly" | "monthly" | "custom";

export interface ReportQuery {
  period: Period;
  date?: string; // YYYY-MM-DD
  from?: string;
  to?: string;
}

export interface Transaction {
  _id: string;
  type: "in" | "out";
  category: string;
  amount: number;
  note?: string;
  date: string;
  employee?: { _id: string; name: string };
  createdBy?: { _id: string; name: string };
}

export interface TreasuryReport {
  period: string;
  summary: { totalIn: number; totalOut: number; net: number };
  byCategory: {
    type: "in" | "out";
    category: string;
    label: string;
    total: number;
    count: number;
  }[];
  advances: { employee: string; total: number; count: number }[];
  transactions: Transaction[];
}

export interface SalesRow {
  salesId: string;
  name: string;
  role: string;
  ordersCount: number;
  refusedCount: number;
  cancelledCount: number;
  totalBooked: number;
  deliveredCount: number;
  totalDelivered: number;
  salary: number;
  commissionRate: number;
  commission: number;
  tookAdvance: boolean;
  advanceTotal: number;
  netDue: number;
}

export interface SalesReport {
  period: string;
  salaryIncluded: boolean;
  overall: { status: string; count: number; total: number }[];
  perSales: SalesRow[];
  totals: {
    totalDelivered: number;
    salary: number;
    commission: number;
    advances: number;
    netDue: number;
  };
}

export interface StaffMember {
  _id: string;
  name: string;
  email: string;
  role: string;
  salary?: number;
  commissionRate?: number;
}

export interface CreateTransactionBody {
  type: "in" | "out";
  category: string;
  amount: number;
  note?: string;
  employee?: string;
  date?: string;
}
