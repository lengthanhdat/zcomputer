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
        openGraph: {
          title: data.title,
          description: data.summary,
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
  return <NewsDetailClient slug={resolvedParams.slug} />;
}
