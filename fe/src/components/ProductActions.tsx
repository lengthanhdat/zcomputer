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
      <div className="flex items-center gap-3">
        <span className="font-semibold text-gray-700">Số lượng:</span>
        <div className="flex items-center border rounded-md bg-white overflow-hidden shadow-sm">
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
        <span className="text-sm text-gray-500">
          {isOutOfStock ? "(Hết hàng)" : `(Còn lại ${product.stock} sản phẩm)`}
        </span>
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

      {/* Mobile Sticky Bottom Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 flex gap-3 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] pb-safe">
        <a
          href="https://zalo.me/0977334415"
          target="_blank"
          rel="noreferrer"
          className="w-14 bg-[#0068FF] text-white rounded-xl flex flex-col items-center justify-center shadow-lg shadow-blue-500/20"
        >
          <MessageCircle size={24} />
        </a>
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="flex-1 border border-primary text-primary rounded-xl font-bold text-[13px] uppercase flex flex-col items-center justify-center gap-1 disabled:opacity-50 bg-red-50/50"
        >
          Thêm giỏ hàng
        </button>
        <button
          onClick={handleBuyNow}
          disabled={isOutOfStock}
          className="flex-1 bg-primary text-white rounded-xl font-bold text-[13px] uppercase flex flex-col items-center justify-center gap-1 shadow-lg shadow-red-500/20 disabled:opacity-50"
        >
          Mua ngay
        </button>
      </div>
    </div>
  );
}
