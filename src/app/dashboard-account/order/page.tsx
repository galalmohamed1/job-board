import { redirect } from 'next/navigation';

export default function OrderRedirectPage() {
  redirect('/dashboard-account/orders');
}
