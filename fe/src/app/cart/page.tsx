"use client";

import { useCartStore } from "@/store/useCartStore";
import Link from "next/link";
import { Trash2, ArrowRight, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center min-h-[60vh] flex flex-col justify-center items-center">
        <div className="w-24 h-24 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag size={48} />
        </div>
        <h2 className="text-2xl font-bold mb-3 text-gray-800">Giỏ hàng của bạn đang trống</h2>
        <p className="text-gray-500 mb-8">Hãy tìm thêm những sản phẩm công nghệ bạn yêu thích nhé.</p>
        <Link href="/" className="bg-primary text-white px-8 py-3 rounded-md font-bold hover:bg-red-700 transition-colors">
          TIẾP TỤC MUA SẮM
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <h1 className="text-3xl font-black uppercase text-gray-800 mb-8">Giỏ hàng của bạn</h1>
      
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
                          <Link href={`/product/${item._id}`} className="font-bold text-gray-800 hover:text-primary transition-colors line-clamp-2 mb-1">
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
                    <Link href={`/product/${item._id}`} className="font-bold text-gray-800 hover:text-primary transition-colors line-clamp-2 text-sm mb-1 leading-snug">
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

            <Link href="/checkout" className="w-full bg-primary text-white font-bold text-lg py-4 rounded hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
              TIẾN HÀNH THANH TOÁN <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
import { Package } from "lucide-react";
