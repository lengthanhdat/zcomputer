"use client";

import Image from "next/image";
import Link from "next/link";
import { Zap, Timer, ShoppingCart, ArrowRight, Eye, Maximize, Cpu, Database, MonitorPlay, HardDrive, Monitor, Battery, Weight, MemoryStick, Gpu, Layers, Keyboard, Mouse, Link as LinkIcon } from "lucide-react";
import { useState, useEffect } from "react";

export default function HotSaleSection({ 
  products 
}: { 
  products: any[]
}) {
  const hotProducts = products.filter(p => p.isHotSale);

  // Group hot products by category
  const getGroup = (p: any) => {
    const name = (typeof p.category_id === 'object' && p.category_id ? p.category_id.name : "").toLowerCase();
    if (name.includes('laptop')) return "LAPTOP";
    if (name.includes('pc') || name.includes('máy tính')) return "PC GAMING";
    if (name.includes('màn') || name.includes('monitor')) return "MÀN HÌNH";
    if (name.includes('chuột') || name.includes('phím') || name.includes('tai nghe')) return "GEAR & PHỤ KIỆN";
    return "LINH KIỆN";
  };

  const grouped: Record<string, any[]> = {};
  hotProducts.forEach(p => {
    const g = getGroup(p);
    if (!grouped[g]) grouped[g] = [];
    grouped[g].push(p);
  });

  const tabs = Object.keys(grouped);
  const [activeTab, setActiveTab] = useState(tabs[0] || "");

  useEffect(() => {
    if (!activeTab && tabs.length > 0) {
      setActiveTab(tabs[0]);
    }
  }, [activeTab, tabs]);

  const activeProducts = grouped[activeTab] || [];

  const displayProducts = activeProducts;

  // Countdown timer logic from Backend Setting
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    fetch('/api/settings/flash_sale_end_time')
      .then(res => res.json())
      .then(data => {
        if (data && data.value) {
          setEndTime(new Date(data.value));
        } else {
          // fallback to 4 days
          const dt = new Date();
          dt.setDate(dt.getDate() + 4);
          setEndTime(dt);
        }
      })
      .catch(() => {
        const dt = new Date();
        dt.setDate(dt.getDate() + 4);
        setEndTime(dt);
      });
  }, []);

  useEffect(() => {
    const slider = document.getElementById('hotsale-slider');
    if (!slider) return;

    let isHovered = false;
    let isDown = false;
    let startX: number;
    let scrollLeft: number;
    let dragged = false;

    const setHover = () => { if (!isDown) isHovered = true; };
    const removeHover = () => { isHovered = false; isDown = false; slider.classList.remove('cursor-grabbing'); };
    
    const mouseDown = (e: MouseEvent) => {
      isDown = true;
      dragged = false;
      slider.classList.add('cursor-grabbing');
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    };
    
    const mouseUp = () => {
      isDown = false;
      slider.classList.remove('cursor-grabbing');
    };
    
    const mouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 1.5;
      if (Math.abs(walk) > 5) dragged = true;
      slider.scrollLeft = scrollLeft - walk;
    };

    // Ngăn chặn click nếu đang kéo (drag)
    const preventClick = (e: MouseEvent) => {
      if (dragged) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    
    slider.addEventListener('mouseenter', setHover);
    slider.addEventListener('mouseleave', removeHover);
    slider.addEventListener('mousedown', mouseDown);
    slider.addEventListener('mouseup', mouseUp);
    slider.addEventListener('mousemove', mouseMove);
    slider.addEventListener('click', preventClick, true);

    return () => {
      slider.removeEventListener('mouseenter', setHover);
      slider.removeEventListener('mouseleave', removeHover);
      slider.removeEventListener('mousedown', mouseDown);
      slider.removeEventListener('mouseup', mouseUp);
      slider.removeEventListener('mousemove', mouseMove);
      slider.removeEventListener('click', preventClick, true);
    };
  }, [displayProducts]);

  useEffect(() => {
    if (!endTime) return;
    
    // Initial calculation to avoid 1s delay
    const calculateTime = () => {
      const now = new Date();
      const diff = endTime.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
        return false;
      }
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / 1000 / 60) % 60);
      const s = Math.floor((diff / 1000) % 60);
      setTimeLeft({ d, h, m, s });
      return true;
    };
    
    calculateTime();
    const timer = setInterval(() => {
      const isRunning = calculateTime();
      if (!isRunning) clearInterval(timer);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [endTime]);

  if (hotProducts.length === 0) return null;
  if (tabs.length === 0) return null;

  return (
    <section className="container mx-auto px-4 mb-16">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
        .neon-glow {
          box-shadow: 0 0 15px rgba(239, 68, 68, 0.6), 0 0 30px rgba(239, 68, 68, 0.4);
        }
        .neon-border {
          box-shadow: inset 0 0 10px rgba(239, 68, 68, 0.3), 0 0 10px rgba(239, 68, 68, 0.3);
        }
      `}</style>
      
      <div className="relative rounded-2xl shadow-[0_0_40px_rgba(239,68,68,0.2)] p-[3px] overflow-hidden group/led">
        {/* Animated LED Border Background */}
        <div className="absolute inset-0 bg-gray-800 z-0"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[4000px] h-[4000px] bg-[conic-gradient(from_0deg,transparent_0_300deg,#ff0000_360deg)] animate-[spin_6s_linear_infinite] z-0 opacity-100"></div>

        {/* Inner Content Container - LIQUID GLASS */}
        <div className="bg-[#0b0f19]/70 backdrop-blur-3xl rounded-[13px] overflow-hidden relative z-10 h-full w-full border border-white/5">
          {/* Background ambient glow inside the glass */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-50%] left-[-10%] w-[60%] h-[150%] bg-red-600/20 blur-[120px] rounded-full mix-blend-screen"></div>
            <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[100%] bg-blue-600/20 blur-[120px] rounded-full mix-blend-screen"></div>
          </div>

        {/* Tabs - Glass sleek design */}
        <div className="flex flex-wrap bg-white/5 backdrop-blur-md border-b border-white/10 relative z-10">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 px-2 text-center font-black uppercase transition-all duration-300 text-sm md:text-base relative group ${
                activeTab === tab 
                  ? 'text-white bg-white/10 shadow-[inset_0_-2px_15px_rgba(255,255,255,0.05)]' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-orange-500 neon-glow"></div>
              )}
            </button>
          ))}
        </div>

        {/* Info Strip */}
        <div className="bg-red-500/10 backdrop-blur-md text-red-100 text-xs md:text-sm font-medium flex items-center justify-center py-2 border-b border-white/10 relative z-10">
          <span className="text-red-400 mr-2 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">⚡</span> Giới hạn 01 sản phẩm/ 1 khách hàng trong chương trình ưu đãi
        </div>

        {/* Content Body */}
        <div className="flex flex-col xl:flex-row relative z-10">
          
          {/* Left Sidebar - Cyberpunk / Gaming Vibe */}
          <div className="xl:w-[280px] shrink-0 p-8 flex flex-col items-center justify-center border-b xl:border-b-0 xl:border-r border-white/10 relative overflow-hidden bg-white/5 backdrop-blur-xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent"></div>
            
            <div className="flex items-center gap-0 mb-4">
              <Zap size={56} className="text-yellow-400 fill-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)] animate-pulse -ml-4" />
              <div className="flex flex-col">
                <h2 className="text-[36px] font-black uppercase italic tracking-tighter text-white leading-none drop-shadow-md">
                  FLASH
                </h2>
                <h2 className="text-[36px] font-black uppercase italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400 leading-none drop-shadow-md">
                  SALE
                </h2>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3 rounded-xl border border-white/20 mb-8 w-full shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
              <Timer size={24} className="text-red-500 animate-pulse shrink-0 drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]" />
              <div className="flex flex-col">
                <span className="text-gray-300 text-[11px] font-bold uppercase tracking-widest leading-none mb-1">Kết thúc sau</span>
                <span className="text-white text-[18px] font-black leading-none">{timeLeft.d} <span className="text-red-400 text-[14px]">NGÀY</span></span>
              </div>
            </div>
            
            {/* Timer boxes - Liquid Glass Style */}
            <div className="flex gap-3 text-center mb-10">
              <div className="flex flex-col items-center">
                <div className="bg-white/10 backdrop-blur-md text-white text-3xl font-black rounded-lg w-14 h-16 flex items-center justify-center border border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.1)] font-mono relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/20 to-transparent opacity-50"></div>
                  <span className="relative z-10">{timeLeft.h.toString().padStart(2, '0')}</span>
                </div>
                <span className="text-[10px] text-gray-400 font-bold mt-2 uppercase tracking-wider drop-shadow-sm">Giờ</span>
              </div>
              <div className="text-gray-400 font-black text-3xl mt-3 animate-pulse">:</div>
              <div className="flex flex-col items-center">
                <div className="bg-white/10 backdrop-blur-md text-white text-3xl font-black rounded-lg w-14 h-16 flex items-center justify-center border border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.1)] font-mono relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/20 to-transparent opacity-50"></div>
                  <span className="relative z-10">{timeLeft.m.toString().padStart(2, '0')}</span>
                </div>
                <span className="text-[10px] text-gray-400 font-bold mt-2 uppercase tracking-wider drop-shadow-sm">Phút</span>
              </div>
              <div className="text-gray-400 font-black text-3xl mt-3 animate-pulse">:</div>
              <div className="flex flex-col items-center">
                <div className="bg-red-500/10 backdrop-blur-md text-red-500 text-3xl font-black rounded-lg w-14 h-16 flex items-center justify-center border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)] font-mono relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-red-500/20 to-transparent opacity-50"></div>
                  <span className="relative z-10 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]">{timeLeft.s.toString().padStart(2, '0')}</span>
                </div>
                <span className="text-[10px] text-red-400 font-bold mt-2 uppercase tracking-wider drop-shadow-sm">Giây</span>
              </div>
            </div>

          </div>

          {/* Right Slider - Glass Cards */}
          <div className="relative z-10 overflow-hidden w-full flex-1 py-6 xl:py-10 flex items-center">
            {activeProducts.length > 0 ? (
              <div id="hotsale-slider" className="flex w-full overflow-x-auto px-6 pb-4 scrollbar-hide relative z-10">
                <div id="hotsale-slider-inner" className="flex gap-5 shrink-0">
                  {displayProducts.map((product, idx) => {
                    const isHotSaleActive = !!(product.isHotSale && product.flashSalePrice && product.flashSalePrice < product.price);
                    const originalPrice = (product.discountPrice && product.discountPrice > product.price) ? product.discountPrice : product.price;
                    const currentPrice = isHotSaleActive ? product.flashSalePrice! : product.price;
                    const saveAmount = originalPrice - currentPrice;
                    const discountPercent = originalPrice > currentPrice ? Math.round((saveAmount / originalPrice) * 100) : 0;
                    const isOutOfStock = product.status === 'out_of_stock' || product.stock === 0;

                    return (
                    <div
                      key={`${product._id}-${idx}`}
                      className={`flex-none w-[280px] bg-white rounded-2xl border border-gray-100 overflow-hidden group hover:shadow-[0_20px_40px_rgb(220,38,38,0.12)] hover:border-red-200 hover:-translate-y-2 transition-all duration-500 flex flex-col relative ${isOutOfStock ? 'opacity-80' : ''}`}
                    >
                      <Link href={`/${product.slug}`} className="absolute inset-0 z-20"></Link>
                      
                      <div className="relative aspect-[4/3] p-6 flex items-center justify-center bg-gradient-to-b from-gray-50 to-white overflow-hidden">
                        
                        {/* ZCOMPUTER Overlay Frame */}
                        <div className="absolute inset-0 pointer-events-none z-[15] p-2 opacity-80">
                          <div className="w-full h-full border border-primary/10 rounded-xl relative">
                            <div className="absolute -top-[1px] -left-[1px] w-5 h-5 border-t-2 border-l-2 border-primary/60 rounded-tl-xl"></div>
                            <div className="absolute -top-[1px] -right-[1px] w-5 h-5 border-t-2 border-r-2 border-primary/60 rounded-tr-xl"></div>
                            <div className="absolute -bottom-[1px] -left-[1px] w-5 h-5 border-b-2 border-l-2 border-primary/60 rounded-bl-xl"></div>
                            <div className="absolute -bottom-[1px] -right-[1px] w-5 h-5 border-b-2 border-r-2 border-primary/60 rounded-br-xl"></div>
                            
                            <div className="absolute bottom-2 right-2 flex items-center gap-1 opacity-50 mix-blend-multiply">
                              <Image src="/logo.webp" alt="ZCOMPUTER" width={20} height={20} className="w-4 h-4 object-contain" unoptimized />
                              <div className="flex items-baseline select-none tracking-tighter">
                                <span className="text-red-600 font-black text-[11px] drop-shadow-sm">Z</span>
                                <span className="text-slate-800 font-black text-[10px] uppercase drop-shadow-sm">COMPUTER</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {isOutOfStock && (
                          <div className="absolute inset-0 bg-white/60 z-30 flex items-center justify-center backdrop-blur-[1px]">
                            <div className="bg-gray-800/90 backdrop-blur-sm text-white font-black px-6 py-2 rounded-lg -rotate-12 shadow-2xl border border-gray-600/50 tracking-widest text-lg">
                              HẾT HÀNG
                            </div>
                          </div>
                        )}

                        {product.images?.[0] && (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                            className="object-contain p-8 mix-blend-multiply group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500 relative z-10"
                            unoptimized
                          />
                        )}
                        
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-red-500/5 blur-[40px] rounded-full group-hover:bg-red-500/10 transition-colors duration-500"></div>
                        
                        {/* Badges */}
                        <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5">
                          {saveAmount > 0 && (
                            <div className="shadow-lg rounded-md overflow-hidden transform -rotate-3 origin-top-left group-hover:rotate-0 transition-transform duration-300">
                              <div className="bg-gradient-to-r from-red-600 to-red-500 text-white text-[10px] font-black px-2 py-1 text-center uppercase tracking-widest">
                                FLASH SALE -{discountPercent}%
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="p-5 flex flex-col flex-1 bg-white relative z-10">
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-[10px] font-black text-gray-500 tracking-widest uppercase bg-gray-100 px-2.5 py-1 rounded-md">{product.brand || "KHÁC"}</div>
                          <div className="flex items-center gap-2">
                            {product.condition && (
                              <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">{product.condition}</div>
                            )}
                          </div>
                        </div>

                        <Link href={`/${product.slug}`} className="hover:text-red-600 transition-colors mb-3 z-30 relative">
                          <h3 className="text-gray-800 text-[14px] font-bold leading-snug line-clamp-2">{product.name}</h3>
                        </Link>

                        <div className="grid grid-cols-2 gap-1.5 mb-3">
                          {product.specs && typeof product.specs === 'object' && (
                            (() => {
                              const entries = Object.entries(product.specs).filter(([_, v]) => v && String(v).trim() !== '').slice(0, 5);
                              return entries.map(([key, value], index) => {
                                const lowerKey = key.toLowerCase();
                                let Icon = Maximize;
                                if (lowerKey.includes('cpu') || lowerKey.includes('chip') || lowerKey.includes('vi xử lý')) Icon = Cpu;
                                else if (lowerKey.includes('vga') || lowerKey.includes('card') || lowerKey.includes('đồ họa')) Icon = Gpu;
                                else if (lowerKey.includes('ram')) Icon = MemoryStick;
                                else if (lowerKey.includes('ổ') || lowerKey.includes('ssd') || lowerKey.includes('hdd') || lowerKey.includes('storage')) Icon = HardDrive;
                                else if (lowerKey.includes('màn') || lowerKey.includes('screen') || lowerKey.includes('display') || lowerKey.includes('độ phân giải') || lowerKey.includes('resolution')) Icon = Monitor;
                                else if (lowerKey.includes('pin') || lowerKey.includes('battery')) Icon = Battery;
                                else if (lowerKey.includes('tần số') || lowerKey.includes('hz') || lowerKey.includes('refreshrate')) Icon = Zap;
                                else if (lowerKey.includes('tấm nền') || lowerKey.includes('panel')) Icon = Layers;
                                else if (lowerKey.includes('kích thước') || lowerKey.includes('size')) Icon = Maximize;
                                else if (lowerKey.includes('phím') || lowerKey.includes('switch') || lowerKey.includes('keycap')) Icon = Keyboard;
                                else if (lowerKey.includes('chuột') || lowerKey.includes('sensor') || lowerKey.includes('dpi')) Icon = Mouse;
                                else if (lowerKey.includes('kết nối') || lowerKey.includes('connection')) Icon = LinkIcon;
                                else if (lowerKey.includes('trọng lượng') || lowerKey.includes('weight')) Icon = Weight;
                                
                                const isOddTotalAndLast = entries.length % 2 !== 0 && index === entries.length - 1;
                                return (
                                  <div key={index} className={`flex items-center gap-2 text-xs text-gray-500 bg-gray-50/50 p-1.5 rounded-lg border border-gray-100 truncate ${isOddTotalAndLast ? 'col-span-2' : ''}`}>
                                    <Icon size={14} className="text-gray-400 shrink-0" />
                                    <span className="truncate font-medium" title={`${value}`}>{value as React.ReactNode}</span>
                                  </div>
                                );
                              });
                            })()
                          )}
                        </div>
                        
                        <div className="flex flex-col mb-4">
                          {isOutOfStock ? (
                             <div className="h-[46px] flex items-end">
                               <span className="text-[15px] font-bold text-gray-400">Liên hệ</span>
                             </div>
                          ) : saveAmount > 0 ? (
                            <>
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-gray-400 text-[12px] line-through">{originalPrice.toLocaleString('vi-VN')}₫</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-[20px] font-black text-red-600">{currentPrice.toLocaleString('vi-VN')}₫</span>
                              </div>
                            </>
                          ) : (
                            <>
                               <div className="h-[18px] mb-0.5"></div>
                               <span className="text-[20px] font-black text-red-600">{currentPrice.toLocaleString('vi-VN')}₫</span>
                             </>
                          )}
                        </div>
                        
                        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                          <div className="text-gray-500 text-[12px] flex items-center gap-1.5">
                            <Eye size={14} className="text-gray-400" />
                            {(product.views || 0).toLocaleString('vi-VN')}
                          </div>
                          <Link 
                            href={`/${product.slug}`}
                            className="relative z-30 flex items-center justify-center gap-1.5 px-4 py-1.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg font-bold text-[12px] transition-all duration-300 group/btn"
                          >
                            <span>Mua ngay</span>
                            <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
                </div>

              </div>
            ) : (
              <div className="w-full text-center text-gray-500 py-10">
                Chưa có sản phẩm flash sale trong danh mục này.
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
