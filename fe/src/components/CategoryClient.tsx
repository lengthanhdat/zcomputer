"use client";

import Image from "next/image";
import Link from "next/link";
import { Filter, Cpu, Monitor, Server, HardDrive, Maximize, ArrowRight, Eye, LayoutGrid, Check, ChevronDown, Heart, X } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import LikeButton from "./LikeButton";

type Product = {
  _id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice?: number;
  images?: string[];
  specs?: Record<string, string>;
  brand?: string;
  condition?: string;
  isHotSale?: boolean;
  flashSalePrice?: number;
  stock?: number;
  status?: string;
  views?: number;
};

export default function CategoryClient({ 
  initialProducts, 
  categoryName,
}: { 
  initialProducts: Product[];
  categoryName: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const brands = Array.from(new Set(initialProducts.map(p => p.brand).filter(Boolean))) as string[];

  const currentBrands = searchParams.get('brand')?.split(',').map(b => b.trim().toUpperCase()) || [];
  const currentPrices = searchParams.get('price')?.split(',') || [];
  const currentSort = searchParams.get('sort') || 'default';
  
  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';
  const isDiscount = searchParams.get('isDiscount') === 'true';
  const isHotSale = searchParams.get('isHotSale') === 'true';

  const [minPriceInput, setMinPriceInput] = useState(currentMinPrice);
  const [maxPriceInput, setMaxPriceInput] = useState(currentMaxPrice);

  useEffect(() => {
    setMinPriceInput(currentMinPrice);
    setMaxPriceInput(currentMaxPrice);
  }, [currentMinPrice, currentMaxPrice]);

  const updateParam = (key: string, values: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    if (values.length > 0) {
      params.set(key, values.join(','));
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const toggleBrand = (brand: string) => {
    const newBrands = currentBrands.includes(brand.toUpperCase())
      ? currentBrands.filter(b => b !== brand.toUpperCase())
      : [...currentBrands, brand.toUpperCase()];
    updateParam('brand', newBrands);
  };

  const priceRanges = [
    { id: 'under-15', label: 'Dưới 15 triệu', check: (p: number) => p < 15000000 },
    { id: '15-20', label: '15 - 20 triệu', check: (p: number) => p >= 15000000 && p <= 20000000 },
    { id: '20-30', label: '20 - 30 triệu', check: (p: number) => p > 20000000 && p <= 30000000 },
    { id: 'over-30', label: 'Trên 30 triệu', check: (p: number) => p > 30000000 },
    { id: 'under-10', label: 'Dưới 10 triệu', check: (p: number) => p < 10000000, hidden: true },
    { id: '10-20', label: 'Từ 10 - 20 triệu', check: (p: number) => p >= 10000000 && p <= 20000000, hidden: true },
    { id: 'over-20', label: 'Trên 20 triệu', check: (p: number) => p > 20000000, hidden: true },
  ];

  const visiblePriceRanges = priceRanges.filter(r => !r.hidden);

  const togglePrice = (priceId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('minPrice');
    params.delete('maxPrice');
    
    const newPrices = currentPrices.includes(priceId)
      ? currentPrices.filter(p => p !== priceId)
      : [...currentPrices, priceId];
      
    if (newPrices.length > 0) {
      params.set('price', newPrices.join(','));
    } else {
      params.delete('price');
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const applyManualPrice = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (minPriceInput) params.set('minPrice', minPriceInput);
    else params.delete('minPrice');
    
    if (maxPriceInput) params.set('maxPrice', maxPriceInput);
    else params.delete('maxPrice');
    
    params.delete('price'); // clear predefined
    router.push(`${pathname}?${params.toString()}`);
  }

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    if (e.target.value !== 'default') {
      params.set('sort', e.target.value);
    } else {
      params.delete('sort');
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  const filteredProducts = useMemo(() => {
    let filtered = [...initialProducts];

    // Status filters
    if (isDiscount) {
      filtered = filtered.filter(p => p.discountPrice && p.discountPrice > p.price);
    }
    if (isHotSale) {
      filtered = filtered.filter(p => p.isHotSale);
    }

    // Brand filter
    if (currentBrands.length > 0) {
      filtered = filtered.filter(p => p.brand && currentBrands.includes(p.brand.toUpperCase()));
    }

    // Predefined Price filter
    if (currentPrices.length > 0) {
      filtered = filtered.filter(p => {
        return currentPrices.some(priceId => {
          const range = priceRanges.find(r => r.id === priceId);
          return range ? range.check(p.price) : false;
        });
      });
    }

    // Manual Price filter
    if (currentMinPrice || currentMaxPrice) {
      filtered = filtered.filter(p => {
        let valid = true;
        if (currentMinPrice) {
          valid = valid && p.price >= Number(currentMinPrice);
        }
        if (currentMaxPrice) {
          valid = valid && p.price <= Number(currentMaxPrice);
        }
        return valid;
      });
    }

    // Sorting
    if (currentSort === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (currentSort === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (currentSort === 'newest') {
      filtered.reverse();
    }

    return filtered;
  }, [initialProducts, currentBrands, currentPrices, currentSort, currentMinPrice, currentMaxPrice, isDiscount, isHotSale]);

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="text-sm text-gray-500 mb-6 flex gap-2">
          <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
          <span>/</span>
          <span className="text-gray-800 font-semibold uppercase">{categoryName}</span>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          <motion.aside 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className={`lg:w-72 bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] shrink-0 lg:sticky lg:top-24 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto custom-scrollbar ${showMobileFilter ? 'fixed inset-0 z-50 m-0 rounded-none w-full overflow-y-auto' : 'hidden lg:block w-full'}`}
          >
            <div className="flex items-center justify-between font-black text-lg pb-4 border-b border-gray-100 text-gray-900 uppercase">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
                  <Filter size={16} className="text-primary" />
                </div>
                Bộ lọc sản phẩm
              </div>
              <button onClick={() => setShowMobileFilter(false)} className="lg:hidden p-2 text-gray-500">
                 <X size={24} />
              </button>
            </div>

            <div className="mt-6">
              <div className="mb-8">
                <h3 className="font-bold mb-4 text-gray-800 uppercase tracking-wider text-sm flex items-center gap-2">
                <span className="w-1 h-4 bg-red-500 rounded-full"></span>Tính năng nổi bật
              </h3>
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer group" onClick={() => updateParam('isDiscount', isDiscount ? [] : ['true'])}>
                  <div className={`w-5 h-5 rounded flex items-center justify-center transition-all duration-300 ${isDiscount ? 'bg-red-500 border-red-500 shadow-md shadow-red-500/20' : 'border border-gray-300 group-hover:border-red-400'}`}>
                    {isDiscount && <Check size={14} className="text-white" />}
                  </div>
                  <span className={`text-[14px] transition-colors ${isDiscount ? 'text-gray-900 font-bold' : 'text-gray-600 font-medium group-hover:text-gray-900'}`}>
                    Đang giảm giá
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group" onClick={() => updateParam('isHotSale', isHotSale ? [] : ['true'])}>
                  <div className={`w-5 h-5 rounded flex items-center justify-center transition-all duration-300 ${isHotSale ? 'bg-orange-500 border-orange-500 shadow-md shadow-orange-500/20' : 'border border-gray-300 group-hover:border-orange-400'}`}>
                    {isHotSale && <Check size={14} className="text-white" />}
                  </div>
                  <span className={`text-[14px] transition-colors ${isHotSale ? 'text-gray-900 font-bold' : 'text-gray-600 font-medium group-hover:text-gray-900'}`}>
                    Sản phẩm Hot Sale
                  </span>
                </label>
              </div>
            </div>

            {brands.length > 0 && (
              <div className="mb-8 border-t border-gray-100 pt-6">
                <h3 className="font-bold mb-4 text-gray-800 uppercase tracking-wider text-sm flex items-center gap-2">
                  <span className="w-1 h-4 bg-blue-500 rounded-full"></span>Thương hiệu
                </h3>
                <div className="space-y-4 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                  {brands.map((brand) => {
                    const isChecked = currentBrands.includes(brand.toUpperCase());
                    return (
                      <label key={brand} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleBrand(brand)}>
                        <div className={`w-5 h-5 rounded flex items-center justify-center transition-all duration-300 ${isChecked ? 'bg-blue-500 border-blue-500 shadow-md shadow-blue-500/20' : 'border border-gray-300 group-hover:border-blue-400'}`}>
                          {isChecked && <Check size={14} className="text-white" />}
                        </div>
                        <span className={`text-[14px] transition-colors ${isChecked ? 'text-gray-900 font-bold' : 'text-gray-600 font-medium group-hover:text-gray-900'}`}>
                          {brand}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mb-6 border-t border-gray-100 pt-6">
              <h3 className="font-bold mb-4 text-gray-800 uppercase tracking-wider text-sm flex items-center gap-2">
                <span className="w-1 h-4 bg-emerald-500 rounded-full"></span>Mức giá
              </h3>
              <div className="space-y-4 mb-6">
                {visiblePriceRanges.map((range) => {
                  const isChecked = currentPrices.includes(range.id);
                  return (
                    <label key={range.id} className="flex items-center gap-3 cursor-pointer group" onClick={() => togglePrice(range.id)}>
                      <div className={`w-5 h-5 rounded flex items-center justify-center transition-all duration-300 ${isChecked ? 'bg-emerald-500 border-emerald-500 shadow-md shadow-emerald-500/20' : 'border border-gray-300 group-hover:border-emerald-400'}`}>
                        {isChecked && <Check size={14} className="text-white" />}
                      </div>
                      <span className={`text-[14px] transition-colors ${isChecked ? 'text-gray-900 font-bold' : 'text-gray-600 font-medium group-hover:text-gray-900'}`}>
                        {range.label}
                      </span>
                    </label>
                  );
                })}
              </div>

              <div className="pt-5 border-t border-dashed border-gray-200">
                <h4 className="font-semibold text-xs text-gray-500 mb-3 uppercase tracking-wider">Hoặc nhập giá:</h4>
                <div className="flex items-center gap-2 mb-3">
                  <div className="relative flex-1">
                    <input 
                      type="number" 
                      placeholder="Từ..." 
                      value={minPriceInput}
                      onChange={(e) => setMinPriceInput(e.target.value)}
                      className="w-full pl-3 pr-2 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all bg-gray-50 hover:bg-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none font-medium"
                    />
                  </div>
                  <span className="text-gray-400 font-bold">-</span>
                  <div className="relative flex-1">
                    <input 
                      type="number" 
                      placeholder="Đến..." 
                      value={maxPriceInput}
                      onChange={(e) => setMaxPriceInput(e.target.value)}
                      className="w-full pl-3 pr-2 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all bg-gray-50 hover:bg-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none font-medium"
                    />
                  </div>
                </div>
                {(minPriceInput || maxPriceInput) && (
                  <div className="text-[11px] text-emerald-700 font-bold mb-4 bg-emerald-50 border border-emerald-100 px-3 py-2 rounded-lg flex items-center justify-between">
                    <span>
                      Từ: {minPriceInput ? Number(minPriceInput).toLocaleString('vi-VN') + 'đ' : '0đ'} <br/>
                      Đến: {maxPriceInput ? Number(maxPriceInput).toLocaleString('vi-VN') + 'đ' : 'Max'}
                    </span>
                  </div>
                )}
                <button 
                  onClick={applyManualPrice}
                  className="w-full bg-gray-900 text-white hover:bg-primary shadow-md hover:shadow-primary/30 text-[13px] font-bold py-3 rounded-xl transition-all duration-300 uppercase tracking-wider"
                >
                  Áp dụng giá
                </button>
              </div>
              </div>
            </div>
          </motion.aside>

          <div className="flex-1">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 relative overflow-hidden"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-500 to-purple-500"></div>
              
              <div className="flex items-center justify-between w-full sm:w-auto">
                <div className="text-gray-600 font-medium ml-2">
                  <span className="text-gray-900 font-black">{filteredProducts.length}</span> sản phẩm 
                </div>
                <button 
                  className="lg:hidden flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg text-sm font-bold text-gray-700"
                  onClick={() => setShowMobileFilter(true)}
                >
                  <Filter size={16} /> Lọc
                </button>
              </div>
              <select 
                className="border border-gray-200 rounded-xl px-5 py-2.5 text-sm outline-none focus:border-primary font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer shadow-sm"
                value={currentSort}
                onChange={handleSortChange}
              >
                <option value="default">Sắp xếp: Mặc định</option>
                <option value="price-asc">Giá: Tăng dần</option>
                <option value="price-desc">Giá: Giảm dần</option>
                <option value="newest">Mới nhất</option>
              </select>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => {
                  const isHotSaleActive = !!(product.isHotSale && product.flashSalePrice && product.flashSalePrice < product.price);
                  const originalPrice = (product.discountPrice && product.discountPrice > product.price) ? product.discountPrice : product.price;
                  const currentPrice = isHotSaleActive ? product.flashSalePrice! : product.price;
                  const saveAmount = originalPrice - currentPrice;
                  const discountPercent = originalPrice > currentPrice ? Math.round((saveAmount / originalPrice) * 100) : 0;
                  const isOutOfStock = product.status === 'out_of_stock' || product.stock === 0;

                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      key={product._id}
                      className={`bg-white rounded-2xl border border-gray-100 overflow-hidden group shadow-sm flex flex-col h-full relative transition-all duration-300 ${isOutOfStock ? 'opacity-80' : 'hover:shadow-[0_20px_40px_rgb(220,38,38,0.12)] hover:-translate-y-2'}`}
                    >
                      <Link href={`/${product.slug}`} className="absolute inset-0 z-20"></Link>
                      <div className="relative aspect-[4/3] p-4 flex items-center justify-center bg-white overflow-hidden">

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
                            className="object-contain p-6 mix-blend-multiply group-hover:scale-105 group-hover:-translate-y-1 transition-all duration-500 relative z-10"
                            unoptimized
                          />
                        )}
                        
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
                        
                        {/* Badges */}
                        <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5">
                          {product.isHotSale && (
                            <div className="shadow-lg rounded-md overflow-hidden transform -rotate-2 origin-top-left group-hover:rotate-0 transition-transform duration-300">
                              <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white text-[10px] font-black px-2 py-1 text-center uppercase tracking-widest">
                                🔥 HOT SALE
                              </div>
                            </div>
                          )}
                          {saveAmount > 0 && !isOutOfStock && (
                            <div className="shadow-lg rounded-md overflow-hidden transform -rotate-2 origin-top-left group-hover:rotate-0 transition-transform duration-300">
                              <div className="bg-gradient-to-r from-red-600 to-red-500 text-white text-[10px] font-black px-2 py-1 text-center uppercase tracking-widest">
                                TIẾT KIỆM
                              </div>
                              <div className="bg-red-700 text-white text-[11px] font-black px-2 py-1 text-center border-t border-red-500">
                                {saveAmount.toLocaleString('vi-VN')} đ
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Hover Action */}
                        {!isOutOfStock && (
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 z-30 pointer-events-none">
                            <div className="bg-white/95 backdrop-blur-sm text-primary text-sm font-bold px-6 py-2 rounded-full shadow-lg border border-primary/20 flex items-center gap-2 whitespace-nowrap">
                              Xem chi tiết <ArrowRight size={16} />
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="p-4 flex flex-col flex-1 bg-white border-t border-gray-50/50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-[11px] font-bold text-gray-500 uppercase">{product.brand || "KHÁC"}</div>
                          <LikeButton product={product} />
                        </div>
                        <Link href={`/${product.slug}`} className="hover:text-red-600 transition-colors mb-3 z-30 relative">
                          <h3 className="text-gray-700 text-[13px] font-medium leading-relaxed line-clamp-2">{product.name}</h3>
                        </Link>
                        
                        <div className="flex flex-col mb-4">
                          {isOutOfStock ? (
                             <div className="h-full flex items-end">
                               <span className="text-[15px] font-bold text-gray-500">Liên hệ</span>
                             </div>
                          ) : saveAmount > 0 ? (
                            <>
                              <span className="text-gray-400 text-[12px] line-through mb-0.5">{originalPrice.toLocaleString('vi-VN')}₫</span>
                              <div className="flex items-center gap-2">
                                <span className="text-[16px] font-black text-red-600">{currentPrice.toLocaleString('vi-VN')}₫</span>
                                <span className="text-red-500 border border-red-500 rounded text-[10px] font-bold px-1 py-[1px] leading-none">-{discountPercent}%</span>
                              </div>
                            </>
                          ) : (
                             <>
                               <div className="h-[18px] mb-0.5"></div>
                               <span className="text-[16px] font-black text-red-600">{currentPrice.toLocaleString('vi-VN')}₫</span>
                             </>
                          )}
                        </div>

                        {product.specs && Object.keys(product.specs).length > 0 && (
                          <div className="bg-gray-50/80 border border-gray-100 rounded-lg p-2.5 text-[10px] text-gray-600 grid grid-cols-2 gap-y-2 gap-x-2 mt-auto">
                            {Object.entries(product.specs).filter(([_, v]) => v && String(v).trim() !== '').slice(0, 5).map(([key, value], index) => {
                              const lowerKey = key.toLowerCase();
                              let Icon = Maximize;
                              if (lowerKey.includes('cpu') || lowerKey.includes('chip') || lowerKey.includes('vi xử lý')) Icon = Cpu;
                              else if (lowerKey.includes('vga') || lowerKey.includes('card') || lowerKey.includes('đồ họa')) Icon = Monitor;
                              else if (lowerKey.includes('ram')) Icon = Server;
                              else if (lowerKey.includes('ổ') || lowerKey.includes('ssd') || lowerKey.includes('hdd') || lowerKey.includes('storage')) Icon = HardDrive;
                              
                              return (
                                <div key={key} className={`flex items-center gap-1.5 truncate ${index === 4 ? 'col-span-2' : ''}`} title={`${key}: ${value}`}>
                                  <Icon size={12} className="text-gray-400 shrink-0"/> 
                                  <span className="truncate">{value as string}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        <div className="mt-4 flex justify-center text-gray-400 text-[12px] items-center gap-1.5 pt-3 border-t border-gray-50 group-hover:text-gray-600 transition-colors">
                          <Eye size={14} /> {(product.views || 0).toLocaleString('vi-VN')} lượt xem
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="col-span-full py-20 text-center border-2 border-dashed border-gray-200 rounded-3xl bg-white shadow-sm flex flex-col items-center justify-center"
                >
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                    <Filter size={40} className="text-gray-300" />
                  </div>
                  <h3 className="text-xl font-black text-gray-800 mb-2">Không tìm thấy sản phẩm</h3>
                  <p className="text-gray-500 max-w-md mx-auto">Thử loại bỏ một số bộ lọc để xem nhiều sản phẩm hơn nhé.</p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
