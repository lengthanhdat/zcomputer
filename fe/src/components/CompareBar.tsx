"use client";

import { useCompareStore } from "@/store/useCompareStore";
import Image from "next/image";
import Link from "next/link";
import { X, Scale, ChevronUp, ChevronDown } from "lucide-react";
import { useState } from "react";
import CompareSearchModal from "./CompareSearchModal";

export default function CompareBar() {
  const { items, removeItem, clearCompare, isMobileBuyBarVisible } = useCompareStore();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  if (items.length === 0) return null;

  return (
    <>
      <style>{`
        @media (max-width: 639px) {
          .compare-mobile-offset {
            bottom: calc(68px + env(safe-area-inset-bottom)) !important;
          }
        }
        @media (min-width: 640px) {
          .compare-mobile-offset {
            bottom: 0px !important;
          }
        }
      `}</style>
      <div 
        className={`fixed left-0 right-0 z-[100] transition-all duration-300 ${isExpanded ? 'translate-y-0' : 'translate-y-[calc(100%-48px)] sm:translate-y-[calc(100%-56px)]'} ${isMobileBuyBarVisible ? 'compare-mobile-offset' : 'bottom-0'}`}
      >
        <div className="bg-white/80 backdrop-blur-xl border-t border-white shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.1)] rounded-t-3xl max-w-6xl mx-auto flex flex-col ring-1 ring-black/5">
        
        {/* Header Toggle */}
        <div 
          className="h-12 sm:h-14 flex items-center justify-between px-4 sm:px-6 cursor-pointer hover:bg-white/50 rounded-t-3xl transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2 font-bold text-primary text-sm sm:text-base">
            <Scale size={18} className="sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">SO SÁNH SẢN PHẨM</span>
            <span className="sm:hidden">SO SÁNH</span>
            <span className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs sm:w-6 sm:h-6 sm:text-sm shadow-sm">{items.length}</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <button 
              className="text-xs sm:text-sm text-gray-500 hover:text-red-500 hover:underline font-medium"
              onClick={(e) => { e.stopPropagation(); clearCompare(); }}
            >
              Xóa tất cả
            </button>
            {isExpanded ? <ChevronDown size={20} className="text-gray-400" /> : <ChevronUp size={20} className="text-gray-400" />}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 p-3 sm:p-5 pt-0">
          
          <div className="flex flex-1 gap-3 overflow-x-auto snap-x pb-2 lg:pb-0 scrollbar-hide p-1">
            {items.map((item) => (
              <div key={item._id} className="relative flex flex-row items-center gap-3 bg-white/60 backdrop-blur-md border border-white rounded-2xl p-2 sm:p-3 min-w-[260px] sm:min-w-[240px] flex-1 snap-start shadow-[0_4px_15px_-5px_rgba(0,0,0,0.05)] transition-all hover:bg-white/80">
                <button 
                  onClick={() => removeItem(item._id)}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-md z-10 transition-transform hover:scale-110 active:scale-95"
                >
                  <X size={14} />
                </button>
                <div className="w-14 h-14 sm:w-20 sm:h-20 relative bg-white/80 rounded-xl border border-white shadow-inner flex-shrink-0">
                  {(item.images?.[0] || item.image) ? (
                    <Image src={item.images?.[0] || item.image || ''} alt={item.name} fill className="object-cover rounded-xl p-1.5" unoptimized />
                  ) : null}
                </div>
                <div className="flex flex-col w-full text-left overflow-hidden pr-6">
                  <Link href={`/${item.slug}`} className="text-xs sm:text-sm font-bold text-gray-800 truncate hover:text-primary transition-colors mb-0.5 drop-shadow-sm">
                    {item.name}
                  </Link>
                  <span className="text-primary font-black text-sm sm:text-base drop-shadow-sm">{((item.discountPrice ?? 0) > item.price ? item.price : item.price).toLocaleString("vi-VN")}đ</span>
                </div>
              </div>
            ))}

            {/* Empty Slots */}
            {[...Array(3 - items.length)].map((_, i) => (
              <div 
                key={`empty-${i}`} 
                onClick={() => setIsSearchOpen(true)}
                className="flex flex-row items-center justify-center gap-2 sm:gap-3 bg-white/30 backdrop-blur-sm border-2 border-dashed border-white/80 rounded-2xl p-2 sm:p-3 min-w-[160px] sm:min-w-[240px] h-[74px] sm:h-[110px] text-gray-500 flex-1 hover:border-primary/40 hover:bg-white/50 transition-all cursor-pointer shadow-sm"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/60 shadow-sm flex items-center justify-center text-primary/70 shrink-0">
                  <span className="text-xl sm:text-2xl leading-none -mt-0.5 sm:-mt-1">+</span>
                </div>
                <span className="text-xs sm:text-sm font-semibold">Thêm máy</span>
              </div>
            ))}
          </div>

          <Link 
            href="/compare"
            className="shrink-0 bg-gradient-to-r from-primary to-primary/90 text-white h-[44px] lg:h-[110px] px-6 lg:px-8 rounded-2xl font-black flex flex-row lg:flex-col items-center justify-center gap-2 hover:brightness-110 shadow-[0_8px_25px_-5px_rgba(var(--primary-rgb),0.5)] transition-all hover:-translate-y-1 active:translate-y-0"
          >
            <Scale size={24} className="lg:w-9 lg:h-9 lg:mb-1 drop-shadow-md" />
            <span className="text-sm lg:text-base tracking-wide">SO SÁNH NGAY</span>
          </Link>
        </div>

      </div>
      </div>
      
      <CompareSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
