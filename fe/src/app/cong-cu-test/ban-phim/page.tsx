"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, RotateCcw, Activity, History, ShieldCheck, Zap, Volume2, VolumeX } from "lucide-react";

const MAIN_ROWS = [
  // Row 2
  [
    { c: 'Backquote', l: '~\n`' },
    { c: 'Digit1', l: '!\n1' }, { c: 'Digit2', l: '@\n2' }, { c: 'Digit3', l: '#\n3' }, { c: 'Digit4', l: '$\n4' },
    { c: 'Digit5', l: '%\n5' }, { c: 'Digit6', l: '^\n6' }, { c: 'Digit7', l: '&\n7' }, { c: 'Digit8', l: '*\n8' },
    { c: 'Digit9', l: '(\n9' }, { c: 'Digit0', l: ')\n0' }, { c: 'Minus', l: '_\n-' }, { c: 'Equal', l: '+\n=' },
    { c: 'Backspace', l: 'Backspace', w: 'w-[76px]', text: 'text-[10px]' }
  ],
  // Row 3
  [
    { c: 'Tab', l: 'Tab', w: 'w-[52px]', text: 'text-[10px]' },
    { c: 'KeyQ', l: 'Q' }, { c: 'KeyW', l: 'W' }, { c: 'KeyE', l: 'E' }, { c: 'KeyR', l: 'R' },
    { c: 'KeyT', l: 'T' }, { c: 'KeyY', l: 'Y' }, { c: 'KeyU', l: 'U' }, { c: 'KeyI', l: 'I' },
    { c: 'KeyO', l: 'O' }, { c: 'KeyP', l: 'P' }, { c: 'BracketLeft', l: '{\n[' }, { c: 'BracketRight', l: '}\n]' },
    { c: 'Backslash', l: '|\n\\', w: 'w-[64px]' }
  ],
  // Row 4
  [
    { c: 'CapsLock', l: 'Caps Lock', w: 'w-[74px]', text: 'text-[10px]' },
    { c: 'KeyA', l: 'A' }, { c: 'KeyS', l: 'S' }, { c: 'KeyD', l: 'D' }, { c: 'KeyF', l: 'F' },
    { c: 'KeyG', l: 'G' }, { c: 'KeyH', l: 'H' }, { c: 'KeyJ', l: 'J' }, { c: 'KeyK', l: 'K' },
    { c: 'KeyL', l: 'L' }, { c: 'Semicolon', l: ':\n;' }, { c: 'Quote', l: '"\n\'' },
    { c: 'Enter', l: 'Enter', w: 'w-[90px]', text: 'text-[10px]' }
  ],
  // Row 5
  [
    { c: 'ShiftLeft', l: 'Shift', w: 'w-[92px]', text: 'text-[10px]' },
    { c: 'KeyZ', l: 'Z' }, { c: 'KeyX', l: 'X' }, { c: 'KeyC', l: 'C' }, { c: 'KeyV', l: 'V' },
    { c: 'KeyB', l: 'B' }, { c: 'KeyN', l: 'N' }, { c: 'KeyM', l: 'M' }, { c: 'Comma', l: '<\n,' },
    { c: 'Period', l: '>\n.' }, { c: 'Slash', l: '?\n/' },
    { c: 'ShiftRight', l: 'Shift', w: 'w-[120px]', text: 'text-[10px]' }
  ],
  // Row 6
  [
    { c: 'ControlLeft', l: 'Ctrl', w: 'w-[48px]', text: 'text-[10px]' },
    { c: 'MetaLeft', l: 'Win', w: 'w-[48px]', text: 'text-[10px]' },
    { c: 'AltLeft', l: 'Alt', w: 'w-[48px]', text: 'text-[10px]' },
    { c: 'Space', l: 'Space', w: 'w-[316px]', text: 'text-[10px]' },
    { c: 'AltRight', l: 'Alt', w: 'w-[48px]', text: 'text-[10px]' },
    { c: 'ContextMenu', l: 'Menu', w: 'w-[48px]', text: 'text-[10px]' },
    { c: 'ControlRight', l: 'Ctrl', w: 'w-[48px]', text: 'text-[10px]' }
  ]
];

