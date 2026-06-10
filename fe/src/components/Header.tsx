"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Montserrat } from "next/font/google";
import { Search, Menu, X } from "lucide-react";
import HeaderAuth from "./HeaderAuth";
import HeaderCart from "./HeaderCart";

const montserrat = Montserrat({ subsets: ["latin", "vietnamese"], weight: ["900"] });

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm border-b">
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

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <Image src="/logo.webp" alt="Z" width={48} height={48} priority className="h-10 w-10 sm:h-12 sm:w-12 object-contain group-hover:scale-105 group-hover:rotate-[4deg] transition-all duration-300" />
          <span className={`${montserrat.className} flex items-baseline select-none tracking-tighter relative group-hover:scale-[1.02] transition-transform duration-300`}>
            <span className="text-red-600 drop-shadow-[0_2px_4px_rgba(220,38,38,0.2)] text-2xl sm:text-3xl">Z</span>
            <span className="text-slate-900 uppercase text-xl sm:text-2xl">COMPUTER</span>
            <span className="absolute -bottom-1.5 left-0 w-full h-[2.5px] bg-red-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 rounded-full" />
          </span>
        </Link>

        {/* Desktop Search Bar (Hidden on Mobile) */}
        <div className="flex-1 max-w-xl hidden md:flex mx-6">
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Bạn cần tìm linh kiện, PC hay Laptop..."
              className="w-full border-2 border-primary rounded-full py-2 px-4 pr-12 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button type="submit" className="absolute right-0 top-0 h-full w-12 bg-primary rounded-r-full text-white flex items-center justify-center hover:bg-red-700 transition-colors" aria-label="Tìm kiếm">
              <Search size={18} />
            </button>
          </form>
        </div>

        {/* Cart & Authentication */}
        <div className="flex items-center gap-3 sm:gap-5 shrink-0">
          <HeaderCart />
          <div className="hidden sm:block">
            <HeaderAuth />
          </div>
        </div>
      </div>

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



      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="lg:hidden fixed inset-0 top-[104px] md:top-[74px] bg-black/45 z-40 transition-all duration-300"
        >
          {/* Side Drawer */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-72 h-full shadow-2xl p-6 flex flex-col justify-between"
          >
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Danh mục chính</h3>
                <ul className="space-y-4 font-bold text-sm text-gray-800">
                  <li>
                    <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-primary transition-colors">Trang chủ</Link>
                  </li>
                  <li>
                    <Link href="/category/laptop-cu" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-primary transition-colors">Laptop Cũ</Link>
                  </li>
                  <li>
                    <Link href="/category/pc-cu" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-primary transition-colors">PC Cũ</Link>
                  </li>
                  <li>
                    <Link href="/category/man-hinh-cu" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-primary transition-colors">Màn hình Cũ</Link>
                  </li>
                  <li>
                    <Link href="/category/linh-kien-cu" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-primary transition-colors">Linh kiện Cũ</Link>
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
            <div className="text-xs text-gray-400 text-center border-t pt-5">
              ZCOMPUTER © {new Date().getFullYear()}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
