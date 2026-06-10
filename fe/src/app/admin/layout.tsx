"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, LayoutDashboard, Settings, LogOut, Users, Warehouse, ClipboardList } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menuItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { href: "/admin/products", label: "Sản phẩm", icon: Package },
    { href: "/admin/inventory", label: "Quản lý kho", icon: Warehouse },
    { href: "/admin/orders", label: "Đơn hàng", icon: ClipboardList },
    { href: "/admin/categories", label: "Danh mục", icon: Settings },
    { href: "/admin/users", label: "Khách hàng", icon: Users },
    { href: "/admin/banners", label: "Banners", icon: LayoutDashboard },
  ];

  const isActive = (item: typeof menuItems[0]) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname?.startsWith(item.href);
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111111] text-white flex flex-col">
        <div className="p-6 text-2xl font-black text-center text-primary uppercase border-b border-gray-800">
          ZCOMPUTER <span className="text-white text-sm block font-normal">Admin Panel</span>
        </div>
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
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
        <div className="p-4 border-t border-gray-800">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded hover:bg-gray-800 transition-colors text-gray-400 text-sm">
            <LogOut size={18} /> Về trang chủ
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm h-16 flex items-center px-6 justify-between">
          <h2 className="text-xl font-bold text-gray-800">Quản trị hệ thống</h2>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">A</div>
            <span className="text-sm font-semibold text-gray-700">Admin</span>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
