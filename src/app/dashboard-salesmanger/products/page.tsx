import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/next-auth/authOptions';
import ProductsData from '@/components/admin/ProductData';


export const metadata = {
  title: 'إدارة وإضافة المنتجات | لوحة مدير المبيعات',
  description: 'إضافة وتعديل المنتجات وأسعارها ومخزونها',
};

export default async function SalesManagerProductsPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role?.toLowerCase();

  if (!session || (role !== 'salesmanager' && role !== 'admin')) {
    redirect('/');
  }

  return (
    <>
      <ProductsData />
    </>
  );
}
