import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/next-auth/authOptions';
import { getWarehouseOrders } from '@/action/order.action';
import WarehouseOrdersManager from '@/components/warehouse/WarehouseOrdersManager';

export const metadata = {
  title: 'لوحة المستودع | سوق حورس',
  description: 'إدارة وتجهيز الشحنات بالمستودع وتسليمها لشركات الشحن والمندوبين',
};

interface PageProps {
  searchParams?: Promise<{
    status?: string;
    page?: string;
  }>;
}

export default async function DashboardWarehousePage({ searchParams }: PageProps) {
  // 1. التحقق من الجلسة والصلاحيات (أمين المستودع أو الأدمن)
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role?.toLowerCase();

  if (!session || (role !== 'warehouse' && role !== 'admin')) {
    redirect('/');
  }

  // 2. قراءة معاملات الرابط
  const params = searchParams ? await searchParams : {};
  const status = params.status || 'ALL';
  const page = Number(params.page) || 1;

  // 3. جلب طلبات المستودع الأولية من السيرفر عبر order.action.ts
  const res = await getWarehouseOrders({
    status: status === 'ALL' ? undefined : status,
    page,
    limit: 50,
  });

  const ordersData =
    res.success && res.data
      ? res.data
      : { orders: [], total: 0, page: 1, pages: 1 };

  return (
    <WarehouseOrdersManager
      initialOrders={ordersData.orders}
      initialTotal={ordersData.total}
      initialPage={ordersData.page}
      initialPages={ordersData.pages}
      initialStatus={status}
    />
  );
}

