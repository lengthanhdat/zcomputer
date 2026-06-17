"use client";

import { useCartStore } from "@/store/useCartStore";
import { useState } from "react";
import { Heart, MessageCircle, ShoppingCart, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type ProductActionsProps = {
  product: {
    _id: string;
    name: string;
    price: number;
    discountPrice?: number;
    image: string;
    stock: number;
  };
};

export default function ProductActions({ product }: ProductActionsProps) {
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      toast.error("Sản phẩm đã hết hàng!");
      return;
    }
    addItem({
      _id: product._id,
      name: product.name,
      price: product.price,
      discountPrice: product.discountPrice,
      image: product.image,
      quantity: qty,
    });
    toast.success("Đã thêm sản phẩm vào giỏ hàng!");
  };

  const handleBuyNow = () => {
    if (product.stock <= 0) {
      toast.error("Sản phẩm đã hết hàng!");
      return;
    }
    addItem({
      _id: product._id,
      name: product.name,
      price: product.price,
      discountPrice: product.discountPrice,
      image: product.image,
      quantity: qty,
    });
    router.push("/cart");
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3 flex-wrap">
        <span className="font-semibold text-gray-700 whitespace-nowrap">Số lượng:</span>
        <div className="flex items-center border rounded-md bg-white overflow-hidden shadow-sm shrink-0">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={isOutOfStock}
            className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 font-bold disabled:opacity-50"
          >
            -
          </button>
          <span className="w-12 text-center font-semibold text-gray-800">{isOutOfStock ? 0 : qty}</span>
          <button
            onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
            disabled={isOutOfStock}
            className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 font-bold disabled:opacity-50"
          >
            +
          </button>
        </div>
        {isOutOfStock && (
          <span className="text-sm text-red-500 whitespace-nowrap font-medium">
            (Hết hàng)
          </span>
        )}
      </div>

      {/* Desktop Buttons */}
      <div className="hidden sm:flex gap-4">
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="flex-1 border-2 border-primary text-primary hover:bg-red-50 py-4 rounded-lg font-bold text-lg uppercase transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <ShoppingCart size={20} />
          Thêm vào giỏ hàng
        </button>

        <button
          onClick={handleBuyNow}
          disabled={isOutOfStock}
          className="flex-1 bg-primary text-white hover:bg-red-600 py-4 rounded-lg font-bold text-lg uppercase transition-all shadow-lg shadow-red-500/20 flex flex-center items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <CreditCard size={20} />
          Mua ngay
        </button>
      </div>

      {/* Mobile Sticky Bottom Bar (Liquid Glass Design) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white/70 backdrop-blur-xl border-t border-white/40 p-3 pb-safe flex items-center gap-3 z-50 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
        
        {/* Price Section */}
        <div className="flex-1 flex flex-col justify-center min-w-0">
           {(product.discountPrice ?? 0) > product.price && (
             <div className="text-[11px] text-gray-500 line-through mb-0.5 truncate">{product.discountPrice?.toLocaleString("vi-VN")}đ</div>
           )}
           <div className="text-[17px] font-black text-red-600 leading-none truncate">{product.price.toLocaleString("vi-VN")}đ</div>
        </div>

        {/* Favorite Button (Replaces Add to Cart) */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="w-11 h-11 shrink-0 rounded-xl flex items-center justify-center bg-white/50 border border-white/60 shadow-sm backdrop-blur-md text-red-500 hover:bg-red-50 active:scale-95 transition-all"
          aria-label="Thêm vào ưa thích"
        >
          <Heart size={22} className="fill-red-500 text-red-500" />
        </button>

        {/* Buy Now Button */}
        <button
          onClick={handleBuyNow}
          disabled={isOutOfStock}
          className="flex-[1.2] h-11 bg-gradient-to-r from-red-600 to-primary text-white rounded-xl font-bold text-[14px] uppercase flex items-center justify-center gap-1.5 shadow-[0_4px_15px_rgba(220,38,38,0.3)] disabled:opacity-50 active:scale-95 transition-transform"
        >
          <CreditCard size={18} />
          Mua ngay
        </button>
      </div>
    </div>
  );
}
