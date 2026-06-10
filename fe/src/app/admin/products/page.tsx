"use client";

import { useEffect, useState } from "react";
import { Edit, Trash2, Plus, Search } from "lucide-react";
import Link from "next/link";

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  brand: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("");

  const fetchProducts = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/products?t=${Date.now()}`, { cache: "no-store" });
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
      const res = await fetch(`http://127.0.0.1:5000/api/products/${id}`, {
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

  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchBrand = brandFilter ? p.brand === brandFilter : true;
    const matchStock = stockFilter === "in_stock" ? p.stock > 0 : stockFilter === "out_of_stock" ? p.stock === 0 : true;
    return matchSearch && matchBrand && matchStock;
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-full">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Quản lý sản phẩm</h1>
          <p className="text-sm text-gray-500">Xem, thêm, sửa, xóa danh sách sản phẩm trên hệ thống.</p>
        </div>
        <Link href="/admin/products/new" className="bg-primary hover:bg-red-700 text-white px-4 py-2 rounded-md font-semibold flex items-center gap-2 transition-colors">
          <Plus size={18} /> Thêm sản phẩm
        </Link>
      </div>
      
      <div className="p-6">
        {/* Search & Filter */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Tìm kiếm sản phẩm..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md outline-none focus:border-primary transition-colors"
            />
          </div>
          <select 
            className="border border-gray-300 rounded-md px-4 py-2 outline-none focus:border-primary transition-colors min-w-[160px] text-gray-700 bg-white"
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
          >
            <option value="">Tất cả thương hiệu</option>
            {Array.from(new Set(products.map(p => p.brand).filter(Boolean))).map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
          <select 
            className="border border-gray-300 rounded-md px-4 py-2 outline-none focus:border-primary transition-colors min-w-[150px] text-gray-700 bg-white"
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
          >
            <option value="">Trạng thái kho</option>
            <option value="in_stock">Còn hàng</option>
            <option value="out_of_stock">Hết hàng</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm border-y border-gray-200">
                <th className="py-3 px-4 font-semibold">Tên sản phẩm</th>
                <th className="py-3 px-4 font-semibold">Thương hiệu</th>
                <th className="py-3 px-4 font-semibold">Giá bán</th>
                <th className="py-3 px-4 font-semibold">Tồn kho</th>
                <th className="py-3 px-4 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={5} className="py-8 text-center text-gray-500">Đang tải dữ liệu...</td></tr>
              ) : filteredProducts.length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center text-gray-500">Không tìm thấy sản phẩm nào phù hợp.</td></tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{product.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{product.brand || '---'}</td>
                    <td className="py-3 px-4 text-sm text-primary font-semibold">{product.price.toLocaleString('vi-VN')}đ</td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {product.stock > 0 ? product.stock : 'Hết hàng'}
                      </span>
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
