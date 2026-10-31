'use client';

import React, { useState, useMemo, useTransition } from 'react';
import Image from 'next/image';
import {
  Warehouse,
  Package,
  PackageCheck,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  RefreshCw,
  Eye,
  X,
  MapPin,
  Phone,
  User,
  CreditCard,
  Banknote,
  FileText,
  Send,
  Loader2,
  AlertCircle,
  Copy,
  Check,
  Bike,
  Building2,
  AlertTriangle,
  Calendar,
  ChevronDown,
} from 'lucide-react';
import { AdminOrder, StatusHistoryItem } from '@/types/admin/adminOrders';
import {
  getWarehouseOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  addOrderNote,
} from '@/action/order.action';
import { toast } from 'react-toastify';

interface Props {
  initialOrders: AdminOrder[];
  initialTotal: number;
  initialPage: number;
  initialPages: number;
  initialStatus: string;
}

// مراحل خط سير الطلب
const ORDER_PROGRESS_STEPS = [
  { key: 'Pending', label: 'قيد الانتظار', icon: Clock, desc: 'في انتظار بدء التجهيز' },
  { key: 'Preparing', label: 'جاري التجهيز', icon: PackageCheck, desc: 'تجهيز الطلب في المستودع' },
  { key: 'Shipped', label: 'تم الشحن', icon: Truck, desc: 'تم التسليم للشحن / المندوب' },
  { key: 'Delivered', label: 'تم التوصيل', icon: CheckCircle2, desc: 'تم تسليم الطلب للعميل' },
];

