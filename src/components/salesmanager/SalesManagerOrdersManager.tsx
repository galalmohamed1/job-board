'use client';

import React, { useState, useMemo, useTransition, useEffect } from 'react';
import Link from 'next/link';
import {
  Package,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  User,
  RefreshCw,
  Eye,
  X,
  MapPin,
  Loader2,
  Copy,
  Check,
  Truck,
  Send,
  ChevronRight,
  ChevronLeft,
  Tag,
  Layers,
  ListTree,
  Ticket,
  ShieldCheck,
  Sparkles,
  Bike,
  BadgeCheck,
} from 'lucide-react';
import { AdminOrder, StatusHistoryItem } from '@/types/admin/adminOrders';
import { AdminCustomer } from '@/types/admin/adminCustomer';
import {
  getSalesManagerOrders,
  getSalesManagerOrderById,
  updateSalesManagerOrderState,
  addSalesManagerOrderNote,
  SalesManagerState,
} from '@/action/salesmanager.action';
// ⚠️ لو بترجع 403 للسيلز مانجر، اعمل action مخصوصة للمناديب (شوف الملاحظات)
import { getAllUsersAdmin } from '@/action/admin.action';
import { toast } from 'react-toastify';

type OrderStatus = AdminOrder['orderStatus'];

const STATUS_LABELS: Record<string, string> = {
  Pending: 'قيد الانتظار',
  Preparing: 'جاري التجهيز',
  Shipped: 'تم الشحن',
  Delivered: 'تم التوصيل',
  Cancelled: 'ملغي',
  Refused: 'مرفوض',
};

// نفس الانتقالات المسموحة في الباك (زي صفحة الأدمن)
const NEXT_STATUSES: Record<string, OrderStatus[]> = {
  Pending: ['Preparing', 'Cancelled'],
  Preparing: ['Shipped', 'Cancelled'],
  Shipped: ['Delivered', 'Refused'],
};

interface Props {
  initialOrders: AdminOrder[];
  initialTotal: number;
  initialPage: number;
  initialPages: number;
  initialStatus: string;
}

