"use client";

import { SalesReport } from "@/types/reports";

const money = (n: number) =>
  n.toLocaleString("ar-EG", { maximumFractionDigits: 2 });

const STATUS_LABELS: Record<string, string> = {
  Pending: "قيد الانتظار",
  Preparing: "قيد التجهيز",
  Shipped: "تم الشحن",
  Delivered: "تم التسليم",
  Refused: "مرفوض",
  Cancelled: "ملغي",
};

export default function SalesReportView({ report }: { report: SalesReport }) {
  const { totals } = report;

  const cards = [
    { label: "مبيعات مسلّمة ومدفوعة", value: totals.totalDelivered },
    { label: "إجمالي العمولات", value: totals.commission },
    { label: "إجمالي السلف", value: totals.advances },
    {
      label: report.salaryIncluded
        ? "المستحق (مرتب + عمولة - سلف)"
        : "المستحق (عمولة - سلف)",
      value: totals.netDue,
    },
  ];

  return (
    <div className="space-y-5">
      <p className="text-xs text-slate-500">الفترة: {report.period}</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((c) => (
          <div
            key={c.label}
            className="bg-white rounded-lg border border-slate-200 p-4"
          >
            <p className="text-xs text-slate-500">{c.label}</p>
            <p className="text-xl font-bold mt-1 text-[#1E3A8A]">
              {money(c.value)} <span className="text-xs">ج.م</span>
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {report.overall.map((o) => (
          <span
            key={o.status}
            className="bg-white border border-slate-200 rounded-full px-3 py-1 text-xs"
          >
            {STATUS_LABELS[o.status] || o.status}: {o.count} ({money(o.total)})
          </span>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm text-right">
          <thead className="bg-slate-50 text-slate-500 text-xs">
            <tr>
              <th className="p-3">المندوب</th>
              <th className="p-3">محجوز</th>
              <th className="p-3">مرفوض</th>
              <th className="p-3">ملغي</th>
              <th className="p-3">مسلّم</th>
              <th className="p-3">مبيعات مسلّمة</th>
              <th className="p-3">المرتب</th>
              <th className="p-3">نسبة العمولة</th>
              <th className="p-3">العمولة</th>
              <th className="p-3">سلفة؟</th>
              <th className="p-3">السلف</th>
              <th className="p-3">المستحق</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {report.perSales.map((r) => (
              <tr key={r.salesId}>
                <td className="p-3 font-semibold">{r.name}</td>
                <td className="p-3">{r.ordersCount}</td>
                <td className="p-3">{r.refusedCount}</td>
                <td className="p-3">{r.cancelledCount}</td>
                <td className="p-3">{r.deliveredCount}</td>
                <td className="p-3">{money(r.totalDelivered)}</td>
                <td className="p-3">{money(r.salary)}</td>
                <td className="p-3">{r.commissionRate}%</td>
                <td className="p-3">{money(r.commission)}</td>
                <td className="p-3">
                  {r.tookAdvance ? (
                    <span className="text-red-600 font-semibold">نعم</span>
                  ) : (
                    "لا"
                  )}
                </td>
                <td className="p-3">{money(r.advanceTotal)}</td>
                <td className="p-3 font-bold text-[#1E3A8A]">
                  {money(r.netDue)}
                </td>
              </tr>
            ))}
            {report.perSales.length === 0 && (
              <tr>
                <td colSpan={12} className="p-6 text-center text-slate-400">
                  مفيش بيانات في الفترة دي
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-slate-400">
        العمولة بتتحسب على الأوردرات المسلّمة والمدفوعة بس، من غير مصاريف الشحن.
        {report.salaryIncluded
          ? ""
          : " المرتب بيدخل في المستحق في التقرير الشهري بس."}
      </p>
    </div>
  );
}