export default function WarehouseOrdersManager({
  initialOrders,
  initialTotal,
  initialPage,
  initialPages,
  initialStatus,
}: Props) {
  // الحالة العامة للطلبات
  const [orders, setOrders] = useState<AdminOrder[]>(initialOrders);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(initialPage);
  const [pages, setPages] = useState(initialPages);
  const [statusFilter, setStatusFilter] = useState<string>(initialStatus || 'ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // مودال تفاصيل الطلب
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // مودال الشحن (Preparing -> Shipped)
  const [shippingModalOrder, setShippingModalOrder] = useState<AdminOrder | null>(null);
  const [shippingMethod, setShippingMethod] = useState<'Company' | 'Courier'>('Company');
  const [companyName, setCompanyName] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [courierName, setCourierName] = useState('');
  const [courierPhone, setCourierPhone] = useState('');
  const [submittingShip, setSubmittingShip] = useState(false);

  // مودال الإلغاء (Pending/Preparing -> Cancelled)
  const [cancellingOrder, setCancellingOrder] = useState<AdminOrder | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [submittingCancel, setSubmittingCancel] = useState(false);

  // مودال / حقل الملاحظة المستقلة (POST /orders/:id/notes)
  const [noteModalOrder, setNoteModalOrder] = useState<AdminOrder | null>(null);
  const [noteText, setNoteText] = useState('');
  const [submittingNote, setSubmittingNote] = useState(false);

  // نسخ المعرف
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // نسخ المعرف للحافظة
  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // جلب الطلبات من السيرفر
  const fetchOrders = async (targetStatus = statusFilter, targetPage = page) => {
    setLoading(true);
    try {
      const res = await getWarehouseOrders({
        status: targetStatus === 'ALL' ? undefined : targetStatus,
        page: targetPage,
        limit: 50,
      });
      if (res.success && res.data) {
        setOrders(res.data.orders);
        setTotal(res.data.total);
        setPage(res.data.page);
        setPages(res.data.pages);
      } else {
        toast.error(res.message || 'فشل تحميل طلبات المستودع');
      }
    } catch {
      toast.error('حدث خطأ أثناء الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  // فتح تفاصيل الطلب الكاملة
  const handleOpenDetails = async (order: AdminOrder) => {
    setSelectedOrder(order);
    setLoadingDetails(true);
    try {
      const res = await getOrderById(order._id);
      if (res.success && res.data) {
        setSelectedOrder(res.data as AdminOrder);
      }
    } catch {
      // الاستمرار في عرض البيانات المتاحة مسبقاً
    } finally {
      setLoadingDetails(false);
    }
  };

  // 1. التجهيز: نقل الطلب من Pending إلى Preparing
  const handleStartPreparing = async (order: AdminOrder) => {
    if (order.orderStatus !== 'Pending') {
      toast.warn('يمكن بدء التجهيز فقط للطلبات التي في حالة "قيد الانتظار"');
      return;
    }
    setActionLoadingId(order._id);
    try {
      const res = await updateOrderStatus(order._id, 'Preparing');
      if (res.success) {
        toast.success(`تم بدء تجهيز الطلب #${order.orderNumber || order._id.slice(-6)} بالمستودع 📦`);
        setOrders((prev) =>
          prev.map((o) => (o._id === order._id ? { ...o, orderStatus: 'Preparing' } : o))
        );
        if (selectedOrder?._id === order._id) {
          setSelectedOrder((prev) => (prev ? { ...prev, orderStatus: 'Preparing' } : null));
        }
      } else {
        toast.error(res.message || 'فشل تحديث حالة الطلب إلى جاري التجهيز');
      }
    } catch {
      toast.error('حدث خطأ أثناء الاتصال بالخادم');
    } finally {
      setActionLoadingId(null);
    }
  };

  // 2. الشحن: فتح مودال الشحن
  const openShippingModal = (order: AdminOrder) => {
    if (order.orderStatus !== 'Preparing') {
      toast.warn('يمكن تحويل الطلب للشحن فقط بعد أن يكون في حالة "جاري التجهيز"');
      return;
    }
    setShippingModalOrder(order);
    setShippingMethod('Company');
    setCompanyName('');
    setTrackingNumber('');
    setCourierName('');
    setCourierPhone('');
  };

  // تأكيد إرسال الشحن (Preparing -> Shipped)
  const handleConfirmShipping = async () => {
    if (!shippingModalOrder) return;

    if (shippingMethod === 'Company') {
      if (!companyName.trim()) {
        toast.warn('يرجى كتابة اسم شركة الشحن (إجباري)');
        return;
      }
    } else {
      if (!courierName.trim()) {
        toast.warn('يرجى كتابة اسم المندوب (إجباري)');
        return;
      }
    }

    setSubmittingShip(true);
    try {
      const shippingInfo =
        shippingMethod === 'Company'
          ? {
              method: 'Company' as const,
              companyName: companyName.trim(),
              ...(trackingNumber.trim() ? { trackingNumber: trackingNumber.trim() } : {}),
            }
          : {
              method: 'Courier' as const,
              courierName: courierName.trim(),
              ...(courierPhone.trim() ? { courierPhone: courierPhone.trim() } : {}),
            };

      const res = await updateOrderStatus(shippingModalOrder._id, 'Shipped', {
        shipping: shippingInfo,
      });

      if (res.success) {
        const dest =
          shippingMethod === 'Company'
            ? `شركة "${companyName.trim()}"`
            : `المندوب "${courierName.trim()}"`;
        toast.success(`تم تسليم الطلب بنجاح إلى ${dest} 🚚`);

        setOrders((prev) =>
          prev.map((o) =>
            o._id === shippingModalOrder._id
              ? {
                  ...o,
                  orderStatus: 'Shipped',
                  shipping: {
                    method: shippingMethod,
                    companyName: shippingMethod === 'Company' ? companyName.trim() : undefined,
                    trackingNumber:
                      shippingMethod === 'Company' && trackingNumber.trim()
                        ? trackingNumber.trim()
                        : undefined,
                    courierName: shippingMethod === 'Courier' ? courierName.trim() : undefined,
                    courierPhone:
                      shippingMethod === 'Courier' && courierPhone.trim()
                        ? courierPhone.trim()
                        : undefined,
                  },
                }
              : o
          )
        );

        if (selectedOrder?._id === shippingModalOrder._id) {
          setSelectedOrder((prev) =>
            prev
              ? {
                  ...prev,
                  orderStatus: 'Shipped',
                }
              : null
          );
        }

        setShippingModalOrder(null);
      } else {
        toast.error(res.message || 'فشل تحديث حالة الطلب إلى تم الشحن');
      }
    } catch {
      toast.error('حدث خطأ أثناء الاتصال بالخادم');
    } finally {
      setSubmittingShip(false);
    }
  };

  // 3. الإلغاء: فتح مودال الإلغاء (Pending أو Preparing فقط)
  const openCancelModal = (order: AdminOrder) => {
    if (order.orderStatus !== 'Pending' && order.orderStatus !== 'Preparing') {
      toast.warn('لا يمكن إلغاء الطلب بعد مرحلة الشحن من قبل أمين المستودع');
      return;
    }
    setCancellingOrder(order);
    setCancelReason('');
  };

  // تأكيد الإلغاء مع استرجاع المخزون تلقائياً
  const handleConfirmCancel = async () => {
    if (!cancellingOrder) return;

    setSubmittingCancel(true);
    try {
      const res = await cancelOrder(cancellingOrder._id, cancelReason);
      if (res.success) {
        toast.success('تم إلغاء الطلب بنجاح واسترجاع كميات المخزون تلقائياً ♻️');
        setOrders((prev) =>
          prev.map((o) => (o._id === cancellingOrder._id ? { ...o, orderStatus: 'Cancelled' } : o))
        );
        if (selectedOrder?._id === cancellingOrder._id) {
          setSelectedOrder((prev) => (prev ? { ...prev, orderStatus: 'Cancelled' } : null));
        }
        setCancellingOrder(null);
      } else {
        toast.error(res.message || 'فشل إلغاء الطلب');
      }
    } catch {
      toast.error('حدث خطأ أثناء الاتصال بالخادم');
    } finally {
      setSubmittingCancel(false);
    }
  };

  // 4. إضافة ملاحظة بدون تغيير الحالة (POST /orders/:id/notes)
  const handleAddNoteSubmit = async () => {
    const targetOrder = noteModalOrder || selectedOrder;
    if (!targetOrder) return;
    if (!noteText.trim()) {
      toast.warn('يرجى كتابة نص الملاحظة');
      return;
    }

    setSubmittingNote(true);
    try {
      const res = await addOrderNote(targetOrder._id, noteText.trim());
      if (res.success) {
        toast.success('تمت إضافة الملاحظة على الطلب بنجاح 📝');
        setNoteText('');
        setNoteModalOrder(null);
        // تحديث الطلب المفتوح
        if (selectedOrder?._id === targetOrder._id) {
          const refreshed = await getOrderById(targetOrder._id);
          if (refreshed.success && refreshed.data) {
            setSelectedOrder(refreshed.data as AdminOrder);
          }
        }
      } else {
        toast.error(res.message || 'فشل إضافة الملاحظة');
      }
    } catch {
      toast.error('حدث خطأ أثناء الاتصال بالخادم');
    } finally {
      setSubmittingNote(false);
    }
  };

  // تصفية الطلبات المعروضة محلياً بالبحث
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const q = searchQuery.toLowerCase().trim();
      const orderNum = (order.orderNumber || order._id).toLowerCase();
      const custName = (
        order.shippingAddress?.fullName ||
        (typeof order.user === 'object' && order.user?.name) ||
        ''
      ).toLowerCase();
      const phone = (
        order.shippingAddress?.phoneNumber ||
        (typeof order.user === 'object' && order.user?.phoneNumber) ||
        ''
      ).toLowerCase();
      const city = (order.shippingAddress?.city || '').toLowerCase();
      const gov = (order.shippingAddress?.governorate || '').toLowerCase();

      const matchQuery =
        !q ||
        orderNum.includes(q) ||
        custName.includes(q) ||
        phone.includes(q) ||
        city.includes(q) ||
        gov.includes(q);

      const matchStatus =
        statusFilter === 'ALL' || order.orderStatus === statusFilter;

      return matchQuery && matchStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  // إحصائيات سريعة للمستودع
  const stats = useMemo(() => {
    return {
      total: orders.length,
      pending: orders.filter((o) => o.orderStatus === 'Pending').length,
      preparing: orders.filter((o) => o.orderStatus === 'Preparing').length,
      shipped: orders.filter((o) => o.orderStatus === 'Shipped').length,
      cancelled: orders.filter((o) => o.orderStatus === 'Cancelled').length,
    };
  }, [orders]);

  // مؤشر خط السير
  const getStepIndex = (status: string) => {
    switch (status) {
      case 'Pending':
        return 0;
      case 'Preparing':
      case 'Processing':
        return 1;
      case 'Shipped':
        return 2;
      case 'Delivered':
        return 3;
      default:
        return -1;
    }
  };

  // شارة الحالة مع الألوان
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            قيد الانتظار (Pending)
          </span>
        );
      case 'Preparing':
      case 'Processing':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-indigo-50 text-indigo-700 border border-indigo-200">
            <PackageCheck className="w-3.5 h-3.5" />
            جاري التجهيز (Preparing)
          </span>
        );
      case 'Shipped':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-blue-50 text-blue-700 border border-blue-200">
            <Truck className="w-3.5 h-3.5" />
            تم الشحن (Shipped)
          </span>
        );
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            تم التوصيل (Delivered)
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5" />
            ملغي (Cancelled)
          </span>
        );
      case 'Refused':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-slate-100 text-slate-700 border border-slate-300">
            <XCircle className="w-3.5 h-3.5" />
            مرفوض (Refused)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 font-['Cairo'] text-right pb-16" dir="rtl">
      {/* ── رأس لوحة أمين المستودع ── */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#08101E] text-[#D49B35] flex items-center justify-center shadow-xs">
            <Warehouse className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#08101E]">
                لوحة أمين المستودع (Warehouse)
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-indigo-50 text-indigo-700 border border-indigo-200">
                إدارة وتجهيز الشحنات
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              متابعة الأوردرات، تجهيز الشحنات بالمستودع، التسليم لشركات الشحن والمندوبين، وإدارة الملاحظات.
            </p>
          </div>
        </div>

        <button
          onClick={() => fetchOrders()}
          disabled={loading}
          className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-[#D49B35] hover:text-[#D49B35] bg-white text-xs font-bold text-slate-700 transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#D49B35]' : ''}`} />
          <span>تحديث الطلبات</span>
        </button>
      </div>

      {/* ── بطاقات الإحصائيات السريعة لأمين المستودع ── */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* في انتظار التجهيز */}
        <div
          onClick={() => {
            setStatusFilter('Pending');
            fetchOrders('Pending');
          }}
          className={`p-4 rounded-2xl border transition-all cursor-pointer text-right ${
            statusFilter === 'Pending'
              ? 'bg-amber-500/10 border-amber-300 ring-2 ring-amber-400'
              : 'bg-white border-slate-200 hover:border-amber-300 hover:bg-amber-50/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700">في انتظار التجهيز</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-800 mt-2">{stats.pending}</div>
          <p className="text-[10px] text-amber-600 mt-0.5">طلبات بحاجة للبدء في تجهيزها</p>
        </div>

        {/* جاري التجهيز بالمستودع */}
        <div
          onClick={() => {
            setStatusFilter('Preparing');
            fetchOrders('Preparing');
          }}
          className={`p-4 rounded-2xl border transition-all cursor-pointer text-right ${
            statusFilter === 'Preparing'
              ? 'bg-indigo-500/10 border-indigo-300 ring-2 ring-indigo-400'
              : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-700">جاري تجهيزها</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <PackageCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-indigo-800 mt-2">{stats.preparing}</div>
          <p className="text-[10px] text-indigo-600 mt-0.5">جاهزة للتسليم للشحن / المندوب</p>
        </div>

        {/* تم الشحن */}
        <div
          onClick={() => {
            setStatusFilter('Shipped');
            fetchOrders('Shipped');
          }}
          className={`p-4 rounded-2xl border transition-all cursor-pointer text-right ${
            statusFilter === 'Shipped'
              ? 'bg-blue-500/10 border-blue-300 ring-2 ring-blue-400'
              : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-blue-50/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-700">تم شحنها</span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-blue-800 mt-2">{stats.shipped}</div>
          <p className="text-[10px] text-blue-600 mt-0.5">خرجت من المستودع مع شركة/مندوب</p>
        </div>

        {/* ملغية */}
        <div
          onClick={() => {
            setStatusFilter('Cancelled');
            fetchOrders('Cancelled');
          }}
          className={`p-4 rounded-2xl border transition-all cursor-pointer text-right ${
            statusFilter === 'Cancelled'
              ? 'bg-rose-500/10 border-rose-300 ring-2 ring-rose-400'
              : 'bg-white border-slate-200 hover:border-rose-300 hover:bg-rose-50/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-700">طلبات ملغية</span>
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-800 mt-2">{stats.cancelled}</div>
          <p className="text-[10px] text-rose-600 mt-0.5">تم استرجاع كمياتها للمستودع</p>
        </div>

        {/* إجمالي الطلبات */}
        <div
          onClick={() => {
            setStatusFilter('ALL');
            fetchOrders('ALL');
          }}
          className={`p-4 rounded-2xl border transition-all cursor-pointer text-right col-span-2 sm:col-span-2 lg:col-span-1 ${
            statusFilter === 'ALL'
              ? 'bg-slate-900 text-white border-slate-900'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold ${statusFilter === 'ALL' ? 'text-slate-200' : 'text-slate-600'}`}>
              جميع الطلبات
            </span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${statusFilter === 'ALL' ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-700'}`}>
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl font-black mt-2 ${statusFilter === 'ALL' ? 'text-white' : 'text-[#08101E]'}`}>
            {stats.total}
          </div>
          <p className={`text-[10px] mt-0.5 ${statusFilter === 'ALL' ? 'text-slate-300' : 'text-slate-400'}`}>
            عرض كل الحالات
          </p>
        </div>
      </div>

      {/* ── شريط البحث والفلترة ── */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* حقل البحث */}
          <div className="md:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="البحث برقم الطلب، اسم العميل، الهاتف، أو المدينة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pr-10 pl-4 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D49B35] transition-all"
            />
          </div>

          {/* فلتر الحالة */}
          <div className="md:col-span-4">
            <select
              value={statusFilter}
              onChange={(e) => {
                const val = e.target.value;
                setStatusFilter(val);
                fetchOrders(val);
              }}
              className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D49B35] transition-all cursor-pointer font-bold"
            >
              <option value="ALL">جميع الحالات ({stats.total})</option>
              <option value="Pending">قيد الانتظار ({stats.pending})</option>
              <option value="Preparing">جاري التجهيز ({stats.preparing})</option>
              <option value="Shipped">تم الشحن ({stats.shipped})</option>
              <option value="Delivered">تم التوصيل</option>
              <option value="Cancelled">ملغي ({stats.cancelled})</option>
              <option value="Refused">مرفوض</option>
            </select>
          </div>
        </div>

        {/* تنبيه صلاحيات أمين المستودع المحددة */}
        <div className="flex items-center gap-2 p-3 bg-amber-50/60 border border-amber-200/60 rounded-xl text-xs text-amber-900">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>
            <strong>صلاحيات المستودع:</strong> يمكنك نقل الطلب إلى <strong>جاري التجهيز</strong> ثم إلى <strong>تم الشحن</strong> (مع إدخال شركة الشحن أو المندوب)، أو <strong>إلغاء الطلب</strong> مع استرجاع المخزون تلقائياً وإضافة ملاحظات.
          </span>
        </div>
      </div>

      {/* ── جدول الطلبات ── */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-[#D49B35]" />
            <span className="text-sm font-bold">جاري تحميل طلبات المستودع...</span>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-base font-bold text-slate-700">لا توجد طلبات تطابق معايير البحث والفلترة</p>
            <p className="text-xs text-slate-400 mt-1">جرّب اختيار حالة أخرى أو تغيير نص البحث</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 text-xs font-bold">
                  <th className="py-4 px-4">رقم الطلب والتاريخ</th>
                  <th className="py-4 px-4">العميل ومكان التسليم</th>
                  <th className="py-4 px-4">المنتجات بالمستودع</th>
                  <th className="py-4 px-4">الإجمالي وطريقة الدفع</th>
                  <th className="py-4 px-4">الحالة الحالية</th>
                  <th className="py-4 px-4 text-center">إجراءات المستودع المصرحة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {filteredOrders.map((order) => {
                  const isCurrentActionLoading = actionLoadingId === order._id;
                  const orderNum = order.orderNumber || order._id.slice(-6).toUpperCase();
                  const customerName =
                    order.shippingAddress?.fullName ||
                    (typeof order.user === 'object' && order.user?.name) ||
                    'عميل';
                  const phone =
                    order.shippingAddress?.phoneNumber ||
                    (typeof order.user === 'object' && order.user?.phoneNumber) ||
                    '—';
                  const city = order.shippingAddress?.city || '';
                  const gov = order.shippingAddress?.governorate || '';

                  return (
                    <tr key={order._id} className="hover:bg-slate-50/60 transition-colors group">
                      {/* رقم الطلب */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-[#08101E]">#{orderNum}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(order._id, orderNum)}
                            className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
                            title="نسخ رقم الطلب"
                          >
                            {copiedId === order._id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {order.createdAt
                              ? new Date(order.createdAt).toLocaleDateString('ar-EG', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })
                              : '—'}
                          </span>
                        </div>
                      </td>

                      {/* العميل والعنوان */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-800">{customerName}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5" dir="ltr">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{phone}</span>
                        </div>
                        {(gov || city) && (
                          <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-[#D49B35]" />
                            <span>
                              {[gov, city].filter(Boolean).join(' - ')}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* المنتجات المطلوبة */}
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700">
                            <Package className="w-3 h-3 text-slate-500" />
                            <span>{order.items?.length || 0} صنف</span>
                          </span>
                          {order.items && order.items.length > 0 && (
                            <p className="text-xs text-slate-600 line-clamp-1 max-w-[200px]" title={order.items.map((it) => it.title).join('، ')}>
                              {order.items[0]?.title}
                              {order.items.length > 1 && ` (+${order.items.length - 1} آخرين)`}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* الإجمالي والدفع */}
                      <td className="py-4 px-4">
                        <div className="font-black text-[#08101E]">
                          {(order.finalPrice || order.totalPrice || 0).toLocaleString('ar-EG')} ج.م
                        </div>
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 mt-0.5">
                          {order.paymentMethod === 'CashOnDelivery' ? (
                            <>
                              <Banknote className="w-3 h-3 text-amber-600" />
                              <span>دفع عند الاستلام</span>
                            </>
                          ) : (
                            <>
                              <CreditCard className="w-3 h-3 text-emerald-600" />
                              <span>بطاقة بنكية</span>
                            </>
                          )}
                        </span>
                      </td>

                      {/* الحالة الحالية */}
                      <td className="py-4 px-4">
                        {renderStatusBadge(order.orderStatus)}
                        {/* تفاصيل الشحن إن وجدت */}
                        {order.orderStatus === 'Shipped' && order.shipping && (
                          <div className="text-[11px] text-blue-700 font-medium mt-1 flex items-center gap-1">
                            {order.shipping.method === 'Company' ? (
                              <>
                                <Building2 className="w-3 h-3" />
                                <span>{order.shipping.companyName || 'شركة شحن'}</span>
                              </>
                            ) : (
                              <>
                                <Bike className="w-3 h-3" />
                                <span>{order.shipping.courierName || 'مندوب'}</span>
                              </>
                            )}
                          </div>
                        )}
                      </td>

                      {/* إجراءات المستودع المصرحة */}
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5 flex-wrap">
                          {/* 1. التجهيز: مسموح فقط لـ Pending -> Preparing */}
                          {order.orderStatus === 'Pending' && (
                            <button
                              disabled={isCurrentActionLoading}
                              onClick={() => handleStartPreparing(order)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer disabled:opacity-50"
                              title="بدء تجهيز الطلب في المستودع"
                            >
                              {isCurrentActionLoading ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <PackageCheck className="w-3.5 h-3.5" />
                              )}
                              <span>بدء التجهيز</span>
                            </button>
                          )}

                          {/* 2. الشحن: مسموح فقط لـ Preparing -> Shipped */}
                          {order.orderStatus === 'Preparing' && (
                            <button
                              onClick={() => openShippingModal(order)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
                              title="تسليم الشحنة لشركة شحن أو مندوب"
                            >
                              <Truck className="w-3.5 h-3.5" />
                              <span>تسليم للشحن</span>
                            </button>
                          )}

                          {/* 3. الإلغاء: مسموح فقط لـ Pending أو Preparing */}
                          {(order.orderStatus === 'Pending' || order.orderStatus === 'Preparing') && (
                            <button
                              onClick={() => openCancelModal(order)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all cursor-pointer"
                              title="إلغاء الطلب واسترجاع المخزون"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>إلغاء</span>
                            </button>
                          )}

                          {/* 4. إضافة ملاحظة سريعة (متاحة لأي طلب) */}
                          <button
                            onClick={() => {
                              setNoteModalOrder(order);
                              setNoteText('');
                            }}
                            className="p-1.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                            title="إضافة ملاحظة على الطلب"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>

                          {/* 5. عرض التفاصيل بالكامل */}
                          <button
                            onClick={() => handleOpenDetails(order)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#08101E] hover:bg-[#1a273e] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                            title="عرض تفاصيل الطلب الكاملة وخط السير"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#D49B35]" />
                            <span>تفاصيل</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ════════════════════════════════════════════════════════════════════════ */}
      {/* ── مودال الشحن: تسليم الشحنة لشركة أو مندوب (Preparing -> Shipped) ── */}
      {/* ════════════════════════════════════════════════════════════════════════ */}
      {shippingModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* رأس المودال */}
            <div className="p-5 bg-linear-to-r from-blue-900 to-[#08101E] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black">تسليم الشحنة (Preparing → Shipped)</h3>
                  <p className="text-xs text-blue-200">
                    طلب رقم #{shippingModalOrder.orderNumber || shippingModalOrder._id.slice(-6)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShippingModalOrder(null)}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* اختيار وسيلة الشحن */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  اختر وسيلة الشحن والتسليم
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setShippingMethod('Company')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-2xl border-2 transition-all cursor-pointer font-bold text-xs ${
                      shippingMethod === 'Company'
                        ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-xs'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <span>شركة شحن (Company)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShippingMethod('Courier')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-2xl border-2 transition-all cursor-pointer font-bold text-xs ${
                      shippingMethod === 'Courier'
                        ? 'border-cyan-600 bg-cyan-50 text-cyan-900 shadow-xs'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <Bike className="w-4 h-4 text-cyan-600" />
                    <span>مندوب توصيل (Courier)</span>
                  </button>
                </div>
              </div>

              {/* حقول شركة الشحن */}
              {shippingMethod === 'Company' && (
                <div className="space-y-3 bg-blue-50/50 p-4 rounded-2xl border border-blue-200/60">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      اسم شركة الشحن <span className="text-red-500">* (إجباري)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: بوسطة، أرامكس، ميدل إيست..."
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full h-10 px-3.5 rounded-xl border border-blue-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      رقم التتبع (Tracking Number) <span className="text-slate-400 font-normal">(اختياري)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: TRK-987213..."
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="w-full h-10 px-3.5 rounded-xl border border-blue-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* حقول مندوب التوصيل */}
              {shippingMethod === 'Courier' && (
                <div className="space-y-3 bg-cyan-50/50 p-4 rounded-2xl border border-cyan-200/60">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      اسم المندوب <span className="text-red-500">* (إجباري)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: محمد أحمد..."
                      value={courierName}
                      onChange={(e) => setCourierName(e.target.value)}
                      className="w-full h-10 px-3.5 rounded-xl border border-cyan-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      رقم هاتف المندوب <span className="text-slate-400 font-normal">(اختياري)</span>
                    </label>
                    <input
                      type="tel"
                      dir="ltr"
                      placeholder="01012345678"
                      value={courierPhone}
                      onChange={(e) => setCourierPhone(e.target.value)}
                      className="w-full h-10 px-3.5 rounded-xl border border-cyan-200 bg-white text-xs text-slate-800 text-right focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                </div>
              )}

              {/* أزرار الإجراء */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShippingModalOrder(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-600 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  disabled={submittingShip}
                  onClick={handleConfirmShipping}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-md cursor-pointer transition-all disabled:opacity-50"
                >
                  {submittingShip ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>جاري الحفظ والتسليم...</span>
                    </>
                  ) : (
                    <>
                      <Truck className="w-4 h-4" />
                      <span>تأكيد التسليم للشحن (Shipped)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════════ */}
      {/* ── مودال الإلغاء: استرجاع المخزون تلقائياً (Pending/Preparing -> Cancelled) ── */}
      {/* ════════════════════════════════════════════════════════════════════════ */}
      {cancellingOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 bg-rose-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-200" />
                <h3 className="text-base font-black">إلغاء الطلب من المستودع</h3>
              </div>
              <button
                onClick={() => setCancellingOrder(null)}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* تنبيه استرجاع المخزون التلقائي */}
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>استرجاع المخزون التلقائي (Automatic Restock)</span>
                </p>
                <p className="text-[11px] text-rose-600 leading-relaxed">
                  عند تأكيد الإلغاء، سيقوم النظام تلقائياً بإعادة كميات كافة منتجات الطلب إلى مخزون المستودع المتاح للبيع.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  سبب الإلغاء / ملاحظة المستودع <span className="text-slate-400 font-normal">(اختياري)</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="مثال: تلف في المنتج أثناء التجهيز، عدم توفر المقاس بالمستودع..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCancellingOrder(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-600 cursor-pointer"
                >
                  تراجع
                </button>
                <button
                  type="button"
                  disabled={submittingCancel}
                  onClick={handleConfirmCancel}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-md cursor-pointer transition-all disabled:opacity-50"
                >
                  {submittingCancel ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>جاري الإلغاء...</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" />
                      <span>تأكيد الإلغاء واسترجاع المخزون</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════════ */}
      {/* ── مودال إضافة ملاحظة مستقلة (POST /orders/:id/notes) ── */}
      {/* ════════════════════════════════════════════════════════════════════════ */}
      {noteModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 bg-[#08101E] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#D49B35]" />
                <h3 className="text-base font-black">إضافة ملاحظة على الطلب</h3>
              </div>
              <button
                onClick={() => setNoteModalOrder(null)}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-500">
                إضافة ملاحظة إدارية على طلب رقم #{noteModalOrder.orderNumber || noteModalOrder._id.slice(-6)} دون تغيير حالته.
              </p>

              <div>
                <textarea
                  rows={4}
                  placeholder="اكتب ملاحظة المستودع هنا (مثال: تم تغليف الصندوق بعناية، بانتظار مندوب شركة الشحن)..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D49B35] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setNoteModalOrder(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-600 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  disabled={submittingNote || !noteText.trim()}
                  onClick={handleAddNoteSubmit}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#08101E] hover:bg-[#1a273e] text-white text-xs font-black shadow-md cursor-pointer transition-all disabled:opacity-50"
                >
                  {submittingNote ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#D49B35]" />
                      <span>جاري الإضافة...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 text-[#D49B35]" />
                      <span>حفظ الملاحظة</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════════ */}
      {/* ── مودال تفاصيل الطلب الكاملة + خط السير والملاحظات ── */}
      {/* ════════════════════════════════════════════════════════════════════════ */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* رأس المودال */}
            <div className="p-6 bg-[#08101E] text-white flex items-center justify-between">
              <div>
                <span className="text-[#D49B35] text-xs font-bold block mb-1">
                  تفاصيل الطلب الكاملة — المستودع
                </span>
                <h3 className="text-xl font-black flex items-center gap-2">
                  <span>طلب رقم: #{selectedOrder.orderNumber || selectedOrder._id}</span>
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 md:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
              {/* خط سير حالة الطلب */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <h4 className="text-sm font-black text-[#08101E] mb-6 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                  مراحل وخط سير حالة الطلب (Order Progress)
                </h4>

                {selectedOrder.orderStatus === 'Cancelled' || selectedOrder.orderStatus === 'Refused' ? (
                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-800">
                    <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
                    <div>
                      <p className="font-bold text-sm">
                        هذا الطلب {selectedOrder.orderStatus === 'Cancelled' ? 'تم إلغاؤه وتم إرجاع المخزون' : 'مرفوض'}
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
                              } ${isCurrent ? 'scale-110 ring-emerald-200 font-bold' : ''}`}
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
                              <span className="text-[10px] text-slate-400 block mt-0.5 leading-tight hidden sm:block">
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

              {/* بيانات العميل والتسليم */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-slate-200 bg-white">
                  <h5 className="text-xs font-black text-slate-400 mb-3 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-[#D49B35]" />
                    <span>بيانات العميل</span>
                  </h5>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">الاسم:</span>
                      <span className="font-bold text-slate-800">
                        {selectedOrder.shippingAddress?.fullName || 'عميل'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">رقم الهاتف:</span>
                      <span className="font-bold text-slate-800" dir="ltr">
                        {selectedOrder.shippingAddress?.phoneNumber || '—'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white">
                  <h5 className="text-xs font-black text-slate-400 mb-3 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#D49B35]" />
                    <span>عنوان تسليم الشحنة</span>
                  </h5>
                  <div className="space-y-1.5 text-xs text-slate-700">
                    <p className="font-bold">
                      {[selectedOrder.shippingAddress?.governorate, selectedOrder.shippingAddress?.city]
                        .filter(Boolean)
                        .join(' - ')}
                    </p>
                    <p className="text-slate-500">
                      {selectedOrder.shippingAddress?.street}
                      {selectedOrder.shippingAddress?.building && `، عمارة ${selectedOrder.shippingAddress.building}`}
                      {selectedOrder.shippingAddress?.apartment && `، شقة ${selectedOrder.shippingAddress.apartment}`}
                    </p>
                    {selectedOrder.shippingAddress?.notes && (
                      <p className="text-amber-800 bg-amber-50 p-2 rounded-lg text-[11px] mt-1 border border-amber-200/60">
                        ملاحظة العميل: {selectedOrder.shippingAddress.notes}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* بيانات الشحن إن وجدت */}
              {selectedOrder.shipping && (
                <div className="p-4 rounded-2xl border border-blue-200 bg-blue-50/50">
                  <h5 className="text-xs font-black text-blue-900 mb-2 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-blue-600" />
                    <span>بيانات الشحن المسجلة بالمستودع</span>
                  </h5>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-500">طريقة الشحن: </span>
                      <span className="font-bold text-slate-800">
                        {selectedOrder.shipping.method === 'Company' ? 'شركة شحن' : 'مندوب توصيل'}
                      </span>
                    </div>
                    {selectedOrder.shipping.companyName && (
                      <div>
                        <span className="text-slate-500">اسم الشركة: </span>
                        <span className="font-bold text-blue-800">{selectedOrder.shipping.companyName}</span>
                      </div>
                    )}
                    {selectedOrder.shipping.trackingNumber && (
                      <div>
                        <span className="text-slate-500">رقم التتبع: </span>
                        <span className="font-mono font-bold text-slate-800">{selectedOrder.shipping.trackingNumber}</span>
                      </div>
                    )}
                    {selectedOrder.shipping.courierName && (
                      <div>
                        <span className="text-slate-500">اسم المندوب: </span>
                        <span className="font-bold text-cyan-800">{selectedOrder.shipping.courierName}</span>
                      </div>
                    )}
                    {selectedOrder.shipping.courierPhone && (
                      <div>
                        <span className="text-slate-500">هاتف المندوب: </span>
                        <span className="font-mono font-bold text-slate-800" dir="ltr">{selectedOrder.shipping.courierPhone}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* قائمة المنتجات في المستودع */}
              <div className="space-y-3">
                <h5 className="text-sm font-black text-[#08101E] flex items-center justify-between">
                  <span>منتجات الطلب ({selectedOrder.items?.length || 0})</span>
                  <span className="text-xs font-normal text-slate-500">تأكد من مطابقة الأصناف قبل الشحن</span>
                </h5>

                <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 overflow-hidden bg-white">
                  {selectedOrder.items?.map((item, index) => {
                    const prodObj = typeof item.product === 'object' && item.product !== null ? item.product : null;
                    const imgUrl = item.image || prodObj?.images?.[0]?.secure_url || '/placeholder.png';
                    const title = item.title || 'منتج';
                    const itemKey = (prodObj?._id) || (typeof item.product === 'string' ? item.product : null) || index;
                    return (
                      <div key={itemKey} className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                            <Image
                              src={imgUrl}
                              alt={title}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800 line-clamp-1">{title}</p>
                            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                              <span>الكمية: <strong className="text-[#08101E]">{item.quantity}</strong></span>
                              {item.size && <span>• المقاس: <strong>{item.size}</strong></span>}
                              {item.color && <span>• اللون: <strong>{item.color}</strong></span>}
                            </div>
                          </div>
                        </div>
                        <div className="text-left font-black text-xs text-[#08101E]">
                          {(item.price * item.quantity).toLocaleString('ar-EG')} ج.م
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* قسم الملاحظات على الطلب */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <h5 className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#D49B35]" />
                  <span>الملاحظات وسجل الحالات</span>
                </h5>

                {/* قائمة الملاحظات إن وجدت */}
                {selectedOrder.statusHistory && selectedOrder.statusHistory.length > 0 && (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedOrder.statusHistory.map((hist, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs">
                        <div className="flex items-center justify-between text-slate-500 text-[11px]">
                          <span>الحالة: <strong className="text-slate-700">{hist.status}</strong></span>
                          <span>
                            {hist.changedAt
                              ? new Date(hist.changedAt).toLocaleString('ar-EG')
                              : ''}
                          </span>
                        </div>
                        {hist.note && (
                          <p className="text-slate-800 mt-1 font-medium bg-slate-50 p-1.5 rounded">
                            {hist.note}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* إضافة ملاحظة جديدة من داخل المودال */}
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="أضف ملاحظة جديدة على هذا الطلب..."
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    className="flex-1 h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#D49B35]"
                  />
                  <button
                    disabled={submittingNote || !noteText.trim()}
                    onClick={handleAddNoteSubmit}
                    className="h-9 px-3.5 rounded-xl bg-[#08101E] hover:bg-[#1a273e] text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1"
                  >
                    {submittingNote ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5 text-[#D49B35]" />
                    )}
                    <span>إضافة</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
