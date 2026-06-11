"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Image as ImageIcon, Box, Tag, DollarSign, FileText, UploadCloud, Loader2, X, Gift, Cpu } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { fetchApi } from "@/lib/api";

interface Category {
  _id: string;
  name: string;
}

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Upload State
  const [uploadingImage, setUploadingImage] = useState(false);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    price: "",
    discountPrice: "",
    stock: "",
    sku: "",
    description: "",
    images: [] as string[],
    gifts: [] as string[],
    category_id: "",
    condition: "Đã qua sử dụng (Đẹp 99%)",
    isHotSale: false,
    specs: { cpu: "", ram: "", storage: "", vga: "", screen: "" }
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetchApi("/categories");
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetchApi(`/products`);
        const data = await res.json();
        const productFromList = data.find((p: any) => p._id === resolvedParams.id);
        
        if (productFromList) {
          const detailRes = await fetchApi(`/products/${productFromList.slug}`);
          if (detailRes.ok) {
            const product = await detailRes.json();
            setFormData({
              name: product.name || "",
              brand: product.brand || "",
              price: product.price?.toString() || "",
              discountPrice: product.discountPrice?.toString() || "",
              stock: product.stock?.toString() || "",
              sku: product.sku || "",
              description: product.description || "",
              images: product.images || [],
              gifts: product.gifts || [],
              category_id: product.category_id?._id || product.category_id || "",
              condition: product.condition || "Đã qua sử dụng (Đẹp 99%)",
              isHotSale: product.isHotSale || false,
              specs: {
                cpu: product.specs?.cpu || "",
                ram: product.specs?.ram || "",
                storage: product.specs?.storage || "",
                vga: product.specs?.vga || "",
                screen: product.specs?.screen || ""
              }
            });
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setFetching(false);
      }
    };
    fetchProduct();
  }, [resolvedParams.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadingImage(true);
    
    try {
      const uploadedUrls: string[] = [];
      for (const file of files) {
        const formDataObj = new FormData();
        formDataObj.append("image", file);
        
        const res = await fetchApi("/upload/image", {
          method: "POST",
          body: formDataObj,
        });

        const data = await res.json();
        if (res.ok) {
          const fullUrl = data.url.startsWith("http") ? data.url : `http://127.0.0.1:5000${data.url}`;
          uploadedUrls.push(fullUrl);
        } else {
          toast.error(`Lỗi tải ảnh: ${data.message}`);
        }
      }
      
      if (uploadedUrls.length > 0) {
        setFormData((prev) => ({ ...prev, images: [...prev.images, ...uploadedUrls] }));
        toast.success(`Đã tải lên ${uploadedUrls.length} ảnh!`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Đã xảy ra lỗi khi tải ảnh lên.");
    } finally {
      setUploadingImage(false);
      e.target.value = ""; // Reset input
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleDrop = (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === targetIdx) return;
    
    const newImages = [...formData.images];
    const [draggedImage] = newImages.splice(draggedIdx, 1);
    newImages.splice(targetIdx, 0, draggedImage);
    
    setFormData(prev => ({ ...prev, images: newImages }));
    setDraggedIdx(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category_id) {
      toast.error("Vui lòng chọn danh mục cho sản phẩm!");
      return;
    }
    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        brand: formData.brand,
        price: Number(formData.price) || 0,
        discountPrice: Number(formData.discountPrice) || 0,
        stock: Number(formData.stock) || 0,
        sku: formData.sku,
        description: formData.description,
        images: formData.images,
        gifts: formData.gifts.filter(g => g.trim() !== ""),
        category_id: formData.category_id,
        condition: formData.condition,
        isHotSale: formData.isHotSale,
        specs: formData.specs
      };

      const res = await fetchApi(`/products/${resolvedParams.id}`, {
        method: "PUT",
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success("Cập nhật sản phẩm thành công!");
        router.push("/admin/products");
      } else {
        const error = await res.json();
        toast.error(`Lỗi: ${error.message}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Đã xảy ra lỗi hệ thống.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="p-2.5 bg-white shadow-sm border border-gray-200 hover:bg-gray-50 rounded-xl transition-all">
            <ArrowLeft size={20} className="text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Cập nhật sản phẩm</h1>
            <p className="text-sm font-medium text-gray-500 mt-1">Chỉnh sửa thông tin chi tiết của sản phẩm</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        {/* Cột trái: Thông tin chính */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* Card: Thông tin cơ bản */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <FileText size={18} />
              </div>
              <h2 className="text-lg font-bold text-gray-800">Thông tin cơ bản</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Tên sản phẩm <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  name="name" 
                  required 
                  value={formData.name} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-gray-800 font-medium placeholder:font-normal"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Thương hiệu</label>
                  <input 
                    type="text" 
                    name="brand" 
                    value={formData.brand} 
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-gray-800 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Tình trạng máy <span className="text-red-500">*</span></label>
                  <select 
                    name="condition"
                    value={formData.condition} 
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-gray-800 font-medium"
                  >
                    <option value="Đã qua sử dụng (Đẹp 99%)">Đã qua sử dụng (Đẹp 99%)</option>
                    <option value="Mới 100%">Mới 100%</option>
                    <option value="Trưng bày">Trưng bày</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-3 cursor-pointer mt-8">
                    <div className="relative flex items-center">
                      <input 
                        type="checkbox" 
                        name="isHotSale"
                        checked={formData.isHotSale}
                        onChange={(e) => setFormData({...formData, isHotSale: e.target.checked})}
                        className="w-5 h-5 border-2 border-gray-300 rounded text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600 transition-all"
                      />
                    </div>
                    <span className="text-sm font-bold text-gray-700">Hiển thị trong mục HOT SALE MỖI NGÀY</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Mô tả & Cấu hình</label>
                <textarea 
                  name="description" 
                  rows={8} 
                  value={formData.description} 
                  onChange={handleChange}
                  className="w-full px-4 py-4 bg-gray-50/50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-gray-800 leading-relaxed resize-y"
                />
              </div>
            </div>
          </div>

          {/* Card: Giá và Tồn kho */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                <DollarSign size={18} />
              </div>
              <h2 className="text-lg font-bold text-gray-800">Định giá & Tồn kho</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Giá bán (VNĐ) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input 
                    type="number" 
                    name="price" 
                    required 
                    value={formData.price} 
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full pl-4 pr-12 py-3 bg-gray-50/50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all text-gray-800 font-bold text-lg"
                    placeholder="0"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">đ</span>
                </div>
                {formData.price && (
                  <p className="text-xs text-emerald-600 font-medium mt-2 ml-1">
                    Sẽ hiển thị: {Number(formData.price).toLocaleString('vi-VN')} đ
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Giá niêm yết (Gốc)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    name="discountPrice" 
                    value={formData.discountPrice} 
                    onChange={(e) => setFormData({...formData, discountPrice: e.target.value})}
                    className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full pl-4 pr-12 py-3 bg-gray-50/50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all text-gray-500 font-medium"
                    placeholder="0"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">đ</span>
                </div>
                {formData.discountPrice && (
                  <p className="text-xs text-gray-500 font-medium mt-2 ml-1">
                    Sẽ hiển thị: {Number(formData.discountPrice).toLocaleString('vi-VN')} đ
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Số lượng tồn kho <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Box size={18} />
                  </div>
                  <input 
                    type="number" 
                    name="stock" 
                    required
                    value={formData.stock} 
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-gray-800 font-medium"
                    placeholder="VD: 10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Mã SKU</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Tag size={18} />
                  </div>
                  <input 
                    type="text" 
                    name="sku" 
                    value={formData.sku} 
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-gray-800 font-mono uppercase"
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Card: Thông số kỹ thuật */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Cpu size={18} />
              </div>
              <h2 className="text-lg font-bold text-gray-800">Thông số kỹ thuật (Tùy chọn)</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">CPU</label>
                <input 
                  type="text" 
                  value={formData.specs.cpu} 
                  onChange={(e) => setFormData({...formData, specs: {...formData.specs, cpu: e.target.value}})}
                  className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-gray-800 text-sm"
                  placeholder="VD: Intel Core i7 13700H"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">RAM</label>
                <input 
                  type="text" 
                  value={formData.specs.ram} 
                  onChange={(e) => setFormData({...formData, specs: {...formData.specs, ram: e.target.value}})}
                  className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-gray-800 text-sm"
                  placeholder="VD: 16GB DDR5"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Ổ cứng (Storage)</label>
                <input 
                  type="text" 
                  value={formData.specs.storage} 
                  onChange={(e) => setFormData({...formData, specs: {...formData.specs, storage: e.target.value}})}
                  className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-gray-800 text-sm"
                  placeholder="VD: 512GB SSD NVMe"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Card đồ họa (VGA)</label>
                <input 
                  type="text" 
                  value={formData.specs.vga} 
                  onChange={(e) => setFormData({...formData, specs: {...formData.specs, vga: e.target.value}})}
                  className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-gray-800 text-sm"
                  placeholder="VD: RTX 4060 8GB"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">Màn hình (Screen)</label>
                <input 
                  type="text" 
                  value={formData.specs.screen} 
                  onChange={(e) => setFormData({...formData, specs: {...formData.specs, screen: e.target.value}})}
                  className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-gray-800 text-sm"
                  placeholder="VD: 16 inch WQXGA 165Hz"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Cột phải: Hình ảnh, Phân loại, Publish */}
        <div className="space-y-8">
          
          {/* Card: Phân loại */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-base font-bold text-gray-800 mb-5">Phân loại sản phẩm</h2>
            
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">Danh mục <span className="text-red-500">*</span></label>
              <select 
                name="category_id"
                required
                value={formData.category_id}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-gray-800 cursor-pointer"
              >
                {categories.length === 0 && <option value="">Đang tải danh mục...</option>}
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Card: Hình ảnh */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                  <ImageIcon size={16} />
                </div>
                <h2 className="text-base font-bold text-gray-800">Hình ảnh ({formData.images.length})</h2>
              </div>
            </div>
            
            <div className="space-y-4">
              {/* Lưới hình ảnh đã tải lên */}
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {formData.images.map((imgUrl, idx) => (
                    <div 
                      key={idx} 
                      draggable
                      onDragStart={() => setDraggedIdx(idx)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => handleDrop(e, idx)}
                      className={`relative aspect-[4/3] rounded-xl border ${draggedIdx === idx ? 'border-primary opacity-50' : 'border-gray-200'} bg-gray-50 overflow-hidden group cursor-grab active:cursor-grabbing`}
                    >
                      <img src={imgUrl} alt={`Preview ${idx}`} className="w-full h-full object-contain p-2 pointer-events-none" />
                      <button 
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-2 right-2 bg-white text-red-500 p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Nút tải ảnh lên */}
              <label 
                htmlFor="image-upload"
                className={`w-full rounded-xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-all cursor-pointer hover:bg-orange-50/50 group relative ${
                  formData.images.length === 0 ? "border-gray-300 bg-gray-50/50 text-gray-400 aspect-[4/3]" : "border-orange-200 bg-orange-50/30 text-orange-500 py-6"
                }`}
              >
                {uploadingImage ? (
                  <div className="flex flex-col items-center justify-center text-orange-500">
                    <Loader2 size={32} className="animate-spin mb-2" />
                    <span className="text-sm font-bold">Đang tải lên...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center group-hover:text-orange-500 transition-colors">
                    <UploadCloud size={32} className="mb-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                    <span className="text-sm font-bold mb-1">
                      {formData.images.length === 0 ? "Click để tải ảnh lên" : "Tải thêm ảnh"}
                    </span>
                    <span className="text-xs text-gray-400">Chọn nhiều ảnh cùng lúc (Max 5MB/ảnh)</span>
                  </div>
                )}
                <input 
                  id="image-upload" 
                  type="file" 
                  multiple
                  accept="image/jpeg, image/png, image/webp" 
                  className="hidden" 
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                />
              </label>
              
              <div className="flex gap-2">
                <input 
                  type="text" 
                  id="img-url-input"
                  className="flex-1 px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all text-sm font-medium text-gray-600"
                  placeholder="Hoặc dán link ảnh từ web khác"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const val = (e.target as HTMLInputElement).value.trim();
                      if (val) {
                        setFormData(prev => ({ ...prev, images: [...prev.images, val] }));
                        (e.target as HTMLInputElement).value = '';
                      }
                    }
                  }}
                />
                <button 
                  type="button"
                  className="px-4 bg-orange-100 text-orange-600 font-bold rounded-xl hover:bg-orange-200 transition-colors shrink-0 text-sm"
                  onClick={() => {
                    const input = document.getElementById('img-url-input') as HTMLInputElement;
                    if (input && input.value.trim()) {
                      setFormData(prev => ({ ...prev, images: [...prev.images, input.value.trim()] }));
                      input.value = '';
                    }
                  }}
                >
                  Thêm
                </button>
              </div>
            </div>
          </div>

          {/* Card: Quà tặng */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                  <Gift size={16} />
                </div>
                <h2 className="text-base font-bold text-gray-800">Quà tặng kèm ({formData.gifts.length})</h2>
              </div>
            </div>
            
            <div className="space-y-3">
              {formData.gifts.map((gift, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={gift}
                    onChange={(e) => {
                      const newGifts = [...formData.gifts];
                      newGifts[idx] = e.target.value;
                      setFormData(prev => ({ ...prev, gifts: newGifts }));
                    }}
                    className="flex-1 px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-xl outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 text-sm font-medium"
                    placeholder="VD: Tặng chuột không dây trị giá 250k"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, gifts: prev.gifts.filter((_, i) => i !== idx) }));
                    }}
                    className="px-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors shrink-0"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, gifts: [...prev.gifts, ""] }))}
                className="w-full py-2.5 border-2 border-dashed border-gray-200 text-gray-500 hover:border-orange-300 hover:text-orange-500 rounded-xl text-sm font-bold transition-colors"
              >
                + Thêm phần quà mới
              </button>
            </div>
          </div>

          {/* Hành động */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-3">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary hover:bg-red-700 text-white px-6 py-3.5 rounded-xl font-bold shadow-lg shadow-red-500/30 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? "Đang xử lý..." : "Lưu thay đổi"}
            </button>
            <Link 
              href="/admin/products"
              className="w-full flex items-center justify-center bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 px-6 py-3 rounded-xl font-bold transition-all"
            >
              Hủy bỏ
            </Link>
          </div>

        </div>
      </form>
    </div>
  );
}
