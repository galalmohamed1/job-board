"use client";

import { getStaff, updateCompensation } from "@/app/api/services/reports-api";
import type { StaffMember } from "@/types/reports";
import { useEffect, useState } from "react";

const ROLE_LABELS: Record<string, string> = {
  salesManager: "مدير مبيعات",
  sales: "مبيعات",
  accountant: "محاسب",
  warehouse: "مخزن",
  courier: "مندوب شحن",
};

export default function StaffCompensation({ token }: { token?: string }) {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [edits, setEdits] = useState<
    Record<string, { salary: string; commissionRate: string }>
  >({});
  const [savingId, setSavingId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;

    const load = async () => {
      const list = await getStaff(token);

      if (!list) {
        setError("تعذر تحميل بيانات الموظفين");
        return;
      }

      setStaff(list);
      setEdits(
        Object.fromEntries(
          list.map((s) => [
            s._id,
            {
              salary: String(s.salary ?? 0),
              commissionRate: String(s.commissionRate ?? 0),
            },
          ]),
        ),
      );
    };

    load();
  }, [token]);

  const save = async (id: string) => {
    setSavingId(id);
    setError("");

    const updated = await updateCompensation(
      id,
      {
        salary: Number(edits[id].salary),
        commissionRate: Number(edits[id].commissionRate),
      },
      token,
    );

    if (!updated) {
      setError("تعذر حفظ التعديل");
    } else {
      setStaff((prev) => prev.map((s) => (s._id === id ? { ...s, ...updated } : s)));
    }

    setSavingId("");
  };

  const setField = (
    id: string,
    field: "salary" | "commissionRate",
    value: string,
  ) => setEdits((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));

  const inputCls =
    "w-28 border border-slate-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200";

  return (
    <div className="space-y-3">
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="bg-white rounded-lg border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm text-right">
          <thead className="bg-slate-50 text-slate-500 text-xs">
            <tr>
              <th className="p-3">الاسم</th>
              <th className="p-3">الوظيفة</th>
              <th className="p-3">المرتب الشهري</th>
              <th className="p-3">نسبة العمولة %</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {staff.map((s) => (
              <tr key={s._id}>
                <td className="p-3 font-semibold">{s.name}</td>
                <td className="p-3">{ROLE_LABELS[s.role] || s.role}</td>
                <td className="p-3">
                  <input
                    type="number"
                    min="0"
                    className={inputCls}
                    value={edits[s._id]?.salary ?? ""}
                    onChange={(e) => setField(s._id, "salary", e.target.value)}
                  />
                </td>
                <td className="p-3">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    className={inputCls}
                    value={edits[s._id]?.commissionRate ?? ""}
                    onChange={(e) =>
                      setField(s._id, "commissionRate", e.target.value)
                    }
                  />
                </td>
                <td className="p-3">
                  <button
                    type="button"
                    onClick={() => save(s._id)}
                    disabled={savingId === s._id}
                    className="px-3 py-1.5 rounded-lg bg-[#1E3A8A] text-white text-xs font-semibold disabled:opacity-60"
                  >
                    {savingId === s._id ? "..." : "حفظ"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}