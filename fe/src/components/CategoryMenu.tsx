"use client";

import { useState } from "react";
import Link from "next/link";
import { Laptop, Monitor, Cpu, Server, Mouse, Keyboard, Headphones, HardDrive, Maximize, ChevronRight } from "lucide-react";

type Category = {
  _id: string;
  name: string;
  slug: string;
  parent_id?: string;
};

const getIcon = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes('màn hình') || lower.includes('monitor')) return Monitor;
  if (lower.includes('pc') || lower.includes('case')) return Server;
  if (lower.includes('linh kiện') || lower.includes('cpu') || lower.includes('vga') || lower.includes('mainboard')) return Cpu;
  if (lower.includes('chuột') || lower.includes('mouse')) return Mouse;
  if (lower.includes('phím') || lower.includes('keyboard')) return Keyboard;
  if (lower.includes('tai nghe') || lower.includes('audio')) return Headphones;
  if (lower.includes('ram') || lower.includes('hdd') || lower.includes('ssd') || lower.includes('ổ cứng')) return HardDrive;
  return Laptop;
};

export default function CategoryMenu({ categories }: { categories: Category[] }) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const mainCategories = categories.filter(c => !c.parent_id);

  return (
    <div className="relative bg-white shadow-md border border-gray-100 py-2 w-full z-30 flex flex-col rounded-b-md">
      {mainCategories.map(cat => {
        const Icon = getIcon(cat.name);
        const subCategories = categories.filter(c => c.parent_id === cat._id);
        const hasSub = subCategories.length > 0;
        const isHovered = hoveredCategory === cat._id;

        return (
          <div
            key={cat._id}
            className="group"
            onMouseEnter={() => setHoveredCategory(cat._id)}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <Link
              href={`/category/${cat.slug}`}
              className={`flex items-center justify-between px-5 py-2.5 transition-colors ${isHovered ? 'bg-[#eebd53] text-white' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <div className="flex items-center gap-3">
                <Icon size={18} className={isHovered ? 'text-white' : 'text-gray-500'} />
                <span className={`text-sm font-semibold ${isHovered ? 'text-white' : ''}`}>{cat.name}</span>
              </div>
              {hasSub && <ChevronRight size={16} className={isHovered ? 'text-white' : 'text-gray-400'} />}
            </Link>

            {/* Flyout Submenu */}
            {hasSub && isHovered && (
              <div className="absolute top-0 left-full w-[260px] bg-white shadow-xl border border-gray-100 py-2 z-40 animate-in fade-in zoom-in-95 duration-200 min-h-full">
                {subCategories.map(sub => (
                  <Link
                    key={sub._id}
                    href={`/category/${sub.slug}`}
                    className="block px-6 py-2.5 text-sm font-medium text-gray-700 hover:text-primary hover:bg-red-50/50 transition-colors"
                  >
                    {sub.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
