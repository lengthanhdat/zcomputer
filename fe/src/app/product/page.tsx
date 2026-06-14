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

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

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
