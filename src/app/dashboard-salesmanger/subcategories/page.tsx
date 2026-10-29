import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/next-auth/authOptions';
import SubCategoriesManager from '@/components/admin/SubCategoriesManager';

export const metadata = {
  title: 'إدارة وإضافة الأقسام الفرعية | لوحة مدير المبيعات',
  description: 'إضافة وإدارة الأقسام الفرعية المرتبطة بالأقسام الرئيسية',
};

export default async function SalesManagerSubCategoriesPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role?.toLowerCase();

  if (!session || (role !== 'salesmanager' && role !== 'admin')) {
    redirect('/');
  }

  return <SubCategoriesManager />;
}