export default function SalesManagerOrdersManager({
  initialOrders,
  initialTotal,
  initialPage,
  initialPages,
  initialStatus,
}: Props) {
  // State
  const [orders, setOrders] = useState<AdminOrder[]>(initialOrders);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(initialPage);
  const [pages, setPages] = useState(initialPages);
  const [statusFilter, setStatusFilter] = useState<string>(initialStatus || 'all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // Shipping drafts (قبل التأكيد)
  const [shippingMethodMap, setShippingMethodMap] = useState<
    Record<string, 'Company' | 'Courier'>
  >({});
  const [companyNameMap, setCompanyNameMap] = useState<Record<string, string>>({});
  const [selectedCourierMap, setSelectedCourierMap] = useState<Record<string, string>>({});
  const [courierUsers, setCourierUsers] = useState<AdminCustomer[]>([]);

  // Note state
  const [newNoteText, setNewNoteText] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  // General loading & copy state
  const [isPending, startTransition] = useTransition();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // ── جلب المناديب ──
  useEffect(() => {
    getAllUsersAdmin()
      .then((users) => {
        if (Array.isArray(users)) {
          setCourierUsers(
            users.filter((u) => String(u.role || '').toLowerCase().trim() === 'courier'),
          );
        }
      })
      .catch(() => console.error('فشل جلب قائمة المناديب'));
  }, []);

  // ── Helper: Customer Info ──
  const getCustomerInfo = (order: AdminOrder) => {
    let name = 'عميل غير مسجل';
    let email = order.contactEmail || '';
    let phone = order.shippingAddress?.phoneNumber || '';

    if (typeof order.user === 'object' && order.user !== null) {
      name = order.user.name || order.user.fullName || name;
      email = order.user.email || email;
      phone = order.user.phoneNumber || order.user.phone || phone;
    } else if (typeof order.customer === 'object' && order.customer !== null) {
      name = order.customer.name || order.customer.fullName || name;
      email = order.customer.email || email;
    } else if (order.shippingAddress?.fullName) {
      name = order.shippingAddress.fullName;
    }

    return { name, email, phone };
  };

  // ── Helper: Copy to Clipboard ──
  const handleCopy = (text: string, id: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // ── Status Color & Label ──
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return { label: 'قيد الانتظار', classes: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'Preparing':
        return { label: 'جاري التجهيز', classes: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      case 'Shipped':
        return { label: 'تم الشحن', classes: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'Delivered':
        return { label: 'تم التوصيل', classes: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'Refused':
        return { label: 'مرفوض', classes: 'bg-rose-50 text-rose-700 border-rose-200' };
      case 'Cancelled':
        return { label: 'ملغي', classes: 'bg-red-50 text-red-700 border-red-200' };
      default:
        return { label: status, classes: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  // ── شارة بيانات الشحن ──
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

  // ── Fetch Orders on Filter or Page Change ──
  const loadOrders = (newStatus: string, newPage: number) => {
    startTransition(async () => {
      const res = await getSalesManagerOrders({
        status: newStatus === 'all' ? undefined : newStatus,
        page: newPage,
        limit: 10,
      });

      if (res.success && res.data) {
        setOrders(res.data.orders);
        setTotal(res.data.total);
        setPage(res.data.page);
        setPages(res.data.pages);
      } else {
        toast.error(res.message || 'فشل في تحديث قائمة الأوردرات');
      }
    });
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setPage(1);
    loadOrders(status, 1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pages) return;
    setPage(newPage);
    loadOrders(statusFilter, newPage);
  };

  // ── Frontend Search Filter ──
  const displayedOrders = useMemo(() => {
    if (!searchQuery.trim()) return orders;
    const q = searchQuery.toLowerCase().trim();
    return orders.filter((order) => {
      const orderNo = (order.orderNumber || order._id || '').toLowerCase();
      const { name, phone } = getCustomerInfo(order);
      return orderNo.includes(q) || name.toLowerCase().includes(q) || phone.includes(q);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders, searchQuery]);

  // ── Operational Stats ──
  const orderStats = useMemo(() => {
    const preparingCount = orders.filter((o) => o.orderStatus === 'Preparing').length;
    const shippedCount = orders.filter((o) => o.orderStatus === 'Shipped').length;
    const deliveredCount = orders.filter((o) => o.orderStatus === 'Delivered').length;
    const refusedOrCancelledCount = orders.filter(
      (o) => o.orderStatus === 'Refused' || o.orderStatus === 'Cancelled',
    ).length;
    const paidCount = orders.filter((o) => o.isPaid).length;

    return {
      totalOrders: total,
      preparingCount,
      shippedCount,
      deliveredCount,
      refusedOrCancelledCount,
      paidCount,
    };
  }, [orders, total]);

  // ── تحديث أوردر محلياً (الجدول + المودال) ──
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

  // ── تأكيد الدفع ──
  const handleMarkPaid = async (orderId: string) => {
    setUpdatingOrderId(orderId);
    try {
      const res = await updateSalesManagerOrderState(orderId, 'isPaid');
      if (res.success) {
        toast.success(res.message || 'تم تأكيد الدفع بنجاح');
        applyLocalUpdate(orderId, { isPaid: true, paidAt: new Date().toISOString() });
      } else {
        toast.error(res.message || 'فشل تأكيد الدفع');
      }
    } catch {
      toast.error('حدث خطأ أثناء الاتصال بالخادم');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // ── تغيير الحالة من القائمة ──
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
    setUpdatingOrderId(orderId);
    try {
      const res = await updateSalesManagerOrderState(orderId, newStatus as SalesManagerState);
      if (res.success) {
        toast.success(`تم تحديث حالة الطلب إلى "${STATUS_LABELS[newStatus]}" بنجاح`);
        applyLocalUpdate(orderId, { orderStatus: newStatus });
      } else {
        toast.error(res.message || 'فشل تحديث الحالة');
      }
    } catch {
      toast.error('حدث خطأ أثناء الاتصال بالخادم');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // ── تأكيد الشحن (شركة / مندوب) ──
  const handleShipConfirm = async (orderId: string, method: 'Company' | 'Courier') => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let shipping: any;

    if (method === 'Company') {
      const companyName = companyNameMap[orderId]?.trim();
      if (!companyName) {
        toast.warn('يرجى إدخال اسم شركة الشحن أولاً');
        return;
      }
      shipping = { method: 'Company', companyName };
    } else {
      const courierId = selectedCourierMap[orderId]?.trim();
      if (!courierId) {
        toast.warn('يرجى اختيار مندوب التوصيل أولاً');
        return;
      }
      const c = courierUsers.find((u) => u._id === courierId);
      shipping = {
        method: 'Courier',
        courierName: c?.fullName || c?.name || 'مندوب التوصيل',
        courierPhone: c?.phoneNumber || c?.phone,
      };
    }

    setUpdatingOrderId(orderId);
    try {
      const res = await updateSalesManagerOrderState(orderId, 'Shipped', { shipping });
      if (res.success) {
        toast.success('تم الشحن بنجاح');
        applyLocalUpdate(orderId, { orderStatus: 'Shipped', shipping });
        clearShippingDraft(orderId);
      } else {
        toast.error(res.message || 'فشل تحديث الحالة');
      }
    } catch {
      toast.error('حدث خطأ أثناء الاتصال بالخادم');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // ── Open Details Modal ──
  const handleOpenDetails = async (order: AdminOrder) => {
    setSelectedOrder(order);
    setLoadingDetails(true);
    try {
      const res = await getSalesManagerOrderById(order._id);
      if (res.success && res.data) {
        setSelectedOrder(res.data);
      }
    } catch (err) {
      console.error('Error fetching order details:', err);
    } finally {
      setLoadingDetails(false);
    }
  };

  // ── Handle Add Order Note ──
  const handleAddNote = async () => {
    if (!selectedOrder || !newNoteText.trim()) return;
    setIsAddingNote(true);
    try {
      const res = await addSalesManagerOrderNote(selectedOrder._id, newNoteText.trim());
      if (res.success) {
        toast.success(res.message || 'تمت إضافة الملاحظة بنجاح');
        const newNoteItem: StatusHistoryItem = {
          status: selectedOrder.orderStatus,
          note: newNoteText.trim(),
          changedAt: new Date().toISOString(),
          changedBy: 'مدير المبيعات',
        };

        setSelectedOrder((prev) =>
          prev
            ? {
                ...prev,
                statusHistory: [
                  ...(prev.statusHistory || []),
                  newNoteItem,
                ] as AdminOrder['statusHistory'],
              }
            : null,
        );

        setNewNoteText('');
      } else {
        toast.error(res.message || 'فشل في إضافة الملاحظة');
      }
    } catch {
      toast.error('حدث خطأ أثناء حفظ الملاحظة');
    } finally {
      setIsAddingNote(false);
    }
  };

  return (
    <div className="space-y-6 text-right font-sans" dir="rtl">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <span className="w-10 h-10 rounded-xl bg-linear-to-br from-[#0B2545] to-[#134074] text-[#F3C053] flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <span>لوحة تحكم مدير المبيعات</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            إدارة كافة الطلبات وتغيير الحالات، مع إمكانية إضافة المنتجات والأقسام والكوبونات
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadOrders(statusFilter, page)}
          disabled={isPending}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isPending ? 'animate-spin' : ''}`} />
          <span>تحديث القائمة</span>
        </button>
      </div>

      {/* ── Quick Action Management Links ── */}
      <div className="bg-linear-to-r from-[#0B2545] to-[#173a67] p-5 rounded-2xl text-white shadow-md">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#F3C053]" />
            <span className="text-sm font-black text-white">إجراءات الإضافة السريعة</span>
          </div>
          <span className="text-xs text-slate-300">متاحة لمدير المبيعات</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          <Link
            href="/dashboard-salesmanger/products"
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/10 hover:bg-[#F3C053] hover:text-[#0B2545] transition-all group border border-white/10 text-center"
          >
            <Package className="w-5 h-5 mb-1.5 text-[#F3C053] group-hover:text-[#0B2545] transition-colors" />
            <span className="text-xs font-bold">إضافة منتج</span>
            <span className="text-[10px] text-slate-300 group-hover:text-[#0B2545]/80 mt-0.5">
              (Product)
            </span>
          </Link>

          <Link
            href="/dashboard-salesmanger/categories"
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/10 hover:bg-[#F3C053] hover:text-[#0B2545] transition-all group border border-white/10 text-center"
          >
            <Tag className="w-5 h-5 mb-1.5 text-[#F3C053] group-hover:text-[#0B2545] transition-colors" />
            <span className="text-xs font-bold">إضافة قسم</span>
            <span className="text-[10px] text-slate-300 group-hover:text-[#0B2545]/80 mt-0.5">
              (Category)
            </span>
          </Link>

          <Link
            href="/dashboard-salesmanger/subcategories"
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/10 hover:bg-[#F3C053] hover:text-[#0B2545] transition-all group border border-white/10 text-center"
          >
            <Layers className="w-5 h-5 mb-1.5 text-[#F3C053] group-hover:text-[#0B2545] transition-colors" />
            <span className="text-xs font-bold">قسم فرعي</span>
            <span className="text-[10px] text-slate-300 group-hover:text-[#0B2545]/80 mt-0.5">
              (Subcategory)
            </span>
          </Link>

          <Link
            href="/dashboard-salesmanger/details-subcategory"
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/10 hover:bg-[#F3C053] hover:text-[#0B2545] transition-all group border border-white/10 text-center"
          >
            <ListTree className="w-5 h-5 mb-1.5 text-[#F3C053] group-hover:text-[#0B2545] transition-colors" />
            <span className="text-xs font-bold">تفاصيل الأقسام</span>
            <span className="text-[10px] text-slate-300 group-hover:text-[#0B2545]/80 mt-0.5">
              (DetailsSubCategory)
            </span>
          </Link>

          <Link
            href="/dashboard-salesmanger/coupons"
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/10 hover:bg-[#F3C053] hover:text-[#0B2545] transition-all group border border-white/10 text-center col-span-2 sm:col-span-1"
          >
            <Ticket className="w-5 h-5 mb-1.5 text-[#F3C053] group-hover:text-[#0B2545] transition-colors" />
            <span className="text-xs font-bold">كوبونات الخصم</span>
            <span className="text-[10px] text-slate-300 group-hover:text-[#0B2545]/80 mt-0.5">
              (Add Coupons)
            </span>
          </Link>
        </div>
      </div>

      {/* ── Operational Stats Grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 block">إجمالي الطلبات</span>
          <span className="text-xl font-black text-slate-900 block mt-1">
            {orderStats.totalOrders}
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-purple-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-purple-700 block">جاري التجهيز</span>
          <span className="text-xl font-black text-purple-800 block mt-1">
            {orderStats.preparingCount}
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-blue-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-blue-700 block">تم الشحن</span>
          <span className="text-xl font-black text-blue-800 block mt-1">
            {orderStats.shippedCount}
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-emerald-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-emerald-700 block">تم التوصيل</span>
          <span className="text-xl font-black text-emerald-800 block mt-1">
            {orderStats.deliveredCount}
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-rose-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-rose-700 block">مرفوض أو ملغي</span>
          <span className="text-xl font-black text-rose-800 block mt-1">
            {orderStats.refusedOrCancelledCount}
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-amber-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-amber-700 block">الطلبات المدفوعة</span>
          <span className="text-xl font-black text-amber-800 block mt-1">
            {orderStats.paidCount}
          </span>
        </div>
      </div>

      {/* ── Search & Filter Bar ── */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث برقم الأوردر أو اسم العميل أو رقم الهاتف..."
              className="w-full pr-9 pl-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D49B35] focus:bg-white transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilterChange(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#D49B35] cursor-pointer"
            >
              <option value="all">كل الحالات (الكل)</option>
              {Object.entries(STATUS_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label} ({key})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>
            عرض <strong className="text-slate-900">{displayedOrders.length}</strong> من إجمالي{' '}
            <strong className="text-slate-900">{total}</strong> أوردر
          </span>
          {(searchQuery || statusFilter !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                loadOrders('all', 1);
              }}
              className="text-[#D49B35] hover:underline font-bold cursor-pointer"
            >
              إلغاء التصفية والبحث
            </button>
          )}
        </div>
      </div>

      {/* ── Orders Table ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {isPending ? (
          <div className="py-20 px-4 text-center">
            <Loader2 className="w-8 h-8 text-[#D49B35] animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-500 font-bold">جاري تحميل الأوردرات...</p>
          </div>
        ) : displayedOrders.length === 0 ? (
          <div className="py-16 px-4 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Package className="w-8 h-8 stroke-1" />
            </div>
            <h3 className="text-base font-bold text-slate-800">لا توجد طلبات</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              لا توجد طلبات تطابق معايير البحث أو التصفية المختارة.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold">
                  <th className="py-3.5 px-4">رقم الأوردر</th>
                  <th className="py-3.5 px-4">العميل</th>
                  <th className="py-3.5 px-4">التاريخ</th>
                  <th className="py-3.5 px-4">الإجمالي</th>
                  <th className="py-3.5 px-4">حالة الطلب</th>
                  <th className="py-3.5 px-4 text-center">حالة الدفع</th>
                  <th className="py-3.5 px-4 text-center">التفاصيل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayedOrders.map((order) => {
                  const { name, phone, email } = getCustomerInfo(order);
                  const shortId = order.orderNumber || order._id.slice(-6);
                  const amount = order.finalPrice ?? order.totalPrice ?? 0;
                  const statusBadge = getStatusBadge(order.orderStatus);
                  const isUpdatingThis = updatingOrderId === order._id;

                  const pendingMethod = shippingMethodMap[order._id];
                  const nextStatuses = NEXT_STATUSES[order.orderStatus] ?? [];
                  const canPay =
                    !order.isPaid &&
                    order.orderStatus !== 'Cancelled' &&
                    order.orderStatus !== 'Refused';
                  const isFinal = nextStatuses.length === 0 && !canPay;

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
                            className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                            title="نسخ رقم الطلب"
                          >
                            {copiedId === order._id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 group-hover:text-[#D49B35] transition-colors leading-snug">
                          {name}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono" dir="ltr">
                          {phone || email || '—'}
                        </div>
                      </td>

                      {/* Created At */}
                      <td className="py-3.5 px-4">
                        <span className="text-slate-700 block">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString('ar-EG')
                            : '—'}
                        </span>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleTimeString('ar-EG', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : ''}
                        </span>
                      </td>

                      {/* Final Price */}
                      <td className="py-3.5 px-4">
                        <div className="font-black text-slate-900 text-sm">
                          {amount.toLocaleString('en-US')}{' '}
                          <span className="text-xs font-normal text-slate-500">ج.م</span>
                        </div>
                      </td>

                      {/* ── الحالة (زي صفحة الأدمن) ── */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2">
                            <select
                              disabled={isUpdatingThis || isFinal}
                              value={
                                pendingMethod ? `Shipped:${pendingMethod}` : order.orderStatus
                              }
                              onChange={(e) => handleStatusChange(order, e.target.value)}
                              className={`px-2.5 py-1 rounded-xl text-xs font-bold border outline-none cursor-pointer transition-all disabled:cursor-default ${statusBadge.classes}`}
                            >
                              {/* الحالة الحالية (ثابتة) */}
                              <option value={order.orderStatus}>
                                {STATUS_LABELS[order.orderStatus] ?? order.orderStatus}
                              </option>

                              {/* الحالات المسموحة */}
                              {nextStatuses.map((s) =>
                                s === 'Shipped' ? (
                                  <React.Fragment key="shipped-options">
                                    <option value="Shipped:Company">
                                      تم الشحن - شركة شحن 🏢
                                    </option>
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
                            {isUpdatingThis && (
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
                                type="button"
                                disabled={isUpdatingThis || !companyNameMap[order._id]?.trim()}
                                onClick={() => handleShipConfirm(order._id, 'Company')}
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
                                    const cName = c.fullName || c.name || c.email || 'مندوب';
                                    const cPhone = c.phoneNumber || c.phone;
                                    return (
                                      <option key={c._id} value={c._id}>
                                        🛵 {cName} {cPhone ? `(${cPhone})` : ''}
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
                                type="button"
                                disabled={isUpdatingThis || !selectedCourierMap[order._id]}
                                onClick={() => handleShipConfirm(order._id, 'Courier')}
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

                      {/* Current Payment Status */}
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

                      {/* View Details Action */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleOpenDetails(order)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
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

        {/* ── Pagination ── */}
        {pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-slate-50/50">
            <span className="text-xs text-slate-500">
              الصفحة <strong className="text-slate-800">{page}</strong> من{' '}
              <strong className="text-slate-800">{pages}</strong>
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1 || isPending}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                title="الصفحة السابقة"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= pages || isPending}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                title="الصفحة التالية"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Order Details Modal ── */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden text-right border border-slate-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-[#0B2545] text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#F3C053] to-[#D49B35] flex items-center justify-center text-[#0B2545] font-black shadow-md">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-white flex items-center gap-2">
                    <span>طلب #{selectedOrder.orderNumber || selectedOrder._id.slice(-6)}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                        getStatusBadge(selectedOrder.orderStatus).classes
                      }`}
                    >
                      {getStatusBadge(selectedOrder.orderStatus).label}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300 font-mono" dir="ltr">
                    {selectedOrder.createdAt
                      ? new Date(selectedOrder.createdAt).toLocaleString('ar-EG')
                      : ''}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {loadingDetails ? (
                <div className="py-12 text-center">
                  <Loader2 className="w-7 h-7 text-[#D49B35] animate-spin mx-auto mb-2" />
                  <p className="text-xs text-slate-500">جاري تحميل بيانات الأوردر التفصيلية...</p>
                </div>
              ) : (
                <>
                  {/* Customer & Shipping Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      <h4 className="text-xs font-black text-slate-700 flex items-center gap-1.5 mb-2">
                        <User className="w-3.5 h-3.5 text-[#D49B35]" />
                        <span>بيانات العميل</span>
                      </h4>
                      {(() => {
                        const c = getCustomerInfo(selectedOrder);
                        return (
                          <div className="space-y-1 text-xs">
                            <p className="font-bold text-slate-900">{c.name}</p>
                            <p className="text-slate-600 font-mono" dir="ltr">
                              {c.phone || 'بدون هاتف'}
                            </p>
                            <p className="text-slate-500 text-[11px] truncate">{c.email}</p>
                          </div>
                        );
                      })()}
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      <h4 className="text-xs font-black text-slate-700 flex items-center gap-1.5 mb-2">
                        <MapPin className="w-3.5 h-3.5 text-[#D49B35]" />
                        <span>عنوان الشحن والتوصيل</span>
                      </h4>
                      {selectedOrder.shippingAddress ? (
                        <div className="space-y-0.5 text-xs text-slate-700">
                          <p className="font-bold">
                            {selectedOrder.shippingAddress.governorate} -{' '}
                            {selectedOrder.shippingAddress.city}
                          </p>
                          <p className="text-slate-500 text-[11px]">
                            {selectedOrder.shippingAddress.street}
                            {selectedOrder.shippingAddress.building &&
                              `، عمارة ${selectedOrder.shippingAddress.building}`}
                            {selectedOrder.shippingAddress.apartment &&
                              `، شقة ${selectedOrder.shippingAddress.apartment}`}
                          </p>
                          {selectedOrder.shippingAddress.notes && (
                            <p className="text-[10px] text-amber-600 mt-1 italic">
                              ملاحظات العنوان: {selectedOrder.shippingAddress.notes}
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400">لا يوجد عنوان شحن مسجل</p>
                      )}
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

                  {/* Order Items */}
                  <div>
                    <h4 className="text-xs font-black text-slate-800 mb-3 flex items-center gap-1.5">
                      <Package className="w-4 h-4 text-[#D49B35]" />
                      <span>المنتجات المطلوبة ({selectedOrder.items?.length || 0})</span>
                    </h4>
                    <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                      {selectedOrder.items?.map((item, idx) => {
                        const title =
                          item.title ||
                          (typeof item.product === 'object' && item.product?.title) ||
                          'منتج';
                        return (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3 bg-white hover:bg-slate-50 text-xs"
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-[11px]">
                                {idx + 1}
                              </span>
                              <div>
                                <p className="font-bold text-slate-900">{title}</p>
                                <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                                  {item.size && <span>المقاس: {item.size}</span>}
                                  {item.color && <span>اللون: {item.color}</span>}
                                  <span>الكمية: {item.quantity || 1}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-left font-black text-slate-900">
                              {((item.price || 0) * (item.quantity || 1)).toLocaleString('en-US')}{' '}
                              ج.م
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-500 block">طريقة الدفع:</span>
                      <span className="font-bold text-slate-800">
                        {selectedOrder.paymentMethod === 'CashOnDelivery'
                          ? 'الدفع عند الاستلام (COD)'
                          : selectedOrder.paymentMethod || 'الدفع عند الاستلام'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">حالة الدفع:</span>
                      <span
                        className={`font-black ${
                          selectedOrder.isPaid ? 'text-emerald-700' : 'text-amber-700'
                        }`}
                      >
                        {selectedOrder.isPaid ? '✓ تم الدفع' : 'قيد الانتظار'}
                      </span>
                    </div>
                    <div className="text-left">
                      <span className="text-slate-500 block">المبلغ الإجمالي:</span>
                      <span className="text-base font-black text-slate-900">
                        {(selectedOrder.finalPrice ?? selectedOrder.totalPrice ?? 0).toLocaleString(
                          'en-US',
                        )}{' '}
                        ج.م
                      </span>
                    </div>
                  </div>

                  {/* Status History & Notes Timeline */}
                  <div>
                    <h4 className="text-xs font-black text-slate-800 mb-2 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#D49B35]" />
                      <span>سجل الحالات والملاحظات</span>
                    </h4>
                    <div className="space-y-2 bg-slate-50 p-3 rounded-2xl border border-slate-200 max-h-48 overflow-y-auto">
                      {selectedOrder.statusHistory && selectedOrder.statusHistory.length > 0 ? (
                        selectedOrder.statusHistory.map((item, idx) => (
                          <div
                            key={idx}
                            className="bg-white p-2.5 rounded-xl border border-slate-200/70 text-xs shadow-2xs"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-black text-slate-800">
                                {STATUS_LABELS[item.status] ?? item.status}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {item.changedAt
                                  ? new Date(item.changedAt).toLocaleString('ar-EG')
                                  : ''}
                              </span>
                            </div>
                            {item.note && <p className="text-slate-600 text-[11px]">{item.note}</p>}
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-400 text-center py-2">
                          لا يوجد سجل حالات مسجل
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Add Note Input */}
                  <div className="pt-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      إضافة ملاحظة جديدة للطلب:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newNoteText}
                        onChange={(e) => setNewNoteText(e.target.value)}
                        placeholder="اكتب ملاحظة تخص هذا الأوردر..."
                        className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:outline-none focus:ring-2 focus:ring-[#D49B35] focus:bg-white transition-all"
                      />
                      <button
                        type="button"
                        onClick={handleAddNote}
                        disabled={isAddingNote || !newNoteText.trim()}
                        className="px-4 py-2 rounded-xl bg-[#0B2545] hover:bg-[#134074] text-white text-xs font-bold transition-colors disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                      >
                        {isAddingNote ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Send className="w-3.5 h-3.5" />
                        )}
                        <span>إرسال</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
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