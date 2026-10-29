import { NextResponse } from 'next/server';
import { getAllProducts } from '../services/product.services';

export async function GET() {
  const products = await getAllProducts();
  if (!products) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
  return NextResponse.json({ data: products });
}
