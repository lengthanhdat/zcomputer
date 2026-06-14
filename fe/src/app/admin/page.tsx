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
        if (res.ok) {
          const data = await res.json();
          setStats({
            products: data.products || 0,
            categories: data.categories || 0,
            users: data.users || 0,
            orders: data.orders || 0,
            revenue: data.revenue || 0,
          });
        }
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const today = new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  if (loading) return (
    <div className="flex h-[80vh] items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-red-50 rounded-full blur-3xl opacity-70 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Tổng quan hệ thống</h1>
          <p className="text-gray-500 font-medium">Hôm nay: {today}</p>
        </div>
        <div className="relative z-10 flex items-center gap-3">
          <Link href="/admin/settings" className="px-5 py-2.5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-gray-900/20">
            Cấu hình hệ thống
          </Link>
        </div>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Doanh thu */}
        <div className="bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Tổng Doanh Thu</h3>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <DollarSign size={24} />
              </div>
            </div>
            <p className="text-3xl font-black text-gray-900 tracking-tight">{stats.revenue.toLocaleString("vi-VN")}đ</p>
            <Link href="/admin/orders" className="mt-5 text-sm font-bold text-emerald-600 flex items-center gap-1.5 hover:gap-2 transition-all w-max">
               Báo cáo chi tiết <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Đơn hàng */}
        <div className="bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Đơn Hàng Mới</h3>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <ClipboardList size={24} />
              </div>
            </div>
            <p className="text-3xl font-black text-gray-900 tracking-tight">{stats.orders}</p>
            <Link href="/admin/orders" className="mt-5 text-sm font-bold text-blue-600 flex items-center gap-1.5 hover:gap-2 transition-all w-max">
               Quản lý đơn hàng <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Sản phẩm */}
        <div className="bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Sản Phẩm</h3>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                <Package size={24} />
              </div>
            </div>
            <p className="text-3xl font-black text-gray-900 tracking-tight">{stats.products}</p>
            <Link href="/admin/products" className="mt-5 text-sm font-bold text-orange-600 flex items-center gap-1.5 hover:gap-2 transition-all w-max">
               Cập nhật kho <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Thành viên */}
        <div className="bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Thành Viên</h3>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Users size={24} />
              </div>
            </div>
            <p className="text-3xl font-black text-gray-900 tracking-tight">{stats.users}</p>
            <Link href="/admin/users" className="mt-5 text-sm font-bold text-purple-600 flex items-center gap-1.5 hover:gap-2 transition-all w-max">
               Quản lý User <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8">
           <div className="flex items-center justify-between mb-6">
             <h3 className="text-xl font-bold text-gray-900">Bảng điều khiển nhanh</h3>
             <div className="w-10 h-1 bg-red-500 rounded-full"></div>
           </div>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <Link href="/admin/products/new" className="flex flex-col items-center justify-center p-6 bg-gray-50 border border-gray-100 rounded-2xl hover:bg-white hover:border-red-200 hover:shadow-xl hover:shadow-red-500/10 transition-all group">
               <div className="w-14 h-14 bg-white text-gray-600 rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:bg-red-500 group-hover:text-white transition-all duration-300 group-hover:scale-110">
                 <Package size={28} />
               </div>
               <span className="font-bold text-sm text-gray-700 group-hover:text-red-600">Thêm SP</span>
             </Link>
             
             <Link href="/admin/categories" className="flex flex-col items-center justify-center p-6 bg-gray-50 border border-gray-100 rounded-2xl hover:bg-white hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/10 transition-all group">
               <div className="w-14 h-14 bg-white text-gray-600 rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 group-hover:scale-110">
                 <FolderTree size={28} />
               </div>
               <span className="font-bold text-sm text-gray-700 group-hover:text-blue-600">Danh Mục</span>
             </Link>
             
             <Link href="/admin/inventory" className="flex flex-col items-center justify-center p-6 bg-gray-50 border border-gray-100 rounded-2xl hover:bg-white hover:border-amber-200 hover:shadow-xl hover:shadow-amber-500/10 transition-all group">
               <div className="w-14 h-14 bg-white text-gray-600 rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:bg-amber-500 group-hover:text-white transition-all duration-300 group-hover:scale-110">
                 <Warehouse size={28} />
               </div>
               <span className="font-bold text-sm text-gray-700 group-hover:text-amber-600">Kiểm Kho</span>
             </Link>

             <Link href="/admin/orders" className="flex flex-col items-center justify-center p-6 bg-gray-50 border border-gray-100 rounded-2xl hover:bg-white hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/10 transition-all group">
               <div className="w-14 h-14 bg-white text-gray-600 rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 group-hover:scale-110">
                 <ClipboardList size={28} />
               </div>
               <span className="font-bold text-sm text-gray-700 group-hover:text-emerald-600">Đơn Hàng</span>
             </Link>
           </div>
        </div>

        {/* Promo / Banner block */}
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-xl shadow-gray-900/20 p-8 flex flex-col justify-between relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 w-40 h-40 bg-red-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md mb-6 border border-white/10">
              <Warehouse className="text-red-400" size={24} />
            </div>
            <h3 className="text-2xl font-black mb-3">Tình trạng kho lưu trữ</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 font-medium">
              Kiểm tra hàng tồn, cảnh báo hết hàng và quản lý nhập xuất theo thời gian thực.
            </p>
          </div>
          <Link href="/admin/inventory" className="relative z-10 w-full bg-red-600 text-white font-bold py-4 px-6 rounded-xl text-center hover:bg-red-500 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-600/30">
            Mở trình quản lý <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
