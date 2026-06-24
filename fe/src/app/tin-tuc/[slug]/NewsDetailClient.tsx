"use client";

import { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api";
import { Calendar, Eye, User, ArrowLeft, Share2, Link as LinkIcon, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

export default function NewsDetailClient({ slug, initialArticle }: { slug: string, initialArticle?: any }) {
  const router = useRouter();
  const [article, setArticle] = useState<any>(initialArticle || null);
  const [recentNews, setRecentNews] = useState<any[]>([]);
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [loading, setLoading] = useState(!initialArticle && slug !== "preview");

  useEffect(() => {
    const loadNewsDetail = async () => {
      if (!initialArticle) {
        setLoading(true);
      
      if (slug === "preview") {
        const previewData = localStorage.getItem("news_preview");
        if (previewData) {
          try {
            setArticle(JSON.parse(previewData));
          } catch (error) {}
        }
        setLoading(false);
        return;
      }

      try {
        const res = await fetchApi(`/news/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setArticle(data);
        } else {
          setArticle(null);
        }
      } catch (error) {
          setArticle(null);
        } finally {
          setLoading(false);
        }
      }

      // Fetch related/recent news
      try {
        const recentRes = await fetchApi(`/news?limit=5`);
        if (recentRes.ok) {
          const recentData = await recentRes.json();
          if (recentData.data) {
            setRecentNews(recentData.data.filter((n: any) => n.slug !== slug).slice(0, 4));
          }
        }
      } catch (error) {}
    };
    loadNewsDetail();
  }, [slug, initialArticle]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Đã sao chép đường dẫn bài viết!');
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d);
  };

  const handleSubscribe = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return toast.error("Vui lòng nhập một địa chỉ email hợp lệ!");
    }
    setSubscribing(true);
    try {
      const res = await fetchApi('/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Đăng ký nhận tin thành công!");
        setEmail("");
      } else {
        toast.error(data.message || "Đăng ký thất bại");
      }
    } catch (error) {
      toast.error("Lỗi khi kết nối đến máy chủ");
    } finally {
      setSubscribing(false);
    }
  };

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:5000";
  const getImageUrl = (url: string) => {
    if (!url) return "https://via.placeholder.com/800x450?text=No+Image";
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    return `${API_BASE}${url}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-40 min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary/50 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-20 text-center min-h-[60vh] flex flex-col justify-center items-center">
        <h2 className="text-3xl font-bold mb-4">Không tìm thấy bài viết!</h2>
        <p className="text-gray-500 mb-8">Bài viết bạn đang tìm có thể đã bị xóa hoặc đường dẫn không đúng.</p>
        <Link href="/tin-tuc" className="bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary transition">
          Về trang tin tức
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-20">
      {slug === "preview" && (
        <div className="bg-yellow-500 text-black text-center font-bold py-2 shadow-lg fixed top-0 w-full z-50 flex items-center justify-center gap-2">
          <Eye size={20} /> CHẾ ĐỘ XEM TRƯỚC (PREVIEW MODE)
        </div>
      )}
      {/* Hero Section */}
      {/* Hero Section */}
      <div className={`relative min-h-[50vh] md:min-h-[60vh] w-full bg-black pt-28 pb-12 md:pb-20 ${slug === "preview" ? 'mt-10' : ''}`}>
        <div className="absolute inset-0 z-0">
          <img 
            src={getImageUrl(article.thumbnail)} 
            alt={article.title} 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#f8f9fa] via-black/50 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4 h-full flex flex-col justify-end relative z-10">
          <button 
            onClick={() => router.back()} 
            className="inline-flex items-center gap-1.5 text-white/90 hover:text-white mb-6 font-medium text-sm transition-all w-max bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/20 shadow-lg active:scale-95"
          >
            <ArrowLeft size={16} />
            <span>Trở về</span>
          </button>
          
          <div className="inline-flex mb-4">
            <span className="bg-primary text-white font-bold text-[10px] md:text-xs uppercase px-3 py-1.5 rounded shadow-lg">
              {article.category}
            </span>
          </div>
          
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-white leading-tight mb-4 md:mb-6 max-w-4xl drop-shadow-md">
            {article.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 md:gap-6 text-gray-300 text-xs md:text-sm font-medium">
            <div className="flex items-center gap-1.5 md:gap-2">
              <User size={14} className="md:w-4 md:h-4" /> {article.authorName || article.author?.name || "ZComputer"}
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} /> {formatDate(article.createdAt)}
            </div>
            <div className="flex items-center gap-2">
              <Eye size={16} /> {article.views} lượt xem
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 relative z-20 -mt-8 md:-mt-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Article Body */}
          <div className="lg:w-8/12 xl:w-9/12 min-w-0 bg-white rounded-2xl md:rounded-[2rem] p-6 md:p-10 lg:p-16 shadow-[0_10px_40px_rgba(0,0,0,0.05)]">
            {/* Summary Box */}
            <div className="bg-primary/10 border-l-4 border-primary/50 p-6 rounded-r-xl mb-10 text-gray-800 text-lg font-medium italic break-words">
              {article.summary}
            </div>
            
            {/* Rich Text Content */}
            <div className="prose prose-lg max-w-4xl mx-auto text-gray-800 leading-relaxed text-justify prose-headings:text-gray-900 prose-a:text-primary hover:prose-a:brightness-110 prose-img:rounded-xl prose-img:shadow-md [&_img]:mx-auto [&_img]:max-w-full [&_img]:h-auto ql-snow">
              <div 
                className="ql-editor p-0 min-w-full article-content"
                dangerouslySetInnerHTML={{ __html: article.content.replace(/&nbsp;/g, ' ') }}
              />
            </div>
            <style>{`
              .article-content {
                font-size: 16px;
                line-height: 1.85;
                color: #374151;
                word-break: normal;
                overflow-wrap: break-word;
              }
              .article-content h1, .article-content h2, .article-content h3,
              .article-content h4, .article-content h5, .article-content h6 {
                font-weight: 800;
                color: #111827;
                margin-top: 2rem;
                margin-bottom: 0.75rem;
                line-height: 1.35;
              }
              .article-content h1 { font-size: 2rem; }
              .article-content h2 { font-size: 1.5rem; padding-bottom: 0.5rem; border-bottom: 2px solid #fee2e2; }
              .article-content h3 { font-size: 1.25rem; color: #dc2626; }
              .article-content p { margin-bottom: 1.1rem; }
              .article-content strong, .article-content b { color: #111827; font-weight: 700; }
              .article-content em, .article-content i { font-style: italic; }
              .article-content a { color: #dc2626; text-decoration: underline; }
              .article-content a:hover { color: #991b1b; }
              .article-content img {
                max-width: 100%;
                border-radius: 12px;
                margin: 1.5rem auto;
                display: block;
                box-shadow: 0 4px 20px rgba(0,0,0,0.08);
              }
              .article-content ul, .article-content ol {
                padding-left: 1.5rem;
                margin-bottom: 1.1rem;
              }
              .article-content ul { list-style-type: disc; }
              .article-content ol { list-style-type: decimal; }
              .article-content li { margin-bottom: 0.4rem; }
              .article-content blockquote {
                border-left: 4px solid #ef4444;
                background: #fff7f7;
                padding: 1rem 1.25rem;
                margin: 1.5rem 0;
                border-radius: 0 8px 8px 0;
                color: #4b5563;
                font-style: italic;
              }
              .article-content table {
                width: 100%;
                border-collapse: collapse;
                margin: 1.5rem 0;
                font-size: 14px;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 1px 4px rgba(0,0,0,0.08);
              }
              .article-content thead {
                background: #dc2626;
                color: white;
              }
              .article-content thead th {
                padding: 10px 14px;
                font-weight: 700;
                text-align: left;
              }
              .article-content tbody tr:nth-child(even) {
                background: #fff7f7;
              }
              .article-content tbody tr:hover {
                background: #fee2e2;
              }
              .article-content td {
                padding: 9px 14px;
                border-bottom: 1px solid #e5e7eb;
                vertical-align: top;
              }
              .article-content pre {
                background: #1e293b;
                color: #e2e8f0;
                padding: 1rem 1.25rem;
                border-radius: 8px;
                overflow-x: auto;
                font-size: 14px;
                margin: 1.25rem 0;
              }
              .article-content code {
                background: #f1f5f9;
                color: #dc2626;
                padding: 2px 6px;
                border-radius: 4px;
                font-size: 13px;
              }
              .article-content hr {
                border: none;
                border-top: 2px solid #f3f4f6;
                margin: 2rem 0;
              }
            `}</style>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-100 flex items-center gap-3 flex-wrap">
                <span className="font-bold text-gray-900 mr-2">Tags:</span>
                {(Array.isArray(article.tags) ? article.tags : article.tags.split(",")).map((tag: string, index: number) => (
                  <span key={index} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-md text-sm font-medium hover:bg-primary/10 hover:text-primary cursor-pointer transition">
                    #{typeof tag === 'string' ? tag.trim() : tag}
                  </span>
                ))}
              </div>
            )}
            
            {/* Share Section */}
            <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <h4 className="font-bold text-lg text-gray-900">Chia sẻ bài viết này:</h4>
              <div className="flex items-center gap-3">
                <button onClick={copyLink} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-colors">
                  <LinkIcon size={18} />
                </button>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${typeof window !== 'undefined' ? window.location.href : ''}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#1877F2]/10 flex items-center justify-center text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href={`https://twitter.com/intent/tweet?url=${typeof window !== 'undefined' ? window.location.href : ''}&text=${article.title}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#1DA1F2]/10 flex items-center justify-center text-[#1DA1F2] hover:bg-[#1DA1F2] hover:text-white transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63.961-.689 1.8-1.56 2.46-2.548l-.047-.02z"/></svg>
                </a>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-4/12 xl:w-3/12 hidden lg:block">
            <div className="sticky top-28 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <TrendingUp className="text-primary" /> Các tin tức khác
              </h3>
              
              <div className="flex flex-col gap-6">
                {recentNews.length > 0 ? (
                  recentNews.map((item) => (
                    <Link href={`/tin-tuc/${item.slug}`} key={item._id} className="group flex gap-4 items-start">
                      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-200">
                        <img src={getImageUrl(item.thumbnail)} alt="Thumbnail" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 text-sm line-clamp-2 mb-1 group-hover:text-primary transition-colors">{item.title}</h4>
                        <p className="text-xs text-gray-500 flex items-center gap-1"><Eye size={12} /> {item.views} lượt xem</p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic">Chưa có tin tức nào khác.</p>
                )}
              </div>

              <div className="mt-8 pt-8 border-t border-gray-100">
                <div className="bg-gradient-to-br from-primary to-primary rounded-2xl p-6 text-white text-center shadow-lg shadow-primary">
                  <h4 className="font-black text-lg mb-2">Đăng ký nhận tin</h4>
                  <p className="text-sm text-primary mb-4">Nhận ngay thông báo về siêu khuyến mãi và mã giảm giá độc quyền.</p>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email của bạn" 
                    className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-white placeholder:text-white/60 focus:outline-none focus:border-white mb-3 text-sm" 
                  />
                  <button 
                    onClick={handleSubscribe}
                    disabled={subscribing}
                    className="w-full bg-white text-primary font-bold py-2.5 rounded-lg text-sm hover:shadow-lg transition disabled:opacity-70 disabled:hover:shadow-none"
                  >
                    {subscribing ? "Đang xử lý..." : "Đăng ký ngay"}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
