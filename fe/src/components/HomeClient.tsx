"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Laptop, ShieldCheck, Truck, Zap, ChevronLeft, ChevronRight, Monitor, Cpu, Server, Mouse, Keyboard, Headphones, HardDrive, Maximize, Heart, Eye, type LucideIcon } from "lucide-react";
import BannerSlider from "@/components/BannerSlider";
import CategoryMenu from "@/components/CategoryMenu";
import VideoReviewSection from "@/components/VideoReviewSection";
import BrandMarquee from "@/components/BrandMarquee";
import type { ReactNode } from "react";
import HotSaleSection from "./HotSaleSection";
import { fetchApi } from "@/lib/api";

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
  isHotSale?: boolean;
  flashSalePrice?: number;
  category_id?: {
    _id: string;
    name: string;
    slug: string;
  } | string;
  stock?: number;
  status?: string;
  views?: number;
};

interface Category {
  _id: string;
  name: string;
  slug: string;
  parent_id?: string;
  image?: string;
};

type Banner = {
  _id: string;
  title: string;
  link?: string;
  image?: string;
  position?: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

// Skeleton loaders
function BannerSkeleton() {
  return (
    <div className="w-full flex flex-col lg:flex-row gap-4">
      <div className="w-full lg:w-2/3 rounded-2xl bg-gray-200 animate-pulse h-[400px] lg:h-[450px]" />
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
  const [banners, setBanners] = useState<any[] | null>(null);
  const [videoReviews, setVideoReviews] = useState<any[]>([]);
  const [showAllCategories, setShowAllCategories] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {
      try {
        const [catRes, prodRes, bannerRes, videoRes] = await Promise.all([
          fetchApi("/categories", { signal: controller.signal }),
          fetchApi("/products?limit=100", { signal: controller.signal }),
          fetchApi("/banners", { signal: controller.signal }),
          fetchApi("/video-reviews", { signal: controller.signal })
        ]);
        const [catData, prodData, bannerData, videoData] = await Promise.all([
          catRes.ok ? catRes.json() : [],
          prodRes.ok ? prodRes.json() : [],
          bannerRes.ok ? bannerRes.json() : [],
          videoRes.ok ? videoRes.json() : []
        ]);
        setCategories(catData);
        setProducts(prodData.products || prodData);
        setBanners(bannerData.filter((b: any) => b.isActive).sort((a: any, b: any) => a.order - b.order));
        setVideoReviews(videoData);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error("Lỗi khi tải dữ liệu trang chủ:", err);
        }
      }
    }
    fetchData();

    return () => controller.abort();
  }, []);



  return (
    <div className="bg-[#f8f9fa] min-h-screen text-gray-900 selection:bg-primary selection:text-white">
      {/* Banner */}
      <section className="container mx-auto px-4 pt-8 pb-12">
        {banners === null ? (
          <BannerSkeleton />
        ) : (
          <div className="flex flex-col gap-4">
            <div className="w-full">
              <BannerSlider banners={banners.filter(b => b.position !== 'sub')} apiBase={API_BASE} />
            </div>
            {banners.filter(b => b.position === 'sub').length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2 lg:mt-0">
                {banners.filter(b => b.position === 'sub').slice(0, 3).map((banner) => (
                  <Link key={banner._id} href={banner.link || "#"} className="block relative w-full rounded-2xl overflow-hidden group shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <img src={(banner.image || "").startsWith('http') || (banner.image || "").startsWith('data:') || (banner.image || "").startsWith('/uploads') ? banner.image : `${API_BASE}${banner.image}`} alt={banner.title} className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-500" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Brand Marquee */}
      <BrandMarquee />

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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 lg:gap-6">
            {(showAllCategories ? categories.filter(c => !c.parent_id) : categories.filter(c => !c.parent_id).slice(0, 5)).map((cat) => {
              const getIcon = (name: string) => {
                const lower = name.toLowerCase();
                if (lower.includes('màn hình')) return Monitor;
                if (lower.includes('pc') || lower.includes('máy tính')) return Server;
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
                className="flex flex-col items-center justify-center gap-4 p-6 rounded-[2rem] bg-white border-2 border-transparent hover:border-primary/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(220,38,38,0.1)] hover:-translate-y-2 transition-all duration-300 cursor-pointer group text-gray-700 font-bold relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="w-20 h-20 rounded-full bg-gray-50 group-hover:bg-white flex items-center justify-center relative z-10 transition-colors duration-500 shadow-inner group-hover:shadow-[0_0_20px_rgb(220,38,38,0.15)]">
                  <Icon size={32} strokeWidth={1.5} className="text-gray-400 group-hover:text-primary transition-colors duration-500 group-hover:scale-110" />
                </div>
                <span className="uppercase tracking-widest text-[12px] relative z-10 text-center leading-relaxed">{cat.name}</span>
              </Link>
            )})}
            
            {!showAllCategories && categories.filter(c => !c.parent_id).length > 5 && (
              <button
                onClick={() => setShowAllCategories(true)}
                className="flex flex-col items-center justify-center gap-4 p-6 rounded-[2rem] bg-red-50 border-2 border-red-100 shadow-sm hover:shadow-md hover:border-primary/30 text-primary transition-all duration-300 cursor-pointer font-bold group relative overflow-hidden hover:-translate-y-2"
              >
                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center relative z-10 shadow-sm group-hover:shadow-[0_0_20px_rgb(220,38,38,0.2)] transition-shadow duration-500">
                  <ArrowRight size={32} strokeWidth={1.5} className="text-primary group-hover:translate-x-2 transition-transform duration-300" />
                </div>
                <span className="uppercase tracking-widest text-[12px] relative z-10 text-center leading-relaxed">Xem tất cả ({categories.filter(c => !c.parent_id).length - 5})</span>
              </button>
            )}
            {showAllCategories && categories.filter(c => !c.parent_id).length > 5 && (
              <button
                onClick={() => setShowAllCategories(false)}
                className="flex flex-col items-center justify-center gap-4 p-6 rounded-[2rem] bg-gray-50 border-2 border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 text-gray-600 transition-all duration-300 cursor-pointer font-bold group relative overflow-hidden hover:-translate-y-2"
              >
                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center relative z-10 shadow-sm transition-shadow duration-500">
                  <ArrowRight size={32} strokeWidth={1.5} className="text-gray-400 group-hover:-translate-x-2 transition-transform duration-300 rotate-180" />
                </div>
                <span className="uppercase tracking-widest text-[12px] relative z-10 text-center leading-relaxed">Thu gọn</span>
              </button>
            )}
          </div>
        ) : (
          <p className="text-gray-400 text-sm italic text-center">Hệ thống chưa có danh mục sản phẩm nào.</p>
        )}
      </section>

      {/* Flash Sale Sections */}
      {/* Hot Sale Section */}
      <HotSaleSection products={products || []} />

      {/* Video Review Section */}
      <VideoReviewSection videos={videoReviews} />

      {/* Products by Categories */}
      {categories === null || products === null ? (
        <section className="container mx-auto px-4 mb-20"><ProductSkeleton /></section>
      ) : categories.length > 0 ? (
        categories.filter(c => !c.parent_id).map((cat) => {
          // get IDs of the main category and all its subcategories
          const subCategoryIds = categories.filter(c => c.parent_id === cat._id).map(c => c._id);
          const relevantIds = [cat._id, ...subCategoryIds];
          
          let catProducts = products.filter((p: any) => 
            relevantIds.includes(p.category_id?._id) || relevantIds.includes(p.category_id)
          ).slice(0, 8);
          
          if (catProducts.length === 0) return null; // Ẩn danh mục nếu không có sản phẩm nào

          return (
            <section key={cat._id} className="container mx-auto px-4 mb-16">
              {/* Mobile Category Header */}
              <div className="flex lg:hidden items-center justify-between mb-6 px-2">
                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight relative inline-block">
                  {cat.name}
                  <div className="absolute -bottom-2 left-0 w-1/2 h-1 bg-primary rounded-full"></div>
                </h3>
                <Link href={`/category/${cat.slug}`} className="text-primary text-sm font-bold flex items-center hover:underline">
                  Xem tất cả <ChevronRight size={16} />
                </Link>
              </div>

              <div className="flex flex-col lg:flex-row bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/80 overflow-hidden">
                {/* Vertical Category Banner */}
                <div className="hidden lg:block w-1/4 xl:w-[280px] flex-shrink-0 relative group rounded-l-[2rem] overflow-hidden">
                  <Image src={cat.image ? (cat.image.startsWith('http') || cat.image.startsWith('data:') ? cat.image : `${cat.image}`) : "https://images.unsplash.com/photo-1542393545-10f5cde2c810?w=400&q=80"} alt={cat.name} fill className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" unoptimized />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8">
                    <h3 className="text-white font-black text-2xl uppercase leading-tight drop-shadow-lg">{cat.name}</h3>
                    <Link href={`/category/${cat.slug}`} className="text-white/80 font-medium text-sm mt-3 flex items-center gap-1 hover:text-white transition-colors">
                      XEM TẤT CẢ <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>

                {/* Slider Container */}
                <div className="w-full lg:w-3/4 xl:w-[calc(100%-280px)] bg-transparent p-6 md:p-8 relative flex-1">
                  <div className="absolute -top-32 -right-32 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
                  <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
                  <div className="relative group/slider">
                    <button 
                      onClick={(e) => {
                        const slider = document.getElementById(`slider-${cat._id}`);
                        if (slider) slider.scrollBy({ left: -340, behavior: 'smooth' });
                      }}
                      className="absolute -left-5 top-1/2 -translate-y-1/2 w-12 h-12 bg-white border border-gray-100 rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-primary hover:scale-110 z-50 opacity-0 group-hover/slider:opacity-100 transition-all focus:outline-none"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <div id={`slider-${cat._id}`} className="flex overflow-x-auto gap-3 pb-6 scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                      <div id={`slider-inner-${cat._id}`} className="flex gap-3 pr-3 flex-shrink-0 snap-start">
                        {catProducts.map((product) => (
                          <ProductCard key={product._id} product={product} />
                        ))}
                      </div>
                    </div>

                    <button 
                      onClick={(e) => {
                        const slider = document.getElementById(`slider-${cat._id}`);
                        if (slider) slider.scrollBy({ left: 340, behavior: 'smooth' });
                      }}
                      className="absolute -right-5 top-1/2 -translate-y-1/2 w-12 h-12 bg-white border border-gray-100 rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-primary hover:scale-110 z-50 opacity-0 group-hover/slider:opacity-100 transition-all focus:outline-none"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </div>
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

      {/* Customer Testimonials / Gallery */}
      <section className="bg-[#111111] py-16 border-t border-gray-800 mt-12">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto mb-14 px-4">
            <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-6">
              LỜI CẢM ƠN TỪ <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">ZCOMPUTER</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-red-600 to-orange-500 mx-auto mb-8 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.5)]"></div>
            <p className="text-gray-300 text-base md:text-[17px] leading-8 md:leading-9 italic font-medium">
              &quot;ZCOMPUTER trân trọng từng khoảnh khắc được đồng hành cùng quý khách. Sự tin tưởng và ủng hộ của bạn chính là động lực to lớn giúp chúng tôi không ngừng hoàn thiện, mang đến những sản phẩm và dịch vụ chất lượng nhất. Hy vọng ZCOMPUTER sẽ luôn là địa chỉ uy tín, gắn bó lâu dài cùng đam mê công nghệ của quý khách. Chân thành cảm ơn bạn đã lựa chọn chúng tôi!&quot;
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden group shadow-lg border border-gray-800">
                <img 
                  src={`/images/customers/customer-${i + 1}.jpg`} 
                  alt={`ZComputer Customer ${i + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.src = `https://placehold.co/400x300/222222/666666?text=Customer+${i + 1}`;
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features - Promax Design */}
      <section className="bg-[#0a0a0a] text-white py-24 relative overflow-hidden border-t border-gray-800">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            <Feature icon={<ShieldCheck size={36} />} title="Bảo Hành Tận Nơi" body="Cam kết bảo hành chính hãng. Hỗ trợ kỹ thuật tại nhà nhanh chóng trong 2h." />
            <Feature icon={<Zap size={36} />} title="Cấu Hình Cực Đỉnh" body="Chỉ cung cấp những linh kiện hiệu năng cao nhất, đã qua kiểm tra nghiêm ngặt." bordered />
            <Feature icon={<Truck size={36} />} title="Giao Hàng Hỏa Tốc" body="Miễn phí giao hàng toàn quốc. Đóng gói an toàn tuyệt đối chống sốc." />
          </div>
        </div>
      </section>
    </div>
  );
}

function Feature({ icon, title, body, bordered = false }: { icon: ReactNode; title: string; body: string; bordered?: boolean }) {
  return (
    <div className={`flex flex-col items-center text-center px-4 group ${bordered ? "md:border-x border-gray-800" : ""}`}>
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 text-white flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-red-500/50 group-hover:shadow-[0_0_30px_rgb(220,38,38,0.2)] transition-all duration-500">
        <div className="group-hover:text-red-500 transition-colors duration-500">
          {icon}
        </div>
      </div>
      <h4 className="text-xl font-black text-white mb-3 uppercase tracking-widest">{title}</h4>
      <p className="text-gray-400 text-sm leading-relaxed max-w-sm">{body}</p>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const isHotSaleActive = !!(product.isHotSale && product.flashSalePrice && product.flashSalePrice < product.price);
  const originalPrice = (product.discountPrice && product.discountPrice > product.price) ? product.discountPrice : product.price;
  const currentPrice = isHotSaleActive ? product.flashSalePrice! : product.price;
  const saveAmount = originalPrice - currentPrice;
  const discountPercent = originalPrice > currentPrice ? Math.round((saveAmount / originalPrice) * 100) : 0;
  const isOutOfStock = product.status === 'out_of_stock' || product.stock === 0;

  return (
    <div
      className={`flex-none w-[280px] md:w-[280px] bg-white rounded-2xl border border-gray-100 overflow-hidden group shadow-md flex flex-col relative transition-all duration-500 ${isOutOfStock ? 'opacity-80' : 'hover:shadow-[0_8px_30px_rgb(220,38,38,0.15)] hover:border-red-200 hover:-translate-y-2'}`}
    >
      <Link href={`/product/${product.slug}`} className="absolute inset-0 z-20"></Link>
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
            className="object-contain p-8 mix-blend-multiply group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500 relative z-10"
            unoptimized
          />
        )}
        
        {/* Badges */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5">
          {product.isHotSale && (
            <div className="shadow-lg rounded-md overflow-hidden transform -rotate-3 origin-top-left group-hover:rotate-0 transition-transform duration-300">
              <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white text-[10px] font-black px-2 py-1 text-center uppercase tracking-widest">
                🔥 HOT SALE
              </div>
            </div>
          )}
          {saveAmount > 0 && (
            <div className="shadow-lg rounded-md overflow-hidden transform -rotate-3 origin-top-left group-hover:rotate-0 transition-transform duration-300">
              <div className="bg-gradient-to-r from-red-600 to-red-500 text-white text-[10px] font-black px-2 py-1 text-center uppercase tracking-widest">
                TIẾT KIỆM
              </div>
              <div className="bg-red-700 text-white text-[12px] font-black px-2 py-1 text-center border-t border-red-500">
                {saveAmount.toLocaleString('vi-VN')} đ
              </div>
            </div>
          )}
        </div>

        {/* Hover Action */}
        {!isOutOfStock && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 z-30">
            <div className="bg-white/95 backdrop-blur-sm text-primary text-sm font-bold px-6 py-2 rounded-full shadow-lg border border-primary/20 flex items-center gap-2 whitespace-nowrap">
              Xem chi tiết <ArrowRight size={16} />
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 flex flex-col flex-1 bg-white relative z-10">
        <div className="flex items-center justify-between mb-2">
          <div className="text-[11px] font-bold text-gray-500 uppercase">{product.brand || "KHÁC"}</div>
          <Heart size={16} className="text-red-600 cursor-pointer relative z-30" />
        </div>
        <Link href={`/product/${product.slug}`} className="hover:text-red-600 transition-colors mb-3 z-30 relative">
          <h3 className="text-gray-700 text-[13px] leading-relaxed line-clamp-2">{product.name}</h3>
        </Link>
        
        <div className="flex flex-col mb-4">
          {isOutOfStock ? (
             <div className="h-full flex items-end">
               <span className="text-[15px] font-bold text-gray-500">Liên hệ</span>
             </div>
          ) : saveAmount > 0 ? (
            <>
              <span className="text-gray-400 text-[13px] line-through mb-0.5">{originalPrice.toLocaleString('vi-VN')}₫</span>
              <div className="flex items-center gap-2">
                <span className="text-[16px] font-bold text-red-600">{currentPrice.toLocaleString('vi-VN')}₫</span>
                <span className="text-red-500 border border-red-500 rounded text-[10px] font-bold px-1 py-[1px] leading-none">-{discountPercent}%</span>
              </div>
            </>
          ) : (
             <>
               <div className="h-[19.5px] mb-0.5"></div>
               <span className="text-[16px] font-bold text-red-600">{currentPrice.toLocaleString('vi-VN')}₫</span>
             </>
          )}
        </div>

        {product.specs && Object.keys(product.specs).length > 0 && (
          <div className="bg-[#f8f9fa] rounded-lg p-3 text-[10px] text-gray-600 grid grid-cols-2 gap-y-2 gap-x-3 mt-auto">
            {Object.entries(product.specs).slice(0, 5).map(([key, value], index) => {
              const lowerKey = key.toLowerCase();
              let Icon = Maximize;
              if (lowerKey.includes('cpu') || lowerKey.includes('chip') || lowerKey.includes('vi xử lý')) Icon = Cpu;
              else if (lowerKey.includes('vga') || lowerKey.includes('card') || lowerKey.includes('đồ họa')) Icon = Monitor;
              else if (lowerKey.includes('ram')) Icon = Server;
              else if (lowerKey.includes('ổ') || lowerKey.includes('ssd') || lowerKey.includes('hdd') || lowerKey.includes('storage')) Icon = HardDrive;
              
              return (
                <div key={key} className={`flex items-center gap-1.5 truncate ${index === 4 ? 'col-span-2' : ''}`} title={`${key}: ${value}`}>
                  <Icon size={12} className="text-gray-400 shrink-0"/> 
                  <span className="truncate">{value as string}</span>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-4 mb-2 flex justify-center text-gray-900 text-[13px] items-center gap-1.5">
          <Eye size={15} /> {(product.views || 0).toLocaleString('vi-VN')} lượt xem
        </div>
      </div>
    </div>
  );
}
