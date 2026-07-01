"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import toast from "react-hot-toast";

type ProductProps = {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  images?: string[];
};

export default function LikeButton({ product }: { product: ProductProps }) {
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLiked = items.some(item => item._id === product._id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLiked) {
      removeItem(product._id);
      toast.success("Đã xóa khỏi mục Ưa thích!");
    } else {
      addItem({
        _id: product._id,
        name: product.name,
        price: product.price,
        discountPrice: product.discountPrice,
        image: product.images?.[0] || "",
        quantity: 1,
      });
      toast.success("Đã thêm vào mục Ưa thích!");
    }
  };

  if (!mounted) {
    return (
      <button 
        className="relative z-20 focus:outline-none ml-auto"
        aria-label="Thêm vào ưa thích"
      >
        <Heart 
          size={20} 
          className="text-gray-300 transition-all duration-300" 
        />
      </button>
    );
  }

  return (
    <button 
      onClick={handleClick}
      className="relative z-20 focus:outline-none ml-auto group/like"
      aria-label={isLiked ? "Xóa khỏi ưa thích" : "Thêm vào ưa thích"}
    >
      <Heart 
        size={20} 
        className={`cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 ${isLiked ? 'text-primary fill-primary' : 'text-primary hover:text-primary'}`} 
      />
    </button>
  );
}
