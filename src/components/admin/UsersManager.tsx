'use client';

import React, { useState, useMemo, useTransition } from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  RefreshCw,
  UserPlus,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Briefcase,
  Store,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  XCircle,
  Eye,
  X,
  Filter,
  Copy,
  Check,
} from 'lucide-react';
import { AdminCustomer } from '@/types/admin/adminCustomer';
import { getAllUsersAdmin } from '@/action/admin.action';

type Props = {
  initialUsers: AdminCustomer[];
};

export default function UsersManager({ initialUsers }: Props) {
  const [users, setUsers] = useState<AdminCustomer[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isPending, startTransition] = useTransition();
  const [selectedUser, setSelectedUser] = useState<AdminCustomer | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Refresh handler
  const handleRefresh = () => {
    startTransition(async () => {
      const fresh = await getAllUsersAdmin();
      if (fresh && Array.isArray(fresh)) {
        setUsers(fresh);
      }
    });
  };

  // Copy helper
  const handleCopy = (text: string, id: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      // Search
      const q = searchQuery.toLowerCase().trim();
      const name = (u.name || u.fullName || '').toLowerCase();
      const email = (u.email || '').toLowerCase();
      const phone = (u.phoneNumber || u.phone || '').toLowerCase();
      const matchesSearch = !q || name.includes(q) || email.includes(q) || phone.includes(q);

      // Role filter
      const matchesRole = roleFilter === 'all' || u.role === roleFilter;

      // Status filter
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && u.isActive !== false) ||
        (statusFilter === 'inactive' && u.isActive === false);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  // Stats
  const stats = useMemo(() => {
    const total = users.length;
    const admins = users.filter((u) => u.role === 'admin').length;
    const staff = users.filter(
      (u) =>
        u.role === 'accountant' ||
        u.role === 'warehouse' ||
        u.role === 'sales' ||
        u.role === 'salesManager'
    ).length;
    const customers = users.filter((u) => !u.role || u.role === 'user').length;
    const active = users.filter((u) => u.isActive !== false).length;

    return { total, admins, staff, customers, active };
  }, [users]);

  // Role Badge Config
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return {
          label: 'مدير النظام (Admin)',
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          icon: ShieldAlert,
        };
      case 'salesManager':
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
          label: 'مسؤول مستودع',
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: Store,
        };
      case 'user':
      default:
        return {
          label: 'عميل (User)',
          bg: 'bg-slate-50 text-slate-700 border-slate-200',
          icon: Users,
        };
    }
  };

  return (
    <div className="space-y-6 font-['Cairo'] text-right" dir="rtl">
      {/* ── Top Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#F3C053] to-[#D49B35] flex items-center justify-center text-[#0B2545] shadow-xs">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                إدارة المستخدمين
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                عرض وإدارة جميع حسابات العملاء وفريق العمل والمشرفين
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isPending}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            title="تحديث البيانات"
          >
            <RefreshCw className={`w-4 h-4 text-slate-500 ${isPending ? 'animate-spin' : ''}`} />
            <span>تحديث</span>
          </button>

          <Link
            href="/dashboard/create-account"
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#D49B35] hover:bg-[#b8852a] text-white text-xs sm:text-sm font-bold shadow-sm transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>إضافة حساب موظف</span>
          </Link>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold">إجمالي المستخدمين</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.total}</div>
          <div className="text-[11px] text-slate-400 mt-1">حساب مسجل في النظام</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold">العملاء</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.customers}</div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1">حسابات متسوقين</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold">فريق العمل والإدارة</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.admins + stats.staff}</div>
          <div className="text-[11px] text-purple-600 font-bold mt-1">
            {stats.admins} مدير • {stats.staff} موظف
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold">الحسابات النشطة</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.active}</div>
          <div className="text-[11px] text-slate-400 mt-1">جاهزة لتسجيل الدخول</div>
        </div>
      </div>

      {/* ── Filter & Search Toolbar ── */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="البحث بالاسم، البريد الإلكتروني، أو رقم الهاتف..."
              className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D49B35] focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-2 shrink-0">
            <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#D49B35]"
            >
              <option value="all">جميع الصلاحيات</option>
              <option value="user">العملاء (User)</option>
              <option value="admin">مدير النظام (Admin)</option>
              <option value="accountant">محاسب (Accountant)</option>
              <option value="warehouse">مسؤول مستودع (Warehouse)</option>
              <option value="sales">مسؤول مبيعات (Sales)</option>
              <option value="salesManager">مدير مبيعات (Sales Manager)</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#D49B35]"
            >
              <option value="all">جميع الحالات</option>
              <option value="active">نشط فقط</option>
              <option value="inactive">غير نشط</option>
            </select>
          </div>
        </div>

        {/* Counter Bar */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <span>
            عرض <strong className="text-slate-800">{filteredUsers.length}</strong> من إجمالي{' '}
            <strong className="text-slate-800">{users.length}</strong> مستخدم
          </span>
          {(searchQuery || roleFilter !== 'all' || statusFilter !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setRoleFilter('all');
                setStatusFilter('all');
              }}
              className="text-[#D49B35] hover:underline font-bold"
            >
              إلغاء التصفية
            </button>
          )}
        </div>
      </div>

      {/* ── Table View ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="py-16 px-4 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Users className="w-8 h-8 stroke-1" />
            </div>
            <h3 className="text-base font-bold text-slate-800">لا يوجد مستخدمين</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              لم يتم العثور على أي حساب يطابق معايير البحث أو التصفية الحالية.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold">
                  <th className="py-3.5 px-4">المستخدم</th>
                  <th className="py-3.5 px-4">البريد الإلكتروني</th>
                  <th className="py-3.5 px-4">رقم الهاتف</th>
                  <th className="py-3.5 px-4">الصلاحية / الدور</th>
                  <th className="py-3.5 px-4">الحالة</th>
                  <th className="py-3.5 px-4">تاريخ الانضمام</th>
                  <th className="py-3.5 px-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => {
                  const displayName = user.name || user.fullName || 'مستخدم بدون اسم';
                  const displayPhone = user.phoneNumber || user.phone || 'غير مسجل';
                  const badge = getRoleBadge(user.role);
                  const RoleIcon = badge.icon;
                  const firstLetter = displayName.charAt(0).toUpperCase();

                  return (
                    <tr
                      key={user._id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      {/* Name & Avatar */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-linear-to-br from-[#0B2545] to-[#1D2A44] text-[#F3C053] flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                            {firstLetter}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 group-hover:text-[#D49B35] transition-colors leading-tight">
                              {displayName}
                            </p>
                            <span className="text-[10px] text-slate-400 font-mono">
                              ID: {user._id.slice(-6)}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-3.5 px-4 text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[190px]" title={user.email}>
                            {user.email}
                          </span>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="py-3.5 px-4 text-slate-600">
                        <div className="flex items-center gap-1.5" dir="ltr">
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{displayPhone}</span>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold border ${badge.bg}`}
                        >
                          <RoleIcon className="w-3 h-3" />
                          <span>{badge.label}</span>
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {user.isActive !== false ? (
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

                      {/* Created At */}
                      <td className="py-3.5 px-4 text-slate-500 text-xs">
                        {user.createdAt ? (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{new Date(user.createdAt).toLocaleDateString('ar-EG')}</span>
                          </div>
                        ) : (
                          '—'
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => setSelectedUser(user)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-500" />
                          <span>عرض</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── User Details Modal ── */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-scaleUp">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#0B2545] to-[#1D2A44] text-[#F3C053] flex items-center justify-center font-bold text-base shadow-xs">
                  {(selectedUser.name || selectedUser.fullName || 'U').charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">
                    {selectedUser.name || selectedUser.fullName || 'بيانات المستخدم'}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">ID: {selectedUser._id}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[11px] text-slate-400 block mb-1">الاسم بالكامل</span>
                  <p className="font-bold text-slate-900">
                    {selectedUser.name || selectedUser.fullName || 'غير محدد'}
                  </p>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[11px] text-slate-400 block mb-1">الصلاحية</span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold border ${getRoleBadge(selectedUser.role).bg}`}
                  >
                    {getRoleBadge(selectedUser.role).label}
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">البريد الإلكتروني</span>
                  <p className="font-bold text-slate-900 font-mono text-xs sm:text-sm">
                    {selectedUser.email}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(selectedUser.email, 'email')}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 transition-colors"
                  title="نسخ البريد"
                >
                  {copiedId === 'email' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">رقم الهاتف</span>
                  <p className="font-bold text-slate-900" dir="ltr">
                    {selectedUser.phoneNumber || selectedUser.phone || 'غير مسجل'}
                  </p>
                </div>
                {(selectedUser.phoneNumber || selectedUser.phone) && (
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(selectedUser.phoneNumber || selectedUser.phone || '', 'phone')
                    }
                    className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 transition-colors"
                    title="نسخ الهاتف"
                  >
                    {copiedId === 'phone' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[11px] text-slate-400 block mb-1">حالة الحساب</span>
                  <p className="font-bold text-slate-800">
                    {selectedUser.isActive !== false ? 'حساب نشط' : 'حساب معطل'}
                  </p>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[11px] text-slate-400 block mb-1">التحقق من الحساب</span>
                  <p className="font-bold text-slate-800">
                    {selectedUser.isVerified ? 'موثق ومعتمد' : 'غير موثق'}
                  </p>
                </div>
              </div>

              {selectedUser.createdAt && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[11px] text-slate-400 block mb-1">تاريخ الإنشاء</span>
                  <p className="font-bold text-slate-800">
                    {new Date(selectedUser.createdAt).toLocaleString('ar-EG')}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs sm:text-sm hover:bg-slate-800 transition-colors cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
