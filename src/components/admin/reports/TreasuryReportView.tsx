"use client";

import { deleteTransaction } from "@/app/api/services/reports-api";
import { TreasuryReport } from "@/types/reports";
import { Trash2 } from "lucide-react";
// import { deleteTransaction, type TreasuryReport } from "@/lib/reports-api";

const money = (n: number) =>
  n.toLocaleString("ar-EG", { maximumFractionDigits: 2 });

const CATEGORY_LABELS: Record<string, string> = {
  sales_collection: "تحصيل مبيعات",
  advance: "سلفة",
  expense: "مصروفات",
  supplier: "دفعة مورد",
  salary: "مرتبات",
  other: "أخرى",
};

export default function TreasuryReportView({
  report,
  isAdmin,
  token,
  onChanged,
}: {
  report: TreasuryReport;
  isAdmin: boolean;
  token?: string;
  onChanged: () => void;
}) {
  const { summary } = report;

  const handleDelete = async (id: string) => {
    if (!confirm("متأكد إنك عايز تحذف الحركة دي؟")) return;
    try {
      await deleteTransaction(id, token);
      onChanged();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const cards = [
    { label: "إجمالي الوارد", value: summary.totalIn, cls: "text-emerald-600" },
    { label: "إجمالي الصادر", value: summary.totalOut, cls: "text-red-600" },
    {
      label: "الصافي",
      value: summary.net,
      cls: summary.net >= 0 ? "text-[#1E3A8A]" : "text-red-600",
    },
  ];

  return (
    <div className="space-y-5">
      <p className="text-xs text-slate-500">الفترة: {report.period}</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {cards.map((c) => (
          <div
            key={c.label}
            className="bg-white rounded-lg border border-slate-200 p-4"
          >
            <p className="text-xs text-slate-500">{c.label}</p>
            <p className={`text-2xl font-bold mt-1 ${c.cls}`}>
              {money(c.value)} <span className="text-xs">ج.م</span>
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <h3 className="font-bold text-sm mb-3">التفصيل بالبنود</h3>
          {report.byCategory.length === 0 ? (
            <p className="text-sm text-slate-400">مفيش حركات</p>
          ) : (
            <ul className="divide-y divide-slate-100 text-sm">
              {report.byCategory.map((c) => (
                <li
                  key={`${c.type}-${c.category}`}
                  className="flex justify-between py-2"
                >
                  <span>
                    <span
                      className={
                        c.type === "in" ? "text-emerald-600" : "text-red-600"
                      }
                    >
                      {c.type === "in" ? "وارد" : "صادر"}
                    </span>{" "}
                    - {c.label} ({c.count})
                  </span>
                  <span className="font-semibold">{money(c.total)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <h3 className="font-bold text-sm mb-3">السلف في الفترة</h3>
          {report.advances.length === 0 ? (
            <p className="text-sm text-slate-400">مفيش سلف</p>
          ) : (
            <ul className="divide-y divide-slate-100 text-sm">
              {report.advances.map((a) => (
                <li key={a.employee} className="flex justify-between py-2">
                  <span>
                    {a.employee} ({a.count})
                  </span>
                  <span className="font-semibold">{money(a.total)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm text-right">
          <thead className="bg-slate-50 text-slate-500 text-xs">
            <tr>
              <th className="p-3">التاريخ</th>
              <th className="p-3">النوع</th>
              <th className="p-3">البند</th>
              <th className="p-3">المبلغ</th>
              <th className="p-3">الموظف</th>
              <th className="p-3">ملاحظة</th>
              <th className="p-3">سجّلها</th>
              {isAdmin && <th className="p-3" />}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {report.transactions.map((t) => (
              <tr key={t._id}>
                <td className="p-3 whitespace-nowrap">
                  {new Date(t.date).toLocaleString("ar-EG", {
                    timeZone: "Africa/Cairo",
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </td>
                <td
                  className={`p-3 font-semibold ${
                    t.type === "in" ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {t.type === "in" ? "وارد" : "صادر"}
                </td>
                <td className="p-3">{CATEGORY_LABELS[t.category]}</td>
                <td className="p-3 font-semibold">{money(t.amount)}</td>
                <td className="p-3">{t.employee?.name || "-"}</td>
                <td className="p-3 text-slate-500">{t.note || "-"}</td>
                <td className="p-3">{t.createdBy?.name || "-"}</td>
                {isAdmin && (
                  <td className="p-3">
                    <button
                      type="button"
                      onClick={() => handleDelete(t._id)}
                      className="text-red-500 hover:text-red-700"
                      aria-label="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {report.transactions.length === 0 && (
              <tr>
                <td colSpan={8} className="p-6 text-center text-slate-400">
                  مفيش حركات في الفترة دي
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}