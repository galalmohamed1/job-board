'use client';

import React, { useState, useRef, useTransition, useMemo } from 'react';
import {
  Plus, Package, Upload, X, Check, AlertCircle, Loader2,
  Search, Trash2, RefreshCw, Image as ImageIcon, ChevronDown,
  Pencil,
} from 'lucide-react';
import {
  createProduct,
  updateProduct,
  getAllProductsAdmin,
  deleteProduct,
  getCategoriesAdmin,
  getSubCategoriesAdmin,
  getDetailsSubCategoriesAdmin,
} from '@/action/admin.action';
import { Product, SubCategory } from '@/types/product';
import { Category, DetailsSubCategory } from '@/types/category';

type Toast = { type: 'success' | 'error'; message: string } | null;

const API_ORIGIN = process.env.NEXT_PUBLIC_API_ORIGIN ?? '';
const imgSrc = (url?: string) => !url ? '' : url.startsWith('http') || url.startsWith('data:') ? url : `${API_ORIGIN}${url}`;

const emptyForm = {
  title: '', description: '', price: '', discountPrice: '', stock: '',
  category: '', subCategory: '', detailsSubCategory: '',
};

// يرجّع الـ id سواء القيمة string أو populated object
const idOf = (v: unknown): string =>
  !v ? '' : typeof v === 'string' ? v : (v as { _id?: string })._id ?? '';

type Props = {
  Products: Product[];
  Categories: Category[];
  Subcategories: SubCategory[];
  Details: DetailsSubCategory[];
};

