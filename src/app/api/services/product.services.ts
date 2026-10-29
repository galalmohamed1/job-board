import { Product, ProductsResponse } from "@/types/product";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://tasweeq-six.vercel.app/api";

export async function getAllProducts(): Promise<Product[] | undefined> {
  try {
    const res = await fetch(`${BASE_URL}/products`);
    const data: ProductsResponse = await res.json();
    return data.products;
  } catch {
    return undefined;
  }
}

export async function getSingelProduct(slug: string): Promise<Product> {
  try {
    const res = await fetch(`${BASE_URL}/products/${slug}`);
    const data: Product = await res.json();
    return data;
  } catch (error) {
    throw new Error("Failed to fetch Product");
  }
}
