"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";

interface AnnouncementData {
  isActive: boolean;
  title: string;
  content: string;
  image: string;
  link: string;
  version: number;
}

export default function PopupAnnouncement() {
  const [data, setData] = useState<AnnouncementData | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fetch announcement data
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:5000/api"}/settings/popup_announcement`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then(setting => {
        if (setting && setting.value) {
          const announcement = setting.value as AnnouncementData;
          setData(announcement);
          
          if (announcement.isActive) {
            // Check if user has already seen this version in this session
            const seenVersion = sessionStorage.getItem('seen_popup_version');
            if (!seenVersion || parseInt(seenVersion, 10) < announcement.version) {
              // Delay slightly for a smoother entrance
              setTimeout(() => setIsVisible(true), 1500);
            }
          }
        }
      })
      .catch(err => console.error("Error fetching popup announcement:", err));
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    if (data) {
      sessionStorage.setItem('seen_popup_version', String(data.version));
    }
  };

  if (!isVisible || !data) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 transition-opacity duration-500 animate-in fade-in">
      <div className="relative bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.15)] border border-white/60 max-w-[500px] w-full overflow-hidden transform transition-all duration-500 animate-in zoom-in-95 slide-in-from-bottom-4">
        
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 bg-white/50 hover:bg-white text-gray-600 rounded-full p-2 backdrop-blur-md transition-all shadow-sm border border-white/60"
        >
          <X size={18} />
        </button>

        {/* Content Wrapper */}
        <div className="flex flex-col relative z-10">
          
          {/* Image (Optional) */}
          {data.image && (
            <div className="relative w-full aspect-video bg-gray-100/50">
              <Image 
                src={data.image} 
                alt={data.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          )}

          {/* Text Content */}
          <div className="p-8 text-center flex flex-col items-center">
            {/* If no image, show an icon or badge */}
            {!data.image && (
              <div className="mb-5 bg-white/60 text-gray-800 px-5 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase border border-white/60 shadow-sm backdrop-blur-md">
                Thông báo mới
              </div>
            )}
            
            <h2 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">
              {data.title}
            </h2>
            
            <p className="text-gray-600 text-[15px] leading-relaxed mb-8 whitespace-pre-wrap font-medium">
              {data.content}
            </p>

            {/* Actions */}
            <div className="flex w-full gap-3">
              {data.link ? (
                <Link 
                  href={data.link}
                  onClick={handleClose}
                  className="flex-1 bg-gray-900 hover:bg-black text-white font-bold py-3.5 px-6 rounded-2xl transition-all shadow-lg shadow-gray-900/20"
                >
                  XEM NGAY
                </Link>
              ) : (
                <button 
                  onClick={handleClose}
                  className="flex-1 bg-gray-900 hover:bg-black text-white font-bold py-3.5 px-6 rounded-2xl transition-all shadow-lg shadow-gray-900/20"
                >
                  ĐÃ HIỂU
                </button>
              )}
            </div>
            
            {/* Skip Text */}
            {data.link && (
               <button onClick={handleClose} className="text-sm font-semibold text-gray-500 hover:text-gray-800 mt-5 transition-colors">
                 Bỏ qua
               </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
