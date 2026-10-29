import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/next-auth/authOptions';
import { getCouponsAdmin } from '@/action/admin.action';
import CouponsManager from '@/components/salesmanager/CouponsManager';
import { Loader2 } from 'lucide-react';

export const metadata = {
  title: 'إدارة وإضافة كوبونات الخصم | لوحة مدير المبيعات',
  description: 'إنشاء ومتابعة كوبونات الخصم الترويجية للعملاء',
};

async function CouponsContent() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role?.toLowerCase();

  if (!session || (role !== 'salesmanager' && role !== 'admin')) {
    redirect('/');
  }

  const coupons = await getCouponsAdmin();

  return <CouponsManager initialCoupons={coupons ?? []} />;
}

function CouponsLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-slate-500">
      <Loader2 className="w-8 h-8 animate-spin text-[#D49B35]" />
      <p className="text-sm font-semibold">جاري تحميل الكوبونات...</p>
    </div>
  );
}

export default function SalesManagerCouponsPage() {
  return (
    <Suspense fallback={<CouponsLoading />}>
      <CouponsContent />
    </Suspense>
  );
}
