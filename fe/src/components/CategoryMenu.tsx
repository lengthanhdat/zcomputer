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

  const mainCategories = Array.isArray(categories) ? categories.filter(c => c && !c.parent_id) : [];

  return (
    <div className="relative bg-white/95 backdrop-blur-2xl shadow-[0_20px_40px_rgba(0,0,0,0.15)] border-l border-r border-b border-gray-200/50 py-3 w-full z-30 flex flex-col rounded-b-xl">
      {mainCategories.map(cat => {
        const Icon = getIcon(cat.name);
        const subCategories = Array.isArray(categories) ? categories.filter(c => c && c.parent_id === cat._id) : [];
        const hasSub = subCategories.length > 0;
        const isHovered = hoveredCategory === cat._id;

        return (
          <div
            key={cat._id}
            className="group relative"
            onMouseEnter={() => setHoveredCategory(cat._id)}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <div className="px-2 py-0.5">
              <Link
                href={`/category/${cat.slug}`}
                className={`flex items-center justify-between px-4 py-2 transition-all duration-300 rounded-lg ${isHovered ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-[0_4px_15px_rgba(239,68,68,0.3)] scale-[1.02]' : 'text-gray-700 hover:bg-red-50/50'}`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={isHovered ? 'text-white' : 'text-gray-500 group-hover:text-red-500 transition-colors'} />
                  <span className={`text-sm font-semibold ${isHovered ? 'text-white' : ''}`}>{cat.name}</span>
                </div>
                {hasSub && <ChevronRight size={16} className={isHovered ? 'text-white' : 'text-gray-400 group-hover:text-red-400 transition-colors'} />}
              </Link>
            </div>

            {/* Flyout Submenu */}
            {hasSub && isHovered && (
              <div className="absolute top-[-10px] left-[calc(100%-4px)] w-[280px] bg-white/95 backdrop-blur-2xl shadow-[0_20px_40px_rgba(0,0,0,0.15)] border border-gray-200/50 py-3 z-40 rounded-xl animate-in fade-in slide-in-from-left-2 duration-200 min-h-[calc(100%+20px)]">
                {subCategories.map(sub => (
                  <Link
                    key={sub._id}
                    href={`/category/${sub.slug}`}
                    className="block px-6 py-2.5 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50/80 hover:pl-8 transition-all duration-300"
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
