"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Playfair_Display, Montserrat } from "next/font/google";
import { Search, Menu, X, PhoneCall, MapPin, ChevronDown } from "lucide-react";
import HeaderAuth from "./HeaderAuth";
import HeaderCart from "./HeaderCart";
import HeaderNav from "./HeaderNav";
import { fetchApi } from "@/lib/api";

const montserrat = Montserrat({ subsets: ["latin", "vietnamese"], weight: ["700", "900"] });
const playfair = Playfair_Display({ subsets: ["latin", "vietnamese"], weight: ["700", "900"] });

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [expandedCatId, setExpandedCatId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchApi('/categories', { requireAuth: false })
      .then(r => r.ok ? r.json() : [])
      .then(data => setCategories(data))
      .catch(() => {});
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      <header className="bg-white/85 backdrop-blur-xl sticky top-0 z-50 shadow-[0_4px_30px_rgba(0,0,0,0.05)] border-b border-gray-200/50">
        {/* Top Header Row */}
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Mobile Hamburger Menu Icon */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:text-red-600 transition-colors focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <Link 
            href="/" 
            className="flex items-center gap-3 shrink-0 group relative"
            onClick={(e) => {
              if (window.location.pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
          >
            <div className="absolute inset-0 bg-red-500/10 blur-[20px] rounded-full group-hover:bg-red-500/20 transition-all duration-500 pointer-events-none"></div>
            <Image src="/logo.png" alt="Z" width={80} height={80} priority className="h-14 w-14 sm:h-[68px] sm:w-[68px] object-contain group-hover:scale-105 transition-all duration-300 drop-shadow-md relative z-10" />
            
            {/* New Storefront-style Text Logo */}
            <div className="flex items-center gap-1.5 group-hover:scale-[1.02] transition-transform duration-300 select-none relative z-10">
              <span className={`${playfair.className} text-[#cc0000] text-[54px] sm:text-[62px] font-black leading-[0.8] drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]`}>
                Z
              </span>
              <div className="flex flex-col justify-center">
                <span className={`${playfair.className} text-gray-900 text-[24px] sm:text-[28px] font-black uppercase tracking-widest drop-shadow-sm leading-none`}>
                  COMPUTER
                </span>
                <span className={`${montserrat.className} text-[#cc0000] font-black text-[8px] sm:text-[9.5px] uppercase tracking-[0.15em] mt-1`}>
                  PC GAMING - LAPTOP - WORKSTATION
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Search Bar (Hidden on Mobile) */}
          <div className="flex-1 max-w-xl hidden md:flex mx-6">
            <form onSubmit={handleSearch} className="relative w-full group/search">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Bạn cần tìm linh kiện, PC hay Laptop..."
                className="w-full border-2 border-red-100 bg-white/60 backdrop-blur-md rounded-full py-2.5 px-5 pr-12 text-sm focus:outline-none focus:border-red-400 focus:bg-white shadow-inner transition-all duration-300 text-gray-800 placeholder-gray-400 group-hover/search:shadow-[0_0_15px_rgba(239,68,68,0.1)]"
              />
              <button type="submit" className="absolute right-0 top-0 h-full w-14 bg-gradient-to-r from-red-600 to-red-500 rounded-r-full text-white flex items-center justify-center hover:shadow-[0_0_15px_rgba(239,68,68,0.5)] transition-all duration-300" aria-label="Tìm kiếm">
                <Search size={18} />
              </button>
            </form>
          </div>

          {/* Cart & Authentication */}
          <div className="flex items-center gap-3 sm:gap-5 shrink-0">
            {/* Hotline & Showroom */}
            <div className="hidden xl:flex items-center gap-6 mr-4 border-r pr-6 border-gray-200">
              <div className="flex items-center gap-2 group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
                  <PhoneCall size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-gray-500 font-medium uppercase tracking-wide">Hotline mua hàng</span>
                  <span className="text-[15px] font-black text-red-600 leading-tight">0977 334 415</span>
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
                  {Array.isArray(categories) && categories.filter(c => c && !c.parent_id).map((cat: any) => {
                    const children = categories.filter(c => c && c.parent_id === cat._id);
                    const isExpanded = expandedCatId === cat._id;
                    return (
                      <li key={cat._id || Math.random()} className="border-b border-gray-100 pb-2">
                        <div className="flex items-center justify-between">
                          <Link href={`/category/${cat.slug || ''}`} onClick={() => setMobileMenuOpen(false)} className="block py-1 flex-1 hover:text-primary transition-colors uppercase text-gray-800">
                            {cat.name || 'Category'}
                          </Link>
                          {children.length > 0 && (
                            <button 
                              onClick={() => setExpandedCatId(isExpanded ? null : cat._id)}
                              className="p-2 -mr-2 text-gray-400 hover:text-primary transition-colors focus:outline-none"
                            >
                              <ChevronDown size={16} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180 text-primary' : ''}`} />
                            </button>
                          )}
                        </div>
                        {children.length > 0 && (
                          <div className={`grid transition-all duration-300 ease-out ${isExpanded ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0'}`}>
                            <div className="overflow-hidden">
                              <ul className="pl-4 border-l-2 border-red-100 space-y-3 py-2 text-sm font-medium text-gray-600">
                                {children.map((child: any) => (
                                  <li key={child._id || Math.random()}>
                                    <Link href={`/category/${child.slug || ''}`} onClick={() => setMobileMenuOpen(false)} className="block hover:text-primary transition-colors">
                                      {child.name || 'Subcategory'}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="border-t pt-5">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Thông tin</h3>
                <ul className="space-y-4 font-bold text-sm text-gray-800">
                  <li>
                    <Link href="/category/all" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-primary transition-colors">Tất cả sản phẩm</Link>
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
