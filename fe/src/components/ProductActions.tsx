"use client";

import { useCartStore } from "@/store/useCartStore";
import { useState } from "react";
import { Heart, MessageCircle, ShoppingCart, CreditCard, Phone, X } from "lucide-react";
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
  const [showContactModal, setShowContactModal] = useState(false);
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
    setShowContactModal(true);
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
          onClick={() => toast.success("Đã thêm vào mục yêu thích!")}
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

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="bg-primary p-5 flex items-center justify-between">
              <h3 className="text-white font-bold text-xl uppercase">Liên hệ để mua hàng</h3>
              <button 
                onClick={() => setShowContactModal(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-gray-600 mb-6 text-center text-[15px]">
                Để mua hàng hoặc nhận báo giá chi tiết cho sản phẩm bạn đã chọn, vui lòng liên hệ với chúng tôi qua các kênh sau:
              </p>

              <div className="flex flex-col md:flex-row gap-5 items-stretch">
                <div className="flex flex-col gap-4 w-full">
                  <a 
                    href="tel:0977334415" 
                    className="flex items-center gap-4 bg-gray-50 hover:bg-red-50 p-4 rounded-xl border border-gray-100 transition-colors group h-full"
                  >
                    <div className="w-12 h-12 bg-red-100 text-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                      <Phone size={24} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-500 uppercase">Gọi Hotline</div>
                      <div className="text-xl font-black text-gray-900">0977 334 415</div>
                    </div>
                  </a>

                  <a 
                    href={`https://zalo.me/0977334415?text=${encodeURIComponent(
                      "Chào ZCOMPUTER, mình cần tư vấn báo giá sản phẩm sau:\n" + 
                      `1. ${product.name} (x${qty}) - Giá: ${product.price.toLocaleString('vi-VN')}đ` +
                      `\n\nTổng cộng: ${(product.price * qty).toLocaleString('vi-VN')}đ`
                    )}`}
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-4 bg-gray-50 hover:bg-blue-50 p-4 rounded-xl border border-gray-100 transition-colors group h-full"
                  >
                    <div className="w-12 h-12 bg-blue-100 text-[#0068FF] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                      <MessageCircle size={24} />
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold text-gray-500 uppercase">Chat Zalo Nhận Báo Giá</div>
                      <div className="text-[17px] font-black text-gray-900">Gửi Cấu Hình</div>
                    </div>
                  </a>

                  <a 
                    href="https://m.me/pcgamingthuduc"
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-4 bg-gray-50 hover:bg-[#EBF5FF] p-4 rounded-xl border border-gray-100 transition-colors group h-full"
                  >
                    <div className="w-12 h-12 bg-[#EBF5FF] text-[#0084FF] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path d="M12 2C6.477 2 2 6.145 2 11.259c0 2.922 1.503 5.516 3.844 7.234v3.507c0 .445.511.693.864.417l3.226-2.52c1.037.288 2.13.441 3.266.441 5.523 0 10-4.145 10-9.259S17.523 2 12 2zm1.189 12.392l-2.48-2.656-4.839 2.656 5.3-5.632 2.502 2.673 4.818-2.673-5.301 5.632z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold text-gray-500 uppercase">Nhắn tin Messenger</div>
                      <div className="text-[17px] font-black text-gray-900">Fanpage Facebook</div>
                    </div>
                  </a>
              </div>
              
              <div className="mt-8 text-center">
                <button 
                  onClick={() => setShowContactModal(false)}
                  className="text-gray-500 hover:text-gray-800 font-medium underline transition-colors"
                >
                  Đóng cửa sổ này
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
