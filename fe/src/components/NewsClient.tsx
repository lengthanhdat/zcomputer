"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, Eye, ArrowRight, TrendingUp, Zap, Clock, ChevronRight, ArrowLeft } from "lucide-react";
import { fetchApi } from "@/lib/api";

const CATEGORIES = ["Tất cả", "Tin công nghệ", "Khuyến mãi", "Đánh giá sản phẩm", "Thủ thuật"];



export default function NewsClient() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Tất cả");

  useEffect(() => {
    const loadNews = async () => {
      setLoading(true);
      try {
        const query = activeCategory === "Tất cả" ? "" : `?category=${encodeURIComponent(activeCategory)}`;
        const res = await fetchApi(`/news${query}`);
        if (res.ok) {
          const data = await res.json();
          if (data.data && data.data.length > 0) {
            setNews(data.data);
          } else {
            setNews([]);
          }
        } else {
          setNews([]);
        }
      } catch (error) {
        setNews([]);
      } finally {
        setLoading(false);
      }
    };
    loadNews();
  }, [activeCategory]);

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d);
  };

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:5000";
  const getImageUrl = (url: string) => {
    if (!url) return "https://via.placeholder.com/800x450?text=No+Image";
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    return `${API_BASE}${url}`;
  };

  // Tách tin nổi bật (Tin mới nhất/nhiều view nhất) và tin thường
  const featuredNews = news.length > 0 ? news[0] : null;
  const regularNews = news.slice(1);

  return (
    <div className="bg-[#f4f6f8] min-h-screen pb-20">
      {/* Header Banner */}
      <div className="relative bg-[#0b0f19] pt-20 pb-16 md:pt-24 overflow-hidden">
        {/* Return to Home Button */}
        <div className="absolute top-4 left-4 md:top-6 md:left-6 z-20">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-lg hover:bg-primary hover:text-white transition-all active:scale-95 shadow-sm backdrop-blur-sm">
            <ArrowLeft size={16} />
            <span>Về trang chủ</span>
          </Link>
        </div>

        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] bg-primary blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-600/20 blur-[100px] rounded-full"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-3xl md:text-6xl font-black text-white uppercase tracking-tight mb-3 md:mb-4 drop-shadow-lg">
            Tin Tức <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary">Công Nghệ</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-xl font-medium">
            Nơi cập nhật những xu hướng công nghệ mới nhất, đánh giá chân thực và các mẹo vặt hữu ích từ ZCOMPUTER.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 -mt-8 relative z-20">
        {/* Category Tabs */}
        <div className="bg-white rounded-2xl p-2 md:p-3 shadow-[0_10px_40px_rgba(0,0,0,0.08)] flex items-center justify-start overflow-x-auto gap-2 scrollbar-hide mb-8 md:mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 md:px-6 md:py-3 rounded-xl font-bold text-sm md:text-base transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-gradient-to-r from-primary to-primary text-white shadow-lg shadow-primary/30"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary/50 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : news.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center shadow-sm">
            <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <TrendingUp size={40} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Chưa có bài viết nào</h3>
            <p className="text-gray-500">Chuyên mục này hiện tại chưa có bài viết. Vui lòng quay lại sau nhé!</p>
          </div>
        ) : (
          <>
            {/* Featured Article */}
            {featuredNews && (
              <div className="mb-12 group cursor-pointer">
                <Link href={`/tin-tuc/${featuredNews.slug}`}>
                  <div className="bg-white rounded-2xl md:rounded-[2rem] overflow-hidden shadow-[0_15px_50px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_60px_var(--primary-ring)] transition-all duration-500 flex flex-col lg:flex-row">
                    <div className="lg:w-3/5 h-[200px] sm:h-[300px] lg:h-[450px] relative overflow-hidden">
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                      <img 
                        src={getImageUrl(featuredNews.thumbnail)} 
                        alt={featuredNews.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute top-4 left-4 md:top-6 md:left-6 z-20">
                        <span className="bg-primary text-white text-[10px] md:text-xs font-black uppercase px-3 py-1.5 md:px-4 md:py-2 rounded-lg shadow-lg">
                          {featuredNews.category}
                        </span>
                      </div>
                    </div>
                    <div className="lg:w-2/5 p-5 sm:p-8 lg:p-12 flex flex-col justify-center bg-gradient-to-br from-white to-gray-50">
                      <div className="flex items-center gap-4 text-xs md:text-sm font-medium text-gray-500 mb-3 md:mb-4">
                        <div className="flex items-center gap-1.5"><Calendar size={14} className="text-primary md:w-4 md:h-4" /> {formatDate(featuredNews.createdAt)}</div>
                        <div className="flex items-center gap-1.5"><Eye size={14} className="text-blue-500 md:w-4 md:h-4" /> {featuredNews.views} lượt xem</div>
                      </div>
                      <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-gray-900 leading-tight mb-3 md:mb-6 group-hover:text-primary transition-colors duration-300">
                        {featuredNews.title}
                      </h2>
                      <p className="text-gray-600 text-sm md:text-base lg:text-lg mb-6 md:mb-8 line-clamp-3 leading-relaxed">
                        {featuredNews.summary}
                      </p>
                      <div className="inline-flex items-center gap-2 text-primary text-sm md:text-base font-bold uppercase tracking-wider group-hover:translate-x-2 transition-transform duration-300">
                        Đọc tiếp <ArrowRight size={18} className="md:w-5 md:h-5" />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Regular Articles Grid */}
            {regularNews.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
                {regularNews.map((article) => (
                  <Link key={article._id} href={`/tin-tuc/${article.slug}`} className="group h-full">
                    <div className="bg-white rounded-xl md:rounded-2xl h-full flex flex-col overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all duration-300">
                      <div className="relative h-48 md:h-56 overflow-hidden">
                        <img 
                          src={getImageUrl(article.thumbnail)} 
                          alt={article.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 md:top-4 md:left-4">
                          <span className="bg-white/90 backdrop-blur-sm text-gray-900 font-bold text-[10px] md:text-[11px] uppercase px-2 py-1 md:px-3 md:py-1.5 rounded-md shadow-sm">
                            {article.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-5 md:p-6 flex-1 flex flex-col">
                        <div className="flex items-center justify-between text-[11px] md:text-xs font-semibold text-gray-500 mb-2 md:mb-3">
                          <span className="flex items-center gap-1.5"><Clock size={12} className="text-gray-400 md:w-3.5 md:h-3.5" /> {formatDate(article.createdAt)}</span>
                          <span className="flex items-center gap-1.5"><Eye size={12} className="text-gray-400 md:w-3.5 md:h-3.5" /> {article.views}</span>
                        </div>
                        <h3 className="text-lg md:text-xl font-black text-gray-900 leading-snug mb-2 md:mb-3 group-hover:text-primary transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 text-xs md:text-sm mb-4 md:mb-6 line-clamp-3 flex-1">
                          {article.summary}
                        </p>
                        <div className="flex items-center justify-between pt-3 md:pt-4 border-t border-gray-100">
                          <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase">ZCOMPUTER</span>
                          <span className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                            <ChevronRight size={16} className="md:w-4 md:h-4" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
