"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, Menu, Phone } from "lucide-react";
import Image from "next/image";
import CategoryMenu from "./CategoryMenu";
import { fetchApi } from "@/lib/api";

export default function HeaderNav() {
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetchApi('/categories', { requireAuth: false })
      .then(r => r.ok ? r.json() : [])
      .then(data => setCategories(data))
      .catch(() => {});
  }, []);

  return (
    <div className="hidden lg:block bg-[#0b0f19]/80 backdrop-blur-2xl text-white relative z-40 border-t border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
      <div className="container mx-auto px-4 relative flex items-center">
        
        {/* VERTICAL CATEGORY MENU DROPDOWN */}
        <div 
          className="relative mr-8"
          onMouseEnter={() => setShowCategoryMenu(true)}
          onMouseLeave={() => setShowCategoryMenu(false)}
        >
          <div className="bg-gradient-to-r from-red-600 to-red-500 text-white flex items-center gap-2 px-5 py-4 cursor-pointer hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all duration-300 relative overflow-hidden group">
            <div className="absolute inset-0 bg-white/20 translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-500 pointer-events-none"></div>
            <Menu size={20} className="relative z-10" />
            <span className="font-bold tracking-wider uppercase relative z-10 text-shadow-sm">MENU</span>
            <ChevronDown size={16} className={`transition-transform duration-300 ml-2 relative z-10 ${showCategoryMenu ? 'rotate-180' : ''}`} />
          </div>

          {/* Dropdown Container */}
          {showCategoryMenu && categories.length > 0 && (
            <div className="absolute top-full left-0 w-[260px] z-50">
              <CategoryMenu categories={categories} />
            </div>
          )}
        </div>

        <ul className="flex items-center gap-8 text-[13px] font-bold tracking-wide flex-1">
          
          {/* SẢN PHẨM Link */}
          <li>
            <Link href="/category/all" className="flex items-center gap-1 py-4 hover:text-red-400 hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.5)] transition-all duration-300">
              <span className="uppercase relative inline-block">
                Tất Cả Sản Phẩm
                {/* Badge */}
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-red-600 to-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-sm whitespace-nowrap shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                  SHOP
                  {/* Small triangle pointing down */}
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-[3px] border-transparent border-t-red-500"></span>
                </span>
              </span>
            </Link>
          </li>

          <li className="relative group">
            <div className="py-4 block hover:text-red-400 transition-colors uppercase flex items-center gap-1 cursor-pointer">
              Chính Sách Tổng Hợp <ChevronDown size={14} className="text-gray-400 group-hover:rotate-180 group-hover:text-red-400 transition-all duration-300" />
            </div>
            
            {/* Dropdown Menu */}
            <div className="absolute top-full left-0 w-60 bg-white/95 backdrop-blur-xl text-gray-800 shadow-[0_20px_40px_rgba(0,0,0,0.1)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top -translate-y-2 group-hover:translate-y-0 border-t-2 border-red-500 rounded-b-xl overflow-hidden z-50">
              <ul className="py-2">
                {[
                  { title: 'Chính sách bảo mật', link: '/chinh-sach-bao-mat' },
                  { title: 'Chính sách vận chuyển', link: '/chinh-sach-van-chuyen' },
                  { title: 'Chính sách bảo hành', link: '/chinh-sach-bao-hanh' },
                  { title: 'Chính sách đổi trả', link: '/chinh-sach-doi-tra' },
                  { title: 'Chính sách thanh toán', link: '/chinh-sach-thanh-toan' },
                ].map((item, idx) => (
                  <li key={idx}>
                    <Link href={item.link} className="block px-5 py-3 hover:bg-red-50/50 hover:text-red-600 hover:pl-6 transition-all duration-300 text-[13px] font-bold border-b border-gray-100 last:border-0 uppercase">
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </li>
          <li className="relative group">
            <div className="py-4 block hover:text-red-400 transition-colors uppercase flex items-center gap-1 cursor-pointer">
              Về ZCOMPUTER <ChevronDown size={14} className="text-gray-400 group-hover:rotate-180 group-hover:text-red-400 transition-all duration-300" />
            </div>
            
            {/* Dropdown Menu */}
            <div className="absolute top-full left-0 w-60 bg-white/95 backdrop-blur-xl text-gray-800 shadow-[0_20px_40px_rgba(0,0,0,0.1)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top -translate-y-2 group-hover:translate-y-0 border-t-2 border-red-500 rounded-b-xl overflow-hidden z-50">
              <ul className="py-2">
                {[
                  { title: 'Giới Thiệu Về ZCOMPUTER', link: '/ve-chung-toi' },
                  { title: 'Liên Hệ', link: '/lien-he' },
                  { title: 'Tuyển Dụng', link: '/tuyen-dung' },
                ].map((item, idx) => (
                  <li key={idx}>
                    <Link href={item.link} className="block px-5 py-3 hover:bg-red-50/50 hover:text-red-600 hover:pl-6 transition-all duration-300 text-[13px] font-bold border-b border-gray-100 last:border-0 uppercase">
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </li>
          <li>
            <Link href="/thu-mua-cu" className="py-4 block hover:text-red-400 transition-colors uppercase">
              Thu cũ đổi mới
            </Link>
          </li>
          <li>
            <Link href="/gioi-thieu-ban-be" className="py-4 block hover:text-red-400 transition-colors uppercase">
              Giới thiệu bạn bè
            </Link>
          </li>
        </ul>
        
        {/* Freeship Badge */}
        <div className="hidden xl:flex items-center gap-3 ml-auto pr-8 cursor-pointer group">
          <div className="flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#E30019" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              {/* Outer Arrow */}
              <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
              {/* Inner Globe */}
              <circle cx="12" cy="12" r="4.5" />
              <path d="M12 7.5c1.5 0 2.5 2 2.5 4.5s-1 4.5-2.5 4.5-2.5-2-2.5-4.5 1-4.5 2.5-4.5z" />
              <path d="M7.5 12h9" />
            </svg>
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex flex-col">
              <span className="text-white text-[15px] font-black uppercase tracking-wide leading-none mb-[4px]">GIAO HÀNG TẬN NƠI</span>
              <div className="w-full h-[2.5px] bg-[#d90467]"></div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="hidden xl:flex items-center gap-5 border-l border-white/10 pl-8">
          <a href="https://www.facebook.com/pcgamingthuduc" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#1877F2] transition-all duration-300 hover:-translate-y-1 hover:scale-110 drop-shadow-md" title="Facebook">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
          <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#FF0000] transition-all duration-300 hover:-translate-y-1 hover:scale-110 drop-shadow-md" title="YouTube">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="none">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </a>
          <a href="https://vt.tiktok.com/ZSQxHwj4q/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-all duration-300 hover:-translate-y-1 hover:scale-110 drop-shadow-md" title="TikTok">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/>
            </svg>
          </a>
          <a href="https://zalo.me/0977334415" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#0068FF] transition-all duration-300 hover:-translate-y-1 hover:scale-110 drop-shadow-md flex items-center justify-center font-black text-[13px] tracking-wider" title="Zalo">
            Zalo
          </a>
        </div>
      </div>
    </div>
  );
}
