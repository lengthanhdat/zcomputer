"use client";

import Image from "next/image";
import Link from "next/link";
import { Zap, Timer, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";

export default function HotSaleSection({ 
  products 
}: { 
  products: any[]
}) {
  const hotProducts = products.filter(p => p.isHotSale);
  if (hotProducts.length === 0) return null;

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

  const activeProducts = grouped[activeTab] || [];

  let displayProducts = [...activeProducts];
  if (displayProducts.length > 0) {
    while (displayProducts.length < 8) {
      displayProducts = [...displayProducts, ...activeProducts];
    }
  }
  const marqueeProducts = [...displayProducts, ...displayProducts];

  // Countdown timer logic from Backend Setting
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/settings/flash_sale_end_time')
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

  if (tabs.length === 0) return null;

  return (
    <section className="container mx-auto px-4 mb-16">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 8px)); }
        }
        .animate-marquee {
          animation: marquee 60s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
        .neon-glow {
          box-shadow: 0 0 15px rgba(239, 68, 68, 0.6), 0 0 30px rgba(239, 68, 68, 0.4);
        }
        .neon-border {
          box-shadow: inset 0 0 10px rgba(239, 68, 68, 0.3), 0 0 10px rgba(239, 68, 68, 0.3);
        }
        .lightning-clip {
          clip-path: polygon(100% 0, 100% 85%, 95% 100%, 0 100%, 0 0);
        }
      `}</style>
      
      <div className="bg-[#0b0f19] rounded-2xl shadow-2xl overflow-hidden border border-gray-800 lightning-clip relative">
        {/* Background ambient glow */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-50%] left-[-10%] w-[60%] h-[150%] bg-red-600/10 blur-[100px] rounded-full mix-blend-screen"></div>
          <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[100%] bg-blue-600/10 blur-[100px] rounded-full mix-blend-screen"></div>
        </div>

        {/* Tabs - Dark sleek design */}
        <div className="flex flex-wrap bg-[#131b2c] border-b border-gray-800 relative z-10">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 px-2 text-center font-black uppercase transition-all duration-300 text-sm md:text-base relative group ${
                activeTab === tab 
                  ? 'text-white' 
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
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
        <div className="bg-gradient-to-r from-red-900/40 via-red-800/20 to-transparent text-gray-300 text-xs md:text-sm font-medium flex items-center justify-center py-2 border-b border-red-900/30 relative z-10">
          <span className="text-red-400 mr-2">⚡</span> Giới hạn 01 sản phẩm/ 1 khách hàng trong chương trình ưu đãi
        </div>

        {/* Content Body */}
        <div className="flex flex-col xl:flex-row relative z-10">
          
          {/* Left Sidebar - Cyberpunk / Gaming Vibe */}
          <div className="xl:w-[280px] shrink-0 p-8 flex flex-col items-center justify-center border-b xl:border-b-0 xl:border-r border-gray-800 relative overflow-hidden bg-[#0f1523]/80 backdrop-blur-sm">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50"></div>
            
            <div className="flex items-center gap-0 mb-1">
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
            

            <div className="text-gray-400 text-sm font-bold mb-4 uppercase tracking-widest flex items-center gap-2">
              <Timer size={16} className="text-red-500" />
              Kết thúc sau: <span className="text-white font-black">{timeLeft.d} Ngày</span>
            </div>
            
            {/* Timer boxes - Digital Clock Style */}
            <div className="flex gap-3 text-center mb-10">
              <div className="flex flex-col items-center">
                <div className="bg-[#1a2333] text-white text-3xl font-black rounded-lg w-14 h-16 flex items-center justify-center border border-gray-700 neon-border font-mono shadow-inner">
                  {timeLeft.h.toString().padStart(2, '0')}
                </div>
                <span className="text-[10px] text-gray-500 font-bold mt-2 uppercase tracking-wider">Giờ</span>
              </div>
              <div className="text-gray-600 font-black text-3xl mt-3 animate-pulse">:</div>
              <div className="flex flex-col items-center">
                <div className="bg-[#1a2333] text-white text-3xl font-black rounded-lg w-14 h-16 flex items-center justify-center border border-gray-700 neon-border font-mono shadow-inner">
                  {timeLeft.m.toString().padStart(2, '0')}
                </div>
                <span className="text-[10px] text-gray-500 font-bold mt-2 uppercase tracking-wider">Phút</span>
              </div>
              <div className="text-gray-600 font-black text-3xl mt-3 animate-pulse">:</div>
              <div className="flex flex-col items-center">
                <div className="bg-[#1a2333] text-red-500 text-3xl font-black rounded-lg w-14 h-16 flex items-center justify-center border border-red-900/50 neon-border font-mono shadow-inner">
                  {timeLeft.s.toString().padStart(2, '0')}
                </div>
                <span className="text-[10px] text-red-500/70 font-bold mt-2 uppercase tracking-wider">Giây</span>
              </div>
            </div>

          </div>

          {/* Right Slider - Dark Cards */}
          <div className="relative z-10 overflow-hidden w-full flex-1 py-6 xl:py-10 flex items-center bg-[#0b0f19]">
            {activeProducts.length > 0 ? (
              <div className="flex gap-5 w-max animate-marquee px-6 hover:[animation-play-state:paused]">
                {marqueeProducts.map((product, idx) => {
                  return (
                    <div
                      key={`${product._id}-${idx}`}
                      className="flex-none w-[260px] bg-[#131b2c] rounded-xl border border-gray-800 overflow-hidden group hover:border-red-500/50 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)] hover:-translate-y-2 transition-all duration-500 flex flex-col relative cursor-pointer"
                    >
                      <div className="relative aspect-[4/3] p-6 flex items-center justify-center bg-white/5 overflow-hidden">
                        <Link href={`/product/${product.slug}`} className="absolute inset-0 z-20"></Link>

                        {product.images?.[0] && (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                            className="object-contain p-4 group-hover:scale-110 transition-transform duration-700 relative z-10 drop-shadow-2xl"
                            unoptimized
                          />
                        )}
                        
                        {/* Glow effect behind image */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white/10 blur-[40px] rounded-full group-hover:bg-red-500/20 transition-colors duration-500"></div>
                        
                        {/* Badges */}
                        <div className="absolute top-3 left-3 z-20 flex flex-col shadow-lg rounded overflow-hidden transform group-hover:scale-110 origin-top-left transition-transform duration-300">
                          {product.discountPrice > product.price && (
                            <>
                              <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white text-[10px] font-black px-2 py-1 text-center uppercase tracking-widest">
                                GIẢM SỐC
                              </div>
                              <div className="bg-[#0b0f19] text-red-400 text-[12px] font-black px-2 py-1 text-center border-t border-red-500/30">
                                -{Math.round(((product.discountPrice - product.price) / product.discountPrice) * 100)}%
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="p-5 flex flex-col flex-1 relative z-10 border-t border-gray-800/50 bg-[#151e32]">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">{product.brand || "GAMING GEAR"}</div>
                        </div>
                        <Link href={`/product/${product.slug}`} className="hover:text-red-400 transition-colors mb-4 z-30 relative">
                          <h3 className="text-gray-200 text-[14px] font-medium leading-relaxed line-clamp-2">{product.name}</h3>
                        </Link>
                        
                        <div className="flex flex-col mb-5 mt-auto">
                          {product.discountPrice > product.price ? (
                            <>
                              <div className="flex items-center gap-2 mt-0.5 mb-1">
                                <span className="text-gray-500 text-[13px] line-through decoration-gray-600">{product.discountPrice.toLocaleString('vi-VN')}₫</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-[20px] font-black text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]">{product.price.toLocaleString('vi-VN')}₫</span>
                              </div>
                            </>
                          ) : (
                             <>
                               <div className="h-[21px] mb-1"></div>
                               <span className="text-[20px] font-black text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]">{product.price.toLocaleString('vi-VN')}₫</span>
                             </>
                          )}
                        </div>
                        
                        <div className="relative z-30">
                          <Link 
                            href={`/product/${product.slug}`}
                            className="flex items-center justify-center gap-2 w-full py-2.5 bg-gray-800 hover:bg-red-600 text-gray-300 hover:text-white rounded border border-gray-700 hover:border-red-500 font-bold text-[13px] transition-all duration-300 group/btn"
                          >
                            <span>XEM CHI TIẾT</span>
                            <ShoppingCart size={14} className="group-hover/btn:animate-bounce" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="w-full text-center text-gray-500 py-10">
                Chưa có sản phẩm flash sale trong danh mục này.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
