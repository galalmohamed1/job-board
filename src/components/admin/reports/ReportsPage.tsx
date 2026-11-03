"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Download, Plus } from "lucide-react";
import {
  downloadSalesExcel,
  downloadTreasuryExcel,
  getSalesReport,
  getTreasuryReport,
} from "@/app/api/services/reports-api";
import TreasuryReportView from "./TreasuryReportView";
import SalesReportView from "./SalesReportView";
import TreasuryForm from "./TreasuryForm";
import StaffCompensation from "./StaffCompensation";
import type {
  Period,
  ReportQuery,
  SalesReport,
  TreasuryReport,
} from "@/types/reports";

const today = () =>
  new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Cairo" });

const PERIODS: { value: Period; label: string }[] = [
  { value: "daily", label: "يومي" },
  { value: "weekly", label: "أسبوعي" },
  { value: "monthly", label: "شهري" },
  { value: "custom", label: "فترة مخصصة" },
];

type Tab = "treasury" | "sales" | "staff";

export default function ReportsPage({ isAdmin = false }: { isAdmin?: boolean }) {
  const { data: session } = useSession();
  const token = session?.routeToken as string | undefined;

  const [tab, setTab] = useState<Tab>("treasury");
  const [query, setQuery] = useState<ReportQuery>({
    period: "daily",
    date: "",
    from: "",
    to: "",
  });
  const [ready, setReady] = useState(false);
  const [treasury, setTreasury] = useState<TreasuryReport | null>(null);
  const [sales, setSales] = useState<SalesReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  // التاريخ بيتحسب في المتصفح بعد التحميل (مش وقت الـ prerender)
  useEffect(() => {
    const t = today();
    setQuery((q) => ({ ...q, date: t, from: t, to: t }));
    setReady(true);
  }, []);

  const load = useCallback(async () => {
    if (!token || !ready || tab === "staff") return;
    setLoading(true);
    setError("");

    if (tab === "treasury") {
      const data = await getTreasuryReport(query, token);
      if (data) setTreasury(data);
      else setError("تعذر تحميل تقرير الخزنة");
    } else {
      const data = await getSalesReport(query, token);
      if (data) setSales(data);
      else setError("تعذر تحميل تقرير المبيعات");
    }

    setLoading(false);
  }, [tab, query, token, ready]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDownload = async () => {
    if (tab === "staff") return;
    setError("");

    const blob =
      tab === "treasury"
        ? await downloadTreasuryExcel(query, token)
        : await downloadSalesExcel(query, token);

    if (!blob) {
      setError("تعذر تحميل ملف Excel");
      return;
    }

    const fileDate = query.period === "custom" ? query.from : query.date;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${tab}-${fileDate}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs: { value: Tab; label: string }[] = [
    { value: "treasury", label: "الخزنة" },
    { value: "sales", label: "المبيعات والعمولات" },
    ...(isAdmin ? [{ value: "staff" as Tab, label: "المرتبات والنسب" }] : []),
  ];

  const inputCls =
    "border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-200";

  return (
    <div dir="rtl" className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setTab(t.value)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              tab === t.value
                ? "bg-[#1E3A8A] text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab !== "staff" && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 flex flex-wrap items-end gap-3">
          <label className="text-xs text-slate-500 flex flex-col gap-1">
            الفترة
            <select
              className={inputCls}
              value={query.period}
              onChange={(e) =>
                setQuery({ ...query, period: e.target.value as Period })
              }
            >
              {PERIODS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>

          {query.period === "custom" ? (
            <>
              <label className="text-xs text-slate-500 flex flex-col gap-1">
                من
                <input
                  type="date"
                  className={inputCls}
                  value={query.from}
                  onChange={(e) => setQuery({ ...query, from: e.target.value })}
                />
              </label>
              <label className="text-xs text-slate-500 flex flex-col gap-1">
                إلى
                <input
                  type="date"
                  className={inputCls}
                  value={query.to}
                  onChange={(e) => setQuery({ ...query, to: e.target.value })}
                />
              </label>
            </>
          ) : (
            <label className="text-xs text-slate-500 flex flex-col gap-1">
              التاريخ
              <input
                type="date"
                className={inputCls}
                value={query.date}
                onChange={(e) => setQuery({ ...query, date: e.target.value })}
              />
            </label>
          )}

          <div className="flex gap-2 mr-auto">
            {tab === "treasury" && (
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700"
              >
                <Plus className="w-4 h-4" />
                حركة جديدة
              </button>
            )}
            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-[#1E3A8A] text-white hover:opacity-90"
            >
              <Download className="w-4 h-4" />
              تحميل Excel
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2">
          {error}
        </p>
      )}
      {loading && <p className="text-sm text-slate-500">جاري التحميل...</p>}

      {tab === "treasury" && treasury && (
        <TreasuryReportView
          report={treasury}
          isAdmin={isAdmin}
          token={token}
          onChanged={load}
        />
      )}
      {tab === "sales" && sales && <SalesReportView report={sales} />}
      {tab === "staff" && isAdmin && <StaffCompensation token={token} />}

      {showForm && (
        <TreasuryForm
          token={token}
          onClose={() => setShowForm(false)}
          onSaved={() => {
            setShowForm(false);
            load();
          }}
        />
      )}
    </div>
  );
}