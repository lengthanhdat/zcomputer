import { MetadataRoute } from 'next'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:5000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://zcomputer.vn'; // Hoặc lấy từ biến môi trường nếu có

  // Fetch products
  let products = [];
  try {
    const res = await fetch(`${API_BASE}/api/products`, { next: { revalidate: 3600 } });
    if (res.ok) products = await res.json();
  } catch (err) {
    console.error("Failed to fetch products for sitemap");
  }

  // Fetch categories
  let categories = [];
  try {
    const res = await fetch(`${API_BASE}/api/categories`, { next: { revalidate: 3600 } });
    if (res.ok) categories = await res.json();
  } catch (err) {
    console.error("Failed to fetch categories for sitemap");
  }

  const productUrls = products.map((product: any) => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: new Date(product.updatedAt || new Date()),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  const categoryUrls = categories.map((cat: any) => ({
    url: `${baseUrl}/category/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.8,
    },
    ...categoryUrls,
    ...productUrls,
  ]
}
