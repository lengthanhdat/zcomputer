"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Edit, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import { fetchApi } from "@/lib/api";

interface Banner {
  _id: string;
  title: string;
  image: string;
  link: string;
  position: 'main' | 'sub';
  isActive: boolean;
  order: number;
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{ title: string; image: string; link: string; position: 'main' | 'sub'; isActive: boolean; order: number }>({ title: "", image: "", link: "", position: 'main', isActive: true, order: 0 });

  const fetchBanners = async () => {
    try {
      const res = await fetchApi("/banners");
      const data = await res.json();
      setBanners(data);
    } catch (error) {
      console.error("Error fetching banners:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBanners(); }, []);

  const openAddModal = () => {
    setEditingBannerId(null);
    setFormData({ title: "", image: "", link: "", position: 'main', isActive: true, order: 0 });
    setShowModal(true);
  };

  const openEditModal = (banner: Banner) => {
    setEditingBannerId(banner._id);
    setFormData({
      title: banner.title,
      image: banner.image,
      link: banner.link || "",
      position: banner.position || 'main',
      isActive: banner.isActive,
      order: banner.order || 0
    });
    setShowModal(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append("image", file);
    const toastId = toast.loading("Đang tải ảnh lên...");

    try {
      const res = await fetchApi("/upload/image", {
        method: "POST",
        body: data,
      });
      const result = await res.json();
      if (res.ok) {
        setFormData({ ...formData, image: result.url });
        toast.success("Tải ảnh lên thành công", { id: toastId });
      } else {
        toast.error(result.message || "Tải ảnh thất bại", { id: toastId });
      }
    } catch (error) {
      toast.error("Lỗi kết nối khi tải ảnh", { id: toastId });
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingBannerId ? `/banners/${editingBannerId}` : "/banners";
      const method = editingBannerId ? "PUT" : "POST";

      const res = await fetchApi(url, {
        method,
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        toast.success(editingBannerId ? "Cập nhật banner thành công" : "Thêm banner thành công");
        setShowModal(false);
        fetchBanners();
      } else {
        toast.error(editingBannerId ? "Cập nhật banner thất bại" : "Thêm banner thất bại");
      }
    } catch (error) {
      toast.error("Lỗi kết nối");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Xóa banner này?")) return;
    try {
      const res = await fetchApi(`/banners/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBanners(banners.filter(b => b._id !== id));
        toast.success("Xóa thành công");
      }
    } catch (error) {}
  };

  const toggleActive = async (banner: Banner) => {
    try {
      const res = await fetchApi(`/banners/${banner._id}`, {
        method: 'PUT',
        body: JSON.stringify({ isActive: !banner.isActive })
      });
      if (res.ok) {
        setBanners(banners.map(b => b._id === banner._id ? { ...b, isActive: !b.isActive } : b));
        toast.success("Cập nhật trạng thái thành công");
      }
    } catch (error) {}
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-full">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Quản lý Banner</h1>
          <p className="text-sm text-gray-500">Thêm, sửa, xóa các banner quảng cáo trên trang chủ.</p>
        </div>
        <button onClick={openAddModal} className="bg-primary hover:bg-primary text-white px-4 py-2 rounded-md font-semibold flex items-center gap-2">
          <Plus size={18} /> Thêm banner mới
        </button>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? <p>Đang tải...</p> : banners.map(banner => (
          <div key={banner._id} className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow transition-shadow">
            <div className="aspect-[21/9] bg-gray-100 relative">
              <img src={banner.image.startsWith('http') || banner.image.startsWith('data:') ? banner.image : `${banner.image}`} alt={banner.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-4 space-y-4">
              <div>
                <h3 className="font-bold text-gray-800 text-sm line-clamp-1">{banner.title || "Không có tiêu đề"}</h3>
                <p className="text-xs font-semibold mt-1">Vị trí: <span className={banner.position === 'sub' ? 'text-blue-600' : 'text-primary'}>{banner.position === 'sub' ? 'Banner Phụ (3 cái nhỏ)' : 'Banner Chính (To)'}</span></p>
                <p className="text-xs text-gray-500 mt-1">Thứ tự: {banner.order}</p>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <button 
                  onClick={() => toggleActive(banner)}
                  className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 ${banner.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                >
                  {banner.isActive ? 'Đang bật' : 'Đã tắt'}
                </button>
                <div className="flex gap-1">
                  <button onClick={() => openEditModal(banner)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Sửa banner">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => handleDelete(banner._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Xóa banner">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">{editingBannerId ? "Sửa Banner" : "Thêm Banner"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề (Không bắt buộc)</label>
                <input className="w-full border p-2 rounded" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Nhập tiêu đề nếu có..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh Banner (Từ máy tính hoặc URL)</label>
                <div className="flex flex-col gap-2">
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                  <div className="flex items-center gap-3 mt-2">
                    {formData.image && (
                      <img src={formData.image.startsWith('http') || formData.image.startsWith('data:') ? formData.image : `${formData.image}`} alt="Preview" className="h-12 w-24 object-cover rounded border flex-shrink-0" />
                    )}
                    <input className="flex-1 border p-2 rounded text-sm" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} placeholder="Hoặc dán URL ảnh trực tiếp (https://...)" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vị trí hiển thị</label>
                <select className="w-full border p-2 rounded" value={formData.position} onChange={e => setFormData({...formData, position: e.target.value as 'main' | 'sub'})}>
                  <option value="main">Banner Chính (Nằm trên, vuốt ngang)</option>
                  <option value="sub">Banner Phụ (Nằm dưới, 3 cái chia cột)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Đường dẫn khi click (URL)</label>
                <input className="w-full border p-2 rounded" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thứ tự hiển thị</label>
                <input type="number" className="w-full border p-2 rounded" value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value) || 0})} />
              </div>
              <div className="flex gap-4 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded">Hủy</button>
                <button type="submit" className="flex-1 bg-primary text-white py-2 rounded">Lưu banner</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
