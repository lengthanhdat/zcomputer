"use client";

import { useState, useMemo } from "react";
import { ChevronRight, ChevronDown, FolderTree, X, Check } from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
  parent_id?: string | null;
}

interface Props {
  categories: Category[];
  selectedId: string | null;
  onChange: (id: string) => void;
  excludeId?: string | null; // ID to exclude from selection (and its descendants)
  placeholder?: string;
}

export default function CategoryPickerModal({ categories, selectedId, onChange, excludeId, placeholder = "-- Trống (Không chọn) --" }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const invalidIds = useMemo(() => {
    if (!excludeId) return new Set<string>();
    const ids = new Set<string>();
    ids.add(excludeId);
    let added = true;
    while (added) {
      added = false;
      for (const cat of categories) {
        if (cat.parent_id && ids.has(cat.parent_id) && !ids.has(cat._id)) {
          ids.add(cat._id);
          added = true;
        }
      }
    }
    return ids;
  }, [categories, excludeId]);

  const rootCategories = categories.filter(c => !c.parent_id && !invalidIds.has(c._id));

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSet = new Set(expandedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedIds(newSet);
  };

  const handleSelect = (id: string) => {
    onChange(id);
    setIsOpen(false);
  };

  const renderTree = (cat: Category, depth: number) => {
    const children = categories.filter(c => c.parent_id === cat._id && !invalidIds.has(c._id));
    const hasChildren = children.length > 0;
    const isExpanded = expandedIds.has(cat._id);
    const isSelected = selectedId === cat._id;

    return (
      <div key={cat._id} className="w-full">
        <div 
          onClick={() => handleSelect(cat._id)}
          className={`flex items-center w-full py-2 px-3 rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-gray-50 text-gray-700'}`}
          style={{ paddingLeft: `${depth * 1.5 + 0.75}rem` }}
        >
          <div className="w-6 h-6 flex items-center justify-center mr-1 shrink-0">
            {hasChildren ? (
              <button 
                type="button"
                onClick={(e) => toggleExpand(cat._id, e)}
                className="w-full h-full flex items-center justify-center rounded hover:bg-gray-200 text-gray-500"
              >
                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
            ) : (
              <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
            )}
          </div>
          <span className="flex-1 text-sm">{cat.name}</span>
          {isSelected && <Check size={16} className="text-primary shrink-0" />}
        </div>
        
        {hasChildren && isExpanded && (
          <div className="w-full animate-in slide-in-from-top-1 fade-in duration-200">
            {children.map(child => renderTree(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const selectedCat = categories.find(c => c._id === selectedId);

  return (
    <>
      <div 
        onClick={() => setIsOpen(true)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md cursor-pointer flex justify-between items-center bg-white hover:border-primary transition-colors focus:ring-1 focus:ring-primary outline-none"
      >
        <span className={`text-sm ${selectedCat ? "text-gray-900 font-medium" : "text-gray-500"}`}>
          {selectedCat ? selectedCat.name : placeholder}
        </span>
        <FolderTree size={16} className="text-gray-400" />
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden max-h-[85vh]">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <FolderTree size={18} className="text-primary" />
                Chọn danh mục
              </h3>
              <button 
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              <div 
                onClick={() => handleSelect("")}
                className={`flex items-center w-full py-2.5 px-3 rounded-lg cursor-pointer transition-colors ${!selectedId ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-gray-50 text-gray-500 italic'}`}
              >
                <div className="w-6 h-6 mr-1 shrink-0"></div>
                <span className="flex-1 text-sm">{placeholder}</span>
                {!selectedId && <Check size={16} className="text-primary shrink-0" />}
              </div>

              {rootCategories.length > 0 ? (
                rootCategories.map(cat => renderTree(cat, 0))
              ) : (
                <div className="text-center py-8 text-gray-400 text-sm">
                  Không có danh mục nào hợp lệ
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
}
