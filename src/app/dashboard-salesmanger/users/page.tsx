import { Suspense } from 'react';
import UsersManager from '@/components/admin/UsersManager';
import { getAllUsersAdmin } from '@/action/admin.action';
import { Loader2 } from 'lucide-react';

export const metadata = {
  title: 'إدارة المستخدمين | لوحة التحكم',
  description: 'عرض وإدارة مستخدمي وموظفي سوق حورس',
};

async function UsersContent() {
  const users = await getAllUsersAdmin();
  return <UsersManager initialUsers={users ?? []} />;
}

function UsersLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-slate-500">
      <Loader2 className="w-8 h-8 animate-spin text-[#D49B35]" />
      <p className="text-sm font-semibold">جاري تحميل المستخدمين...</p>
    </div>
  );
}

export default function UsersPage() {
  return (
    <Suspense fallback={<UsersLoading />}>
      <UsersContent />
    </Suspense>
  );
}
