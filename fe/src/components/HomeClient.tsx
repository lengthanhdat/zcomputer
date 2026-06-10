"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Laptop, ShieldCheck, Truck, Zap, ChevronLeft, ChevronRight, Monitor, Cpu, Server, Mouse, Keyboard, Headphones, HardDrive, Maximize, Heart, type LucideIcon } from "lucide-react";
import BannerSlider from "@/components/BannerSlider";
import type { ReactNode } from "react";
import HotSaleSection from "./HotSaleSection";

type Product = {
  _id: string;
  name: string;
  slug: string;
  brand: string;
  price: number;
  discountPrice: number;
  images?: string[];
  specs?: Record<string, string>;
  condition?: string;
  category_id?: {
    _id: string;
    name: string;
    slug: string;
  } | string;
};

type Category = {
  _id: string;
  name: string;
  slug: string;
};

type Banner = {
  _id: string;
  title: string;
  link?: string;
  image?: string;
  position?: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:5000";

// Skeleton loaders
function BannerSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="w-full lg:w-2/3 rounded-2xl bg-gray-200 animate-pulse aspect-[21/9]" />
      <div className="hidden lg:flex lg:w-1/3 flex-col gap-4">
        <div className="w-full flex-1 rounded-2xl bg-gray-200 animate-pulse" />
        <div className="w-full flex-1 rounded-2xl bg-gray-200 animate-pulse" />
      </div>
    </div>
  );
}

