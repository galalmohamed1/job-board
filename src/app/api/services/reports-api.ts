import type {
  ReportQuery,
  Transaction,
  TreasuryReport,
  SalesReport,
  StaffMember,
  CreateTransactionBody,
} from "@/types/reports";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://tasweeq-six.vercel.app/api";

// ================= Helpers =================
function authHeaders(token?: string, json = false): HeadersInit {
  return {
    ...(json ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function buildQuery(query: ReportQuery, extra: Record<string, string> = {}) {
  const params = new URLSearchParams();
  params.set("period", query.period);
  if (query.period === "custom") {
    if (query.from) params.set("from", query.from);
    if (query.to) params.set("to", query.to);
  } else if (query.date) {
    params.set("date", query.date);
  }
  Object.entries(extra).forEach(([k, v]) => params.set(k, v));
  return params.toString();
}

// ================= Responses =================
interface TreasuryReportResponse {
  success: boolean;
  data: TreasuryReport;
}

interface SalesReportResponse {
  success: boolean;
  data: SalesReport;
}

interface TransactionsResponse {
  success: boolean;
  data: { period: string; transactions: Transaction[] };
}

interface TransactionResponse {
  success: boolean;
  data: Transaction;
}

interface StaffResponse {
  success: boolean;
  data: StaffMember[];
}

interface StaffMemberResponse {
  success: boolean;
  data: StaffMember;
}

interface MessageResponse {
  success: boolean;
  message: string;
}

// ================= Reports =================
export async function getTreasuryReport(
  query: ReportQuery,
  token?: string,
): Promise<TreasuryReport | undefined> {
  try {
    const res = await fetch(
      `${BASE_URL}/reports/treasury?${buildQuery(query)}`,
      {
        headers: authHeaders(token),
      },
    );
    const data: TreasuryReportResponse = await res.json();
    return data.success ? data.data : undefined;
  } catch {
    return undefined;
  }
}

export async function getSalesReport(
  query: ReportQuery,
  token?: string,
): Promise<SalesReport | undefined> {
  try {
    const res = await fetch(`${BASE_URL}/reports/sales?${buildQuery(query)}`, {
      headers: authHeaders(token),
    });
    const data: SalesReportResponse = await res.json();
    return data.success ? data.data : undefined;
  } catch {
    return undefined;
  }
}

export async function downloadTreasuryExcel(
  query: ReportQuery,
  token?: string,
): Promise<Blob | undefined> {
  try {
    const res = await fetch(
      `${BASE_URL}/reports/treasury?${buildQuery(query, { format: "xlsx" })}`,
      { headers: authHeaders(token) },
    );
    if (!res.ok) return undefined;
    return await res.blob();
  } catch {
    return undefined;
  }
}

export async function downloadSalesExcel(
  query: ReportQuery,
  token?: string,
): Promise<Blob | undefined> {
  try {
    const res = await fetch(
      `${BASE_URL}/reports/sales?${buildQuery(query, { format: "xlsx" })}`,
      { headers: authHeaders(token) },
    );
    if (!res.ok) return undefined;
    return await res.blob();
  } catch {
    return undefined;
  }
}

// ================= Treasury =================
export async function getTransactions(
  query: ReportQuery,
  token?: string,
): Promise<Transaction[] | undefined> {
  try {
    const res = await fetch(`${BASE_URL}/treasury?${buildQuery(query)}`, {
      headers: authHeaders(token),
    });
    const data: TransactionsResponse = await res.json();
    return data.success ? data.data.transactions : undefined;
  } catch {
    return undefined;
  }
}

export async function createTransaction(
  body: CreateTransactionBody,
  token?: string,
): Promise<Transaction | undefined> {
  try {
    const res = await fetch(`${BASE_URL}/treasury`, {
      method: "POST",
      headers: authHeaders(token, true),
      body: JSON.stringify(body),
    });
    const data: TransactionResponse = await res.json();
    return data.success ? data.data : undefined;
  } catch {
    return undefined;
  }
}

export async function deleteTransaction(
  id: string,
  token?: string,
): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/treasury/${id}`, {
      method: "DELETE",
      headers: authHeaders(token),
    });
    const data: MessageResponse = await res.json();
    return data.success;
  } catch {
    return false;
  }
}

// ================= Staff =================
export async function getStaff(
  token?: string,
): Promise<StaffMember[] | undefined> {
  try {
    const res = await fetch(`${BASE_URL}/staff`, {
      headers: authHeaders(token),
    });
    const data: StaffResponse = await res.json();
    return data.success ? data.data : undefined;
  } catch {
    return undefined;
  }
}

export async function updateCompensation(
  id: string,
  body: { salary?: number; commissionRate?: number },
  token?: string,
): Promise<StaffMember | undefined> {
  try {
    const res = await fetch(`${BASE_URL}/staff/${id}/compensation`, {
      method: "PATCH",
      headers: authHeaders(token, true),
      body: JSON.stringify(body),
    });
    const data: StaffMemberResponse = await res.json();
    return data.success ? data.data : undefined;
  } catch {
    return undefined;
  }
}
