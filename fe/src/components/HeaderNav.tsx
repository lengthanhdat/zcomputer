"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, Menu } from "lucide-react";
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
    <div className="hidden lg:block bg-[#111111] text-white relative z-40">
      <div className="container mx-auto px-4 relative flex items-center">
        
        {/* VERTICAL CATEGORY MENU DROPDOWN */}
        <div 
          className="relative mr-8"
          onMouseEnter={() => setShowCategoryMenu(true)}
          onMouseLeave={() => setShowCategoryMenu(false)}
        >
          <div className="bg-[#eebd53] text-white flex items-center gap-2 px-5 py-4 cursor-pointer hover:bg-[#dca43b] transition-colors">
            <Menu size={20} />
            <span className="font-bold tracking-wider uppercase">MENU</span>
            <ChevronDown size={16} className={`transition-transform duration-300 ml-2 ${showCategoryMenu ? 'rotate-180' : ''}`} />
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
            <Link href="/category/all" className="flex items-center gap-1 py-4 hover:text-primary transition-colors">
              <span className="uppercase relative inline-block">
                Tất Cả Sản Phẩm
                {/* Badge */}
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 bg-white text-black text-[9px] font-black px-1.5 py-0.5 rounded-sm whitespace-nowrap shadow-sm">
                  SHOP
                  {/* Small triangle pointing down */}
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-[3px] border-transparent border-t-white"></span>
                </span>
              </span>
            </Link>
          </li>

          <li className="relative group">
            <div className="py-4 block hover:text-primary transition-colors uppercase flex items-center gap-1 cursor-pointer">
              Chính Sách Tổng Hợp <ChevronDown size={14} className="text-gray-400 group-hover:rotate-180 transition-transform duration-300" />
            </div>
            
            {/* Dropdown Menu */}
            <div className="absolute top-full left-0 w-60 bg-white text-gray-800 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top -translate-y-2 group-hover:translate-y-0 border-t-2 border-primary z-50">
              <ul className="py-2">
                {[
                  { title: 'Chính sách bảo mật', link: '/chinh-sach-bao-mat' },
                  { title: 'Chính sách vận chuyển', link: '/chinh-sach-van-chuyen' },
                  { title: 'Chính sách bảo hành', link: '/chinh-sach-bao-hanh' },
                  { title: 'Chính sách đổi trả', link: '/chinh-sach-doi-tra' },
                  { title: 'Chính sách thanh toán', link: '/chinh-sach-thanh-toan' },
                  { title: 'Hướng dẫn mua hàng', link: '/huong-dan-mua-hang' },
                ].map((item, idx) => (
                  <li key={idx}>
                    <Link href={item.link} className="block px-5 py-3 hover:bg-gray-50 hover:text-primary hover:pl-6 transition-all duration-300 text-[13px] font-bold border-b border-gray-50 last:border-0 uppercase">
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </li>
          <li>
            <Link href="/ve-chung-toi" className="py-4 block hover:text-primary transition-colors uppercase flex items-center gap-1">
              Về ZCOMPUTER <ChevronDown size={14} className="text-gray-400" />
            </Link>
          </li>

        </ul>
      </div>
    </div>
  );
}
