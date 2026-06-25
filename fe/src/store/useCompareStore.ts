import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';

export interface CompareItem {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  image: string;
  images?: string[];
  specs?: any;
  slug?: string;
}

interface CompareStore {
  items: CompareItem[];
  isMobileBuyBarVisible: boolean;
  setMobileBuyBarVisible: (visible: boolean) => void;
  addItem: (item: CompareItem) => void;
  removeItem: (id: string) => void;
  clearCompare: () => void;
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      items: [],
      isMobileBuyBarVisible: false,
      setMobileBuyBarVisible: (visible) => set({ isMobileBuyBarVisible: visible }),
      addItem: (item) => {
        const items = get().items;
        if (items.find((i) => i._id === item._id)) {
          toast.error('Sản phẩm đã có trong danh sách so sánh!');
          return;
        }
        if (items.length >= 3) {
          toast.error('Chỉ được so sánh tối đa 3 sản phẩm!');
          return;
        }
        set({ items: [...items, item] });
        toast.success('Đã thêm vào danh sách so sánh');
      },
      removeItem: (id) => set({ items: get().items.filter((i) => i._id !== id) }),
      clearCompare: () => set({ items: [] }),
    }),
    { name: 'compare-storage' }
  )
);
