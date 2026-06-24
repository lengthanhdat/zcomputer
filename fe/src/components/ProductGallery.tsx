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
      {/* Main Image Container */}
      <div className="w-full aspect-[4/3] relative bg-[#f8f9fa] rounded-2xl border border-gray-200 overflow-hidden group flex items-center justify-center">
        
        {/* Subtle Tech Background (Dot Matrix) */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>

        {/* The Product Image */}
        <Image 
          src={images[activeIndex]} 
          alt={`${altText} - ${activeIndex + 1}`} 
          fill 
          priority 
          sizes="(min-width: 768px) 50vw, 100vw" 
          className="object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500 cursor-zoom-in p-6 sm:p-12 z-10" 
          unoptimized 
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button 
              onClick={(e) => { e.stopPropagation(); setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1)); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/90 backdrop-blur shadow-md flex items-center justify-center text-gray-700 hover:text-primary hover:bg-white hover:scale-110 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1)); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/90 backdrop-blur shadow-md flex items-center justify-center text-gray-700 hover:text-primary hover:bg-white hover:scale-110 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Premium Tech Corners (Exactly as sketched) */}
        <div className="absolute inset-0 pointer-events-none z-20">
          {/* Top Left */}
          <div className="absolute top-0 left-0 w-10 h-10 sm:w-14 sm:h-14 border-t-[3px] border-l-[3px] border-primary rounded-tl-2xl"></div>
          {/* Top Right */}
          <div className="absolute top-0 right-0 w-10 h-10 sm:w-14 sm:h-14 border-t-[3px] border-r-[3px] border-primary rounded-tr-2xl"></div>
          {/* Bottom Left */}
          <div className="absolute bottom-0 left-0 w-10 h-10 sm:w-14 sm:h-14 border-b-[3px] border-l-[3px] border-primary rounded-bl-2xl"></div>
          {/* Bottom Right */}
          <div className="absolute bottom-0 right-0 w-10 h-10 sm:w-14 sm:h-14 border-b-[3px] border-r-[3px] border-primary rounded-br-2xl"></div>
        </div>

        {/* Logo Thương hiệu Watermark */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 opacity-60 mix-blend-multiply z-20 pointer-events-none">
          <Image src="/logo_broken.png" alt="ZCOMPUTER" width={32} height={32} className="w-6 h-6 sm:w-8 sm:h-8 object-contain" unoptimized />
          <div className="flex items-baseline select-none tracking-tighter drop-shadow-sm">
            <span className="text-primary font-black text-xl sm:text-2xl">Z</span>
            <span className="text-slate-800 font-black text-lg sm:text-xl uppercase">COMPUTER</span>
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
