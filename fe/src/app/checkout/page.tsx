"use client";

import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import BackButton from "@/components/BackButton";

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    note: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      return toast.error("Giỏ hàng của bạn đang trống!");
    }

    setLoading(true);
    try {
      const orderData = {
        customerInfo: formData,
        items: items.map(i => ({
          product: i._id,
          name: i.name,
          quantity: i.quantity,
          price: i.price,
          image: i.image
        })),
        totalAmount: getTotalPrice(),
        paymentMethod: "COD"
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
      });

      if (res.ok) {
        toast.success("Đặt hàng thành công!");
        clearCart();
        router.push("/");
      } else {
        toast.error("Có lỗi xảy ra, vui lòng thử lại.");
      }
    } catch (error) {
      toast.error("Lỗi kết nối đến máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 pt-8 pb-20 min-h-[50vh] flex flex-col">
        <div className="w-full">
          <BackButton className="mb-4" />
        </div>
        <div className="flex-1 flex flex-col justify-center items-center text-center">
          <h2 className="text-2xl font-bold mb-4">Giỏ hàng trống</h2>
          <p className="text-gray-500 mb-8">Bạn chưa chọn sản phẩm nào để thanh toán.</p>
          <button onClick={() => router.push('/')} className="bg-primary text-white px-6 py-2 rounded-md font-semibold hover:bg-primary/90">
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <BackButton className="mb-4" />
      <h1 className="text-3xl font-black uppercase text-gray-800 mb-8">Thanh toán đơn hàng</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold mb-6 pb-2 border-b">Thông tin giao hàng</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên *</label>
                  <input required name="name" value={formData.name} onChange={handleChange} type="text" className="w-full border border-gray-300 rounded p-2.5 outline-none focus:border-primary" placeholder="Nhập họ tên" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại *</label>
                  <input required name="phone" value={formData.phone} onChange={handleChange} type="tel" className="w-full border border-gray-300 rounded p-2.5 outline-none focus:border-primary" placeholder="Nhập số điện thoại" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email (Không bắt buộc)</label>
                <input name="email" value={formData.email} onChange={handleChange} type="email" className="w-full border border-gray-300 rounded p-2.5 outline-none focus:border-primary" placeholder="Nhập email" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ nhận hàng *</label>
                <input required name="address" value={formData.address} onChange={handleChange} type="text" className="w-full border border-gray-300 rounded p-2.5 outline-none focus:border-primary" placeholder="Nhập địa chỉ đầy đủ (Số nhà, đường, phường/xã, quận/huyện, tỉnh/TP)" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú thêm</label>
                <textarea name="note" value={formData.note} onChange={handleChange} rows={3} className="w-full border border-gray-300 rounded p-2.5 outline-none focus:border-primary" placeholder="Ghi chú về thời gian giao hàng, chỉ dẫn địa điểm..."></textarea>
              </div>

              <div className="mt-8 pt-6 border-t">
                <h3 className="font-bold mb-4">Phương thức thanh toán</h3>
                <div className="border border-primary bg-primary/10 p-4 rounded cursor-pointer flex items-center gap-3">
                  <input type="radio" checked readOnly className="w-4 h-4 text-primary" />
                  <span className="font-medium text-gray-800">Thanh toán khi nhận hàng (COD)</span>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full mt-6 bg-primary text-white font-bold text-lg py-3 rounded hover:bg-primary/90 transition-colors disabled:opacity-70"
              >
                {loading ? "Đang xử lý..." : "HOÀN TẤT ĐẶT HÀNG"}
              </button>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 sticky top-6">
            <h2 className="text-xl font-bold mb-6 pb-2 border-b">Đơn hàng của bạn ({items.length} SP)</h2>
            <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
              {items.map((item) => (
                <div key={item._id} className="flex gap-4">
                  <div className="w-16 h-16 bg-white rounded border flex items-center justify-center overflow-hidden shrink-0">
                    {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" /> : <div className="text-xs text-gray-400">No Image</div>}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-800 line-clamp-2">{item.name}</h4>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-500">SL: {item.quantity}</span>
                      <span className="text-sm font-bold text-primary">{item.price.toLocaleString('vi-VN')}đ</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính</span>
                <span>{getTotalPrice().toLocaleString('vi-VN')}đ</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Phí vận chuyển</span>
                <span>Miễn phí</span>
              </div>
              <div className="flex justify-between text-lg font-black text-gray-900 pt-2 border-t mt-2">
                <span>Tổng cộng</span>
                <span className="text-primary">{getTotalPrice().toLocaleString('vi-VN')}đ</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
