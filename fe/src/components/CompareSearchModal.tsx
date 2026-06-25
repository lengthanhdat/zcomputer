"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Search, X, Loader2, Scale } from "lucide-react";
import { fetchApi } from "@/lib/api";
import { useCompareStore } from "@/store/useCompareStore";

export default function CompareSearchModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const addItem = useCompareStore((state) => state.addItem);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    
    const delay = setTimeout(async () => {
      setLoading(true);
      try {
        const endpoint = query.trim() 
          ? `/products?search=${encodeURIComponent(query)}&limit=10`
          : `/products?limit=10`; // Lấy 10 sản phẩm mới nhất nếu chưa gõ
          
        const res = await fetchApi(endpoint, { requireAuth: false });
        if (res.ok) {
          const result = await res.json();
          if (Array.isArray(result)) {
            setResults(result);
          } else if (result?.data && Array.isArray(result.data)) {
            setResults(result.data);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, query.trim() ? 500 : 0); // Không delay nếu load lần đầu

    return () => clearTimeout(delay);
  }, [query, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center p-4 pt-12 sm:pt-24 bg-black/60 backdrop-blur-md" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl w-full max-w-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] flex flex-col max-h-[90vh] overflow-hidden" 
        onClick={e => e.stopPropagation()}
      >
        
        {/* Header / Search Area */}
        <div className="p-4 sm:p-6 pb-4 border-b border-gray-100 z-10 relative">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Search size={16} strokeWidth={3} />
              </span>
              Tìm sản phẩm so sánh
            </h3>
            <button 
              onClick={onClose} 
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
            <input 
              type="text" 
              autoFocus
              placeholder="Nhập mã hoặc tên sản phẩm..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm sm:text-base"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button 
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto relative">
          <div className="p-4 sm:p-6 pb-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-40 text-gray-400 space-y-4">
                <Loader2 size={40} className="animate-spin text-primary/50" />
                <p className="font-medium">Đang tìm kiếm...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {results.map((product) => (
                  <div 
                    key={product._id} 
                    className="flex items-center gap-4 p-3 bg-white border border-gray-100 hover:border-primary hover:shadow-[0_8px_20px_-10px_rgba(var(--primary-rgb),0.3)] rounded-2xl cursor-pointer transition-all group h-[100px]"
                    onClick={() => {
                      addItem({
                        _id: product._id,
                        name: product.name,
                        price: product.price,
                        discountPrice: product.discountPrice,
                        image: product.images?.[0] || product.image || "",
                        specs: product.specs,
                        slug: product.slug || product._id
                      });
                      onClose();
                    }}
                  >
                    <div className="w-20 h-20 relative bg-gray-50 rounded-xl flex-shrink-0 border border-gray-100 overflow-hidden p-2 group-hover:scale-105 transition-transform">
                      {product.images?.[0] || product.image ? (
                        <Image src={product.images?.[0] || product.image} alt={product.name} fill className="object-contain" unoptimized />
                      ) : null}
                    </div>
                    <div className="flex-1 h-full flex flex-col justify-center">
                      <h4 className="font-bold text-sm text-gray-800 line-clamp-2 group-hover:text-primary transition-colors leading-snug" title={product.name}>
                        {product.name}
                      </h4>
                      <span className="text-primary font-extrabold text-sm mt-1 block">
                        {((product.discountPrice ?? 0) > product.price ? product.price : product.price).toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-full border-2 border-gray-100 flex items-center justify-center text-gray-300 group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all shrink-0 shadow-sm mr-1">
                      <span className="text-lg leading-none -mt-0.5 font-bold">+</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-gray-400 space-y-4">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                  <Search size={32} className="text-gray-300" />
                </div>
                <p className="font-medium text-gray-500">
                  {query ? `Không tìm thấy sản phẩm "${query}"` : 'Chưa có sản phẩm nào'}
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer Area */}
        <div className="p-3 sm:p-4 bg-gray-50/80 border-t border-gray-100 flex flex-col items-center justify-center gap-2 z-10">
          <p className="text-xs font-medium text-gray-500 text-center leading-relaxed">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary/40 mr-1.5 align-middle mb-0.5"></span>
            Gợi ý: Tìm kiếm theo mã máy hoặc dòng chip để có kết quả chính xác nhất
          </p>
          <p className="text-xs font-medium text-gray-500 text-center leading-relaxed">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary/40 mr-1.5 align-middle mb-0.5"></span>
            Hoặc có thể nhấn biểu tượng <span className="inline-flex items-center justify-center bg-primary/10 text-primary p-0.5 rounded align-middle mx-1 -mt-0.5"><Scale size={14} /></span> trên mỗi sản phẩm để thêm nhanh
          </p>
        </div>

      </div>
    </div>
  );
}
