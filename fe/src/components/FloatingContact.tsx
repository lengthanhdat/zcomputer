"use client";

import { MessageCircle, PhoneCall, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";

export default function FloatingContact() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {/* Floating buttons group */}
      <div className="fixed bottom-6 right-6 z-[90] flex flex-col gap-3">
        {/* Scroll to Top */}
        <button
          onClick={scrollToTop}
          className={`w-14 h-14 bg-gray-800/80 backdrop-blur-md border border-gray-600/50 text-white rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.3)] hover:bg-red-600 hover:border-red-500 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-all duration-300 relative group ${
            showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
          }`}
        >
          <ChevronUp size={28} />
          <span className="absolute right-16 bg-gray-800 text-white px-3 py-1 rounded font-bold text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Lên đầu trang
          </span>
        </button>

        {/* Phone */}
        <a
          href="tel:0977334415"
          className="w-14 h-14 bg-red-600 text-white rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:bg-red-700 hover:scale-110 transition-all group relative animate-bounce"
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
          className="w-14 h-14 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.4)] hover:bg-blue-600 hover:scale-110 transition-all relative group"
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
          className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:bg-blue-700 hover:scale-110 transition-all relative group"
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
