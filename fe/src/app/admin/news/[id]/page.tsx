"use client";

import { useState, useEffect, use, useRef } from "react";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";
import Link from "next/link";
import { ArrowLeft, Save, Upload, Image as ImageIcon, ChevronDown, Eye, Calendar, Pin, CheckCircle2, XCircle, Target } from "lucide-react";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";

// Tải ReactQuill động để tránh lỗi SSR và forwardRef
const ReactQuill = dynamic(
  async () => {
    const rq = await import("react-quill-new");
    const RQ = rq.default;
    const Quill = (RQ as any).Quill;

    if (Quill && typeof window !== "undefined") {
      (window as any).Quill = Quill;
      const { default: BlotFormatter } = await import("quill-blot-formatter");
      Quill.register("modules/blotFormatter", BlotFormatter);
      
      const { default: MagicUrl } = await import("quill-magic-url");
      Quill.register("modules/magicUrl", MagicUrl);
      
      const Font = Quill.import('formats/font');
      Font.whitelist = ['sans-serif', 'arial', 'times-new-roman', 'tahoma', 'verdana', 'courier-new'];
      Quill.register(Font, true);

      // Bắt buộc đăng ký thuộc tính Alt cho thẻ Image, nếu không Quill sẽ tự động xóa
      const BaseImageFormat = Quill.import('formats/image');
      class ImageFormat extends BaseImageFormat {
        static formats(domNode: Element) {
          return ['alt', 'width', 'height'].reduce(function(formats: any, attribute) {
            if (domNode.hasAttribute(attribute)) {
              formats[attribute] = domNode.getAttribute(attribute);
            }
            return formats;
          }, {});
        }
        format(name: string, value: any) {
          if (['alt', 'width', 'height'].includes(name)) {
            if (value) {
              this.domNode.setAttribute(name, value);
            } else {
              this.domNode.removeAttribute(name);
            }
          } else {
            super.format(name, value);
          }
        }
      }
      Quill.register(ImageFormat, true);
    }

    return function Comp({ forwardedRef, ...props }: any) {
      return <RQ ref={forwardedRef} {...props} />;
    };
  },
  { ssr: false }
);
import "react-quill-new/dist/quill.snow.css";

const CATEGORIES = ["Tin công nghệ", "Khuyến mãi", "Đánh giá sản phẩm", "Thủ thuật"];

const MOCK_KEYWORDS = [
  { keyword: "laptop gaming cũ", volume: "65,000", kd: "38 (TB)", intent: "Thương mại", cpc: "14,500đ" },
  { keyword: "mua laptop cũ giá rẻ", volume: "45,000", kd: "32 (Dễ)", intent: "Giao dịch", cpc: "15,500đ" },
  { keyword: "build pc gaming", volume: "33,100", kd: "55 (Khó)", intent: "Giao dịch", cpc: "22,000đ" },
  { keyword: "đánh giá rtx 4060", volume: "12,400", kd: "28 (Dễ)", intent: "Thông tin", cpc: "8,200đ" },
  { keyword: "màn hình 144hz", volume: "28,500", kd: "41 (TB)", intent: "Thương mại", cpc: "11,000đ" },
  { keyword: "thu cũ đổi mới laptop", volume: "25,300", kd: "40 (TB)", intent: "Giao dịch", cpc: "18,500đ" },
  { keyword: "laptop sinh viên 2026", volume: "52,800", kd: "35 (Dễ)", intent: "Thương mại", cpc: "18,500đ" },
  { keyword: "bàn phím cơ custom", volume: "19,200", kd: "48 (TB)", intent: "Giao dịch", cpc: "9,500đ" },
  { keyword: "pc đồ họa 3d", volume: "8,100", kd: "30 (Dễ)", intent: "Thương mại", cpc: "19,200đ" },
  { keyword: "cách vệ sinh laptop", volume: "15,400", kd: "12 (Dễ)", intent: "Thông tin", cpc: "1,500đ" },
];