function CategorySkeleton() {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-12 w-36 rounded-full bg-gray-200 animate-pulse" />
      ))}
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden flex flex-col h-full animate-pulse">
          <div className="aspect-[4/3] bg-gray-200" />
          <div className="p-6 flex flex-col gap-3">
            <div className="h-3 bg-gray-200 rounded w-1/3" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="mt-4 h-6 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function HomeClient() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [banners, setBanners] = useState<Banner[] | null>(null);
  const [showAllCategories, setShowAllCategories] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    Promise.all([
      fetch(`${API_BASE}/api/products?limit=100`, { signal: controller.signal, cache: 'no-store' }).then(r => r.ok ? r.json() : []).catch(() => []),
      fetch(`${API_BASE}/api/categories`, { signal: controller.signal, cache: 'no-store' }).then(r => r.ok ? r.json() : []).catch(() => []),
      fetch(`${API_BASE}/api/banners/active`, { signal: controller.signal, cache: 'no-store' }).then(r => r.ok ? r.json() : []).catch(() => []),
    ]).then(([p, c, b]) => {
      setProducts(p);
      setCategories(c);
      setBanners(b);
    });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!categories || !products) return;
    
    const cleanupFns: (() => void)[] = [];
    categories.forEach((cat) => {
      const sliderId = `slider-${cat._id}`;
      const slider = document.getElementById(sliderId);
      if (slider) {
        let isHovered = false;
        const setHover = () => isHovered = true;
        const removeHover = () => isHovered = false;
        
        slider.addEventListener('mouseenter', setHover);
        slider.addEventListener('mouseleave', removeHover);

        let animationId: number;
        let frameCount = 0;
        const scroll = () => {
          const inner = document.getElementById(`slider-inner-${cat._id}`);
          if (!isHovered && inner && inner.offsetWidth > slider.clientWidth / 2) {
            frameCount++;
            // Cuộn 1px mỗi 2 khung hình để giảm nửa tốc độ (chậm lại 1 tí)
            if (frameCount >= 2) {
              slider.scrollLeft += 1;
              frameCount = 0;
            }
            
            // Limit is exactly the width of the first inner wrapper
            const limit = inner.offsetWidth;
            
            // Nếu đã cuộn hết block đầu tiên, vòng lại 0 để tạo hiệu ứng seamless
            if (slider.scrollLeft >= limit) {
              slider.scrollLeft -= limit;
            }
          }
          animationId = requestAnimationFrame(scroll);
        };
        
        animationId = requestAnimationFrame(scroll);
        
        cleanupFns.push(() => {
          cancelAnimationFrame(animationId);
          slider.removeEventListener('mouseenter', setHover);
          slider.removeEventListener('mouseleave', removeHover);
        });
      }
    });

    return () => cleanupFns.forEach(fn => fn());
  }, [categories, products]);

  return (
    <div className="bg-[#f8f9fa] min-h-screen text-gray-900 selection:bg-primary selection:text-white pb-20">
      {/* Banner */}
      <section className="container mx-auto px-4 pt-8 pb-12">
        {banners === null ? (
          <BannerSkeleton />
        ) : (
          <div className="flex flex-col gap-4">
            <div className="w-full">
              <BannerSlider banners={banners.filter(b => b.position !== 'sub')} apiBase={API_BASE} />
            </div>
            <div className="hidden lg:grid grid-cols-3 gap-4">
              {banners.filter(b => b.position === 'sub').length > 0 ? (
                banners.filter(b => b.position === 'sub').slice(0, 3).map((banner) => (
                  <Link key={banner._id} href={banner.link || "#"} className="block relative w-full rounded-2xl overflow-hidden group shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <img src={(banner.image || "").startsWith('http') || (banner.image || "").startsWith('data:') ? banner.image : `${API_BASE}${banner.image}`} alt={banner.title} className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-500" />
                  </Link>
                ))
              ) : (
                <>
                  <Link href="/build-pc" className="relative w-full aspect-[21/9] xl:aspect-[2/1] rounded-2xl overflow-hidden group shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br from-blue-950 to-indigo-900 flex items-center p-6 border border-white/10">
                     <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=600&h=300&fit=crop')] opacity-30 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"></div>
                     <div className="absolute inset-0 bg-gradient-to-r from-[#003366] to-transparent"></div>
                     <div className="relative z-10 text-white w-2/3">
                        <h3 className="text-xl lg:text-3xl font-black uppercase mb-1 drop-shadow-md tracking-tight leading-tight">Tư Vấn<br/><span className="text-[#33ccff]">Build PC</span></h3>
                        <div className="bg-[#0066cc] text-xs font-black px-3 py-1 inline-block rounded mb-2 uppercase tracking-wide border border-[#33ccff]">Theo Nhu Cầu</div>
                     </div>
                  </Link>
                  
                  <Link href="/khuyen-mai" className="relative w-full aspect-[21/9] xl:aspect-[2/1] rounded-2xl overflow-hidden group shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-gradient-to-bl from-green-600 to-emerald-800 flex items-center p-6 border border-white/10">
                     <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1605647540924-852290f6b0d5?w=600&h=300&fit=crop')] opacity-30 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"></div>
                     <div className="absolute inset-0 bg-gradient-to-r from-[#1b5e20]/90 to-[#4caf50]/20"></div>
                     <div className="relative z-10 text-white flex flex-col items-start">
                        <h3 className="text-lg lg:text-xl font-bold uppercase mb-0 drop-shadow-md tracking-tight text-white/90">Giới Thiệu</h3>
                        <h3 className="text-2xl lg:text-3xl font-black uppercase mb-1 drop-shadow-md tracking-tight text-yellow-300">Bạn Ngay</h3>
                        <div className="bg-white text-green-700 text-xs font-black px-3 py-1 inline-block rounded-full mb-1 uppercase shadow-sm">Nhận Quà Liền Tay</div>
                        <p className="font-bold text-[11px] text-yellow-200 uppercase mt-1">Ưu đãi lên đến 2 triệu VNĐ</p>
                     </div>
                  </Link>
                  
                  <Link href="/thu-cu-doi-moi" className="relative w-full aspect-[21/9] xl:aspect-[2/1] rounded-2xl overflow-hidden group shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center p-6 border border-blue-200">
                     <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=300&fit=crop')] opacity-10 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"></div>
                     <div className="relative z-10 text-gray-800 flex flex-col items-start w-3/4">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl lg:text-3xl font-black uppercase text-red-600 drop-shadow-sm tracking-tight" style={{ WebkitTextStroke: '0.5px white' }}>Thu Cũ</h3>
                          <h3 className="text-xl lg:text-3xl font-black uppercase text-yellow-500 drop-shadow-sm tracking-tight" style={{ WebkitTextStroke: '0.5px white' }}>Đổi Mới</h3>
                        </div>
                        <div className="bg-[#004d99] text-white text-[10px] font-black px-2 py-1 rounded mb-1 uppercase tracking-wider">Lên Đời PC</div>
                        <div className="bg-blue-500 text-white text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider mt-1 absolute right-4 top-4">Trả Góp 0%</div>
                     </div>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 mb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight relative inline-block">
            Danh mục nổi bật
            <div className="absolute -bottom-3 left-1/4 w-1/2 h-1 bg-primary rounded-full"></div>
          </h2>
        </div>
        {categories === null ? (
          <CategorySkeleton />
        ) : categories.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-4">
            {(showAllCategories ? categories : categories.slice(0, 6)).map((cat) => {
              const getIcon = (name: string) => {
                const lower = name.toLowerCase();
                if (lower.includes('màn hình')) return Monitor;
                if (lower.includes('pc')) return Server;
                if (lower.includes('linh kiện') || lower.includes('cpu') || lower.includes('vga')) return Cpu;
                if (lower.includes('chuột')) return Mouse;
                if (lower.includes('phím')) return Keyboard;
                if (lower.includes('tai nghe')) return Headphones;
                return Laptop;
              };
              const Icon = getIcon(cat.name);
              
              return (
              <Link
                key={cat._id}
                href={`/category/${cat.slug}`}
                className="flex items-center gap-3 px-6 py-3 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-primary hover:text-primary transition-all cursor-pointer group text-gray-700 font-bold"
              >
                <Icon size={20} className="text-gray-400 group-hover:text-primary transition-colors" />
                <span className="uppercase tracking-wide text-sm">{cat.name}</span>
              </Link>
            )})}
            
            {!showAllCategories && categories.length > 6 && (
              <button
                onClick={() => setShowAllCategories(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-red-50 border border-red-100 shadow-sm hover:shadow-md hover:border-primary text-primary transition-all cursor-pointer font-bold"
              >
                <span className="uppercase tracking-wide text-sm">Xem tất cả ({categories.length - 6})</span>
                <ArrowRight size={18} />
              </button>
            )}
            {showAllCategories && categories.length > 6 && (
              <button
                onClick={() => setShowAllCategories(false)}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-gray-50 border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-400 text-gray-600 transition-all cursor-pointer font-bold"
              >
                <span className="uppercase tracking-wide text-sm">Thu gọn</span>
              </button>
            )}
          </div>
        ) : (
          <p className="text-gray-400 text-sm italic text-center">Hệ thống chưa có danh mục sản phẩm nào.</p>
        )}
      </section>

      {/* Flash Sale Sections */}
      {products && (
        <HotSaleSection products={products} />
      )}

      {/* Products by Categories */}
      {categories === null || products === null ? (
        <section className="container mx-auto px-4 mb-20"><ProductSkeleton /></section>
      ) : categories.length > 0 ? (
        categories.map((cat) => {
          const catProducts = products.filter((p: any) => p.category_id?._id === cat._id || p.category_id === cat._id).slice(0, 8);
          
          if (catProducts.length === 0) return null; // Ẩn danh mục nếu không có sản phẩm nào

          return (
            <section key={cat._id} className="container mx-auto px-4 mb-20">
              <div className="flex flex-col md:flex-row md:items-center bg-gray-900 rounded-3xl md:rounded-full mb-3 shadow-md">
                <Link href={`/category/${cat.slug}`} className="bg-primary text-white font-black uppercase px-8 py-3.5 rounded-full shrink-0 text-center hover:bg-red-700 transition-colors text-lg tracking-wide z-10 -ml-[1px] shadow-[4px_0_15px_rgba(227,0,25,0.4)] relative">
                  {cat.name}
                </Link>
                
                <div className="flex-1 flex items-center justify-center md:justify-start gap-6 px-6 py-3 md:py-0 overflow-x-auto [&::-webkit-scrollbar]:hidden whitespace-nowrap">
                  <span className="text-gray-400 font-medium text-sm">Mức giá</span>
                  <Link href={`/category/${cat.slug}?price=under-10`} className="text-gray-200 font-bold uppercase text-sm hover:text-primary transition-colors">
                    DƯỚI 10 TRIỆU
                  </Link>
                  <Link href={`/category/${cat.slug}?price=10-20`} className="text-gray-200 font-bold uppercase text-sm hover:text-primary transition-colors">
                    TỪ 10 TRIỆU - 20 TRIỆU
                  </Link>
                  <Link href={`/category/${cat.slug}?price=over-20`} className="text-gray-200 font-bold uppercase text-sm hover:text-primary transition-colors">
                    TRÊN 20 TRIỆU
                  </Link>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between bg-white rounded-2xl md:rounded-full px-6 py-3 shadow-sm border border-gray-100 mb-8">
                <div className="flex items-center gap-2 text-gray-800 font-bold text-[15px] mb-3 md:mb-0 shrink-0">
                  <Truck size={20} className="text-red-500 fill-red-500" />
                  <span>Miễn phí giao hàng</span>
                </div>
                <div className="flex items-center md:justify-end gap-6 text-[13px] font-bold overflow-x-auto [&::-webkit-scrollbar]:hidden whitespace-nowrap w-full">
                  {['ASUS', 'ACER', 'MSI', 'LENOVO', 'GIGABYTE', 'DELL'].map(brand => (
                     <Link key={brand} href={`/category/${cat.slug}?brand=${brand.toLowerCase()}`} className="text-gray-600 hover:text-red-600 transition-colors uppercase tracking-wide">
                       {brand}
                     </Link>
                  ))}
                  <Link href={`/category/${cat.slug}`} className="text-blue-500 hover:text-blue-600 transition-colors tracking-wide ml-2 shrink-0">
                    Xem tất cả
                  </Link>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#ffffff] to-[#f0f3f5] rounded-[2rem] shadow-sm border border-gray-200/80 p-6 md:p-8 relative overflow-hidden">
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="relative group/slider">
                <button 
                  onClick={(e) => {
                    const slider = document.getElementById(`slider-${cat._id}`);
                    if (slider) slider.scrollBy({ left: -340, behavior: 'smooth' });
                  }}
                  className="absolute -left-5 top-1/2 -translate-y-1/2 w-12 h-12 bg-white border border-gray-100 rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-primary hover:scale-110 z-10 opacity-0 group-hover/slider:opacity-100 transition-all focus:outline-none"
                >
                  <ChevronLeft size={24} />
                </button>
                
                <div id={`slider-${cat._id}`} className="flex overflow-x-hidden gap-3 pb-6 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  <div id={`slider-inner-${cat._id}`} className="flex gap-3 pr-3 flex-shrink-0">
                    {catProducts.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>

                  {catProducts.length >= 5 && (
                    <div className="flex gap-3 pr-3 flex-shrink-0" aria-hidden="true">
                      {catProducts.map((product) => (
                        <ProductCard key={`${product._id}-dup`} product={product} />
                      ))}
                    </div>
                  )}
                </div>

                <button 
                  onClick={(e) => {
                    const slider = document.getElementById(`slider-${cat._id}`);
                    if (slider) slider.scrollBy({ left: 340, behavior: 'smooth' });
                  }}
                  className="absolute -right-5 top-1/2 -translate-y-1/2 w-12 h-12 bg-white border border-gray-100 rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-primary hover:scale-110 z-10 opacity-0 group-hover/slider:opacity-100 transition-all focus:outline-none"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>
            </section>
          );
        })
      ) : (
        <section className="container mx-auto px-4 mb-20">
          <div className="col-span-full py-12 text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-2xl bg-white">
            Chưa có danh mục sản phẩm nào được thiết lập.
          </div>
        </section>
      )}

      {/* Features */}
      <section className="bg-white py-16 border-y border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Feature icon={<ShieldCheck size={32} />} title="Bảo Hành Tận Nơi" body="Cam kết bảo hành chính hãng. Hỗ trợ kỹ thuật tại nhà nhanh chóng trong 2h." />
            <Feature icon={<Zap size={32} />} title="Cấu Hình Cực Đỉnh" body="Chỉ cung cấp những linh kiện hiệu năng cao nhất, đã qua kiểm tra nghiêm ngặt." bordered />
            <Feature icon={<Truck size={32} />} title="Giao Hàng Hỏa Tốc" body="Miễn phí giao hàng toàn quốc. Đóng gói an toàn tuyệt đối chống sốc." />
          </div>
        </div>
      </section>
    </div>
  );
}

function Feature({ icon, title, body, bordered = false }: { icon: ReactNode; title: string; body: string; bordered?: boolean }) {
  return (
    <div className={`flex flex-col items-center text-center px-4 ${bordered ? "border-y md:border-y-0 md:border-x border-gray-100" : ""}`}>
      <div className="w-16 h-16 rounded-full bg-red-50 text-primary flex items-center justify-center mb-5">
        {icon}
      </div>
      <h4 className="text-lg font-bold text-gray-900 mb-2 uppercase">{title}</h4>
      <p className="text-gray-500 text-sm leading-relaxed">{body}</p>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <div
      className="flex-none w-[280px] md:w-[280px] bg-white rounded-2xl border border-gray-100 overflow-hidden group shadow-md hover:shadow-[0_8px_30px_rgb(220,38,38,0.15)] hover:border-red-200 hover:-translate-y-2 transition-all duration-500 flex flex-col relative"
    >
      <div className="relative aspect-[4/3] p-4 flex items-center justify-center bg-white overflow-hidden">
        <Link href={`/product/${product.slug}`} className="absolute inset-0 z-20"></Link>

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
        
        {/* Badges */}
        <div className="absolute top-4 left-4 z-20 flex flex-col shadow-lg rounded-md overflow-hidden transform -rotate-3 origin-top-left group-hover:rotate-0 transition-transform duration-300">
          {product.discountPrice > product.price && (
            <>
              <div className="bg-gradient-to-r from-red-600 to-red-500 text-white text-[10px] font-black px-2 py-1 text-center uppercase tracking-widest">
                TIẾT KIỆM
              </div>
              <div className="bg-red-700 text-white text-[12px] font-black px-2 py-1 text-center border-t border-red-500">
                {(product.discountPrice - product.price).toLocaleString('vi-VN')} đ
              </div>
            </>
          )}
        </div>

        {/* Hover Action */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 z-30">
          <div className="bg-white/95 backdrop-blur-sm text-primary text-sm font-bold px-6 py-2 rounded-full shadow-lg border border-primary/20 flex items-center gap-2 whitespace-nowrap">
            Xem chi tiết <ArrowRight size={16} />
          </div>
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-1 bg-white relative z-10">
        <div className="flex items-center justify-between mb-2">
          <div className="text-[11px] font-bold text-gray-500 uppercase">{product.brand || "KHÁC"}</div>
          <Heart size={16} className="text-red-600 cursor-pointer" />
        </div>
        <Link href={`/product/${product.slug}`} className="hover:text-red-600 transition-colors mb-3 z-30 relative">
          <h3 className="text-gray-700 text-[13px] leading-relaxed line-clamp-2">{product.name}</h3>
        </Link>
        
        <div className="flex flex-col mb-4">
          {product.discountPrice > product.price ? (
            <>
              <span className="text-gray-400 text-[13px] line-through mb-0.5">{product.discountPrice.toLocaleString('vi-VN')}₫</span>
              <div className="flex items-center gap-2">
                <span className="text-[16px] font-bold text-red-600">{product.price.toLocaleString('vi-VN')}₫</span>
                <span className="text-red-500 border border-red-500 rounded text-[10px] font-bold px-1 py-[1px] leading-none">-{Math.round(((product.discountPrice - product.price) / product.discountPrice) * 100)}%</span>
              </div>
            </>
          ) : (
             <>
               <div className="h-[19.5px] mb-0.5"></div>
               <span className="text-[16px] font-bold text-red-600">{product.price.toLocaleString('vi-VN')}₫</span>
             </>
          )}
        </div>

        {product.specs && Object.keys(product.specs).length > 0 && (
          <div className="bg-[#f8f9fa] rounded-lg p-3 text-[10px] text-gray-600 grid grid-cols-2 gap-y-2 gap-x-3 mt-auto">
            {product.specs.cpu && <div className="flex items-center gap-1.5 truncate"><Cpu size={12} className="text-gray-400 shrink-0"/> <span className="truncate">{product.specs.cpu}</span></div>}
            {product.specs.vga && <div className="flex items-center gap-1.5 truncate"><Monitor size={12} className="text-gray-400 shrink-0"/> <span className="truncate">{product.specs.vga}</span></div>}
            {product.specs.ram && <div className="flex items-center gap-1.5 truncate"><Server size={12} className="text-gray-400 shrink-0"/> <span className="truncate">{product.specs.ram}</span></div>}
            {product.specs.storage && <div className="flex items-center gap-1.5 truncate"><HardDrive size={12} className="text-gray-400 shrink-0"/> <span className="truncate">{product.specs.storage}</span></div>}
            {product.specs.screen && <div className="col-span-2 flex items-center gap-1.5 truncate"><Maximize size={12} className="text-gray-400 shrink-0"/> <span className="truncate">{product.specs.screen}</span></div>}
          </div>
        )}
      </div>
    </div>
  );
}
