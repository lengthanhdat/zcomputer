"use client";

import Link from "next/link";
import { LogOut, User } from "lucide-react";
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
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 cursor-pointer group">
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
          <User size={24} />
        </div>
        <div className="hidden md:flex flex-col">
          <span className="text-xs text-gray-500">Xin chào,</span>
          <span className="text-sm font-bold text-gray-800">{user.name}</span>
        </div>
      </div>
      {(user.role === 'admin' || user.role === 'staff') && (
        <Link href="/admin" className="text-sm font-semibold text-primary hover:underline bg-red-50 px-2 py-1 rounded">
          Trang Quản Trị
        </Link>
      )}
      <button onClick={handleLogout} className="text-gray-500 hover:text-red-600 transition-colors" title="Đăng xuất">
        <LogOut size={20} />
      </button>
    </div>
  );
}
