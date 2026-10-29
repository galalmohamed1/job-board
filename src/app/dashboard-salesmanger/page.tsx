import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/next-auth/authOptions';
import { getSalesManagerOrders } from '@/action/salesmanager.action';
import SalesManagerOrdersManager from '@/components/salesmanager/SalesManagerOrdersManager';
import { Loader2 } from 'lucide-react';

export const metadata = {
  title: 'لوحة تحكم مدير المبيعات | سوق حورس',
  description: 'إدارة طلبات المبيعات وتحديث الحالات والمنتجات والأقسام والكوبونات',
};

interface PageProps {
  searchParams?: Promise<{
    status?: string;
    page?: string;
  }>;
}

async function OrdersContent({ searchParams }: PageProps) {
  // 1. Session verification & role check
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role?.toLowerCase();

  if (!session || (role !== 'salesmanager' && role !== 'admin')) {
    redirect('/');
  }

  // 2. Resolve searchParams
  const params = searchParams ? await searchParams : {};
  const status = params.status || 'all';
  const page = Number(params.page) || 1;

  // 3. Fetch orders for sales manager
  const res = await getSalesManagerOrders({
    status: status === 'all' ? undefined : status,
    page,
    limit: 10,
  });

  const ordersData = res.success && res.data
    ? res.data
    : { orders: [], total: 0, page: 1, pages: 1 };

  return (
    <SalesManagerOrdersManager
      initialOrders={ordersData.orders}
      initialTotal={ordersData.total}
      initialPage={ordersData.page}
      initialPages={ordersData.pages}
      initialStatus={status}
    />
  );
}

function OrdersLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-slate-500">
      <Loader2 className="w-8 h-8 animate-spin text-[#D49B35]" />
      <p className="text-sm font-semibold">جاري تحميل طلبات المبيعات...</p>
    </div>
  );
}

export default function DashboardSalesManagerPage(props: PageProps) {
  return (
    <Suspense fallback={<OrdersLoading />}>
      <OrdersContent {...props} />
    </Suspense>
  );
}
