"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { StaffMember } from "@/types/reports";
import { createTransaction, getStaff } from "@/app/api/services/reports-api";
// import {
//   createTransaction,
//   getStaff,
//   type StaffMember,
// } from "@/lib/reports-api";

const CATEGORIES = [
  { value: "sales_collection", label: "تحصيل مبيعات", type: "in" },
  { value: "advance", label: "سلفة لموظف", type: "out" },
  { value: "expense", label: "مصروفات", type: "out" },
  { value: "supplier", label: "دفعة مورد", type: "out" },
  { value: "salary", label: "مرتبات", type: "out" },
  { value: "other", label: "أخرى", type: "any" },
] as const;

export default function TreasuryForm({
  token,
  onClose,
  onSaved,
}: {
  token?: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [category, setCategory] = useState<string>("expense");
  const [type, setType] = useState<"in" | "out">("out");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [employee, setEmployee] = useState("");
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
  if (category !== "advance" || staff.length > 0) return;

  const loadStaff = async () => {
    const list = await getStaff(token);

    if (!list) {
      setError("تعذر تحميل الموظفين");
      return;
    }

    setStaff(list);
  };

  loadStaff();
}, [category, staff.length, token]);

  const onCategoryChange = (value: string) => {
    setCategory(value);
    const c = CATEGORIES.find((x) => x.value === value);
    if (c && c.type !== "any") setType(c.type);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!(Number(amount) > 0)) return setError("اكتب مبلغ صحيح");
    if (category === "advance" && !employee) return setError("اختار الموظف");

    setSaving(true);
    try {
      await createTransaction(
        {
          type,
          category,
          amount: Number(amount),
          note: note || undefined,
          employee: category === "advance" ? employee : undefined,
        },
        token,
      );
      onSaved();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const inputCls =
    "w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200";

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
      dir="rtl"
    >
      <form
        onSubmit={submit}
        className="bg-white rounded-xl w-full max-w-md p-5 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-bold">حركة خزنة جديدة</h3>
          <button type="button" onClick={onClose} aria-label="إغلاق">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <label className="block text-xs text-slate-500 space-y-1">
          البند
          <select
            className={inputCls}
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>

        {category === "other" && (
          <label className="block text-xs text-slate-500 space-y-1">
            النوع
            <select
              className={inputCls}
              value={type}
              onChange={(e) => setType(e.target.value as "in" | "out")}
            >
              <option value="in">وارد</option>
              <option value="out">صادر</option>
            </select>
          </label>
        )}

        {category === "advance" && (
          <label className="block text-xs text-slate-500 space-y-1">
            الموظف
            <select
              className={inputCls}
              value={employee}
              onChange={(e) => setEmployee(e.target.value)}
            >
              <option value="">اختار الموظف</option>
              {staff.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
        )}

        <label className="block text-xs text-slate-500 space-y-1">
          المبلغ
          <input
            type="number"
            min="0"
            step="0.01"
            className={inputCls}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>

        <label className="block text-xs text-slate-500 space-y-1">
          ملاحظة
          <input
            className={inputCls}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="w-full py-2.5 rounded-lg bg-[#1E3A8A] text-white font-semibold text-sm disabled:opacity-60"
        >
          {saving ? "جاري الحفظ..." : "حفظ"}
        </button>
      </form>
    </div>
  );
}