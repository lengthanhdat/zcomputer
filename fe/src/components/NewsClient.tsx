"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, Eye, ArrowRight, TrendingUp, Zap, Clock, ChevronRight } from "lucide-react";
import { fetchApi } from "@/lib/api";

const CATEGORIES = ["Tất cả", "Tin công nghệ", "Khuyến mãi", "Đánh giá sản phẩm", "Thủ thuật"];

// Mock data to show beautiful design when backend has no data yet
const MOCK_NEWS = [
  {
    _id: "1",
    slug: "danh-gia-laptop-gaming-acer-nitro-5-2026",
    title: "Đánh Giá Acer Nitro 5 2026: Vua Laptop Gaming Phân Khúc Dưới 25 Triệu",
    summary: "Acer Nitro 5 phiên bản 2026 mang đến một diện mạo hoàn toàn mới với thiết kế hầm hố, tản nhiệt nâng cấp và card đồ họa RTX 4050 siêu mạnh mẽ cho sinh viên và game thủ.",
    thumbnail: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=1000&auto=format&fit=crop",
    category: "Đánh giá sản phẩm",
    views: 1250,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "2",
    slug: "huong-dan-toi-uu-hoa-windows-11-de-choi-game-muot-ma-hon",
    title: "Hướng Dẫn Tối Ưu Hóa Windows 11 Để Chơi Game Mượt Mà Không Bị Tụt FPS",
    summary: "Chỉ với 5 bước đơn giản, bạn có thể giải phóng RAM, vô hiệu hóa các dịch vụ không cần thiết và tối ưu hóa Windows 11 để mang lại trải nghiệm chiến game mượt mà nhất.",
    thumbnail: "https://images.unsplash.com/photo-1626218174358-7769486c4b79?q=80&w=1000&auto=format&fit=crop",
    category: "Thủ thuật",
    views: 890,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    _id: "3",
    slug: "nvidia-ra-mat-rtx-5090-suc-manh-khung-khiep",
    title: "NVIDIA Chính Thức Ra Mắt RTX 5090: Sức Mạnh Đồ Họa Vượt Xa Mọi Giới Hạn",
    summary: "Kiến trúc Blackwell mới của NVIDIA đã chính thức ra mắt với siêu phẩm RTX 5090, hứa hẹn hiệu năng chơi game 4K 144Hz hoàn hảo và khả năng xử lý AI vô song.",
    thumbnail: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?q=80&w=1000&auto=format&fit=crop",
    category: "Tin công nghệ",
    views: 3400,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    _id: "4",
    slug: "chuong-trinh-khuyen-mai-back-to-school-2026",
    title: "Khuyến Mãi Back To School 2026: Giảm Giá Laptop Lên Đến 5 Triệu Đồng",
    summary: "Hòa cùng không khí tựu trường, ZCOMPUTER tung ra hàng ngàn deal sốc dành cho học sinh, sinh viên. Mua laptop tặng ngay balo, chuột gaming và voucher cực giá trị.",
    thumbnail: "https://images.unsplash.com/photo-1512756290469-ec264b7fbf87?q=80&w=1000&auto=format&fit=crop",
    category: "Khuyến mãi",
    views: 5210,
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
  }
];

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
          // Fallback to MOCK_NEWS if DB is empty to show the design
          if (data.data && data.data.length > 0) {
            setNews(data.data);
          } else {
            setNews(activeCategory === "Tất cả" ? MOCK_NEWS : MOCK_NEWS.filter(n => n.category === activeCategory));
          }
        } else {
          setNews(activeCategory === "Tất cả" ? MOCK_NEWS : MOCK_NEWS.filter(n => n.category === activeCategory));
        }
      } catch (error) {
        setNews(activeCategory === "Tất cả" ? MOCK_NEWS : MOCK_NEWS.filter(n => n.category === activeCategory));
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
      <div className="relative bg-[#0b0f19] pt-24 pb-16 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] bg-red-600/20 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-600/20 blur-[100px] rounded-full"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-bold text-sm mb-6 uppercase tracking-widest">
            <Zap size={16} className="text-yellow-400" /> Cập nhật 24/7
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight mb-4 drop-shadow-lg">
            Tin Tức <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-400">Công Nghệ</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg md:text-xl font-medium">
            Nơi cập nhật những xu hướng công nghệ mới nhất, đánh giá chân thực và các mẹo vặt hữu ích từ ZCOMPUTER.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 -mt-8 relative z-20">
        {/* Category Tabs */}
        <div className="bg-white rounded-2xl p-2 md:p-3 shadow-[0_10px_40px_rgba(0,0,0,0.08)] flex items-center justify-start overflow-x-auto gap-2 scrollbar-hide mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/30"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-red-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-red-500/30 border-t-red-600 rounded-full animate-spin"></div>
          </div>
        ) : news.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center shadow-sm">
            <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
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
                  <div className="bg-white rounded-[2rem] overflow-hidden shadow-[0_15px_50px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_60px_rgba(239,68,68,0.15)] transition-all duration-500 flex flex-col lg:flex-row">
                    <div className="lg:w-3/5 h-[300px] sm:h-[400px] lg:h-[450px] relative overflow-hidden">
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                      <img 
                        src={getImageUrl(featuredNews.thumbnail)} 
                        alt={featuredNews.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute top-6 left-6 z-20">
                        <span className="bg-red-600 text-white text-xs font-black uppercase px-4 py-2 rounded-lg shadow-lg">
                          {featuredNews.category}
                        </span>
                      </div>
                    </div>
                    <div className="lg:w-2/5 p-8 lg:p-12 flex flex-col justify-center bg-gradient-to-br from-white to-gray-50">
                      <div className="flex items-center gap-4 text-sm font-medium text-gray-500 mb-4">
                        <div className="flex items-center gap-1.5"><Calendar size={16} className="text-red-500" /> {formatDate(featuredNews.createdAt)}</div>
                        <div className="flex items-center gap-1.5"><Eye size={16} className="text-blue-500" /> {featuredNews.views} lượt xem</div>
                      </div>
                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 leading-tight mb-6 group-hover:text-red-600 transition-colors duration-300">
                        {featuredNews.title}
                      </h2>
                      <p className="text-gray-600 text-base lg:text-lg mb-8 line-clamp-3 leading-relaxed">
                        {featuredNews.summary}
                      </p>
                      <div className="inline-flex items-center gap-2 text-red-600 font-bold uppercase tracking-wider group-hover:translate-x-2 transition-transform duration-300">
                        Đọc tiếp <ArrowRight size={20} />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Regular Articles Grid */}
            {regularNews.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {regularNews.map((article) => (
                  <Link key={article._id} href={`/tin-tuc/${article.slug}`} className="group h-full">
                    <div className="bg-white rounded-2xl h-full flex flex-col overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all duration-300">
                      <div className="relative h-56 overflow-hidden">
                        <img 
                          src={getImageUrl(article.thumbnail)} 
                          alt={article.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="bg-white/90 backdrop-blur-sm text-gray-900 font-bold text-[11px] uppercase px-3 py-1.5 rounded-md shadow-sm">
                            {article.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-3">
                          <span className="flex items-center gap-1.5"><Clock size={14} className="text-gray-400" /> {formatDate(article.createdAt)}</span>
                          <span className="flex items-center gap-1.5"><Eye size={14} className="text-gray-400" /> {article.views}</span>
                        </div>
                        <h3 className="text-xl font-black text-gray-900 leading-snug mb-3 group-hover:text-red-600 transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-6 line-clamp-3 flex-1">
                          {article.summary}
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <span className="text-xs font-bold text-gray-400 uppercase">ZCOMPUTER</span>
                          <span className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
                            <ChevronRight size={18} />
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
