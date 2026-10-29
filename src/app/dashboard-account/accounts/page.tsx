import AccountantFinanceManager from '@/components/accountant/AccountantFinanceManager';
import {
  getAccountantOrders,
  getAccountantAccounts,
} from '@/action/accountant.action';

export const metadata = {
  title: 'دفتر الحسابات والمالية | لوحة المحاسب',
  description: 'عرض كافة الحسابات والتعاملات المالية لسوق حورس',
};

export default async function AccountantAccountsPage() {
  const [orders, accounts] = await Promise.all([
    getAccountantOrders(),
    getAccountantAccounts(),
  ]);

  return <AccountantFinanceManager orders={orders ?? []} accounts={accounts ?? []} />;
}
