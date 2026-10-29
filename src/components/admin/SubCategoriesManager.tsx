'use client';

import React, { useState, useEffect, useTransition } from 'react';
import {
  Plus,
  Layers,
  Check,
  AlertCircle,
  Loader2,
  Search,
  Trash2,
  RefreshCw,
  Pencil,
  ChevronDown,
} from 'lucide-react';
import {
  createSubCategory,
  getSubCategoriesAdmin,
  deleteSubCategory,
  updateSubCategory,
  getCategoriesAdmin,
} from '@/action/admin.action';
import { SubCategory } from '@/types/product';
import { Category } from '@/types/category';

type Toast = { type: 'success' | 'error'; message: string } | null;

export default function SubCategoriesManager() {
  const [activeTab, setActiveTab] = useState<'list' | 'add' | 'edit'>('list');
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<Toast>(null);
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<SubCategory | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchData = async () => {
    setLoading(true);
    const [subs, cats] = await Promise.all([getSubCategoriesAdmin(), getCategoriesAdmin()]);
    setSubcategories(subs ?? []);
    setCategories(cats ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setName('');
    setCategoryId('');
    setEditingItem(null);
  };

  const openEdit = (item: SubCategory) => {
    setEditingItem(item);
    setName(item.name);
    setCategoryId(
      typeof item.category === 'string'
        ? item.category
        : item.category?._id ?? ''
    );
    setActiveTab('edit');
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('error', 'يرجى إدخال اسم القسم الفرعي');
      return;
    }
    if (!categoryId) {
      showToast('error', 'يرجى اختيار القسم الرئيسي');
      return;
    }
    startTransition(async () => {
      const result = await createSubCategory({ name, category: categoryId });
      if (result.success) {
        showToast('success', 'تم إضافة القسم الفرعي بنجاح ✓');
        resetForm();
        setActiveTab('list');
        fetchData();
      } else {
        showToast('error', result.message ?? 'فشل إضافة القسم الفرعي');
      }
    });
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !name.trim()) return;
    if (!categoryId) {
      showToast('error', 'يرجى اختيار القسم الرئيسي');
      return;
    }
    startTransition(async () => {
      const result = await updateSubCategory(editingItem._id, {
        name,
        category: categoryId,
      });
      if (result.success) {
        showToast('success', 'تم تحديث القسم الفرعي ✓');
        resetForm();
        setActiveTab('list');
        fetchData();
      } else {
        showToast('error', result.message ?? 'فشل التحديث');
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من الحذف؟')) return;
    setDeletingId(id);
    const result = await deleteSubCategory(id);
    setDeletingId(null);
    if (result.success) {
      showToast('success', 'تم الحذف بنجاح');
      setSubcategories((prev) => prev.filter((s) => s._id !== id));
    } else {
      showToast('error', result.message ?? 'فشل الحذف');
    }
  };

  const filtered = subcategories.filter((s) =>
    s.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryName = (sub: SubCategory) => {
    const cat = sub.category;
    if (!cat) return '—';

    // لو جاية string (ID بس)
    if (typeof cat === 'string') {
      return categories.find((c) => c._id === cat)?.title ?? '—';
    }

    // لو جاية populated object
    return (
      cat.title ??
      cat.name ??
      categories.find((c) => c._id === cat._id)?.title ??
      '—'
    );
  };

  const inputClass =
    'w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-[#D49B35] focus:ring-1 focus:ring-[#D49B35]/30 transition-colors placeholder:text-slate-400';
  const labelClass = 'block text-xs font-bold text-slate-600 mb-1.5';

  const SubCategoryForm = ({ isEdit }: { isEdit: boolean }) => (
    <form
      onSubmit={isEdit ? handleEdit : handleAdd}
      className="bg-white rounded-2xl border border-slate-200 shadow-xs"
    >
      <div className="px-5 py-4 border-b border-slate-100">
        <h2 className="text-base font-black text-slate-800">
          {isEdit ? 'تعديل القسم الفرعي' : 'إضافة قسم فرعي جديد'}
        </h2>
        <p className="text-slate-500 text-xs mt-0.5">
          {isEdit
            ? `تعديل: ${editingItem?.name}`
            : 'أنشئ قسماً فرعياً مرتبطاً بقسم رئيسي'}
        </p>
      </div>
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>اسم القسم الفرعي *</label>
          <input
            className={inputClass}
            placeholder="مثال: هواتف ذكية"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className={labelClass}>القسم الرئيسي *</label>
          <div className="relative">
            <select
              required
              className={`${inputClass} appearance-none pr-3 pl-8`}
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="" disabled>
                اختر القسم الرئيسي
              </option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.title}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>
      <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-start gap-3">
        <button
          type="button"
          onClick={() => {
            resetForm();
            setActiveTab('list');
          }}
          className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-bold transition-colors cursor-pointer"
        >
          إلغاء
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#D49B35] hover:bg-[#C28B2B] active:scale-95 text-white rounded-xl text-sm font-bold shadow-sm transition-all disabled:opacity-60 cursor-pointer"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          {isPending
            ? 'جاري الحفظ...'
            : isEdit
            ? 'حفظ التعديلات'
            : 'إضافة القسم الفرعي'}
        </button>
      </div>
    </form>
  );

  return (
    <div className="space-y-5 text-right font-sans" dir="rtl">
      {toast && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl text-sm font-bold ${
            toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
          }`}
        >
          {toast.type === 'success' ? (
            <Check className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          {toast.message}
        </div>
      )}

      <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#0B2545] to-[#134074] text-[#F3C053] flex items-center justify-center shadow-xs">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">إدارة الأقسام الفرعية</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              ربط الأقسام الفرعية بالأقسام الرئيسية وتنظيم شجرة المنتجات
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={fetchData}
          className="p-2 text-slate-500 hover:text-[#D49B35] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          title="تحديث"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="flex gap-2 bg-slate-100 p-1 rounded-xl w-fit mr-auto">
        <button
          type="button"
          onClick={() => {
            resetForm();
            setActiveTab('add');
          }}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab !== 'list'
              ? 'bg-[#D49B35] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          {activeTab === 'edit' ? 'تعديل' : 'إضافة قسم فرعي'}
        </button>
        <button
          type="button"
          onClick={() => {
            resetForm();
            setActiveTab('list');
          }}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'list'
              ? 'bg-white text-slate-800 shadow-sm'
              : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          القائمة ({subcategories.length})
        </button>
      </div>

      {activeTab === 'add' && <SubCategoryForm isEdit={false} />}
      {activeTab === 'edit' && <SubCategoryForm isEdit={true} />}

      {activeTab === 'list' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                className="w-full pr-9 pl-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#D49B35] transition-colors placeholder:text-slate-400"
                placeholder="ابحث عن قسم فرعي..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <span className="text-xs text-slate-400 font-medium shrink-0">
              {filtered.length} قسم
            </span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#D49B35]" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Layers className="w-12 h-12 text-slate-200 mb-3" />
              <p className="text-slate-500 font-bold text-sm">لا توجد أقسام فرعية</p>
              <button
                type="button"
                onClick={() => setActiveTab('add')}
                className="mt-4 flex items-center gap-1.5 px-4 py-2 bg-[#D49B35] text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> إضافة
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="px-4 py-3 text-right font-bold text-slate-600 text-xs">
                      اسم القسم الفرعي
                    </th>
                    <th className="px-4 py-3 text-right font-bold text-slate-600 text-xs">
                      القسم الرئيسي
                    </th>
                    <th className="px-4 py-3 text-right font-bold text-slate-600 text-xs">
                      الرابط (Slug)
                    </th>
                    <th className="px-4 py-3 text-right font-bold text-slate-600 text-xs">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((sub) => (
                    <tr
                      key={sub._id}
                      className="border-b border-slate-50 hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="px-4 py-3 font-bold text-slate-800 text-xs">
                        {sub.name}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">
                        {getCategoryName(sub)}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-400">
                        {sub.slug}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEdit(sub)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="تعديل"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(sub._id)}
                            disabled={deletingId === sub._id}
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="حذف"
                          >
                            {deletingId === sub._id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
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
