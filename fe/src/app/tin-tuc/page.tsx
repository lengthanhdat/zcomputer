import { Metadata } from 'next';
import NewsClient from '@/components/NewsClient';

export const metadata: Metadata = {
  title: 'Tin Tức Công Nghệ | ZCOMPUTER',
  description: 'Cập nhật những xu hướng công nghệ mới nhất, tin tức khuyến mãi, đánh giá sản phẩm và các thủ thuật máy tính hữu ích từ ZCOMPUTER.',
  openGraph: {
    title: 'Tin Tức Công Nghệ | ZCOMPUTER',
    description: 'Cập nhật những xu hướng công nghệ mới nhất, tin tức khuyến mãi, đánh giá sản phẩm và các thủ thuật máy tính hữu ích từ ZCOMPUTER.',
    type: 'website',
    url: '/tin-tuc',
  }
};

export default function NewsPage() {
  return <NewsClient />;
}
