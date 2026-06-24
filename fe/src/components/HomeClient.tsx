"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Laptop, ShieldCheck, Truck, Zap, ChevronLeft, ChevronRight, Monitor, Cpu, Server, Mouse, Keyboard, Headphones, HardDrive, Maximize, Heart, Eye, type LucideIcon, MemoryStick, Gpu, Battery, Layers, Link as LinkIcon } from "lucide-react";
import LikeButton from "./LikeButton";
import BannerSlider from "@/components/BannerSlider";
import CategoryMenu from "@/components/CategoryMenu";
import VideoReviewSection from "@/components/VideoReviewSection";
import BrandMarquee from "@/components/BrandMarquee";
import type { ReactNode } from "react";
import HotSaleSection from "./HotSaleSection";
import DraggableSlider from "./DraggableSlider";
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
      <div className="w-full lg:w-2/3 rounded-2xl bg-gray-200 animate-pulse h-[200px] md:h-[300px] lg:h-[450px]" />
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

// Simple module-level cache to prevent scroll jumps on back navigation
let cachedProducts: Product[] | null = null;
let cachedCategories: Category[] | null = null;
let cachedBanners: any[] | null = null;
let cachedVideoReviews: any[] | null = null;

export default function HomeClient() {
  const [products, setProducts] = useState<Product[] | null>(cachedProducts);
  const [categories, setCategories] = useState<Category[] | null>(cachedCategories);
  const [banners, setBanners] = useState<any[] | null>(cachedBanners);
  const [videoReviews, setVideoReviews] = useState<any[]>(cachedVideoReviews || []);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [activeSubCats, setActiveSubCats] = useState<Record<string, string>>({});

  useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {
      try {
        const [catRes, prodRes, bannerRes, videoRes] = await Promise.all([
          fetchApi(`/categories?t=${Date.now()}`, { signal: controller.signal }),
          fetchApi(`/products?limit=100&t=${Date.now()}`, { signal: controller.signal }),
          fetchApi(`/banners?t=${Date.now()}`, { signal: controller.signal }),
          fetchApi(`/video-reviews?t=${Date.now()}`, { signal: controller.signal })
        ]);
        const [catData, prodData, bannerData, videoData] = await Promise.all([
          catRes.ok ? catRes.json() : [],
          prodRes.ok ? prodRes.json() : [],
          bannerRes.ok ? bannerRes.json() : [],
          videoRes.ok ? videoRes.json() : []
        ]);
        
        cachedCategories = catData;
        cachedProducts = prodData.products || prodData;
        cachedBanners = bannerData.filter((b: any) => b.isActive).sort((a: any, b: any) => a.order - b.order);
        cachedVideoReviews = videoData;

        setCategories(cachedCategories);
        setProducts(cachedProducts);
        setBanners(cachedBanners);
        setVideoReviews(cachedVideoReviews || []);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error("Lỗi khi tải dữ liệu trang chủ:", err);
        }
      }
    }
    
    if (!cachedProducts || !cachedCategories) {
      fetchData();
    } else {
      // Re-fetch in background to update cache without showing skeleton
      fetchData();
    }

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!categories || categories.length === 0) return;
    
    const cleanupFns: Array<() => void> = [];

    categories.filter(c => !c.parent_id).forEach(cat => {
      const slider = document.getElementById(`slider-${cat._id}`);
      if (!slider) return;

      let isDown = false;
      let startX: number;
      let scrollLeft: number;
      let dragged = false;

      const mouseDown = (e: MouseEvent) => {
        isDown = true;
        dragged = false;
        slider.classList.add('cursor-grabbing');
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
      };
      
      const mouseUp = () => {
        isDown = false;
        slider.classList.remove('cursor-grabbing');
      };
      
      const mouseMove = (e: MouseEvent) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 1.5;
        if (Math.abs(walk) > 5) dragged = true;
        slider.scrollLeft = scrollLeft - walk;
      };

      const preventClick = (e: MouseEvent) => {
        if (dragged) {
          e.preventDefault();
          e.stopPropagation();
        }
      };
      
      slider.addEventListener('mousedown', mouseDown);
      slider.addEventListener('mouseleave', mouseUp);
      slider.addEventListener('mouseup', mouseUp);
      slider.addEventListener('mousemove', mouseMove);
      slider.addEventListener('click', preventClick, true);

      cleanupFns.push(() => {
        slider.removeEventListener('mousedown', mouseDown);
        slider.removeEventListener('mouseleave', mouseUp);
        slider.removeEventListener('mouseup', mouseUp);
        slider.removeEventListener('mousemove', mouseMove);
        slider.removeEventListener('click', preventClick, true);
      });
    });

    return () => {
      cleanupFns.forEach(fn => fn());
    };
  }, [categories, products]);

  return (
    <div className="bg-[#f8f9fa] min-h-screen text-gray-900 selection:bg-primary selection:text-white">
      <h1 suppressHydrationWarning className="sr-only">ZCOMPUTER - PC Gaming, Laptop, Workstation</h1>
      {/* Banner */}
      <section className="container mx-auto px-2 md:px-4 pt-4 pb-6 md:pt-8 md:pb-12">
        {banners === null ? (
          <BannerSkeleton />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 md:gap-4">
            {/* Main Slider (2/3 width on PC) */}
            <div className="lg:col-span-2 w-full">
              <BannerSlider banners={banners.filter(b => b.position !== 'sub')} apiBase={API_BASE} />
            </div>

            {/* Sub Banners (1/3 width on PC, 2 rows) */}
            {banners.filter(b => b.position === 'sub').length > 0 && (
              <div className="grid grid-cols-2 lg:grid-cols-1 lg:grid-rows-2 gap-2 md:gap-4 mt-2 lg:mt-0">
                {banners.filter(b => b.position === 'sub').slice(0, 2).map((banner) => (
                  <Link key={banner._id} href={banner.link || "#"} className="block relative w-full h-full aspect-[16/9] lg:aspect-auto rounded-xl md:rounded-2xl overflow-hidden group shadow-sm hover:shadow-xl lg:hover:-translate-y-1 transition-all duration-300">
                    <img src={(banner.image || "").startsWith('http') || (banner.image || "").startsWith('data:') || (banner.image || "").startsWith('/uploads') ? banner.image : `${API_BASE}${banner.image}`} alt={banner.title} className="absolute inset-0 w-full h-full object-fill group-hover:scale-105 transition-transform duration-500" />
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
          <div className="relative">
            {/* Decorative Background Blobs for Glassmorphism */}
            <div className="absolute top-10 left-1/4 w-72 h-72 bg-primary rounded-full blur-[80px] pointer-events-none -z-10"></div>
            <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-blue-400/20 rounded-full blur-[80px] pointer-events-none -z-10"></div>

            <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 lg:gap-6">
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
                  href={`/${cat.slug}`}
                  className="flex flex-col items-center justify-center gap-3 p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_rgba(220,38,38,0.15)] hover:-translate-y-2 hover:border-white/80 hover:bg-white/60 transition-all duration-500 cursor-pointer group text-gray-700 font-bold relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-multiply"></div>
                  <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-white/40 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                  <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-white/50 backdrop-blur-md border border-white/80 group-hover:bg-white flex items-center justify-center relative z-10 transition-all duration-500 shadow-inner group-hover:shadow-[0_0_20px_rgb(220,38,38,0.15)]">
                    <Icon size={24} strokeWidth={1.5} className="text-gray-400 group-hover:text-primary transition-all duration-500 group-hover:scale-110 md:w-[32px] md:h-[32px]" />
                  </div>
                  <span className="uppercase tracking-widest text-[10px] md:text-[12px] relative z-10 text-center leading-relaxed group-hover:text-primary transition-colors">{cat.name}</span>
                </Link>
              )})}
              
              {!showAllCategories && categories.filter(c => !c.parent_id).length > 5 && (
                <button
                  onClick={() => setShowAllCategories(true)}
                  className="flex flex-col items-center justify-center gap-4 p-6 rounded-[2rem] bg-primary/10 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_rgba(220,38,38,0.15)] hover:-translate-y-2 hover:border-primary/10 hover:bg-primary/10 transition-all duration-500 cursor-pointer group text-primary font-bold relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-multiply"></div>
                  <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-white/40 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                  <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-white/50 backdrop-blur-md border border-white/80 group-hover:bg-white flex items-center justify-center relative z-10 transition-all duration-500 shadow-inner group-hover:shadow-[0_0_20px_rgb(220,38,38,0.15)]">
                    <ArrowRight size={24} strokeWidth={1.5} className="text-primary group-hover:translate-x-2 transition-transform duration-300 md:w-[32px] md:h-[32px]" />
                  </div>
                  <span className="uppercase tracking-widest text-[10px] md:text-[12px] relative z-10 text-center leading-relaxed group-hover:text-primary transition-colors">Xem tất cả ({categories.filter(c => !c.parent_id).length - 5})</span>
                </button>
              )}
              {showAllCategories && categories.filter(c => !c.parent_id).length > 5 && (
                <button
                  onClick={() => setShowAllCategories(false)}
                  className="flex flex-col items-center justify-center gap-4 p-6 rounded-[2rem] bg-gray-50/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:-translate-y-2 hover:border-gray-200 hover:bg-gray-50/80 transition-all duration-500 cursor-pointer group text-gray-600 font-bold relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-multiply"></div>
                  <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-white/40 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                  <div className="w-20 h-20 rounded-full bg-white/50 backdrop-blur-md border border-white/80 group-hover:bg-white flex items-center justify-center relative z-10 transition-all duration-500 shadow-inner group-hover:shadow-[0_0_20px_rgb(0,0,0,0.1)]">
                    <ArrowRight size={32} strokeWidth={1.5} className="text-gray-400 group-hover:-translate-x-2 transition-transform duration-300 rotate-180" />
                  </div>
                  <span className="uppercase tracking-widest text-[12px] relative z-10 text-center leading-relaxed group-hover:text-gray-800 transition-colors">Thu gọn</span>
                </button>
              )}
            </div>
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
          );
          
          const subCategoriesWithCounts = categories
            .filter(c => c.parent_id === cat._id)
            .map(subCat => {
              const count = products.filter((p: any) => p.category_id?._id === subCat._id || p.category_id === subCat._id).length;
              return { ...subCat, productCount: count };
            })
            .filter(subCat => subCat.productCount > 0)
            .sort((a, b) => b.productCount - a.productCount);

          const topSubCategories = subCategoriesWithCounts.slice(0, 5);
          
          if (catProducts.length === 0) return null; // Ẩn danh mục nếu không có sản phẩm nào
          
          const activeSubCatId = activeSubCats[cat._id] || "all";
          if (activeSubCatId !== "all") {
             catProducts = catProducts.filter((p: any) => p.category_id?._id === activeSubCatId || p.category_id === activeSubCatId);
          }

          return (
            <section key={cat._id} className="container mx-auto px-4 mb-16">
              {/* Horizontal Category Banner */}
              {cat.image && (
                <Link href={`/${cat.slug}`} className="block w-full h-[120px] md:h-[200px] relative rounded-[2rem] overflow-hidden mb-6 group shadow-lg">
                  <Image 
                    src={(cat.image.startsWith('http') || cat.image.startsWith('data:') || cat.image.startsWith('/uploads')) ? cat.image : `${cat.image}`} 
                    alt={cat.name} 
                    fill 
                    sizes="100vw" 
                    className="object-cover group-hover:scale-105 transition-transform duration-700" 
                    unoptimized 
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500"></div>
                </Link>
              )}

              {/* Main Content Container */}
              <div className="flex flex-col bg-white rounded-[2rem] shadow-[0_8px_30px_var(--primary-ring)] border-[4px] border-primary/10 hover:border-primary/30 transition-colors duration-500 overflow-hidden relative p-6 md:p-8">
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
                
                {/* Header Row: Category Name & Filters */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 lg:mb-8 gap-4 lg:gap-6 relative z-10">
                  <div className="flex items-center justify-between w-full lg:w-auto gap-4">
                    <h3 className="text-[18px] sm:text-xl md:text-3xl font-black text-gray-900 uppercase tracking-tight relative inline-block line-clamp-2">
                      {cat.name}
                      <div className="absolute -bottom-2 left-0 w-1/2 h-1 bg-primary rounded-full"></div>
                    </h3>
                    {/* Xem tất cả on Mobile */}
                    <Link 
                      href={`/${cat.slug}`}
                      className="lg:hidden flex-shrink-0 text-[12px] font-bold text-primary hover:brightness-110 flex items-center gap-1 bg-primary/5 px-3 py-1.5 rounded-full"
                    >
                      Xem tất cả <ChevronRight size={14} />
                    </Link>
                  </div>
                  
                  {/* Top Subcategories Bar */}
                  {topSubCategories.length > 0 ? (
                    <div className="flex items-center gap-3 w-full lg:w-auto flex-1 min-w-0 lg:justify-end">
                      <div className="relative w-full lg:w-auto lg:flex-1 min-w-0 group/subcat flex items-center">
                        <button 
                          onClick={() => { document.getElementById(`subcat-slider-${cat._id}`)?.scrollBy({ left: -200, behavior: 'smooth' }) }}
                          className="absolute left-1 z-20 w-7 h-7 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.15)] border border-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:text-primary opacity-0 group-hover/subcat:opacity-100 transition-all pointer-events-none group-hover/subcat:pointer-events-auto"
                        >
                          <ChevronLeft size={16} />
                        </button>

                        <div id={`subcat-slider-${cat._id}`} className="flex overflow-x-auto whitespace-nowrap items-center gap-2 md:gap-3 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-2.5 rounded-2xl border border-primary/10 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] min-w-0 scroll-smooth w-full">
                          <div className="flex text-primary font-black text-[11px] uppercase tracking-widest px-3 border-r border-primary/20 mr-1 items-center gap-1.5 flex-shrink-0">
                            <Zap size={14} className="text-orange-500 fill-orange-500" />
                            Nổi bật
                          </div>
                          
                          <button
                            onClick={() => setActiveSubCats(prev => ({...prev, [cat._id]: "all"}))}
                            className={`flex-shrink-0 px-4 py-1.5 backdrop-blur-md rounded-xl text-[12px] font-bold transition-all duration-300 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_5px_15px_var(--primary-ring)] border ${activeSubCatId === "all" ? "bg-primary text-white border-primary shadow-[0_5px_15px_var(--primary-ring)]" : "bg-white/60 text-gray-700 hover:bg-white hover:text-primary border-white/50 hover:border-primary/50"}`}
                          >
                            Tất cả
                          </button>

                          {topSubCategories.map(subCat => (
                            <button 
                              key={subCat._id} 
                              onClick={() => setActiveSubCats(prev => ({...prev, [cat._id]: subCat._id}))}
                              className={`flex-shrink-0 px-4 py-1.5 backdrop-blur-md rounded-xl text-[12px] font-bold transition-all duration-300 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_5px_15px_var(--primary-ring)] border ${activeSubCatId === subCat._id ? "bg-primary text-white border-primary shadow-[0_5px_15px_var(--primary-ring)]" : "bg-white/60 text-gray-700 hover:bg-white hover:text-primary border-white/50 hover:border-primary/50"}`}
                            >
                              {subCat.name}
                            </button>
                          ))}
                        </div>

                        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none rounded-r-2xl"></div>
                        <button 
                          onClick={() => { document.getElementById(`subcat-slider-${cat._id}`)?.scrollBy({ left: 200, behavior: 'smooth' }) }}
                          className="absolute right-1 z-20 w-7 h-7 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.15)] border border-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:text-primary opacity-0 group-hover/subcat:opacity-100 transition-all pointer-events-none group-hover/subcat:pointer-events-auto"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>
                      {/* Xem tất cả on Desktop */}
                      <Link 
                        href={`/${cat.slug}`}
                        className="hidden lg:flex flex-shrink-0 text-[13px] font-bold text-primary hover:brightness-110 items-center gap-1 transition-all duration-300 hover:translate-x-1"
                      >
                        Xem tất cả <ChevronRight size={14} />
                      </Link>
                    </div>
                  ) : (
                    <Link href={`/${cat.slug}`} className="hidden lg:flex text-primary text-sm font-bold items-center hover:underline lg:ml-auto">
                      Xem tất cả <ChevronRight size={16} />
                    </Link>
                  )}
                </div>

                <div className="relative group/slider mt-auto">
                    <button 
                      onClick={(e) => {
                        const slider = document.getElementById(`slider-${cat._id}`);
                        if (slider) slider.scrollBy({ left: -340, behavior: 'smooth' });
                      }}
                      className="absolute -left-5 top-1/2 -translate-y-1/2 w-12 h-12 bg-white border border-gray-100 rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-primary hover:scale-110 z-40 opacity-0 group-hover/slider:opacity-100 transition-all focus:outline-none"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <DraggableSlider id={`slider-${cat._id}`} className="flex overflow-x-auto gap-3 pt-4 -mt-4 pb-6 scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                      <div id={`slider-inner-${cat._id}`} className="flex gap-3 pr-3 flex-shrink-0 snap-start">
                        {catProducts.map((product) => (
                          <ProductCard key={product._id} product={product} />
                        ))}
                      </div>
                    </DraggableSlider>

                    <button 
                      onClick={(e) => {
                        const slider = document.getElementById(`slider-${cat._id}`);
                        if (slider) slider.scrollBy({ left: 340, behavior: 'smooth' });
                      }}
                      className="absolute -right-5 top-1/2 -translate-y-1/2 w-12 h-12 bg-white border border-gray-100 rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-primary hover:scale-110 z-40 opacity-0 group-hover/slider:opacity-100 transition-all focus:outline-none"
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

      {/* Customer Testimonials / Gallery */}
      <section className="bg-[#111111] py-16 border-t border-gray-800 mt-12">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto mb-14 px-4">
            <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-6">
              LỜI CẢM ƠN TỪ <span className="text-primary">ZCOMPUTER</span>
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-8 rounded-full shadow-[0_0_10px_var(--primary-ring)]"></div>
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
      className={`flex-none w-[170px] md:w-[280px] bg-white rounded-2xl border-2 border-primary/20 overflow-hidden group shadow-md flex flex-col relative transition-all duration-500 ${isOutOfStock ? 'opacity-80' : 'hover:shadow-[0_8px_30px_var(--primary-ring)] hover:border-primary hover:-translate-y-2'}`}
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
            className="object-contain p-8 mix-blend-multiply group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500 relative z-10"
            unoptimized
          />
        )}
        
        {/* ZCOMPUTER Overlay Frame */}
        <div className="absolute inset-0 pointer-events-none z-[15] p-2 opacity-80">
          <div className="w-full h-full border border-primary/10 rounded-xl relative">
            <div className="absolute -top-[1px] -left-[1px] w-5 h-5 border-t-2 border-l-2 border-primary/60 rounded-tl-xl"></div>
            <div className="absolute -top-[1px] -right-[1px] w-5 h-5 border-t-2 border-r-2 border-primary/60 rounded-tr-xl"></div>
            <div className="absolute -bottom-[1px] -left-[1px] w-5 h-5 border-b-2 border-l-2 border-primary/60 rounded-bl-xl"></div>
            <div className="absolute -bottom-[1px] -right-[1px] w-5 h-5 border-b-2 border-r-2 border-primary/60 rounded-br-xl"></div>
            
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
            <div className="shadow-lg rounded-md overflow-hidden transform -rotate-3 origin-top-left group-hover:rotate-0 transition-transform duration-300">
              <div className="bg-primary text-white text-[10px] font-black px-2 py-1 text-center uppercase tracking-widest">
                🔥 HOT SALE
              </div>
            </div>
          )}
          {saveAmount > 0 && (
            <div className="shadow-lg rounded-md overflow-hidden transform -rotate-3 origin-top-left group-hover:rotate-0 transition-transform duration-300">
              <div className="bg-primary text-white text-[10px] font-black px-2 py-1 text-center uppercase tracking-widest">
                TIẾT KIỆM
              </div>
              <div className="bg-primary/80 text-white text-[12px] font-black px-2 py-1 text-center border-t border-white/20">
                {saveAmount.toLocaleString('vi-VN')} đ
              </div>
            </div>
          )}
        </div>

        {/* Hover Action */}
        {!isOutOfStock && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 z-30 pointer-events-none">
            <div className="bg-white/95 backdrop-blur-sm text-primary text-sm font-bold px-6 py-2 rounded-full shadow-lg border border-primary/20 flex items-center gap-2 whitespace-nowrap">
              Xem chi tiết <ArrowRight size={16} />
            </div>
          </div>
        )}
      </div>
      
      <div className="p-3 md:p-5 flex flex-col flex-1 bg-white">
        <div className="flex items-center justify-between mb-2">
          <div className="text-[10px] md:text-[12px] font-extrabold text-gray-400 uppercase tracking-wider">{product.brand || "KHÁC"}</div>
          <LikeButton product={product} />
        </div>
        <Link href={`/${product.slug}`} className="hover:text-primary transition-colors mb-2 md:mb-4 z-30 relative">
          <h3 className="text-gray-800 text-[13px] md:text-[15px] font-medium leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-300">{product.name}</h3>
        </Link>
        
        <div className="flex flex-col mt-auto mb-4">
          {isOutOfStock ? (
             <div className="h-full flex items-end">
               <span className="text-[16px] md:text-[18px] font-black text-gray-500">LIÊN HỆ</span>
             </div>
          ) : saveAmount > 0 ? (
            <>
              <span className="text-gray-400 text-[12px] md:text-[13px] line-through mb-0.5 decoration-gray-300">{originalPrice.toLocaleString('vi-VN')}₫</span>
              <div className="flex items-end gap-2">
                <span className="text-[16px] md:text-[18px] font-black text-primary leading-none">{currentPrice.toLocaleString('vi-VN')}₫</span>
                <span className="bg-primary/10 text-primary border border-primary/20 rounded text-[10px] md:text-[11px] font-bold px-1.5 py-[2px] leading-none">-{discountPercent}%</span>
              </div>
            </>
          ) : (
             <>
               <div className="h-[18px] md:h-[20px] mb-0.5"></div>
               <span className="text-[16px] md:text-[18px] font-black text-primary leading-none">{currentPrice.toLocaleString('vi-VN')}₫</span>
             </>
          )}
        </div>

        {product.specs && Object.keys(product.specs).length > 0 && (
          <div className="hidden md:grid bg-[#f8f9fa] rounded-xl p-3.5 text-[11px] text-gray-600 grid-cols-2 gap-y-2.5 gap-x-3 mt-auto border border-gray-100">
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
                  <div key={key} className={`flex items-center gap-2 truncate ${isOddTotalAndLast ? 'col-span-2' : ''}`} title={`${key}: ${value}`}>
                    <Icon size={14} className="text-gray-400 shrink-0"/> 
                    <span className="truncate font-medium">{value as string}</span>
                  </div>
                );
              });
            })()}
          </div>
        )}

        <div className="mt-4 mb-1 flex justify-center text-gray-400 text-[11px] md:text-[12px] items-center gap-1.5 font-medium">
          <Eye size={14} /> {(product.views || 0).toLocaleString('vi-VN')} lượt xem
        </div>
      </div>
    </div>
  );
}
