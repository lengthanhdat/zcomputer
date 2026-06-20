import CategoryClient from "@/components/CategoryClient";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tất cả sản phẩm | ZCOMPUTER",
  description: "Tổng hợp tất cả sản phẩm PC Gaming, Laptop, linh kiện máy tính cao cấp chính hãng tại ZCOMPUTER.",
};

export const revalidate = 0;

type Product = {
  _id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice?: number;
  images?: string[];
  specs?: Record<string, string>;
  brand?: string;
  condition?: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:5000";

async function getAllProducts(): Promise<Product[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);

  try {
    const res = await fetch(`${API_BASE}/api/products`, {
      next: { revalidate },
      signal: controller.signal,
    });

    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

export default async function AllProductsPage() {
  const products = await getAllProducts();
  
  return <CategoryClient initialProducts={products} categoryName="Tất cả sản phẩm" />;
}
