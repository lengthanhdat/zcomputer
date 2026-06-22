"use client";

import { useState, useEffect, use, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Image as ImageIcon, Box, Tag, DollarSign, FileText, UploadCloud, Loader2, X, Gift, Cpu, Sparkles } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { fetchApi } from "@/lib/api";
import CategoryPickerModal from "@/components/CategoryPickerModal";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(
  async () => {
    const rq = await import("react-quill-new");
    const RQ = rq.default;
    const Quill = (RQ as any).Quill;

    if (Quill && typeof window !== "undefined") {
      (window as any).Quill = Quill;
      const { default: BlotFormatter } = await import("quill-blot-formatter");
      Quill.register("modules/blotFormatter", BlotFormatter);
      
      // @ts-ignore
      const { default: MagicUrl } = await import("quill-magic-url");
      Quill.register("modules/magicUrl", MagicUrl);

      // @ts-ignore
      const { default: ImageUploader } = await import("quill-image-uploader");
      Quill.register("modules/imageUploader", ImageUploader);
      
      // @ts-ignore
      const { default: htmlEditButton } = await import("quill-html-edit-button");
      Quill.register("modules/htmlEditButton", htmlEditButton);
      
      const Font = Quill.import('formats/font');
      Font.whitelist = ['sans-serif', 'arial', 'times-new-roman', 'tahoma', 'verdana', 'courier-new'];
      Quill.register(Font, true);

      const Size = Quill.import('attributors/style/size');
      Size.whitelist = ['10px', '12px', '14px', '16px', '18px', '20px', '24px', '30px', '36px'];
      Quill.register(Size, true);

      // Bắt buộc đăng ký thuộc tính width, height, style, class cho thẻ Image
      const BaseImageFormat = Quill.import('formats/image');
      class ImageFormat extends BaseImageFormat {
        static formats(domNode: Element) {
          return ['alt', 'width', 'height', 'style', 'class'].reduce(function(formats: any, attribute) {
            if (domNode.hasAttribute(attribute)) {
              formats[attribute] = domNode.getAttribute(attribute);
            }
            return formats;
          }, {});
        }
        format(name: string, value: any) {
          if (['alt', 'width', 'height', 'style', 'class'].includes(name)) {
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
import "quill-image-uploader/dist/quill.imageUploader.min.css";

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

const PriceInput = ({ value, onChange, placeholder, className, required = false, name }: any) => {
  const [displayValue, setDisplayValue] = useState(value ? Number(value).toLocaleString('vi-VN') : "");
  const isComposing = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isComposing.current && document.activeElement !== inputRef.current) {
      setDisplayValue(value ? Number(value).toLocaleString('vi-VN') : "");
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    
    if (isComposing.current) {
      setDisplayValue(rawValue);
      return;
    }
    
    const numericValue = rawValue.replace(/\D/g, '');
    setDisplayValue(numericValue ? Number(numericValue).toLocaleString('vi-VN') : "");
    onChange(numericValue);
  };

  const handleCompositionStart = () => {
    isComposing.current = true;
  };

  const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    isComposing.current = false;
    const rawValue = (e.target as HTMLInputElement).value;
    const numericValue = rawValue.replace(/\D/g, '');
    setDisplayValue(numericValue ? Number(numericValue).toLocaleString('vi-VN') : "");
    onChange(numericValue);
  };

  return (
    <input 
      ref={inputRef}
      type="text" 
      name={name}
      required={required}
      value={displayValue} 
      onChange={handleChange}
      onCompositionStart={handleCompositionStart}
      onCompositionEnd={handleCompositionEnd}
      onBlur={(e) => {
        const numericValue = e.target.value.replace(/\D/g, '');
        setDisplayValue(numericValue ? Number(numericValue).toLocaleString('vi-VN') : "");
        onChange(numericValue);
      }}
      className={className}
      placeholder={placeholder}
    />
  );
};

interface Category {
  _id: string;
  name: string;
  slug?: string;
  parent_id?: string;
}

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const quillRef = useRef<any>(null);

  const modules = useMemo(() => ({
    blotFormatter: {},
    magicUrl: true,
    table: true,
    htmlEditButton: {
      msg: "Chỉnh sửa HTML",
      okText: "Lưu",
      cancelText: "Hủy",
    },
    imageUploader: {
      upload: (file: File) => {
        return new Promise((resolve, reject) => {
          const data = new FormData();
          data.append("image", file);
          fetchApi("/upload/image", {
            method: "POST",
            body: data,
            requireAuth: true,
          })
            .then((res) => res.json())
            .then((responseData) => {
              const url = responseData.url.startsWith('http') || responseData.url.startsWith('data:') 
                  ? responseData.url 
                  : `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:5000'}${responseData.url}`;
              resolve(url);
            })
            .catch((error) => {
              reject("Upload failed");
            });
        });
      }
    },
    toolbar: [
      [{ 'font': [false, 'arial', 'times-new-roman', 'tahoma', 'verdana', 'courier-new'] }, { 'size': ['10px', '12px', '14px', false, '18px', '20px', '24px', '30px', '36px'] }],
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
  }), []);

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
    flashSalePrice: "",
    specs: { CPU: "", RAM: "", Storage: "", VGA: "", Screen: "" } as Record<string, string>
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetchApi("/categories");
        const data = await res.json();
        
        const parents = data.filter((c: any) => !c.parent_id);
        const organized: any[] = [];
        parents.forEach((p: any) => {
          organized.push(p);
          const children = data.filter((c: any) => c.parent_id === p._id);
          organized.push(...children);
        });
        const orphaned = data.filter((c: any) => c.parent_id && !parents.find((p: any) => p._id === c.parent_id));
        organized.push(...orphaned);

        setCategories(organized);
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
              flashSalePrice: product.flashSalePrice?.toString() || "",
              specs: {
                CPU: product.specs?.CPU || product.specs?.cpu || "",
                RAM: product.specs?.RAM || product.specs?.ram || "",
                Storage: product.specs?.Storage || product.specs?.storage || "",
                VGA: product.specs?.VGA || product.specs?.vga || "",
                Screen: product.specs?.Screen || product.specs?.screen || ""
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
  const getSpecFields = (catId?: string | null): any[] => {
    if (!catId) return [];
    const cat = categories.find(c => c._id === catId);
    if (!cat) return [];
    
    if (cat.slug && SPEC_CONFIGS[cat.slug]) return SPEC_CONFIGS[cat.slug];
    
    const nameStr = cat.name.toLowerCase();
    if (nameStr.includes('laptop') || nameStr.includes('macbook')) return SPEC_CONFIGS['laptop'];
    if (nameStr.includes('pc') || nameStr.includes('máy tính')) return SPEC_CONFIGS['pc-gaming'];
    if (nameStr.includes('màn hình')) return SPEC_CONFIGS['man-hinh'];
    if (nameStr.includes('chuột')) return SPEC_CONFIGS['chuot'];
    if (nameStr.includes('phím')) return SPEC_CONFIGS['ban-phim'];
    if (nameStr.includes('tai nghe')) return SPEC_CONFIGS['tai-nghe'];
    if (nameStr.includes('linh kiện')) return SPEC_CONFIGS['linh-kien-pc'];
    
    return getSpecFields(cat.parent_id);
  };

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

  const handleInsertMedia = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
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
          editor.insertEmbed(cursorPosition, 'image', imageUrl);
          editor.setSelection(cursorPosition + 1);
        }
        toast.success("Đã chèn ảnh vào nội dung");
      } else {
        toast.error("Tải ảnh thất bại");
      }
    } catch (error) {
      toast.error("Lỗi tải ảnh");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
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

  const handleExtractFromName = () => {
    if (!formData.name) return;
    
    // Khởi tạo các giá trị mới
    const newSpecs = { ...formData.specs };
    let newBrand = formData.brand;
    let extractedCount = 0;
    
    const upperName = formData.name.toUpperCase();
    
    // 1. Nhận diện Thương hiệu (Brand)
    const properBrands = ["Dell", "HP", "Lenovo", "Apple", "ASUS", "Acer", "MSI", "Gigabyte", "Samsung", "LG", "Intel", "AMD", "NVIDIA", "Corsair", "Kingston", "Logitech"];
    for (const b of properBrands) {
      if (upperName.includes(b.toUpperCase())) {
        newBrand = b;
        extractedCount++;
        break;
      }
    }

    // 2. Nhận diện Thông số kỹ thuật (Specs)
    const parts = formData.name.split('/').map(p => p.trim());
    parts.forEach((part, index) => {
      const upperPart = part.toUpperCase();
      
      const isCPU = upperPart.includes('CPU') || upperPart.includes('I3') || upperPart.includes('I5') || 
                    upperPart.includes('I7') || upperPart.includes('I9') || upperPart.includes('RYZEN') || 
                    upperPart.includes('CORE') || upperPart.includes('PENTIUM') || upperPart.includes('CELERON') || 
                    upperPart.includes('XEON') || upperPart.includes('ULTRA') || upperPart.includes('M1') || 
                    upperPart.includes('M2') || upperPart.includes('M3') || upperPart.includes('M4') ||
                    /\b(10100|10400|11400|12100|12400|13400|14400|13600|14600|13700|14700|13900|14900|4600|5600|5700|7600|7700|7800|7900|7950|8600|8700)\b/.test(upperPart);

      // CPU
      if (isCPU && !upperPart.includes('GB') && !upperPart.includes('SSD') && !upperPart.includes('HDD') && !upperPart.includes('VGA') && !upperPart.includes('RTX') && !upperPart.includes('GTX')) {
        let cpuStr = part.replace(/^(CPU|CHIP|BỘ VI XỬ LÝ)\s*:/i, '').trim();
        
        if (index === 0 || upperPart.includes('LAPTOP') || upperPart.includes('PC') || upperPart.includes('MÁY TÍNH')) {
           const match = cpuStr.match(/\b(core|ryzen|pentium|celeron|xeon|ultra|apple\s*m[1-4]|m[1-4]\b|i[3579]\b)/i);
           if (match && match.index !== undefined) {
             cpuStr = cpuStr.substring(match.index).trim();
           }
        }
        
        newSpecs.CPU = cpuStr;
        extractedCount++;
      }
      // RAM
      else if (upperPart.includes('RAM') || (upperPart.includes('GB') && !upperPart.includes('SSD') && !upperPart.includes('HDD') && !upperPart.includes('VGA') && !upperPart.includes('RTX') && !upperPart.includes('GTX') && !upperPart.includes('RX'))) {
        newSpecs.RAM = part.replace(/^RAM\s*:/i, '').trim();
        extractedCount++;
      }
      // Storage
      else if (upperPart.includes('SSD') || upperPart.includes('HDD') || upperPart.includes('NVME') || upperPart.includes('TB') || upperPart.includes('Ổ CỨNG')) {
        newSpecs.Storage = part.replace(/^(SSD|HDD|Ổ CỨNG|STORAGE)\s*:/i, '').trim();
        extractedCount++;
      }
      // VGA
      else if (upperPart.includes('VGA') || upperPart.includes('RTX') || upperPart.includes('GTX') || upperPart.includes('RX ') || upperPart.includes('RADEON') || upperPart.includes('ARC') || upperPart.includes('CARD') || upperPart.includes('GRAPHICS')) {
        newSpecs.VGA = part.replace(/^(VGA|CARD|CARD MÀN HÌNH)\s*:/i, '').trim();
        extractedCount++;
      }
      // Screen
      else if (upperPart.includes('INCH') || upperPart.includes('HZ') || upperPart.includes('144HZ') || upperPart.includes('MÀN HÌNH') || upperPart.includes('24G') || upperPart.includes('27G')) {
        newSpecs.Screen = part.replace(/^(MÀN HÌNH|SCREEN|MÀN)\s*:/i, '').trim();
        extractedCount++;
      }
      // Mainboard
      else if (upperPart.includes('MAIN') || upperPart.includes('MAINBOARD') || /(H610|B660|B760|Z690|Z790|H410|H510|B460|B560|A320|B450|B550|X570|X670|A520)/i.test(upperPart)) {
        let mbStr = part.replace(/^(MAINBOARD|MAIN|BO MẠCH CHỦ)\s*:/i, '').trim();
        if (index === 0) {
            mbStr = mbStr.replace(/^(BỘ MÁY TÍNH|PC GAMING|PC LẮP RÁP|PC VĂN PHÒNG|PC|MÁY TÍNH BÀN|MÁY TÍNH)\s*/i, '').trim();
        }
        newSpecs.Mainboard = mbStr;
        extractedCount++;
      }
      // PSU
      else if (upperPart.includes('NGUỒN') || upperPart.includes('PSU') || /\b\d{3,4}W\b/.test(upperPart)) {
        newSpecs.PSU = part.replace(/^(NGUỒN|PSU)\s*:/i, '').trim();
        extractedCount++;
      }
      // Case
      else if (upperPart.includes('CASE') || upperPart.includes('VỎ')) {
        newSpecs.Case = part.replace(/^(CASE|VỎ|VỎ MÁY|VỎ CASE)\s*:/i, '').trim();
        extractedCount++;
      }
      // Cooler
      else if (upperPart.includes('TẢN') || upperPart.includes('COOLER') || upperPart.includes('AIO')) {
        newSpecs.Cooler = part.replace(/^(TẢN|TẢN NHIỆT|COOLER)\s*:/i, '').trim();
        extractedCount++;
      }
    });

    if (extractedCount > 0) {
      setFormData(prev => ({ 
        ...prev, 
        specs: newSpecs,
        brand: newBrand
      }));
      toast.success(`Đã tự động điền ${extractedCount} thông tin từ tên sản phẩm!`);
    } else {
      toast.success('Không tìm thấy thông tin trong tên.', { icon: 'ℹ️' });
    }
  };

  const handlePreview = () => {
    const payload = {
      _id: resolvedParams.id || "preview",
      name: formData.name || "Tên sản phẩm chưa nhập",
      description: formData.description,
      brand: formData.brand || "ZCOMPUTER",
      slug: "preview-slug",
      sku: formData.sku || "PREVIEW-SKU",
      price: Number(formData.price) || 0,
      discountPrice: Number(formData.discountPrice) || 0,
      stock: Number(formData.stock) || 0,
      status: Number(formData.stock) > 0 ? "in_stock" : "out_of_stock",
      images: formData.images,
      gifts: formData.gifts.filter(g => g.trim() !== ""),
      category_id: categories.find(c => c._id === formData.category_id) || { name: "Danh mục chưa chọn" },
      condition: formData.condition,
      isHotSale: formData.isHotSale,
      flashSalePrice: Number(formData.flashSalePrice) || 0,
      specs: formData.specs,
      views: 0
    };
    localStorage.setItem("product_preview", JSON.stringify(payload));
    window.open("/san-pham/preview", "_blank");
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
        flashSalePrice: Number(formData.flashSalePrice) || 0,
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
      <datalist id="brand-suggestions">
        <option value="Dell" />
        <option value="HP" />
        <option value="Lenovo" />
        <option value="Apple" />
        <option value="ASUS" />
        <option value="Acer" />
        <option value="MSI" />
        <option value="Gigabyte" />
        <option value="Samsung" />
        <option value="LG" />
        <option value="Intel" />
        <option value="AMD" />
        <option value="NVIDIA" />
        <option value="Logitech" />
        <option value="Corsair" />
        <option value="Kingston" />
      </datalist>
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
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <FileText size={18} />
              </div>
              <h2 className="text-lg font-bold text-gray-800">Thông tin cơ bản</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Tên sản phẩm <span className="text-primary">*</span></label>
                <div className="relative group">
                  <input 
                    type="text" 
                    name="name" 
                    required 
                    value={formData.name} 
                    onChange={handleChange}
                    className="w-full pl-4 pr-32 py-3 bg-gray-50/50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-gray-800 font-medium placeholder:font-normal"
                  />
                  {formData.name.includes('/') && (
                    <button
                      type="button"
                      onClick={handleExtractFromName}
                      className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-xs font-bold transition-all"
                    >
                      <Sparkles size={14} />
                      Tách TT
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Danh mục <span className="text-primary">*</span></label>
                  <CategoryPickerModal
                    categories={categories}
                    selectedId={formData.category_id}
                    onChange={(id: string) => setFormData({ ...formData, category_id: id })}
                    placeholder={categories.length === 0 ? "Đang tải danh mục..." : "Chọn danh mục"}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Thương hiệu</label>
                  <input 
                    type="text" 
                    name="brand" 
                    list="brand-suggestions"
                    value={formData.brand} 
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-gray-800 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Tình trạng máy <span className="text-primary">*</span></label>
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
          </div>
          {/* Card: Thông số kỹ thuật */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Cpu size={18} />
              </div>
              <h2 className="text-lg font-bold text-gray-800">Thông số kỹ thuật (Tùy chọn)</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(() => {
                const currentFields = getSpecFields(formData.category_id);
                
                return (
                  <>
                    {currentFields.map((field) => (
                      <div key={field.key}>
                        <label className="block text-sm font-bold text-gray-700 mb-2">{field.label}</label>
                        <input 
                          type="text" 
                          value={formData.specs[field.key as keyof typeof formData.specs] || formData.specs[(field.key).toLowerCase() as keyof typeof formData.specs] || ''} 
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
                const currentFields = getSpecFields(formData.category_id);

                const customKeys = Object.keys(formData.specs).filter(key => 
                  !currentFields.find(f => f.key.toLowerCase() === key.toLowerCase()) && 
                  formData.specs[key as keyof typeof formData.specs] !== undefined
                );
                
                return (
                  <div className="space-y-3">
                    {customKeys.map((key, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input type="text" disabled value={key} className="w-1/3 px-3 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-600 font-bold" />
                        <input 
                          type="text" 
                          value={formData.specs[key as keyof typeof formData.specs] as string || ''} 
                          onChange={(e) => setFormData({...formData, specs: {...formData.specs, [key]: e.target.value}})}
                          className="flex-1 px-3 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:border-indigo-500 outline-none" 
                        />
                        <button type="button" onClick={() => {
                          const newSpecs = { ...formData.specs };
                          delete (newSpecs as any)[key];
                          setFormData({...formData, specs: newSpecs});
                        }} className="px-3 bg-primary/10 text-primary rounded-xl hover:bg-primary/10 transition-colors">
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
          {/* Card: Mô tả chi tiết */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 md:p-8 mt-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-yellow-50 flex items-center justify-center text-yellow-600">
                <FileText size={18} />
              </div>
              <h2 className="text-lg font-bold text-gray-800">Mô tả sản phẩm</h2>
            </div>
            
            <div className="bg-slate-50/50 p-3 mb-2 border border-slate-200/60 rounded-t-xl flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-2">
                <label className="cursor-pointer flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 border border-indigo-200 bg-white px-4 py-2 rounded-xl transition-all shadow-sm">
                  <UploadCloud size={16} /> Thêm ảnh
                  <input type="file" accept="image/*" className="hidden" onChange={handleInsertMedia} disabled={uploadingImage} />
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const editor = quillRef.current?.getEditor();
                    if (editor) {
                      const table = editor.getModule('table');
                      if (table) table.insertTable(3, 3);
                    }
                  }}
                  className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 border border-blue-200 bg-white px-4 py-2 rounded-xl transition-all shadow-sm"
                >
                  Chèn Bảng (3x3)
                </button>
              </div>
              <span className="text-xs text-slate-400 max-w-[400px]">
                💡 Sử dụng công cụ để chèn hình ảnh, chèn bảng, định dạng tiêu đề (H2, H3), in đậm... Có nút <b>&lt;&gt;</b> để sửa HTML.
              </span>
            </div>

            <div className="bg-white">
              <ReactQuill 
                forwardedRef={quillRef}
                theme="snow"
                defaultValue={formData.description}
                onChange={(val: string) => setFormData({ ...formData, description: val })}
                modules={modules}
                className="h-[500px] border border-gray-200 rounded-b-xl pb-10 [&_.ql-editor]:text-base [&_.ql-editor]:text-slate-700"
              />
            </div>
          </div>
        </div>

        {/* Cột phải: Giá, Hình ảnh, Publish */}
        <div className="space-y-8">
          
          {/* Card: Giá và Tồn kho */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
            <h2 className="text-base font-bold text-gray-800 mb-5">Định giá & Tồn kho</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Giá bán (VNĐ) <span className="text-primary">*</span></label>
                <div className="relative">
                  <PriceInput 
                    name="price" 
                    required={true}
                    value={formData.price} 
                    onChange={(val: string) => setFormData({...formData, price: val})}
                    className="w-full pl-4 pr-12 py-3 bg-gray-50/50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all text-gray-800 font-bold text-lg"
                    placeholder="0"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">đ</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Giá niêm yết (Gốc)</label>
                <div className="relative">
                  <PriceInput 
                    name="discountPrice" 
                    value={formData.discountPrice} 
                    onChange={(val: string) => setFormData({...formData, discountPrice: val})}
                    className="w-full pl-4 pr-12 py-3 bg-gray-50/50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all text-gray-500 font-medium"
                    placeholder="0"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">đ</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Số lượng tồn kho <span className="text-primary">*</span></label>
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
                <label className="flex items-center gap-3 cursor-pointer mt-4">
                  <div className="relative flex items-center">
                    <input 
                      type="checkbox" 
                      name="isHotSale"
                      checked={formData.isHotSale}
                      onChange={(e) => setFormData({...formData, isHotSale: e.target.checked})}
                      className="w-5 h-5 border-2 border-gray-300 rounded text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600 transition-all"
                    />
                  </div>
                  <span className="text-sm font-bold text-gray-700">Hiển thị trong HOT SALE</span>
                </label>
              </div>

              {formData.isHotSale && (
                <div className="mt-4 pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-2">
                  <label className="block text-sm font-bold text-orange-600 mb-2">Giá HOT SALE (VNĐ)</label>
                  <div className="relative">
                    <PriceInput 
                      name="flashSalePrice" 
                      value={formData.flashSalePrice} 
                      onChange={(val: string) => setFormData({...formData, flashSalePrice: val})}
                      className="w-full pl-4 pr-12 py-3 bg-orange-50/50 border border-orange-200 rounded-xl outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all text-orange-700 font-bold"
                      placeholder="Nhập giá khuyến mãi sốc..."
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-400 font-bold">đ</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Card: Hình ảnh */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
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
                        className="absolute top-2 right-2 bg-white text-primary p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/10"
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
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
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
                    className="px-3 bg-primary/10 text-primary rounded-xl hover:bg-primary/10 transition-colors shrink-0"
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
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 flex flex-col gap-3">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary hover:bg-primary text-white px-6 py-3.5 rounded-xl font-bold shadow-lg shadow-primary transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? "Đang xử lý..." : "Lưu thay đổi"}
            </button>
            <button 
              type="button"
              onClick={handlePreview}
              className="w-full flex items-center justify-center bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-100 px-6 py-3.5 rounded-xl font-bold transition-all"
            >
              Xem trước
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
