"use client";

import Link from "next/link";
import { LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";

type StoredUser = {
  name?: string;
};

export default function HeaderAuth() {
  const router = useRouter();
  const user = useSyncExternalStore(subscribeToUser, getStoredUser, () => null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("zcomputer-user-change"));
    router.push("/login");
  };

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
      <Link href="/admin" className="text-sm font-semibold text-primary hover:underline bg-red-50 px-2 py-1 rounded">
        Trang Quan Tri
      </Link>
      <button onClick={handleLogout} className="text-gray-500 hover:text-red-600 transition-colors" title="Dang xuat">
        <LogOut size={20} />
      </button>
    </div>
  );
}

// --- Cached external store for user data ---
let cachedRaw: string | null = null;
let cachedUser: StoredUser | null = null;

function subscribeToUser(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener("zcomputer-user-change", onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener("zcomputer-user-change", onStoreChange);
  };
}

function getStoredUser(): StoredUser | null {
  const raw = localStorage.getItem("user");
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    if (!raw) {
      cachedUser = null;
    } else {
      try {
        cachedUser = JSON.parse(raw);
      } catch {
        localStorage.removeItem("user");
        cachedUser = null;
      }
    }
  }
  return cachedUser;
}
