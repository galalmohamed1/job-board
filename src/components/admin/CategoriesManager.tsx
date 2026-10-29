'use client';

import React, { useState, useRef, useEffect, useTransition } from 'react';
import {
  Plus,
  Tag,
  Upload,
  Check,
  AlertCircle,
  Loader2,
  Search,
  Trash2,
  RefreshCw,
  Image as ImageIcon,
  Pencil,
} from 'lucide-react';
import {
  createCategory,
  getCategoriesAdmin,
  deleteCategory,
  updateCategory,
} from '@/action/admin.action';
import { Category } from '@/types/category';

type Toast = { type: 'success' | 'error'; message: string } | null;

export default function CategoriesManager() {
  const [activeTab, setActiveTab] = useState<'list' | 'add' | 'edit'>('list');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<Toast>(null);
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const API_ORIGIN = process.env.NEXT_PUBLIC_API_ORIGIN;

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchData = async () => {
    setLoading(true);
    const cats = await getCategoriesAdmin();
    setCategories(cats ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setImageBase64(null);
    setEditingCategory(null);
  };

  const openEdit = (cat: Category) => {
    setEditingCategory(cat);
    setTitle(cat.title);
    setDescription(cat.description || '');
    setImageBase64(null);
    setActiveTab('edit');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImageBase64(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const buildFormData = () => {
    const fd = new FormData();
    fd.append('title', title);
    fd.append('description', description);
    fd.append('slug', title.toLowerCase());
    if (imageBase64) {
      const mimeMatch = imageBase64.match(/data:([^;]+);base64,/);
      const mime = mimeMatch?.[1] ?? 'image/jpeg';
      const ext = mime.split('/')[1] ?? 'jpg';
      const byteStr = atob(imageBase64.split(',')[1]);
      const bytes = new Uint8Array(byteStr.length);
      for (let i = 0; i < byteStr.length; i++) bytes[i] = byteStr.charCodeAt(i);
      fd.append('uploads', new Blob([bytes], { type: mime }), `category.${ext}`);
    }
    return fd;
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('error', 'يرجى إدخال اسم القسم');
      return;
    }
    startTransition(async () => {
      const result = await createCategory(buildFormData());
      if (result.success) {
        showToast('success', 'تم إضافة القسم بنجاح ✓');
        resetForm();
        setActiveTab('list');
        fetchData();
      } else {
        showToast('error', result.message ?? 'فشل إضافة القسم');
      }
    });
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !title.trim()) return;
    startTransition(async () => {
      const result = await updateCategory(editingCategory._id, buildFormData());
      if (result.success) {
        showToast('success', 'تم تحديث القسم بنجاح ✓');
        resetForm();
        setActiveTab('list');
        fetchData();
      } else {
        showToast('error', result.message ?? 'فشل تحديث القسم');
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا القسم؟')) return;
    setDeletingId(id);
    const result = await deleteCategory(id);
    setDeletingId(null);
    if (result.success) {
      showToast('success', 'تم حذف القسم');
      setCategories((prev) => prev.filter((c) => c._id !== id));
    } else {
      showToast('error', result.message ?? 'فشل الحذف');
    }
  };

  const filtered = categories.filter((c) =>
    c.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const inputClass =
    'w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-[#D49B35] focus:ring-1 focus:ring-[#D49B35]/30 transition-colors placeholder:text-slate-400';
  const labelClass = 'block text-xs font-bold text-slate-600 mb-1.5';

  // دالة عادية بترجع JSX (مش component) عشان الـ inputs ما تفقدش الفوكس
  const renderForm = (isEdit: boolean) => (
    <form
      onSubmit={isEdit ? handleEdit : handleAdd}
      className="bg-white rounded-2xl border border-slate-200 shadow-xs"
    >
      <div className="px-5 py-4 border-b border-slate-100">
        <h2 className="text-base font-black text-slate-800">
          {isEdit ? 'تعديل القسم' : 'إضافة قسم جديد'}
        </h2>
        <p className="text-slate-500 text-xs mt-0.5">
          {isEdit
            ? `تعديل بيانات: ${editingCategory?.title}`
            : 'أنشئ قسماً رئيسياً جديداً لتنظيم المنتجات'}
        </p>
      </div>
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <label className={labelClass}>اسم القسم *</label>
          <input
            className={inputClass}
            placeholder="مثال: إلكترونيات"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className={labelClass}>وصف القسم</label>
          <textarea
            className={`${inputClass} resize-none`}
            rows={3}
            placeholder="أدخل وصفاً مختصراً للقسم"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <label className={labelClass}>صورة القسم</label>
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-slate-200 hover:border-[#D49B35] rounded-xl p-6 text-center cursor-pointer transition-colors group"
          >
            {imageBase64 ? (
              <div className="flex items-center justify-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageBase64} alt="" className="w-16 h-16 rounded-xl object-cover" />
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-700">تم رفع الصورة</p>
                  <p className="text-xs text-slate-400 mt-1">انقر للتغيير</p>
                </div>
              </div>
            ) : (
              <>
                <Upload className="w-8 h-8 text-slate-300 group-hover:text-[#D49B35] mx-auto mb-2 transition-colors" />
                <p className="text-sm text-slate-500 group-hover:text-slate-700">انقر لرفع صورة القسم</p>
                <p className="text-xs text-slate-400 mt-1">PNG, JPG</p>
              </>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
        </div>
      </div>
      <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-start gap-3">
        <button
          type="button"
          onClick={() => {
            resetForm();
            setActiveTab('list');
          }}
          className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-bold transition-colors"
        >
          إلغاء
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#D49B35] hover:bg-[#C28B2B] active:scale-95 text-white rounded-xl text-sm font-bold shadow-sm transition-all disabled:opacity-60"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          {isPending ? 'جاري الحفظ...' : isEdit ? 'حفظ التعديلات' : 'إضافة القسم'}
        </button>
      </div>
    </form>
  );

  return (
    <div className="space-y-5 text-right" dir="rtl">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl text-sm font-bold transition-all ${
            toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
          }`}
        >
          {toast.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.message}
        </div>
      )}

      <div className="flex items-center justify-between">
        <button
          onClick={fetchData}
          className="p-2 text-slate-500 hover:text-[#D49B35] hover:bg-slate-100 rounded-lg transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
        <div className="flex items-center gap-2">
          <Tag className="w-5 h-5 text-[#D49B35]" />
          <h1 className="text-xl font-black text-slate-800">إدارة الأقسام</h1>
        </div>
      </div>

      <div className="flex gap-2 bg-slate-100 p-1 rounded-xl w-fit mr-auto">
        <button
          onClick={() => {
            resetForm();
            setActiveTab('add');
          }}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'add' || activeTab === 'edit'
              ? 'bg-[#D49B35] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          {activeTab === 'edit' ? 'تعديل قسم' : 'إضافة قسم'}
        </button>
        <button
          onClick={() => {
            resetForm();
            setActiveTab('list');
          }}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'list' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          قائمة الأقسام ({categories.length})
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
                placeholder="ابحث عن قسم..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <span className="text-xs text-slate-400 font-medium shrink-0">{filtered.length} قسم</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#D49B35]" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Tag className="w-12 h-12 text-slate-200 mb-3" />
              <p className="text-slate-500 font-bold text-sm">لا توجد أقسام</p>
              <button
                onClick={() => setActiveTab('add')}
                className="mt-4 flex items-center gap-1.5 px-4 py-2 bg-[#D49B35] text-white rounded-xl text-xs font-bold shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" /> إضافة قسم
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
              {filtered.map((cat) => (
                <div
                  key={cat._id}
                  className="group bg-slate-50 rounded-xl border border-slate-200 hover:border-[#D49B35]/50 hover:shadow-md transition-all overflow-hidden"
                >
                  <div className="h-32 bg-slate-200 overflow-hidden relative">
                    {typeof cat.image === 'object' && cat.image && 'secure_url' in cat.image && cat.image.secure_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={`${API_ORIGIN}${cat.image.secure_url}`}
                            alt={cat.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-slate-300" />
                    </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="font-bold text-slate-800 text-sm mb-1">{cat.title}</p>
                    {cat.description && (
                      <p className="text-slate-500 text-xs line-clamp-2 leading-snug mb-3">{cat.description}</p>
                    )}
                    <div className="flex items-center justify-start gap-2">
                      <button
                        onClick={() => handleDelete(cat._id)}
                        disabled={deletingId === cat._id}
                        className="flex items-center gap-1 px-2.5 py-1.5 text-red-500 hover:bg-red-50 rounded-lg text-xs font-bold transition-colors"
                      >
                        {deletingId === cat._id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                        حذف
                      </button>
                      <button
                        onClick={() => openEdit(cat)}
                        className="flex items-center gap-1 px-2.5 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-bold transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        تعديل
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}