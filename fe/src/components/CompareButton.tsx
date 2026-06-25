"use client";

import { useEffect, useState } from "react";
import { Scale } from "lucide-react";
import { useCompareStore } from "@/store/useCompareStore";

type ProductProps = {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  images?: string[];
  specs?: any;
  slug?: string;
};

export default function CompareButton({ product }: { product: ProductProps }) {
  const [mounted, setMounted] = useState(false);
  const items = useCompareStore((state) => state.items);
  const addItem = useCompareStore((state) => state.addItem);
  const removeItem = useCompareStore((state) => state.removeItem);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isCompared = items.some(item => item._id === product._id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isCompared) {
      removeItem(product._id);
    } else {
      addItem({
        _id: product._id,
        name: product.name,
        price: product.price,
        discountPrice: product.discountPrice,
        image: product.images?.[0] || "",
        specs: product.specs,
        slug: product.slug || product._id
      });
    }
  };

  if (!mounted) {
    return (
      <button 
        className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-primary transition-colors cursor-pointer z-40"
        aria-label="So sánh"
      >
        <Scale size={16} />
      </button>
    );
  }

  return (
    <button 
      onClick={handleClick}
      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer z-40 relative group/compare ${
        isCompared ? 'bg-primary/10 text-primary' : 'bg-gray-50 text-gray-400 hover:text-primary hover:bg-primary/5'
      }`}
      aria-label="So sánh"
    >
      <Scale 
        size={16} 
        className={`transition-all duration-300 ${isCompared ? 'scale-110 drop-shadow-md' : 'group-hover/compare:scale-110'}`} 
      />
      {/* Tooltip */}
      <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[11px] font-medium px-2 py-1 rounded opacity-0 group-hover/compare:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md">
        {isCompared ? 'Đã thêm so sánh' : 'Thêm so sánh'}
        <span className="absolute left-1/2 -bottom-[4px] -translate-x-1/2 border-[4px] border-transparent border-t-gray-800"></span>
      </span>
    </button>
  );
}
