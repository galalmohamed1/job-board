import ProductsData from "@/components/admin/ProductData";


export const metadata = {
  title: 'إدارة وإضافة المنتجات | لوحة الإدارة',
  description: 'إضافة وتعديل المنتجات وأسعارها ومخزونها',
};

export default function AdminProductsPage() {
  return <ProductsData />;
}