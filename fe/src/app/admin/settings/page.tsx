"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Settings, Zap, Save } from "lucide-react";
import { fetchApi } from "@/lib/api";

export default function SettingsPage() {
  const [flashSaleEnd, setFlashSaleEnd] = useState("");
  const [loading, setLoading] = useState(false);
  const [savingFlashSale, setSavingFlashSale] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchApi("/settings/flash_sale_end_time", { requireAuth: false })
      .then(res => res.json())
      .then(flashSaleData => {
        if (flashSaleData && flashSaleData.value) {
          const date = new Date(flashSaleData.value);
          const tzoffset = date.getTimezoneOffset() * 60000;
          const localISOTime = (new Date(date.getTime() - tzoffset)).toISOString().slice(0, 16);
          setFlashSaleEnd(localISOTime);
        }
      })
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  const handleSaveFlashSale = async () => {
    if (!flashSaleEnd) return toast.error("Vui lòng chọn thời gian kết thúc!");
    
    setSavingFlashSale(true);
    try {
      const date = new Date(flashSaleEnd);
      const res = await fetchApi("/settings/flash_sale_end_time", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: date.toISOString() })
      });
      
      if (res.ok) {
        toast.success("Cập nhật thời gian Flash Sale thành công!");
      } else {
        toast.error("Lỗi khi cập nhật cài đặt");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi kết nối");
    } finally {
      setSavingFlashSale(false);
    }
  };

  // End of settings handlers
  return (
    <div className="pb-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-white shadow-sm border border-gray-200 rounded-xl">
          <Settings size={24} className="text-gray-700" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Cài đặt chung</h1>
          <p className="text-sm font-medium text-gray-500 mt-1">Quản lý các cấu hình hiển thị của website</p>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 max-w-3xl">
        <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
          <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500">
            <Zap size={18} className="fill-orange-500" />
          </div>
          <h2 className="text-lg font-bold text-gray-800">Quản lý sự kiện Flash Sale</h2>
        </div>
        
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded w-1/2"></div>
            <div className="h-10 bg-gray-200 rounded w-32 mt-6"></div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Thời gian kết thúc đếm ngược <span className="text-red-500">*</span></label>
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <input
                  type="datetime-local"
                  value={flashSaleEnd}
                  onChange={(e) => setFlashSaleEnd(e.target.value)}
                  className="w-full md:w-[300px] px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-medium text-gray-700"
                />
                <button
                  onClick={handleSaveFlashSale}
                  disabled={savingFlashSale}
                  className="flex items-center justify-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors disabled:opacity-50 w-full md:w-auto"
                >
                  <Save size={18} />
                  {savingFlashSale ? "Đang lưu..." : "Lưu thời gian"}
                </button>
              </div>
              <div className="mt-3 p-4 bg-blue-50/50 rounded-xl border border-blue-100 text-sm text-blue-700 leading-relaxed">
                <strong>Lưu ý:</strong> Đồng hồ đếm ngược trên trang chủ ở mục Flash Sale sẽ tự động tính toán từ thời điểm hiện tại đến thời gian này. Khi hết thời gian, đồng hồ sẽ tự động hiển thị <strong>00:00:00</strong>.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
