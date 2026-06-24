import Image from "next/image";
import Link from "next/link";
import { Filter, Search, Eye, Cpu, Monitor, Server, HardDrive, Maximize, ArrowRight, MemoryStick, Gpu, Battery, Layers, Zap, Keyboard, Mouse, Link as LinkIcon } from "lucide-react";
import BackButton from "@/components/BackButton";
import LikeButton from "@/components/LikeButton";

import { Metadata } from "next";

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
  isHotSale?: boolean;
  flashSalePrice?: number;
  stock?: number;
  status?: string;
  views?: number;
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

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const q = resolvedParams.q;
  const query = typeof q === 'string' ? q : '';

  return {
    title: query ? `Kết quả tìm kiếm cho "${query}" | ZCOMPUTER` : "Tìm kiếm sản phẩm | ZCOMPUTER",
    description: query ? `Tìm kiếm các sản phẩm PC Gaming, Laptop, linh kiện máy tính liên quan đến "${query}" tại ZCOMPUTER.` : "Tìm kiếm hàng ngàn sản phẩm PC Gaming, Laptop, linh kiện máy tính chính hãng tại ZCOMPUTER.",
    robots: {
      index: false,
      follow: true,
    }
  };
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedParams = await searchParams;
  const q = resolvedParams.q;
  const query = typeof q === 'string' ? q : '';
  
  // Read filter params
  const brandParam = resolvedParams.brand;
  const brands = brandParam ? (Array.isArray(brandParam) ? brandParam : [brandParam]) : [];
  
  const priceParam = resolvedParams.price_range;
  const priceRange = typeof priceParam === 'string' ? priceParam : null;

  const conditionParam = resolvedParams.condition;
  const conditions = conditionParam ? (Array.isArray(conditionParam) ? conditionParam : [conditionParam]) : [];

  let products = query ? await searchProducts(query) : [];

  // Filter Logic
  if (brands.length > 0) {
    products = products.filter(p => p.brand && brands.includes(p.brand.toUpperCase()));
  }

  if (priceRange) {
    if (priceRange === 'p1') products = products.filter(p => p.price < 10000000);
    else if (priceRange === 'p2') products = products.filter(p => p.price >= 10000000 && p.price < 20000000);
    else if (priceRange === 'p3') products = products.filter(p => p.price >= 20000000 && p.price <= 30000000);
    else if (priceRange === 'p4') products = products.filter(p => p.price > 30000000);
  }

  if (conditions.length > 0) {
    products = products.filter(p => p.condition && conditions.includes(p.condition));
  }

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-20 pt-8">
      <div className="container mx-auto px-4">
        <BackButton className="mb-4" />
      </div>
      <div className="container mx-auto px-4 flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4">
          {/* Tiêu đề ngắn gọn */}
          <div className="mb-6 px-2">
            <h1 className="text-2xl md:text-3xl font-black uppercase text-gray-900 tracking-tight">Kết quả tìm kiếm</h1>
            <p className="text-gray-500 text-sm mt-1">{query ? `Hiển thị cho từ khóa: "${query}"` : "Tất cả sản phẩm"}</p>
          </div>

          <form action="/search" method="GET" className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-32 relative overflow-hidden group">
            {query && <input type="hidden" name="q" value={query} />}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary"></div>
            <div className="flex items-center gap-2 font-black text-gray-900 mb-6 uppercase tracking-wider pb-4 border-b border-gray-100">
              <Filter size={20} className="text-primary" />
              <span>Bộ lọc sản phẩm</span>
            </div>
            
            {/* Filter by Brand - Only show if not searching by keyword */}
            {!query && (
              <div className="mb-6">
                <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase">Thương hiệu</h3>
                <div className="flex flex-col gap-2.5">
                  {['ASUS', 'MSI', 'GIGABYTE', 'DELL', 'HP', 'LENOVO', 'APPLE'].map((brand) => (
                    <label key={brand} className="flex items-center gap-3 cursor-pointer group/label">
                      <div className="relative flex items-center justify-center w-5 h-5">
                        <input type="checkbox" name="brand" value={brand} defaultChecked={brands.includes(brand)} className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded focus:ring-0 checked:bg-primary checked:border-primary transition-all cursor-pointer" />
                        <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-600 text-[14px] font-medium group-hover/label:text-primary transition-colors">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Filter by Price */}
            <div className="mb-6">
              <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase">Mức giá</h3>
              <div className="flex flex-col gap-2.5">
                {[
                  { id: 'p1', label: 'Dưới 10 triệu' },
                  { id: 'p2', label: '10 - 20 triệu' },
                  { id: 'p3', label: '20 - 30 triệu' },
                  { id: 'p4', label: 'Trên 30 triệu' },
                ].map((price) => (
                  <label key={price.id} className="flex items-center gap-3 cursor-pointer group/label">
                    <div className="relative flex items-center justify-center w-5 h-5">
                      <input type="radio" name="price_range" value={price.id} defaultChecked={priceRange === price.id} className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full focus:ring-0 checked:border-primary transition-all cursor-pointer" />
                      <div className="absolute w-2.5 h-2.5 bg-primary rounded-full pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity scale-0 peer-checked:scale-100"></div>
                    </div>
                    <span className="text-gray-600 text-[14px] font-medium group-hover/label:text-primary transition-colors">{price.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filter by Condition */}
            <div className="mb-6">
              <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase">Tình trạng</h3>
              <div className="flex flex-col gap-2.5">
                {['Mới 100%', 'Cũ (Like New)'].map((condition) => (
                  <label key={condition} className="flex items-center gap-3 cursor-pointer group/label">
                    <div className="relative flex items-center justify-center w-5 h-5">
                      <input type="checkbox" name="condition" value={condition} defaultChecked={conditions.includes(condition)} className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded focus:ring-0 checked:bg-primary checked:border-primary transition-all cursor-pointer" />
                      <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-600 text-[14px] font-medium group-hover/label:text-primary transition-colors">{condition}</span>
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" className="w-full py-3 bg-primary/10 hover:bg-primary text-primary hover:text-white font-bold rounded-xl transition-all duration-300 border border-primary/10 hover:shadow-[0_4px_15px_rgba(239,68,68,0.3)]">
              Áp dụng bộ lọc
            </button>
            {(brands.length > 0 || priceRange || conditions.length > 0) && (
              <a href={`/search?q=${query}`} className="block text-center mt-3 text-sm text-gray-500 hover:text-red-500 underline font-medium">Xóa bộ lọc</a>
            )}
          </form>
        </div>

        <div className="w-full md:w-3/4">
          {products.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6 shadow-inner border border-gray-100">
                <Search size={40} />
              </div>
              <h2 className="text-2xl font-black text-gray-800 mb-2 uppercase tracking-wide">Không tìm thấy sản phẩm</h2>
              <p className="text-gray-500 text-lg">Rất tiếc, chúng tôi không tìm thấy sản phẩm nào phù hợp với từ khóa <span className="font-bold text-gray-800">"{query}"</span>.</p>
              <Link href="/all" className="mt-6 px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-lg transition-colors">Xóa bộ lọc</Link>
            </div>
          ) : (
            <>
              <div className="mb-6 flex justify-between items-center bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <span className="font-bold text-gray-800">Tìm thấy <span className="text-primary font-black text-lg mx-1">{products.length}</span> sản phẩm</span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {products.map((product) => {
                  const isHotSaleActive = !!(product.isHotSale && product.flashSalePrice && product.flashSalePrice < product.price);
                  const originalPrice = (product.discountPrice && product.discountPrice > product.price) ? product.discountPrice : product.price;
                  const currentPrice = isHotSaleActive ? product.flashSalePrice! : product.price;
                  const saveAmount = originalPrice - currentPrice;
                  const discountPercent = originalPrice > currentPrice ? Math.round((saveAmount / originalPrice) * 100) : 0;
                  const isOutOfStock = product.status === 'out_of_stock' || (product.stock !== undefined && product.stock <= 0);

                  return (
                    <div
                      key={product._id}
                      className={`bg-white rounded-2xl border border-gray-100 overflow-hidden group shadow-sm flex flex-col h-full relative transition-all duration-300 ${isOutOfStock ? 'opacity-80' : 'hover:shadow-[0_20px_40px_rgb(220,38,38,0.12)] hover:-translate-y-2'}`}
                    >
                      <Link href={`/${product.slug}`} className="absolute inset-0 z-20"></Link>
                      <div className="relative aspect-[4/3] p-4 flex items-center justify-center bg-white overflow-hidden">

                        {isOutOfStock && (
                          <div className="absolute inset-0 bg-white/60 z-30 flex items-center justify-center backdrop-blur-[1px]">
                            <div className="bg-gray-800/90 backdrop-blur-sm text-white font-black px-6 py-2 rounded-lg -rotate-12 shadow-2xl border border-gray-600/50 tracking-widest text-lg">
                              HẾT HÀNG
                            </div>
                          </div>
                        )}

                        {product.images?.[0] && (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                            className="object-contain p-6 mix-blend-multiply group-hover:scale-105 group-hover:-translate-y-1 transition-all duration-500 relative z-10"
                            unoptimized
                          />
                        )}
                        
                        {/* ZCOMPUTER Overlay Frame */}
                        <div className="absolute inset-0 pointer-events-none z-[15] p-2 opacity-80">
                          <div className="w-full h-full border border-primary rounded-xl relative group-hover:border-primary transition-colors duration-500">
                            <div className="absolute -top-[1px] -left-[1px] w-5 h-5 border-t-2 border-l-2 border-primary rounded-tl-xl group-hover:border-primary transition-colors"></div>
                            <div className="absolute -top-[1px] -right-[1px] w-5 h-5 border-t-2 border-r-2 border-primary rounded-tr-xl group-hover:border-primary transition-colors"></div>
                            <div className="absolute -bottom-[1px] -left-[1px] w-5 h-5 border-b-2 border-l-2 border-primary rounded-bl-xl group-hover:border-primary transition-colors"></div>
                            <div className="absolute -bottom-[1px] -right-[1px] w-5 h-5 border-b-2 border-r-2 border-primary rounded-br-xl group-hover:border-primary transition-colors"></div>
                            
                            <div className="absolute bottom-2 right-2 flex items-center gap-1 opacity-50 mix-blend-multiply">
                              <Image src="/logo_broken.png" alt="ZCOMPUTER" width={20} height={20} className="w-4 h-4 object-contain" unoptimized />
                              <div className="flex items-baseline select-none tracking-tighter">
                                <span className="text-primary font-black text-[11px] drop-shadow-sm">Z</span>
                                <span className="text-slate-800 font-black text-[10px] uppercase drop-shadow-sm">COMPUTER</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Badges */}
                        <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5">
                          {product.isHotSale && (
                            <div className="shadow-lg rounded-md overflow-hidden transform -rotate-2 origin-top-left group-hover:rotate-0 transition-transform duration-300">
                              <div className="bg-gradient-to-r from-orange-500 to-primary text-white text-[10px] font-black px-2 py-1 text-center uppercase tracking-widest">
                                🔥 HOT SALE
                              </div>
                            </div>
                          )}
                          {saveAmount > 0 && !isOutOfStock && (
                            <div className="shadow-lg rounded-md overflow-hidden transform -rotate-2 origin-top-left group-hover:rotate-0 transition-transform duration-300">
                              <div className="bg-gradient-to-r from-primary to-primary text-white text-[10px] font-black px-2 py-1 text-center uppercase tracking-widest">
                                TIẾT KIỆM
                              </div>
                              <div className="bg-primary text-white text-[11px] font-black px-2 py-1 text-center border-t border-primary">
                                {saveAmount.toLocaleString('vi-VN')} đ
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Hover Action */}
                        {!isOutOfStock && (
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 z-30 pointer-events-none">
                            <div className="bg-white/95 backdrop-blur-sm text-primary text-sm font-bold px-6 py-2 rounded-full shadow-lg border border-primary flex items-center gap-2 whitespace-nowrap">
                              Xem chi tiết <ArrowRight size={16} />
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="p-4 flex flex-col flex-1 bg-white border-t border-gray-50/50 relative">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-[11px] font-bold text-gray-500 uppercase">{product.brand || "KHÁC"}</div>
                          <LikeButton product={product} />
                        </div>
                        <Link href={`/${product.slug}`} className="hover:text-primary transition-colors mb-3 z-30 relative">
                          <h3 className="text-gray-700 text-[13px] font-medium leading-relaxed line-clamp-2">{product.name}</h3>
                        </Link>
                        
                        <div className="flex flex-col mb-4">
                          {isOutOfStock ? (
                             <div className="h-full flex items-end">
                               <span className="text-[15px] font-bold text-gray-500">Liên hệ</span>
                             </div>
                          ) : saveAmount > 0 ? (
                            <>
                              <span className="text-gray-400 text-[12px] line-through mb-0.5">{originalPrice.toLocaleString('vi-VN')}₫</span>
                              <div className="flex items-center gap-2">
                                <span className="text-[16px] font-black text-primary">{currentPrice.toLocaleString('vi-VN')}₫</span>
                                <span className="text-primary border border-primary rounded text-[10px] font-bold px-1 py-[1px] leading-none">-{discountPercent}%</span>
                              </div>
                            </>
                          ) : (
                             <>
                               <div className="h-[18px] mb-0.5"></div>
                               <span className="text-[16px] font-black text-primary">{currentPrice.toLocaleString('vi-VN')}₫</span>
                             </>
                          )}
                        </div>

                        {product.specs && Object.keys(product.specs).length > 0 && (
                          <div className="bg-gray-50/80 border border-gray-100 rounded-lg p-2.5 text-[10px] text-gray-600 grid grid-cols-2 gap-y-2 gap-x-2 mt-auto">
                            {(() => {
                              const entries = Object.entries(product.specs).filter(([_, v]) => v && String(v).trim() !== '').slice(0, 5);
                              return entries.map(([key, value], index) => {
                                const lowerKey = key.toLowerCase();
                                let Icon = Maximize;
                                if (lowerKey.includes('cpu') || lowerKey.includes('chip') || lowerKey.includes('vi xử lý')) Icon = Cpu;
                                else if (lowerKey.includes('vga') || lowerKey.includes('card') || lowerKey.includes('đồ họa')) Icon = Gpu;
                                else if (lowerKey.includes('ram')) Icon = MemoryStick;
                                else if (lowerKey.includes('ổ') || lowerKey.includes('ssd') || lowerKey.includes('hdd') || lowerKey.includes('storage')) Icon = HardDrive;
                                else if (lowerKey.includes('màn') || lowerKey.includes('screen') || lowerKey.includes('display') || lowerKey.includes('độ phân giải') || lowerKey.includes('resolution')) Icon = Monitor;
                                else if (lowerKey.includes('pin') || lowerKey.includes('battery')) Icon = Battery;
                                else if (lowerKey.includes('tần số') || lowerKey.includes('hz') || lowerKey.includes('refreshrate')) Icon = Zap;
                                else if (lowerKey.includes('tấm nền') || lowerKey.includes('panel')) Icon = Layers;
                                else if (lowerKey.includes('kích thước') || lowerKey.includes('size')) Icon = Maximize;
                                else if (lowerKey.includes('phím') || lowerKey.includes('switch') || lowerKey.includes('keycap')) Icon = Keyboard;
                                else if (lowerKey.includes('chuột') || lowerKey.includes('sensor') || lowerKey.includes('dpi')) Icon = Mouse;
                                else if (lowerKey.includes('kết nối') || lowerKey.includes('connection')) Icon = LinkIcon;
                                
                                const isOddTotalAndLast = entries.length % 2 !== 0 && index === entries.length - 1;
                                return (
                                  <div key={key} className={`flex items-center gap-1.5 truncate ${isOddTotalAndLast ? 'col-span-2' : ''}`} title={`${key}: ${value}`}>
                                    <Icon size={12} className="text-gray-400 shrink-0"/> 
                                    <span className="truncate font-medium">{value as string}</span>
                                  </div>
                                );
                              });
                            })()}
                          </div>
                        )}
                        <div className="mt-4 flex justify-center text-gray-400 text-[12px] items-center gap-1.5 pt-3 border-t border-gray-50 group-hover:text-gray-600 transition-colors">
                          <Eye size={14} /> <span>{product.views || 0} lượt xem</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
