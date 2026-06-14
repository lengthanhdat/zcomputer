import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ProductActions from "@/components/ProductActions";
import ProductGallery from "@/components/ProductGallery";
import ViewIncrementer from "@/components/ViewIncrementer";
import { CheckCircle2, ShieldCheck, Truck, Zap, Gift, ArrowRight, RefreshCcw, Settings, Eye } from "lucide-react";

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
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:5000";

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
    
    // Nếu không có sản phẩm cùng danh mục, lấy đại các sản phẩm khác (fallback)
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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.slug);

  if (!product) {
    return {
      title: "Không tìm thấy sản phẩm - ZCOMPUTER",
      description: "Sản phẩm bạn tìm kiếm không tồn tại hoặc đã bị xóa.",
    };
  }

  const plainTextDescription = product.description 
    ? product.description.replace(/<[^>]+>/g, '').substring(0, 160) + '...'
    : `Mua ${product.name} chính hãng tại ZCOMPUTER với giá tốt nhất, bảo hành uy tín.`;

  return {
    title: `${product.name} | ZCOMPUTER`,
    description: plainTextDescription,
    openGraph: {
      title: product.name,
      description: plainTextDescription,
      images: product.images?.[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.slug);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Không tìm thấy sản phẩm</h1>
        <Link href="/" className="text-primary font-bold hover:underline">Quay về trang chủ</Link>
      </div>
    );
  }

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
  const similarProducts = await getSimilarProducts(categoryId as string | null, product._id);

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-20">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 py-3">
        <div className="container mx-auto px-4 text-sm text-gray-500 flex gap-2 items-center">
          <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
          <span>/</span>
          <Link href={`/category/${product.category_id?.slug || "all"}`} className="hover:text-primary transition-colors uppercase">
            {product.category_id?.name || "Sản phẩm"}
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-bold truncate max-w-[200px] sm:max-w-md">{product.name}</span>
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
                      <Truck className="text-red-600 shrink-0 mt-0.5" size={18} />
                      <span className="text-[13px] text-gray-700 leading-snug">
                        Miễn phí giao hàng cho đơn hàng từ 5 triệu
                      </span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <RefreshCcw className="text-red-600 shrink-0 mt-0.5" size={18} />
                      <span className="text-[13px] text-gray-700 leading-snug">
                        Đổi trả chỉ trong 7 ngày
                      </span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <ShieldCheck className="text-red-600 shrink-0 mt-0.5" size={18} />
                      <span className="text-[13px] text-gray-700 leading-snug">
                        Bảo hành thiết bị từ 1 tới 12 tháng
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-gray-800 mb-4 text-[15px]">Dịch vụ khác</h3>
                  <div className="flex items-start gap-2.5">
                    <Settings className="text-red-600 shrink-0 mt-0.5" size={18} />
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

              <h1 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4 leading-tight tracking-tight">
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
              <div className="relative bg-gradient-to-br from-red-50/80 via-white to-orange-50/80 rounded-2xl p-6 lg:p-8 mb-6 border border-red-100 shadow-[0_4px_20px_rgb(239,68,68,0.05)] overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-red-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
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
                        <div className="text-xs font-bold text-red-500/80 uppercase tracking-wider mb-2">Giá ưu đãi đặc biệt</div>
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
                          <div className="inline-flex items-center justify-center px-2.5 py-0.5 bg-red-100 text-red-600 text-[11px] font-black uppercase rounded mt-1 shadow-sm border border-red-200/50">
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
                      // Nếu muốn highlight các chữ Tặng, Miễn phí... như trước
                      const isHighlight = gift.startsWith("Tặng") || gift.startsWith("Miễn phí");
                      const firstSpace = gift.indexOf(' ', gift.indexOf(' ') + 1); // Tìm vị trí khoảng trắng thứ 2 hoặc 3
                      
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
                  }}
                />
              </div>

            </div>
          </div>
        </div>

        {/* Description */}
        {cleanDescription && (
          <div className="mt-8 bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 lg:p-12">
            <h2 className="text-2xl font-black text-gray-900 mb-8 uppercase tracking-tight relative inline-block">
              Đặc điểm nổi bật
              <div className="absolute -bottom-3 left-0 w-1/2 h-1 bg-primary rounded-full"></div>
            </h2>
            <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed prose-headings:text-gray-900 prose-a:text-primary hover:prose-a:text-red-700 prose-img:rounded-xl prose-img:shadow-md">
              {cleanDescription.split('\n').map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
            </div>
          </div>
        )}

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-black text-gray-900 mb-8 uppercase tracking-tight relative inline-block">
              Sản phẩm tương tự
              <div className="absolute -bottom-3 left-0 w-1/2 h-1 bg-primary rounded-full"></div>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProducts.map((p) => (
                <div
                  key={p._id}
                  className="bg-white rounded-xl border border-gray-100 overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-primary/30 transition-all duration-300 flex flex-col h-full"
                >
                  <div className="relative aspect-[4/3] p-6 flex items-center justify-center bg-gray-50">
                    <Link href={`/product/${p.slug}`} className="absolute inset-0 z-10"></Link>
                    {p.images?.[0] && (
                      <Image
                        src={p.images[0]}
                        alt={p.name}
                        fill
                        sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                        className="object-contain p-6 mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                        unoptimized
                      />
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    {p.condition && (
                      <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200 w-fit mb-2.5 uppercase tracking-wide">
                        {p.condition}
                      </span>
                    )}
                    <Link href={`/product/${p.slug}`} className="font-bold text-gray-800 text-sm mb-3 line-clamp-2 leading-relaxed group-hover:text-primary transition-colors">
                      {p.name}
                    </Link>
                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-end justify-between">
                      <div>
                        <div className="text-xl font-black text-primary">{p.price?.toLocaleString("vi-VN")}đ</div>
                        {(p.discountPrice ?? 0) > 0 && (
                          <div className="text-xs font-medium text-gray-400 line-through mt-1">
                            {(p.discountPrice || 0).toLocaleString("vi-VN")}đ
                          </div>
                        )}
                      </div>
                      <Link
                        href={`/product/${p.slug}`}
                        className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors"
                        aria-label={`Xem ${p.name}`}
                      >
                        <ArrowRight size={18} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
