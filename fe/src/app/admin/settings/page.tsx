"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Settings, Zap, Save, Palette, Check } from "lucide-react";
import { fetchApi } from "@/lib/api";
import { THEME_PRESETS, type ThemeKey } from "@/lib/theme";

export default function SettingsPage() {
  const [flashSaleEnd, setFlashSaleEnd] = useState("");
  const [loading, setLoading] = useState(false);
  const [savingFlashSale, setSavingFlashSale] = useState(false);

  // Theme state
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>("red");
  const [selectedTheme, setSelectedTheme] = useState<ThemeKey>("red");
  const [savingTheme, setSavingTheme] = useState(false);
  const [loadingTheme, setLoadingTheme] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchApi("/settings/flash_sale_end_time", { requireAuth: false })
      .then(res => res.json())
      .then(flashSaleData => {
        if (flashSaleData && flashSaleData.value) {
          const date = new Date(flashSaleData.value);
          const tzoffset = date.getTimezoneOffset() * 60000;
          const localISOTime = (new Date(date.getTime() - tzoffset)).toISOString().slice(0, 16);
          setFlashSaleEnd(localISOTime);
        }
      })
      .catch(() => null)
      .finally(() => setLoading(false));

    // Fetch current theme
    fetchApi("/settings/theme_color", { requireAuth: false })
      .then(res => res.json())
      .then(data => {
        const t = (data?.value ?? "red") as ThemeKey;
        setCurrentTheme(t);
        setSelectedTheme(t);
      })
      .catch(() => null)
      .finally(() => setLoadingTheme(false));
  }, []);

  const handleSaveFlashSale = async () => {
    if (!flashSaleEnd) return toast.error("Vui lòng chọn thời gian kết thúc!");
    
    setSavingFlashSale(true);
    try {
      const date = new Date(flashSaleEnd);
      const res = await fetchApi("/settings/flash_sale_end_time", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: date.toISOString() })
      });
      
      if (res.ok) {
        toast.success("Cập nhật thời gian Flash Sale thành công!");
      } else {
        toast.error("Lỗi khi cập nhật cài đặt");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi kết nối");
    } finally {
      setSavingFlashSale(false);
    }
  };

  const handleSaveTheme = async () => {
    setSavingTheme(true);
    try {
      const res = await fetchApi("/settings/theme_color", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: selectedTheme }),
      });

      if (res.ok) {
        setCurrentTheme(selectedTheme);
        // Apply immediately to current page for preview
        const preset = THEME_PRESETS[selectedTheme];
        document.documentElement.style.setProperty("--primary", preset.primary);
        document.documentElement.style.setProperty("--primary-hover", preset.hover);
        document.documentElement.style.setProperty("--primary-light", preset.light);
        document.documentElement.style.setProperty("--primary-ring", preset.ring);
        document.documentElement.style.setProperty("--primary-gradient", preset.gradient);
        toast.success(`Đã đổi màu sang ${preset.name}! Người dùng sẽ thấy sau khi reload.`, {
          duration: 4000,
          icon: "🎨",
        });
      } else {
        toast.error("Lỗi khi lưu màu sắc");
      }
    } catch {
      toast.error("Đã xảy ra lỗi kết nối");
    } finally {
      setSavingTheme(false);
    }
  };

  const themeKeys = Object.keys(THEME_PRESETS) as ThemeKey[];
  // Safety: always fallback to red if selectedTheme key doesn't exist
  const activePreset = THEME_PRESETS[selectedTheme] ?? THEME_PRESETS.red;


  return (
    <div className="pb-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-white shadow-sm border border-gray-200 rounded-xl">
          <Settings size={24} className="text-gray-700" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Cài đặt chung</h1>
          <p className="text-sm font-medium text-gray-500 mt-1">Quản lý các cấu hình hiển thị của website</p>
        </div>
      </div>

      <div className="space-y-6 max-w-3xl">
        {/* ── Theme Color ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
            <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center text-violet-500">
              <Palette size={18} />
            </div>
            <h2 className="text-lg font-bold text-gray-800">Màu chủ đạo giao diện</h2>
          </div>

          {loadingTheme ? (
            <div className="animate-pulse grid grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-100 rounded-2xl" />
              ))}
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-5">
                Chọn một bộ màu bên dưới. Thay đổi sẽ được áp dụng ngay trên trang admin và có hiệu lực với người dùng sau khi họ tải lại trang.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                {themeKeys.map((key) => {
                  const preset = THEME_PRESETS[key];
                  const isSelected = selectedTheme === key;
                  const isCurrent = currentTheme === key;

                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedTheme(key)}
                      className={`relative group rounded-2xl border-2 p-4 text-left transition-all duration-200 ${
                        isSelected
                          ? "border-transparent shadow-lg scale-[1.02]"
                          : "border-gray-100 hover:border-gray-200 hover:shadow-md"
                      }`}
                      style={
                        isSelected
                          ? { borderColor: preset.primary, boxShadow: `0 8px 24px ${preset.ring}` }
                          : {}
                      }
                    >
                      {/* Color swatch */}
                      <div
                        className="w-full h-10 rounded-xl mb-3 flex items-center justify-center"
                        style={{ background: preset.gradient }}
                      >
                        {isSelected && (
                          <Check size={18} className="text-white drop-shadow" strokeWidth={3} />
                        )}
                      </div>

                      {/* Name */}
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-bold text-gray-800">{preset.emoji} {preset.name}</span>
                          <div className="text-[10px] font-mono text-gray-400 mt-0.5">{preset.primary}</div>
                        </div>
                        {isCurrent && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                            style={{ backgroundColor: preset.light, color: preset.primary }}>
                            Hiện tại
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Preview bar */}
              <div className="mb-6 p-4 rounded-xl border border-gray-100 bg-gray-50">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Xem trước</p>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    className="px-5 py-2 rounded-lg text-white text-sm font-bold transition-all"
                    style={{ backgroundColor: activePreset.primary }}
                  >
                    Nút chính
                  </button>
                  <button
                    className="px-5 py-2 rounded-lg text-sm font-bold border-2 transition-all"
                    style={{
                      borderColor: activePreset.primary,
                      color: activePreset.primary,
                      backgroundColor: activePreset.light,
                    }}
                  >
                    Nút phụ
                  </button>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold"
                    style={{
                      backgroundColor: activePreset.light,
                      color: activePreset.primary,
                    }}
                  >
                    Badge / Tag
                  </span>
                  <span
                    className="text-sm font-black"
                    style={{ color: activePreset.primary }}
                  >
                    Giá: 15.000.000₫
                  </span>
                </div>
              </div>

              <button
                onClick={handleSaveTheme}
                disabled={savingTheme || selectedTheme === currentTheme}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: activePreset.primary }}
              >
                <Save size={18} />
                {savingTheme ? "Đang lưu..." : selectedTheme === currentTheme ? "Đang áp dụng" : `Áp dụng màu ${activePreset.name}`}
              </button>
            </>
          )}
        </div>

        {/* ── Flash Sale ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500">
              <Zap size={18} className="fill-orange-500" />
            </div>
            <h2 className="text-lg font-bold text-gray-800">Quản lý sự kiện Flash Sale</h2>
          </div>
          
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded w-1/2"></div>
              <div className="h-10 bg-gray-200 rounded w-32 mt-6"></div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Thời gian kết thúc đếm ngược <span className="text-primary">*</span></label>
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <input
                    type="datetime-local"
                    value={flashSaleEnd}
                    onChange={(e) => setFlashSaleEnd(e.target.value)}
                    className="w-full md:w-[300px] px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-medium text-gray-700"
                  />
                  <button
                    onClick={handleSaveFlashSale}
                    disabled={savingFlashSale}
                    className="flex items-center justify-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors disabled:opacity-50 w-full md:w-auto"
                  >
                    <Save size={18} />
                    {savingFlashSale ? "Đang lưu..." : "Lưu thời gian"}
                  </button>
                </div>
                <div className="mt-3 p-4 bg-blue-50/50 rounded-xl border border-blue-100 text-sm text-blue-700 leading-relaxed">
                  <strong>Lưu ý:</strong> Đồng hồ đếm ngược trên trang chủ ở mục Flash Sale sẽ tự động tính toán từ thời điểm hiện tại đến thời gian này. Khi hết thời gian, đồng hồ sẽ tự động hiển thị <strong>00:00:00</strong>.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
