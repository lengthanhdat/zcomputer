"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye, Calendar, Tag, CheckCircle2, XCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminNewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNews = async () => {
    setLoading(true);
    try {
      // Get all news (including unpublished if we pass a special flag or if the backend allows admin to see all)
      const res = await fetchApi("/news?isPublished=false");
      if (res.ok) {
        const data = await res.json();
        setNews(data.data || []);
      }
    } catch (error) {
      toast.error("Lỗi khi tải danh sách tin tức");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa bài viết này không?")) return;
    try {
      const res = await fetchApi(`/news/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Đã xóa bài viết");
        loadNews();
      } else {
        toast.error("Xóa thất bại");
      }
    } catch (error) {
      toast.error("Lỗi khi xóa bài viết");
    }
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Tin tức</h1>
        <Link 
          href="/admin/news/new" 
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
        >
          <Plus size={20} />
          <span>Đăng bài mới</span>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm">
                <th className="p-4 font-medium">Tiêu đề</th>
                <th className="p-4 font-medium">Thể loại</th>
                <th className="p-4 font-medium">Lượt xem</th>
                <th className="p-4 font-medium">Ngày đăng</th>
                <th className="p-4 font-medium">Trạng thái</th>
                <th className="p-4 font-medium text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : news.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    Chưa có bài viết nào. Hãy tạo bài viết đầu tiên!
                  </td>
                </tr>
              ) : (
                news.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50/50 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={item.thumbnail?.startsWith('http') || item.thumbnail?.startsWith('data:') ? item.thumbnail : `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:5000'}${item.thumbnail}`} 
                          alt="Thumb" 
                          className="w-12 h-12 rounded object-cover bg-gray-100"
                          onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150'; }}
                        />
                        <div>
                          <p className="font-semibold text-gray-800 line-clamp-1 max-w-md" title={item.title}>{item.title}</p>
                          <p className="text-xs text-gray-500 line-clamp-1 max-w-md">{item.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-xs font-medium">
                        <Tag size={12} /> {item.category}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600 font-medium text-sm flex items-center gap-1.5 mt-2">
                      <Eye size={16} className="text-blue-500" /> {item.views}
                    </td>
                    <td className="p-4 text-gray-600 text-sm">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} /> {formatDate(item.createdAt)}
                      </div>
                    </td>
                    <td className="p-4">
                      {item.isPublished ? (
                        <span className="inline-flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-semibold">
                          <CheckCircle2 size={14} /> Đã xuất bản
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-orange-600 bg-orange-50 px-2 py-1 rounded text-xs font-semibold">
                          <XCircle size={14} /> Bản nháp
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link href={`/tin-tuc/${item.slug}`} target="_blank" className="p-2 text-gray-400 hover:text-blue-600 transition bg-white rounded-lg shadow-sm border border-gray-100 hover:border-blue-200" title="Xem thử">
                          <Eye size={16} />
                        </Link>
                        <Link href={`/admin/news/${item._id}`} className="p-2 text-gray-400 hover:text-green-600 transition bg-white rounded-lg shadow-sm border border-gray-100 hover:border-green-200" title="Chỉnh sửa">
                          <Edit size={16} />
                        </Link>
                        <button onClick={() => handleDelete(item._id)} className="p-2 text-gray-400 hover:text-red-600 transition bg-white rounded-lg shadow-sm border border-gray-100 hover:border-red-200" title="Xóa">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
