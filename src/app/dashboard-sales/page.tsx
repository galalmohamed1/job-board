import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/next-auth/authOptions';
import { getSalesOrders } from '@/action/order.action';
import SalesOrdersManager from '@/components/sales/SalesOrdersManager';

export const metadata = {
  title: 'أوردرات المبيعات | سوق حورس',
  description: 'إدارة ومتابعة طلبات المبيعات وسجل الحالات والملاحظات',
};

interface PageProps {
  searchParams?: Promise<{
    status?: string;
    page?: string;
  }>;
}

export default async function DashboardSalesPage({ searchParams }: PageProps) {
  // 1. Session verification & role check
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any)?.role !== 'sales') {
    redirect('/');
  }

  // 2. Resolve searchParams
  const params = searchParams ? await searchParams : {};
  const status = params.status || 'all';
  const page = Number(params.page) || 1;

  // 3. Fetch orders for current sales user (filtered by backend according to req.user)
  const res = await getSalesOrders({
    status: status === 'all' ? undefined : status,
    page,
    limit: 10,
  });

  const ordersData = res.success && res.data
    ? res.data
    : { orders: [], total: 0, page: 1, pages: 1 };

  return (
    <SalesOrdersManager
      initialOrders={ordersData.orders}
      initialTotal={ordersData.total}
      initialPage={ordersData.page}
      initialPages={ordersData.pages}
      initialStatus={status}
    />
  );
}
