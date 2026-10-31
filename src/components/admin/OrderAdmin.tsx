'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import {
  ShoppingBag,
  Search,
  Eye,
  X,
  Clock,
  CheckCircle2,
  PackageCheck,
  Truck,
  XCircle,
  User,
  ShieldAlert,
  Phone,
  MapPin,
  RefreshCw,
  Loader2,
  BadgeCheck,
  Bike,
} from 'lucide-react';
import { getAllOrdersAdmin, updateOrderStatus, getAllUsersAdmin } from '@/action/admin.action';
import { markOrderPaid } from '@/action/order.action';
import { AdminOrder } from '@/types/admin/adminOrders';
import { AdminCustomer } from '@/types/admin/adminCustomer';
import { toast } from 'react-toastify';

type OrderStatus = AdminOrder['orderStatus'];

// الحالات المتسلسلة لخط سير الطلب القياسي
const ORDER_PROGRESS_STEPS = [
  { key: 'Pending', label: 'قيد الانتظار', icon: Clock, desc: 'تم استلام الطلب' },
  { key: 'Preparing', label: 'جاري التجهيز', icon: PackageCheck, desc: 'تجهيز الطلب في المخزن' },
  { key: 'Shipped', label: 'تم الشحن', icon: Truck, desc: 'مع مندوب / شركة الشحن' },
  { key: 'Delivered', label: 'تم التوصيل', icon: CheckCircle2, desc: 'تم تسليم الطلب للعميل' },
];

const STATUS_LABELS: Record<string, string> = {
  Pending: 'قيد الانتظار',
  Preparing: 'جاري التجهيز',
  Shipped: 'تم الشحن',
  Delivered: 'تم التوصيل',
  Cancelled: 'ملغي',
  Refused: 'مرفوض',
};

// نفس الانتقالات المسموحة في الباك
const NEXT_STATUSES: Record<string, OrderStatus[]> = {
  Pending: ['Preparing', 'Cancelled'],
  Preparing: ['Shipped', 'Cancelled'],
  Shipped: ['Delivered', 'Refused'],
};

