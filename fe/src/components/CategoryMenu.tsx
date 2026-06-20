"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Laptop, Monitor, Cpu, Server, Mouse, Keyboard, Headphones,
  HardDrive, ChevronRight, Gamepad2, CircuitBoard, Fan, Zap,
  MemoryStick, Package, Printer, Camera, Wifi, Cable,
  Computer, ScanSearch, Settings2
} from "lucide-react";

type Category = {
  _id: string;
  name: string;
  slug: string;
  parent_id?: string;
};

const getIcon = (name: string) => {
  const lower = name.toLowerCase();

  // Laptop
  if (lower.includes('laptop')) return Laptop;

  // PC / Máy tính bàn / Workstation
  if (lower.includes('workstation') || lower.includes('máy tính bàn')) return Computer;
  if ((lower.includes('pc') && !lower.includes('cpu')) || lower.includes('máy tính')) return Computer;

  // Màn hình
  if (lower.includes('màn hình') || lower.includes('monitor')) return Monitor;

  // Linh kiện
  if (lower.includes('linh kiện')) return Settings2;

  // CPU / Bộ vi xử lý
  if (lower.includes('cpu') || lower.includes('vi xử lý') || lower.includes('processor')) return Cpu;

  // VGA / Card màn hình
  if (lower.includes('vga') || lower.includes('card màn hình') || lower.includes('gpu') || lower.includes('đồ họa')) return ScanSearch;

  // Mainboard / Bo mạch chủ
  if (lower.includes('mainboard') || lower.includes('bo mạch') || lower.includes('motherboard')) return CircuitBoard;

  // RAM / Bộ nhớ
  if (lower.includes('ram') || lower.includes('bộ nhớ')) return MemoryStick;

  // Ổ cứng / HDD / SSD
  if (lower.includes('ổ cứng') || lower.includes('hdd') || lower.includes('ssd') || lower.includes('storage')) return HardDrive;

  // PSU / Nguồn
  if (lower.includes('psu') || lower.includes('nguồn')) return Zap;

  // Case / Vỏ máy tính
  if (lower.includes('case') || lower.includes('vỏ máy') || lower.includes('thùng máy')) return Server;

  // Tản nhiệt / Cooling
  if (lower.includes('tản nhiệt') || lower.includes('tan nhiệt') || lower.includes('cooling') || lower.includes('quạt')) return Fan;

  // Gaming Gear / Thiết bị gaming
  if (lower.includes('gaming') || lower.includes('gear')) return Gamepad2;

  // Chuột
  if (lower.includes('chuột') || lower.includes('mouse')) return Mouse;

  // Bàn phím
  if (lower.includes('phím') || lower.includes('keyboard')) return Keyboard;

  // Tai nghe / Loa
  if (lower.includes('tai nghe') || lower.includes('loa') || lower.includes('audio') || lower.includes('headphone')) return Headphones;

  // Webcam / Camera
  if (lower.includes('webcam') || lower.includes('camera')) return Camera;

  // Mạng / Router / Wifi
  if (lower.includes('mạng') || lower.includes('router') || lower.includes('wifi') || lower.includes('network')) return Wifi;

  // Máy in / Printer
  if (lower.includes('máy in') || lower.includes('printer') || lower.includes('in')) return Printer;

  // Dây cáp / Cable / Phụ kiện
  if (lower.includes('cáp') || lower.includes('cable') || lower.includes('phụ kiện') || lower.includes('adapter')) return Cable;

  // Mặc định
  return Package;
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
                href={`/${cat.slug}`}
                className={`flex items-center justify-between px-4 py-2 transition-all duration-300 rounded-lg ${isHovered ? 'bg-primary text-white shadow-[0_4px_15px_var(--primary-ring)] scale-[1.02]' : 'text-gray-700 hover:bg-primary/5'}`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={isHovered ? 'text-white' : 'text-gray-500 group-hover:text-primary transition-colors'} />
                  <span className={`text-sm font-semibold ${isHovered ? 'text-white' : ''}`}>{cat.name}</span>
                </div>
                {hasSub && <ChevronRight size={16} className={isHovered ? 'text-white' : 'text-gray-400 group-hover:text-primary transition-colors'} />}
              </Link>
            </div>

            {/* Flyout Submenu */}
            {hasSub && isHovered && (
              <div className="absolute top-[-10px] left-[calc(100%-4px)] w-[280px] bg-white/95 backdrop-blur-2xl shadow-[0_20px_40px_rgba(0,0,0,0.15)] border border-gray-200/50 py-3 z-40 rounded-xl animate-in fade-in slide-in-from-left-2 duration-200 min-h-[calc(100%+20px)]">
                {subCategories.map(sub => (
                  <Link
                    key={sub._id}
                    href={`/${sub.slug}`}
                    className="block px-6 py-2.5 text-sm font-medium text-gray-700 hover:text-primary hover:bg-primary/5 hover:pl-8 transition-all duration-300"
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
