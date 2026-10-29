'use client';

import React, { useState, useEffect, useTransition } from 'react';
import {
  Plus, ListTree, Check, AlertCircle, Loader2, Search,
  Trash2, RefreshCw, Pencil, ChevronDown,
} from 'lucide-react';
import {
  getCategoriesAdmin,
  getSubCategoriesAdmin,
  getDetailsSubCategoriesAdmin,
  createDetailsSubCategory,
  updateDetailsSubCategory,
  deleteDetailsSubCategory,
} from '@/action/admin.action';
import { Category, DetailsSubCategory } from '@/types/category';
import { SubCategory } from '@/types/product';

type Toast = { type: 'success' | 'error'; message: string } | null;

export default function DetailsSubCategoryManager() {
  const [activeTab, setActiveTab] = useState<'list' | 'add' | 'edit'>('list');
  const [items, setItems] = useState<DetailsSubCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<Toast>(null);
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<DetailsSubCategory | null>(null);

  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [subCategoryId, setSubCategoryId] = useState('');

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchData = async () => {
    setLoading(true);
    const [det, cats, subs] = await Promise.all([
      getDetailsSubCategoriesAdmin(),
      getCategoriesAdmin(),
      getSubCategoriesAdmin(),
    ]);
    setItems(det ?? []);
    setCategories(cats ?? []);
    setSubcategories(subs ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const resetForm = () => {
    setName('');
    setCategoryId('');
    setSubCategoryId('');
    setEditingItem(null);
  };

  const openEdit = (item: DetailsSubCategory) => {
  setEditingItem(item);
  setName(item.name);

  const sub = item.subcategory;
  const subId = typeof sub === 'string' ? sub : sub?._id ?? '';
  setSubCategoryId(subId);

  // القسم الرئيسي بييجي من الـ subcategory الكاملة في القائمة
  const fullSub = subcategories.find((s) => s._id === subId);
  const cat = fullSub?.category;
  setCategoryId(typeof cat === 'string' ? cat : cat?._id ?? '');

  setActiveTab('edit');
};

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { showToast('error', 'يرجى إدخال الاسم'); return; }
    if (!subCategoryId) { showToast('error', 'يرجى اختيار القسم الفرعي'); return; }
    startTransition(async () => {
      const result = await createDetailsSubCategory({
        name,
        category: categoryId || undefined,
        subcategory: subCategoryId,
      });
      if (result.success) {
        showToast('success', 'تم الإضافة بنجاح ✓');
        resetForm();
        setActiveTab('list');
        fetchData();
      } else {
        showToast('error', result.message ?? 'فشل الإضافة');
      }
    });
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !name.trim()) return;
    if (!subCategoryId) { showToast('error', 'يرجى اختيار القسم الفرعي'); return; }
    startTransition(async () => {
      const result = await updateDetailsSubCategory(editingItem._id, {
        name,
        category: categoryId || undefined,
        subcategory: subCategoryId,
      });
      if (result.success) {
        showToast('success', 'تم التحديث بنجاح ✓');
        resetForm();
        setActiveTab('list');
        fetchData();
      } else {
        showToast('error', result.message ?? 'فشل التحديث');
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('حذف هذا التفصيل؟')) return;
    setDeletingId(id);
    const result = await deleteDetailsSubCategory(id);
    setDeletingId(null);
    if (result.success) {
      showToast('success', 'تم الحذف');
      setItems((prev) => prev.filter((i) => i._id !== id));
    } else {
      showToast('error', result.message ?? 'فشل الحذف');
    }
  };

  const filtered = items.filter((i) =>
    i.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSubs = subcategories.filter((s) => {
    if (!categoryId) return true;
    const cat = s.category;
    if (!cat) return false;
    return typeof cat === 'string' ? cat === categoryId : cat._id === categoryId;
  });

  const getSubCategoryName = (item: DetailsSubCategory) => {
  const sub = item.subcategory;
  if (!sub) return '—';
  if (typeof sub === 'string') return subcategories.find((s) => s._id === sub)?.name ?? '—';
  return sub.name ?? subcategories.find((s) => s._id === sub._id)?.name ?? '—';
};

const getCategoryName = (item: DetailsSubCategory) => {
  const sub = item.subcategory;
  if (!sub) return '—';

  // نلاقي الـ subcategory الكاملة من القائمة
  const subId = typeof sub === 'string' ? sub : sub._id;
  const fullSub = subcategories.find((s) => s._id === subId);
  const cat = fullSub?.category;
  if (!cat) return '—';

  if (typeof cat === 'string') return categories.find((c) => c._id === cat)?.title ?? '—';
  return cat.title ?? categories.find((c) => c._id === cat._id)?.title ?? '—';
};

  const inputClass = 'w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-[#D49B35] focus:ring-1 focus:ring-[#D49B35]/30 transition-colors placeholder:text-slate-400';
  const labelClass = 'block text-xs font-bold text-slate-600 mb-1.5';

  // دالة عادية مش component، عشان الـ input ما يفقدش الـ focus مع كل حرف
  const renderForm = (isEdit: boolean) => (
    <form onSubmit={isEdit ? handleEdit : handleAdd} className="bg-white rounded-2xl border border-slate-200 shadow-xs">
      <div className="px-5 py-4 border-b border-slate-100">
        <h2 className="text-base font-black text-slate-800">{isEdit ? 'تعديل تفاصيل القسم' : 'إضافة تفاصيل قسم فرعي'}</h2>
        <p className="text-slate-500 text-xs mt-0.5">تخصيص بنية تصنيف المنتجات بشكل دقيق ومفصل</p>
      </div>
      <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-5">
        <div>
          <label className={labelClass}>الاسم *</label>
          <input
            className={inputClass}
            placeholder="مثال: شاشات OLED"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className={labelClass}>القسم الرئيسي</label>
          <div className="relative">
            <select
              className={`${inputClass} appearance-none pr-3 pl-8`}
              value={categoryId}
              onChange={(e) => { setCategoryId(e.target.value); setSubCategoryId(''); }}
            >
              <option value="">اختر القسم</option>
              {categories.map((c) => <option key={c._id} value={c._id}>{c.title}</option>)}
            </select>
            <ChevronDown className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <label className={labelClass}>القسم الفرعي *</label>
          <div className="relative">
            <select
              required
              className={`${inputClass} appearance-none pr-3 pl-8`}
              value={subCategoryId}
              onChange={(e) => setSubCategoryId(e.target.value)}
            >
              <option value="" disabled>اختر القسم الفرعي</option>
              {filteredSubs.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
            </select>
            <ChevronDown className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>
      <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-start gap-3">
        <button type="button" onClick={() => { resetForm(); setActiveTab('list'); }} className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-bold transition-colors">إلغاء</button>
        <button type="submit" disabled={isPending} className="flex items-center gap-2 px-6 py-2.5 bg-[#D49B35] hover:bg-[#C28B2B] active:scale-95 text-white rounded-xl text-sm font-bold shadow-sm transition-all disabled:opacity-60">
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          {isPending ? 'جاري الحفظ...' : isEdit ? 'حفظ التعديلات' : 'إضافة'}
        </button>
      </div>
    </form>
  );

  return (
    <div className="space-y-5 text-right" dir="rtl">
      {toast && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl text-sm font-bold ${toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
          {toast.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.message}
        </div>
      )}

      <div className="flex items-center justify-between">
        <button onClick={fetchData} className="p-2 text-slate-500 hover:text-[#D49B35] hover:bg-slate-100 rounded-lg transition-colors">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
        <div className="flex items-center gap-2">
          <ListTree className="w-5 h-5 text-[#D49B35]" />
          <h1 className="text-xl font-black text-slate-800">إدارة تفاصيل الأقسام</h1>
        </div>
      </div>

      <div className="flex gap-2 bg-slate-100 p-1 rounded-xl w-fit mr-auto">
        <button onClick={() => { resetForm(); setActiveTab('add'); }} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab !== 'list' ? 'bg-[#D49B35] text-white shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}>
          <Plus className="w-3.5 h-3.5" />
          {activeTab === 'edit' ? 'تعديل' : 'إضافة تفاصيل'}
        </button>
        <button onClick={() => { resetForm(); setActiveTab('list'); }} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'list' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}>
          القائمة ({items.length})
        </button>
      </div>

      {activeTab === 'add' && renderForm(false)}
      {activeTab === 'edit' && renderForm(true)}

      {activeTab === 'list' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                className="w-full pr-9 pl-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#D49B35] transition-colors placeholder:text-slate-400"
                placeholder="ابحث عن تفاصيل..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <span className="text-xs text-slate-400 font-medium shrink-0">{filtered.length} عنصر</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#D49B35]" /></div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <ListTree className="w-12 h-12 text-slate-200 mb-3" />
              <p className="text-slate-500 font-bold text-sm">لا توجد تفاصيل</p>
              <button onClick={() => setActiveTab('add')} className="mt-4 flex items-center gap-1.5 px-4 py-2 bg-[#D49B35] text-white rounded-xl text-xs font-bold shadow-sm">
                <Plus className="w-3.5 h-3.5" /> إضافة
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="px-4 py-3 text-right font-bold text-slate-600 text-xs">الاسم</th>
                    <th className="px-4 py-3 text-right font-bold text-slate-600 text-xs">القسم الرئيسي</th>
                    <th className="px-4 py-3 text-right font-bold text-slate-600 text-xs">القسم الفرعي</th>
                    <th className="px-4 py-3 text-right font-bold text-slate-600 text-xs">الرابط</th>
                    <th className="px-4 py-3 text-right font-bold text-slate-600 text-xs">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => (
                    <tr key={item._id} className="border-b border-slate-50 hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3 font-bold text-slate-800 text-xs">{item.name}</td>
                      <td className="px-4 py-3 text-xs text-slate-500">{getCategoryName(item)}</td>
                      <td className="px-4 py-3 text-xs text-slate-500">{getSubCategoryName(item)}</td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-400">{item.slug ?? '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => openEdit(item)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="تعديل">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(item._id)} disabled={deletingId === item._id} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="حذف">
                            {deletingId === item._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}