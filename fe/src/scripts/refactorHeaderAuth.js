const fs = require('fs');

const headerAuthPath = 'c:/ZComputer/zcomputer/fe/src/components/HeaderAuth.tsx';

const code = `"use client";

import Link from "next/link";
import { LogOut, User, Shield, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface HeaderAuthProps {
  isMobile?: boolean;
  onLinkClick?: () => void;
}

export default function HeaderAuth({ isMobile, onLinkClick }: HeaderAuthProps) {
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
    if (onLinkClick) onLinkClick();
    router.push("/login");
  };

  if (!mounted) return null;

  if (isMobile) {
    if (!user) {
      return (
        <div className="flex flex-col gap-3">
          <Link href="/login" onClick={onLinkClick} className="flex items-center gap-2 py-2 text-sm font-semibold text-gray-800 hover:text-primary transition-colors">
            <User size={18} /> Đăng nhập
          </Link>
          <Link href="/register" onClick={onLinkClick} className="flex items-center gap-2 py-2 text-sm font-semibold text-gray-800 hover:text-primary transition-colors">
            Đăng ký tài khoản
          </Link>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3 py-2 mb-2 border-b border-gray-50">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <User size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] text-gray-500">Xin chào,</span>
            <span className="text-sm font-bold text-gray-800">{user.name}</span>
          </div>
        </div>
        
        <Link href="/profile" onClick={onLinkClick} className="flex items-center gap-2 py-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors">
          <Settings size={18} /> Hồ sơ cá nhân
        </Link>
        
        {(user.role === 'admin' || user.role === 'staff') && (
          <Link href="/admin" onClick={onLinkClick} className="flex items-center gap-2 py-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors">
            <Shield size={18} /> Trang Quản Trị
          </Link>
        )}

        <button onClick={handleLogout} className="w-full flex items-center gap-2 py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
          <LogOut size={18} /> Đăng xuất
        </button>
      </div>
    );
  }

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
`;

fs.writeFileSync(headerAuthPath, code);

// Now update Header.tsx to use isMobile and onLinkClick
let headerContent = fs.readFileSync('c:/ZComputer/zcomputer/fe/src/components/Header.tsx', 'utf8');
headerContent = headerContent.replace(
  /<div onClick=\{\(\) => setMobileMenuOpen\(false\)\}>\s*<HeaderAuth \/>\s*<\/div>/g,
  '<HeaderAuth isMobile={true} onLinkClick={() => setMobileMenuOpen(false)} />'
);
fs.writeFileSync('c:/ZComputer/zcomputer/fe/src/components/Header.tsx', headerContent);
