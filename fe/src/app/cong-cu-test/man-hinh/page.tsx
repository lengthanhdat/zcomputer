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

const TouchGridTest = ({ onNext }: { onNext: () => void }) => {
  const [started, setStarted] = React.useState(false);
  const [touchedBoxes, setTouchedBoxes] = React.useState<Set<number>>(new Set());
  const [gridConfig, setGridConfig] = React.useState({ rows: 0, cols: 0, boxSize: 50 });
  const lastPoints = React.useRef<Map<number, {x: number, y: number}>>(new Map());

  const isCompleted = gridConfig.rows > 0 && touchedBoxes.size === gridConfig.rows * gridConfig.cols;

  React.useEffect(() => {
    const updateGrid = () => {
      // Kích thước ô vuông cố định 50px (chuẩn y như mẫu onlinemictest)
      const boxSize = window.innerWidth < 768 ? 40 : 50;
      const cols = Math.ceil(window.innerWidth / boxSize);
      const rows = Math.ceil(window.innerHeight / boxSize);
      setGridConfig({ rows, cols, boxSize });
      setTouchedBoxes(new Set()); // Reset on resize
    };
    updateGrid();
    window.addEventListener('resize', updateGrid);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener('resize', updateGrid);
      document.body.style.overflow = "";
    };
  }, []);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!started) return;
    
    // Đối với chuột, chỉ vẽ khi đang nhấn giữ chuột trái (buttons === 1)
    // Đối với cảm ứng (touch), khi ngón tay chạm màn hình thì tự động là đang vuốt
    if (e.pointerType === 'mouse' && e.buttons !== 1) return;

    const x = e.clientX;
    const y = e.clientY;
    const pointerId = e.pointerId;
    
    setTouchedBoxes(prev => {
      const next = new Set(prev);
      let changed = false;

      const updateBox = (px: number, py: number) => {
        if (px < 0 || py < 0 || px >= window.innerWidth || py >= window.innerHeight) return;
        const col = Math.floor(px / gridConfig.boxSize);
        const row = Math.floor(py / gridConfig.boxSize);
        const index = row * gridConfig.cols + col;
        if (!next.has(index)) {
          next.add(index);
          changed = true;
        }
      };

      updateBox(x, y);

      // Interpolate for fast swiping so no boxes are skipped
      const lastPoint = lastPoints.current.get(pointerId);
      if (lastPoint) {
        const dx = x - lastPoint.x;
        const dy = y - lastPoint.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > gridConfig.boxSize / 3) {
          const steps = Math.floor(distance / (gridConfig.boxSize / 3));
          for (let i = 1; i < steps; i++) {
            updateBox(lastPoint.x + dx * (i / steps), lastPoint.y + dy * (i / steps));
          }
        }
      }
      return changed ? next : prev;
    });
    
    lastPoints.current.set(pointerId, { x, y });
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!started) {
      setStarted(true);
      return;
    }
    // Set pointer capture so we keep getting events even if the finger slides slightly out of window
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    handlePointerMove(e);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    lastPoints.current.delete(e.pointerId);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch(err) {}
  };

  return (
    <div 
      className="fixed inset-0 bg-[#0a0a0a] overflow-hidden select-none touch-none z-[9999]"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* The Grid */}
      <div className="absolute inset-0 flex flex-wrap content-start pointer-events-none" style={{ width: gridConfig.cols * gridConfig.boxSize }}>
        {Array.from({ length: gridConfig.rows * gridConfig.cols }).map((_, i) => (
          <div
            key={i}
            style={{
              width: gridConfig.boxSize,
              height: gridConfig.boxSize,
            }}
            className={`relative border border-white/10 transition-colors duration-75 ${
              touchedBoxes.has(i) ? 'bg-primary shadow-[0_0_15px_rgba(239,68,68,0.3)_inset]' : 'bg-transparent'
            }`}
          >
            {/* Dấu chấm ở các góc giao nhau (top-left) */}
            <div className="absolute -top-[2px] -left-[2px] w-[4px] h-[4px] bg-white/40 rounded-full z-10 pointer-events-none"></div>
          </div>
        ))}
      </div>

      {/* Instructions Overlay */}
      {!started && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-4 z-50">
          <div className="text-white text-sm md:text-base lg:text-lg space-y-4 max-w-4xl bg-[#111]/90 p-8 rounded-xl backdrop-blur-md shadow-[0_0_50px_rgba(239,68,68,0.15)] border border-primary/20">
            <p>1. Vuốt ngón tay qua từng ô vuông trên màn hình.</p>
            <p>2. Ô vuông đổi <strong className="text-primary">màu đỏ</strong> là đã vượt qua bài test. Ô vuông nào vẫn hiển thị màu nền, dù bạn đã chạm vào nhiều lần, thì ô vuông đó có vấn đề.</p>
            <p>3. Sau khi chạm vào tất cả các ô vuông, hãy nhấn vào nút camera (hoặc phím chụp màn hình) để lưu kết quả.</p>
            <p>4. Hãy chạm vào bất kỳ chỗ nào để bắt đầu. Chúc may mắn nhé!</p>
          </div>
        </div>
      )}

      {/* Completion Overlay */}
      {isCompleted && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-[10000] pointer-events-auto">
          <div className="bg-[#111] border border-primary/50 shadow-[0_0_80px_rgba(239,68,68,0.3)] rounded-[2rem] p-10 md:p-14 flex flex-col items-center max-w-lg mx-4 text-center animate-in zoom-in duration-300">
            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 size={48} className="text-green-500 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 uppercase tracking-tight">Tuyệt Vời!</h2>
            <p className="text-gray-300 md:text-lg mb-10 leading-relaxed">
              Màn hình cảm ứng của bạn hoạt động hoàn hảo, không phát hiện điểm liệt nào trên toàn bộ bề mặt.
            </p>
            <div className="flex flex-col sm:flex-row w-full gap-4">
              <button 
                onClick={(e) => { e.stopPropagation(); setTouchedBoxes(new Set()); }}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white px-6 py-4 rounded-xl font-bold transition-all border border-white/5"
              >
                Test Lại Lần Nữa
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onNext(); }}
                className="flex-1 bg-primary hover:bg-primary/90 text-white px-6 py-4 rounded-xl font-bold shadow-[0_0_30px_rgba(239,68,68,0.4)] hover:-translate-y-1 transition-all uppercase tracking-wider"
              >
                Hoàn Tất & Thoát
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default function MonitorTestPage() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTouchFullscreen, setIsTouchFullscreen] = useState(false);
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

  const toggleTouchFullscreen = async () => {
    if (!document.fullscreenElement) {
      try {
        await document.documentElement.requestFullscreen();
        setIsTouchFullscreen(true);
      } catch (err) {
        setIsTouchFullscreen(true);
      }
    } else {
      setIsTouchFullscreen(true);
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
      const isFull = !!(document.fullscreenElement || (document as any).webkitFullscreenElement || (document as any).mozFullScreenElement || (document as any).msFullscreenElement);
      if (!isFull) {
        setIsFullscreen(false);
        setIsTouchFullscreen(false);
        setShowInstructions(true);
        document.body.style.overflow = ""; // ensure it's cleared immediately
      }
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    document.addEventListener("webkitfullscreenchange", onFullscreenChange);
    document.addEventListener("mozfullscreenchange", onFullscreenChange);
    document.addEventListener("MSFullscreenChange", onFullscreenChange);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", onFullscreenChange);
      document.removeEventListener("mozfullscreenchange", onFullscreenChange);
      document.removeEventListener("MSFullscreenChange", onFullscreenChange);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
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
      </div>
    );
  }

  if (isTouchFullscreen) {
    return (
      <TouchGridTest onNext={() => {
        setIsTouchFullscreen(false);
        if (document.fullscreenElement && document.exitFullscreen) {
          document.exitFullscreen();
        }
      }} />
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

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white">
            Bộ Công Cụ Kiểm Tra
          </h1>
          <p className="text-gray-400 mt-4 max-w-xl mx-auto">
            Test độ chuẩn của màn hình LCD và độ nhạy của màn hình cảm ứng một cách chuyên nghiệp.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Card 1: LCD Test */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-orange-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
            <div className="bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 text-center shadow-2xl relative overflow-hidden h-full flex flex-col items-center">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6 relative">
                <Monitor size={40} className="text-primary relative z-10" />
              </div>
              <h2 className="text-3xl font-black uppercase tracking-tight mb-4 text-white">
                Kiểm Tra Màn Hình (LCD)
              </h2>
              <p className="text-gray-400 mb-10 leading-relaxed max-w-sm">
                Phát hiện điểm ảnh chết (Dead Pixel), hở sáng viền, méo hình và độ nhòe chữ nhanh chóng.
              </p>
              
              <button 
                onClick={toggleFullscreen}
                className="mt-auto w-full inline-flex items-center justify-center gap-3 bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-black transition-all shadow-[0_0_30px_rgba(239,68,68,0.3)] hover:-translate-y-1 uppercase tracking-wider"
              >
                <Expand size={20} /> Bắt Đầu Test LCD
              </button>
            </div>
          </div>

          {/* Card 2: Touch Test */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
            <div className="bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 text-center shadow-2xl relative overflow-hidden h-full flex flex-col items-center">
              <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 relative">
                <MousePointerClick size={40} className="text-blue-500 relative z-10" />
              </div>
              <h2 className="text-3xl font-black uppercase tracking-tight mb-4 text-white">
                Kiểm Tra Cảm Ứng (Touch)
              </h2>
              <p className="text-gray-400 mb-10 leading-relaxed max-w-sm">
                Tìm ra điểm mù, điểm liệt cảm ứng trên toàn bộ bề mặt màn hình bằng bài test vuốt lưới ô vuông.
              </p>
              
              <button 
                onClick={toggleTouchFullscreen}
                className="mt-auto w-full inline-flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-black transition-all shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:-translate-y-1 uppercase tracking-wider"
              >
                <Expand size={20} /> Bắt Đầu Test Cảm Ứng
              </button>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-12 bg-[#111] border border-white/5 rounded-2xl p-6 md:p-8 text-left w-full max-w-4xl mx-auto shadow-inner">
          <h3 className="text-white font-bold mb-6 uppercase tracking-wider text-base flex items-center gap-2">
            <CheckCircle2 size={20} className="text-primary" /> Hướng dẫn chung
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-400">
            <div className="flex flex-col gap-5">
              <div className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-primary/100 mt-1.5 shrink-0"></div><p><strong className="text-gray-200">Lau sạch màn hình</strong> trước khi test để tránh nhầm bụi với điểm chết.</p></div>
              <div className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-primary/100 mt-1.5 shrink-0"></div><p><strong className="text-gray-200">Trong bài test LCD:</strong> Click chuột hoặc dùng Phím mũi tên để chuyển màu.</p></div>
            </div>
            <div className="flex flex-col gap-5">
              <div className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></div><p><strong className="text-gray-200">Trong bài test Cảm Ứng:</strong> Vuốt sao cho toàn bộ các ô vuông chuyển sang màu cam.</p></div>
              <div className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-gray-500 mt-1.5 shrink-0"></div><p><strong className="text-gray-200">Phím ESC</strong> luôn là nút thần thánh để thoát chế độ test bất kỳ lúc nào.</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
