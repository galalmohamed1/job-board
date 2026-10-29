import ProductDetailPage from '@/components/features/ProductComponents/ProductDetails';
import React, { Suspense } from 'react';

type Props = {
  params: Promise<{ id?: string; slug?: string }>;
};

async function ProductDetailsLoader({ params }: Props) {
  const resolved = await params;
  const identifier = resolved.id || resolved.slug || '';
  return <ProductDetailPage id={identifier} slug={identifier} />;
}

export default function Page({ params }: Props) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC]" />}>
      <ProductDetailsLoader params={params} />
    </Suspense>
  );
}