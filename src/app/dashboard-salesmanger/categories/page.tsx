import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/next-auth/authOptions';
import CategoriesManager from '@/components/admin/CategoriesManager';

export const metadata = {
  title: 'إدارة وإضافة الأقسام | لوحة مدير المبيعات',
  description: 'إضافة وإدارة الأقسام الرئيسية في سوق حورس',
};

export default async function SalesManagerCategoriesPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role?.toLowerCase();

  if (!session || (role !== 'salesmanager' && role !== 'admin')) {
    redirect('/');
  }

  return <CategoriesManager />;
}
