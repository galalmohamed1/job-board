import ProductDetailPage  from '@/components/features/ProductComponents/ProductDetails'
import React from 'react'

type Props = {
    params: Promise<{ id: string }>;
}
async function page({params,}: Props) {
  const { id } = await params;
  return (
    <div>
      <ProductDetailPage id={id} />
    </div>
  )
}

export default page