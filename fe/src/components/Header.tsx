"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Playfair_Display, Montserrat } from "next/font/google";
import { Search, Menu, X, PhoneCall, MapPin, ChevronDown, ArrowRight, Laptop, Monitor, Clock, Trash2, Flame } from "lucide-react";
import HeaderAuth from "./HeaderAuth";
import HeaderCart from "./HeaderCart";
import HeaderNav from "./HeaderNav";
import { fetchApi } from "@/lib/api";
import React from "react";

const montserrat = Montserrat({ subsets: ["latin", "vietnamese"], weight: ["700", "900"] });
const playfair = Playfair_Display({ subsets: ["latin", "vietnamese"], weight: ["700", "900"] });

const MobileCategoryItem = ({ cat, categories, onNavigate }: { cat: any, categories: any[], onNavigate: () => void }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const children = Array.isArray(categories) ? categories.filter(c => c && c.parent_id === cat._id) : [];

  return (
    <li className="border-b border-gray-100 pb-2">
      <div className="flex items-center justify-between">
        <Link href={`/${cat.slug || ''}`} onClick={onNavigate} className="block py-1 flex-1 hover:text-primary transition-colors uppercase text-gray-800">
          {cat.name || 'Category'}
        </Link>
        {children.length > 0 && (
          <button 
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 -mr-2 text-gray-400 hover:text-primary transition-colors focus:outline-none"
          >
            <ChevronDown size={16} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180 text-primary' : ''}`} />
          </button>
        )}
      </div>
      {children.length > 0 && (
        <div className={`grid transition-all duration-300 ease-out ${isExpanded ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0'}`}>
          <div className="overflow-hidden">
            <ul className="pl-4 border-l-2 border-primary/10 space-y-3 py-2 text-sm font-medium text-gray-600">
              {children.map((child: any) => (
                <MobileCategoryItem key={child._id || Math.random()} cat={child} categories={categories} onNavigate={onNavigate} />
              ))}
            </ul>
          </div>
        </div>
      )}
    </li>
  );
};

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [expandedCatId, setExpandedCatId] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [defaultSuggestions, setDefaultSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const searchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  useEffect(() => {
    try {
      const history = localStorage.getItem('searchHistory');
      if (history) setSearchHistory(JSON.parse(history));
    } catch(e) {}
    
    fetchApi('/categories', { requireAuth: false })
      .then(r => r.ok ? r.json() : [])
      .then(data => setCategories(data))
      .catch(() => {});
      
    // Fetch default suggestions (most popular products)
    fetchApi('/products?limit=5&sort=views', { requireAuth: false })
      .then(r => r.ok ? r.json() : [])
      .then(data => setDefaultSuggestions(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length >= 1) {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      
      searchTimeoutRef.current = setTimeout(() => {
        fetchApi(`/products?search=${encodeURIComponent(searchQuery.trim())}&limit=5&sort=views`, { requireAuth: false })
          .then(res => res.ok ? res.json() : [])
          .then(data => {
            setSuggestions(data);
            setShowSuggestions(true);
          })
          .catch(() => {});
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const q = searchQuery.trim();
      const newHistory = [q, ...searchHistory.filter(item => item !== q)].slice(0, 5);
      setSearchHistory(newHistory);
      try { localStorage.setItem('searchHistory', JSON.stringify(newHistory)); } catch(e) {}
      
      router.push(`/search?q=${encodeURIComponent(q)}`);
      setMobileMenuOpen(false);
      setShowSuggestions(false);
    }
  };

  const clearHistory = () => {
    setSearchHistory([]);
    try { localStorage.removeItem('searchHistory'); } catch(e) {}
  };

  return (
    <>
      <header className="bg-white/85 backdrop-blur-xl sticky top-0 z-50 shadow-[0_4px_30px_rgba(0,0,0,0.05)] border-b border-gray-200/50">
        {/* Top Header Row */}
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Mobile Hamburger Menu Icon */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:text-primary transition-colors focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <Link 
            href="/" 
            className="flex items-center gap-1.5 shrink-0 group relative"
            onClick={(e) => {
              if (window.location.pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
          >
            <Image src="/logo_broken.png" alt="Z" width={80} height={80} priority className="h-14 w-14 sm:h-[68px] sm:w-[68px] object-contain group-hover:scale-105 transition-all duration-300 drop-shadow-md relative z-10" />
            
            {/* New Storefront-style Text Logo */}
            <div className="flex items-center gap-0.5 group-hover:scale-[1.02] transition-transform duration-300 select-none relative z-10 font-serif">
              <span className="text-[#cc0000] text-[40px] sm:text-[50px] md:text-[58px] font-bold leading-none">
                Z
              </span>
              <div className="flex flex-col justify-center pt-1">
                <span className="text-gray-900 text-[20px] sm:text-[24px] md:text-[28px] font-bold uppercase tracking-[0.02em] leading-none mb-0.5">
                  COMPUTER
                </span>
                <span className={`${montserrat.className} text-[#cc0000] font-black text-[5.5px] sm:text-[7.5px] md:text-[8.5px] uppercase tracking-[0.02em] sm:tracking-[0.05em] leading-none`}>
                  PC GAMING - LAPTOP - WORKSTATION
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Search Bar (Hidden on Mobile) */}
          <div className="flex-1 w-full max-w-2xl lg:max-w-3xl hidden md:flex mx-6 xl:mx-12 relative">
            <form onSubmit={handleSearch} className="relative w-full group/search z-50">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Bạn cần tìm linh kiện, PC hay Laptop..."
                className="w-full border-2 border-primary/20 bg-white/60 backdrop-blur-md rounded-full py-2.5 px-5 pr-12 text-sm focus:outline-none focus:border-primary/60 focus:bg-white shadow-inner transition-all duration-300 text-gray-800 placeholder-gray-400 group-hover/search:shadow-[0_0_15px_var(--primary-ring)]"
              />
              <button type="submit" className="absolute right-0 top-0 h-full w-14 bg-primary rounded-r-full text-white flex items-center justify-center hover:brightness-110 transition-all duration-300" aria-label="Tìm kiếm">
                <Search size={18} />
              </button>
            </form>

            {/* Suggestions Dropdown */}
            {showSuggestions && (searchQuery.trim().length >= 1 ? suggestions.length > 0 : defaultSuggestions.length > 0) && (
              <div className="absolute top-[110%] left-0 right-0 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 pb-2">
                
                {/* When User has NOT typed anything => Show History & Trending */}
                {searchQuery.trim().length < 1 ? (
                  <div className="p-3">

                    {/* Search History */}
                    {searchHistory.length > 0 && (
                      <div className="mb-5">
                        <div className="flex items-center justify-between mb-2 px-1">
                          <h4 className="text-[13px] font-bold text-gray-800 flex items-center gap-1.5">
                            <Clock size={15} /> Lịch sử tìm kiếm
                          </h4>
                          <button type="button" onClick={clearHistory} className="text-[12px] text-gray-500 hover:text-red-500 transition-colors flex items-center gap-1">
                            Xoá tất cả <Trash2 size={13} />
                          </button>
                        </div>
                        <div className="flex flex-col gap-1">
                          {searchHistory.map((item, idx) => (
                            <div 
                              key={idx} 
                              className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 cursor-pointer rounded transition-colors text-sm text-gray-600"
                              onMouseDown={(e) => {
                                e.preventDefault(); // prevent blur
                                setSearchQuery(item);
                                router.push(`/search?q=${encodeURIComponent(item)}`);
                                setShowSuggestions(false);
                              }}
                            >
                              <Clock size={14} className="text-gray-400" />
                              <span className="flex-1 truncate">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Trending */}
                    <div>
                      <h4 className="text-[13px] font-bold text-gray-800 flex items-center gap-1.5 mb-3 px-1">
                        <Flame size={15} className="text-orange-500 fill-orange-500/20" /> Xu hướng tìm kiếm
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {defaultSuggestions.slice(0, 6).map((item) => (
                          <Link 
                            key={item._id} 
                            href={`/${item.slug}`} 
                            onClick={() => setShowSuggestions(false)}
                            className="flex items-center gap-2 p-2 hover:bg-slate-50 border border-transparent hover:border-gray-100 rounded-lg transition-colors group/item"
                          >
                            <div className="w-10 h-10 rounded bg-white border border-gray-100 overflow-hidden shrink-0 p-0.5">
                              {item.images?.[0] ? (
                                <img src={item.images[0]} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                  <Laptop size={16} />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-[13px] font-medium text-gray-700 truncate group-hover/item:text-primary transition-colors">{item.name}</h4>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* When User IS typing => Show Live Search Results */
                  <>
                    <div className="px-4 py-2 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Kết quả tìm kiếm</span>
                      <span className="text-[10px] text-gray-400 font-medium">Nhấn Enter để xem thêm</span>
                    </div>
                    <div className="py-2">
                      {suggestions.map((item) => (
                        <Link 
                          key={item._id} 
                          href={`/${item.slug}`} 
                          onClick={() => setShowSuggestions(false)}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors border-b border-gray-50 last:border-0 group/item"
                        >
                          <div className="w-12 h-12 rounded-lg bg-white border border-gray-100 overflow-hidden shrink-0 p-1 group-hover/item:border-primary/20 transition-colors">
                            {item.images?.[0] ? (
                              <img src={item.images[0]} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                {item.name.toLowerCase().includes('laptop') ? <Laptop size={20} /> :
                                 item.name.toLowerCase().includes('màn') ? <Monitor size={20} /> :
                                 <Search size={16} />}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-gray-800 truncate group-hover/item:text-primary transition-colors">{item.name}</h4>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[13px] font-black text-primary">{item.price ? item.price.toLocaleString('vi-VN') + 'đ' : 'Liên hệ'}</span>
                              {item.discountPrice > 0 && <span className="text-[10px] text-gray-400 line-through font-medium">{item.discountPrice.toLocaleString('vi-VN')}đ</span>}
                            </div>
                          </div>
                        </Link>
                      ))}
                      {suggestions.length === 0 && (
                        <div className="py-8 text-center text-gray-500 text-sm">
                          Không tìm thấy sản phẩm nào phù hợp.
                        </div>
                      )}
                    </div>
                    {suggestions.length > 0 && (
                      <div className="bg-slate-50 px-4 py-3 text-center border-t border-gray-100 hover:bg-slate-100 transition-colors cursor-pointer" onClick={() => { router.push(`/search?q=${encodeURIComponent(searchQuery)}`); setShowSuggestions(false); }}>
                        <span className="text-xs font-bold text-primary flex items-center justify-center gap-1">
                          Xem tất cả kết quả cho "{searchQuery}" <ArrowRight size={12} />
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Cart & Authentication */}
          <div className="flex items-center gap-3 sm:gap-5 shrink-0">
            {/* Hotline & Showroom */}
            <div className="hidden xl:flex items-center gap-6 mr-4 border-r pr-6 border-gray-200">
              <div className="flex items-center gap-2 group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <PhoneCall size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-gray-500 font-medium uppercase tracking-wide">Hotline mua hàng</span>
                  <span className="text-[15px] font-black text-primary leading-tight">0977 334 415</span>
                </div>
              </div>

              <Link href="/he-thong-cua-hang" className="flex items-center gap-2 group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 group-hover:bg-gray-800 group-hover:text-white transition-colors duration-300">
                  <MapPin size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-gray-500 font-medium uppercase tracking-wide">Hệ thống 2 cơ sở</span>
                  <span className="text-[15px] font-black text-gray-800 leading-tight">Showroom</span>
                </div>
              </Link>
            </div>

            <HeaderCart />
            <div className="hidden sm:block">
              <HeaderAuth />
            </div>
          </div>
        </div>

        {/* Main Navigation Bar (Mega Menu) */}
        <HeaderNav />

        {/* Mobile Search Bar (Only visible on small devices) */}
        <div className="md:hidden px-4 pb-3">
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm linh kiện, PC, Laptop..."
              className="w-full border-2 border-primary rounded-full py-1.5 pl-4 pr-10 text-xs focus:outline-none"
            />
            <button type="submit" className="absolute right-0 top-0 h-full w-10 bg-primary rounded-r-full text-white flex items-center justify-center" aria-label="Tìm kiếm">
              <Search size={16} />
            </button>
          </form>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="lg:hidden fixed inset-0 top-[104px] md:top-[74px] bg-black/45 z-40 transition-all duration-300"
        >
          {/* Side Drawer */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-72 h-full absolute left-0 top-0 bottom-0 shadow-2xl flex flex-col"
          >
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Danh mục chính</h3>
                <ul className="space-y-4 font-bold text-sm text-gray-800">
                  <li>
                    <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-primary transition-colors">Trang chủ</Link>
                  </li>
                  {Array.isArray(categories) && categories.filter(c => c && !c.parent_id).map((cat: any) => (
                    <MobileCategoryItem key={cat._id || Math.random()} cat={cat} categories={categories} onNavigate={() => setMobileMenuOpen(false)} />
                  ))}
                </ul>
              </div>

              <div className="border-t pt-5">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Thông tin</h3>
                <ul className="space-y-4 font-bold text-sm text-gray-800">
                  <li>
                    <Link href="/all" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-primary transition-colors">Tất cả sản phẩm</Link>
                  </li>
                  <li>
                    <Link href="/chinh-sach-bao-hanh" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-primary transition-colors">Chính sách bảo hành</Link>
                  </li>
                  <li>
                    <Link href="/ve-chung-toi" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-primary transition-colors">Về ZComputer</Link>
                    <ul className="pl-4 mt-2 space-y-3 font-medium text-gray-600">
                      <li><Link href="/ve-chung-toi" onClick={() => setMobileMenuOpen(false)} className="block hover:text-primary transition-colors">Giới thiệu về ZCOMPUTER</Link></li>
                      <li><Link href="/lien-he" onClick={() => setMobileMenuOpen(false)} className="block hover:text-primary transition-colors">Liên hệ</Link></li>
                      <li><Link href="/tuyen-dung" onClick={() => setMobileMenuOpen(false)} className="block hover:text-primary transition-colors">Tuyển dụng</Link></li>
                    </ul>
                  </li>
                  <li>
                    <Link href="/thu-mua-cu" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-primary transition-colors">Thu cũ đổi mới</Link>
                  </li>
                  <li>
                    <Link href="/gioi-thieu-ban-be" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-primary transition-colors">Giới thiệu bạn bè</Link>
                  </li>
                </ul>
              </div>

              <div className="sm:hidden border-t pt-5">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Tài khoản</h3>
                <div onClick={() => setMobileMenuOpen(false)}>
                  <HeaderAuth />
                </div>
              </div>
            </div>
            <div className="p-4 shrink-0 text-xs text-gray-400 text-center border-t bg-white">
              ZCOMPUTER © {new Date().getFullYear()}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
