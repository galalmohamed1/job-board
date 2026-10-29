'use client';

import React, { useState, useMemo } from 'react';
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  XCircle,
  Users,
  Search,
  Filter,
  User,
  ShieldAlert,
  ShieldCheck,
  Briefcase,
  Store,
  Calendar,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { AdminOrder } from '@/types/admin/adminOrders';
import { AdminCustomer } from '@/types/admin/adminCustomer';

type Props = {
  orders: AdminOrder[];
  accounts: AdminCustomer[];
};

export default function AccountantFinanceManager({ orders, accounts }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Compute financial totals
  const financialTotals = useMemo(() => {
    let totalGross = 0;
    let totalPaid = 0;
    let totalPending = 0;
    let totalRefused = 0;

    orders.forEach((o) => {
      const amount = o.finalPrice ?? o.totalPrice ?? 0;
      totalGross += amount;

      if (o.isPaid) {
        totalPaid += amount;
      } else if (o.orderStatus === 'Refused' || o.orderStatus === 'Cancelled') {
        totalRefused += amount;
      } else {
        totalPending += amount;
      }
    });

    const collectionRate =
      totalGross > 0 ? Math.round((totalPaid / totalGross) * 100) : 0;

    return {
      totalGross,
      totalPaid,
      totalPending,
      totalRefused,
      collectionRate,
      ordersCount: orders.length,
      paidCount: orders.filter((o) => o.isPaid).length,
      pendingCount: orders.filter((o) => !o.isPaid && o.orderStatus !== 'Refused' && o.orderStatus !== 'Cancelled').length,
      refusedCount: orders.filter((o) => o.orderStatus === 'Refused' || o.orderStatus === 'Cancelled').length,
    };
  }, [orders]);

  // Aggregate user accounts with their orders & financial totals
  const accountsWithFinances = useMemo(() => {
    // Map order totals by user ID or email
    const userFinancials: Record<string, { ordersCount: number; totalSpent: number; paidSpent: number }> = {};

    orders.forEach((o) => {
      let key = '';
      if (typeof o.user === 'object' && o.user?._id) key = o.user._id;
      else if (typeof o.customer === 'object' && o.customer?._id) key = o.customer._id;
      else if (o.contactEmail) key = o.contactEmail;

      if (key) {
        if (!userFinancials[key]) {
          userFinancials[key] = { ordersCount: 0, totalSpent: 0, paidSpent: 0 };
        }
        const amt = o.finalPrice ?? o.totalPrice ?? 0;
        userFinancials[key].ordersCount += 1;
        userFinancials[key].totalSpent += amt;
        if (o.isPaid) userFinancials[key].paidSpent += amt;
      }
    });

    return accounts.map((acc) => {
      const fin = userFinancials[acc._id] || userFinancials[acc.email] || {
        ordersCount: 0,
        totalSpent: 0,
        paidSpent: 0,
      };

      return {
        ...acc,
        ordersCount: fin.ordersCount,
        totalSpent: fin.totalSpent,
        paidSpent: fin.paidSpent,
      };
    });
  }, [accounts, orders]);

  // Filter accounts
  const filteredAccounts = useMemo(() => {
    return accountsWithFinances.filter((acc) => {
      const q = searchQuery.toLowerCase().trim();
      const name = (acc.name || acc.fullName || '').toLowerCase();
      const email = acc.email.toLowerCase();
      const phone = (acc.phoneNumber || acc.phone || '').toLowerCase();

      const matchesSearch = !q || name.includes(q) || email.includes(q) || phone.includes(q);
      const matchesRole = roleFilter === 'all' || acc.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [accountsWithFinances, searchQuery, roleFilter]);

  // Role Badge Config
  const getRoleBadge = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return {
          label: 'مدير (Admin)',
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          icon: ShieldAlert,
        };
      case 'salesmanager':
        return {
          label: 'مدير مبيعات',
          bg: 'bg-purple-50 text-purple-700 border-purple-200',
          icon: ShieldCheck,
        };
      case 'sales':
        return {
          label: 'مسؤول مبيعات',
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          icon: Briefcase,
        };
      case 'accountant':
        return {
          label: 'محاسب',
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: Briefcase,
        };
      case 'warehouse':
        return {
          label: 'أمين مخزن',
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: Store,
        };
      case 'user':
      default:
        return {
          label: 'عميل (User)',
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          icon: User,
        };
    }
  };

  return (
    <div className="space-y-6 font-['Cairo'] text-right" dir="rtl">
      {/* ── Top Header ── */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-linear-to-br from-[#0B2545] to-[#134074] text-[#F3C053] flex items-center justify-center shadow-xs">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              دفتر الحسابات والمالية
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              متابعة جميع الحسابات، التدفقات النقدية، المبالغ المسددة، والمعلقة
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold">
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          <span>نسبة التحصيل الإجمالية: {financialTotals.collectionRate}%</span>
        </div>
      </div>

      {/* ── 4 Main Financial KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Sales */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold">إجمالي المبيعات الكلية</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {financialTotals.totalGross.toLocaleString('en-US')}{' '}
            <span className="text-xs font-normal text-slate-500">ج.م</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span>إجمالي {financialTotals.ordersCount} طلب في المتجر</span>
          </div>
        </div>

        {/* Paid / Collected */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-xs">
          <div className="flex items-center justify-between text-emerald-700 mb-2">
            <span className="text-xs font-bold">المبالغ المسددة (isPaid)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-700">
            {financialTotals.totalPaid.toLocaleString('en-US')}{' '}
            <span className="text-xs font-normal text-emerald-600">ج.م</span>
          </div>
          <div className="text-[11px] text-emerald-700 font-bold mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>تم تحصيل {financialTotals.paidCount} طلب بنجاح</span>
          </div>
        </div>

        {/* Pending Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-xs">
          <div className="flex items-center justify-between text-amber-700 mb-2">
            <span className="text-xs font-bold">مبالغ قيد التحصيل (Pending)</span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-800">
            {financialTotals.totalPending.toLocaleString('en-US')}{' '}
            <span className="text-xs font-normal text-amber-700">ج.م</span>
          </div>
          <div className="text-[11px] text-amber-700 font-bold mt-1">
            {financialTotals.pendingCount} طلب جاري التوصيل والمتابعة
          </div>
        </div>

        {/* Refused Losses */}
        <div className="bg-white p-5 rounded-2xl border border-red-200 bg-red-50/20 shadow-xs">
          <div className="flex items-center justify-between text-red-700 mb-2">
            <span className="text-xs font-bold">مبالغ مرفوضة (Refused)</span>
            <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-red-700">
            {financialTotals.totalRefused.toLocaleString('en-US')}{' '}
            <span className="text-xs font-normal text-red-600">ج.م</span>
          </div>
          <div className="text-[11px] text-red-700 font-bold mt-1 flex items-center gap-1">
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>{financialTotals.refusedCount} طلب ملغي أو مرتجع</span>
          </div>
        </div>
      </div>

      {/* ── All Accounts & Customer Financial Breakdown ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Header & Search */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              حسابات المستخدمين والعملاء والتعاملات المالية
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              عرض إجمالي مشتريات وحسابات كل عميل وموظف مسجل
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="البحث بالاسم أو البريد..."
                className="w-full pr-9 pl-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:outline-none focus:ring-2 focus:ring-[#D49B35]"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#D49B35]"
            >
              <option value="all">كل الصلاحيات</option>
              <option value="user">عملاء (User)</option>
              <option value="admin">مدراء (Admin)</option>
              <option value="sales">مبيعات (Sales)</option>
              <option value="accountant">محاسب (Accountant)</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold">
                <th className="py-3.5 px-4">صاحب الحساب</th>
                <th className="py-3.5 px-4">البريد والهاتف</th>
                <th className="py-3.5 px-4">الدور (Role)</th>
                <th className="py-3.5 px-4 text-center">عدد الأوردرات</th>
                <th className="py-3.5 px-4">إجمالي المعاملات</th>
                <th className="py-3.5 px-4">المسدد بالفعل</th>
                <th className="py-3.5 px-4">حالة الحساب</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAccounts.map((acc) => {
                const displayName = acc.name || acc.fullName || 'مستخدم بدون اسم';
                const roleBadge = getRoleBadge(acc.role);
                const RoleIcon = roleBadge.icon;

                return (
                  <tr key={acc._id} className="hover:bg-slate-50/70 transition-colors">
                    {/* User */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#0B2545] text-[#F3C053] flex items-center justify-center font-bold text-xs shrink-0">
                          {displayName.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-slate-900">{displayName}</span>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="py-3.5 px-4 text-slate-600 font-mono text-xs">
                      <div>{acc.email}</div>
                      <div className="text-[11px] text-slate-400" dir="ltr">
                        {acc.phoneNumber || acc.phone || '—'}
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold border ${roleBadge.bg}`}
                      >
                        <RoleIcon className="w-3 h-3" />
                        <span>{roleBadge.label}</span>
                      </span>
                    </td>

                    {/* Orders count */}
                    <td className="py-3.5 px-4 text-center font-bold text-slate-800">
                      {acc.ordersCount}
                    </td>

                    {/* Total spent */}
                    <td className="py-3.5 px-4 font-black text-slate-900">
                      {acc.totalSpent.toLocaleString('en-US')} ج.م
                    </td>

                    {/* Paid spent */}
                    <td className="py-3.5 px-4 font-bold text-emerald-700">
                      {acc.paidSpent.toLocaleString('en-US')} ج.م
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {acc.isActive !== false ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>نشط</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-50 text-red-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                          <span>معطل</span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
