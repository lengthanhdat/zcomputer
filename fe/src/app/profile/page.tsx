"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Package, Clock, ShieldCheck, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { fetchApi } from "@/lib/api";

interface Order {
  _id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: any[];
}

export default function ProfilePage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'info' | 'orders'>('info');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  useEffect(() => {
    if (activeTab === 'orders' && user) {
      fetchOrders();
    }
  }, [activeTab, user]);

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const res = await fetchApi('/orders/my-orders', { requireAuth: true });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Lỗi khi lấy lịch sử mua hàng:", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  if (!user) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      case 'shipped': return 'bg-purple-100 text-purple-700';
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ xử lý';
      case 'processing': return 'Đang chuẩn bị';
      case 'shipped': return 'Đang giao hàng';
      case 'delivered': return 'Đã giao thành công';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Hồ sơ của tôi</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-1/4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-4">
                  <User size={40} />
                </div>
                <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
                <p className="text-sm text-gray-500 mt-1">{user.email}</p>
                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-semibold">
                  {user.role === 'admin' ? <ShieldCheck size={14} /> : <User size={14} />}
                  {user.role === 'admin' ? 'Quản trị viên' : user.role === 'staff' ? 'Nhân viên' : 'Khách hàng'}
                </div>
              </div>

              <div className="p-2">
                <button
                  onClick={() => setActiveTab('info')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    activeTab === 'info' ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <User size={18} />
                  Thông tin cá nhân
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    activeTab === 'orders' ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Package size={18} />
                  Lịch sử đơn hàng
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full md:w-3/4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              
              {/* Tab: Thông tin cá nhân */}
              {activeTab === 'info' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">Thông tin chi tiết</h3>
                  
                  <div className="space-y-6 max-w-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                          <User size={16} /> Họ và tên
                        </label>
                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-gray-800 font-medium">
                          {user.name}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                          <Mail size={16} /> Địa chỉ Email
                        </label>
                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-gray-800 font-medium">
                          {user.email}
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100">
                      <p className="text-sm text-gray-500 italic">
                        * Tính năng cập nhật số điện thoại và địa chỉ giao hàng đang được phát triển.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Lịch sử đơn hàng */}
              {activeTab === 'orders' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">Lịch sử đơn hàng của bạn</h3>
                  
                  {loadingOrders ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
                      <p className="mt-4 text-gray-500">Đang tải dữ liệu...</p>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400 shadow-sm">
                        <Package size={24} />
                      </div>
                      <h4 className="text-lg font-bold text-gray-800 mb-2">Chưa có đơn hàng nào</h4>
                      <p className="text-gray-500 mb-6">Bạn chưa thực hiện bất kỳ giao dịch mua sắm nào.</p>
                      <Link href="/" className="inline-flex items-center justify-center px-6 py-2.5 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors">
                        Tiếp tục mua sắm
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order._id} className="border border-gray-100 rounded-2xl p-5 hover:border-red-200 transition-colors bg-white shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
                          <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-50">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Mã đơn hàng</p>
                              <p className="font-mono text-sm font-bold text-gray-800">#{order._id.slice(-8).toUpperCase()}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Clock size={12}/> Ngày đặt</p>
                              <p className="text-sm font-medium text-gray-800">
                                {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                {getStatusText(order.status)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mt-4">
                            <div className="text-sm text-gray-600">
                              <span className="font-medium text-gray-800">{order.items.length}</span> sản phẩm
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-500 mb-0.5">Tổng tiền</p>
                              <p className="text-lg font-bold text-red-600">{order.totalAmount.toLocaleString('vi-VN')}đ</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
