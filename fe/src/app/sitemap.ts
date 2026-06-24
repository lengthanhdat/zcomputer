import { MetadataRoute } from 'next'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:5000";
const siteUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://zcomputer.vn';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let products = [];
  try {
    const res = await fetch(`${API_BASE}/api/products`);
    if (res.ok) {
      const parsed = await res.json();
      products = Array.isArray(parsed) ? parsed : (parsed.products || parsed.data || []);
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

  let news = [];
  try {
    const res = await fetch(`${API_BASE}/api/news`);
    if (res.ok) {
      const parsed = await res.json();
      news = Array.isArray(parsed) ? parsed : (parsed.data || []);
    }
  } catch (error) {
    console.error("Failed to fetch news for sitemap", error);
  }

  const newsUrls = news.map((article: any) => ({
    url: `${siteUrl}/tin-tuc/${article.slug}`,
    lastModified: article.updatedAt ? new Date(article.updatedAt) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
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

  return [...staticUrls, ...productUrls, ...newsUrls];
}
