import Image from "next/image";
import Link from "next/link";
import { Filter } from "lucide-react";

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

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const categorySlug = resolvedParams.slug;
  
  const products = await getProducts(categorySlug);
  const categoryName = await getCategoryName(categorySlug);
  
  const brands = Array.from(new Set(products.map(p => p.brand).filter(Boolean))) as string[];

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="text-sm text-gray-500 mb-6 flex gap-2">
          <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
          <span>/</span>
          <span className="text-gray-800 font-semibold">{categoryName}</span>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-64 bg-white p-5 rounded-lg border border-gray-200 h-fit">
            <div className="flex items-center gap-2 font-bold text-lg mb-4 border-b pb-2">
              <Filter size={20} /> Bộ lọc sản phẩm
            </div>

            {brands.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3 text-gray-800">Thương hiệu</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  {brands.map((brand) => (
                    <label key={brand} className="flex items-center gap-2 cursor-pointer hover:text-primary">
                      <input type="checkbox" className="accent-primary" /> {brand}
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <h3 className="font-semibold mb-3 text-gray-800">Mức giá</h3>
              <div className="space-y-2 text-sm text-gray-600">
                {["Dưới 15 triệu", "15 - 20 triệu", "20 - 30 triệu", "Trên 30 triệu"].map((price) => (
                  <label key={price} className="flex items-center gap-2 cursor-pointer hover:text-primary">
                    <input type="checkbox" className="accent-primary" /> {price}
                  </label>
                ))}
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6 flex justify-between items-center">
              <h1 className="text-xl font-bold text-gray-800">{categoryName} ({products.length} sản phẩm)</h1>
              <select className="border border-gray-300 rounded px-3 py-1 text-sm outline-none focus:border-primary" defaultValue="default">
                <option value="default">Sắp xếp: Mặc định</option>
                <option>Giá: Tăng dần</option>
                <option>Giá: Giảm dần</option>
                <option>Mới nhất</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.length > 0 ? (
                products.map((product) => {
                  const specArray = product.specs ? Object.values(product.specs) : [];

                  return (
                    <div key={product._id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all group flex flex-col h-full hover:border-primary/50">
                      <div className="relative h-48 bg-white">
                        {product.images?.[0] && (
                          <Image src={product.images[0]} alt={product.name} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-contain p-4 transition-transform group-hover:scale-105" unoptimized />
                        )}
                      </div>
                      <div className="p-4 flex flex-col flex-grow border-t border-gray-100">
                        {product.condition && (
                          <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200 w-fit mb-2 uppercase tracking-wide">
                            {product.condition}
                          </span>
                        )}
                        <h3 className="font-semibold text-gray-800 text-sm mb-3 line-clamp-2 hover:text-primary cursor-pointer leading-relaxed">
                          {product.name}
                        </h3>

                        <div className="flex flex-wrap gap-1 mb-4">
                          {specArray.map((spec, index) => (
                            <span key={`${spec}-${index}`} className="bg-gray-100 text-gray-600 text-[11px] px-2 py-1 rounded border border-gray-200">
                              {spec}
                            </span>
                          ))}
                        </div>

                        <div className="mt-auto">
                          <div className="text-primary font-black text-lg">{product.price.toLocaleString("vi-VN")}đ</div>
                          {product.discountPrice && <div className="text-gray-400 text-sm line-through">{product.discountPrice.toLocaleString("vi-VN")}đ</div>}
                        </div>

                        <Link href={`/product/${product.slug}`} className="w-full mt-4 bg-white border border-primary text-primary py-2 rounded-md font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-colors">
                          Xem chi tiết
                        </Link>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full py-12 text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-2xl bg-white">
                  Chưa có sản phẩm {categoryName} nào trong hệ thống.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
