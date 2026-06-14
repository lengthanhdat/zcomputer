"use client";

import { useEffect, useState } from "react";
import { Edit, Trash2, X, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { fetchApi } from "@/lib/api";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}

const API = "http://127.0.0.1:5000/api/categories";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [editingId, setEditingId] = useState<string | null>(null); // null = add mode
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await fetchApi("/categories");
      const data = await res.json();
      setCategories(data);
    } catch {
      toast.error("Không thể tải danh mục");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  // Switch to edit mode for a category
  const startEdit = (cat: Category) => {
    setEditingId(cat._id);
    setName(cat.name);
    setDesc(cat.description ?? "");
  };

  // Switch to add mode
  const startAdd = () => {
    setEditingId(null);
    setName("");
    setDesc("");
  };

  const handleDelete = async (id: string, catName: string) => {
    if (!confirm(`Xóa danh mục "${catName}"?`)) return;
    try {
      const res = await fetchApi(`/categories/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c._id !== id));
        if (editingId === id) startAdd();
        toast.success("Đã xóa danh mục");
      } else {
        toast.error("Xóa thất bại");
      }
    } catch {
      toast.error("Lỗi kết nối");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      if (editingId) {
        // UPDATE
        const res = await fetchApi(`/categories/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim(), description: desc }),
        });
        if (res.ok) {
          const updated: Category = await res.json();
          setCategories((prev) =>
            prev.map((c) => (c._id === editingId ? updated : c))
          );
          toast.success("Đã cập nhật danh mục");
          startAdd();
        } else {
          toast.error("Cập nhật thất bại");
        }
      } else {
        // CREATE
        const res = await fetchApi(`/categories`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim(), description: desc }),
        });
        if (res.ok) {
          setName("");
          setDesc("");
          fetchCategories();
          toast.success("Đã thêm danh mục");
        } else {
          toast.error("Thêm thất bại");
        }
      }
    } catch {
      toast.error("Lỗi kết nối");
    } finally {
      setSaving(false);
    }
  };

  const isEditMode = editingId !== null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-full">
      {/* Category List */}
      <div className="md:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">Danh mục sản phẩm</h1>
          <button
            onClick={startAdd}
            className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            <Plus size={16} /> Thêm mới
          </button>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm border-y border-gray-200">
                  <th className="py-3 px-4 font-semibold">Tên danh mục</th>
                  <th className="py-3 px-4 font-semibold">Đường dẫn (Slug)</th>
                  <th className="py-3 px-4 font-semibold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan={3} className="py-8 text-center text-gray-400">Đang tải...</td></tr>
                ) : categories.length === 0 ? (
                  <tr><td colSpan={3} className="py-8 text-center text-gray-400">Chưa có danh mục.</td></tr>
                ) : (
                  categories.map((cat) => (
                    <tr
                      key={cat._id}
                      className={`transition-colors ${editingId === cat._id ? "bg-red-50 border-l-2 border-primary" : "hover:bg-gray-50"}`}
                    >
                      <td className="py-3 px-4 text-sm font-semibold text-gray-900">{cat.name}</td>
                      <td className="py-3 px-4 text-sm text-gray-500 font-mono">{cat.slug}</td>
                      <td className="py-3 px-4 text-right flex items-center justify-end gap-1">
                        <button
                          onClick={() => startEdit(cat)}
                          className={`p-1.5 rounded transition-colors ${editingId === cat._id ? "bg-primary text-white" : "text-blue-600 hover:bg-blue-50"}`}
                          title="Chỉnh sửa"
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(cat._id, cat.name)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                          title="Xóa"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add / Edit Panel */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 self-start overflow-hidden">
        {/* Panel header */}
        <div className={`p-6 border-b border-gray-200 flex items-center justify-between ${isEditMode ? "bg-red-50" : ""}`}>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            {isEditMode ? (
              <><Edit size={18} className="text-primary" /> Chỉnh sửa danh mục</>
            ) : (
              <><Plus size={18} className="text-primary" /> Thêm danh mục mới</>
            )}
          </h2>
          {isEditMode && (
            <button
              onClick={startAdd}
              className="p-1 text-gray-400 hover:text-gray-700 rounded"
              title="Hủy chỉnh sửa"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isEditMode && (
              <div className="text-xs text-gray-400 bg-gray-50 rounded-md px-3 py-2 font-mono border border-dashed border-gray-200">
                Đang chỉnh sửa: <span className="font-semibold text-gray-600">{categories.find(c => c._id === editingId)?.slug}</span>
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Tên danh mục *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                placeholder="VD: Laptop Gaming"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Mô tả</label>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm resize-none"
                placeholder="Mô tả ngắn về danh mục..."
              />
            </div>
            <div className="flex gap-2 pt-1">
              {isEditMode && (
                <button
                  type="button"
                  onClick={startAdd}
                  className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-md font-semibold text-sm hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
              )}
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-primary hover:bg-red-700 disabled:opacity-60 text-white py-2 rounded-md font-semibold transition-colors text-sm"
              >
                {saving ? "Đang lưu..." : isEditMode ? "Lưu thay đổi" : "Tạo danh mục"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
