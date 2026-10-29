'use client';

import React, { useState, useMemo, useTransition } from 'react';
import {
  Package,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  User,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Briefcase,
  Store,
  RefreshCw,
  Eye,
  X,
  CreditCard,
  MapPin,
  ChevronDown,
  Loader2,
  AlertCircle,
  Copy,
  Check,
  TrendingUp,
} from 'lucide-react';
import { AdminOrder } from '@/types/admin/adminOrders';
import {
  getAccountantOrders,
  updateAccountantOrderState,
} from '@/action/accountant.action';
import { toast } from 'react-toastify';
import MarkPaidButton from './MarkPaidButton';

type Props = {
  initialOrders: AdminOrder[];
};

export default function AccountantOrdersManager({ initialOrders }: Props) {
  const [orders, setUsersOrders] = useState<AdminOrder[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Helper to extract customer details
  const getCustomerInfo = (order: AdminOrder) => {
    let name = 'عميل غير مسجل';
    let role = 'user';
    let email = order.contactEmail || '';
    let phone = order.shippingAddress?.phoneNumber || '';

    if (typeof order.user === 'object' && order.user !== null) {
      name = order.user.name || order.user.fullName || name;
      role = order.user.role || role;
      email = order.user.email || email;
      phone = order.user.phoneNumber || order.user.phone || phone;
    } else if (typeof order.customer === 'object' && order.customer !== null) {
      name = order.customer.name || order.customer.fullName || name;
      role = order.customer.role || role;
      email = order.customer.email || email;
    } else if (order.shippingAddress?.fullName) {
      name = order.shippingAddress.fullName;
    }

    return { name, role, email, phone };
  };

  // Helper for role badge
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

  // Refresh handler
  const handleRefresh = () => {
    startTransition(async () => {
      const fresh = await getAccountantOrders();
      setUsersOrders(fresh);
      toast.success('تم تحديث قائمة الطلبات بنجاح');
    });
  };

  // State Dropdown change handler: Delivered | Refused | isPaid
  const handleStateChange = async (
    orderId: string,
    newState: 'Delivered' | 'Refused' | 'isPaid'
  ) => {
    setUpdatingId(orderId);
    try {
      const res = await updateAccountantOrderState(orderId, newState);
      if (res.success) {
        toast.success(res.message || 'تم تحديث حالة الطلب بنجاح');
        // Update local state
        setUsersOrders((prev) =>
          prev.map((ord) => {
            if (ord._id !== orderId) return ord;
            if (newState === 'isPaid') {
              return { ...ord, isPaid: true };
            }
            if (newState === 'Delivered') {
              return { ...ord, orderStatus: 'Delivered' };
            }
            if (newState === 'Refused') {
              return { ...ord, orderStatus: 'Refused' };
            }
            return ord;
          })
        );
      } else {
        toast.error(res.message || 'فشل تحديث حالة الطلب');
      }
    } catch {
      toast.error('حدث خطأ في الاتصال بالخادم');
    } finally {
      setUpdatingId(null);
    }
  };

  // Handle successful payment confirmation from MarkPaidButton
  const handleOrderPaidSuccess = (updatedOrder: AdminOrder) => {
    setUsersOrders((prev) =>
      prev.map((ord) =>
        ord._id === updatedOrder._id
          ? { ...ord, ...updatedOrder, isPaid: true }
          : ord
      )
    );
    if (selectedOrder && selectedOrder._id === updatedOrder._id) {
      setSelectedOrder((prev) =>
        prev ? { ...prev, ...updatedOrder, isPaid: true } : null
      );
    }
  };

  // Copy helper
  const handleCopy = (text: string, id: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const q = searchQuery.toLowerCase().trim();
      const { name, email, phone, role } = getCustomerInfo(order);
      const orderNo = (order.orderNumber || order._id || '').toLowerCase();

      const matchesSearch =
        !q ||
        orderNo.includes(q) ||
        name.toLowerCase().includes(q) ||
        email.toLowerCase().includes(q) ||
        phone.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === 'all' || order.orderStatus === statusFilter;

      const matchesPayment =
        paymentFilter === 'all' ||
        (paymentFilter === 'paid' && order.isPaid === true) ||
        (paymentFilter === 'unpaid' && !order.isPaid);

      const matchesRole = roleFilter === 'all' || role === roleFilter;

      return matchesSearch && matchesStatus && matchesPayment && matchesRole;
    });
  }, [orders, searchQuery, statusFilter, paymentFilter, roleFilter]);

  // Financial Stats
  const stats = useMemo(() => {
    const total = orders.length;
    const delivered = orders.filter((o) => o.orderStatus === 'Delivered').length;
    const refused = orders.filter(
      (o) => o.orderStatus === 'Refused' || o.orderStatus === 'Cancelled'
    ).length;
    const paid = orders.filter((o) => o.isPaid === true).length;
    const totalRevenue = orders
      .filter((o) => o.isPaid === true)
      .reduce((acc, o) => acc + (o.finalPrice || o.totalPrice || 0), 0);
    const pendingRevenue = orders
      .filter((o) => !o.isPaid && o.orderStatus !== 'Refused' && o.orderStatus !== 'Cancelled')
      .reduce((acc, o) => acc + (o.finalPrice || o.totalPrice || 0), 0);

    return { total, delivered, refused, paid, totalRevenue, pendingRevenue };
  }, [orders]);

  return (
    <div className="space-y-6 font-['Cairo'] text-right" dir="rtl">
      {/* ── Top Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-linear-to-br from-[#0B2545] to-[#134074] text-[#F3C053] flex items-center justify-center shadow-xs">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              إدارة طلبات المحاسب
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              متابعة جميع الأوردرات، أسماء وأدوار العملاء، وتحديث الحالات (Delivered - Refused - isPaid)
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={isPending}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 text-slate-500 ${isPending ? 'animate-spin' : ''}`} />
          <span>تحديث الطلبات</span>
        </button>
      </div>

      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold">إجمالي الطلبات</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.total}</div>
          <div className="text-[11px] text-slate-400 mt-1">طلب مسجل بالكامل</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold">تم التوصيل (Delivered)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600">{stats.delivered}</div>
          <div className="text-[11px] text-emerald-700 font-bold mt-1">طلبات مكتملة التسليم</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold">تم الرفض (Refused)</span>
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-red-600">{stats.refused}</div>
          <div className="text-[11px] text-red-700 font-bold mt-1">طلبات مرفوضة أو ملغية</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold">المبالغ المحصلة (isPaid)</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {stats.totalRevenue.toLocaleString('en-US')}{' '}
            <span className="text-xs font-bold text-slate-500">ج.م</span>
          </div>
          <div className="text-[11px] text-amber-700 font-bold mt-1">
            {stats.paid} طلب مسدد بالكامل
          </div>
        </div>
      </div>

      {/* ── Search & Filter Controls ── */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="البحث برقم الأوردر، اسم العميل، الهاتف، أو البريد..."
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
          <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap">
            <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#D49B35]"
            >
              <option value="all">كل أدوار العملاء (Roles)</option>
              <option value="user">عميل عادي (User)</option>
              <option value="admin">مدير (Admin)</option>
              <option value="sales">مسؤول مبيعات (Sales)</option>
              <option value="accountant">محاسب (Accountant)</option>
              <option value="warehouse">مستودع (Warehouse)</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#D49B35]"
            >
              <option value="all">جميع الحالات</option>
              <option value="Delivered">تم التوصيل (Delivered)</option>
              <option value="Refused">تم الرفض (Refused)</option>
              <option value="Pending">قيد الانتظار (Pending)</option>
              <option value="Preparing">جاري التجهيز (Preparing)</option>
              <option value="Shipped">تم الشحن (Shipped)</option>
              <option value="Cancelled">ملغي (Cancelled)</option>
            </select>

            {/* Payment Filter */}
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#D49B35]"
            >
              <option value="all">حالة السداد</option>
              <option value="paid">مدفوع (isPaid)</option>
              <option value="unpaid">غير مدفوع</option>
            </select>
          </div>
        </div>

        {/* Counter & Reset */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <span>
            عرض <strong className="text-slate-800">{filteredOrders.length}</strong> من إجمالي{' '}
            <strong className="text-slate-800">{orders.length}</strong> أوردر
          </span>
          {(searchQuery || statusFilter !== 'all' || paymentFilter !== 'all' || roleFilter !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setPaymentFilter('all');
                setRoleFilter('all');
              }}
              className="text-[#D49B35] hover:underline font-bold"
            >
              إلغاء التصفية
            </button>
          )}
        </div>
      </div>

      {/* ── Orders Table ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="py-16 px-4 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Package className="w-8 h-8 stroke-1" />
            </div>
            <h3 className="text-base font-bold text-slate-800">لا توجد طلبات مطابقة</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              لم نتمكن من العثور على أي أوردر يطابق معايير البحث أو التصفية المختارة.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold">
                  <th className="py-3.5 px-4">رقم الأوردر</th>
                  <th className="py-3.5 px-4">اسم العميل</th>
                  <th className="py-3.5 px-4">دور العميل (Role)</th>
                  <th className="py-3.5 px-4">المبلغ</th>
                  <th className="py-3.5 px-4 text-center">حالة الدفع</th>
                  <th className="py-3.5 px-4 text-center">تأكيد الدفع</th>
                  <th className="py-3.5 px-4">الحالة الحالية</th>
                  <th className="py-3.5 px-4 text-center">تغيير الحالة (State Dropdown)</th>
                  <th className="py-3.5 px-4 text-center">التفاصيل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => {
                  const { name, role, email, phone } = getCustomerInfo(order);
                  const roleBadge = getRoleBadge(role);
                  const RoleIcon = roleBadge.icon;
                  const finalAmount = order.finalPrice ?? order.totalPrice ?? 0;
                  const isUpdating = updatingId === order._id;
                  const shortId = order.orderNumber || order._id.slice(-6);

                  return (
                    <tr
                      key={order._id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      {/* Order Number */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 font-mono font-bold text-slate-900">
                          <span>#{shortId}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(order.orderNumber || order._id, order._id)}
                            className="text-slate-400 hover:text-slate-600 p-1"
                            title="نسخ رقم الطلب"
                          >
                            {copiedId === order._id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        <span className="text-[10px] text-slate-400 block">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString('ar-EG')
                            : '—'}
                        </span>
                      </td>

                      {/* Customer Name */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 group-hover:text-[#D49B35] transition-colors leading-snug">
                          {name}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono" dir="ltr">
                          {phone || email || '—'}
                        </div>
                      </td>

                      {/* Customer Role */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold border ${roleBadge.bg}`}
                        >
                          <RoleIcon className="w-3 h-3" />
                          <span>{roleBadge.label}</span>
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4">
                        <div className="font-black text-slate-900 text-sm">
                          {finalAmount.toLocaleString('en-US')}{' '}
                          <span className="text-xs font-normal text-slate-500">ج.م</span>
                        </div>
                        {order.paymentMethod && (
                          <span className="text-[10px] text-slate-400 block">
                            {order.paymentMethod}
                          </span>
                        )}
                      </td>

                      {/* Payment Status (isPaid) */}
                      <td className="py-3.5 px-4 text-center">
                        {order.isPaid ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>مدفوع</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200/60">
                            <Clock className="w-3.5 h-3.5" />
                            <span>غير مدفوع</span>
                          </span>
                        )}
                      </td>

                      {/* Mark Paid Button Action */}
                      <td className="py-3.5 px-4 text-center">
                        <MarkPaidButton
                          order={order}
                          onSuccess={handleOrderPaidSuccess}
                        />
                      </td>

                      {/* Order Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold ${
                            order.orderStatus === 'Delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : order.orderStatus === 'Refused' || order.orderStatus === 'Cancelled'
                              ? 'bg-red-100 text-red-800'
                              : order.orderStatus === 'Shipped'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {order.orderStatus === 'Delivered'
                            ? 'تم التوصيل'
                            : order.orderStatus === 'Refused'
                            ? 'تم الرفض'
                            : order.orderStatus === 'Cancelled'
                            ? 'ملغي'
                            : order.orderStatus === 'Shipped'
                            ? 'تم الشحن'
                            : order.orderStatus === 'Preparing'
                            ? 'جاري التجهيز'
                            : 'قيد الانتظار'}
                        </span>
                      </td>

                      {/* State Dropdown (Delivered | Refused | isPaid) */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="relative inline-block text-right">
                          {isUpdating ? (
                            <div className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold">
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#D49B35]" />
                              <span>جاري الحفظ...</span>
                            </div>
                          ) : (
                            <select
                              defaultValue=""
                              onChange={(e) => {
                                const val = e.target.value as 'Delivered' | 'Refused' | 'isPaid';
                                if (val) {
                                  handleStateChange(order._id, val);
                                  e.target.value = '';
                                }
                              }}
                              className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:border-[#D49B35] text-slate-800 text-xs font-black shadow-xs focus:outline-none focus:ring-2 focus:ring-[#D49B35] cursor-pointer transition-colors"
                            >
                              <option value="" disabled>
                                اختر الإجراء (State) ▼
                              </option>
                              <option value="Delivered" className="text-emerald-700 font-bold">
                                ✓ تم التوصيل (Delivered)
                              </option>
                              <option value="Refused" className="text-red-700 font-bold">
                                ✗ تم الرفض (Refused)
                              </option>
                              <option value="isPaid" className="text-blue-700 font-bold">
                                $ تم الدفع (isPaid)
                              </option>
                            </select>
                          )}
                        </div>
                      </td>

                      {/* View Details */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
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

      {/* ── Order Details Modal ── */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-2xl border border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-scaleUp">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/70">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#0B2545] to-[#134074] text-[#F3C053] flex items-center justify-center font-bold text-base shadow-xs">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">
                    تفاصيل الأوردر #{selectedOrder.orderNumber || selectedOrder._id}
                  </h3>
                  <p className="text-xs text-slate-500">
                    بتاريخ:{' '}
                    {selectedOrder.createdAt
                      ? new Date(selectedOrder.createdAt).toLocaleString('ar-EG')
                      : '—'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-5 overflow-y-auto flex-1 text-xs sm:text-sm">
              {/* Customer Box */}
              {(() => {
                const info = getCustomerInfo(selectedOrder);
                const roleBadge = getRoleBadge(info.role);
                const RoleIcon = roleBadge.icon;
                return (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <h4 className="font-bold text-slate-800 text-xs mb-3 flex items-center gap-1.5">
                      <User className="w-4 h-4 text-[#D49B35]" />
                      <span>بيانات العميل (Customer Information):</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <span className="text-[11px] text-slate-400 block">اسم العميل</span>
                        <strong className="text-slate-900">{info.name}</strong>
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-400 block">الدور والصلاحية</span>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold border mt-0.5 ${roleBadge.bg}`}
                        >
                          <RoleIcon className="w-3 h-3" />
                          <span>{roleBadge.label}</span>
                        </span>
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-400 block">الهاتف والبريد</span>
                        <span className="text-slate-700 font-mono" dir="ltr">
                          {info.phone || info.email || '—'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Order Status & Payment Status */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <span className="text-[11px] text-slate-400 block mb-1">حالة الأوردر</span>
                  <span className="font-black text-slate-900">
                    {selectedOrder.orderStatus}
                  </span>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block mb-1">حالة السداد (isPaid)</span>
                    <span
                      className={`font-black ${
                        selectedOrder.isPaid ? 'text-emerald-600' : 'text-amber-600'
                      }`}
                    >
                      {selectedOrder.isPaid ? '✓ تم السداد (Paid)' : '⏳ غير مسدد'}
                    </span>
                  </div>
                  <div>
                    <MarkPaidButton
                      order={selectedOrder}
                      onSuccess={handleOrderPaidSuccess}
                    />
                  </div>
                </div>
              </div>

              {/* Products List */}
              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-800 text-xs mb-2">المنتجات المطلوبة:</h4>
                  <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden bg-white">
                    {selectedOrder.items.map((it, idx) => {
                      const prodTitle =
                        it.name ||
                        (typeof it.product === 'object' ? it.product?.title : null) ||
                        `منتج ${idx + 1}`;
                      return (
                        <div key={idx} className="p-3 flex items-center justify-between text-xs">
                          <div>
                            <p className="font-bold text-slate-900">{prodTitle}</p>
                            <p className="text-[11px] text-slate-400">
                              الكمية: {it.quantity || 1}{' '}
                              {it.size ? `• المقاس: ${it.size}` : ''}{' '}
                              {it.color ? `• اللون: ${it.color}` : ''}
                            </p>
                          </div>
                          <span className="font-black text-slate-800">
                            {((it.price || 0) * (it.quantity || 1)).toLocaleString('en-US')} ج.م
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Shipping Address */}
              {selectedOrder.shippingAddress && (
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <h4 className="font-bold text-slate-800 text-xs mb-2 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#D49B35]" />
                    <span>عنوان التوصيل والشحن:</span>
                  </h4>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    {[
                      selectedOrder.shippingAddress.governorate,
                      selectedOrder.shippingAddress.city,
                      selectedOrder.shippingAddress.area,
                      selectedOrder.shippingAddress.street,
                      selectedOrder.shippingAddress.building,
                    ]
                      .filter(Boolean)
                      .join(' - ') || 'لا يوجد تفاصيل إضافية للعنوان'}
                  </p>
                </div>
              )}

              {/* Financial Totals */}
              <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                <span className="font-bold text-slate-600">المبلغ الإجمالي النهائي:</span>
                <span className="text-xl font-black text-slate-900 text-[#D49B35]">
                  {(selectedOrder.finalPrice || selectedOrder.totalPrice || 0).toLocaleString(
                    'en-US'
                  )}{' '}
                  ج.م
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
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
