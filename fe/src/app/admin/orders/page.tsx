"use client";

import { useEffect, useState } from "react";
import { Edit, Search, CheckCircle, Package, Truck, XCircle, Clock } from "lucide-react";
import toast from "react-hot-toast";

interface OrderItem {
  _id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  customerInfo: {
    name: string;
    phone: string;
    address: string;
  };
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

const statusConfig: Record<string, { label: string, color: string, icon: any }> = {
  'pending': { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  'processing': { label: 'Đang xử lý', color: 'bg-blue-100 text-blue-700', icon: Package },
  'shipped': { label: 'Đang giao hàng', color: 'bg-indigo-100 text-indigo-700', icon: Truck },
  'delivered': { label: 'Đã giao', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  'cancelled': { label: 'Đã hủy', color: 'bg-red-100 text-red-700', icon: XCircle }
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/api/orders");
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setOrders(orders.map(o => o._id === id ? { ...o, status: newStatus } : o));
        toast.success("Cập nhật trạng thái thành công");
      } else {
        toast.error("Cập nhật thất bại");
      }
    } catch (error) {
      toast.error("Lỗi kết nối");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-full">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Quản lý Đơn hàng</h1>
        <p className="text-sm text-gray-500">Xem và cập nhật trạng thái đơn hàng của khách.</p>
      </div>
      
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm border-y border-gray-200">
                <th className="py-3 px-4 font-semibold">Mã ĐH / Ngày</th>
                <th className="py-3 px-4 font-semibold">Khách hàng</th>
                <th className="py-3 px-4 font-semibold">Tổng tiền</th>
                <th className="py-3 px-4 font-semibold">Trạng thái</th>
                <th className="py-3 px-4 font-semibold text-right">Cập nhật</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={5} className="py-8 text-center text-gray-500">Đang tải dữ liệu...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center text-gray-500">Chưa có đơn hàng nào.</td></tr>
              ) : (
                orders.map((order) => {
                  const StatusIcon = statusConfig[order.status]?.icon || Clock;
                  return (
                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-medium text-sm text-gray-900 mb-1">#{order._id.substring(order._id.length - 6).toUpperCase()}</div>
                        <div className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString('vi-VN')}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm font-medium text-gray-900">{order.customerInfo.name}</div>
                        <div className="text-xs text-gray-500">{order.customerInfo.phone}</div>
                      </td>
                      <td className="py-4 px-4 text-sm font-bold text-primary">
                        {order.totalAmount.toLocaleString('vi-VN')}đ
                      </td>
                      <td className="py-4 px-4 text-sm">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[order.status]?.color}`}>
                          <StatusIcon size={14} />
                          {statusConfig[order.status]?.label}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <select 
                          className="text-sm border border-gray-300 rounded-md px-2 py-1 outline-none focus:border-primary cursor-pointer"
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
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
