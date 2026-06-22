"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Monitor, Expand, ArrowLeft, MousePointerClick, CheckCircle2, Zap } from "lucide-react";
import Link from "next/link";

const TEST_SCREENS = [
  { id: "white", name: "Trắng (Đốm đen)", type: "color", hex: "#FFFFFF", text: "black" },
  { id: "black", name: "Đen (Hở sáng)", type: "color", hex: "#000000", text: "white" },
  { id: "red", name: "Đỏ (Pixel chết)", type: "color", hex: "#FF0000", text: "white" },
  { id: "green", name: "Xanh lá (Pixel chết)", type: "color", hex: "#00FF00", text: "black" },
  { id: "blue", name: "Xanh dương (Pixel chết)", type: "color", hex: "#0000FF", text: "white" },
  { id: "gradient-bw", name: "Dải Gradient (Đen-Trắng)", type: "gradient-bw" },
  { id: "grid", name: "Lưới (Độ méo hình)", type: "grid" },
  { id: "text", name: "Độ Nét Chữ (Sharpness)", type: "text" },
];

export default function MonitorTestPage() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      try {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } catch (err) {
        alert("Trình duyệt của bạn không hỗ trợ chế độ toàn màn hình trên điện thoại, hãy xoay ngang màn hình để xem tốt nhất!");
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % TEST_SCREENS.length);
    setShowInstructions(false);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + TEST_SCREENS.length) % TEST_SCREENS.length);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isFullscreen) {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "Enter") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    }
  }, [isFullscreen, handleNext, handlePrev]);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      if (!document.fullscreenElement) setShowInstructions(true);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFullscreen]);

  if (isFullscreen) {
    const screen = TEST_SCREENS[currentIndex];

    let content = null;
    let containerStyle: React.CSSProperties = { 
      cursor: "pointer", 
      width: "100%", 
      height: "100vh", 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center",
      userSelect: "none",
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 999999
    };

    if (screen.type === "color") {
      containerStyle.backgroundColor = screen.hex;
      containerStyle.color = screen.text;
    } else if (screen.type === "gradient-bw") {
      containerStyle.background = "linear-gradient(to right, #000000, #FFFFFF)";
    } else if (screen.type === "grid") {
      containerStyle.backgroundColor = "white";
      containerStyle.backgroundImage = `
        linear-gradient(to right, black 1px, transparent 1px),
        linear-gradient(to bottom, black 1px, transparent 1px)
      `;
      containerStyle.backgroundSize = "50px 50px";
    } else if (screen.type === "text") {
      containerStyle.backgroundColor = "white";
      containerStyle.color = "black";
      content = (
        <div className="max-w-4xl px-4 sm:px-8 text-justify flex flex-col gap-4 sm:gap-6 bg-white p-6 sm:p-10 rounded shadow-2xl w-[90%] sm:w-auto max-h-[90vh] overflow-y-auto">
          <p style={{ fontSize: "10px" }}>Size 10px: The quick brown fox jumps over the lazy dog. Máy tính ZComputer chất lượng đỉnh cao.</p>
          <p style={{ fontSize: "12px" }}>Size 12px: The quick brown fox jumps over the lazy dog. Máy tính ZComputer chất lượng đỉnh cao.</p>
          <p style={{ fontSize: "14px", fontWeight: "bold" }}>Size 14px Bold: The quick brown fox jumps over the lazy dog.</p>
          <p style={{ fontSize: "18px" }}>Size 18px: Màn hình của bạn có bị nhòe hay mờ viền chữ không?</p>
          <p style={{ fontSize: "24px" }}>Size 24px: Màn hình sắc nét giúp bảo vệ mắt.</p>
        </div>
      );
    }

    return (
      <div style={containerStyle} onClick={handleNext}>
        {content}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-bold opacity-70 pointer-events-none border border-white/10 shadow-xl tracking-wider w-max max-w-[90vw] text-center">
          {currentIndex + 1} / {TEST_SCREENS.length} - {screen.name}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-primary/100 selection:text-white font-sans relative overflow-x-hidden">
      
      {/* Premium Gaming Background */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-[0.15] mix-blend-screen pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/90 to-[#050505] pointer-events-none"></div>
      
      {/* Neon Orbs */}
      <div className="absolute top-[20%] left-[5%] w-[40vw] h-[40vw] bg-primary rounded-full blur-[150px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[10%] right-[10%] w-[30vw] h-[30vw] bg-orange-500/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-4 max-w-5xl py-12 relative z-10">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-gray-400 hover:text-primary transition-colors bg-white/5 px-4 py-2 rounded-lg backdrop-blur border border-white/5">
            <ArrowLeft size={18} className="mr-2" /> Trở về
          </Link>
        </div>

        <div className="relative group max-w-4xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-orange-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
          
          <div className="bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-14 text-center shadow-2xl relative overflow-hidden">
            
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-primary/100/10 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(239,68,68,0.2)] relative">
                <div className="absolute inset-0 bg-primary/100/20 rounded-full animate-ping opacity-50"></div>
                <Monitor size={40} className="text-primary relative z-10" />
              </div>

              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4 text-white">
                Kiểm tra Màn Hình
              </h1>

              <p className="text-gray-400 max-w-lg mx-auto mb-10 leading-relaxed px-4">
                Công cụ giúp bạn phát hiện điểm ảnh chết (Dead Pixel), hở sáng viền, méo hình và độ nhòe chữ nhanh chóng.
              </p>

              <button 
                onClick={toggleFullscreen}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-primary hover:bg-primary/100 text-white px-12 py-5 rounded-2xl font-black text-lg transition-all shadow-[0_0_30px_rgba(239,68,68,0.4)] hover:shadow-[0_0_50px_rgba(239,68,68,0.6)] hover:-translate-y-1 mb-12 uppercase tracking-widest"
              >
                <Expand size={24} /> Bắt Đầu Test
              </button>

              <div className="bg-[#111] border border-white/5 rounded-2xl p-6 text-left w-full max-w-2xl mx-auto shadow-inner">
                <h3 className="text-white font-bold mb-5 uppercase tracking-wider text-sm flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-primary" /> Hướng dẫn nhanh
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-400">
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-primary/100 mt-1.5 shrink-0"></div><p><strong className="text-gray-200">Lau sạch màn hình</strong> trước khi test để tránh nhầm bụi với điểm chết.</p></div>
                    <div className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-primary/100 mt-1.5 shrink-0"></div><p><strong className="text-gray-200">Click chuột</strong> hoặc <strong className="text-gray-200">Phím mũi tên</strong> để đổi qua lại giữa các bài test màu.</p></div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-primary/100 mt-1.5 shrink-0"></div><p><strong className="text-gray-200">Tập trung nhìn kỹ</strong> các chấm đen trên nền màu sáng hoặc chấm sáng trên nền đen.</p></div>
                    <div className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-primary/100 mt-1.5 shrink-0"></div><p><strong className="text-gray-200">Phím ESC</strong> để thoát chế độ Toàn màn hình bất kỳ lúc nào.</p></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
