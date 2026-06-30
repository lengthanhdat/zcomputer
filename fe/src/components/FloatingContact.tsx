"use client";

import { MessageCircle, PhoneCall, ChevronUp, X, Headset, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import FeedbackModal from "./FeedbackModal";
import { SiZalo } from "react-icons/si";
import { FaFacebookF } from "react-icons/fa";

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
          className={`w-11 h-11 md:w-14 md:h-14 bg-gray-800/80 backdrop-blur-md border border-gray-600/50 text-white rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.3)] hover:bg-primary hover:border-primary hover:-translate-y-1 hover:shadow-[0_0_20px_var(--primary-ring)] transition-all duration-300 relative group ${
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
          {/* All Contact Buttons */}
          <div 
            className={`flex flex-col gap-3 transition-all duration-300 origin-bottom md:opacity-100 md:max-h-[500px] md:scale-100 md:pointer-events-auto ${
              isOpen ? 'opacity-100 max-h-[300px] scale-100 pointer-events-auto' : 'opacity-0 max-h-0 scale-50 pointer-events-none'
            }`}
          >
            {/* Feedback / Góp ý */}
            <div className="relative group">
              <div className="absolute inset-0 bg-indigo-500 rounded-full animate-ping opacity-50" style={{ animationDuration: '2s' }}></div>
              <div className="absolute -inset-2 bg-indigo-500/20 rounded-full animate-pulse"></div>
              <button
                onClick={() => setIsFeedbackOpen(true)}
                className="relative w-11 h-11 md:w-14 md:h-14 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all z-10"
              >
                <MessageSquare className="w-5 h-5 md:w-6 md:h-6 group-hover:animate-bounce" />
                <span className="absolute right-full mr-3 bg-indigo-600 text-white px-3 py-1 rounded font-bold text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden md:block">
                  Góp ý
                </span>
              </button>
            </div>

            {/* Phone */}
            <div className="relative group">
              <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-50" style={{ animationDuration: '2s', animationDelay: '0.2s' }}></div>
              <div className="absolute -inset-2 bg-red-500/20 rounded-full animate-pulse"></div>
              <a
                href="tel:0977334415"
                className="relative w-11 h-11 md:w-14 md:h-14 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg hover:brightness-110 hover:scale-110 transition-all z-10"
              >
                <PhoneCall className="w-5 h-5 md:w-6 md:h-6" />
                <span className="absolute right-full mr-3 bg-red-600 text-white px-3 py-1 rounded font-bold text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden md:block">
                  0977 334 415
                </span>
              </a>
            </div>

            {/* Zalo */}
            <div className="relative group">
              <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-50" style={{ animationDuration: '2s', animationDelay: '0.4s' }}></div>
              <div className="absolute -inset-2 bg-blue-400/20 rounded-full animate-pulse"></div>
              <a
                href="https://zalo.me/0977334415"
                target="_blank"
                rel="noreferrer"
                className="relative w-11 h-11 md:w-14 md:h-14 bg-[#0068FF] text-white rounded-full flex items-center justify-center shadow-lg hover:brightness-110 hover:scale-110 transition-all z-10"
              >
                <SiZalo className="w-6 h-6 md:w-8 md:h-8" />
                <span className="absolute right-full mr-3 bg-[#0068FF] text-white px-3 py-1 rounded font-bold text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden md:block">
                  Chat Zalo ngay
                </span>
              </a>
            </div>

            {/* Facebook */}
            <div className="relative group">
              <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-50" style={{ animationDuration: '2s', animationDelay: '0.6s' }}></div>
              <div className="absolute -inset-2 bg-blue-500/20 rounded-full animate-pulse"></div>
              <a
                href="https://www.facebook.com/pcgamingthuduc"
                target="_blank"
                rel="noreferrer"
                className="relative w-11 h-11 md:w-14 md:h-14 bg-[#1877F2] text-white rounded-full flex items-center justify-center shadow-lg hover:brightness-110 hover:scale-110 transition-all z-10"
              >
                <FaFacebookF className="w-5 h-5 md:w-7 md:h-7" />
                <span className="absolute right-full mr-3 bg-[#1877F2] text-white px-3 py-1 rounded font-bold text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden md:block">
                  Chat Facebook
                </span>
              </a>
            </div>
          </div>

          {/* Main Toggle Button (Mobile Only) */}
          <div className="relative md:hidden mt-2">
            {!isOpen && (
              <>
                <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-50" style={{ animationDuration: '2s' }}></div>
                <div className="absolute -inset-2 bg-primary/20 rounded-full animate-pulse"></div>
              </>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-11 h-11 bg-primary text-white rounded-full flex items-center justify-center shadow-[0_0_15px_var(--primary-ring)] transition-all relative z-50"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Headset className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
      
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
    </>
  );
}
