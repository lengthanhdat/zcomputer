"use client";

import { MessageCircle, PhoneCall } from "lucide-react";

export default function FloatingContact() {
  return (
    <>
      {/* Floating buttons group */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {/* Phone */}
        <a
          href="tel:0977334415"
          className="w-14 h-14 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-700 hover:scale-110 transition-all group relative animate-bounce"
          style={{ animationDuration: '2s' }}
        >
          <PhoneCall size={24} />
          <span className="absolute right-16 bg-red-600 text-white px-3 py-1 rounded font-bold text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            0977 334 415
          </span>
        </a>

        {/* Zalo */}
        <a
          href="https://zalo.me/0977334415"
          target="_blank"
          rel="noreferrer"
          className="w-14 h-14 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 hover:scale-110 transition-all relative group"
        >
          <span className="font-bold text-xl">Zalo</span>
          <span className="absolute right-16 bg-blue-500 text-white px-3 py-1 rounded font-bold text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Chat Zalo ngay
          </span>
        </a>

        {/* Messenger */}
        <a
          href="https://m.me/pcgamingthuduc"
          target="_blank"
          rel="noreferrer"
          className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 hover:scale-110 transition-all relative group"
        >
          <MessageCircle size={24} />
          <span className="absolute right-16 bg-blue-600 text-white px-3 py-1 rounded font-bold text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Chat Facebook
          </span>
        </a>
      </div>
    </>
  );
}
