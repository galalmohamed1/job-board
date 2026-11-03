import AccountantOrdersManager from '@/components/accountant/AccountantOrdersManager';
import { getAccountantOrders } from '@/action/accountant.action';
import { Suspense } from "react";
import Loading from '../loading';

export const metadata = {
  title: 'إدارة الطلبات | لوحة المحاسب',
  description: 'عرض جميع طلبات سوق حورس وتحديث الحالات',
};


// src/app/dashboard-account/orders/page.tsx

export default function AccountantOrdersPage() {
  return (
    <div>
      <Suspense fallback={<Loading/>}>
        <OrdersList />
      </Suspense>
    </div>
  );
}

async function OrdersList() {
  const orders = await getAccountantOrders();
  return (
    <>
     <AccountantOrdersManager initialOrders={orders ?? []} />
    </> 
    );
}