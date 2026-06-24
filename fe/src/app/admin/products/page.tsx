"use client";

import { useEffect, useState, useRef } from "react";
import { Edit, Trash2, Plus, Search, ImageOff } from "lucide-react";
import Link from "next/link";
import { fetchApi } from "@/lib/api";

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  brand: string;
  isHotSale?: boolean;
  flashSalePrice?: number;
  isFeatured?: boolean;
  category_id?: { _id: string; name: string };
  createdAt?: string;
  images?: string[];
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [hotSaleFilter, setHotSaleFilter] = useState("");
  const [sortFilter, setSortFilter] = useState("newest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [tableWidth, setTableWidth] = useState(1200);

  const topScrollRef = useRef<HTMLDivElement>(null);
  const tableScrollRef = useRef<HTMLDivElement>(null);

  const handleTopScroll = (e: any) => {
    if (tableScrollRef.current) tableScrollRef.current.scrollLeft = e.target.scrollLeft;
  };
  const handleTableScroll = (e: any) => {
    if (topScrollRef.current) topScrollRef.current.scrollLeft = e.target.scrollLeft;
  };

  useEffect(() => {
    if (tableScrollRef.current && tableScrollRef.current.children[0]) {
      setTableWidth(tableScrollRef.current.children[0].scrollWidth);
    }
  }, [products, searchTerm, brandFilter, stockFilter, categoryFilter, hotSaleFilter, sortFilter, loading]);

  const fetchProducts = async () => {
    try {
      const res = await fetchApi(`/products?t=${Date.now()}`, { cache: "no-store", requireAuth: false });
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
    try {
      const res = await fetchApi(`/products/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setProducts(products.filter(p => p._id !== id));
      } else {
        alert("Xóa thất bại");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Bạn có chắc muốn xóa ${selectedIds.length} sản phẩm đã chọn?`)) return;
    try {
      const res = await fetchApi(`/products/bulk-delete`, {
        method: 'POST',
        body: JSON.stringify({ ids: selectedIds })
      });
      if (res.ok) {
        setProducts(products.filter(p => !selectedIds.includes(p._id)));
        setSelectedIds([]);
      } else {
        alert("Xóa thất bại");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>, currentGroupProducts?: Product[]) => {
    if (currentGroupProducts) {
      // Nhóm category (chưa hỗ trợ tick all theo group trong code này, mình support tất cả theo table)
    } else {
      if (e.target.checked) {
        setSelectedIds(filteredProducts.map(p => p._id));
      } else {
        setSelectedIds([]);
      }
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleHotSale = async (id: string, currentStatus: boolean) => {
    // Optimistic UI update
    setProducts(products.map(p => p._id === id ? { ...p, isHotSale: !currentStatus } : p));
    
    try {
      const res = await fetchApi(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ isHotSale: !currentStatus })
      });
      if (!res.ok) {
        // Revert on error
        setProducts(products.map(p => p._id === id ? { ...p, isHotSale: currentStatus } : p));
        alert("Lỗi khi cập nhật trạng thái Hot Sale");
      }
    } catch (error) {
      console.error(error);
      setProducts(products.map(p => p._id === id ? { ...p, isHotSale: currentStatus } : p));
    }
  };

  const toggleFeatured = async (id: string, currentStatus: boolean) => {
    // Optimistic UI update
    setProducts(products.map(p => p._id === id ? { ...p, isFeatured: !currentStatus } : p));
    
    try {
      const res = await fetchApi(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ isFeatured: !currentStatus })
      });
      if (!res.ok) {
        setProducts(products.map(p => p._id === id ? { ...p, isFeatured: currentStatus } : p));
        alert("Lỗi khi cập nhật trạng thái Nổi bật");
      }
    } catch (error) {
      console.error(error);
      setProducts(products.map(p => p._id === id ? { ...p, isFeatured: currentStatus } : p));
    }
  };

  const updateFlashSalePrice = async (id: string, newPriceStr: string) => {
    const newPrice = Number(newPriceStr);
    if (isNaN(newPrice) || newPrice < 0) return;
    
    // Optimistic UI update
    setProducts(products.map(p => p._id === id ? { ...p, flashSalePrice: newPrice } : p));
    
    try {
      const res = await fetchApi(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ flashSalePrice: newPrice })
      });
      if (!res.ok) {
        // Revert will require reloading or keeping previous state
        fetchProducts(); // simple revert
        alert("Lỗi khi cập nhật giá Flash Sale");
      }
    } catch (error) {
      console.error(error);
      fetchProducts();
    }
  };

  const uniqueCategories = Array.from(new Map(
    products.filter(p => p.category_id).map(p => [p.category_id?._id, p.category_id?.name])
  ).entries());

  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchBrand = brandFilter ? p.brand === brandFilter : true;
    const matchStock = stockFilter === "in_stock" ? p.stock > 0 : stockFilter === "out_of_stock" ? p.stock === 0 : true;
    const matchCategory = categoryFilter ? p.category_id?._id === categoryFilter : true;
    const matchHotSale = hotSaleFilter === "hot" ? p.isHotSale : hotSaleFilter === "normal" ? !p.isHotSale : true;
    const matchMinPrice = minPrice ? p.price >= Number(minPrice) : true;
    const matchMaxPrice = maxPrice ? p.price <= Number(maxPrice) : true;
    return matchSearch && matchBrand && matchStock && matchCategory && matchHotSale && matchMinPrice && matchMaxPrice;
  }).sort((a, b) => {
    if (sortFilter === "price_asc") return a.price - b.price;
    if (sortFilter === "price_desc") return b.price - a.price;
    if (sortFilter === "stock_asc") return a.stock - b.stock;
    if (sortFilter === "stock_desc") return b.stock - a.stock;
    if (sortFilter === "oldest") return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime(); // newest
  });

  const groupedProducts = filteredProducts.reduce((acc, product) => {
    const catName = product.category_id?.name || "Khác";
    if (!acc[catName]) acc[catName] = [];
    acc[catName].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-full">
      <div className="p-4 md:p-6 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Quản lý sản phẩm</h1>
          <p className="text-sm text-gray-500">Xem, thêm, sửa, xóa danh sách sản phẩm trên hệ thống.</p>
        </div>
        <div className="flex gap-3">
          {selectedIds.length > 0 && (
            <button 
              onClick={handleBulkDelete}
              className="bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-md font-bold flex items-center gap-2 transition-colors border border-primary/20"
            >
              <Trash2 size={18} /> Xóa {selectedIds.length} sản phẩm
            </button>
          )}
          <Link href="/admin/products/new" className="bg-primary hover:bg-primary text-white px-4 py-2 rounded-md font-semibold flex items-center gap-2 transition-colors">
            <Plus size={18} /> Thêm sản phẩm
          </Link>
        </div>
      </div>
      
      <div className="p-4 md:p-6">
        {/* Professional Filter Section */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6">
          <div className="flex flex-col gap-4">
            {/* Top row: Search & Price */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Tìm kiếm sản phẩm theo tên..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm h-[40px]"
                />
              </div>
              
              <div className="relative">
                <div className="flex items-center bg-white border border-gray-300 rounded-lg px-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all h-[40px]">
                  <span className="text-gray-500 text-sm font-medium border-r border-gray-200 pr-3 mr-2 hidden sm:block">Khoảng giá</span>
                  <input 
                    type="number" 
                    placeholder="Từ..." 
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-[80px] sm:w-[100px] outline-none text-sm bg-transparent"
                  />
                  <span className="text-gray-400 px-2">-</span>
                  <input 
                    type="number" 
                    placeholder="Đến..." 
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-[80px] sm:w-[100px] outline-none text-sm bg-transparent"
                  />
                </div>
                {(minPrice || maxPrice) && (
                  <div className="absolute top-[105%] left-0 text-[12px] text-emerald-600 font-medium whitespace-nowrap bg-emerald-50/90 backdrop-blur-sm px-2 py-0.5 rounded shadow-sm border border-emerald-100 z-10">
                    Sẽ lọc từ: {minPrice ? Number(minPrice).toLocaleString('vi-VN') + ' đ' : '0 đ'} đến {maxPrice ? Number(maxPrice).toLocaleString('vi-VN') + ' đ' : 'Tối đa'}
                  </div>
                )}
              </div>
            </div>
            
            {/* Bottom row: Selects */}
            <div className="grid grid-cols-1 sm:grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <select 
                className="bg-white border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors text-gray-700 text-sm h-[40px]"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">Tất cả danh mục</option>
                {uniqueCategories.map(([id, name]) => (
                  <option key={id as string} value={id as string}>{name as string}</option>
                ))}
              </select>
              
              <select 
                className="bg-white border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors text-gray-700 text-sm h-[40px]"
                value={brandFilter}
                onChange={(e) => setBrandFilter(e.target.value)}
              >
                <option value="">Tất cả thương hiệu</option>
                {Array.from(new Set(products.map(p => p.brand).filter(Boolean))).map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
              
              <select 
                className="bg-white border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors text-gray-700 text-sm h-[40px]"
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
              >
                <option value="">Mọi trạng thái kho</option>
                <option value="in_stock">Còn hàng</option>
                <option value="out_of_stock">Hết hàng</option>
              </select>
              
              <select 
                className="bg-white border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors text-gray-700 text-sm h-[40px]"
                value={hotSaleFilter}
                onChange={(e) => setHotSaleFilter(e.target.value)}
              >
                <option value="">Mọi khuyến mãi</option>
                <option value="hot">Chỉ hiện Hot Sale</option>
                <option value="normal">Không phải Hot Sale</option>
              </select>
              
              <select 
                className="bg-white border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors text-gray-700 text-sm font-medium h-[40px]"
                value={sortFilter}
                onChange={(e) => setSortFilter(e.target.value)}
              >
                <option value="newest">Sắp xếp: Mới nhất</option>
                <option value="oldest">Sắp xếp: Cũ nhất</option>
                <option value="price_asc">Giá: Thấp đến cao</option>
                <option value="price_desc">Giá: Cao đến thấp</option>
                <option value="stock_asc">Kho: Ít nhất</option>
                <option value="stock_desc">Kho: Nhiều nhất</option>
              </select>
            </div>
          </div>
        </div>

        {/* Top Scrollbar */}
        <div 
          ref={topScrollRef} 
          onScroll={handleTopScroll} 
          className="overflow-x-auto border-b border-gray-100 scrollbar-thin" 
          style={{ height: '14px' }}
        >
          <div style={{ width: tableWidth, height: '1px' }}></div>
        </div>

        {/* Table */}
        <div 
          ref={tableScrollRef}
          onScroll={handleTableScroll}
          className="overflow-auto max-h-[calc(100vh-220px)] relative"
        >
          <table className="whitespace-nowrap min-w-max w-full text-left border-collapse">
            <thead className="sticky top-0 z-20">
              <tr className="bg-gray-50 text-gray-600 text-sm shadow-sm border-b border-gray-200">
                <th className="py-3 px-4 w-12 text-center bg-gray-50">
                  <input 
                    type="checkbox" 
                    onChange={(e) => handleSelectAll(e)}
                    checked={filteredProducts.length > 0 && selectedIds.length === filteredProducts.length}
                    className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4 font-semibold bg-gray-50">Tên sản phẩm</th>
                <th className="py-3 px-4 font-semibold bg-gray-50">Thương hiệu</th>
                <th className="py-3 px-4 font-semibold bg-gray-50">Giá bán</th>
                <th className="py-3 px-4 font-semibold bg-gray-50">Tồn kho</th>
                <th className="py-3 px-4 font-semibold text-center bg-gray-50">Hot Sale</th>
                <th className="py-3 px-4 font-semibold text-center bg-gray-50">Nổi bật</th>
                <th className="py-3 px-4 font-semibold text-right bg-gray-50">Thao tác</th>
              </tr>
            </thead>
            {loading ? (
              <tbody><tr><td colSpan={8} className="py-8 text-center text-gray-500">Đang tải dữ liệu...</td></tr></tbody>
            ) : filteredProducts.length === 0 ? (
              <tbody><tr><td colSpan={8} className="py-8 text-center text-gray-500">Không tìm thấy sản phẩm nào phù hợp.</td></tr></tbody>
            ) : (
              Object.entries(groupedProducts).map(([categoryName, prods]) => (
                <tbody key={categoryName} className="divide-y divide-gray-100">
                  <tr className="border-t-2 border-gray-200">
                    <td colSpan={8} className="py-2.5 px-4 font-bold text-gray-800 uppercase text-xs tracking-widest sticky left-0 bg-gray-200 z-10">{categoryName} ({prods.length})</td>
                  </tr>
                  {prods.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 text-center">
                        <input 
                          type="checkbox"
                          checked={selectedIds.includes(product._id)}
                          onChange={() => handleSelectOne(product._id)}
                          className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900 whitespace-normal max-w-[280px] md:max-w-[350px]">
                        <div className="flex items-start gap-2">
                          <span className="line-clamp-2 leading-relaxed flex-1" title={product.name}>{product.name}</span>
                          {(!product.images || product.images.length === 0) && (
                            <span className="shrink-0 flex items-center gap-1 px-1.5 py-0.5 mt-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 cursor-help" title="Sản phẩm này chưa có hình đại diện">
                              <ImageOff size={12} /> Thiếu ảnh
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{product.brand || '---'}</td>
                      <td className="py-3 px-4 text-sm text-primary font-semibold">{product.price.toLocaleString('vi-VN')}đ</td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-primary/10 text-primary'}`}>
                          {product.stock > 0 ? product.stock : 'Hết hàng'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <input 
                            type="checkbox"
                            checked={!!product.isHotSale}
                            onChange={() => toggleHotSale(product._id, !!product.isHotSale)}
                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer accent-blue-600"
                          />
                          {product.isHotSale && (
                            <input 
                              type="number"
                              placeholder="Giá Flash Sale"
                              defaultValue={product.flashSalePrice || product.price}
                              onBlur={(e) => updateFlashSalePrice(product._id, e.target.value)}
                              className="w-[90px] text-[11px] border border-primary rounded px-1 py-0.5 mt-1 outline-none focus:border-primary text-center text-primary font-bold"
                              title="Nhập giá Flash Sale và click ra ngoài để lưu"
                            />
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <input 
                          type="checkbox"
                          checked={!!product.isFeatured}
                          onChange={() => toggleFeatured(product._id, !!product.isFeatured)}
                          className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500 cursor-pointer accent-purple-600"
                        />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/products/${product._id}`} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Sửa">
                            <Edit size={16} />
                          </Link>
                          <button 
                            onClick={() => handleDelete(product._id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Xóa">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              ))
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
