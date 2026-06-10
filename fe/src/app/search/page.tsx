import Image from "next/image";
import Link from "next/link";
import { Filter, Search } from "lucide-react";

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

async function searchProducts(query: string): Promise<Product[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);

  try {
    const res = await fetch(`${API_BASE}/api/products?search=${encodeURIComponent(query)}&limit=100`, {
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

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedParams = await searchParams;
  const q = resolvedParams.q;
  const query = typeof q === 'string' ? q : '';
  
  const products = query ? await searchProducts(query) : [];

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-20">
      <div className="bg-primary text-white py-12 md:py-16 text-center">
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-4">
          Kết quả tìm kiếm
        </h1>
        <p className="text-red-100 font-medium max-w-2xl mx-auto px-4">
          {query ? `Hiển thị kết quả cho từ khóa: "${query}"` : "Vui lòng nhập từ khóa để tìm kiếm"}
        </p>
      </div>

      <div className="container mx-auto px-4 mt-8 flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
            <div className="flex items-center gap-2 font-bold text-gray-900 mb-6 uppercase tracking-wider pb-4 border-b border-gray-100">
              <Filter size={20} />
              <span>Bộ lọc</span>
            </div>
            <div className="text-sm text-gray-500 italic">Tính năng lọc đang được cập nhật...</div>
          </div>
        </div>

        <div className="w-full md:w-3/4">
          {products.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100 flex flex-col items-center justify-center">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6">
                <Search size={40} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy sản phẩm</h2>
              <p className="text-gray-500">Rất tiếc, chúng tôi không tìm thấy sản phẩm nào phù hợp với từ khóa "{query}". Vui lòng thử lại với từ khóa khác.</p>
            </div>
          ) : (
            <>
              <div className="mb-6 flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <span className="font-bold text-gray-800">Tìm thấy <span className="text-primary">{products.length}</span> sản phẩm</span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="flex-none bg-white rounded-2xl border border-gray-100 overflow-hidden group hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:border-primary/30 hover:-translate-y-1 transition-all duration-500 flex flex-col relative"
                  >
                    <div className="relative aspect-[4/3] p-6 flex items-center justify-center bg-gradient-to-b from-gray-50 to-white overflow-hidden">
                      <Link href={`/product/${product.slug}`} className="absolute inset-0 z-20"></Link>
                      
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"></div>

                      {product.images?.[0] && (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                          className="object-contain p-8 mix-blend-multiply group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500 relative z-10"
                          unoptimized
                        />
                      )}
                      
                      {product.discountPrice && product.discountPrice > product.price && (
                        <div className="absolute top-4 right-4 z-20">
                          <div className="bg-red-50 text-red-600 text-[10px] font-black px-2 py-1 rounded-lg border border-red-100 shadow-sm">
                            -{Math.round(((product.discountPrice - product.price) / product.discountPrice) * 100)}%
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-5 flex flex-col flex-1 bg-white relative z-10">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-[10px] font-black text-gray-500 tracking-widest uppercase bg-gray-100 px-2.5 py-1 rounded-md">{product.brand || "KHÁC"}</div>
                        {product.condition && (
                          <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">{product.condition}</div>
                        )}
                      </div>
                      <Link href={`/product/${product.slug}`} className="hover:text-primary transition-colors mt-auto">
                        <h3 className="font-bold text-gray-800 text-[15px] mb-4 line-clamp-2 leading-relaxed group-hover:text-primary transition-colors">{product.name}</h3>
                      </Link>
                      
                      <div className="pt-4 border-t border-gray-100/80 mt-auto">
                        <div className="flex flex-col gap-1">
                          {product.discountPrice && product.discountPrice > product.price && (
                            <span className="text-xs font-medium text-gray-400 line-through">{product.discountPrice.toLocaleString('vi-VN')}đ</span>
                          )}
                          <span className="text-xl font-black text-red-600">{product.price.toLocaleString('vi-VN')}đ</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
