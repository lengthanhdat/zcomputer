"use client";

import Image from "next/image";
import Link from "next/link";
import { Filter, Cpu, Monitor, Server, HardDrive, Maximize, ArrowRight, Eye } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

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
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

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
          <aside className="w-full lg:w-64 bg-white p-5 rounded-xl border border-gray-100 shadow-sm h-fit shrink-0 sticky top-24">
            <div className="flex items-center gap-2 font-black text-lg mb-4 border-b border-gray-100 pb-3 text-gray-900 uppercase">
              <Filter size={20} className="text-primary" /> Bộ lọc sản phẩm
            </div>

            <div className="mb-6">
              <h3 className="font-bold mb-3 text-gray-800">Tính năng nổi bật</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <label className="flex items-center gap-3 cursor-pointer hover:text-red-500 transition-colors font-medium">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-gray-300 text-red-500 focus:ring-red-500 accent-red-500" 
                    checked={isDiscount}
                    onChange={() => updateParam('isDiscount', isDiscount ? [] : ['true'])}
                  /> 
                  Đang giảm giá
                </label>
                <label className="flex items-center gap-3 cursor-pointer hover:text-orange-500 transition-colors font-medium">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500 accent-orange-500" 
                    checked={isHotSale}
                    onChange={() => updateParam('isHotSale', isHotSale ? [] : ['true'])}
                  /> 
                  Sản phẩm Hot Sale
                </label>
              </div>
            </div>

            {brands.length > 0 && (
              <div className="mb-6 border-t border-gray-100 pt-5">
                <h3 className="font-bold mb-3 text-gray-800">Thương hiệu</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  {brands.map((brand) => (
                    <label key={brand} className="flex items-center gap-3 cursor-pointer hover:text-primary transition-colors font-medium">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary accent-primary" 
                        checked={currentBrands.includes(brand.toUpperCase())}
                        onChange={() => toggleBrand(brand)}
                      /> 
                      {brand}
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6 border-t border-gray-100 pt-5">
              <h3 className="font-bold mb-3 text-gray-800">Mức giá</h3>
              <div className="space-y-3 text-sm text-gray-600 mb-5">
                {visiblePriceRanges.map((range) => (
                  <label key={range.id} className="flex items-center gap-3 cursor-pointer hover:text-primary transition-colors font-medium">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary accent-primary" 
                      checked={currentPrices.includes(range.id)}
                      onChange={() => togglePrice(range.id)}
                    /> 
                    {range.label}
                  </label>
                ))}
              </div>

              <div className="pt-4 border-t border-dashed border-gray-200">
                <h4 className="font-semibold text-xs text-gray-500 mb-3 uppercase">Hoặc tự chọn khoảng giá:</h4>
                <div className="flex items-center gap-2 mb-2">
                  <input 
                    type="number" 
                    placeholder="Từ..." 
                    value={minPriceInput}
                    onChange={(e) => setMinPriceInput(e.target.value)}
                    className="w-full px-2 py-2 text-sm border border-gray-300 rounded-md outline-none focus:border-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="text-gray-400">-</span>
                  <input 
                    type="number" 
                    placeholder="Đến..." 
                    value={maxPriceInput}
                    onChange={(e) => setMaxPriceInput(e.target.value)}
                    className="w-full px-2 py-2 text-sm border border-gray-300 rounded-md outline-none focus:border-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                {(minPriceInput || maxPriceInput) && (
                  <div className="text-[11px] text-emerald-600 font-medium mb-3 bg-emerald-50 px-2 py-1 rounded">
                    Sẽ lọc từ: {minPriceInput ? Number(minPriceInput).toLocaleString('vi-VN') + ' đ' : '0 đ'} <br/> đến {maxPriceInput ? Number(maxPriceInput).toLocaleString('vi-VN') + ' đ' : 'Tối đa'}
                  </div>
                )}
                <button 
                  onClick={applyManualPrice}
                  className="w-full bg-white border border-primary text-primary hover:bg-primary hover:text-white text-sm font-bold py-2 rounded-md transition-colors"
                >
                  Áp dụng khoảng giá
                </button>
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <h1 className="text-xl font-black text-gray-900 uppercase flex items-center gap-2">
                {categoryName} 
                <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2.5 py-1 rounded-full normal-case">
                  {filteredProducts.length} sản phẩm
                </span>
              </h1>
              <select 
                className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                value={currentSort}
                onChange={handleSortChange}
              >
                <option value="default">Sắp xếp: Mặc định</option>
                <option value="price-asc">Giá: Tăng dần</option>
                <option value="price-desc">Giá: Giảm dần</option>
                <option value="newest">Mới nhất</option>
              </select>
            </div>

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
                    <div
                      key={product._id}
                      className={`bg-white rounded-2xl border border-gray-100 overflow-hidden group shadow-sm flex flex-col h-full relative transition-all duration-500 ${isOutOfStock ? 'opacity-80' : 'hover:shadow-[0_8px_30px_rgb(220,38,38,0.15)] hover:border-red-200 hover:-translate-y-2'}`}
                    >
                      <Link href={`/product/${product.slug}`} className="absolute inset-0 z-10"></Link>
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
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 z-30">
                            <div className="bg-white/95 backdrop-blur-sm text-primary text-sm font-bold px-6 py-2 rounded-full shadow-lg border border-primary/20 flex items-center gap-2 whitespace-nowrap">
                              Xem chi tiết <ArrowRight size={16} />
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="p-4 flex flex-col flex-1 bg-white relative z-10 border-t border-gray-50/50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-[11px] font-bold text-gray-500 uppercase">{product.brand || "KHÁC"}</div>
                        </div>
                        <Link href={`/product/${product.slug}`} className="hover:text-red-600 transition-colors mb-3 z-30 relative">
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
                            {Object.entries(product.specs).slice(0, 5).map(([key, value], index) => {
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

                        <div className="mt-4 mb-2 flex justify-center text-gray-900 text-[13px] items-center gap-1.5 pt-3 border-t border-gray-100">
                          <Eye size={15} /> {(product.views || 0).toLocaleString('vi-VN')} lượt xem
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full py-16 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-white shadow-sm flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <Filter size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Không tìm thấy sản phẩm</h3>
                  <p className="text-gray-500 max-w-md mx-auto">Vui lòng điều chỉnh lại bộ lọc hoặc quay lại danh mục tất cả sản phẩm.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