const NAV_KEYS = [
  // Row 1
  { c: 'PrintScreen', l: 'PrtSc', text: 'text-[9px]' }, { c: 'ScrollLock', l: 'ScrLk', text: 'text-[9px]' }, { c: 'Pause', l: 'Pause', text: 'text-[9px]' },
  // Row 2
  { c: 'Insert', l: 'Ins', text: 'text-[9px]' }, { c: 'Home', l: 'Home', text: 'text-[9px]' }, { c: 'PageUp', l: 'PgUp', text: 'text-[9px]' },
  // Row 3
  { c: 'Delete', l: 'Del', text: 'text-[9px]' }, { c: 'End', l: 'End', text: 'text-[9px]' }, { c: 'PageDown', l: 'PgDn', text: 'text-[9px]' },
  // Row 4
  { invisible: true }, { invisible: true }, { invisible: true },
  // Row 5
  { invisible: true }, { invisible: true }, { invisible: true },
  // Row 6
  { invisible: true }, { c: 'ArrowUp', l: '↑', text: 'text-[14px]' }, { invisible: true },
  // Row 7
  { c: 'ArrowLeft', l: '←', text: 'text-[14px]' }, { c: 'ArrowDown', l: '↓', text: 'text-[14px]' }, { c: 'ArrowRight', l: '→', text: 'text-[14px]' }
];

const NUMPAD_KEYS = [
  // Row 1
  { invisible: true }, { invisible: true }, { invisible: true }, { invisible: true },
  // Row 2
  { c: 'NumLock', l: 'Num\nLock', text: 'text-[9px]' }, { c: 'NumpadDivide', l: '/' }, { c: 'NumpadMultiply', l: '*' }, { c: 'NumpadSubtract', l: '-' },
  // Row 3
  { c: 'Numpad7', l: '7' }, { c: 'Numpad8', l: '8' }, { c: 'Numpad9', l: '9' }, { c: 'NumpadAdd', l: '+', rowSpan: 2 },
  // Row 4
  { c: 'Numpad4', l: '4' }, { c: 'Numpad5', l: '5' }, { c: 'Numpad6', l: '6' },
  // Row 5
  { c: 'Numpad1', l: '1' }, { c: 'Numpad2', l: '2' }, { c: 'Numpad3', l: '3' }, { c: 'NumpadEnter', l: 'Enter', text: 'text-[9px]', rowSpan: 2 },
  // Row 6
  { c: 'Numpad0', l: '0', colSpan: 2 }, { c: 'NumpadDecimal', l: '.' }
];

