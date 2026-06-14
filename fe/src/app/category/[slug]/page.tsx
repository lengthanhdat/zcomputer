import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Filter } from "lucide-react";

import CategoryClient from "@/components/CategoryClient";

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

async function getProducts(categorySlug: string): Promise<Product[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);

  try {
    const res = await fetch(`${API_BASE}/api/products?category=${categorySlug}`, {
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

async function getCategoryName(categorySlug: string): Promise<string> {
  try {
    const res = await fetch(`${API_BASE}/api/categories`);
    if (res.ok) {
      const categories = await res.json();
      const cat = categories.find((c: any) => c.slug === categorySlug);
      return cat ? cat.name : "Sản phẩm";
    }
  } catch (error) {
    console.error("Failed to fetch category name:", error);
  }
  return "Sản phẩm";
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const categoryName = await getCategoryName(resolvedParams.slug);

  return {
    title: `${categoryName} chính hãng, giá tốt | ZCOMPUTER`,
    description: `Mua ${categoryName} tại ZCOMPUTER với giá tốt nhất thị trường, cam kết chính hãng 100%, bảo hành uy tín, giao hàng toàn quốc.`,
    openGraph: {
      title: `${categoryName} | ZCOMPUTER`,
      description: `Khám phá các sản phẩm ${categoryName} chất lượng cao tại ZCOMPUTER.`,
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const categorySlug = resolvedParams.slug;
  
  const products = await getProducts(categorySlug);
  const categoryName = await getCategoryName(categorySlug);
  
  return <CategoryClient initialProducts={products} categoryName={categoryName} />;
}
