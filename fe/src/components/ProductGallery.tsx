"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductGallery({ images, altText }: { images: string[], altText: string }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-[4/3] bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400">
        <span className="text-sm font-bold">Chưa có hình ảnh</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="w-full aspect-[4/3] relative bg-gradient-to-tr from-gray-100 to-gray-50 rounded-2xl border border-gray-200/60 shadow-inner overflow-hidden group flex items-center justify-center">
        <Image 
          src={images[activeIndex]} 
          alt={`${altText} - ${activeIndex + 1}`} 
          fill 
          priority 
          sizes="(min-width: 768px) 50vw, 100vw" 
          className="object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500 cursor-zoom-in p-10" 
          unoptimized 
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button 
              onClick={(e) => { e.stopPropagation(); setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1)); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/80 backdrop-blur shadow-md flex items-center justify-center text-gray-700 hover:text-primary hover:bg-white hover:scale-110 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1)); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/80 backdrop-blur shadow-md flex items-center justify-center text-gray-700 hover:text-primary hover:bg-white hover:scale-110 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* ZCOMPUTER Overlay Frame */}
        <div className="absolute inset-0 pointer-events-none z-20 p-3 sm:p-4 opacity-90">
          <div className="w-full h-full border-[1.5px] border-primary/20 rounded-xl relative">
            {/* 4 Góc màu đỏ */}
            <div className="absolute -top-[1.5px] -left-[1.5px] w-8 h-8 border-t-[3px] border-l-[3px] border-primary rounded-tl-xl"></div>
            <div className="absolute -top-[1.5px] -right-[1.5px] w-8 h-8 border-t-[3px] border-r-[3px] border-primary rounded-tr-xl"></div>
            <div className="absolute -bottom-[1.5px] -left-[1.5px] w-8 h-8 border-b-[3px] border-l-[3px] border-primary rounded-bl-xl"></div>
            <div className="absolute -bottom-[1.5px] -right-[1.5px] w-8 h-8 border-b-[3px] border-r-[3px] border-primary rounded-br-xl"></div>
            
            {/* Logo Thương hiệu Watermark */}
            <div className="absolute top-4 left-4 flex items-center gap-2 opacity-80 mix-blend-multiply">
              <Image src="/logo.webp" alt="ZCOMPUTER" width={32} height={32} className="w-8 h-8 object-contain" unoptimized />
              <div className="flex items-baseline select-none tracking-tighter">
                <span className="text-red-600 font-black text-xl sm:text-2xl drop-shadow-sm">Z</span>
                <span className="text-slate-800 font-black text-lg sm:text-xl uppercase drop-shadow-sm">COMPUTER</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto p-2 pb-4 scrollbar-hide snap-x">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-white transition-all duration-300 snap-start ${
                activeIndex === idx ? "ring-2 ring-primary ring-offset-2 scale-105 shadow-md" : "border border-gray-200 hover:border-primary/50 opacity-60 hover:opacity-100"
              }`}
            >
              <Image 
                src={img} 
                alt={`${altText} thumbnail ${idx + 1}`} 
                fill 
                className="object-contain mix-blend-multiply p-2" 
                unoptimized 
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