export default function KeyboardTestPage() {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  const [history, setHistory] = useState<string[]>([]);
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const [maxSimultaneous, setMaxSimultaneous] = useState(0);
  const [chatterCount, setChatterCount] = useState(0);
  const lastKeyTimeRef = useRef<Record<string, number>>({});
  const timestampsRef = useRef<number[]>([]);
  const [kpm, setKpm] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const [mouseActive, setMouseActive] = useState<Set<number>>(new Set());
  const [mouseWorked, setMouseWorked] = useState<Set<number>>(new Set());

  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      timestampsRef.current = timestampsRef.current.filter(t => now - t < 5000);
      setKpm(timestampsRef.current.length * 12);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const padding = 48; // p-6 * 2
        const keyboardWidth = 1040 + padding; // approx width of the full keyboard
        if (containerWidth < keyboardWidth) {
          setScale(containerWidth / keyboardWidth);
        } else {
          setScale(1);
        }
      }
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  const playClick = () => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, audioCtxRef.current.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, audioCtxRef.current.currentTime + 0.05);
      gain.gain.setValueAtTime(0.1, audioCtxRef.current.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(audioCtxRef.current.destination);
      osc.start();
      osc.stop(audioCtxRef.current.currentTime + 0.05);
    } catch (e) { }
  };

  const getLabelFromCode = (code: string) => {
    if (code.startsWith('F')) return code;
    if (code === 'Escape') return 'Esc';
    for (const row of MAIN_ROWS) {
      const k = row.find((x: any) => x.c === code);
      if (k && (k as any).l) return (k as any).l.replace('\n', ' ') || code;
    }
    const navK = NAV_KEYS.find(x => x.c === code);
    if (navK && navK.l) return navK.l.replace('\n', ' ');
    const numK = NUMPAD_KEYS.find(x => x.c === code);
    if (numK && numK.l) return numK.l.replace('\n', ' ');
    return code;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      const code = e.code;
      const now = Date.now();

      playClick();
      timestampsRef.current.push(now);

      if (lastKeyTimeRef.current[code] && (now - lastKeyTimeRef.current[code] < 30) && !e.repeat) {
        setChatterCount(prev => prev + 1);
      }
      lastKeyTimeRef.current[code] = now;

      if (!e.repeat) {
        setHistory(prev => {
          const newH = [...prev, getLabelFromCode(code)];
          return newH.slice(-30);
        });
      }

      setActiveKeys(prev => {
        const next = new Set(prev).add(code);
        if (next.size > maxSimultaneous) setMaxSimultaneous(next.size);
        return next;
      });
      setPressedKeys(prev => new Set(prev).add(code));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      e.preventDefault();
      const code = e.code;
      setActiveKeys(prev => {
        const next = new Set(prev);
        next.delete(code);
        return next;
      });
    };

    const handleGlobalMouseDown = (e: MouseEvent) => {
      playClick();
      const btn = e.button;
      setMouseActive(prev => new Set(prev).add(btn));
      setMouseWorked(prev => new Set(prev).add(btn));
      
      setHistory(prev => {
        const btnName = btn === 0 ? 'L-Click' : btn === 1 ? 'M-Click' : 'R-Click';
        const newH = [...prev, btnName];
        return newH.slice(-30);
      });
    };

    const handleGlobalMouseUp = (e: MouseEvent) => {
      const btn = e.button;
      setMouseActive(prev => {
        const next = new Set(prev);
        next.delete(btn);
        return next;
      });
    };

    window.addEventListener("keydown", handleKeyDown, { passive: false });
    window.addEventListener("keyup", handleKeyUp, { passive: false });
    window.addEventListener("mousedown", handleGlobalMouseDown);
    window.addEventListener("mouseup", handleGlobalMouseUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("mousedown", handleGlobalMouseDown);
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [maxSimultaneous, soundEnabled]);

  const handleReset = () => {
    setPressedKeys(new Set());
    setActiveKeys(new Set());
    setHistory([]);
    setMaxSimultaneous(0);
    setChatterCount(0);
    setMouseActive(new Set());
    setMouseWorked(new Set());
    lastKeyTimeRef.current = {};
    timestampsRef.current = [];
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const renderKey = (key: any, blockType: 'main' | 'nav' | 'num' = 'main') => {
    if (key.invisible) {
      return <div key={Math.random()} className="w-[40px] h-[40px]"></div>;
    }

    let isPressed = pressedKeys.has(key.c);
    let isActive = activeKeys.has(key.c);

    // w-10 = 40px, gap = 8px. colSpan 2 = 40*2 + 8 = 88px
    const wClass = key.w ? key.w : (key.colSpan ? `w-[88px]` : "w-[40px]");
    const hClass = key.h ? key.h : (key.rowSpan ? `h-[88px]` : "h-[40px]");

    const baseStyle = "flex items-center justify-center font-sans select-none transition-all duration-[50ms] text-center leading-[1.2] rounded-[8px] relative";
    const textStyle = key.text ? key.text : "text-[11px] font-bold";

    const normalClass = "bg-[#181a1d] text-[#6b7280] border-b-2 border-[#0e1014] shadow-sm";
    const workedClass = "bg-[#f8fafc] text-[#0f172a] shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_1px_2px_rgba(0,0,0,0.2)] border-b-[1px] translate-y-[1px]";
    const activeClass = "bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)] border-b-[0px] translate-y-[2px] font-black";

    return (
      <div
        key={key.c}
        style={key.style}
        className={`
          ${baseStyle} ${wClass} ${hClass} ${textStyle}
          ${isActive ? activeClass : isPressed ? workedClass : normalClass}
        `}
      >
        <span className="pointer-events-none whitespace-pre-wrap">{key.l}</span>
      </div>
    );
  };

  const totalKeys = 104;
  const progressPercent = Math.min(100, Math.round((pressedKeys.size / totalKeys) * 100)) || 0;

  return (
    <div className="min-h-screen bg-[#06080d] text-white font-sans flex flex-col p-4 md:p-6 relative overflow-hidden" onContextMenu={handleContextMenu}>

      {/* Top Navigation */}
      <div className="w-full max-w-[1600px] mx-auto flex items-center justify-between mb-6 relative z-10">
        <Link href="/" className="flex items-center text-gray-500 hover:text-white transition-colors text-xs font-black uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/10 hover:border-white/20 hover:bg-white/10 backdrop-blur-md">
          <ArrowLeft size={16} className="mr-2" /> Quay lại
        </Link>

        <div className="flex gap-4">
          <button onClick={() => setSoundEnabled(!soundEnabled)} className={`flex items-center text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full border transition-all ${soundEnabled ? 'bg-red-500/10 text-red-500 border-red-500/30 hover:bg-red-500/20' : 'bg-white/5 text-gray-500 border-white/10 hover:bg-white/10'}`}>
            {soundEnabled ? <Volume2 size={16} className="mr-2" /> : <VolumeX size={16} className="mr-2" />} {soundEnabled ? 'SFX: Bật' : 'SFX: Tắt'}
          </button>
          <button onClick={handleReset} className="flex items-center text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full border bg-white/5 text-white border-white/10 hover:bg-white/10 hover:border-white/30 transition-all">
            <RotateCcw size={16} className="mr-2" /> Làm mới
          </button>
        </div>
      </div>

      <div className="w-full max-w-[1600px] mx-auto flex flex-col xl:flex-row gap-6 relative z-10">

        {/* LEFT COLUMN: Main Keyboard Area */}
        <div className="flex-[3] bg-[#0c0f16] border border-[#1e2430] rounded-[24px] p-6 pb-8 flex flex-col shadow-2xl relative overflow-hidden backdrop-blur-xl">

          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400 uppercase tracking-widest mb-2 flex items-center gap-3">
                <ShieldCheck size={28} className="text-red-500" /> TEST BÀN PHÍM
              </h1>
              <p className="text-[#64748b] font-medium text-xs flex items-center gap-2">
                Chuẩn xác tuyệt đối <span className="w-1 h-1 rounded-full bg-red-500"></span> Chống giật lag
              </p>
            </div>
            <div className="text-left sm:text-right flex flex-col items-start sm:items-end">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-white drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">{progressPercent}</span>
                <span className="text-lg font-bold text-red-500">%</span>
              </div>
              <div className="w-24 h-1.5 bg-[#1e2430] rounded-full mt-2 overflow-hidden relative">
                <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-600 to-orange-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" style={{ width: `${progressPercent}%` }}></div>
              </div>
            </div>
          </div>

          {/* Keyboard Container */}
          <div ref={containerRef} className="w-full pb-6 flex-1 flex flex-col items-center justify-start relative overflow-hidden">
            <div
              style={{
                transform: `scale(${scale})`,
                transformOrigin: 'top center',
                marginBottom: scale < 1 ? `-${480 * (1 - scale)}px` : '0px'
              }}
              className="flex gap-[20px] w-max bg-[#0a0c10] p-6 rounded-[20px] border border-[#1e2430] shadow-[inset_0_0_40px_rgba(0,0,0,0.8)]"
            >
              {/* Left Block (Main) */}
              <div className="flex flex-col gap-[8px] relative">

                {/* Custom F-Row alignment with justify-between */}
                <div className="flex justify-between w-[700px]">
                  {renderKey({ c: 'Escape', l: 'Esc' }, 'main')}
                  <div className="flex gap-[8px]">
                    {renderKey({ c: 'F1', l: 'F1' }, 'main')}
                    {renderKey({ c: 'F2', l: 'F2' }, 'main')}
                    {renderKey({ c: 'F3', l: 'F3' }, 'main')}
                    {renderKey({ c: 'F4', l: 'F4' }, 'main')}
                  </div>
                  <div className="flex gap-[8px]">
                    {renderKey({ c: 'F5', l: 'F5' }, 'main')}
                    {renderKey({ c: 'F6', l: 'F6' }, 'main')}
                    {renderKey({ c: 'F7', l: 'F7' }, 'main')}
                    {renderKey({ c: 'F8', l: 'F8' }, 'main')}
                  </div>
                  <div className="flex gap-[8px]">
                    {renderKey({ c: 'F9', l: 'F9' }, 'main')}
                    {renderKey({ c: 'F10', l: 'F10' }, 'main')}
                    {renderKey({ c: 'F11', l: 'F11' }, 'main')}
                    {renderKey({ c: 'F12', l: 'F12' }, 'main')}
                  </div>
                </div>

                {MAIN_ROWS.map((row, rIdx) => (
                  <div key={rIdx} className="flex gap-[8px]">
                    {row.map((item: any) => renderKey(item, 'main'))}
                  </div>
                ))}

                {/* Touchpad perfectly centered under Spacebar. 196px aligns 260px wide trackpad to 316px spacebar. */}
                <div className="mt-4 flex" style={{ paddingLeft: '196px' }}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-[260px] h-[100px] rounded-t-[12px] transition-all duration-[50ms] flex items-center justify-center cursor-crosshair border border-[#111]
                          ${mouseActive.has(1) ? "bg-red-500 shadow-[inset_0_1px_2px_rgba(255,255,255,0.5),0_0_20px_rgba(239,68,68,0.6)] border-red-600 translate-y-[2px]" : mouseWorked.has(1) ? "bg-[#f8fafc] border-[#cbd5e1] text-black" : "bg-[#181a1d] border-b-[3px] border-b-[#0e1014] hover:bg-[#1f2227]"}`}
                    >
                      <span className={`text-[11px] font-black uppercase tracking-[0.5em] select-none ${mouseActive.has(1) ? "text-white" : mouseWorked.has(1) ? "text-[#0f172a]" : "text-[#64748b]"}`}>Touchpad</span>
                    </div>

                    <div className="flex gap-[8px] w-[260px] mt-[8px]">
                      <div
                        className={`flex-[2] h-10 rounded-b-[12px] transition-all duration-[50ms] flex items-center justify-center cursor-crosshair border border-[#111]
                            ${mouseActive.has(0) ? "bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.6)] border-red-600 text-white translate-y-[2px]" : mouseWorked.has(0) ? "bg-[#f8fafc] border-[#cbd5e1] text-[#0f172a]" : "bg-[#181a1d] border-b-[3px] border-b-[#0e1014] text-[#64748b] hover:bg-[#1f2227]"}`}
                      >
                        <span className="text-[10px] font-bold uppercase tracking-widest select-none">Trái</span>
                      </div>

                      <div
                        className={`flex-[1] h-10 rounded-b-[12px] transition-all duration-[50ms] flex items-center justify-center cursor-crosshair border border-[#111]
                            ${mouseActive.has(1) ? "bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.6)] border-red-600 text-white translate-y-[2px]" : mouseWorked.has(1) ? "bg-[#f8fafc] border-[#cbd5e1] text-[#0f172a]" : "bg-[#181a1d] border-b-[3px] border-b-[#0e1014] text-[#64748b] hover:bg-[#1f2227]"}`}
                      >
                        <span className="text-[10px] font-bold uppercase select-none">Giữa</span>
                      </div>

                      <div
                        className={`flex-[2] h-10 rounded-b-[12px] transition-all duration-[50ms] flex items-center justify-center cursor-crosshair border border-[#111]
                            ${mouseActive.has(2) ? "bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.6)] border-red-600 text-white translate-y-[2px]" : mouseWorked.has(2) ? "bg-[#f8fafc] border-[#cbd5e1] text-[#0f172a]" : "bg-[#181a1d] border-b-[3px] border-b-[#0e1014] text-[#64748b] hover:bg-[#1f2227]"}`}
                      >
                        <span className="text-[10px] font-bold uppercase tracking-widest select-none">Phải</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle Block (Nav) */}
              <div className="grid grid-cols-3 gap-[8px] auto-rows-[40px]">
                {NAV_KEYS.map((item) => renderKey(item, 'nav'))}
              </div>

              {/* Right Block (Numpad) */}
              <div className="grid grid-cols-4 gap-[8px] auto-rows-[40px]">
                {NUMPAD_KEYS.map((item) => {
                  if (item.invisible) return <div key={Math.random()} className="w-[40px] h-[40px]"></div>;
                  return (
                    <div
                      key={item.c}
                      style={{
                        gridColumn: item.colSpan ? `span ${item.colSpan}` : 'auto',
                        gridRow: item.rowSpan ? `span ${item.rowSpan}` : 'auto'
                      }}
                    >
                      {renderKey(item, 'num')}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Dashboards */}
        <div className="w-full xl:w-[340px] flex-none flex flex-col gap-6">

          {/* LIVE METRICS */}
          <div className="bg-[#0c0f16] border border-[#1e2430] rounded-[24px] p-6 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-2 text-white font-black uppercase tracking-wider mb-6 text-sm">
              <Zap size={18} className="text-red-500" /> Thống Kê Realtime
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col justify-center items-center">
                <p className="text-[#64748b] text-[10px] font-bold uppercase tracking-widest mb-1">Tốc Độ Gõ</p>
                <p className="text-2xl font-black text-white">{kpm} <span className="text-[10px] text-gray-500">KPM</span></p>
              </div>
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col justify-center items-center">
                <p className="text-[#64748b] text-[10px] font-bold uppercase tracking-widest mb-1">Đã Nhấn</p>
                <p className="text-2xl font-black text-white">{pressedKeys.size} <span className="text-[10px] text-gray-500">/ 104</span></p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-500/10 to-transparent border border-red-500/20 rounded-2xl p-4 flex justify-between items-center mb-3">
              <div>
                <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mb-1">Max Ghosting</p>
                <p className="text-2xl font-black text-white">{maxSimultaneous} <span className="text-[10px] text-red-500/70 font-bold">phím</span></p>
              </div>
              <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                <ShieldCheck size={16} className="text-red-500" />
              </div>
            </div>

            <div className={`border rounded-2xl p-4 flex justify-between items-center transition-colors ${chatterCount > 0 ? "bg-red-500/10 border-red-500/20" : "bg-white/[0.02] border-white/5"}`}>
              <div>
                <p className={`${chatterCount > 0 ? "text-red-400" : "text-[#64748b]"} text-[10px] font-bold uppercase tracking-widest mb-1`}>Cảnh báo Đúp</p>
                <p className={`text-2xl font-black ${chatterCount > 0 ? "text-red-500" : "text-white"}`}>{chatterCount} <span className="text-[10px] opacity-50 font-bold">lỗi</span></p>
              </div>
            </div>
          </div>

          {/* HISTORY LOG */}
          <div className="bg-[#0c0f16] border border-[#1e2430] rounded-[24px] p-6 shadow-2xl flex-1 flex flex-col min-h-[250px]">
            <div className="flex items-center gap-2 text-white font-black uppercase tracking-wider mb-4 text-sm">
              <History size={18} className="text-red-500" /> Log Nhấn Phím
            </div>

            <div className="flex-1 bg-[#050608] border border-white/5 rounded-xl p-3 flex flex-wrap content-start gap-2 overflow-y-auto custom-scrollbar relative">
              {history.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-[#334155] text-xs font-medium italic">
                  Đang chờ tín hiệu...
                </div>
              )}
              {history.slice().reverse().map((h, i) => (
                <div key={i} className={`px-2 py-1 rounded text-[10px] font-bold transition-all duration-300 ${i === 0 ? "bg-red-500/20 border border-red-500/50 text-red-400 scale-105" : "bg-[#1e293b] border border-[#334155] text-[#94a3b8]"}`}>
                  {h}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 8px;
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #ef4444;
        }
      `}</style>
    </div>
  );
}
