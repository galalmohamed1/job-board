import { redirect } from 'next/navigation';

export default function DashboardAccountRootPage() {
  redirect('/dashboard-account/orders');
}
