"use client";

import { useState } from "react";
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
  const [isLiked, setIsLiked] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(true);
    addItem({
      _id: product._id,
      name: product.name,
      price: product.price,
      discountPrice: product.discountPrice,
      image: product.images?.[0] || "",
      quantity: 1,
    });
    toast.success("Đã thêm vào giỏ hàng!");
  };

  return (
    <button 
      className="relative z-30 focus:outline-none ml-auto"
      onClick={handleClick}
      aria-label="Thêm vào giỏ"
    >
      <Heart 
        size={20} 
        className={`cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 ${isLiked ? 'text-red-500 fill-red-500' : 'text-red-600 hover:text-red-500'}`} 
      />
    </button>
  );
}