export default function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const isNew = unwrappedParams.id === "new";
  const quillRef = useRef<any>(null);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    summary: "",
    content: "",
    thumbnail: "",
    category: "Tin công nghệ",
    tags: "",
    authorName: "Admin ZComputer",
    isPublished: true,
  });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [focusKeyword, setFocusKeyword] = useState("");
  
  // States cho các Custom Modals
  const [altModalVisible, setAltModalVisible] = useState(false);
  const [altImages, setAltImages] = useState<{tag: string, src: string, alt: string}[]>([]);
  const [insertImageModal, setInsertImageModal] = useState<{visible: boolean, url: string, alt: string, cursorPosition: number, editor: any} | null>(null);

  // Hàm tính điểm SEO
  const calculateSEO = () => {
    let score = 0;
    const checks = [];
    
    // 1. Tiêu đề
    const titleLength = formData.title.length;
    if (titleLength >= 40 && titleLength <= 70) {
      score += 10;
      checks.push({ text: "Tiêu đề tối ưu (40-70 ký tự)", pass: true });
    } else {
      checks.push({ text: "Tiêu đề nên từ 40-70 ký tự", pass: false });
    }

    // 2. Tóm tắt (Meta Description)
    const summaryLength = formData.summary.length;
    if (summaryLength >= 120 && summaryLength <= 160) {
      score += 10;
      checks.push({ text: "Tóm tắt tối ưu (120-160 ký tự)", pass: true });
    } else {
      checks.push({ text: "Tóm tắt nên từ 120-160 ký tự", pass: false });
    }

    // 3. Độ dài nội dung
    const textContent = formData.content.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ');
    const wordCount = textContent.split(/\s+/).filter(w => w.length > 0).length;
    if (wordCount >= 300) {
      score += 15;
      checks.push({ text: `Độ dài bài viết tốt (${wordCount} từ)`, pass: true });
    } else {
      checks.push({ text: `Nội dung hơi ngắn (${wordCount} từ, nên > 300)`, pass: false });
    }

    // 4. Từ khóa chính
    if (focusKeyword.trim()) {
      const keyword = focusKeyword.toLowerCase().trim();
      
      if (formData.title.toLowerCase().includes(keyword)) {
        score += 15;
        checks.push({ text: "Tiêu đề chứa từ khóa chính", pass: true });
      } else {
        checks.push({ text: "Tiêu đề KHÔNG chứa từ khóa", pass: false });
      }

      if (formData.summary.toLowerCase().includes(keyword)) {
        score += 15;
        checks.push({ text: "Tóm tắt chứa từ khóa chính", pass: true });
      } else {
        checks.push({ text: "Tóm tắt KHÔNG chứa từ khóa", pass: false });
      }

      const keywordCount = (textContent.toLowerCase().match(new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "gi")) || []).length;
      const kwWords = keyword.split(/\s+/).filter(w => w.length > 0).length;
      const density = wordCount > 0 ? ((keywordCount * kwWords) / wordCount) * 100 : 0;

      if (keywordCount >= 2 && density <= 5) {
        score += 15;
        checks.push({ text: `Từ khóa lặp lại ${keywordCount} lần (Mật độ: ${density.toFixed(1)}% - Tốt)`, pass: true });
      } else if (density > 5) {
        checks.push({ text: `Nhồi nhét từ khóa quá mức (${density.toFixed(1)}% - nên < 5%)`, pass: false });
      } else {
        checks.push({ text: `Từ khóa nên lặp lại ít nhất 2 lần (hiện tại: ${keywordCount})`, pass: false });
      }
    } else {
      checks.push({ text: "Chưa thiết lập Từ khóa chính (-45đ)", pass: false });
    }

    // 5. Thẻ Heading (H2, H3)
    const hasHeadings = /<h[2-6][^>]*>/.test(formData.content);
    if (hasHeadings) {
      score += 5;
      checks.push({ text: "Bài viết có dùng thẻ Tiêu đề phụ (H2, H3)", pass: true });
    } else {
      checks.push({ text: "Nên thêm các thẻ Tiêu đề phụ (H2, H3) để chia bố cục", pass: false });
    }

    // 6. Liên kết (Links)
    const hasLinks = /<a[^>]*href=["'][^"']+["']/.test(formData.content);
    if (hasLinks) {
      score += 5;
      checks.push({ text: "Bài viết có chứa liên kết (Links)", pass: true });
    } else {
      checks.push({ text: "Nên chèn thêm liên kết nội bộ/bên ngoài", pass: false });
    }

    // 7. Hình ảnh và thẻ ALT
    const hasImages = /<img[^>]*>/.test(formData.content);
    if (hasImages) {
      if (focusKeyword.trim()) {
        const keyword = focusKeyword.toLowerCase().trim();
        const imgTags = formData.content.match(/<img[^>]*>/gi) || [];
        // Kiểm tra xem thẻ img có chứa từ khóa trong thuộc tính alt hoặc title không
        const hasAltKeyword = imgTags.some(img => {
          const altMatch = img.match(/alt=["']([^"']+)["']/i);
          return altMatch && altMatch[1].toLowerCase().includes(keyword);
        });
        
        if (hasAltKeyword) {
          score += 10;
          checks.push({ text: "Ảnh có chứa thẻ Alt chứa từ khóa", pass: true });
        } else {
          checks.push({ text: "Nên thêm từ khóa vào thẻ Alt của ảnh", pass: false });
        }
      } else {
        score += 10;
        checks.push({ text: "Bài viết có chứa hình ảnh trực quan", pass: true });
      }
    } else {
      checks.push({ text: "Nên chèn thêm hình ảnh minh họa", pass: false });
    }

    return { score, checks };
  };

  const seo = calculateSEO();
  const seoColor = seo.score >= 80 ? 'text-emerald-600' : seo.score >= 50 ? 'text-amber-500' : 'text-rose-500';
  const seoBg = seo.score >= 80 ? 'bg-emerald-50' : seo.score >= 50 ? 'bg-amber-50' : 'bg-rose-50';

  useEffect(() => {
    if (!isNew) {
      loadArticle();
    }
  }, [unwrappedParams.id]);

  const loadArticle = async () => {
    try {
      const res = await fetchApi(`/news/admin/${unwrappedParams.id}`);
      if (res.ok) {
        const data = await res.json();
        setFormData({
          title: data.title,
          slug: data.slug,
          summary: data.summary,
          content: data.content,
          thumbnail: data.thumbnail || "",
          category: data.category,
          tags: data.tags.join(", "),
          authorName: data.authorName || data.author?.name || "Admin ZComputer",
          isPublished: data.isPublished,
        });
      } else {
        toast.error("Không tìm thấy bài viết");
        router.push("/admin/news");
      }
    } catch (error) {
      toast.error("Lỗi khi tải bài viết");
    } finally {
      setLoading(false);
    }
  };

  // Tự động tạo Slug từ Title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    if (isNew && !formData.slug) {
      const slug = title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[đĐ]/g, "d")
        .replace(/([^0-9a-z-\s])/g, "")
        .replace(/(\s+)/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");
      setFormData({ ...formData, title, slug });
    } else {
      setFormData({ ...formData, title });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append("image", file);

    try {
      const res = await fetchApi("/upload/image", {
        method: "POST",
        body: data,
        requireAuth: true,
      });

      if (res.ok) {
        const responseData = await res.json();
        setFormData({ ...formData, thumbnail: responseData.url });
        toast.success("Tải ảnh bìa thành công");
      } else {
        toast.error("Tải ảnh thất bại");
      }
    } catch (error) {
      toast.error("Lỗi tải ảnh");
    } finally {
      setUploading(false);
    }
  };

  const handleInsertMedia = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append("image", file);

    try {
      const res = await fetchApi("/upload/image", {
        method: "POST",
        body: data,
        requireAuth: true,
      });

      if (res.ok) {
        const responseData = await res.json();
        const imageUrl = responseData.url.startsWith('http') || responseData.url.startsWith('data:') 
          ? responseData.url 
          : `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:5000'}${responseData.url}`;
          
        if (quillRef.current) {
          const editor = quillRef.current.getEditor();
          const range = editor.getSelection();
          const cursorPosition = range ? range.index : editor.getLength();
          
          // Mở Custom Modal thay vì window.prompt
          setInsertImageModal({
            visible: true,
            url: imageUrl,
            alt: focusKeyword || "",
            cursorPosition,
            editor
          });
        }
      } else {
        toast.error("Tải ảnh thất bại");
      }
    } catch (error) {
      toast.error("Lỗi tải ảnh");
    } finally {
      setUploading(false);
    }
  };

  const handleConfirmInsertImage = (skipAlt = false) => {
    if (!insertImageModal) return;
    const { url, alt, cursorPosition, editor } = insertImageModal;
    
    const finalAlt = skipAlt ? "" : (alt || focusKeyword || "image");
    
    editor.insertEmbed(cursorPosition, 'image', url);
    if (finalAlt) {
      editor.formatText(cursorPosition, 1, 'alt', finalAlt);
    }
    
    editor.setSelection(cursorPosition + 1);
    setFormData(prev => ({ ...prev, content: editor.root.innerHTML }));
    
    toast.success("Đã chèn ảnh vào bài viết");
    setInsertImageModal(null);
  };

  const submitData = async (publishedStatus: boolean) => {
    setSaving(true);

    try {
      const payload = {
        ...formData,
        isPublished: publishedStatus,
        tags: formData.tags.split(",").map(t => t.trim()).filter(t => t),
      };

      const url = isNew ? "/news" : `/news/${unwrappedParams.id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetchApi(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(publishedStatus ? (isNew ? "Đã đăng bài viết" : "Đã cập nhật bài viết") : "Đã lưu nháp thành công");
        router.push("/admin/news");
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Lưu thất bại");
      }
    } catch (error) {
      toast.error("Lỗi khi lưu bài viết");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    submitData(true); // Nút xuất bản luôn publish
  };

  const handleSaveDraft = () => {
    submitData(false);
  };

  const handlePreview = () => {
    const previewData = {
      ...formData,
      tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
      _id: "preview",
      createdAt: new Date().toISOString(),
      views: 0,
      author: { name: "Admin (Preview)" },
    };
    localStorage.setItem("news_preview", JSON.stringify(previewData));
    window.open("/tin-tuc/preview", "_blank");
  };

  const modules = {
    blotFormatter: {},
    magicUrl: true,
    toolbar: [
      [{ 'font': [false, 'arial', 'times-new-roman', 'tahoma', 'verdana', 'courier-new'] }, { 'size': ['small', false, 'large', 'huge'] }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      ['blockquote', 'code-block'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'align': [] }],
      ['link', 'image', 'video', 'formula'],
      ['clean']
    ],
  };

  if (loading) return <div className="p-8 text-center">Đang tải dữ liệu...</div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-6 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-400/20 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

      <div className="max-w-[1200px] mx-auto relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin/news" className="p-2.5 bg-white shadow-sm border border-slate-100 hover:shadow-md hover:bg-slate-50 rounded-xl transition-all group">
              <ArrowLeft size={20} className="text-slate-600 group-hover:-translate-x-0.5 transition-transform" />
            </Link>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {isNew ? "Thêm bài viết mới" : "Chỉnh sửa bài viết"}
            </h1>
          </div>
        </div>

      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-5">
        
        {/* Cột chính: Nội dung bài viết */}
        <div className="flex-1 min-w-0 space-y-6">
          <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden group hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-300">
            <input
              type="text"
              required
              value={formData.title}
              onChange={handleTitleChange}
              className="w-full px-6 py-5 text-2xl font-bold text-slate-800 bg-transparent focus:outline-none placeholder-slate-300 border-b border-slate-200/60"
              placeholder="Thêm tiêu đề bài viết..."
            />
            <p className="px-6 py-2 text-xs font-medium text-slate-400 border-b border-slate-200/60 bg-slate-50/50">
              💡 Tiêu đề nên từ 40-70 ký tự và chứa từ khóa chính để tối ưu SEO.
            </p>
            
            <div className="bg-slate-50/50 p-3 border-b border-slate-200/60 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <label className="cursor-pointer flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 border border-indigo-200 bg-white px-4 py-2 rounded-xl transition-all shadow-sm">
                  <Upload size={16} /> Thêm tệp đa phương tiện
                  <input type="file" accept="image/*" className="hidden" onChange={handleInsertMedia} disabled={uploading} />
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const imgRegex = /<img([^>]*)>/gi;
                    let match;
                    const images = [];
                    while ((match = imgRegex.exec(formData.content)) !== null) {
                      const fullTag = match[0];
                      const attrs = match[1];
                      const srcMatch = attrs.match(/src=["']([^"']+)["']/i);
                      const altMatch = attrs.match(/alt=["']([^"']*)["']/i);
                      if (srcMatch) {
                        images.push({
                          tag: fullTag,
                          src: srcMatch[1],
                          alt: altMatch ? altMatch[1] : ""
                        });
                      }
                    }
                    setAltImages(images);
                    setAltModalVisible(true);
                  }}
                  className="cursor-pointer flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border border-emerald-200 bg-white px-4 py-2 rounded-xl transition-all shadow-sm"
                >
                  <Target size={16} /> Quản lý thẻ Alt Ảnh
                </button>
              </div>
              <span className="text-xs text-slate-400 max-w-[400px]">
                💡 Nội dung bài viết nên &gt; 300 từ. Hãy sử dụng các thẻ Heading (H2, H3) trên thanh công cụ để chia bố cục cho đẹp mắt.
              </span>
            </div>

            <div className="bg-white/50">
              <style>{`
                .ql-editor img {
                  max-width: 100%;
                  height: auto;
                }
              `}</style>
              <ReactQuill 
                forwardedRef={quillRef}
                theme="snow"
                value={formData.content}
                onChange={(val: string) => setFormData({ ...formData, content: val })}
                modules={modules}
                className="h-[600px] border-none [&_.ql-container]:border-none [&_.ql-toolbar]:border-none [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-slate-200/60 pb-10 [&_.ql-editor]:text-base [&_.ql-editor]:text-slate-700"
              />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden transition-all duration-300">
            <div className="px-5 py-4 border-b border-slate-200/60 font-bold text-sm text-slate-800 bg-white/50 backdrop-blur-md flex justify-between items-center">
              <span>Tóm tắt (Dùng cho SEO)</span>
              <span className="text-xs font-normal text-slate-500">120 - 160 ký tự</span>
            </div>
            <div className="p-5">
              <textarea
                required
                rows={3}
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 rounded-xl transition-all text-sm text-slate-700"
                placeholder="Tóm tắt nội dung chính để hiển thị bên ngoài trang tin tức..."
              />
              <p className="text-xs text-slate-400 mt-3 border-t border-slate-100 pt-3">
                💡 Tóm tắt giúp người dùng hiểu nhanh nội dung và tăng CTR trên kết quả tìm kiếm.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[320px] shrink-0 space-y-6 lg:sticky lg:top-6 lg:h-fit lg:max-h-[calc(100vh-48px)] lg:overflow-y-auto custom-scrollbar pb-6 pr-2 -mr-2">
          
          <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden transition-all duration-300">
            <div className="px-5 py-4 border-b border-slate-200/60 font-bold text-sm text-slate-800 flex justify-between items-center bg-white/50 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <Target size={18} className={seoColor} /> Đánh giá SEO
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-bold ${seoBg} ${seoColor}`}>
                {seo.score}/100 Điểm
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Từ khóa chính (Focus Keyword)</label>
                <input
                  type="text"
                  value={focusKeyword}
                  onChange={(e) => setFocusKeyword(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 rounded-xl transition-all text-sm text-slate-700"
                  placeholder="Ví dụ: công nghệ, laptop..."
                />
              </div>

              <div className="space-y-2 mt-4">
                {seo.checks.map((check, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    {check.pass ? (
                      <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                    ) : (
                      <XCircle size={16} className="text-rose-400 mt-0.5 shrink-0" />
                    )}
                    <span className={check.pass ? "text-slate-700" : "text-slate-500"}>{check.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden transition-all duration-300">
            <div className="px-5 py-4 border-b border-slate-200/60 font-bold text-sm text-slate-800 bg-white/50 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <Target size={18} className="text-blue-500" /> Từ khóa gợi ý (Top Trending)
              </div>
            </div>
            <div className="p-0 max-h-[300px] overflow-y-auto custom-scrollbar bg-slate-50">
              {MOCK_KEYWORDS.map((kw, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setFocusKeyword(kw.keyword)}
                  className="p-4 border-b border-slate-200/60 cursor-pointer hover:bg-indigo-50/80 transition-colors group"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-indigo-700 group-hover:text-indigo-800 text-sm">{kw.keyword}</span>
                    <span className="text-xs font-semibold px-2 py-1 bg-white rounded shadow-sm border border-slate-200 text-slate-600">
                      KD: {kw.kd}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500">
                    <div><span className="font-medium">Volume:</span> {kw.volume}</div>
                    <div><span className="font-medium">Intent:</span> {kw.intent}</div>
                    <div><span className="font-medium">CPC:</span> {kw.cpc}</div>
                  </div>
                </div>
              ))}
              <div className="p-3 text-center text-xs text-slate-400 bg-white border-t border-slate-200/60 italic">
                Bấm vào một từ khóa để đặt làm từ khóa chính.
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden transition-all duration-300">
            <div className="px-5 py-4 border-b border-slate-200/60 font-bold text-sm text-slate-800 flex justify-between items-center bg-white/50 backdrop-blur-md cursor-pointer hover:bg-slate-50/50 transition-colors">
              Xuất bản
            </div>
            <div className="p-5 text-sm space-y-5">
              <div className="flex gap-3">
                <button type="button" onClick={handleSaveDraft} disabled={saving || uploading} className="flex-1 border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:shadow-sm px-4 py-2.5 rounded-xl font-medium transition-all disabled:opacity-50">Lưu nháp</button>
                <button type="button" onClick={handlePreview} className="flex-1 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:shadow-sm px-4 py-2.5 rounded-xl font-medium transition-all">Xem trước</button>
              </div>
              <button
                type="submit"
                disabled={saving || uploading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-indigo-200 hover:shadow-indigo-300 px-4 py-3 rounded-xl font-semibold transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 flex justify-center items-center gap-2"
              >
                {saving ? "Đang xử lý..." : <><Save size={18} /> Xuất bản bài viết</>}
              </button>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden transition-all duration-300">
            <div className="px-5 py-4 border-b border-slate-200/60 font-bold text-sm text-slate-800 bg-white/50 backdrop-blur-md">
              Thông tin bổ sung
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Đường dẫn thân thiện (Slug)</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 rounded-xl transition-all text-sm text-slate-700"
                  placeholder="duong-dan-bai-viet"
                />
                <p className="text-xs text-slate-400 mt-1">💡 Tự động tạo từ tiêu đề, hoặc bạn có thể sửa thủ công (chỉ dùng chữ thường và dấu gạch ngang).</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Tên người đăng</label>
                <input
                  type="text"
                  value={formData.authorName}
                  onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 rounded-xl transition-all text-sm text-slate-700"
                  placeholder="Ví dụ: Admin ZComputer"
                />
                <p className="text-xs text-slate-400 mt-1">💡 Tên sẽ được hiển thị ở phần tác giả của bài viết.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Thẻ (Tags)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 rounded-xl transition-all text-sm text-slate-700"
                  placeholder="Cách nhau bởi dấu phẩy, vd: công nghệ, laptop"
                />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden transition-all duration-300">
            <div className="px-5 py-4 border-b border-slate-200/60 font-bold text-sm text-slate-800 flex justify-between items-center bg-white/50 backdrop-blur-md cursor-pointer hover:bg-slate-50/50 transition-colors">
              Ảnh đại diện
            </div>
            <div className="p-5 text-sm flex flex-col items-center justify-center">
              {formData.thumbnail ? (
                <div className="w-full relative group">
                  <img 
                    src={formData.thumbnail.startsWith('http') || formData.thumbnail.startsWith('data:') ? formData.thumbnail : `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:5000'}${formData.thumbnail}`} 
                    alt="Thumbnail" 
                    className="w-full h-auto object-cover rounded-xl shadow-sm group-hover:opacity-80 transition-opacity"
                  />
                  <div className="mt-3 flex justify-center">
                    <label className="cursor-pointer text-rose-500 hover:text-rose-600 font-medium px-4 py-2 hover:bg-rose-50 rounded-xl transition-all">
                      Đổi hoặc xóa ảnh
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                    </label>
                  </div>
                </div>
              ) : (
                <label className="w-full flex flex-col items-center justify-center h-40 border-2 border-dashed border-indigo-200 rounded-xl bg-indigo-50/50 hover:bg-indigo-50 cursor-pointer transition-all group">
                  <ImageIcon size={32} className="text-indigo-400 group-hover:text-indigo-500 group-hover:-translate-y-1 transition-all mb-2" />
                  <span className="text-indigo-600 font-medium">Bấm để chọn ảnh</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                </label>
              )}
              {uploading && <p className="text-indigo-500 mt-3 text-sm font-medium animate-pulse">Đang tải ảnh lên...</p>}
              <p className="text-xs text-slate-400 mt-3 border-t border-slate-100 pt-3 w-full text-center">
                💡 Định dạng khuyên dùng: 1200x630 pixel để hiển thị rõ nét nhất trên ZComputer và Facebook.
              </p>
            </div>
          </div>
          
        </div>
      </form>
      </div>

      {/* MODAL 1: Quản lý toàn bộ thẻ Alt */}
      {altModalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg flex items-center gap-2 text-slate-800">
                <Target className="text-emerald-500" /> Quản lý thẻ Alt hình ảnh (SEO)
              </h3>
              <button type="button" onClick={() => setAltModalVisible(false)} className="text-slate-400 hover:text-rose-500 p-1 rounded-lg transition-colors">
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-4 bg-white">
              {altImages.length === 0 ? (
                <div className="text-center text-slate-500 py-10 italic">Không có hình ảnh nào trong bài viết.</div>
              ) : (
                altImages.map((img, index) => (
                  <div key={index} className="flex gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors group">
                    <div className="w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-white border border-slate-200 shadow-sm">
                      <img src={img.src} alt="preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="flex justify-between items-end mb-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase">Thẻ Alt (Mô tả ảnh)</label>
                        {focusKeyword.trim() && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${img.alt.toLowerCase().includes(focusKeyword.toLowerCase().trim()) ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                            {img.alt.toLowerCase().includes(focusKeyword.toLowerCase().trim()) ? '✓ Đạt chuẩn SEO' : '❌ Thiếu từ khóa chính'}
                          </span>
                        )}
                      </div>
                      <input 
                        type="text" 
                        value={img.alt} 
                        onChange={(e) => {
                          const newImages = [...altImages];
                          newImages[index].alt = e.target.value;
                          setAltImages(newImages);
                        }}
                        className="w-full px-4 py-2 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl text-sm transition-all"
                        placeholder="Ví dụ: Hình ảnh laptop cũ giá rẻ tại TP.HCM"
                      />
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button type="button" onClick={() => setAltModalVisible(false)} className="px-5 py-2.5 font-medium text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">Hủy bỏ</button>
              <button 
                type="button"
                onClick={() => {
                  if (!quillRef.current) return;
                  const editor = quillRef.current.getEditor();
                  const delta = editor.getContents();
                  let modified = false;
                  let imgIdx = 0;
                  let indexInEditor = 0;
                  
                  delta.ops.forEach((op: any) => {
                    const length = typeof op.insert === 'string' ? op.insert.length : 1;
                    if (op.insert && typeof op.insert === 'object' && op.insert.image) {
                      if (imgIdx < altImages.length) {
                        const newAlt = altImages[imgIdx].alt;
                        const currentAlt = (op.attributes && op.attributes.alt) ? op.attributes.alt : '';
                        if (newAlt !== currentAlt) {
                          editor.formatText(indexInEditor, 1, 'alt', newAlt);
                          modified = true;
                        }
                      }
                      imgIdx++;
                    }
                    indexInEditor += length;
                  });
                  
                  if (modified) {
                    setFormData({...formData, content: editor.root.innerHTML});
                    toast.success("Đã cập nhật đồng loạt các thẻ Alt thành công!");
                  } else {
                    toast("Không có thay đổi nào được lưu.", { icon: "ℹ️" });
                  }
                  setAltModalVisible(false);
                }} 
                className="px-6 py-2.5 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-lg shadow-emerald-500/30 transition-all hover:-translate-y-0.5"
              >
                Lưu tất cả thẻ Alt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Hỏi thẻ Alt ngay khi vừa Upload ảnh */}
      {insertImageModal && insertImageModal.visible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-800">Cấu hình ảnh (SEO)</h3>
            </div>
            
            <div className="p-6 bg-white space-y-6">
              <div className="w-full h-48 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
                <img src={insertImageModal.url} alt="Preview" className="max-w-full max-h-full object-contain" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Nhập thẻ Alt cho ảnh này:</label>
                <input 
                  type="text" 
                  autoFocus
                  value={insertImageModal.alt} 
                  onChange={(e) => setInsertImageModal({...insertImageModal, alt: e.target.value})}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleConfirmInsertImage(); }}
                  className="w-full px-4 py-3 border border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 rounded-xl text-base transition-all"
                  placeholder="Mô tả bức ảnh..."
                />
                <p className="text-xs text-slate-500 mt-2">💡 Gợi ý: Nên chứa từ khóa <b>{focusKeyword}</b> để điểm SEO cao hơn.</p>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button 
                type="button" 
                onClick={() => handleConfirmInsertImage(true)} 
                className="px-5 py-2.5 font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Bỏ qua
              </button>
              <button 
                type="button"
                onClick={() => handleConfirmInsertImage()} 
                className="px-6 py-2.5 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-0.5"
              >
                Chèn ảnh
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
