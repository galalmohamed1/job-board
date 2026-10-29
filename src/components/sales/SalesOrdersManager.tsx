'use client';

import React, { useState, useMemo, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Package,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  User,
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
  Truck,
  FileText,
  Send,
  Calendar,
  Ban,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { AdminOrder, StatusHistoryItem } from '@/types/admin/adminOrders';
import {
  getSalesOrders,
  getSalesOrderById,
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

export default function SalesOrdersManager({
  initialOrders,
  initialTotal,
  initialPage,
  initialPages,
  initialStatus,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

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
  const [cancellingOrder, setCancellingOrder] = useState<AdminOrder | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

  // Note state
  const [newNoteText, setNewNoteText] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  // General loading & copy state
  const [isPending, startTransition] = useTransition();
  const [copiedId, setCopiedId] = useState<string | null>(null);

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
        return {
          label: 'قيد الانتظار',
          classes: 'bg-amber-50 text-amber-700 border-amber-200/60',
        };
      case 'Preparing':
        return {
          label: 'جاري التجهيز',
          classes: 'bg-purple-50 text-purple-700 border-purple-200/60',
        };
      case 'Shipped':
        return {
          label: 'تم الشحن',
          classes: 'bg-blue-50 text-blue-700 border-blue-200/60',
        };
      case 'Delivered':
        return {
          label: 'تم التوصيل',
          classes: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
        };
      case 'Refused':
        return {
          label: 'تم الرفض',
          classes: 'bg-rose-50 text-rose-700 border-rose-200/60',
        };
      case 'Cancelled':
        return {
          label: 'ملغي',
          classes: 'bg-red-50 text-red-700 border-red-200/60',
        };
      default:
        return {
          label: status,
          classes: 'bg-slate-100 text-slate-700 border-slate-200',
        };
    }
  };

  // ── Fetch Orders on Filter or Page Change ──
  const loadOrders = (newStatus: string, newPage: number) => {
    startTransition(async () => {
      const res = await getSalesOrders({
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

  // ── Frontend Search Filter by Order Number ──
  const displayedOrders = useMemo(() => {
    if (!searchQuery.trim()) return orders;
    const q = searchQuery.toLowerCase().trim();
    return orders.filter((order) => {
      const orderNo = (order.orderNumber || order._id || '').toLowerCase();
      const { name, phone } = getCustomerInfo(order);
      return (
        orderNo.includes(q) ||
        name.toLowerCase().includes(q) ||
        phone.includes(q)
      );
    });
  }, [orders, searchQuery]);

  // ── Open Details Modal ──
  const handleOpenDetails = async (order: AdminOrder) => {
    setSelectedOrder(order);
    setLoadingDetails(true);
    try {
      const res = await getSalesOrderById(order._id);
      if (res.success && res.data) {
        setSelectedOrder(res.data);
      }
    } catch (err) {
      console.error('Error fetching order details:', err);
    } finally {
      setLoadingDetails(false);
    }
  };

  // ── Handle Cancel Order ──
  const handleConfirmCancel = async () => {
    if (!cancellingOrder) return;
    setIsCancelling(true);
    try {
      const res = await cancelOrder(cancellingOrder._id, cancelReason);
      if (res.success) {
        toast.success(res.message || 'تم إلغاء الطلب بنجاح');
        // Update local order state immediately
        setOrders((prev) =>
          prev.map((o) =>
            o._id === cancellingOrder._id
              ? {
                  ...o,
                  orderStatus: 'Cancelled',
                  statusHistory: [
                    ...(o.statusHistory || []),
                    {
                      status: 'Cancelled',
                      note: cancelReason || 'تم الإلغاء بواسطة مسؤول المبيعات',
                      createdAt: new Date().toISOString(),
                    },
                  ],
                }
              : o
          )
        );

        if (selectedOrder && selectedOrder._id === cancellingOrder._id) {
          setSelectedOrder((prev) =>
            prev ? { ...prev, orderStatus: 'Cancelled' } : null
          );
        }

        setCancellingOrder(null);
        setCancelReason('');
      } else {
        toast.error(res.message || 'فشل في إلغاء الطلب');
      }
    } catch {
      toast.error('حدث خطأ أثناء إلغاء الطلب');
    } finally {
      setIsCancelling(false);
    }
  };

  // ── Handle Add Order Note ──
  const handleAddNote = async () => {
    if (!selectedOrder || !newNoteText.trim()) return;
    setIsAddingNote(true);
    try {
      const res = await addOrderNote(selectedOrder._id, newNoteText.trim());
      if (res.success) {
        toast.success(res.message || 'تمت إضافة الملاحظة بنجاح');
        const newNoteItem: StatusHistoryItem = {
          status: selectedOrder.orderStatus,
          note: newNoteText.trim(),
          createdAt: new Date().toISOString(),
          changedBy: 'مسؤول المبيعات',
        };

        setSelectedOrder((prev) =>
          prev
            ? {
                ...prev,
                statusHistory: [...(prev.statusHistory || []), newNoteItem],
                notes: [
                  ...(prev.notes || []),
                  {
                    text: newNoteText.trim(),
                    createdAt: new Date().toISOString(),
                  },
                ],
              }
            : null
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
    <div className="space-y-6">
      {/* ── Page Header & Stats ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <span className="w-9 h-9 rounded-xl bg-linear-to-br from-[#0B2545] to-[#134074] text-[#F3C053] flex items-center justify-center text-sm shadow-xs">
              <Package className="w-5 h-5" />
            </span>
            <span>أوردرات المبيعات الخاصة بي</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            متابعة جميع الطلبات المحجوزة من خلالك، وتحديث الملاحظات، وإلغاء الطلبات المتاحة
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

      {/* ── Search & Filter Bar ── */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Input (Local Frontend search on current page) */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث برقم الأوردر أو اسم العميل أو الهاتف..."
              className="w-full pr-9 pl-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D49B35] focus:bg-white transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Status Filter (Sent to backend as status query param) */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilterChange(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#D49B35] cursor-pointer"
            >
              <option value="all">كل الحالات (الكل)</option>
              <option value="Pending">قيد الانتظار (Pending)</option>
              <option value="Preparing">جاري التجهيز (Preparing)</option>
              <option value="Shipped">تم الشحن (Shipped)</option>
              <option value="Delivered">تم التوصيل (Delivered)</option>
              <option value="Refused">تم الرفض (Refused)</option>
              <option value="Cancelled">ملغي (Cancelled)</option>
            </select>
          </div>
        </div>

        {/* Counter and Filter Reset */}
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
              className="text-[#D49B35] hover:underline font-bold"
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
            <h3 className="text-base font-bold text-slate-800">مفيش أوردرات لسه</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              لم تقم بحجز أي أوردرات تطابق الحالة المختارة حتى الآن، أو لا توجد نتائج مطابقة للبحث.
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
                  <th className="py-3.5 px-4 text-center">حالة الأوردر</th>
                  <th className="py-3.5 px-4 text-center">حالة الدفع</th>
                  <th className="py-3.5 px-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayedOrders.map((order) => {
                  const { name, phone, email } = getCustomerInfo(order);
                  const shortId = order.orderNumber || order._id.slice(-6);
                  const amount = order.finalPrice ?? order.totalPrice ?? 0;
                  const statusBadge = getStatusBadge(order.orderStatus);

                  // Cancel is permitted ONLY if status is Pending or Preparing
                  const canCancel =
                    order.orderStatus === 'Pending' ||
                    order.orderStatus === 'Preparing';

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
                            onClick={() =>
                              handleCopy(order.orderNumber || order._id, order._id)
                            }
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

                      {/* Order Status Badge (Read-Only) */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold border ${statusBadge.classes}`}
                        >
                          {statusBadge.label}
                        </span>
                      </td>

                      {/* Payment Status Badge (Read-Only) */}
                      <td className="py-3.5 px-4 text-center">
                        {order.isPaid ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>مدفوع</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200/60">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            <span>غير مدفوع</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {/* Cancel Button (Visible ONLY if Pending or Preparing) */}
                          {canCancel && (
                            <button
                              type="button"
                              onClick={() => {
                                setCancellingOrder(order);
                                setCancelReason('');
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-colors cursor-pointer"
                              title="إلغاء الأوردر"
                            >
                              <Ban className="w-3.5 h-3.5" />
                              <span>إلغاء</span>
                            </button>
                          )}

                          {/* Details Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenDetails(order)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-500" />
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

        {/* ── Pagination ── */}
        {pages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-slate-100 bg-slate-50/70 text-xs">
            <span className="text-slate-600">
              الصفحة <strong>{page}</strong> من <strong>{pages}</strong>
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => handlePageChange(page - 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <ChevronRight className="w-3.5 h-3.5" />
                <span>السابق</span>
              </button>

              <button
                type="button"
                disabled={page >= pages}
                onClick={() => handlePageChange(page + 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <span>التالي</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Cancel Order Confirm Modal ── */}
      {cancellingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-2xl p-6 text-right animate-scaleUp">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center justify-center font-bold">
                  <Ban className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">
                    إلغاء الطلب #{cancellingOrder.orderNumber || cancellingOrder._id.slice(-6)}
                  </h3>
                  <p className="text-xs text-slate-500">
                    هل أنت متأكد من رغبتك في إلغاء هذا الطلب؟
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => !isCancelling && setCancellingOrder(null)}
                disabled={isCancelling}
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="py-4 space-y-3">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200/60 text-amber-800 text-xs">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  سيتم تغيير حالة الطلب إلى <strong>ملغي (Cancelled)</strong>. هذه العملية نهائية ولن يمكن استعادة الطلب بعدها.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  سبب الإلغاء (اختياري):
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="اكتب سبب الإلغاء ليتم تسجيله في سجل ملاحظات الأوردر..."
                  rows={3}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCancellingOrder(null)}
                disabled={isCancelling}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                تراجع
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={isCancelling}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isCancelling ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>جاري الإلغاء...</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5" />
                    <span>تأكيد الإلغاء</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Order Details Modal ── */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-2xl border border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-scaleUp text-right">
            {/* Header */}
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

            {/* Body */}
            <div className="p-5 space-y-5 overflow-y-auto flex-1 text-xs sm:text-sm">
              {loadingDetails && (
                <div className="flex items-center justify-center gap-2 py-2 text-xs text-[#D49B35] font-bold">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>جاري تحديث كامل التفاصيل وسجل الحالات...</span>
                </div>
              )}

              {/* Status and Payment Summary */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <span className="text-[11px] text-slate-400 block mb-1">حالة الأوردر</span>
                  <span className="font-black text-slate-900">
                    {getStatusBadge(selectedOrder.orderStatus).label}
                  </span>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <span className="text-[11px] text-slate-400 block mb-1">حالة الدفع (isPaid)</span>
                  <span
                    className={`font-black ${
                      selectedOrder.isPaid ? 'text-emerald-600' : 'text-amber-600'
                    }`}
                  >
                    {selectedOrder.isPaid ? '✓ تم السداد (Paid)' : '⏳ غير مسدد'}
                  </span>
                </div>
              </div>

              {/* Customer Box */}
              {(() => {
                const info = getCustomerInfo(selectedOrder);
                return (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <h4 className="font-bold text-slate-800 text-xs mb-3 flex items-center gap-1.5">
                      <User className="w-4 h-4 text-[#D49B35]" />
                      <span>بيانات العميل:</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-[11px] text-slate-400 block">اسم العميل</span>
                        <strong className="text-slate-900">{info.name}</strong>
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

              {/* Products List (title, image, quantity, price, size, color) */}
              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-800 text-xs mb-2">المنتجات المطلوبة:</h4>
                  <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden bg-white">
                    {selectedOrder.items.map((it, idx) => {
                      const prodTitle =
                        it.title ||
                        it.name ||
                        (typeof it.product === 'object' ? it.product?.title : null) ||
                        `منتج ${idx + 1}`;

                      let prodImg = it.image;
                      if (!prodImg && typeof it.product === 'object' && it.product !== null) {
                        const pImg = it.product.image;
                        if (Array.isArray(pImg) && pImg.length > 0) {
                          prodImg = pImg[0]?.secure_url;
                        } else if (pImg && typeof pImg === 'object' && !Array.isArray(pImg)) {
                          prodImg = (pImg as { secure_url?: string }).secure_url;
                        }
                      }

                      return (
                        <div key={idx} className="p-3 flex items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-3">
                            {prodImg ? (
                              <img
                                src={prodImg}
                                alt={prodTitle}
                                className="w-12 h-12 rounded-lg object-cover border border-slate-100"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                                <Package className="w-5 h-5" />
                              </div>
                            )}
                            <div>
                              <p className="font-bold text-slate-900">{prodTitle}</p>
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                الكمية: {it.quantity || 1}{' '}
                                {it.size ? `• المقاس: ${it.size}` : ''}{' '}
                                {it.color ? `• اللون: ${it.color}` : ''}
                              </p>
                            </div>
                          </div>
                          <span className="font-black text-slate-800 shrink-0">
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

              {/* Shipping Details (If present) */}
              {selectedOrder.shipping && (
                <div className="bg-blue-50/60 p-3.5 rounded-xl border border-blue-100">
                  <h4 className="font-bold text-blue-900 text-xs mb-2 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-blue-600" />
                    <span>بيانات الشحن:</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs text-blue-800">
                    <div>
                      <span className="text-[11px] text-blue-600 block">طريقة الشحن:</span>
                      <strong>
                        {selectedOrder.shipping.method === 'Courier' ? 'مندوب خاص' : 'شركة شحن'}
                      </strong>
                    </div>
                    {selectedOrder.shipping.companyName && (
                      <div>
                        <span className="text-[11px] text-blue-600 block">اسم الشركة:</span>
                        <strong>{selectedOrder.shipping.companyName}</strong>
                      </div>
                    )}
                    {selectedOrder.shipping.trackingNumber && (
                      <div>
                        <span className="text-[11px] text-blue-600 block">رقم التتبع:</span>
                        <strong className="font-mono">{selectedOrder.shipping.trackingNumber}</strong>
                      </div>
                    )}
                    {selectedOrder.shipping.courierName && (
                      <div>
                        <span className="text-[11px] text-blue-600 block">اسم المندوب:</span>
                        <strong>{selectedOrder.shipping.courierName}</strong>
                      </div>
                    )}
                    {selectedOrder.shipping.courierPhone && (
                      <div>
                        <span className="text-[11px] text-blue-600 block">هاتف المندوب:</span>
                        <strong className="font-mono" dir="ltr">{selectedOrder.shipping.courierPhone}</strong>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Status History Timeline */}
              <div>
                <h4 className="font-bold text-slate-800 text-xs mb-2 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#D49B35]" />
                  <span>سجل الحالات والملاحظات (Status History):</span>
                </h4>
                {selectedOrder.statusHistory && selectedOrder.statusHistory.length > 0 ? (
                  <div className="space-y-2 border border-slate-100 rounded-xl p-3 bg-white">
                    {selectedOrder.statusHistory.map((sh, idx) => {
                      const changerName =
                        typeof sh.changedBy === 'object' && sh.changedBy !== null
                          ? sh.changedBy.name || sh.changedBy.fullName || 'مسؤول'
                          : sh.changedBy || 'النظام';
                      const dateStr = sh.changedAt || sh.createdAt;

                      return (
                        <div
                          key={idx}
                          className="flex items-start justify-between gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs"
                        >
                          <div>
                            <span className="font-bold text-slate-800">
                              {getStatusBadge(sh.status).label}
                            </span>
                            {sh.note && (
                              <p className="text-slate-600 mt-0.5 leading-relaxed">
                                {sh.note}
                              </p>
                            )}
                          </div>
                          <div className="text-left shrink-0 text-[10px] text-slate-400">
                            <div>بواسطة: {changerName}</div>
                            {dateStr && (
                              <div>{new Date(dateStr).toLocaleDateString('ar-EG')}</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-slate-400 text-xs italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                    لا يوجد سجل تغييرات حتى الآن.
                  </p>
                )}
              </div>

              {/* Add Note Section */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-800 text-xs mb-2 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#D49B35]" />
                  <span>إضافة ملاحظة على الطلب:</span>
                </h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="اكتب ملاحظة لمتابعة الأوردر..."
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#D49B35]"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddNote();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddNote}
                    disabled={isAddingNote || !newNoteText.trim()}
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-[#0B2545] hover:bg-[#134074] text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-40"
                  >
                    {isAddingNote ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>إرسال</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Total Summary */}
              <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                <span className="font-bold text-slate-600">المبلغ الإجمالي النهائي:</span>
                <span className="text-xl font-black text-[#D49B35]">
                  {(selectedOrder.finalPrice || selectedOrder.totalPrice || 0).toLocaleString(
                    'en-US'
                  )}{' '}
                  ج.م
                </span>
              </div>
            </div>

            {/* Footer */}
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
