"use client";

import { useCompareStore } from "@/store/useCompareStore";
import { useCartStore } from "@/store/useCartStore";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Truck, ShoppingCart, Trash2, ArrowLeft, CheckCircle2, X } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";
import CompareSearchModal from "@/components/CompareSearchModal";



export default function CompareClient() {
  const { items, removeItem, clearCompare } = useCompareStore();
  const addItemToCart = useCartStore((state) => state.addItem);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Lấy tất cả các thuộc tính (keys) độc nhất từ tất cả sản phẩm
  const allSpecKeys = Array.from(
    new Set(
      items.flatMap((item) => (item.specs ? Object.keys(item.specs) : []))
    )
  );

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6 text-gray-400">
          <ShieldCheck size={48} />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">Chưa có sản phẩm nào để so sánh</h1>
        <p className="text-gray-500 mb-8 text-center max-w-md">
          Bạn chưa chọn sản phẩm nào vào danh sách so sánh. Hãy quay lại trang chủ hoặc danh mục để chọn sản phẩm nhé!
        </p>
        <Link href="/" className="bg-primary text-white px-8 py-3 rounded-full font-bold shadow-lg hover:brightness-110 flex items-center gap-2">
          <ArrowLeft size={20} /> Quay lại mua sắm
        </Link>
      </div>
    );
  }

  const handleAddToCart = (product: any) => {
    addItemToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      discountPrice: product.discountPrice,
      image: product.images?.[0] || product.image,
      quantity: 1
    });
    toast.success('Đã thêm vào mục ưa thích!');
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div className="flex items-start sm:items-center gap-3 sm:gap-4">
            <Link href="/" className="mt-0.5 sm:mt-0 w-9 h-9 sm:w-10 sm:h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary transition-colors shadow-sm shrink-0">
              <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
            </Link>
            <div>
              <h1 className="text-xl md:text-3xl font-black text-gray-800 uppercase leading-tight">So sánh cấu hình</h1>
              <p className="text-gray-500 mt-1 text-xs sm:text-sm md:text-base">So sánh chi tiết các thông số kỹ thuật</p>
            </div>
          </div>
          <button 
            onClick={clearCompare}
            className="text-red-500 hover:bg-red-50 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-bold flex items-center gap-1.5 sm:gap-2 transition-colors border border-red-200 self-start sm:self-auto text-sm sm:text-base"
          >
            <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span>Xóa tất cả</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto relative scrollbar-hide">
          <table className="w-full min-w-[500px] sm:min-w-[800px] text-left border-collapse">
            <thead>
              <tr>
                <th className="hidden sm:table-cell w-24 sm:w-48 bg-gray-50/95 backdrop-blur-sm p-3 sm:p-6 border-b border-r border-gray-100 text-gray-500 font-bold uppercase text-[10px] sm:text-sm sticky left-0 z-30 shadow-[4px_0_15px_-5px_rgba(0,0,0,0.05)]">
                  Sản phẩm
                </th>
                {items.map((item) => (
                  <th key={item._id} className="w-[180px] sm:w-[300px] p-3 sm:p-6 border-b border-gray-100 relative align-top">
                    <button 
                      onClick={() => removeItem(item._id)}
                      className="absolute top-2 right-2 sm:top-4 sm:right-4 w-6 h-6 sm:w-8 sm:h-8 bg-white border border-gray-200 text-gray-500 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white hover:border-red-500 transition-all z-20 shadow-sm"
                    >
                      <X size={14} className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                    <div className="flex flex-col h-full">
                      <div className="w-full aspect-[4/3] relative bg-white border border-gray-100 rounded-xl mb-3 sm:mb-4 overflow-hidden p-2 sm:p-4 flex items-center justify-center">
                        {(item.images?.[0] || item.image) ? (
                          <Image src={item.images?.[0] || item.image || ''} alt={item.name} fill className="object-contain p-1 sm:p-2" unoptimized />
                        ) : null}
                      </div>
                      <Link href={`/${item.slug}`} className="text-[13px] sm:text-[15px] font-bold text-gray-800 line-clamp-2 hover:text-primary transition-colors mb-2 min-h-[38px] sm:min-h-[45px]">
                        {item.name}
                      </Link>
                      
                      <div className="pt-2 min-h-[44px] sm:min-h-[56px] flex flex-col justify-end">
                        {(item.discountPrice ?? 0) > item.price ? (
                          <div className="flex flex-col">
                            <span className="text-xs sm:text-sm text-gray-400 line-through leading-none mb-0.5">{item.discountPrice?.toLocaleString("vi-VN")}đ</span>
                            <span className="text-base sm:text-xl font-black text-primary leading-none">{item.price.toLocaleString("vi-VN")}đ</span>
                          </div>
                        ) : (
                          <span className="text-base sm:text-xl font-black text-primary leading-none">{item.price.toLocaleString("vi-VN")}đ</span>
                        )}
                      </div>

                      <button 
                        onClick={() => handleAddToCart(item)}
                        className="mt-3 sm:mt-4 w-full bg-primary/10 text-primary hover:bg-primary hover:text-white font-bold py-2 sm:py-2.5 rounded-lg flex items-center justify-center gap-1.5 sm:gap-2 transition-colors border border-primary/20 text-sm sm:text-base"
                      >
                        <ShoppingCart size={16} className="sm:w-[18px] sm:h-[18px]" /> <span className="hidden sm:inline">Mua ngay</span><span className="sm:hidden">Mua</span>
                      </button>
                    </div>
                  </th>
                ))}
                
                {/* Empty columns to keep grid layout fixed if < 3 items */}
                {[...Array(3 - items.length)].map((_, i) => (
                  <th key={`empty-${i}`} className="w-[180px] sm:w-[300px] p-3 sm:p-6 border-b border-gray-100 align-middle text-center bg-gray-50/50">
                    <div 
                      onClick={() => setIsSearchOpen(true)}
                      className="border-2 border-dashed border-gray-200 rounded-xl aspect-[4/3] flex flex-col items-center justify-center text-gray-400 hover:border-primary/50 hover:text-primary transition-colors cursor-pointer opacity-50 hover:opacity-100 bg-white"
                    >
                      <span className="text-3xl sm:text-4xl mb-1 sm:mb-2">+</span>
                      <span className="text-xs sm:text-sm font-medium">Thêm máy</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>


              {/* Specs Rows */}
              {allSpecKeys.map((specKey) => {
                return (
                  <tr key={specKey} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="hidden sm:table-cell bg-gray-50/95 backdrop-blur-sm p-3 sm:p-4 border-b border-r border-gray-100 font-bold text-gray-700 text-[11px] sm:text-sm sticky left-0 z-10 shadow-[4px_0_15px_-5px_rgba(0,0,0,0.05)] group-hover:bg-blue-50/95 transition-colors">
                      {specKey}
                    </td>
                    {items.map((item) => {
                      const val = item.specs ? item.specs[specKey] : null;
                      
                      return (
                        <td key={item._id} className="p-3 sm:p-4 border-b border-gray-100 text-xs sm:text-sm text-gray-700 leading-relaxed align-top">
                          <span className="block sm:hidden font-bold text-gray-400 text-[10px] uppercase mb-1 tracking-wider">{specKey}</span>
                          <div className="mt-0.5">{val || '-'}</div>
                        </td>
                      );
                    })}
                    {[...Array(3 - items.length)].map((_, i) => <td key={`empty-row-${specKey}-${i}`} className="p-3 sm:p-4 border-b border-gray-100 bg-gray-50/50"></td>)}
                  </tr>
                );
              })}
              
            </tbody>
          </table>
        </div>
      </div>
      
      <CompareSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
