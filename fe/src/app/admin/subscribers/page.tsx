"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { Trash2, Mail, Calendar } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSubscribers = async () => {
    setLoading(true);
    try {
      const res = await fetchApi("/subscribers");
      if (res.ok) {
        const data = await res.json();
        setSubscribers(data || []);
      }
    } catch (error) {
      toast.error("Lỗi khi tải danh sách");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubscribers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa email này không?")) return;
    try {
      const res = await fetchApi(`/subscribers/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Đã xóa email");
        loadSubscribers();
      } else {
        toast.error("Xóa thất bại");
      }
    } catch (error) {
      toast.error("Lỗi khi xóa");
    }
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(d);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Đăng ký nhận tin</h1>
        <div className="bg-brand-50 text-brand-600 px-4 py-2 rounded-lg font-bold text-sm border border-brand-100">
          Tổng cộng: {subscribers.length} email
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm">
                <th className="p-4 font-medium">STT</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Ngày đăng ký</th>
                <th className="p-4 font-medium text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">
                    <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : subscribers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">
                    Chưa có khách hàng nào đăng ký nhận tin.
                  </td>
                </tr>
              ) : (
                subscribers.map((item, idx) => (
                  <tr key={item._id} className="hover:bg-gray-50/50 transition">
                    <td className="p-4 text-gray-500 font-medium">{idx + 1}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 font-semibold text-gray-800">
                        <Mail size={16} className="text-blue-500" />
                        {item.email}
                      </div>
                    </td>
                    <td className="p-4 text-gray-600 text-sm">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} /> {formatDate(item.createdAt)}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
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
