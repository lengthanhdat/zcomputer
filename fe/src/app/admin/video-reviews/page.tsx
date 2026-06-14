"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Edit, Play } from "lucide-react";
import toast from "react-hot-toast";
import { fetchApi } from "@/lib/api";

interface VideoReview {
  _id: string;
  videoFileUrl: string;
  redirectLink: string;
}

export default function AdminVideoReviewsPage() {
  const [reviews, setReviews] = useState<VideoReview[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({ 
    videoFileUrl: "",
    redirectLink: ""
  });

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
    setFormData({ videoFileUrl: "", redirectLink: "" });
    setShowModal(true);
  };

  const openEditModal = (review: VideoReview) => {
    setEditingId(review._id);
    setFormData({
      videoFileUrl: review.videoFileUrl || "",
      redirectLink: review.redirectLink || ""
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
      const token = localStorage.getItem("token");
      const res = await fetch("/api/upload/video", {
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

      const res = await fetchApi(url, {
        method,
        body: JSON.stringify(formData)
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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-full">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Quản lý Video Review</h1>
          <p className="text-sm text-gray-500">Quản lý các video TikTok/Shorts trên trang chủ.</p>
        </div>
        <button onClick={openAddModal} className="bg-primary hover:bg-red-700 text-white px-4 py-2 rounded-md font-semibold flex items-center gap-2">
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
                <p className="text-xs text-blue-600 mt-1 line-clamp-1">{review.redirectLink ? `Link: ${review.redirectLink}` : "Không có link đính kèm"}</p>
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
          <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Link Đích (Chuyển hướng khi click)</label>
                <input className="w-full border p-2 rounded" value={formData.redirectLink} onChange={e => setFormData({...formData, redirectLink: e.target.value})} placeholder="https://..." />
              </div>
              
              <div className="flex gap-4 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded font-semibold">Hủy</button>
                <button type="submit" className="flex-1 bg-primary text-white py-2 rounded font-semibold">Lưu lại</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
