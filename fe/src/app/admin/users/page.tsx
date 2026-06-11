"use client";

import { useEffect, useState } from "react";
import { Search, Trash2, Eye, X } from "lucide-react";
import toast from "react-hot-toast";
import { fetchApi } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  address?: string;
  phone?: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { user: currentUser } = useAuthStore();

  const fetchUsers = async () => {
    try {
      const res = await fetchApi("/users");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa tài khoản này?")) return;
    try {
      const res = await fetchApi(`/users/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setUsers(users.filter(u => u._id !== id));
        toast.success("Đã xóa người dùng");
      } else {
        const err = await res.json();
        toast.error(err.message || "Xóa thất bại");
      }
    } catch (error) {
      toast.error("Lỗi kết nối");
    }
  };

  const changeRole = async (id: string, newRole: string) => {
    try {
      const res = await fetchApi(`/users/${id}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) {
        setUsers(users.map(u => u._id === id ? { ...u, role: newRole } : u));
        toast.success(`Đã cập nhật quyền thành ${newRole}`);
      } else {
        const err = await res.json();
        toast.error(err.message || "Cập nhật thất bại");
      }
    } catch (error) {
      toast.error("Lỗi kết nối");
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-full">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Quản lý Tài khoản</h1>
          <p className="text-sm text-gray-500">Xem danh sách, phân quyền và quản lý hệ thống.</p>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Tìm kiếm theo tên hoặc email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm border-y border-gray-200">
                <th className="py-3 px-4 font-semibold">Tên người dùng</th>
                <th className="py-3 px-4 font-semibold">Email</th>
                <th className="py-3 px-4 font-semibold">Ngày tham gia</th>
                <th className="py-3 px-4 font-semibold">Quyền hạn</th>
                <th className="py-3 px-4 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={5} className="py-8 text-center text-gray-500">Đang tải dữ liệu...</td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center text-gray-500">Không tìm thấy người dùng phù hợp.</td></tr>
              ) : (
                filteredUsers.map((user) => {
                  const isMe = currentUser?._id === user._id;

                  return (
                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">
                        {user.name} {isMe && <span className="text-xs ml-2 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Bạn</span>}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{user.email}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {isMe ? (
                          <span className="px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-700 border border-red-200">Admin Toàn Quyền</span>
                        ) : (
                          <select
                            value={user.role}
                            onChange={(e) => changeRole(user._id, e.target.value)}
                            className={`text-sm border rounded px-2 py-1 outline-none font-semibold cursor-pointer ${
                              user.role === 'admin' ? 'bg-red-50 text-red-700 border-red-200' :
                              user.role === 'staff' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                              'bg-gray-50 text-gray-700 border-gray-200'
                            }`}
                          >
                            <option value="admin">Quản trị viên</option>
                            <option value="staff">Nhân viên</option>
                            <option value="customer">Khách hàng</option>
                          </select>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => setSelectedUser(user)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors" 
                            title="Xem chi tiết">
                            <Eye size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(user._id)}
                            disabled={isMe}
                            className={`p-1.5 rounded transition-colors ${isMe ? 'text-gray-300 cursor-not-allowed' : 'text-red-600 hover:bg-red-50'}`} 
                            title={isMe ? 'Không thể tự xóa bản thân' : 'Xóa tài khoản'}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Xem chi tiết */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800">Hồ sơ Khách hàng</h3>
              <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-red-500 transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center text-3xl font-black uppercase">
                  {selectedUser.name.charAt(0)}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 border-b border-gray-50 pb-3">
                <span className="text-sm font-semibold text-gray-500">Họ và tên:</span>
                <span className="col-span-2 text-sm text-gray-900 font-medium">{selectedUser.name}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 border-b border-gray-50 pb-3">
                <span className="text-sm font-semibold text-gray-500">Email:</span>
                <span className="col-span-2 text-sm text-gray-900 font-medium">{selectedUser.email}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 border-b border-gray-50 pb-3">
                <span className="text-sm font-semibold text-gray-500">Số điện thoại:</span>
                <span className="col-span-2 text-sm text-gray-900 font-medium">{selectedUser.phone || "Chưa cập nhật"}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 border-b border-gray-50 pb-3">
                <span className="text-sm font-semibold text-gray-500">Địa chỉ:</span>
                <span className="col-span-2 text-sm text-gray-900 font-medium">{selectedUser.address || "Chưa cập nhật"}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 border-b border-gray-50 pb-3">
                <span className="text-sm font-semibold text-gray-500">Vai trò:</span>
                <span className="col-span-2 text-sm text-gray-900 font-medium capitalize">{selectedUser.role}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-sm font-semibold text-gray-500">Ngày tham gia:</span>
                <span className="col-span-2 text-sm text-gray-900 font-medium">
                  {new Date(selectedUser.createdAt).toLocaleString('vi-VN')}
                </span>
              </div>
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button 
                onClick={() => setSelectedUser(null)}
                className="px-5 py-2 bg-gray-200 text-gray-800 text-sm font-semibold rounded-md hover:bg-gray-300 transition-colors"
              >
                Đóng lại
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
