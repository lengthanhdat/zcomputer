"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Save, AlertTriangle, CheckCircle, XCircle, Plus, Minus, Edit, Trash2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { fetchApi } from "@/lib/api";

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  status: string;
  brand: string;
  images?: string[];
  category_id?: {
    name?: string;
  };
}

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [stockFilter, setStockFilter] = useState<"all" | "out" | "low" | "ok">("all");
  const [editedStocks, setEditedStocks] = useState<Record<string, number>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [isSavingAll, setIsSavingAll] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await fetchApi("/products?limit=100");
      const data = await res.json();
      setProducts(data);
      
      // Initialize editedStocks mapping
      const stocks: Record<string, number> = {};
      data.forEach((p: Product) => {
        stocks[p._id] = p.stock;
      });
      setEditedStocks(stocks);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Không thể kết nối với máy chủ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleStockChange = (id: string, value: number) => {
    setEditedStocks((prev) => ({
      ...prev,
      [id]: Math.max(0, value),
    }));
  };

  const handleSaveStock = async (id: string) => {
    const newStock = editedStocks[id];
    setSavingId(id);
    try {
      // Find current product to keep status sync if it is out_of_stock and now has stock
      const product = products.find((p) => p._id === id);
      let newStatus = product?.status;
      if (newStock > 0 && product?.status === "out_of_stock") {
        newStatus = "active";
      } else if (newStock === 0) {
        newStatus = "out_of_stock";
      }

      const res = await fetchApi(`/products/${id}`, {
        method: "PUT",
        body: JSON.stringify({ stock: newStock, status: newStatus }),
      });

      if (res.ok) {
        toast.success("Cập nhật số lượng tồn kho thành công!");
        setProducts((prev) =>
          prev.map((p) =>
            p._id === id ? { ...p, stock: newStock, status: newStatus || p.status } : p
          )
        );
      } else {
        toast.error("Cập nhật thất bại, vui lòng thử lại.");
      }
    } catch (error) {
      toast.error("Lỗi kết nối máy chủ");
    } finally {
      setSavingId(null);
    }
  };

  const handleSaveAllStock = async () => {
    const modifiedProducts = products.filter(p => editedStocks[p._id] !== undefined && editedStocks[p._id] !== p.stock);
    if (modifiedProducts.length === 0) return;

    if (!confirm(`Bạn có muốn lưu thay đổi kho cho ${modifiedProducts.length} sản phẩm?`)) return;

    setIsSavingAll(true);
    let successCount = 0;

    const promises = modifiedProducts.map(async (product) => {
      const id = product._id;
      const newStock = editedStocks[id];
      let newStatus = product.status;
      if (newStock > 0 && product.status === "out_of_stock") {
        newStatus = "active";
      } else if (newStock === 0) {
        newStatus = "out_of_stock";
      }

      const res = await fetchApi(`/products/${id}`, {
        method: "PUT",
        body: JSON.stringify({ stock: newStock, status: newStatus }),
      });

      if (res.ok) {
        successCount++;
        return { id, newStock, newStatus };
      }
      return null;
    });

    const results = await Promise.all(promises);
    
    setProducts((prev) =>
      prev.map((p) => {
        const update = results.find(r => r && r.id === p._id);
        if (update) {
          return { ...p, stock: update.newStock, status: update.newStatus || p.status };
        }
        return p;
      })
    );

    if (successCount === modifiedProducts.length) {
      toast.success(`Đã lưu thành công ${successCount} sản phẩm!`);
    } else {
      toast.error(`Lưu thành công ${successCount}/${modifiedProducts.length} sản phẩm. Có lỗi xảy ra.`);
    }
    
    setIsSavingAll(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${name}"? Thao tác này không thể hoàn tác.`)) {
      return;
    }

    try {
      const res = await fetchApi(`/products/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Đã xóa sản phẩm thành công!");
        setProducts((prev) => prev.filter((p) => p._id !== id));
      } else {
        toast.error("Xóa thất bại, vui lòng thử lại.");
      }
    } catch (error) {
      toast.error("Lỗi kết nối máy chủ");
    }
  };

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.brand.toLowerCase().includes(searchQuery.toLowerCase());
    
    const currentStock = editedStocks[product._id] ?? product.stock;
    
    if (stockFilter === "out") {
      return matchesSearch && currentStock === 0;
    }
    if (stockFilter === "low") {
      return matchesSearch && currentStock > 0 && currentStock <= 5;
    }
    if (stockFilter === "ok") {
      return matchesSearch && currentStock > 5;
    }
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Quản lý Kho hàng</h1>
        <p className="text-sm text-gray-500">Xem và thay đổi nhanh số lượng tồn kho, trạng thái của các sản phẩm.</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Controls */}
        <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm theo tên, hãng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>

          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => setStockFilter("all")}
              className={`px-4 py-2 text-sm font-semibold rounded-md border transition-all ${
                stockFilter === "all"
                  ? "bg-gray-800 text-white border-gray-800"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setStockFilter("out")}
              className={`px-4 py-2 text-sm font-semibold rounded-md border transition-all flex items-center gap-1.5 ${
                stockFilter === "out"
                  ? "bg-red-600 text-white border-red-600"
                  : "bg-white text-red-600 border-red-200 hover:bg-red-50"
              }`}
            >
              <XCircle size={16} /> Hết hàng
            </button>
            <button
              onClick={() => setStockFilter("low")}
              className={`px-4 py-2 text-sm font-semibold rounded-md border transition-all flex items-center gap-1.5 ${
                stockFilter === "low"
                  ? "bg-yellow-500 text-white border-yellow-500"
                  : "bg-white text-yellow-600 border-yellow-200 hover:bg-yellow-50"
              }`}
            >
              <AlertTriangle size={16} /> Sắp hết hàng
            </button>
            <button
              onClick={() => setStockFilter("ok")}
              className={`px-4 py-2 text-sm font-semibold rounded-md border transition-all flex items-center gap-1.5 ${
                stockFilter === "ok"
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-green-600 border-green-200 hover:bg-green-50"
              }`}
            >
              <CheckCircle size={16} /> Còn hàng (&gt;5)
            </button>
          </div>

          <div className="flex w-full md:w-auto mt-3 md:mt-0">
            <button
              onClick={handleSaveAllStock}
              disabled={isSavingAll || products.filter(p => editedStocks[p._id] !== undefined && editedStocks[p._id] !== p.stock).length === 0}
              className="flex items-center justify-center w-full md:w-auto gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-all shadow-sm shadow-blue-600/20"
            >
              {isSavingAll ? (
                <><Loader2 size={16} className="animate-spin" /> Đang lưu...</>
              ) : (
                <><Save size={16} /> Lưu tất cả thay đổi</>
              )}
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm font-semibold">
                <th className="py-4 px-6">Sản phẩm</th>
                <th className="py-4 px-6">Danh mục</th>
                <th className="py-4 px-6 text-center w-48">Số lượng tồn</th>
                <th className="py-4 px-6">Đơn giá</th>
                <th className="py-4 px-6">Trạng thái</th>
                <th className="py-4 px-6 text-center w-48">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    Đang tải dữ liệu sản phẩm...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    Không tìm thấy sản phẩm nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const currentStock = editedStocks[product._id] ?? product.stock;
                  const isStockModified = currentStock !== product.stock;
                  
                  let statusBadge = (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                      Còn hàng
                    </span>
                  );
                  if (currentStock === 0) {
                    statusBadge = (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                        Hết hàng
                      </span>
                    );
                  } else if (currentStock <= 5) {
                    statusBadge = (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                        Sắp hết hàng
                      </span>
                    );
                  }

                  return (
                    <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded bg-gray-50 border p-1 shrink-0 flex items-center justify-center">
                            {product.images?.[0] ? (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <span className="text-gray-300 text-[10px]">No Image</span>
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-gray-800 text-sm line-clamp-2 leading-relaxed">
                              {product.name}
                            </div>
                            <div className="text-xs text-gray-400 mt-0.5">Hãng: {product.brand}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {product.category_id?.name || "Chưa phân loại"}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleStockChange(product._id, currentStock - 1)}
                            className="w-8 h-8 rounded border bg-white text-gray-600 flex items-center justify-center hover:bg-gray-50 hover:text-primary active:bg-gray-100"
                          >
                            <Minus size={14} />
                          </button>
                          <input
                            type="number"
                            value={currentStock}
                            onChange={(e) => handleStockChange(product._id, parseInt(e.target.value) || 0)}
                            className="w-16 h-8 text-center border rounded-md font-semibold text-gray-800 focus:outline-none focus:border-primary"
                          />
                          <button
                            onClick={() => handleStockChange(product._id, currentStock + 1)}
                            className="w-8 h-8 rounded border bg-white text-gray-600 flex items-center justify-center hover:bg-gray-50 hover:text-primary active:bg-gray-100"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-bold text-gray-800 text-sm">
                        {product.price.toLocaleString("vi-VN")}đ
                      </td>
                      <td className="py-4 px-6">{statusBadge}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleSaveStock(product._id)}
                            disabled={!isStockModified || savingId === product._id}
                            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                              isStockModified
                                ? "bg-green-600 hover:bg-green-700 text-white shadow-sm shadow-green-600/20 cursor-pointer"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                            }`}
                            title="Lưu số lượng"
                          >
                            <Save size={14} />
                            {savingId === product._id ? "..." : "Lưu"}
                          </button>
                          
                          <Link
                            href={`/admin/products/${product._id}`}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors border border-transparent hover:border-blue-200"
                            title="Chỉnh sửa chi tiết"
                          >
                            <Edit size={16} />
                          </Link>
                          
                          <button
                            onClick={() => handleDelete(product._id, product.name)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors border border-transparent hover:border-red-200"
                            title="Xóa sản phẩm"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
