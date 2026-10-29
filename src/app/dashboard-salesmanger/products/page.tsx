import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/next-auth/authOptions';
import {
  getAllProductsAdmin,
  getCategoriesAdmin,
  getDetailsSubCategoriesAdmin,
  getSubCategoriesAdmin,
} from '@/action/admin.action';
import ProductsManager from '@/components/admin/ProductsManager';
import { Loader2 } from 'lucide-react';

export const metadata = {
  title: 'إدارة وإضافة المنتجات | لوحة مدير المبيعات',
  description: 'إضافة وتعديل المنتجات وأسعارها ومخزونها',
};

async function ProductsContent() {
  const [products, categories, subcategories, detailsSubCategories] = await Promise.all([
    getAllProductsAdmin().then((res) => res ?? []),
    getCategoriesAdmin().then((res) => res ?? []),
    getSubCategoriesAdmin().then((res) => res ?? []),
    getDetailsSubCategoriesAdmin().then((res) => res ?? []),
  ]);

  return (
    <ProductsManager
      Products={products}
      Categories={categories}
      Subcategories={subcategories}
      Details={detailsSubCategories}
    />
  );
}

function ProductsLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-slate-500">
      <Loader2 className="w-8 h-8 animate-spin text-[#D49B35]" />
      <p className="text-sm font-semibold">جاري تحميل المنتجات...</p>
    </div>
  );
}

export default async function SalesManagerProductsPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role?.toLowerCase();

  if (!session || (role !== 'salesmanager' && role !== 'admin')) {
    redirect('/');
  }

  return (
    <Suspense fallback={<ProductsLoading />}>
      <ProductsContent />
    </Suspense>
  );
}