export default function OrderAdmin() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  // طريقة الشحن المختارة مؤقتًا لكل طلب (قبل التأكيد)
  const [shippingMethodMap, setShippingMethodMap] = useState<Record<string, 'Company' | 'Courier'>>({});
  // اسم شركة الشحن لكل طلب
  const [companyNameMap, setCompanyNameMap] = useState<Record<string, string>>({});
  // المندوب المختار لكل طلب
  const [selectedCourierMap, setSelectedCourierMap] = useState<Record<string, string>>({});
  // كل المستخدمين (لتصفية المناديب)
  const [allUsers, setAllUsers] = useState<AdminCustomer[]>([]);

  const safeOrders = Array.isArray(orders) ? orders : [];

  // جلب الطلبات
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getAllOrdersAdmin();
      if (!Array.isArray(data)) {
        toast.error('فشل تحميل قائمة الطلبات');
        setOrders([]);
        return;
      }
      setOrders(data);
    } catch {
      toast.error('فشل تحميل قائمة الطلبات');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const users = await getAllUsersAdmin();
      if (Array.isArray(users)) setAllUsers(users);
    } catch {
      console.error('فشل جلب قائمة المستخدمين');
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchUsers();
  }, []);

  // المستخدمين أصحاب دور Courier
  const courierUsers = useMemo(
    () => allUsers.filter((u) => String(u.role || '').toLowerCase().trim() === 'courier'),
    [allUsers],
  );

  // تحديث أوردر محليًا (في الجدول والمودال)
  const applyLocalUpdate = (orderId: string, patch: Partial<AdminOrder>) => {
    setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, ...patch } : o)));
    setSelectedOrder((prev) => (prev && prev._id === orderId ? { ...prev, ...patch } : prev));
  };

  const clearShippingDraft = (orderId: string) => {
    setShippingMethodMap((prev) => {
      const next = { ...prev };
      delete next[orderId];
      return next;
    });
    setCompanyNameMap((prev) => {
      const next = { ...prev };
      delete next[orderId];
      return next;
    });
    setSelectedCourierMap((prev) => {
      const next = { ...prev };
      delete next[orderId];
      return next;
    });
  };

  // دور اللي حجز الأوردر، أو العميل لو الأوردر من الموقع
  const getUserRole = (order: AdminOrder): string => {
    if (order.bookedBy?.role) return order.bookedBy.role.toLowerCase();
    const userObj = order.user && typeof order.user === 'object' ? order.user : null;
    return (userObj?.role || 'customer').toLowerCase();
  };

  const renderRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-50 text-rose-700 border border-rose-200">
            <ShieldAlert className="w-3 h-3" />
            أدمن
          </span>
        );
      case 'salesmanager':
      case 'sales_manager':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-purple-50 text-purple-700 border border-purple-200">
            مدير مبيعات
          </span>
        );
      case 'sales':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-[#D49B35] border border-amber-200">
            سيلز
          </span>
        );
      case 'accountant':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            محاسب
          </span>
        );
      case 'warehouse':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            أمين مخزن
          </span>
        );
      case 'courier':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-50 text-cyan-700 border border-cyan-200">
            <Bike className="w-3 h-3 text-cyan-600" />
            مندوب (Courier)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
            <User className="w-3 h-3 text-slate-500" />
            عميل
          </span>
        );
    }
  };

  const getUserName = (order: AdminOrder): string => {
    if (order.shippingAddress?.fullName) return order.shippingAddress.fullName;
    const u = order.user && typeof order.user === 'object' ? order.user : null;
    return u?.name || 'عميل غير مسجل';
  };

  const getUserPhone = (order: AdminOrder): string => {
    if (order.shippingAddress?.phoneNumber) return order.shippingAddress.phoneNumber;
    const u = order.user && typeof order.user === 'object' ? order.user : null;
    return u?.phoneNumber || 'غير متوفر';
  };

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'Pending':
        return 0;
      case 'Preparing':
        return 1;
      case 'Shipped':
        return 2;
      case 'Delivered':
        return 3;
      default:
        return -1;
    }
  };

  // شارة بيانات الشحن (تفضل ظاهرة بعد الشحن)
  const renderShippingInfo = (order: AdminOrder) => {
    const s = order.shipping;
    if (!s?.method) return null;

    if (s.method === 'Courier') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold bg-cyan-50 text-cyan-700 border border-cyan-200">
          <Bike className="w-3 h-3" />
          <span>{s.courierName || 'مندوب'}</span>
          {s.courierPhone && <span dir="ltr">({s.courierPhone})</span>}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
        <Truck className="w-3 h-3" />
        <span>{s.companyName || 'شركة شحن'}</span>
        {s.trackingNumber && <span dir="ltr">#{s.trackingNumber}</span>}
      </span>
    );
  };

  const renderPaidBadge = (order: AdminOrder) =>
    order.isPaid ? (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <BadgeCheck className="w-3 h-3" />
        مدفوع
      </span>
    ) : null;

  // تأكيد الدفع
  const handleMarkPaid = async (orderId: string) => {
    setUpdatingId(orderId);
    try {
      const res = await markOrderPaid(orderId);
      if (res.success) {
        toast.success(res.message || 'تم تأكيد الدفع بنجاح');
        applyLocalUpdate(orderId, { isPaid: true, paidAt: new Date().toISOString() });
      } else {
        toast.error(res.message || 'فشل تأكيد الدفع');
      }
    } catch {
      toast.error('حدث خطأ أثناء الاتصال بالخادم');
    } finally {
      setUpdatingId(null);
    }
  };

  // تغيير الحالة من القائمة
  const handleStatusChange = async (order: AdminOrder, rawValue: string) => {
    const orderId = order._id;

    if (rawValue === 'PAID') {
      await handleMarkPaid(orderId);
      return;
    }

    // الشحن: ما نبعتش للسيرفر قبل ما يتحدد المندوب أو الشركة
    if (rawValue === 'Shipped:Company' || rawValue === 'Shipped:Courier') {
      setShippingMethodMap((prev) => ({
        ...prev,
        [orderId]: rawValue === 'Shipped:Company' ? 'Company' : 'Courier',
      }));
      return;
    }

    if (rawValue === order.orderStatus) {
      clearShippingDraft(orderId);
      return;
    }

    const newStatus = rawValue as OrderStatus;
    clearShippingDraft(orderId);
    setUpdatingId(orderId);
    try {
      const res = await updateOrderStatus(orderId, newStatus);
      if (res.success) {
        toast.success(`تم تحديث حالة الطلب إلى "${STATUS_LABELS[newStatus]}" بنجاح`);
        applyLocalUpdate(orderId, { orderStatus: newStatus });
      } else {
        toast.error(res.message || 'فشل تحديث الحالة');
      }
    } catch {
      toast.error('حدث خطأ أثناء الاتصال بالخادم');
    } finally {
      setUpdatingId(null);
    }
  };

  // تأكيد الشحن بشركة
  const handleShipByCompanyConfirm = async (orderId: string) => {
    const companyName = companyNameMap[orderId]?.trim();
    if (!companyName) {
      toast.warn('يرجى إدخال اسم شركة الشحن أولاً');
      return;
    }
    setUpdatingId(orderId);
    try {
      const res = await updateOrderStatus(orderId, 'Shipped', {
        shipping: { method: 'Company', companyName },
      });
      if (res.success) {
        toast.success(`تم الشحن بواسطة شركة "${companyName}" بنجاح`);
        applyLocalUpdate(orderId, {
          orderStatus: 'Shipped',
          shipping: { method: 'Company', companyName },
        });
        clearShippingDraft(orderId);
      } else {
        toast.error(res.message || 'فشل تحديث الحالة');
      }
    } catch {
      toast.error('حدث خطأ أثناء الاتصال بالخادم');
    } finally {
      setUpdatingId(null);
    }
  };

  // تأكيد الشحن بمندوب
  const handleShipByCourierConfirm = async (orderId: string) => {
    const courierId = selectedCourierMap[orderId]?.trim();
    if (!courierId) {
      toast.warn('يرجى اختيار مندوب التوصيل أولاً');
      return;
    }
    const courier = courierUsers.find((c) => c._id === courierId);
    const courierName = courier?.fullName || courier?.name || 'مندوب التوصيل';
    const courierPhone = courier?.phoneNumber || courier?.phone;

    setUpdatingId(orderId);
    try {
      const res = await updateOrderStatus(orderId, 'Shipped', {
        shipping: { method: 'Courier', courierName, courierPhone },
      });
      if (res.success) {
        toast.success(`تم الشحن مع المندوب "${courierName}" بنجاح 🛵`);
        applyLocalUpdate(orderId, {
          orderStatus: 'Shipped',
          shipping: { method: 'Courier', courierName, courierPhone },
        });
        clearShippingDraft(orderId);
      } else {
        toast.error(res.message || 'فشل تحديث الحالة');
      }
    } catch {
      toast.error('حدث خطأ أثناء الاتصال بالخادم');
    } finally {
      setUpdatingId(null);
    }
  };

  // تصفية الطلبات
  const filteredOrders = useMemo(() => {
    return safeOrders.filter((order) => {
      const q = searchQuery.toLowerCase().trim();
      const orderNum = (order.orderNumber || order._id).toLowerCase();
      const customerName = getUserName(order).toLowerCase();
      const phone = getUserPhone(order).toLowerCase();
      const matchSearch =
        !q || orderNum.includes(q) || customerName.includes(q) || phone.includes(q);

      const matchStatus = statusFilter === 'ALL' || order.orderStatus === statusFilter;

      const role = getUserRole(order);
      const matchRole = roleFilter === 'ALL' || role === roleFilter.toLowerCase();

      return matchSearch && matchStatus && matchRole;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeOrders, searchQuery, statusFilter, roleFilter]);

  const statusClass = (status: string) =>
    status === 'Delivered'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : status === 'Shipped'
      ? 'bg-blue-50 text-blue-700 border-blue-200'
      : status === 'Preparing'
      ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
      : status === 'Pending'
      ? 'bg-amber-50 text-amber-700 border-amber-200'
      : 'bg-rose-50 text-rose-700 border-rose-200';

  return (
    <div className="space-y-6 pb-12 font-['Cairo'] text-right" dir="rtl">
      {/* رأس الصفحة */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#08101E] text-[#D49B35] flex items-center justify-center shadow-xs">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#08101E]">
              إدارة الطلبات (Orders)
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              متابعة كافة طلبات المتجر، فحص تفاصيل العميل، وأدوار المستخدمين وتتبع خط سير الحالة.
            </p>
          </div>
        </div>

        <button
          onClick={fetchOrders}
          disabled={loading}
          className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-[#D49B35] hover:text-[#D49B35] bg-white text-xs font-bold text-slate-700 transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#D49B35]' : ''}`} />
          <span>تحديث القائمة</span>
        </button>
      </div>

      {/* البحث والفلاتر */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="البحث برقم الطلب، اسم العميل، أو رقم الهاتف..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pr-10 pl-4 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D49B35] transition-all"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D49B35] transition-all cursor-pointer"
            >
              <option value="ALL">جميع الحالات</option>
              {Object.entries(STATUS_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label} ({key})
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D49B35] transition-all cursor-pointer"
            >
              <option value="ALL">جميع الأدوار (All Roles)</option>
              <option value="customer">عميل (Customer)</option>
              <option value="admin">أدمن (Admin)</option>
              <option value="salesmanager">مدير مبيعات (Sales Manager)</option>
              <option value="sales">سيلز (Sales)</option>
              <option value="accountant">محاسب (Accountant)</option>
              <option value="warehouse">أمين مخزن (Warehouse)</option>
              <option value="courier">مندوب توصيل (Courier)</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
          <span>
            إجمالي النتائج: <strong className="text-[#08101E]">{filteredOrders.length}</strong> طلب
          </span>
          <span>•</span>
          <span>
            المعلقة:{' '}
            <strong className="text-amber-600">
              {safeOrders.filter((o) => o.orderStatus === 'Pending').length}
            </strong>
          </span>
          <span>•</span>
          <span>
            المكتملة:{' '}
            <strong className="text-emerald-600">
              {safeOrders.filter((o) => o.orderStatus === 'Delivered').length}
            </strong>
          </span>
          <span>•</span>
          <span>
            المدفوعة:{' '}
            <strong className="text-emerald-600">{safeOrders.filter((o) => o.isPaid).length}</strong>
          </span>
        </div>
      </div>

      {/* الجدول */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-[#D49B35]" />
            <span className="text-sm font-bold">جاري تحميل الطلبات...</span>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-base font-bold text-slate-700">لا توجد طلبات تطابق معايير البحث</p>
            <p className="text-xs text-slate-400 mt-1">
              جرّب تغيير خيارات الفلترة أو تفريغ شريط البحث
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 text-xs font-bold">
                  <th className="py-4 px-4">رقم الطلب</th>
                  <th className="py-4 px-4">العميل / المستلم</th>
                  <th className="py-4 px-4">دور المستخدم (Role)</th>
                  <th className="py-4 px-4">الإجمالي</th>
                  <th className="py-4 px-4">حالة الطلب</th>
                  <th className="py-4 px-4">تاريخ الطلب</th>
                  <th className="py-4 px-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {filteredOrders.map((order) => {
                  const role = getUserRole(order);
                  const isCurrentUpdating = updatingId === order._id;
                  const pendingMethod = shippingMethodMap[order._id];

                  const nextStatuses = NEXT_STATUSES[order.orderStatus] ?? [];
                  const canPay =
                    !order.isPaid &&
                    order.orderStatus !== 'Cancelled' &&
                    order.orderStatus !== 'Refused';
                  const isFinal = nextStatuses.length === 0 && !canPay;

                  return (
                    <tr key={order._id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-4">
                        <span className="font-mono font-bold text-[#08101E] block">
                          #{order.orderNumber || order._id.slice(-6).toUpperCase()}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {order._id.slice(0, 10)}...
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-800">{getUserName(order)}</div>
                        <div
                          className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"
                          dir="ltr"
                        >
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{getUserPhone(order)}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4">{renderRoleBadge(role)}</td>

                      <td className="py-4 px-4">
                        <span className="font-black text-[#08101E]">
                          {(order.finalPrice || order.totalPrice || 0).toLocaleString('ar-EG')}
                        </span>
                        <span className="text-[11px] text-slate-400 mr-1">ج.م</span>
                      </td>

                      {/* الحالة */}
                      <td className="py-4 px-4">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2">
                            <select
                              disabled={isCurrentUpdating || isFinal}
                              value={pendingMethod ? `Shipped:${pendingMethod}` : order.orderStatus}
                              onChange={(e) => handleStatusChange(order, e.target.value)}
                              className={`px-2.5 py-1 rounded-xl text-xs font-bold border outline-none cursor-pointer transition-all disabled:cursor-default ${statusClass(
                                order.orderStatus,
                              )}`}
                            >
                              {/* الحالة الحالية (ثابتة) */}
                              <option value={order.orderStatus}>
                                {STATUS_LABELS[order.orderStatus] ?? order.orderStatus}
                              </option>

                              {/* الحالات المسموحة */}
                              {nextStatuses.map((s) =>
                                s === 'Shipped' ? (
                                  <React.Fragment key="shipped-options">
                                    <option value="Shipped:Company">تم الشحن - شركة شحن 🏢</option>
                                    <option value="Shipped:Courier">تم الشحن - مندوب 🛵</option>
                                  </React.Fragment>
                                ) : (
                                  <option key={s} value={s}>
                                    {STATUS_LABELS[s]}
                                  </option>
                                ),
                              )}

                              {/* تأكيد الدفع */}
                              {canPay && <option value="PAID">تم الدفع 💰</option>}
                            </select>
                            {isCurrentUpdating && (
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#D49B35]" />
                            )}
                          </div>

                          {/* شارات ثابتة: الشحن + الدفع */}
                          <div className="flex flex-wrap items-center gap-1.5">
                            {renderShippingInfo(order)}
                            {renderPaidBadge(order)}
                          </div>

                          {/* اسم شركة الشحن */}
                          {pendingMethod === 'Company' && (
                            <div className="flex items-center gap-1.5 mt-1">
                              <input
                                type="text"
                                placeholder="اسم شركة الشحن..."
                                value={companyNameMap[order._id] || ''}
                                onChange={(e) =>
                                  setCompanyNameMap((prev) => ({
                                    ...prev,
                                    [order._id]: e.target.value,
                                  }))
                                }
                                className="flex-1 min-w-0 h-7 px-2.5 rounded-lg border border-blue-200 bg-blue-50/50 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#D49B35]"
                              />
                              <button
                                disabled={isCurrentUpdating || !companyNameMap[order._id]?.trim()}
                                onClick={() => handleShipByCompanyConfirm(order._id)}
                                className="h-7 px-2.5 rounded-lg bg-[#08101E] hover:bg-[#1a273e] text-white text-[11px] font-bold whitespace-nowrap cursor-pointer transition-all disabled:opacity-50"
                              >
                                تأكيد
                              </button>
                              <button
                                type="button"
                                onClick={() => clearShippingDraft(order._id)}
                                className="h-7 px-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-500 cursor-pointer flex items-center justify-center"
                                title="إلغاء"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}

                          {/* اختيار المندوب */}
                          {pendingMethod === 'Courier' && (
                            <div className="flex items-center gap-1.5 mt-1">
                              <select
                                value={selectedCourierMap[order._id] || ''}
                                onChange={(e) =>
                                  setSelectedCourierMap((prev) => ({
                                    ...prev,
                                    [order._id]: e.target.value,
                                  }))
                                }
                                className="flex-1 min-w-0 h-7 px-2 rounded-lg border border-cyan-300 bg-cyan-50/70 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
                              >
                                <option value="">اختر المندوب...</option>
                                {courierUsers.length > 0 ? (
                                  courierUsers.map((c) => {
                                    const name = c.fullName || c.name || c.email || 'مندوب';
                                    const phone = c.phoneNumber || c.phone;
                                    return (
                                      <option key={c._id} value={c._id}>
                                        🛵 {name} {phone ? `(${phone})` : ''}
                                      </option>
                                    );
                                  })
                                ) : (
                                  <option value="" disabled>
                                    لا يوجد مناديب مسجلين
                                  </option>
                                )}
                              </select>
                              <button
                                disabled={isCurrentUpdating || !selectedCourierMap[order._id]}
                                onClick={() => handleShipByCourierConfirm(order._id)}
                                className="h-7 px-2.5 rounded-lg bg-cyan-800 hover:bg-cyan-900 text-white text-[11px] font-bold whitespace-nowrap cursor-pointer transition-all disabled:opacity-50"
                              >
                                تأكيد
                              </button>
                              <button
                                type="button"
                                onClick={() => clearShippingDraft(order._id)}
                                className="h-7 px-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-500 cursor-pointer flex items-center justify-center"
                                title="إلغاء"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-4 text-slate-500 text-xs">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString('ar-EG', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          : '—'}
                      </td>

                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#08101E] hover:bg-[#1a273e] text-white text-xs font-bold transition-all active:scale-95 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#D49B35]" />
                          <span>عرض المزيد</span>
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

      {/* مودال التفاصيل */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          dir="rtl"
        >
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="p-6 bg-[#08101E] text-white flex items-center justify-between">
              <div>
                <span className="text-[#D49B35] text-xs font-bold block mb-1">
                  تفاصيل الطلب الكاملة
                </span>
                <h3 className="text-xl font-black">
                  طلب رقم: #{selectedOrder.orderNumber || selectedOrder._id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 md:p-8 space-y-8 max-h-[80vh] overflow-y-auto">
              {/* خط سير الحالة */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <h4 className="text-sm font-black text-[#08101E] mb-6 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                  مراحل وخط سير حالة الطلب (Order State Pipeline)
                </h4>

                {selectedOrder.orderStatus === 'Cancelled' ||
                selectedOrder.orderStatus === 'Refused' ? (
                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-800">
                    <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
                    <div>
                      <p className="font-bold text-sm">
                        هذا الطلب {selectedOrder.orderStatus === 'Cancelled' ? 'تم إلغاؤه' : 'مرفوض'}
                      </p>
                      <p className="text-xs text-rose-600 mt-0.5">
                        تم إيقاف تتبع خط سير الطلب نظراً لعدم اكتماله.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="grid grid-cols-4 gap-2 relative z-10">
                      {ORDER_PROGRESS_STEPS.map((step, idx) => {
                        const currentStepIdx = getStepIndex(selectedOrder.orderStatus);
                        const isCompleted = idx <= currentStepIdx;
                        const isCurrent = idx === currentStepIdx;
                        const StepIcon = step.icon;

                        return (
                          <div key={step.key} className="flex flex-col items-center text-center">
                            <div
                              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm ${
                                isCompleted
                                  ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                                  : 'bg-white text-slate-400 border border-slate-200'
                              } ${isCurrent ? 'scale-110' : ''}`}
                            >
                              <StepIcon className="w-5 h-5" />
                            </div>
                            <div className="mt-3">
                              <span
                                className={`text-xs block font-bold ${
                                  isCompleted ? 'text-emerald-700 font-black' : 'text-slate-400'
                                }`}
                              >
                                {step.label}
                              </span>
                              <span className="text-[10px] text-slate-400 mt-0.5 leading-tight hidden sm:block">
                                {step.desc}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="absolute top-6 right-[12.5%] left-[12.5%] h-1 bg-slate-200 -z-0">
                      <div
                        className="h-full bg-emerald-500 transition-all duration-500"
                        style={{
                          width: `${
                            getStepIndex(selectedOrder.orderStatus) <= 0
                              ? 0
                              : (getStepIndex(selectedOrder.orderStatus) /
                                  (ORDER_PROGRESS_STEPS.length - 1)) *
                                100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* العميل والعنوان */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-slate-200 bg-white">
                  <h5 className="text-xs font-black text-slate-400 mb-3 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-[#D49B35]" />
                    <span>بيانات العميل والحساب</span>
                  </h5>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">الاسم:</span>
                      <span className="font-bold text-slate-800">
                        {getUserName(selectedOrder)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">رقم الهاتف:</span>
                      <span className="font-bold text-slate-800" dir="ltr">
                        {getUserPhone(selectedOrder)}
                      </span>
                    </div>
                    {selectedOrder.bookedBy?.name && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">حجزه:</span>
                        <span className="font-bold text-slate-800">
                          {selectedOrder.bookedBy.name}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">الدور:</span>
                      <span>{renderRoleBadge(getUserRole(selectedOrder))}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white">
                  <h5 className="text-xs font-black text-slate-400 mb-3 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#D49B35]" />
                    <span>عنوان الشحن</span>
                  </h5>
                  <div className="space-y-1.5 text-xs text-slate-700">
                    <p>
                      <strong>المحافظة:</strong> {selectedOrder.shippingAddress?.governorate || '—'}
                    </p>
                    <p>
                      <strong>المدينة / الحي:</strong> {selectedOrder.shippingAddress?.city || '—'}{' '}
                      {selectedOrder.shippingAddress?.area
                        ? `(${selectedOrder.shippingAddress.area})`
                        : ''}
                    </p>
                    <p>
                      <strong>الشارع بالتفصيل:</strong> {selectedOrder.shippingAddress?.street || '—'}
                    </p>
                    <p>
                      <strong>المبنى / الشقة:</strong>{' '}
                      {selectedOrder.shippingAddress?.building || '—'} /{' '}
                      {selectedOrder.shippingAddress?.apartment || '—'}
                    </p>
                    {selectedOrder.shippingAddress?.notes && (
                      <p className="text-amber-700 bg-amber-50 p-2 rounded-lg mt-2 text-[11px]">
                        <strong>ملاحظات المندوب:</strong> {selectedOrder.shippingAddress.notes}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* بيانات الشحن */}
              {selectedOrder.shipping?.method && (
                <div className="p-4 rounded-2xl border border-blue-200 bg-blue-50/50 text-xs text-slate-700">
                  <h5 className="text-xs font-black text-blue-700 mb-2 flex items-center gap-1.5">
                    <Truck className="w-4 h-4" />
                    <span>بيانات الشحن</span>
                  </h5>
                  {renderShippingInfo(selectedOrder)}
                </div>
              )}

              {/* المنتجات */}
              <div>
                <h5 className="text-sm font-black text-[#08101E] mb-3 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#D49B35]" />
                  <span>المنتجات المطلوبة ({selectedOrder.items?.length || 0})</span>
                </h5>
                <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((item, idx) => {
                      const title = item.title || 'منتج';
                      const img = item.image || '/placeholder.png';

                      return (
                        <div
                          key={idx}
                          className="p-3.5 flex items-center justify-between gap-3 bg-white"
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0">
                              <Image
                                src={img}
                                alt={title}
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-800 line-clamp-1">
                                {title}
                              </p>
                              <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                                <span>الكمية: {item.quantity || 1}</span>
                                {item.size && <span>• المقاس: {item.size}</span>}
                                {item.color && <span>• اللون: {item.color}</span>}
                              </div>
                            </div>
                          </div>
                          <div className="text-left">
                            <span className="text-xs font-black text-[#08101E]">
                              {((item.price || 0) * (item.quantity || 1)).toLocaleString('ar-EG')}{' '}
                              ج.م
                            </span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-4 text-center text-xs text-slate-400">
                      لا توجد تفاصيل للمنتجات في هذا الطلب
                    </div>
                  )}
                </div>
              </div>

              {/* ملخص الدفع */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block">طريقة الدفع:</span>
                  <span className="font-bold text-[#08101E] text-sm">
                    {selectedOrder.paymentMethod === 'CashOnDelivery'
                      ? 'الدفع عند الاستلام (COD)'
                      : 'الدفع الإلكتروني (بطاقة)'}
                  </span>
                  <span
                    className={`block mt-1 text-[11px] font-bold ${
                      selectedOrder.isPaid ? 'text-emerald-600' : 'text-amber-600'
                    }`}
                  >
                    {selectedOrder.isPaid ? 'تم الدفع' : 'لم يتم الدفع بعد'}
                  </span>
                </div>
                <div className="sm:text-left">
                  <span className="text-slate-500 block">المبلغ الإجمالي النهائي:</span>
                  <span className="text-xl font-black text-emerald-600">
                    {(selectedOrder.finalPrice || selectedOrder.totalPrice || 0).toLocaleString(
                      'ar-EG',
                    )}{' '}
                    ج.م
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-all cursor-pointer"
              >
                إغلاق النافذة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}