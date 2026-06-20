"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Edit, Play, Link as LinkIcon, Box } from "lucide-react";
import toast from "react-hot-toast";
import { fetchApi } from "@/lib/api";
import Image from "next/image";
import { useAuthStore } from "@/store/useAuthStore";

interface VideoReview {
  _id: string;
  videoFileUrl: string;
  redirectLink: string;
  product_id?: any;
}

export default function AdminVideoReviewsPage() {
  const [reviews, setReviews] = useState<VideoReview[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [linkType, setLinkType] = useState<"product" | "custom">("product");
  const [formData, setFormData] = useState({ 
    videoFileUrl: "",
    redirectLink: "",
    product_id: ""
  });
  
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const fetchData = async () => {
    try {
      const [revRes, prodRes] = await Promise.all([
        fetchApi("/video-reviews"),
        fetchApi("/products")
      ]);
      const [revData, prodData] = await Promise.all([
        revRes.json(),
        prodRes.json()
      ]);
      setReviews(revData);
      setProducts(prodData.products || prodData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openAddModal = () => {
    setEditingId(null);
    setLinkType("product");
    setFormData({ videoFileUrl: "", redirectLink: "", product_id: "" });
    setSearchTerm("");
    setShowModal(true);
  };

  const openEditModal = (review: VideoReview) => {
    setEditingId(review._id);
    if (review.product_id) {
      setLinkType("product");
      setSearchTerm(review.product_id.name || "");
    } else {
      setLinkType("custom");
      setSearchTerm("");
    }
    setFormData({
      videoFileUrl: review.videoFileUrl || "",
      redirectLink: review.redirectLink || "",
      product_id: review.product_id?._id || ""
    });
    setShowModal(true);
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append("video", file);
    const toastId = toast.loading("Đang tải video lên (Vui lòng đợi)...");

    try {
      // Upload thẳng tới backend để bypass giới hạn 10MB của Next.js proxy
      const token = useAuthStore.getState().token;
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
      const res = await fetch(`${apiBase}/api/upload/video`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: data,
      });
      const result = await res.json();
      if (res.ok) {
        setFormData({ ...formData, videoFileUrl: result.url });
        toast.success("Tải video lên thành công", { id: toastId });
      } else {
        toast.error(result.message || "Tải video thất bại", { id: toastId });
      }
    } catch (error) {
      toast.error("Lỗi kết nối khi tải video", { id: toastId });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId ? `/video-reviews/${editingId}` : "/video-reviews";
      const method = editingId ? "PUT" : "POST";

      const payload = {
        videoFileUrl: formData.videoFileUrl,
        redirectLink: linkType === "custom" ? formData.redirectLink : "",
        product_id: linkType === "product" ? formData.product_id : null
      };

      const res = await fetchApi(url, {
        method,
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        toast.success(editingId ? "Cập nhật thành công" : "Thêm thành công");
        setShowModal(false);
        fetchData();
      } else {
        toast.error("Thao tác thất bại");
      }
    } catch (error) {
      toast.error("Lỗi kết nối");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Xóa video review này?")) return;
    try {
      const res = await fetchApi(`/video-reviews/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setReviews(reviews.filter(r => r._id !== id));
        toast.success("Xóa thành công");
      }
    } catch (error) {}
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-full">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Quản lý Video Review</h1>
          <p className="text-sm text-gray-500">Quản lý các video TikTok/Shorts trên trang chủ.</p>
        </div>
        <button onClick={openAddModal} className="bg-primary hover:bg-brand-700 text-white px-4 py-2 rounded-md font-semibold flex items-center gap-2">
          <Plus size={18} /> Thêm Video
        </button>
      </div>

      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? <p>Đang tải...</p> : reviews.map(review => (
          <div key={review._id} className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow transition-shadow">
            <div className="aspect-[9/16] bg-gray-100 relative group">
              {review.videoFileUrl ? (
                <video src={`${review.videoFileUrl}`} className="w-full h-full object-cover" muted />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">Không có video</div>
              )}
            </div>
            <div className="p-4 space-y-3">
              <div>
                {review.product_id ? (
                  <div className="flex items-start gap-2">
                    <Box size={14} className="text-blue-600 mt-1 flex-shrink-0" />
                    <p className="text-xs text-blue-600 font-medium line-clamp-2">{review.product_id.name}</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LinkIcon size={14} className="text-gray-500 flex-shrink-0" />
                    <p className="text-xs text-gray-500 truncate" title={review.redirectLink}>{review.redirectLink || "Không có liên kết"}</p>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-1 pt-3 border-t border-gray-100">
                <button onClick={() => openEditModal(review)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Sửa">
                  <Edit size={16} />
                </button>
                <button onClick={() => handleDelete(review._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Xóa">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-visible">
            <h2 className="text-xl font-bold mb-4">{editingId ? "Sửa Video Review" : "Thêm Video Review"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tải video lên (MP4/WebM)</label>
                <div className="flex flex-col gap-2">
                  <input type="file" accept="video/*" onChange={handleVideoUpload} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700" />
                  {formData.videoFileUrl && (
                    <video src={`${formData.videoFileUrl}`} className="h-32 w-24 object-cover rounded border flex-shrink-0" controls />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Hành động khi click (Link Đích)</label>
                <div className="flex gap-4 mb-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="linkType" checked={linkType === "product"} onChange={() => setLinkType("product")} className="text-primary focus:ring-primary h-4 w-4" />
                    <span className="text-sm font-medium">Gắn Sản Phẩm</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="linkType" checked={linkType === "custom"} onChange={() => setLinkType("custom")} className="text-primary focus:ring-primary h-4 w-4" />
                    <span className="text-sm font-medium">Liên Kết Tự Do</span>
                  </label>
                </div>

                {linkType === "product" ? (
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="-- Nhập tên để tìm & chọn sản phẩm --" 
                      className="w-full border p-2 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                      value={searchTerm}
                      onChange={e => {
                        setSearchTerm(e.target.value);
                        setShowDropdown(true);
                        setFormData({...formData, product_id: ""});
                      }}
                      onFocus={() => setShowDropdown(true)}
                    />
                    {showDropdown && (
                      <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-52 overflow-y-auto">
                        {filteredProducts.length > 0 ? (
                          filteredProducts.map(p => (
                            <div 
                              key={p._id} 
                              className={`p-2 hover:bg-brand-50 cursor-pointer text-sm border-b border-gray-50 last:border-0 ${formData.product_id === p._id ? 'bg-brand-50 font-medium text-primary' : ''}`}
                              onClick={() => {
                                setFormData({...formData, product_id: p._id});
                                setSearchTerm(p.name);
                                setShowDropdown(false);
                              }}
                            >
                              {p.name}
                            </div>
                          ))
                        ) : (
                          <div className="p-3 text-sm text-gray-500 text-center">Không tìm thấy sản phẩm nào</div>
                        )}
                      </div>
                    )}
                    {showDropdown && (
                      <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)}></div>
                    )}
                  </div>
                ) : (
                  <div>
                    <input className="w-full border p-2 rounded text-sm" value={formData.redirectLink} onChange={e => setFormData({...formData, redirectLink: e.target.value})} placeholder="https://..." />
                  </div>
                )}
              </div>
              
              <div className="flex gap-4 mt-6 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700 py-2 rounded font-semibold">Hủy</button>
                <button type="submit" className="flex-1 bg-primary hover:bg-brand-700 transition-colors text-white py-2 rounded font-semibold">Lưu lại</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