export default function ProductsManager({
  Products,
  Categories,
  Subcategories,
  Details,
}: Props) {
  const [activeTab, setActiveTab] = useState<'list' | 'add' | 'edit'>('list');
  const [products, setProducts] = useState<Product[]>(Products);
  const [categories, setCategories] = useState<Category[]>(Categories);
  const [subcategories, setSubcategories] = useState<SubCategory[]>(Subcategories);
  const [detailsSubCategories, setDetailsSubCategories] = useState<DetailsSubCategory[]>(Details);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<Toast>(null);
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [form, setForm] = useState(emptyForm);
  const [images, setImages] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [sizesInput, setSizesInput] = useState('');
  const [colorsInput, setColorsInput] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const isEdit = activeTab === 'edit';

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchData = async () => {
    setLoading(true);
    const [prods, cats, subs, det] = await Promise.all([
      getAllProductsAdmin(),
      getCategoriesAdmin(),
      getSubCategoriesAdmin(),
      getDetailsSubCategoriesAdmin(),
    ]);
    setProducts(prods ?? []);
    setCategories(cats ?? []);
    setSubcategories(subs ?? []);
    setDetailsSubCategories(det ?? []);
    setLoading(false);
  };

  const resetForm = () => {
    setForm(emptyForm);
    setImages([]);
    setExistingImages([]);
    setSizesInput('');
    setColorsInput('');
    setEditingProduct(null);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      title: product.title ?? '',
      description: product.description ?? '',
      price: String(product.price ?? ''),
      discountPrice: product.discountPrice ? String(product.discountPrice) : '',
      stock: String(product.stock ?? ''),
      category: idOf(product.category),
      subCategory: idOf(product.subcategory),
      detailsSubCategory: idOf(product.detailsSubCategory),
    });
    setSizesInput((product.sizes ?? []).join(', '));
    setColorsInput((product.colors ?? []).join(', '));
    setExistingImages((product.images ?? []).map((i) => i.secure_url));
    setImages([]);
    setActiveTab('edit');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => setImages((prev) => [...prev, ev.target?.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.price || !form.stock) {
      showToast('error', 'يرجى ملء الحقول المطلوبة (الاسم، السعر، المخزون)');
      return;
    }
    const target = isEdit ? editingProduct : null;

    startTransition(async () => {
      const payload = {
        title: form.title,
        description: form.description,
        price: form.price,
        stock: form.stock,
        discountPrice: form.discountPrice || undefined,
        category: form.category || undefined,
        subCategory: form.subCategory || undefined,
        detailsSubCategory: form.detailsSubCategory || undefined,
        sizes: sizesInput ? sizesInput.split(',').map((s) => s.trim()).filter(Boolean) : [],
        colors: colorsInput ? colorsInput.split(',').map((c) => c.trim()).filter(Boolean) : [],
        images: images.length ? images : undefined, // الصور الجديدة بس
      };

      const result = target
        ? await updateProduct(target._id, payload)
        : await createProduct(payload);

      if (result.success) {
        showToast('success', target ? 'تم تحديث المنتج ✓' : 'تم إضافة المنتج بنجاح ✓');
        resetForm();
        setActiveTab('list');
        fetchData();
      } else {
        showToast('error', result.message ?? 'حدث خطأ');
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
    setDeletingId(id);
    const ok = await deleteProduct(id);
    setDeletingId(null);
    if (ok) {
      showToast('success', 'تم حذف المنتج');
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } else {
      showToast('error', 'فشل حذف المنتج');
    }
  };

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return products.filter((p) => !q || (p.title ?? '').toLowerCase().includes(q));
  }, [products, searchQuery]);

  const getProductCategory = (product: Product) => {
    const cat = product.category;
    if (!cat) return '—';
    if (typeof cat === 'string') return categories.find((c) => c._id === cat)?.title ?? '—';
    return cat.title ?? categories.find((c) => c._id === cat._id)?.title ?? '—';
  };

  const inputClass =
    'w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-[#D49B35] focus:ring-1 focus:ring-[#D49B35]/30 transition-colors placeholder:text-slate-400';
  const labelClass = 'block text-xs font-bold text-slate-600 mb-1.5';
  const chevron = (
    <ChevronDown className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
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
        <button onClick={fetchData} className="p-2 text-slate-500 hover:text-[#D49B35] hover:bg-slate-100 rounded-lg transition-colors" title="تحديث">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-[#D49B35]" />
          <h1 className="text-xl font-black text-slate-800">إدارة المنتجات</h1>
        </div>
      </div>

      <div className="flex gap-2 bg-slate-100 p-1 rounded-xl w-fit mr-auto">
        <button
          onClick={() => { resetForm(); setActiveTab('add'); }}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab !== 'list' ? 'bg-[#D49B35] text-white shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
        >
          <Plus className="w-3.5 h-3.5" /> {isEdit ? 'تعديل منتج' : 'إضافة منتج'}
        </button>
        <button
          onClick={() => { resetForm(); setActiveTab('list'); }}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'list' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
        >
          قائمة المنتجات ({products.length})
        </button>
      </div>

      {(activeTab === 'add' || activeTab === 'edit') && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-base font-black text-slate-800">{isEdit ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h2>
            <p className="text-slate-500 text-xs mt-0.5">
              {isEdit ? `تعديل: ${editingProduct?.title ?? ''}` : 'أدخل بيانات المنتج الجديد بشكل كامل'}
            </p>
          </div>
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className={labelClass}>اسم المنتج *</label>
              <input className={inputClass} placeholder="أدخل اسم المنتج" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>وصف المنتج</label>
              <textarea className={`${inputClass} resize-none`} rows={3} placeholder="أدخل وصفاً تفصيلياً للمنتج" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>

            <div>
              <label className={labelClass}>السعر (EGP) *</label>
              <input type="number" className={inputClass} placeholder="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required min="0" />
            </div>

            <div>
              <label className={labelClass}>السعر بعد الخصم (اختياري)</label>
              <input type="number" className={inputClass} placeholder="0" value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} min="0" />
            </div>

            <div>
              <label className={labelClass}>المخزون *</label>
              <input type="number" className={inputClass} placeholder="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required min="0" />
            </div>

            <div>
              <label className={labelClass}>القسم الرئيسي</label>
              <div className="relative">
                <select className={`${inputClass} appearance-none pr-3 pl-8`} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value, subCategory: '', detailsSubCategory: '' })}>
                  <option value="">اختر القسم</option>
                  {categories.map((c) => <option key={c._id} value={c._id}>{c.title}</option>)}
                </select>
                {chevron}
              </div>
            </div>

            <div>
              <label className={labelClass}>القسم الفرعي</label>
              <div className="relative">
                <select className={`${inputClass} appearance-none pr-3 pl-8`} value={form.subCategory} onChange={(e) => setForm({ ...form, subCategory: e.target.value, detailsSubCategory: '' })}>
                  <option value="">اختر القسم الفرعي</option>
                  {subcategories
                    .filter((s) => {
                      if (!form.category) return true;
                      const cat = s.category;
                      if (!cat) return false;
                      return typeof cat === 'string' ? cat === form.category : cat._id === form.category;
                    })
                    .map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
                {chevron}
              </div>
            </div>

            <div>
              <label className={labelClass}>تفاصيل القسم الفرعي</label>
              <div className="relative">
                <select className={`${inputClass} appearance-none pr-3 pl-8`} value={form.detailsSubCategory} onChange={(e) => setForm({ ...form, detailsSubCategory: e.target.value })} disabled={!form.subCategory}>
                  <option value="">{form.subCategory ? 'اختر تفاصيل القسم الفرعي' : 'اختر القسم الفرعي أولاً'}</option>
                  {detailsSubCategories
                    .filter((d) => idOf(d.subcategory) === form.subCategory)
                    .map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
                </select>
                {chevron}
              </div>
            </div>

            <div>
              <label className={labelClass}>المقاسات (مفصولة بفواصل)</label>
              <input className={inputClass} placeholder="S, M, L, XL" value={sizesInput} onChange={(e) => setSizesInput(e.target.value)} />
            </div>

            <div>
              <label className={labelClass}>الألوان (مفصولة بفواصل)</label>
              <input className={inputClass} placeholder="أحمر, أزرق, أسود" value={colorsInput} onChange={(e) => setColorsInput(e.target.value)} />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>صور المنتج</label>

              {isEdit && existingImages.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-slate-500 mb-2">الصور الحالية (رفع صور جديدة هيستبدلها)</p>
                  <div className="flex flex-wrap gap-3">
                    {existingImages.map((src, i) => (
                      <div key={i} className="w-20 h-20 rounded-xl overflow-hidden border border-slate-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed border-slate-200 hover:border-[#D49B35] rounded-xl p-6 text-center cursor-pointer transition-colors group">
                <Upload className="w-8 h-8 text-slate-300 group-hover:text-[#D49B35] mx-auto mb-2 transition-colors" />
                <p className="text-sm text-slate-500 group-hover:text-slate-700 transition-colors">انقر لرفع الصور</p>
                <p className="text-xs text-slate-400 mt-1">PNG, JPG حتى 10MB</p>
              </div>
              <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
              {images.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-3">
                  {images.map((img, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 shadow-xs group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-start gap-3">
            <button type="button" onClick={() => { resetForm(); setActiveTab('list'); }} className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-bold transition-colors">إلغاء</button>
            <button type="submit" disabled={isPending} className="flex items-center gap-2 px-6 py-2.5 bg-[#D49B35] hover:bg-[#C28B2B] active:scale-95 text-white rounded-xl text-sm font-bold shadow-sm transition-all disabled:opacity-60">
              {isPending
                ? <><Loader2 className="w-4 h-4 animate-spin" /> جاري الحفظ...</>
                : <><Plus className="w-4 h-4" /> {isEdit ? 'حفظ التعديلات' : 'إضافة المنتج'}</>}
            </button>
          </div>
        </form>
      )}

      {activeTab === 'list' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input className="w-full pr-9 pl-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#D49B35] transition-colors placeholder:text-slate-400" placeholder="ابحث عن منتج..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <span className="text-xs text-slate-400 font-medium shrink-0">{filtered.length} منتج</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#D49B35]" /></div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Package className="w-12 h-12 text-slate-200 mb-3" />
              <p className="text-slate-500 font-bold text-sm">لا توجد منتجات</p>
              <p className="text-slate-400 text-xs mt-1">ابدأ بإضافة منتجك الأول</p>
              <button onClick={() => { resetForm(); setActiveTab('add'); }} className="mt-4 flex items-center gap-1.5 px-4 py-2 bg-[#D49B35] text-white rounded-xl text-xs font-bold shadow-sm hover:bg-[#C28B2B] transition-colors">
                <Plus className="w-3.5 h-3.5" /> إضافة منتج
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="px-4 py-3 text-right font-bold text-slate-600 text-xs">المنتج</th>
                    <th className="px-4 py-3 text-right font-bold text-slate-600 text-xs whitespace-nowrap">السعر</th>
                    <th className="px-4 py-3 text-right font-bold text-slate-600 text-xs whitespace-nowrap">المخزون</th>
                    <th className="px-4 py-3 text-right font-bold text-slate-600 text-xs whitespace-nowrap">القسم</th>
                    <th className="px-4 py-3 text-right font-bold text-slate-600 text-xs whitespace-nowrap">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((product) => (
                    <tr key={product._id} className="border-b border-slate-50 hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
                            {product.images?.[0]?.secure_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={product.images[0].secure_url} alt={product.title} className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-xs line-clamp-1">{product.title}</p>
                            <p className="text-slate-400 text-[10px] line-clamp-1 mt-0.5">{product.description?.slice(0, 40)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {product.discountPrice != null && product.discountPrice > 0 && product.discountPrice < product.price ? (
                            <>
                            <p className="font-black text-[#0B2545] text-xs whitespace-nowrap">
                                {product.discountPrice.toLocaleString()} EGP
                            </p>
                            <p className="text-slate-400 text-[10px] line-through">
                                {product.price?.toLocaleString()}
                            </p>
                            </>
                        ) : (
                            <p className="font-black text-[#0B2545] text-xs whitespace-nowrap">
                            {product.price?.toLocaleString()} EGP
                            </p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${product.stock > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                          {product.stock > 0 ? `${product.stock} وحدة` : 'نفذ المخزون'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{getProductCategory(product)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => openEdit(product)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="تعديل"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            disabled={deletingId === product._id}
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="حذف"
                          >
                            {deletingId === product._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
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