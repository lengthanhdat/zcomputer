"use client";

import { useCartStore } from "@/store/useCartStore";
import Link from "next/link";
import { Trash2, ArrowRight, ShoppingBag, Phone, MessageCircle, X, Package } from "lucide-react";
import { useState } from "react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();
  const [showContactModal, setShowContactModal] = useState(false);

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center min-h-[60vh] flex flex-col justify-center items-center">
        <div className="w-24 h-24 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag size={48} />
        </div>
        <h2 className="text-2xl font-bold mb-3 text-gray-800">Danh sách sản phẩm đang trống</h2>
        <p className="text-gray-500 mb-8">Hãy tìm thêm những sản phẩm công nghệ bạn yêu thích nhé.</p>
        <Link href="/" className="bg-primary text-white px-8 py-3 rounded-md font-bold hover:bg-red-700 transition-colors">
          TIẾP TỤC MUA SẮM
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-12 pb-32 lg:pb-12 max-w-6xl">
      <h1 className="text-3xl font-black uppercase text-gray-800 mb-8">Sản phẩm quan tâm</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
                <tr>
                  <th className="py-4 px-6 font-semibold">Sản phẩm</th>
                  <th className="py-4 px-6 font-semibold text-center w-32">Số lượng</th>
                  <th className="py-4 px-6 font-semibold text-right w-32">Thành tiền</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((item) => (
                  <tr key={item._id}>
                    <td className="py-6 px-6">
                      <div className="flex gap-4 items-center">
                        <div className="w-20 h-20 bg-gray-50 border rounded-md p-1 shrink-0 flex items-center justify-center">
                          {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-contain" /> : <Package size={30} className="text-gray-300" />}
                        </div>
                        <div>
                          <Link href={`/${item._id}`} className="font-bold text-gray-800 hover:text-primary transition-colors line-clamp-2 mb-1">
                            {item.name}
                          </Link>
                          <div className="text-primary font-bold">{item.price.toLocaleString('vi-VN')}đ</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <div className="flex items-center justify-center border rounded-md max-w-[120px] mx-auto">
                        <button 
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100"
                        >-</button>
                        <input 
                          type="number" 
                          value={item.quantity} 
                          readOnly 
                          className="w-12 h-8 text-center border-x font-medium outline-none"
                        />
                        <button 
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100"
                        >+</button>
                      </div>
                      <button 
                        onClick={() => removeItem(item._id)}
                        className="mt-3 text-sm text-red-500 flex items-center gap-1 mx-auto hover:underline"
                      >
                        <Trash2 size={14} /> Xóa
                      </button>
                    </td>
                    <td className="py-6 px-6 text-right font-bold text-gray-800">
                      {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {items.map((item) => (
              <div key={item._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col gap-4">
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-gray-50 border rounded-md p-1 shrink-0 flex items-center justify-center">
                    {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-contain" /> : <Package size={24} className="text-gray-300" />}
                  </div>
                  <div className="flex-1">
                    <Link href={`/${item._id}`} className="font-bold text-gray-800 hover:text-primary transition-colors line-clamp-2 text-sm mb-1 leading-snug">
                      {item.name}
                    </Link>
                    <div className="text-primary font-bold text-sm">{item.price.toLocaleString('vi-VN')}đ</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between border-t pt-3">
                  <button 
                    onClick={() => removeItem(item._id)}
                    className="text-sm text-red-500 flex items-center gap-1 hover:underline"
                  >
                    <Trash2 size={14} /> Xóa khỏi giỏ
                  </button>
                  
                  <div className="flex items-center border rounded-md">
                    <button 
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100"
                    >-</button>
                    <input 
                      type="number" 
                      value={item.quantity} 
                      readOnly 
                      className="w-10 h-8 text-center border-x font-medium outline-none"
                    />
                    <button 
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100"
                    >+</button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded text-sm font-semibold text-gray-800">
                  <span>Thành tiền:</span>
                  <span className="text-primary font-bold">{(item.price * item.quantity).toLocaleString('vi-VN')}đ</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 sticky top-6">
            <h2 className="text-xl font-bold mb-6 pb-4 border-b">Tóm tắt đơn hàng</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính</span>
                <span className="font-medium text-gray-800">{getTotalPrice().toLocaleString('vi-VN')}đ</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Phí vận chuyển</span>
                <span className="font-medium text-gray-800">Liên hệ</span>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-800">Tổng cộng</span>
                <span className="text-2xl font-black text-primary">{getTotalPrice().toLocaleString('vi-VN')}đ</span>
              </div>
              <p className="text-xs text-right text-gray-500 mt-1">(Đã bao gồm VAT nếu có)</p>
            </div>

            <button 
              onClick={() => setShowContactModal(true)}
              className="w-full bg-primary text-white font-bold text-lg py-4 rounded hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
            >
              NHẬN BÁO GIÁ / ĐẶT HÀNG <ArrowRight size={20} />
            </button>
          </div>
        </div>
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
                Để mua hàng hoặc nhận báo giá chi tiết cho <strong className="text-primary">{items.length}</strong> sản phẩm bạn đã chọn, vui lòng liên hệ với chúng tôi qua các kênh sau:
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
                      "Chào ZCOMPUTER, mình cần tư vấn báo giá các sản phẩm sau:\n" + 
                      items.map((i, index) => `${index + 1}. ${i.name} (x${i.quantity}) - Giá: ${i.price.toLocaleString('vi-VN')}đ`).join('\n') +
                      `\n\nTổng cộng: ${getTotalPrice().toLocaleString('vi-VN')}đ`
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

      {/* Mobile Sticky Checkout Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 pb-safe z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500 uppercase font-bold mb-0.5">Tổng cộng:</div>
          <div className="text-xl font-black text-primary leading-none">{getTotalPrice().toLocaleString('vi-VN')}đ</div>
        </div>
        <button 
          onClick={() => setShowContactModal(true)}
          className="bg-primary text-white font-bold px-6 py-3.5 rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20 text-sm uppercase"
        >
          Đặt Hàng Ngay
        </button>
      </div>
    </div>
  );
}
