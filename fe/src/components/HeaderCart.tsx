"use client";

import { useCartStore } from "@/store/useCartStore";
import { Heart } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HeaderCart() {
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((state) => state.items);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = mounted ? items.reduce((acc, item) => acc + item.quantity, 0) : 0;

  return (
    <Link href="/cart" className="relative p-2 text-gray-700 hover:text-primary transition-colors flex items-center gap-1" title="Sản phẩm yêu thích">
      <Heart size={24} />
      {totalItems > 0 && (
        <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-primary text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-white">
          {totalItems}
        </span>
      )}
    </Link>
  );
}
