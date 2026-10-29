'use client';

import React from 'react';
import Link from 'next/link';
import {
  Package,
  Tag,
  Layers,
  ListTree,
  UserPlus,
  TrendingUp,
  ShoppingCart,
  Users,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Eye,
} from 'lucide-react';

const stats = [
  {
    label: 'إجمالي المنتجات',
    value: '248',
    change: '+12',
    changeType: 'up',
    icon: Package,
    color: 'bg-blue-50 text-blue-600',
    borderColor: 'border-blue-200',
  },
  {
    label: 'إجمالي الطلبات',
    value: '1,432',
    change: '+28',
    changeType: 'up',
    icon: ShoppingCart,
    color: 'bg-emerald-50 text-emerald-600',
    borderColor: 'border-emerald-200',
  },
  {
    label: 'العملاء المسجلين',
    value: '892',
    change: '+7',
    changeType: 'up',
    icon: Users,
    color: 'bg-purple-50 text-purple-600',
    borderColor: 'border-purple-200',
  },
  {
    label: 'الإيرادات (EGP)',
    value: '345,200',
    change: '-2.4%',
    changeType: 'down',
    icon: DollarSign,
    color: 'bg-amber-50 text-amber-600',
    borderColor: 'border-amber-200',
  },
];

const quickLinks = [
  {
    title: 'إضافة منتج جديد',
    description: 'أضف منتجاً جديداً مع صور وأسعار وبيانات كاملة',
    href: '/dashboard/products',
    icon: Package,
    color: 'from-blue-600 to-blue-700',
  },
  {
    title: 'إضافة قسم جديد',
    description: 'أنشئ قسماً رئيسياً لتنظيم المنتجات',
    href: '/dashboard/categories',
    icon: Tag,
    color: 'from-emerald-600 to-emerald-700',
  },
  {
    title: 'إضافة قسم فرعي',
    description: 'أضف أقساماً فرعية مرتبطة بالأقسام الرئيسية',
    href: '/dashboard/subcategories',
    icon: Layers,
    color: 'from-purple-600 to-purple-700',
  },
  {
    title: 'تفاصيل الأقسام',
    description: 'إدارة تفاصيل الأقسام الفرعية الدقيقة',
    href: '/dashboard/details-subcategory',
    icon: ListTree,
    color: 'from-rose-600 to-rose-700',
  },
  {
    title: 'إدارة المستخدمين',
    description: 'عرض ومتابعة كافة العملاء والمشرفين وفريق العمل',
    href: '/dashboard/users',
    icon: Users,
    color: 'from-cyan-600 to-cyan-700',
  },
  {
    title: 'إنشاء حساب موظف',
    description: 'أضف محاسباً أو مديراً أو موظف مبيعات',
    href: '/dashboard/create-account',
    icon: UserPlus,
    color: 'from-[#D49B35] to-[#B87B22]',
  },
];

const recentOrders = [
  { id: '#ORD-1201', customer: 'أحمد محمد', amount: '2,450 EGP', status: 'مكتمل', statusColor: 'bg-emerald-100 text-emerald-700' },
  { id: '#ORD-1200', customer: 'فاطمة علي', amount: '850 EGP', status: 'قيد التنفيذ', statusColor: 'bg-blue-100 text-blue-700' },
  { id: '#ORD-1199', customer: 'خالد إبراهيم', amount: '3,100 EGP', status: 'معلق', statusColor: 'bg-amber-100 text-amber-700' },
  { id: '#ORD-1198', customer: 'سارة حسن', amount: '720 EGP', status: 'مكتمل', statusColor: 'bg-emerald-100 text-emerald-700' },
  { id: '#ORD-1197', customer: 'محمود يوسف', amount: '1,900 EGP', status: 'ملغي', statusColor: 'bg-red-100 text-red-700' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800">
            مرحباً بك، مشرف! 👋
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            هذه نظرة عامة على نشاط متجرك اليوم
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-500 shadow-xs">
          <BarChart3 className="w-4 h-4 text-[#D49B35]" />
          <span>الثلاثاء، 28 أكتوبر 2026</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className={`bg-white rounded-2xl border ${stat.borderColor} p-4 shadow-xs hover:shadow-md transition-shadow`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className={`flex items-center gap-0.5 text-xs font-bold ${stat.changeType === 'up' ? 'text-emerald-600' : 'text-red-500'}`}>
                  {stat.changeType === 'up' ? (
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5" />
                  )}
                  {stat.change}
                </div>
              </div>
              <p className="text-2xl font-black text-slate-800 leading-none mb-1">
                {stat.value}
              </p>
              <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-base font-black text-slate-700 mb-3">الإجراءات السريعة</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="group bg-white rounded-2xl border border-slate-200 p-4 hover:shadow-md hover:border-[#D49B35]/50 transition-all duration-200"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${link.color} flex items-center justify-center mb-3 shadow-sm group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="font-bold text-slate-800 text-sm mb-1 group-hover:text-[#D49B35] transition-colors">
                  {link.title}
                </p>
                <p className="text-slate-500 text-xs leading-snug">{link.description}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Orders */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <Link href="/dashboard" className="text-xs font-bold text-[#D49B35] hover:underline flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            عرض الكل
          </Link>
          <h2 className="text-base font-black text-slate-700">أحدث الطلبات</h2>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-4 py-3 text-right font-bold text-slate-600 text-xs whitespace-nowrap">رقم الطلب</th>
                  <th className="px-4 py-3 text-right font-bold text-slate-600 text-xs whitespace-nowrap">العميل</th>
                  <th className="px-4 py-3 text-right font-bold text-slate-600 text-xs whitespace-nowrap">المبلغ</th>
                  <th className="px-4 py-3 text-right font-bold text-slate-600 text-xs whitespace-nowrap">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, idx) => (
                  <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{order.id}</td>
                    <td className="px-4 py-3 font-bold text-slate-700 text-xs">{order.customer}</td>
                    <td className="px-4 py-3 font-bold text-[#0B2545] text-xs">{order.amount}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${order.statusColor}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
