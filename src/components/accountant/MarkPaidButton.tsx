'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { CheckCircle2, DollarSign, Loader2, AlertCircle, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { AdminOrder } from '@/types/admin/adminOrders';
import { markOrderPaid } from '@/action/order.action';

interface MarkPaidButtonProps {
  order: AdminOrder;
  onSuccess?: (updatedOrder: AdminOrder) => void;
  className?: string;
}

const ALLOWED_ROLES = ['accountant', 'salesmanager', 'admin'];

export default function MarkPaidButton({
  order,
  onSuccess,
  className = '',
}: MarkPaidButtonProps) {
  const { data: session } = useSession();
  const [isOpenConfirm, setIsOpenConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 1. If already paid, display "مدفوع ✓" badge
  if (order.isPaid) {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs ${className}`}
      >
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        <span>مدفوع ✓</span>
      </span>
    );
  }

  // 2. If status is Cancelled or Refused, do not display the button
  if (order.orderStatus === 'Cancelled' || order.orderStatus === 'Refused') {
    return null;
  }

  // 3. Only show button for authorized roles: accountant, salesManager, admin
  const userRole = session?.user?.role?.toLowerCase() || '';
  const isAuthorized = ALLOWED_ROLES.includes(userRole);

  if (!isAuthorized) {
    return null;
  }

  const orderNumber = order.orderNumber || order._id.slice(-6);
  const amount = (order.finalPrice ?? order.totalPrice ?? 0).toLocaleString('en-US');

  const handleConfirmPay = async () => {
    setIsLoading(true);
    try {
      const res = await markOrderPaid(order._id);

      if (res.success) {
        toast.success(res.message || 'تم تأكيد دفع الطلب بنجاح');
        setIsOpenConfirm(false);

        const updatedOrder: AdminOrder = {
          ...order,
          ...(res.data || {}),
          isPaid: true,
          paidAt: res.data?.paidAt || new Date().toISOString(),
        };

        if (onSuccess) {
          onSuccess(updatedOrder);
        }
      } else {
        toast.error(res.message || 'فشل في تأكيد دفع الطلب');
      }
    } catch (err: unknown) {
      console.error('Error marking order as paid:', err);
      toast.error('حدث خطأ غير متوقع أثناء تأكيد الدفع');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpenConfirm(true)}
        disabled={isLoading}
        className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-linear-to-r from-emerald-600 to-teal-600 text-white shadow-xs hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        <DollarSign className="w-3.5 h-3.5" />
        <span>تأكيد الدفع</span>
      </button>

      {/* Confirmation Modal */}
      {isOpenConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-2xl p-6 text-right animate-scaleUp">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/60 text-emerald-700 flex items-center justify-center font-bold">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">
                    تأكيد دفع الطلب
                  </h3>
                  <p className="text-xs text-slate-500">
                    رقم الطلب: #{orderNumber}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => !isLoading && setIsOpenConfirm(false)}
                disabled={isLoading}
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="py-4 space-y-3">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200/60 text-amber-800 text-xs">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  هل أنت متأكد من تسجيل هذا الطلب كـ <strong>مدفوع (Paid)</strong>؟
                  سيتم تسجيل عملية الدفع وتاريخ السداد في سجلات الحسابات.
                </p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs space-y-1.5">
                <div className="flex justify-between items-center text-slate-600">
                  <span>المبلغ المستحق:</span>
                  <span className="font-black text-slate-900 text-sm">
                    {amount} ج.م
                  </span>
                </div>
                {order.paymentMethod && (
                  <div className="flex justify-between items-center text-slate-500">
                    <span>طريقة الدفع:</span>
                    <span className="font-bold text-slate-700">
                      {order.paymentMethod}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsOpenConfirm(false)}
                disabled={isLoading}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleConfirmPay}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>جاري التأكيد...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>نعم، تم استلام الدفع</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
