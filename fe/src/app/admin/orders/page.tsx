"use client";

import { useEffect, useState, useMemo } from "react";
import { Search, CheckCircle, Package, Truck, XCircle, Clock, Eye, X, TrendingUp, AlertCircle, MapPin, Phone, Mail, Calendar, Filter } from "lucide-react";
import toast from "react-hot-toast";
import { fetchApi } from "@/lib/api";

interface OrderItem {
  _id?: string;
  product?: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface Order {
  _id: string;
  customerInfo: {
    name: string;
    phone: string;
    email?: string;
    address: string;
    note?: string;
  };
  totalAmount: number;
  status: string;
  paymentMethod: string;
  isPaid: boolean;
  createdAt: string;
  items: OrderItem[];
}

const statusConfig: Record<string, { label: string, color: string, bg: string, icon: any }> = {
  'pending': { label: 'Chờ xác nhận', color: 'text-yellow-700', bg: 'bg-yellow-100', icon: Clock },
  'processing': { label: 'Đang xử lý', color: 'text-blue-700', bg: 'bg-blue-100', icon: Package },
  'shipped': { label: 'Đang giao hàng', color: 'text-indigo-700', bg: 'bg-indigo-100', icon: Truck },
  'delivered': { label: 'Đã giao', color: 'text-green-700', bg: 'bg-green-100', icon: CheckCircle },
  'cancelled': { label: 'Đã hủy', color: 'text-red-700', bg: 'bg-red-100', icon: XCircle }
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await fetchApi("/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      } else {
        toast.error("Không thể tải danh sách đơn hàng");
      }
    } catch (error) {
      toast.error("Lỗi kết nối");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetchApi(`/orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setOrders(orders.map(o => o._id === id ? { ...o, status: newStatus } : o));
        toast.success("Cập nhật trạng thái thành công!");
        if (selectedOrder?._id === id) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      } else {
        toast.error("Cập nhật thất bại");
      }
    } catch (error) {
      toast.error("Lỗi kết nối");
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchSearch = 
        o._id.toLowerCase().includes(search.toLowerCase()) || 
        o.customerInfo.name.toLowerCase().includes(search.toLowerCase()) ||
        o.customerInfo.phone.includes(search);
      const matchStatus = filterStatus === "all" || o.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [orders, search, filterStatus]);

  const stats = useMemo(() => ({
    total: orders.length,
    revenue: orders.filter(o => o.status === 'delivered').reduce((acc, o) => acc + o.totalAmount, 0),
    pending: orders.filter(o => o.status === 'pending').length
  }), [orders]);

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-indigo-100 font-medium">Tổng doanh thu</p>
              <h3 className="text-3xl font-bold mt-2">{stats.revenue.toLocaleString('vi-VN')}đ</h3>
            </div>
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <TrendingUp size={24} />
            </div>
          </div>
          <p className="text-sm text-indigo-100 mt-4">Chỉ tính đơn đã giao thành công</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-100 font-medium">Tổng đơn hàng</p>
              <h3 className="text-3xl font-bold mt-2">{stats.total}</h3>
            </div>
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <Package size={24} />
            </div>
          </div>
          <p className="text-sm text-blue-100 mt-4">Tất cả đơn hàng trên hệ thống</p>
        </div>

        <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-orange-100 font-medium">Chờ xác nhận</p>
              <h3 className="text-3xl font-bold mt-2">{stats.pending}</h3>
            </div>
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <AlertCircle size={24} />
            </div>
          </div>
          <p className="text-sm text-orange-100 mt-4">Đơn hàng cần được xử lý ngay</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
          <input
            type="text"
            placeholder="Tìm mã đơn, tên hoặc SĐT khách..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          <Filter size={20} className="text-gray-400 mr-2 shrink-0" />
          {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                filterStatus === status 
                  ? 'bg-gray-800 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status === 'all' ? 'Tất cả' : statusConfig[status].label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-sm border-b border-gray-100">
                <th className="py-4 px-6 font-semibold">Đơn Hàng</th>
                <th className="py-4 px-6 font-semibold">Khách Hàng</th>
                <th className="py-4 px-6 font-semibold">Thanh Toán</th>
                <th className="py-4 px-6 font-semibold">Trạng Thái</th>
                <th className="py-4 px-6 font-semibold text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={5} className="py-12 text-center text-gray-400">Đang tải dữ liệu...</td></tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center">
                      <Package size={48} className="text-gray-200 mb-4" />
                      <p className="text-lg font-medium text-gray-600">Không tìm thấy đơn hàng</p>
                      <p className="text-sm mt-1">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const StatusIcon = statusConfig[order.status]?.icon || Clock;
                  return (
                    <tr key={order._id} className="hover:bg-gray-50/80 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${statusConfig[order.status]?.bg} ${statusConfig[order.status]?.color}`}>
                            <StatusIcon size={20} />
                          </div>
                          <div>
                            <div className="font-bold text-gray-900 group-hover:text-primary transition-colors cursor-pointer" onClick={() => setSelectedOrder(order)}>
                              #{order._id.substring(order._id.length - 6).toUpperCase()}
                            </div>
                            <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                              <Calendar size={12} />
                              {new Date(order.createdAt).toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm font-semibold text-gray-800">{order.customerInfo.name}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <Phone size={12} /> {order.customerInfo.phone}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm font-bold text-gray-900">
                          {order.totalAmount.toLocaleString('vi-VN')}đ
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {order.paymentMethod} • {order.isPaid ? <span className="text-green-600 font-medium">Đã thanh toán</span> : <span className="text-orange-500 font-medium">Chưa thanh toán</span>}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <select 
                          className={`text-sm font-medium rounded-lg px-3 py-1.5 outline-none cursor-pointer border-0 ring-1 ring-inset focus:ring-2 focus:ring-primary appearance-none
                            ${statusConfig[order.status]?.bg} ${statusConfig[order.status]?.color} ring-${statusConfig[order.status]?.color.replace('text-', '')}/30`}
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                        >
                          <option value="pending">Chờ xác nhận</option>
                          <option value="processing">Đang xử lý</option>
                          <option value="shipped">Đang giao hàng</option>
                          <option value="delivered">Đã giao</option>
                          <option value="cancelled">Đã hủy</option>
                        </select>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex justify-center items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => setSelectedOrder(order)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors tooltip"
                            title="Xem chi tiết"
                          >
                            <Eye size={20} />
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

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" onClick={() => setSelectedOrder(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col transform transition-all animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                  <Package size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Chi tiết đơn hàng</h3>
                  <p className="text-xs text-gray-500">#{selectedOrder._id}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:bg-gray-200 hover:text-gray-600 p-2 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Info */}
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Thông tin khách hàng</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 text-gray-400"><Eye size={16} /></div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{selectedOrder.customerInfo.name}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 text-gray-400"><Phone size={16} /></div>
                      <p className="text-sm text-gray-600">{selectedOrder.customerInfo.phone}</p>
                    </div>
                    {selectedOrder.customerInfo.email && (
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 text-gray-400"><Mail size={16} /></div>
                        <p className="text-sm text-gray-600">{selectedOrder.customerInfo.email}</p>
                      </div>
                    )}
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 text-gray-400"><MapPin size={16} /></div>
                      <p className="text-sm text-gray-600 leading-relaxed">{selectedOrder.customerInfo.address}</p>
                    </div>
                  </div>
                </div>

                {/* Order Info */}
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Thông tin thanh toán</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Trạng thái:</span>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${statusConfig[selectedOrder.status]?.bg} ${statusConfig[selectedOrder.status]?.color}`}>
                        {statusConfig[selectedOrder.status]?.label}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">PT Thanh toán:</span>
                      <span className="text-sm font-medium text-gray-800">{selectedOrder.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Thanh toán:</span>
                      <span className={`text-sm font-bold ${selectedOrder.isPaid ? 'text-green-600' : 'text-orange-500'}`}>
                        {selectedOrder.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-gray-200 mt-2">
                      <span className="text-sm font-semibold text-gray-700">Tổng tiền:</span>
                      <span className="text-lg font-black text-primary">{selectedOrder.totalAmount.toLocaleString('vi-VN')}đ</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider flex items-center gap-2">
                  <Package size={16} /> Sản phẩm đã đặt ({selectedOrder.items.length})
                </h4>
                <div className="bg-white border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-50">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0 flex items-center justify-center border border-gray-200">
                        {item.image ? (
                          <img src={`http://127.0.0.1:5000${item.image}`} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="text-gray-400" size={24} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm font-semibold text-gray-900 truncate" title={item.name}>{item.name}</h5>
                        <div className="text-sm text-primary font-bold mt-1">
                          {item.price.toLocaleString('vi-VN')}đ <span className="text-gray-500 text-xs font-normal">x {item.quantity}</span>
                        </div>
                      </div>
                      <div className="text-sm font-bold text-gray-800 shrink-0">
                        {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedOrder.customerInfo.note && (
                <div className="bg-yellow-50 text-yellow-800 p-4 rounded-xl text-sm border border-yellow-100">
                  <span className="font-bold">Ghi chú của khách: </span>
                  {selectedOrder.customerInfo.note}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button 
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2.5 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-colors"
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
