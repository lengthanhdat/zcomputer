"use client";

import { Package, FolderTree, Users, ArrowRight, DollarSign, ClipboardList, Warehouse } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    users: 0,
    orders: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/api/stats");
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Đang tải dữ liệu...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Tổng quan hệ thống</h1>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium">Tổng Doanh Thu</h3>
            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
              <DollarSign size={20} />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-600">{stats.revenue.toLocaleString("vi-VN")}đ</p>
          <Link href="/admin/orders" className="mt-4 text-sm text-emerald-600 flex items-center gap-1 hover:underline">
             Xem doanh thu đơn hàng <ArrowRight size={14} />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium">Đơn Hàng</h3>
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
              <ClipboardList size={20} />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800">{stats.orders}</p>
          <Link href="/admin/orders" className="mt-4 text-sm text-indigo-600 flex items-center gap-1 hover:underline">
             Quản lý đơn hàng <ArrowRight size={14} />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium">Sản Phẩm</h3>
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
              <Package size={20} />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800">{stats.products}</p>
          <Link href="/admin/products" className="mt-4 text-sm text-blue-600 flex items-center gap-1 hover:underline">
             Danh sách sản phẩm <ArrowRight size={14} />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium">Thành Viên</h3>
            <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
              <Users size={20} />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800">{stats.users}</p>
          <span className="mt-4 block text-xs text-gray-400">Khách hàng đăng ký</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
           <h3 className="text-lg font-bold text-gray-800 mb-4">Thao tác nhanh</h3>
           <div className="grid grid-cols-2 gap-4">
             <Link href="/admin/products/new" className="flex flex-col items-center justify-center p-6 border border-dashed border-gray-300 rounded hover:bg-gray-50 hover:border-primary transition-colors group">
               <div className="w-12 h-12 bg-red-50 text-primary rounded-full flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-white transition-colors">
                 <Package size={24} />
               </div>
               <span className="font-medium text-gray-700">Thêm sản phẩm</span>
             </Link>
             <Link href="/admin/inventory" className="flex flex-col items-center justify-center p-6 border border-dashed border-gray-300 rounded hover:bg-gray-50 hover:border-primary transition-colors group">
               <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mb-3 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                 <Warehouse size={24} />
               </div>
               <span className="font-medium text-gray-700">Kiểm kho nhanh</span>
             </Link>
           </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Trạng thái kho hàng</h3>
            <p className="text-sm text-gray-500 mb-4">
              Theo dõi và kiểm soát số lượng tồn kho của tất cả sản phẩm đang bán.
            </p>
          </div>
          <Link href="/admin/inventory" className="w-full bg-gray-800 text-white font-bold py-3 px-4 rounded text-center hover:bg-gray-700 transition-colors flex items-center justify-center gap-2">
            <Warehouse size={18} /> Đi đến trang quản lý kho
          </Link>
        </div>
      </div>
    </div>
  );
}
