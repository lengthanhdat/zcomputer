"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { MessageCircle, Trash2, CheckCircle2, Clock, Eye, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

interface Feedback {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'new' | 'read' | 'resolved';
  createdAt: string;
}

export default function AdminFeedbacks() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const res = await fetchApi('/feedbacks', { requireAuth: true });
      if (res.ok) {
        const data = await res.json();
        setFeedbacks(data);
      }
    } catch (error) {
      toast.error("Lỗi tải danh sách phản hồi");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetchApi(`/feedbacks/${id}/status`, {
        method: 'PUT',
        requireAuth: true,
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        toast.success("Đã cập nhật trạng thái");
        fetchFeedbacks();
        if (selectedFeedback && selectedFeedback._id === id) {
          setSelectedFeedback({ ...selectedFeedback, status: status as any });
        }
      }
    } catch (error) {
      toast.error("Lỗi cập nhật trạng thái");
    }
  };

  const deleteFeedback = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa phản hồi này?")) return;
    try {
      const res = await fetchApi(`/feedbacks/${id}`, {
        method: 'DELETE',
        requireAuth: true
      });
      if (res.ok) {
        toast.success("Đã xóa phản hồi");
        fetchFeedbacks();
        if (selectedFeedback?._id === id) setSelectedFeedback(null);
      }
    } catch (error) {
      toast.error("Lỗi xóa phản hồi");
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'new': return <span className="px-2.5 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full border border-red-200 uppercase tracking-wider">Mới</span>;
      case 'read': return <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full border border-blue-200 uppercase tracking-wider">Đã đọc</span>;
      case 'resolved': return <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-200 uppercase tracking-wider">Hoàn tất</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-gray-800 flex items-center gap-2">
          <MessageCircle className="text-primary" /> Quản lý Góp ý
        </h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 font-bold border-b border-gray-200 uppercase text-xs">
              <tr>
                <th className="px-6 py-4">Ngày gửi</th>
                <th className="px-6 py-4">Người gửi</th>
                <th className="px-6 py-4">Nội dung</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500 font-medium">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : feedbacks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500 font-medium">
                    Chưa có phản hồi nào
                  </td>
                </tr>
              ) : (
                feedbacks.map((item) => (
                  <tr key={item._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-800">{item.name}</div>
                      <div className="text-xs text-gray-500">{item.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="line-clamp-2 text-gray-600 max-w-md">
                        {item.message}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        onClick={() => {
                          setSelectedFeedback(item);
                          if (item.status === 'new') updateStatus(item._id, 'read');
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => deleteFeedback(item._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal chi tiết */}
      {selectedFeedback && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelectedFeedback(null)}
          ></div>
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center justify-between border-b pb-4">
              <span>Chi tiết phản hồi</span>
              {getStatusBadge(selectedFeedback.status)}
            </h3>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Họ tên</p>
                <p className="font-semibold text-gray-800">{selectedFeedback.name}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Ngày gửi</p>
                <p className="font-semibold text-gray-800">{new Date(selectedFeedback.createdAt).toLocaleString('vi-VN')}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email</p>
                <p className="font-semibold text-gray-800">{selectedFeedback.email}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Số điện thoại</p>
                <p className="font-semibold text-gray-800">{selectedFeedback.phone || 'Không cung cấp'}</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Nội dung</p>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{selectedFeedback.message}</p>
            </div>

            <div className="flex items-center gap-3 justify-end">
              {selectedFeedback.status !== 'resolved' && (
                <button 
                  onClick={() => {
                    updateStatus(selectedFeedback._id, 'resolved');
                    setSelectedFeedback(null);
                  }}
                  className="px-6 py-2.5 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <CheckCircle2 size={18} /> Đánh dấu đã giải quyết
                </button>
              )}
              <button 
                onClick={() => setSelectedFeedback(null)}
                className="px-6 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
