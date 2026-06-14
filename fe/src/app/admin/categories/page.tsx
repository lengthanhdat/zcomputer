"use client";

import { useEffect, useState } from "react";
import { Edit, Trash2, X, Plus, GripVertical } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import toast from "react-hot-toast";
import { fetchApi } from "@/lib/api";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string | null;
  image?: string;
}

const API = "http://127.0.0.1:5000/api/categories";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [editingId, setEditingId] = useState<string | null>(null); // null = add mode
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [parentId, setParentId] = useState<string>("");
  const [image, setImage] = useState("");
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

  const onDragEnd = async (result: any) => {
    if (!result.destination) return;
    const items = Array.from(categories);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setCategories(items); // Optimistic UI update

    const payload = items.map((cat, index) => ({ id: cat._id, order: index }));
    try {
      const res = await fetchApi('/categories/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: payload })
      });
      if (!res.ok) throw new Error();
      toast.success("Đã lưu vị trí mới");
    } catch {
      toast.error("Lỗi khi lưu vị trí");
      fetchCategories(); // Revert
    }
  };

  // Switch to edit mode for a category
  const startEdit = (cat: Category) => {
    setEditingId(cat._id);
    setName(cat.name);
    setDesc(cat.description ?? "");
    setParentId(cat.parent_id ?? "");
    setImage(cat.image ?? "");
  };

  // Switch to add mode
  const startAdd = () => {
    setEditingId(null);
    setName("");
    setDesc("");
    setParentId("");
    setImage("");
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append("image", file);
    const toastId = toast.loading("Đang tải ảnh lên...");

    try {
      const res = await fetchApi("/upload/image", {
        method: "POST",
        body: data,
      });
      const result = await res.json();
      if (res.ok) {
        setImage(result.url);
        toast.success("Tải ảnh lên thành công", { id: toastId });
      } else {
        toast.error(result.message || "Tải ảnh thất bại", { id: toastId });
      }
    } catch (error) {
      toast.error("Lỗi kết nối khi tải ảnh", { id: toastId });
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
          body: JSON.stringify({ name: name.trim(), description: desc, parent_id: parentId || null, image }),
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
          body: JSON.stringify({ name: name.trim(), description: desc, parent_id: parentId || null, image }),
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
                  <th className="py-3 px-4 font-semibold w-10"></th>
                  <th className="py-3 px-4 font-semibold w-1/3">Tên danh mục</th>
                  <th className="py-3 px-4 font-semibold text-center">Danh mục cha</th>
                  <th className="py-3 px-4 font-semibold">Đường dẫn (Slug)</th>
                  <th className="py-3 px-4 font-semibold text-right">Thao tác</th>
                </tr>
              </thead>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="categories">
                  {(provided) => (
                    <tbody
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="divide-y divide-gray-100"
                    >
                      {loading ? (
                        <tr><td colSpan={5} className="py-8 text-center text-gray-400">Đang tải...</td></tr>
                      ) : categories.length === 0 ? (
                        <tr><td colSpan={5} className="py-8 text-center text-gray-400">Chưa có danh mục.</td></tr>
                      ) : (
                        categories.map((cat, index) => (
                          <Draggable key={cat._id} draggableId={cat._id} index={index}>
                            {(provided, snapshot) => (
                              <tr
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`transition-colors ${editingId === cat._id ? "bg-red-50 border-l-2 border-primary" : "hover:bg-gray-50"} ${snapshot.isDragging ? "bg-blue-50 shadow-lg z-50 table" : ""}`}
                                style={provided.draggableProps.style}
                              >
                                <td className="py-3 px-4 w-10">
                                  <div {...provided.dragHandleProps} className="cursor-grab text-gray-400 hover:text-gray-600 active:cursor-grabbing outline-none">
                                    <GripVertical size={16} />
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                                  {cat.parent_id && <span className="text-gray-400 font-normal mr-2">|_</span>}
                                  {cat.name}
                                </td>
                                <td className="py-3 px-4 text-sm text-center text-gray-500">
                                  {cat.parent_id ? categories.find(c => c._id === cat.parent_id)?.name || "---" : "---"}
                                </td>
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
                            )}
                          </Draggable>
                        ))
                      )}
                      {provided.placeholder}
                    </tbody>
                  )}
                </Droppable>
              </DragDropContext>
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
              <label className="text-sm font-semibold text-gray-700">Danh mục cha (Không bắt buộc)</label>
              <select
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm bg-white"
              >
                <option value="">-- Trống (Đây là danh mục lớn) --</option>
                {categories.filter(c => c._id !== editingId && !c.parent_id).map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
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
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Ảnh Banner Danh Mục</label>
              <div className="flex flex-col gap-2">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                <div className="flex items-center gap-3 mt-1">
                  {image && (
                    <img src={image.startsWith('http') || image.startsWith('data:') ? image : `http://localhost:5000${image}`} alt="Preview" className="h-12 w-12 object-cover rounded border flex-shrink-0" />
                  )}
                  <input className="flex-1 border border-gray-300 px-4 py-2 rounded-md text-sm outline-none focus:border-primary" value={image} onChange={e => setImage(e.target.value)} placeholder="Hoặc dán URL ảnh trực tiếp..." />
                </div>
              </div>
            </div>
            
            <div className="pt-2 flex gap-3">
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
