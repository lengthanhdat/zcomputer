import NewsDetailClient from './NewsDetailClient';
import { Metadata } from 'next';
import { fetchApi } from '@/lib/api';

type Props = {
  params: Promise<{ slug: string }>
};

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  if (slug === "preview") {
    return { title: 'Xem trước bài viết | ZCOMPUTER' };
  }

  try {
    const res = await fetchApi(`/news/${slug}`);
    if (res.ok) {
      const data = await res.json();
      return {
        title: `${data.title} | ZCOMPUTER`,
        description: data.summary,
        alternates: {
          canonical: `${process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000'}/tin-tuc/${slug}`,
        },
        openGraph: {
          title: data.title,
          description: data.summary,
          url: `${process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000'}/tin-tuc/${slug}`,
          images: [data.thumbnail || ''],
        },
      };
    }
  } catch (error) {
    console.error(error);
  }

  // Fallback for mock data (SEO metadata requires real server fetch, so mock won't work well here for bots, but we provide a default)
  return {
    title: 'Chi tiết Tin Tức | ZCOMPUTER',
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  let article = null;

  if (slug !== "preview") {
    try {
      const res = await fetchApi(`/news/${slug}`);
      if (res.ok) {
        article = await res.json();
      }
    } catch (error) {
      console.error(error);
    }
  }

  const jsonLd = article ? {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.title,
    "image": [
      article.thumbnail ? (article.thumbnail.startsWith('http') ? article.thumbnail : `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:5000'}${article.thumbnail}`) : ''
    ],
    "datePublished": article.createdAt,
    "dateModified": article.updatedAt || article.createdAt,
    "author": [{
      "@type": "Person",
      "name": article.authorName || article.author?.name || "ZComputer",
      "url": `${process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000'}/ve-chung-toi`
    }]
  } : null;

  return (
    <>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      <NewsDetailClient slug={slug} initialArticle={article} />
    </>
  );
}
