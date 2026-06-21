"use client";

import Link from "next/link";
import { LogOut, User, Shield, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function HeaderAuth() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { user, logout } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error("Logout API failed", error);
    }
    logout();
    toast.success("Đã đăng xuất thành công!");
    router.push("/login");
  };

  if (!mounted) return null;

  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <Link href="/login" className="text-sm font-semibold text-gray-800 hover:text-primary transition-colors">Đăng nhập</Link>
        <span className="text-gray-300">|</span>
        <Link href="/register" className="text-sm font-semibold text-gray-800 hover:text-primary transition-colors">Đăng ký</Link>
      </div>
    );
  }

  return (
    <div className="relative group pb-2">
      <div className="flex items-center gap-2 cursor-pointer">
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
          <User size={24} />
        </div>
        <div className="hidden md:flex flex-col">
          <span className="text-xs text-gray-500">Xin chào,</span>
          <span className="text-sm font-bold text-gray-800">{user.name}</span>
        </div>
      </div>

      {/* Dropdown Menu */}
      <div className="absolute top-full right-0 w-48 bg-white border border-gray-100 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden transform origin-top-right group-hover:translate-y-0 translate-y-2">
        <div className="py-1">
          <Link href="/profile" className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">
            <Settings size={16} />
            Hồ sơ cá nhân
          </Link>
          
          {(user.role === 'admin' || user.role === 'staff') && (
            <Link href="/admin" className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">
              <Shield size={16} />
              Trang Quản Trị
            </Link>
          )}

          <div className="h-px bg-gray-100 my-1"></div>

          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-primary hover:bg-primary/10 transition-colors">
            <LogOut size={16} />
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
}
