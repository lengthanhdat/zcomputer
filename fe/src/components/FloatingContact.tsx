"use client";

import { MessageCircle, PhoneCall, ChevronUp, X, Headset, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import FeedbackModal from "./FeedbackModal";

export default function FloatingContact() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

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
      <div className="fixed bottom-[90px] md:bottom-6 right-4 md:right-6 z-[90] flex flex-col gap-3 items-end">
        {/* Scroll to Top */}
        <button
          onClick={scrollToTop}
          className={`w-11 h-11 md:w-14 md:h-14 bg-gray-800/80 backdrop-blur-md border border-gray-600/50 text-white rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.3)] hover:bg-red-600 hover:border-red-500 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-all duration-300 relative group ${
            showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none hidden"
          }`}
        >
          <ChevronUp className="w-6 h-6 md:w-7 md:h-7" />
          <span className="absolute right-full mr-3 bg-gray-800 text-white px-3 py-1 rounded font-bold text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden md:block">
            Lên đầu trang
          </span>
        </button>

        {/* Contact Menu */}
        <div className="flex flex-col items-center gap-3">
          {/* Expanded Buttons */}
          <div 
            className={`flex flex-col gap-3 transition-all duration-500 origin-bottom ${
              isOpen ? 'opacity-100 max-h-[300px] scale-100 pointer-events-auto' : 'opacity-0 max-h-0 scale-50 pointer-events-none'
            }`}
          >
            {/* Feedback / Góp ý */}
            <button
              onClick={() => {
                setIsFeedbackOpen(true);
                setIsOpen(false);
              }}
              className="w-11 h-11 md:w-14 md:h-14 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.4)] hover:scale-110 transition-all group relative"
            >
              <MessageSquare className="w-5 h-5 md:w-6 md:h-6 group-hover:animate-bounce" />
              <span className="absolute right-full mr-3 bg-indigo-600 text-white px-3 py-1 rounded font-bold text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden md:block">
                Góp ý
              </span>
            </button>

            {/* Phone */}
            <a
              href="tel:0977334415"
              className="w-11 h-11 md:w-14 md:h-14 bg-red-600 text-white rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:bg-red-700 hover:scale-110 transition-all group relative"
            >
              <PhoneCall className="w-5 h-5 md:w-6 md:h-6" />
              <span className="absolute right-full mr-3 bg-red-600 text-white px-3 py-1 rounded font-bold text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden md:block">
                0977 334 415
              </span>
            </a>

            {/* Zalo */}
            <a
              href="https://zalo.me/0977334415"
              target="_blank"
              rel="noreferrer"
              className="w-11 h-11 md:w-14 md:h-14 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.4)] hover:bg-blue-600 hover:scale-110 transition-all relative group"
            >
              <span className="font-bold text-[13px] md:text-xl">Zalo</span>
              <span className="absolute right-full mr-3 bg-blue-500 text-white px-3 py-1 rounded font-bold text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden md:block">
                Chat Zalo ngay
              </span>
            </a>

            {/* Messenger */}
            <a
              href="https://m.me/pcgamingthuduc"
              target="_blank"
              rel="noreferrer"
              className="w-11 h-11 md:w-14 md:h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:bg-blue-700 hover:scale-110 transition-all relative group"
            >
              <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
              <span className="absolute right-full mr-3 bg-blue-600 text-white px-3 py-1 rounded font-bold text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden md:block">
                Chat Facebook
              </span>
            </a>
          </div>

          {/* Main Toggle Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`w-11 h-11 md:w-14 md:h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.5)] hover:bg-red-700 hover:scale-110 transition-all relative z-50 ${isOpen ? '' : 'animate-bounce'}`}
            style={{ animationDuration: '2s' }}
          >
            {isOpen ? <X className="w-5 h-5 md:w-6 md:h-6" /> : <Headset className="w-5 h-5 md:w-6 md:h-6" />}
            {!isOpen && (
               <span className="absolute right-full mr-3 bg-primary text-white px-3 py-1 rounded font-bold text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden md:block">
                 Liên hệ hỗ trợ
               </span>
            )}
          </button>
        </div>
      </div>
      
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
    </>
  );
}
