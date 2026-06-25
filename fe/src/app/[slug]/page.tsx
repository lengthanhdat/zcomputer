import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Filter, CheckCircle2, ShieldCheck, Truck, Zap, Gift, ArrowRight, RefreshCcw, Settings, Eye, Maximize, Cpu, Monitor, Server, HardDrive, MemoryStick, Gpu, Battery, Layers, Keyboard, Mouse, Link as LinkIcon } from "lucide-react";
import CategoryClient from "@/components/CategoryClient";
import ProductActions from "@/components/ProductActions";
import ProductGallery from "@/components/ProductGallery";
import ViewIncrementer from "@/components/ViewIncrementer";
import LikeButton from "@/components/LikeButton";
import CollapsibleDescription from "@/components/CollapsibleDescription";
import BackButton from "@/components/BackButton";
import { notFound } from "next/navigation";
import "react-quill-new/dist/quill.snow.css"; // Import Quill CSS for proper rendering

export const revalidate = 0;

type Product = {
  _id: string;
  name: string;
  slug: string;
  brand?: string;
  stock?: number;
  price: number;
  discountPrice?: number;
  description?: string;
  images?: string[];
  gifts?: string[];
  specs?: Record<string, string>;
  category_id?: {
    _id?: string;
    name?: string;
    slug?: string;
  };
  condition?: string;
  sku?: string;
  status?: string;
  views?: number;
  isHotSale?: boolean;
  flashSalePrice?: number;
  flashSaleEnd?: string | Date;
  message?: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:5000";

// --- FETCH FUNCTIONS ---

async function getProduct(slug: string): Promise<Product | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);
  try {
    const res = await fetch(`${API_BASE}/api/products/${slug}`, {
      next: { revalidate },
      signal: controller.signal,
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function getCategoryProducts(categorySlug: string): Promise<Product[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);
  try {
    const res = await fetch(`${API_BASE}/api/products?category=${categorySlug}`, {
      next: { revalidate },
      signal: controller.signal,
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

async function getCategoryName(categorySlug: string): Promise<string | null> {
  if (categorySlug === 'all') return 'Tất cả sản phẩm';
  try {
    const res = await fetch(`${API_BASE}/api/categories`);
    if (res.ok) {
      const categories = await res.json();
      const cat = categories.find((c: any) => c.slug === categorySlug);
      return cat ? cat.name : null;
    }
  } catch (error) {
    console.error("Failed to fetch category name:", error);
  }
  return null;
}

async function getSimilarProducts(categoryId: string | null, excludeId: string): Promise<Product[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);
  try {
    const res = await fetch(`${API_BASE}/api/products?limit=20`, {
      next: { revalidate },
      signal: controller.signal,
    });
    if (!res.ok) return [];
    const data = await res.json();
    let similar = data.filter((p: any) => 
      categoryId && (p.category_id === categoryId || p.category_id?._id === categoryId) && p._id !== excludeId
    );
    if (similar.length === 0) {
      similar = data.filter((p: any) => p._id !== excludeId);
    }
    return similar.slice(0, 4);
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

async function getRecentNews() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);
  try {
    const res = await fetch(`${API_BASE}/api/news?limit=5`, {
      next: { revalidate },
      signal: controller.signal,
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data ? data.data.slice(0, 5) : [];
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

// --- METADATA ---

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const siteUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000';

  // 1. Try to fetch as Product
  const product = await getProduct(slug);
  if (product && !product.message) {
    const plainTextDescription = product.description 
      ? product.description.replace(/<[^>]+>/g, '').substring(0, 160) + '...'
      : `Mua ${product.name} chính hãng tại ZCOMPUTER với giá tốt nhất, bảo hành uy tín.`;

    const currentUrl = `${siteUrl}/${product.slug}`;

    return {
      title: `${product.name} | ZCOMPUTER`,
      description: plainTextDescription,
      alternates: { canonical: currentUrl },
      openGraph: {
        title: product.name,
        description: plainTextDescription,
        url: currentUrl,
        images: product.images?.[0] ? [{ url: product.images[0] }] : [],
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: product.name,
        description: plainTextDescription,
        images: product.images?.[0] ? [product.images[0]] : [],
      }
    };
  }

  // 2. Try to fetch as Category
  const categoryName = await getCategoryName(slug);
  if (categoryName) {
    const currentUrl = `${siteUrl}/${slug}`;
    return {
      title: `${categoryName} chính hãng, giá tốt | ZCOMPUTER`,
      description: `Mua ${categoryName} tại ZCOMPUTER với giá tốt nhất thị trường, cam kết chính hãng 100%, bảo hành uy tín, giao hàng toàn quốc.`,
      alternates: { canonical: currentUrl },
      openGraph: {
        title: `${categoryName} | ZCOMPUTER`,
        description: `Khám phá các sản phẩm ${categoryName} chất lượng cao tại ZCOMPUTER.`,
        url: currentUrl,
      },
    };
  }

  // 3. Fallback
  return {
    title: "Không tìm thấy trang - ZCOMPUTER",
    description: "Trang bạn tìm kiếm không tồn tại hoặc đã bị xóa.",
  };
}

// --- PAGE COMPONENT ---

export default async function DynamicRoutePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  // Try fetching as Product first
  const product = await getProduct(slug);
  
  // If product exists and doesn't have an error message
  if (product && !product.message && product.name) {
    return <ProductDetailView product={product} />;
  }
  
  // If not product, try fetching as Category
  const categoryName = await getCategoryName(slug);
  
  // If it's a valid category or 'all'
  if (categoryName || slug === 'all') {
    const products = await getCategoryProducts(slug);
    const finalCatName = categoryName || "Sản phẩm";
    
    const breadcrumbData = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Trang chủ",
          "item": process.env.NEXT_PUBLIC_FRONTEND_URL || "https://zcomputer.site"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": finalCatName,
          "item": `${process.env.NEXT_PUBLIC_FRONTEND_URL || "https://zcomputer.site"}/${slug}`
        }
      ]
    };

    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }} />
        <CategoryClient initialProducts={products} categoryName={finalCatName} />
      </>
    );
  }
  
  // If neither product nor category, show 404
  return (
    <div className="container mx-auto px-4 py-32 text-center min-h-[60vh] flex flex-col items-center justify-center">
      <Image src="/logo_broken.png" alt="ZCOMPUTER" width={120} height={120} className="mb-6 opacity-50 grayscale" />
      <h1 className="text-4xl font-black text-gray-800 mb-4 uppercase tracking-tight">Không tìm thấy nội dung</h1>
      <p className="text-gray-500 mb-8 max-w-md mx-auto">Sản phẩm hoặc danh mục bạn đang tìm kiếm không tồn tại, đã bị xóa hoặc thay đổi đường dẫn.</p>
      <Link href="/" className="bg-primary text-white font-bold px-8 py-3 rounded-full hover:bg-primary transition-colors shadow-lg shadow-primary">
        Quay về trang chủ
      </Link>
    </div>
  );
}

// --- PRODUCT DETAIL UI COMPONENT ---

async function ProductDetailView({ product }: { product: Product }) {
  let specArray = product.specs ? Object.entries(product.specs).filter(([_, v]) => v) : [];
  let cleanDescription = product.description || "";

  if (specArray.length === 0 && cleanDescription) {
    const lines = cleanDescription.split('\n');
    const remainingLines = [];
    
    for (const line of lines) {
      if (line.includes('- CPU:') || line.includes('- RAM:')) {
        const parts = line.split('- ').filter(p => p.trim() && p.includes(':'));
        let isSpecLine = false;
        parts.forEach(part => {
          const [key, ...val] = part.split(':');
          if (key && val.length > 0 && key.length < 20) {
            specArray.push([key.trim().toUpperCase(), val.join(':').trim()]);
            isSpecLine = true;
          }
        });
        if (isSpecLine) continue;
      }
      
      const match = line.match(/^[-*]?\s*([a-zA-Z0-9_\s]+):\s*(.+)$/);
      if (match && match[1].trim().length < 20) {
        specArray.push([match[1].trim().toUpperCase(), match[2].trim()]);
      } else {
        remainingLines.push(line);
      }
    }
    cleanDescription = remainingLines.join('\n').trim();
  }

  const categoryId = product.category_id?._id || (typeof product.category_id === 'string' ? product.category_id : null);
  const [similarProducts, recentNews] = await Promise.all([
    getSimilarProducts(categoryId as string | null, product._id),
    getRecentNews()
  ]);

  const siteUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000';
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images || [],
    description: cleanDescription ? cleanDescription.substring(0, 160) : `Mua ${product.name} chính hãng tại ZCOMPUTER`,
    sku: product.sku || product._id,
    brand: {
      "@type": "Brand",
      name: product.brand || "ZComputer",
    },
    offers: {
      "@type": "Offer",
      url: `${siteUrl}/${product.slug}`,
      priceCurrency: "VND",
      price: product.price,
      itemCondition: "https://schema.org/NewCondition",
      availability: product.stock && product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "ZComputer"
      }
    }
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-32 sm:pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }} />
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 py-3">
        <div className="container mx-auto px-4 text-sm text-gray-500 flex gap-2 items-center overflow-x-auto hide-scrollbar whitespace-nowrap">
          <BackButton className="mr-3" />
          <Link href="/" className="shrink-0 hover:text-primary transition-colors">Trang chủ</Link>
          <span className="shrink-0">/</span>
          <Link href={`/${product.category_id?.slug || "all"}`} className="shrink-0 hover:text-primary transition-colors uppercase">
            {product.category_id?.name || "Sản phẩm"}
          </Link>
          <span className="shrink-0">/</span>
          <span className="shrink-0 text-gray-900 font-bold truncate">{product.name}</span>
        </div>
      </div>

      <ViewIncrementer slug={product.slug} />

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            
            {/* Mobile Gallery */}
            <div className="w-full p-6 border-b border-gray-100 bg-gray-50/30 lg:hidden">
              <ProductGallery images={product.images || []} altText={product.name} />
            </div>

            {/* Left: Gallery & Policies */}
            <div className="w-full lg:w-5/12 p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-gray-100 bg-gray-50/30 order-2 lg:order-1">
              <div className="hidden lg:block">
                <ProductGallery images={product.images || []} altText={product.name} />
              </div>
              
              {/* Policies & Services */}
              <div className="mt-8 flex flex-col gap-6 bg-[#f8f9fa] p-5 rounded-2xl">
                <div>
                  <h3 className="font-bold text-gray-800 mb-4 text-[15px]">Chính sách bán hàng</h3>
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

                    <div className="flex items-start gap-2.5">
                      <RefreshCcw className="text-primary shrink-0 mt-0.5" size={18} />
                      <span className="text-[13px] text-gray-700 leading-snug">
                        Đổi trả chỉ trong 7 ngày
                      </span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <ShieldCheck className="text-primary shrink-0 mt-0.5" size={18} />
                      <span className="text-[13px] text-gray-700 leading-snug">
                        Bảo hành thiết bị từ 1 tới 12 tháng
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-gray-800 mb-4 text-[15px]">Dịch vụ khác</h3>
                  <div className="flex items-start gap-2.5">
                    <Settings className="text-primary shrink-0 mt-0.5" size={18} />
                    <span className="text-[13px] text-gray-700 leading-snug">
                      Gói dịch vụ bảo hành/ Sửa chữa tận nơi
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Info */}
            <div className="w-full lg:w-7/12 p-6 lg:p-10 flex flex-col order-1 lg:order-2">
              {product.condition && (
                <div className="mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-wider">
                    {product.condition}
                  </span>
                </div>
              )}

              <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 mb-3 md:mb-4 leading-tight tracking-tight">
                {product.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b border-gray-100 text-sm">
                <div className="flex items-center gap-1.5 text-gray-600">
                  <span className="text-gray-400">Thương hiệu:</span>
                  <span className="font-bold text-primary uppercase">{product.brand || "Đang cập nhật"}</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-gray-300 hidden sm:block"></div>
                <div className="flex items-center gap-1.5 text-gray-600">
                  <span className="text-gray-400">Tình trạng:</span>
                  <span className={`font-bold ${((product.stock ?? 0) > 0 && product.status !== 'out_of_stock') ? "text-emerald-600" : "text-red-500"}`}>
                    {((product.stock ?? 0) > 0 && product.status !== 'out_of_stock') ? "Còn hàng" : "Hết hàng"}
                  </span>
                </div>
                <div className="w-1 h-1 rounded-full bg-gray-300 hidden sm:block"></div>
                <div className="flex items-center gap-1.5 text-gray-600">
                  <span className="text-gray-400">SKU:</span>
                  <span className="font-mono font-medium">{product.sku || product.slug.split('-').pop()?.substring(0,6).toUpperCase()}</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-gray-300 hidden sm:block"></div>
                <div className="flex items-center gap-1.5 text-gray-600">
                  <Eye size={14} className="text-gray-400" />
                  <span className="font-bold text-gray-700">{(product.views || 0).toLocaleString('vi-VN')}</span>
                  <span className="text-gray-400 text-sm">lượt xem</span>
                </div>
              </div>

              {/* Specs Highlight */}
              {specArray.length > 0 && (
                <div className="mb-6 border border-gray-200 rounded-2xl overflow-hidden shadow-sm bg-white">
                  <div className="bg-gray-50/80 px-5 py-3 border-b border-gray-100 flex items-center gap-2">
                    <Zap size={18} className="text-primary" />
                    <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Cấu hình nổi bật</h3>
                  </div>
                  <div className="p-5 grid grid-cols-2 gap-x-6 gap-y-4">
                    {specArray.slice(0, 8).map(([key, value]) => (
                      <div key={key} className="flex flex-col gap-0.5">
                        <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">{key}</span>
                        <span className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug" title={String(value)}>{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Box */}
              <div className="relative bg-gradient-to-br from-primary/5 via-white to-orange-50/80 rounded-2xl p-6 lg:p-8 mb-6 border border-primary/20 shadow-[0_4px_20px_var(--primary-ring)] overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-6">
                  {((product.stock ?? 0) <= 0 || product.status === 'out_of_stock') ? (
                    <div>
                      <div className="text-4xl lg:text-5xl font-black text-gray-500 tracking-tight flex items-start uppercase">
                        HẾT HÀNG
                      </div>
                      <div className="text-sm font-bold text-gray-400 mt-2">Vui lòng liên hệ để nhận thông tin mới nhất</div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <div className="text-xs font-bold text-primary/80 uppercase tracking-wider mb-2">Giá ưu đãi đặc biệt</div>
                        <div className="text-4xl lg:text-5xl font-black text-primary tracking-tight flex items-start">
                          {product.price.toLocaleString("vi-VN")}
                          <span className="text-2xl lg:text-3xl font-bold ml-1 mt-1">₫</span>
                        </div>
                      </div>
                      {(product.discountPrice ?? 0) > 0 && (
                        <div className="pb-1.5 flex flex-col items-start">
                          <div className="text-lg text-gray-400 line-through font-semibold decoration-gray-300 decoration-2">
                            {(product.discountPrice || 0).toLocaleString("vi-VN")}₫
                          </div>
                          <div className="inline-flex items-center justify-center px-2.5 py-0.5 bg-primary/10 text-primary text-[11px] font-black uppercase rounded mt-1 shadow-sm border border-primary/20">
                            Giảm {Math.round((1 - product.price / (product.discountPrice || 1)) * 100)}%
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
                
                {(product.discountPrice ?? 0) > 0 && !((product.stock ?? 0) <= 0 || product.status === 'out_of_stock') && (
                  <div className="relative z-10 mt-6 pt-4 flex items-center gap-2 text-sm font-bold text-emerald-700 bg-emerald-50 border-t border-emerald-100 -mx-6 lg:-mx-8 -mb-6 lg:-mb-8 px-6 lg:px-8 py-3">
                    <CheckCircle2 size={18} className="text-emerald-500" />
                    <span>Tiết kiệm ngay {((product.discountPrice || 0) - product.price).toLocaleString("vi-VN")}₫ so với giá gốc!</span>
                  </div>
                )}
              </div>

              {/* Gift Box */}
              {product.gifts && product.gifts.length > 0 && (
                <div className="mb-8 border border-orange-200 rounded-2xl overflow-hidden bg-orange-50/30">
                  <div className="bg-orange-100/50 px-5 py-3 border-b border-orange-200 flex items-center gap-2">
                    <Gift size={18} className="text-orange-600" />
                    <h3 className="font-bold text-orange-800 text-sm uppercase tracking-wide">Khuyến mãi & Quà tặng kèm</h3>
                  </div>
                  <div className="p-5 flex flex-col gap-3 text-sm text-gray-700">
                    {product.gifts.map((gift, idx) => {
                      return (
                        <div key={idx} className="flex gap-3 items-start">
                          <CheckCircle2 size={16} className="text-orange-500 shrink-0 mt-0.5"/> 
                          <span>{gift}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-auto">
                <ProductActions
                  product={{
                    _id: product._id,
                    name: product.name,
                    price: product.price,
                    discountPrice: product.discountPrice,
                    image: product.images?.[0] || "",
                    stock: product.stock || 0,
                    specs: product.specs,
                    slug: product.slug,
                  }}
                />
              </div>

            </div>
          </div>
        </div>

        {/* Description & Sidebar */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Description */}
          <div className="lg:col-span-3 bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 lg:p-12">
            <h2 className="text-2xl font-black text-gray-900 mb-8 uppercase tracking-tight relative inline-block">
              Đặc điểm nổi bật
              <div className="absolute -bottom-3 left-0 w-1/2 h-1 bg-primary rounded-full"></div>
            </h2>
            <CollapsibleDescription content={cleanDescription} />
          </div>

          {/* Sidebar News */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sticky top-24">
              <h3 className="text-lg font-black text-gray-900 mb-6 uppercase tracking-tight relative inline-block">
                BÀI VIẾT - TIN TỨC
                <div className="absolute -bottom-2 left-0 w-1/2 h-1 bg-primary rounded-full"></div>
              </h3>
              <div className="space-y-4">
                {recentNews.length > 0 ? (
                  recentNews.map((article: any, index: number) => (
                    <Link href={`/tin-tuc/${article.slug}`} key={index} className="flex gap-3 group items-start">
                      <div className="w-24 h-16 rounded-lg overflow-hidden shrink-0 relative bg-gray-100 shadow-sm border border-gray-100">
                        <img 
                          src={article.thumbnail ? (article.thumbnail.startsWith('http') || article.thumbnail.startsWith('data:') ? article.thumbnail : `${API_BASE}${article.thumbnail}`) : 'https://via.placeholder.com/800x450?text=No+Image'} 
                          alt={article.title} 
                          className="w-full h-full object-cover p-2 rounded-xl group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-[12px] font-bold text-gray-800 line-clamp-3 group-hover:text-primary transition-colors leading-snug">
                          {article.title}
                        </h4>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">Đang cập nhật...</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-black text-gray-900 mb-8 uppercase tracking-tight relative inline-block">
              Sản phẩm tương tự
              <div className="absolute -bottom-3 left-0 w-1/2 h-1 bg-primary rounded-full"></div>
            </h2>
            <div className="flex overflow-x-auto gap-4 pb-6 snap-x hide-scrollbar scroll-smooth">
              {similarProducts.map((p) => {
                const isHotSaleActive = !!(p.isHotSale && p.flashSalePrice && p.flashSalePrice < p.price);
                const originalPrice = (p.discountPrice && p.discountPrice > p.price) ? p.discountPrice : p.price;
                const currentPrice = isHotSaleActive ? p.flashSalePrice! : p.price;
                const saveAmount = originalPrice - currentPrice;
                const discountPercent = originalPrice > currentPrice ? Math.round((saveAmount / originalPrice) * 100) : 0;
                const isOutOfStock = p.status === 'out_of_stock' || p.stock === 0;

                return (
                  <div
                    key={p._id}
                    className={`snap-start shrink-0 w-[170px] md:w-[280px] bg-white rounded-2xl border border-gray-100 overflow-hidden group shadow-md flex flex-col relative transition-all duration-500 ${isOutOfStock ? 'opacity-80' : 'hover:shadow-[0_8px_30px_var(--primary-ring)] hover:border-primary/50 hover:-translate-y-2'}`}
                  >
                    <Link href={`/${p.slug}`} className="absolute inset-0 z-20"></Link>
                    <div className="relative aspect-[4/3] flex items-center justify-center bg-white overflow-hidden">

                      {isOutOfStock && (
                        <div className="absolute inset-0 bg-white/60 z-30 flex items-center justify-center backdrop-blur-[1px]">
                          <div className="bg-gray-800/90 backdrop-blur-sm text-white font-black px-6 py-2 rounded-lg -rotate-12 shadow-2xl border border-gray-600/50 tracking-widest text-lg">
                            HẾT HÀNG
                          </div>
                        </div>
                      )}

                      {p.images?.[0] && (
                        <Image
                          src={p.images[0]}
                          alt={p.name}
                          fill
                          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                          className="object-cover p-2 rounded-xl group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500 relative z-10"
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
                            <Image src="/logo_broken.png" alt="ZCOMPUTER" width={20} height={20} className="w-4 h-4 object-contain" unoptimized />
                            <div className="flex items-baseline select-none tracking-tighter">
                              <span className="text-primary font-black text-[11px] drop-shadow-sm">Z</span>
                              <span className="text-slate-800 font-black text-[10px] uppercase drop-shadow-sm">COMPUTER</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Badges */}
                      <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5">
                        {p.isHotSale && (
                          <div className="shadow-lg rounded-md overflow-hidden transform -rotate-3 origin-top-left group-hover:rotate-0 transition-transform duration-300">
                            <div className="bg-primary text-white text-[10px] font-black px-2 py-1 text-center uppercase tracking-widest">
                              🔥 HOT SALE
                            </div>
                          </div>
                        )}
                        {saveAmount > 0 && (
                          <div className="shadow-lg rounded-md overflow-hidden transform -rotate-3 origin-top-left group-hover:rotate-0 transition-transform duration-300">
                            <div className="bg-primary text-white text-[10px] font-black px-2 py-1 text-center uppercase tracking-widest">
                              TIẾT KIỆM
                            </div>
                            <div className="bg-primary/80 text-white text-[12px] font-black px-2 py-1 text-center border-t border-white/20">
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
                    
                    <div className="p-3 md:p-5 flex flex-col flex-1 bg-white">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-[10px] md:text-[12px] font-extrabold text-gray-400 uppercase tracking-wider">{p.brand || "KHÁC"}</div>
                        <LikeButton product={p as any} />
                      </div>
                      <Link href={`/${p.slug}`} className="hover:text-primary transition-colors mb-2 md:mb-4 z-30 relative">
                        <h3 className="text-gray-800 text-[13px] md:text-[15px] font-medium leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-300">{p.name}</h3>
                      </Link>
                      
                      <div className="flex flex-col mt-auto mb-4">
                        {isOutOfStock ? (
                          <div className="h-full flex items-end">
                            <span className="text-[16px] md:text-[18px] font-black text-gray-500">LIÊN HỆ</span>
                          </div>
                        ) : saveAmount > 0 ? (
                          <>
                            <span className="text-gray-400 text-[12px] md:text-[13px] line-through mb-0.5 decoration-gray-300">{originalPrice.toLocaleString('vi-VN')}₫</span>
                            <div className="flex items-end gap-2">
                              <span className="text-[16px] md:text-[18px] font-black text-primary leading-none">{currentPrice.toLocaleString('vi-VN')}₫</span>
                              <span className="bg-primary/10 text-primary border border-primary/20 rounded text-[10px] md:text-[11px] font-bold px-1.5 py-[2px] leading-none">-{discountPercent}%</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="h-[18px] md:h-[20px] mb-0.5"></div>
                            <span className="text-[16px] md:text-[18px] font-black text-primary leading-none">{currentPrice.toLocaleString('vi-VN')}₫</span>
                          </>
                        )}
                      </div>

                      {p.specs && Object.keys(p.specs).length > 0 && (
                        <div className="hidden md:grid bg-[#f8f9fa] rounded-xl p-3.5 text-[11px] text-gray-600 grid-cols-2 gap-y-2.5 gap-x-3 mt-auto border border-gray-100">
                          {(() => {
                            const entries = Object.entries(p.specs).filter(([_, v]) => v && String(v).trim() !== '').slice(0, 5);
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
                              
                              const isOddTotalAndLast = entries.length % 2 !== 0 && index === entries.length - 1;
                              return (
                                <div key={key} className={`flex items-center gap-2 truncate ${isOddTotalAndLast ? 'col-span-2' : ''}`} title={`${key}: ${value}`}>
                                  <Icon size={14} className="text-gray-400 shrink-0"/> 
                                  <span className="truncate font-medium">{value as string}</span>
                                </div>
                              );
                            });
                          })()}
                        </div>
                      )}

                      <div className="mt-4 mb-1 flex justify-center text-gray-400 text-[11px] md:text-[12px] items-center gap-1.5 font-medium">
                        <Eye size={14} /> {(p.views || 0).toLocaleString('vi-VN')} lượt xem
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
