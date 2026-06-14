"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles, X, Image as ImageIcon, Box, Tag, DollarSign, FileText, UploadCloud, Loader2, Gift, Cpu, Trash2, Save } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";

import { fetchApi } from "@/lib/api";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

const SPEC_CONFIGS: Record<string, { key: string, label: string, placeholder: string }[]> = {
  'laptop': [
    { key: 'CPU', label: 'CPU', placeholder: 'VD: Intel Core i5 8350U' },
    { key: 'RAM', label: 'RAM', placeholder: 'VD: 8GB DDR4' },
    { key: 'Storage', label: 'Ổ cứng (Storage)', placeholder: 'VD: 256GB SSD' },
    { key: 'VGA', label: 'Card màn hình (VGA)', placeholder: 'VD: Intel UHD Graphics' },
    { key: 'Screen', label: 'Màn hình (Screen)', placeholder: 'VD: 14 inch FHD' },
    { key: 'Battery', label: 'Pin (Battery)', placeholder: 'VD: 4 Cell 60Whr' }
  ],
  'pc-gaming': [
    { key: 'CPU', label: 'CPU', placeholder: 'VD: Intel Core i5 10400F' },
    { key: 'RAM', label: 'RAM', placeholder: 'VD: 16GB DDR4' },
    { key: 'Storage', label: 'Ổ cứng (Storage)', placeholder: 'VD: 512GB SSD NVMe' },
    { key: 'VGA', label: 'Card màn hình (VGA)', placeholder: 'VD: GTX 1660 Super 6GB' },
    { key: 'Mainboard', label: 'Mainboard', placeholder: 'VD: B460M' },
    { key: 'PSU', label: 'Nguồn (PSU)', placeholder: 'VD: 550W 80 Plus Bronze' }
  ],
  'man-hinh': [
    { key: 'Size', label: 'Kích thước', placeholder: 'VD: 24 inch' },
    { key: 'Panel', label: 'Tấm nền', placeholder: 'VD: IPS' },
    { key: 'Resolution', label: 'Độ phân giải', placeholder: 'VD: Full HD (1920x1080)' },
    { key: 'RefreshRate', label: 'Tần số quét', placeholder: 'VD: 144Hz' }
  ],
  'ban-phim': [
    { key: 'Switch', label: 'Loại Switch', placeholder: 'VD: Blue Switch' },
    { key: 'Keycap', label: 'Loại Keycap', placeholder: 'VD: PBT Double-shot' },
    { key: 'Size', label: 'Kích thước', placeholder: 'VD: Tenkeyless (87 keys)' },
    { key: 'Connection', label: 'Kết nối', placeholder: 'VD: USB / Bluetooth' }
  ],
  'chuot': [
    { key: 'Sensor', label: 'Cảm biến', placeholder: 'VD: Quang học' },
    { key: 'DPI', label: 'Chỉ số DPI', placeholder: 'VD: 200 - 8000 DPI' },
    { key: 'LED', label: 'Loại LED', placeholder: 'VD: RGB 16.8 triệu màu' },
    { key: 'Connection', label: 'Kết nối', placeholder: 'VD: Wireless 2.4GHz' }
  ],
  'tai-nghe': [
    { key: 'Driver', label: 'Củ loa (Driver)', placeholder: 'VD: 50mm' },
    { key: 'Frequency', label: 'Tần số phản hồi', placeholder: 'VD: 20Hz - 20kHz' },
    { key: 'Microphone', label: 'Microphone', placeholder: 'VD: Có chống ồn' },
    { key: 'Connection', label: 'Kết nối', placeholder: 'VD: Jack 3.5mm / USB' }
  ],
  'linh-kien-pc': [
    { key: 'Chipset', label: 'Chipset / Loại', placeholder: 'VD: GeForce GTX 1660' },
    { key: 'Memory', label: 'Bộ nhớ / Dung lượng', placeholder: 'VD: 6GB GDDR6' },
    { key: 'Bus', label: 'Băng thông / Bus', placeholder: 'VD: 192-bit' },
    { key: 'Power', label: 'Công suất', placeholder: 'VD: 65W' }
  ]
};

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Smart Paste State
  const [showSmartModal, setShowSmartModal] = useState(false);
  const [smartText, setSmartText] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [bulkPreviewData, setBulkPreviewData] = useState<any[]>([]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSavingBulk, setIsSavingBulk] = useState(false);
  
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
    specs: {} as Record<string, string>
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetchApi("/categories");
        const data = await res.json();
        setCategories(data);
        if (data.length > 0) {
          setFormData((prev) => ({ ...prev, category_id: data[0]._id }));
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, category_id: e.target.value, specs: {} });
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
          const fullUrl = data.url.startsWith("http") ? data.url : `${data.url}`;
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
        const textData = data.map(row => (row as any[]).join(" | ")).join("\n");
        setSmartText(prev => prev + (prev ? "\n" : "") + textData);
        toast.success("Đã nạp dữ liệu từ file Excel. Vui lòng bấm Trích xuất!");
      } catch (err) {
        toast.error("Không thể đọc file Excel này");
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = "";
  };

  const handleSmartExtract = async () => {
    if (!smartText.trim()) {
      toast.error("Vui lòng dán nội dung cấu hình vào ô trống hoặc tải file Excel lên");
      return;
    }
    
    setExtracting(true);
    try {
      // Gọi trực tiếp backend để tránh timeout 30s của Next.js Proxy
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      const res = await fetchApi(`${API_BASE}/api/products/smart-extract-bulk`, {
        method: "POST",
        body: JSON.stringify({ text: smartText })
      });
      
      const dataArray = await res.json();
      
      if (res.ok && Array.isArray(dataArray) && dataArray.length > 0) {
        if (dataArray.length === 1) {
          const data = dataArray[0];
          toast.success("Trích xuất thông minh thành công!");
          
          const mappedSpecs: Record<string, string> = data.specs ? {
            CPU: data.specs.cpu || '',
            RAM: data.specs.ram || '',
            Storage: data.specs.storage || '',
            VGA: data.specs.vga || '',
            Screen: data.specs.screen || ''
          } : {};
          
          setFormData((prev) => ({
            ...prev,
            name: data.name || prev.name,
            price: data.price ? data.price.toString() : prev.price,
            brand: data.brand || prev.brand,
            condition: data.condition || prev.condition,
            description: prev.description, // Dữ liệu cũ giữ nguyên
            specs: { ...prev.specs, ...mappedSpecs }
          }));
          
          setShowSmartModal(false);
          setSmartText("");
        } else {
          toast.success(`Tìm thấy ${dataArray.length} sản phẩm. Vui lòng kiểm tra lại trước khi lưu.`);
          
          const mappedData = dataArray.map((data: any) => {
            const mappedSpecs: Record<string, string> = data.specs ? {
              CPU: data.specs.cpu || '',
              RAM: data.specs.ram || '',
              Storage: data.specs.storage || '',
              VGA: data.specs.vga || '',
              Screen: data.specs.screen || ''
            } : {};
            
            let matchedCategory = formData.category_id;
            if (data.category_name) {
              const found = categories.find(c => 
                c.name.toLowerCase().includes(data.category_name.toLowerCase()) || 
                data.category_name.toLowerCase().includes(c.name.toLowerCase())
              );
              if (found) matchedCategory = found._id;
            }
            
            return {
              name: data.name || "Sản phẩm mới",
              brand: data.brand || "",
              price: Number(data.price) || 0,
              discountPrice: 0,
              stock: 10,
              sku: "",
              description: "Đang cập nhật...",
              images: [],
              gifts: [],
              category_id: matchedCategory,
              condition: data.condition || formData.condition,
              isHotSale: false,
              specs: mappedSpecs
            };
          });
          
          setBulkPreviewData(mappedData);
          setIsPreviewMode(true);
          setShowSmartModal(false);
          setSmartText("");
        }
      } else {
        toast.error(`Lỗi trích xuất: ${dataArray.message || 'Không tìm thấy sản phẩm nào'}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Không thể kết nối đến AI");
    } finally {
      setExtracting(false);
    }
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

      const res = await fetchApi("/products", {
        method: "POST",
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success("Thêm sản phẩm thành công!");
        router.push("/admin/products");
      } else {
        const errorData = await res.json();
        const errorMsg = errorData.error?.message || errorData.message || "Lỗi không xác định";
        toast.error(`Lỗi: ${errorMsg}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Đã xảy ra lỗi hệ thống.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBulk = async () => {
    if (bulkPreviewData.some(item => !item.category_id)) {
      toast.error("Lỗi: Không xác định được Danh mục cho sản phẩm. Vui lòng thử lại!");
      setIsSavingBulk(false);
      return;
    }

    setIsSavingBulk(true);
    let successCount = 0;
    let lastError = "";
    
    for (const item of bulkPreviewData) {
      try {
        const resCreate = await fetchApi("/products", { 
          method: "POST", 
          body: JSON.stringify(item) 
        });
        if (resCreate.ok) {
          successCount++;
        } else {
          const errData = await resCreate.json();
          lastError = errData.message || errData.error?.message || "Lỗi tạo SP";
          console.error("Lỗi tạo SP:", errData);
        }
      } catch (err: any) {
        lastError = err.message || "Lỗi mạng";
        console.error("Lỗi tạo SP:", err);
      }
    }
    
    setIsSavingBulk(false);
    if (successCount === bulkPreviewData.length) {
      toast.success(`Đã lưu thành công ${successCount}/${bulkPreviewData.length} sản phẩm!`);
      setIsPreviewMode(false);
      setBulkPreviewData([]);
      router.push('/admin/products');
    } else {
      toast.error(`Lưu thất bại. Đã lưu ${successCount}/${bulkPreviewData.length}. Lỗi: ${lastError}`);
    }
  };

  const updatePreviewItem = (index: number, field: string, value: any) => {
    const newData = [...bulkPreviewData];
    newData[index] = { ...newData[index], [field]: value };
    setBulkPreviewData(newData);
  };

  const removePreviewItem = (index: number) => {
    const newData = bulkPreviewData.filter((_, i) => i !== index);
    setBulkPreviewData(newData);
    if (newData.length === 0) {
      setIsPreviewMode(false);
    }
  };

  if (isPreviewMode) {
    return (
      <div className="pb-12 max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsPreviewMode(false)}
              className="p-2.5 bg-white shadow-sm border border-gray-200 hover:bg-gray-50 rounded-xl transition-all"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">Duyệt sản phẩm trích xuất ({bulkPreviewData.length})</h1>
              <p className="text-sm font-medium text-gray-500 mt-1">Kiểm tra và chỉnh sửa thông tin trước khi lưu</p>
            </div>
          </div>
          <button
            onClick={handleSaveBulk}
            disabled={isSavingBulk || bulkPreviewData.length === 0}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl shadow-sm transition-all shadow-blue-600/20"
          >
            {isSavingBulk ? (
              <><Loader2 size={18} className="animate-spin" /> Đang lưu...</>
            ) : (
              <><Save size={18} /> Lưu tất cả</>
            )}
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50/80 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">Tên Sản Phẩm</th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap w-48">Danh Mục</th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap w-48">Thương Hiệu</th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap w-48">Giá Bán</th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap min-w-[300px]">Cấu hình (CPU / RAM / SSD / VGA)</th>
                  <th className="px-4 py-3 font-semibold text-center w-20">Xóa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bulkPreviewData.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <input 
                        type="text" 
                        value={item.name} 
                        onChange={(e) => updatePreviewItem(idx, 'name', e.target.value)}
                        className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <select 
                        value={item.category_id} 
                        onChange={(e) => updatePreviewItem(idx, 'category_id', e.target.value)}
                        className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm bg-white"
                      >
                        <option value="">Chọn danh mục</option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <input 
                        type="text" 
                        value={item.brand} 
                        onChange={(e) => updatePreviewItem(idx, 'brand', e.target.value)}
                        className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input 
                        type="number" 
                        value={item.price || ''} 
                        onChange={(e) => updatePreviewItem(idx, 'price', Number(e.target.value))}
                        className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1 text-xs text-gray-600">
                        <input type="text" value={item.specs.CPU || ''} onChange={(e) => {
                          const newSpecs = {...item.specs, CPU: e.target.value};
                          updatePreviewItem(idx, 'specs', newSpecs);
                        }} className="w-full px-2 py-1 border border-gray-100 rounded bg-gray-50 focus:bg-white focus:border-blue-300" placeholder="CPU..." title="CPU" />
                        <input type="text" value={item.specs.RAM || ''} onChange={(e) => {
                          const newSpecs = {...item.specs, RAM: e.target.value};
                          updatePreviewItem(idx, 'specs', newSpecs);
                        }} className="w-full px-2 py-1 border border-gray-100 rounded bg-gray-50 focus:bg-white focus:border-blue-300" placeholder="RAM..." title="RAM" />
                        <input type="text" value={item.specs.Storage || ''} onChange={(e) => {
                          const newSpecs = {...item.specs, Storage: e.target.value};
                          updatePreviewItem(idx, 'specs', newSpecs);
                        }} className="w-full px-2 py-1 border border-gray-100 rounded bg-gray-50 focus:bg-white focus:border-blue-300" placeholder="Storage..." title="Storage" />
                        <input type="text" value={item.specs.VGA || ''} onChange={(e) => {
                          const newSpecs = {...item.specs, VGA: e.target.value};
                          updatePreviewItem(idx, 'specs', newSpecs);
                        }} className="w-full px-2 py-1 border border-gray-100 rounded bg-gray-50 focus:bg-white focus:border-blue-300" placeholder="VGA..." title="VGA" />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button 
                        onClick={() => removePreviewItem(idx)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa sản phẩm này"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
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
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Thêm sản phẩm mới</h1>
            <p className="text-sm font-medium text-gray-500 mt-1">Tạo mới và công khai sản phẩm lên cửa hàng</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowSmartModal(true)}
          type="button"
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-purple-500/30 transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          <Sparkles size={18} />
          Dán cấu hình AI
        </button>
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
                  placeholder="VD: Laptop Dell Latitude 7490 Core i5..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Thương hiệu <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    name="brand" 
                    required
                    value={formData.brand} 
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-gray-800 font-medium"
                    placeholder="VD: Dell, ASUS, Apple..."
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
                <label className="block text-sm font-bold text-gray-700 mb-2">Mô tả & Cấu hình <span className="text-red-500">*</span></label>
                <textarea 
                  name="description" 
                  rows={8} 
                  required
                  value={formData.description} 
                  onChange={handleChange}
                  className="w-full px-4 py-4 bg-gray-50/50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-gray-800 leading-relaxed resize-y"
                  placeholder="Nhập thông số kỹ thuật và bài viết mô tả sản phẩm..."
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
                    placeholder="VD: DELL-7490-01"
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
            
            {/* Form Specs dựa theo Config */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(() => {
                const currentCategory = categories.find(c => c._id === formData.category_id);
                const currentSlug = currentCategory?.slug || '';
                let currentFields = SPEC_CONFIGS[currentSlug] || [];
                
                if (currentFields.length === 0 && currentCategory) {
                  const nameStr = currentCategory.name.toLowerCase();
                  if (nameStr.includes('laptop')) currentFields = SPEC_CONFIGS['laptop'];
                  else if (nameStr.includes('pc') || nameStr.includes('máy tính')) currentFields = SPEC_CONFIGS['pc-gaming'];
                  else if (nameStr.includes('màn hình')) currentFields = SPEC_CONFIGS['man-hinh'];
                  else if (nameStr.includes('chuột')) currentFields = SPEC_CONFIGS['chuot'];
                  else if (nameStr.includes('phím')) currentFields = SPEC_CONFIGS['ban-phim'];
                  else if (nameStr.includes('tai nghe')) currentFields = SPEC_CONFIGS['tai-nghe'];
                  else if (nameStr.includes('linh kiện')) currentFields = SPEC_CONFIGS['linh-kien-pc'];
                }
                
                return (
                  <>
                    {currentFields.map((field) => (
                      <div key={field.key}>
                        <label className="block text-sm font-bold text-gray-700 mb-2">{field.label}</label>
                        <input 
                          type="text" 
                          value={formData.specs[field.key] || ''} 
                          onChange={(e) => setFormData({...formData, specs: {...formData.specs, [field.key]: e.target.value}})}
                          className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-gray-800 text-sm"
                          placeholder={field.placeholder}
                        />
                      </div>
                    ))}
                  </>
                );
              })()}
            </div>
            
            {/* Dynamic Custom Specs */}
            <div className="mt-8 border-t border-gray-100 pt-6">
              <h3 className="text-sm font-bold text-gray-800 mb-4">Thuộc tính tùy chỉnh (Thêm nếu cần)</h3>
              {(() => {
                const currentCategory = categories.find(c => c._id === formData.category_id);
                const currentSlug = currentCategory?.slug || '';
                let currentFields = SPEC_CONFIGS[currentSlug] || [];
                
                if (currentFields.length === 0 && currentCategory) {
                  const nameStr = currentCategory.name.toLowerCase();
                  if (nameStr.includes('laptop')) currentFields = SPEC_CONFIGS['laptop'];
                  else if (nameStr.includes('pc') || nameStr.includes('máy tính')) currentFields = SPEC_CONFIGS['pc-gaming'];
                  else if (nameStr.includes('màn hình')) currentFields = SPEC_CONFIGS['man-hinh'];
                  else if (nameStr.includes('chuột')) currentFields = SPEC_CONFIGS['chuot'];
                  else if (nameStr.includes('phím')) currentFields = SPEC_CONFIGS['ban-phim'];
                  else if (nameStr.includes('tai nghe')) currentFields = SPEC_CONFIGS['tai-nghe'];
                  else if (nameStr.includes('linh kiện')) currentFields = SPEC_CONFIGS['linh-kien-pc'];
                }

                const customKeys = Object.keys(formData.specs).filter(key => !currentFields.find(f => f.key === key));
                
                return (
                  <div className="space-y-3">
                    {customKeys.map((key, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input type="text" disabled value={key} className="w-1/3 px-3 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-600 font-bold" />
                        <input 
                          type="text" 
                          value={formData.specs[key] as string} 
                          onChange={(e) => setFormData({...formData, specs: {...formData.specs, [key]: e.target.value}})}
                          className="flex-1 px-3 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:border-indigo-500 outline-none" 
                        />
                        <button type="button" onClick={() => {
                          const newSpecs = { ...formData.specs };
                          delete newSpecs[key];
                          setFormData({...formData, specs: newSpecs});
                        }} className="px-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors">
                          <X size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                );
              })()}
              
              <div className="flex gap-2 mt-4">
                 <input type="text" id="custom-spec-key" placeholder="Tên thông số (VD: Màu sắc)" className="w-1/3 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500 transition-colors" />
                 <input type="text" id="custom-spec-val" placeholder="Giá trị (VD: Đen)" className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500 transition-colors" />
                 <button type="button" onClick={() => {
                    const keyInput = document.getElementById('custom-spec-key') as HTMLInputElement;
                    const valInput = document.getElementById('custom-spec-val') as HTMLInputElement;
                    if (keyInput && valInput && keyInput.value.trim()) {
                      setFormData({...formData, specs: {...formData.specs, [keyInput.value.trim()]: valInput.value}});
                      keyInput.value = '';
                      valInput.value = '';
                    }
                 }} className="px-5 bg-indigo-50 text-indigo-600 font-bold rounded-xl hover:bg-indigo-100 transition-colors">Thêm</button>
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
                onChange={handleCategoryChange}
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
              {loading ? "Đang xử lý..." : "Lưu & Đăng sản phẩm"}
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

      {/* Smart Paste Modal */}
      {showSmartModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-purple-50 to-blue-50">
              <div className="flex items-center gap-2 text-purple-700">
                <Sparkles size={20} />
                <h3 className="text-lg font-bold">Trích xuất tự động bằng AI</h3>
              </div>
              <button 
                onClick={() => setShowSmartModal(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-white rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                Dán bất kỳ nội dung nào (từ bài đăng Facebook, Zalo, diễn đàn...). Trí tuệ nhân tạo sẽ tự động đọc hiểu và bóc tách thành Tên máy, Hãng, Giá bán và Thông số kỹ thuật.
              </p>
              
              <textarea
                value={smartText}
                onChange={(e) => setSmartText(e.target.value)}
                placeholder="VD: Dán cấu hình văn bản, hoặc dán LINK GOOGLE DOCS (Public) vào đây... Hệ thống sẽ tự động đọc."
                className="w-full h-48 p-4 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm resize-none bg-purple-50/30 font-medium"
              />
              
              <div className="mt-4 flex flex-col md:flex-row items-center gap-3 w-full bg-blue-50/50 p-4 rounded-xl border border-blue-100 border-dashed">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-500 shadow-sm shrink-0">
                  <FileText size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-gray-800">Hoặc tải lên File Excel</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Hỗ trợ file .xlsx, .csv chứa hàng loạt sản phẩm</p>
                </div>
                <div className="relative">
                  <input 
                    type="file" 
                    accept=".xlsx, .csv" 
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <button type="button" className="bg-white border border-gray-200 hover:border-blue-400 text-sm px-4 py-2 rounded-lg font-medium text-gray-700 transition-colors whitespace-nowrap">
                    Chọn File Excel
                  </button>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowSmartModal(false)}
                  className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleSmartExtract}
                  disabled={extracting || !smartText.trim()}
                  className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl transition-all shadow-md shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {extracting ? (
                    <>Đang phân tích AI...</>
                  ) : (
                    <><Sparkles size={16} /> Bắt đầu trích xuất</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
