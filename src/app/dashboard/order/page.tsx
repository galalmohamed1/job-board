import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/next-auth/authOptions';
import OrderAdmin from '@/components/admin/OrderAdmin';

export const metadata = {
  title: 'إدارة الطلبات | لوحة التحكم',
  description: 'عرض ومتابعة كافة طلبات المتجر وحالاتها وأدوار المستخدمين',
};

export default async function AdminOrdersAliasPage() {

  return <OrderAdmin />;
}

