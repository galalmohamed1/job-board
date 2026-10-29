import AccountantOrdersManager from '@/components/accountant/AccountantOrdersManager';
import { getAccountantOrders } from '@/action/accountant.action';

export const metadata = {
  title: 'إدارة الطلبات | لوحة المحاسب',
  description: 'عرض جميع طلبات سوق حورس وتحديث الحالات',
};

export default async function AccountantOrdersPage() {
  const orders = await getAccountantOrders();
  return <AccountantOrdersManager initialOrders={orders ?? []} />;
}
