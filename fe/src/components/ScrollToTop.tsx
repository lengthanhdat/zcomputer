"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="w-14 h-14 bg-white text-gray-700 border border-gray-200 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-all duration-300 hover:-translate-y-1 group relative"
          aria-label="Cuộn lên đầu trang"
        >
          <ChevronUp size={24} strokeWidth={3} />
          <span className="absolute right-16 bg-white text-gray-700 border border-gray-200 px-3 py-1 rounded font-bold text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
            Lên đầu trang
          </span>
        </button>
      )}
    </>
  );
}
