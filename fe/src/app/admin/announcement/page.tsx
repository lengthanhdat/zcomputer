"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { BellRing, Save } from "lucide-react";
import { fetchApi } from "@/lib/api";

export default function AnnouncementPage() {
  const [popupActive, setPopupActive] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupContent, setPopupContent] = useState("");
  const [popupImage, setPopupImage] = useState("");
  const [popupLink, setPopupLink] = useState("");

  const [loading, setLoading] = useState(false);
  const [savingPopup, setSavingPopup] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchApi("/settings/popup_announcement", { requireAuth: false })
      .then(res => res.json())
      .then(popupData => {
        if (popupData && popupData.value) {
          setPopupActive(popupData.value.isActive || false);
          setPopupTitle(popupData.value.title || "");
          setPopupContent(popupData.value.content || "");
          setPopupImage(popupData.value.image || "");
          setPopupLink(popupData.value.link || "");
        }
      })
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  const handleSavePopup = async () => {
    if (popupActive && (!popupTitle || !popupContent)) {
      return toast.error("Tiêu đề và Nội dung không được để trống nếu bật Popup!");
    }

    setSavingPopup(true);
    try {
      const res = await fetchApi("/settings/popup_announcement", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          value: {
            isActive: popupActive,
            title: popupTitle,
            content: popupContent,
            image: popupImage,
            link: popupLink,
            // Version will be auto-incremented by backend
          } 
        })
      });
      
      if (res.ok) {
        toast.success("Cập nhật Popup Thông báo thành công!");
      } else {
        toast.error("Lỗi khi cập nhật Popup");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi kết nối");
    } finally {
      setSavingPopup(false);
    }
  };

  return (
    <div className="pb-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-white shadow-sm border border-gray-200 rounded-xl">
          <BellRing size={24} className="text-gray-700" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Quản lý Thông báo</h1>
          <p className="text-sm font-medium text-gray-500 mt-1">Cấu hình Popup hiện lên khi khách vào web</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 md:p-8 max-w-3xl">
        <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <BellRing size={18} className="fill-primary" />
          </div>
          <h2 className="text-lg font-bold text-gray-800">Cấu hình Popup</h2>
        </div>
        
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
            <div className="h-24 bg-gray-200 rounded w-full"></div>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Toggle Status */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div>
                <h3 className="font-bold text-gray-800">Trạng thái Popup</h3>
                <p className="text-sm text-gray-500">Bật để hiển thị thông báo cho người dùng khi vào trang chủ.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={popupActive}
                  onChange={(e) => setPopupActive(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Tiêu đề thông báo <span className="text-primary">*</span></label>
              <input
                type="text"
                value={popupTitle}
                onChange={(e) => setPopupTitle(e.target.value)}
                placeholder="VD: KHUYẾN MÃI LỚN - GIẢM GIÁ 50%"
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl outline-none focus:border-primary focus:ring-4 focus:ring-brand-500/10 transition-all text-gray-700"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Nội dung <span className="text-primary">*</span></label>
              <textarea
                value={popupContent}
                onChange={(e) => setPopupContent(e.target.value)}
                rows={3}
                placeholder="Nhập nội dung thông báo..."
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl outline-none focus:border-primary focus:ring-4 focus:ring-brand-500/10 transition-all text-gray-700 resize-none"
              ></textarea>
            </div>

            {/* Image & Link row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Link ảnh (Không bắt buộc)</label>
                <input
                  type="text"
                  value={popupImage}
                  onChange={(e) => setPopupImage(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl outline-none focus:border-primary focus:ring-4 focus:ring-brand-500/10 transition-all text-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Đường dẫn khi click (Không bắt buộc)</label>
                <input
                  type="text"
                  value={popupLink}
                  onChange={(e) => setPopupLink(e.target.value)}
                  placeholder="VD: /laptop-gaming"
                  className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl outline-none focus:border-primary focus:ring-4 focus:ring-brand-500/10 transition-all text-gray-700"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={handleSavePopup}
                disabled={savingPopup}
                className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary transition-colors disabled:opacity-50 w-full md:w-auto"
              >
                <Save size={18} />
                {savingPopup ? "Đang lưu..." : "Lưu Thông Báo"}
              </button>
            </div>
            
            <div className="mt-2 p-4 bg-primary/10 rounded-xl border border-primary/10 text-sm text-primary leading-relaxed">
              <strong>Lưu ý:</strong> Khách hàng chỉ nhìn thấy popup <strong>1 lần duy nhất</strong> cho mỗi phiên bản thông báo. Bất kỳ khi nào bạn bấm "Lưu Thông Báo", hệ thống sẽ tự động cập nhật phiên bản mới và thông báo sẽ bật lại trên trình duyệt của người dùng!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
