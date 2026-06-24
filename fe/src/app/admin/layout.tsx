"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Package, LayoutDashboard, Settings, LogOut, Users, Warehouse, ClipboardList, Menu, X, Tags, MessageCircle, BellRing, Play, Briefcase, Newspaper, Activity } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import toast from "react-hot-toast";

const menuItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true, allowedRoles: ['admin', 'staff'] },
  { href: "/admin/products", label: "Sản phẩm", icon: Package, allowedRoles: ['admin', 'staff'] },
  { href: "/admin/inventory", label: "Quản lý kho", icon: Warehouse, allowedRoles: ['admin', 'staff'] },
  { href: "/admin/orders", label: "Đơn hàng", icon: ClipboardList, allowedRoles: ['admin', 'staff'] },
  { href: "/admin/categories", label: "Danh mục", icon: Tags, allowedRoles: ['admin', 'staff'] },
  { href: "/admin/news", label: "Tin tức", icon: Newspaper, allowedRoles: ['admin', 'staff'] },
  { href: "/admin/subscribers", label: "Khách Đăng ký", icon: Newspaper, allowedRoles: ['admin', 'staff'] },
  { href: "/admin/users", label: "Khách hàng", icon: Users, allowedRoles: ['admin'] },
  { href: "/admin/feedbacks", label: "Góp ý", icon: MessageCircle, allowedRoles: ['admin', 'staff'] },
  { href: "/admin/banners", label: "Banners", icon: LayoutDashboard, allowedRoles: ['admin', 'staff'] },
  { href: "/admin/video-reviews", label: "Video Reviews", icon: Play, allowedRoles: ['admin', 'staff'] },
  { href: "/admin/jobs", label: "Tuyển dụng", icon: Briefcase, allowedRoles: ['admin', 'staff'] },
  { href: "/admin/announcement", label: "Thông báo", icon: BellRing, allowedRoles: ['admin', 'staff'] },
  { href: "/admin/settings", label: "Cài đặt chung", icon: Settings, allowedRoles: ['admin', 'staff'] },
  { href: "/admin/logs", label: "Nhật ký hoạt động", icon: Activity, allowedRoles: ['admin'] },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
      router.replace('/');
      return;
    }

    const currentMenu = menuItems.find(item => 
      item.exact ? pathname === item.href : pathname?.startsWith(item.href)
    );

    if (currentMenu && !currentMenu.allowedRoles.includes(user.role)) {
      toast.error("Bạn không có quyền truy cập trang này!");
      router.replace('/admin');
    }
  }, [mounted, user, router, pathname]);

  // Đóng menu khi chuyển trang trên mobile
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  if (!mounted) return null;
  if (!user || (user.role !== 'admin' && user.role !== 'staff')) return null;

  const visibleMenuItems = menuItems.filter(item => item.allowedRoles.includes(user.role));

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const isActive = (item: typeof menuItems[0]) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname?.startsWith(item.href);
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed z-50 inset-y-0 left-0 w-64 bg-[#111111] text-white flex flex-col transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-4 md:p-6 flex items-center justify-between border-b border-gray-800">
          <div className="text-2xl font-black text-primary uppercase w-full text-center">
            ZCOMPUTER <span className="text-white text-sm block font-normal">Admin Panel</span>
          </div>
          <button className="md:hidden text-gray-400 absolute right-4 top-6" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {visibleMenuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all text-sm ${
                  active
                    ? "bg-primary/20 text-primary font-bold border-l-4 border-primary"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <Icon size={18} /> {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-800 space-y-2">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded hover:bg-gray-800 transition-colors text-gray-400 text-sm">
            <LogOut size={18} /> Về trang chủ
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded hover:bg-primary/20 hover:text-primary transition-colors text-gray-400 text-sm text-left"
          >
            <LogOut size={18} /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col w-full min-w-0 h-screen overflow-hidden">
        <header className="bg-white shadow-sm h-16 flex items-center px-4 md:px-6 justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button 
              className="md:hidden p-2 -ml-2 text-gray-600 hover:text-gray-900 focus:outline-none" 
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h2 className="text-lg md:text-xl font-bold text-gray-800 truncate">Quản trị hệ thống</h2>
          </div>
          <div className="flex items-center gap-3 shrink-0 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm uppercase shadow-sm">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="hidden sm:flex flex-col pr-2">
              <span className="text-sm font-bold text-gray-800 leading-tight">
                {user?.name || 'Người dùng'}
              </span>
              <span className="text-[11px] text-gray-500 uppercase font-semibold leading-tight">
                {user?.role === 'admin' ? 'Quản trị viên' : 'Nhân viên'}
              </span>
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
