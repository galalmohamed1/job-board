import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/next-auth/authOptions';
import DetailsSubCategoryManager from '@/components/admin/DetailsSubCategoryManager';

export const metadata = {
  title: 'إدارة تفاصيل الأقسام الفرعية | لوحة مدير المبيعات',
  description: 'إضافة وإدارة التفاصيل الدقيقة للأقسام الفرعية',
};

export default async function SalesManagerDetailsSubCategoryPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role?.toLowerCase();

  if (!session || (role !== 'salesmanager' && role !== 'admin')) {
    redirect('/');
  }

  return <DetailsSubCategoryManager />;
}
