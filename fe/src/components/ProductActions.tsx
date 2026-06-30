"use client";
import Image from "next/image";

import { useCartStore } from "@/store/useCartStore";
import { useState, useEffect } from "react";
import { Heart, MessageCircle, ShoppingCart, CreditCard, Phone, X, Scale } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCompareStore } from "@/store/useCompareStore";
import toast from "react-hot-toast";
import { FaCcVisa, FaCcMastercard, FaMoneyBillWave, FaExchangeAlt } from 'react-icons/fa';
import { BsBank2 } from 'react-icons/bs';
import InstallmentModal from "./InstallmentModal";

type ProductActionsProps = {
  product: {
    _id: string;
    name: string;
    price: number;
    discountPrice?: number;
    image: string;

    stock: number;
    specs?: any;
    slug?: string;
  };
};

export default function ProductActions({ product }: ProductActionsProps) {
  const [qty, setQty] = useState(1);
  const [showContactModal, setShowContactModal] = useState(false);
  const [installmentBank, setInstallmentBank] = useState<'HD_SAISON' | 'MIRAE_ASSET' | null>(null);
  const addItem = useCartStore((state) => state.addItem);
  const addCompare = useCompareStore((state) => state.addItem);
  const setMobileBuyBarVisible = useCompareStore((state) => state.setMobileBuyBarVisible);

  useEffect(() => {
    setMobileBuyBarVisible(true);
    return () => setMobileBuyBarVisible(false);
  }, [setMobileBuyBarVisible]);

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
    <>
    <div className="flex flex-col gap-6">
      {isOutOfStock && (
        <div className="flex items-center gap-3">
          <span className="text-sm text-primary font-medium">
            (Sản phẩm hiện đang tạm hết hàng)
          </span>
        </div>
      )}

      {/* Desktop & Mobile Actions */}
      <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-0">
        <button
          onClick={handleBuyNow}
          disabled={isOutOfStock}
          className="hidden sm:flex w-full bg-primary text-white hover:brightness-110 py-4 rounded-lg font-bold text-lg uppercase transition-all shadow-lg shadow-[var(--primary-ring)] items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <CreditCard size={20} />
          Mua ngay
        </button>
        <div className="flex gap-3 sm:gap-4">
          <button
            onClick={() => {
              addCompare({
                _id: product._id,
                name: product.name,
                price: product.price,
                discountPrice: product.discountPrice,
                image: product.image,
                specs: product.specs,
                slug: product.slug || product._id
              });
            }}
            className="flex-1 border-2 border-primary text-primary hover:bg-primary/5 py-2.5 sm:py-3 rounded-lg font-bold uppercase transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer text-sm sm:text-base"
          >
            <Scale size={18} className="sm:w-5 sm:h-5" />
            So sánh
          </button>
          <button
            onClick={() => toast.success("Đã thêm vào mục ưa thích!")}
            className="flex-1 border-2 border-primary text-primary hover:bg-primary/5 py-2.5 sm:py-3 rounded-lg font-bold uppercase transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer text-sm sm:text-base"
          >
            <Heart size={18} className="sm:w-5 sm:h-5" />
            Ưa thích
          </button>
        </div>
      </div>

      {/* Payment Methods Section */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <h4 className="font-bold uppercase mb-4 text-[14px] text-gray-800 tracking-wider">
          HỖ TRỢ THANH TOÁN
        </h4>
        <div className="grid grid-cols-4 gap-2">
          {/* VISA */}
          <div className="bg-white border border-gray-100 rounded flex items-center justify-center py-2 px-1 shadow-sm h-[38px] hover:shadow-md transition-all">
            <span className="text-[#1434CB] font-black italic text-[17px] tracking-tighter">VISA</span>
          </div>
          {/* Mastercard */}
          <div className="bg-white border border-gray-100 rounded flex flex-col items-center justify-center py-1 px-1 shadow-sm relative overflow-hidden h-[38px] hover:shadow-md transition-all">
            <div className="flex -space-x-1.5 mt-0.5">
              <div className="w-3.5 h-3.5 rounded-full bg-[#EB001B] opacity-90 mix-blend-multiply"></div>
              <div className="w-3.5 h-3.5 rounded-full bg-[#F79E1B] opacity-90 mix-blend-multiply"></div>
            </div>
            <span className="text-[6px] font-bold mt-0.5 text-black">mastercard</span>
          </div>
          {/* JCB */}
          <div className="bg-white border border-gray-100 rounded flex flex-col items-center justify-center shadow-sm h-[38px] hover:shadow-md transition-all">
            <div className="flex items-center gap-[1px]">
              <div className="bg-[#003883] text-white font-bold text-[8px] w-3 h-4 flex items-center justify-center rounded-sm rounded-tr-none rounded-br-none pt-0.5">J</div>
              <div className="bg-[#C11030] text-white font-bold text-[8px] w-3 h-4 flex items-center justify-center pt-0.5">C</div>
              <div className="bg-[#007F3E] text-white font-bold text-[8px] w-3 h-4 flex items-center justify-center rounded-sm rounded-tl-none rounded-bl-none pt-0.5">B</div>
            </div>
          </div>
          {/* AMEX */}
          <div className="bg-white border border-gray-100 rounded flex items-center justify-center p-1 shadow-sm h-[38px] hover:shadow-md transition-all">
            <div className="bg-[#006FCF] text-white font-bold text-[7px] text-center w-full h-full rounded-sm flex items-center justify-center leading-none">
              AM<br/>EX
            </div>
          </div>
          {/* VNPAY */}
          <div className="bg-white border border-gray-100 rounded flex items-center justify-center p-1 shadow-sm h-[38px] hover:shadow-md transition-all">
            <span className="font-bold text-[10px] tracking-tighter"><span className="text-[#ED1C24]">VNPAY</span><sup className="text-[5px] font-black text-[#005BAB] ml-[1px]">QR</sup></span>
          </div>
          {/* ZaloPay */}
          <div className="bg-white border border-gray-100 rounded flex items-center justify-center p-1 shadow-sm h-[38px] hover:shadow-md transition-all">
            <span className="font-bold text-[10px] tracking-tight"><span className="text-[#0052CC]">Zalo</span><span className="text-[#00B14F]">pay</span></span>
          </div>
          {/* Napas */}
          <div className="bg-white border border-gray-100 rounded flex items-center justify-center p-1 shadow-sm h-[38px] hover:shadow-md transition-all">
            <span className="text-[#002776] font-black italic text-[11px] tracking-tighter flex items-center">napas<span className="text-[#4E9C2D] text-[7px] ml-[1px]">★</span></span>
          </div>
          {/* Kredivo */}
          <div className="bg-white border border-gray-100 rounded flex items-center justify-center p-1 shadow-sm h-[38px] hover:shadow-md transition-all">
            <span className="font-bold text-[10px] tracking-tight flex items-center">
              <span className="text-[#F16522] mr-[1px] text-[13px]">K</span><span className="text-[#0072B5]">redivo</span>
            </span>
          </div>
        </div>
      </div>

      {/* Installment Methods Section */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <h4 className="font-bold uppercase mb-4 text-[14px] text-gray-800 tracking-wider">
          HỖ TRỢ TRẢ GÓP
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* HD Saison */}
          <button 
            onClick={() => setInstallmentBank('HD_SAISON')}
            className="group relative bg-white border border-blue-200 rounded-lg flex flex-col items-center justify-center shadow-sm h-[56px] hover:border-blue-500 hover:shadow-md hover:-translate-y-[2px] active:scale-[0.98] transition-all overflow-hidden p-1.5 cursor-pointer"
          >
            <Image src="/HD_SAISON_logo.jpg" alt="HD SAISON" width={100} height={36} className="h-[24px] w-auto object-contain transition-transform group-hover:scale-105" unoptimized />
            <span className="text-[10px] text-blue-600 font-semibold mt-1 flex items-center gap-1 opacity-80 group-hover:opacity-100">
              Xem thủ tục
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
          {/* Mirae Asset */}
          <button 
            onClick={() => setInstallmentBank('MIRAE_ASSET')}
            className="group relative bg-white border border-blue-200 rounded-lg flex flex-col items-center justify-center shadow-sm h-[56px] hover:border-blue-500 hover:shadow-md hover:-translate-y-[2px] active:scale-[0.98] transition-all overflow-hidden p-1.5 cursor-pointer"
          >
            <Image src="/Mirae_Asset_Logo.jpg" alt="Mirae Asset" width={100} height={36} className="h-[24px] w-auto object-contain transition-transform group-hover:scale-105" unoptimized />
            <span className="text-[10px] text-blue-600 font-semibold mt-1 flex items-center gap-1 opacity-80 group-hover:opacity-100">
              Xem thủ tục
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
        </div>
      </div>

      {/* Mobile Sticky Bottom Bar (Liquid Glass Design) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white/70 backdrop-blur-xl border-t border-white/40 p-3 pb-safe flex items-center gap-3 z-[110] shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
        
        {/* Price Section */}
        <div className="flex-1 flex flex-col justify-center min-w-0">
           {(product.discountPrice ?? 0) > product.price && (
             <div className="text-[11px] text-gray-500 line-through mb-0.5 truncate">{product.discountPrice?.toLocaleString("vi-VN")}đ</div>
           )}
           <div className="text-[17px] font-black text-primary leading-none truncate">{product.price.toLocaleString("vi-VN")}đ</div>
        </div>

        {/* Buy Now Button */}
        <button
          onClick={handleBuyNow}
          disabled={isOutOfStock}
          className="flex-[1.2] h-11 bg-primary text-white rounded-xl font-bold text-[14px] uppercase flex items-center justify-center gap-1.5 shadow-[0_4px_15px_var(--primary-ring)] disabled:opacity-50 active:scale-95 transition-transform"
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
                    className="flex items-center gap-4 bg-gray-50 hover:bg-primary/5 p-4 rounded-xl border border-gray-100 transition-colors group h-full"
                  >
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
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
    <InstallmentModal 
      isOpen={installmentBank !== null} 
      onClose={() => setInstallmentBank(null)} 
      bank={installmentBank}
    />
    </>
  );
}
