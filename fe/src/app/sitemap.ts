import { MetadataRoute } from 'next'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:5000";
const siteUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://zcomputer.vn';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let products = [];
  try {
    const res = await fetch(`${API_BASE}/api/products`);
    if (res.ok) {
      products = await res.json();
    }
  } catch (error) {
    console.error("Failed to fetch products for sitemap", error);
  }

  const productUrls = products.map((product: any) => ({
    url: `${siteUrl}/${product.slug}`,
    lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  const staticUrls = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${siteUrl}/ve-chung-toi`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${siteUrl}/chinh-sach-bao-mat`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${siteUrl}/chinh-sach-giao-hang`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
  ];

  return [...staticUrls, ...productUrls];
}
