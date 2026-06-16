"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, ShieldCheck, Mail, Phone, LogOut, Settings, Save, Edit2, Loader2, CheckCircle2 } from "lucide-react";
import { fetchApi } from "@/lib/api";

export default function ProfilePage() {
  const { user, updateUser, token } = useAuthStore();
  const router = useRouter();
  
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [phoneInput, setPhoneInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else {
      if (user.phone) setPhoneInput(user.phone);
    }
  }, [user, router]);

  const handleLogout = () => {
    useAuthStore.getState().logout();
    router.push("/login");
  };

  const handleSavePhone = async () => {
    try {
      setIsSaving(true);
      const res = await fetchApi('/users/profile', {
        method: 'PUT',
        requireAuth: true,
        body: JSON.stringify({ phone: phoneInput })
      });

      if (res.ok) {
        const updatedUser = await res.json();
        updateUser({ phone: updatedUser.phone });
        setSaveSuccess(true);
        setIsEditingPhone(false);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Lỗi cập nhật số điện thoại", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-[#f8f9fa] min-h-screen py-10 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-red-50 to-transparent -z-10 pointer-events-none"></div>
      <div className="absolute top-20 right-20 w-96 h-96 bg-red-400/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-400/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-8 uppercase tracking-tight relative inline-block">
          Hồ sơ của tôi
          <div className="absolute -bottom-2 left-0 w-1/2 h-1.5 bg-primary rounded-full"></div>
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-1/3 xl:w-1/4">
            <div className="bg-white/70 backdrop-blur-2xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              
              <div className="p-8 border-b border-gray-100/50 flex flex-col items-center text-center relative z-10">
                <div className="w-28 h-28 bg-gradient-to-tr from-red-500 to-orange-400 text-white rounded-full flex items-center justify-center mb-5 shadow-[0_10px_25px_rgba(239,68,68,0.3)] relative group-hover:scale-105 transition-transform duration-500">
                  <User size={48} strokeWidth={1.5} />
                  <div className="absolute inset-0 rounded-full border-[4px] border-white/20"></div>
                </div>
                <h2 className="text-2xl font-black text-gray-900 drop-shadow-sm">{user.name}</h2>
                <p className="text-sm text-gray-500 mt-1 font-medium">{user.email}</p>
                <div className="mt-4 inline-flex items-center gap-1.5 px-4 py-1.5 bg-red-50/80 backdrop-blur-sm text-red-600 rounded-full text-[11px] font-black uppercase tracking-widest border border-red-100 shadow-sm">
                  {user.role === 'admin' ? <ShieldCheck size={14} /> : <User size={14} />}
                  {user.role === 'admin' ? 'Quản trị viên' : user.role === 'staff' ? 'Nhân viên' : 'Khách hàng'}
                </div>
              </div>

              <div className="p-4 relative z-10 space-y-2">
                <button
                  className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold transition-all duration-300 bg-gradient-to-r from-red-600 to-red-500 text-white shadow-[0_5px_15px_rgba(220,38,38,0.3)] translate-x-2"
                >
                  <User size={20} strokeWidth={2.5} />
                  Thông tin cá nhân
                </button>

                <div className="pt-4 mt-2 border-t border-gray-100/50">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-all duration-300 border border-dashed border-gray-200 hover:border-gray-300"
                  >
                    <LogOut size={18} />
                    Đăng xuất
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full lg:w-2/3 xl:w-3/4">
            <div className="bg-white/70 backdrop-blur-2xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white p-6 md:p-10 min-h-[500px]">
              
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-black text-gray-900">Chi tiết tài khoản</h3>
                  {saveSuccess && (
                    <div className="flex items-center gap-2 text-sm font-bold text-green-600 bg-green-50 px-4 py-2 rounded-full animate-in fade-in zoom-in duration-300">
                      <CheckCircle2 size={16} /> Đã lưu thành công
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
                  <div className="group">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2 mb-2 ml-1">
                      <User size={14} /> Họ và tên
                    </label>
                    <div className="p-4 bg-gray-50/80 group-hover:bg-white rounded-2xl border border-gray-100 group-hover:border-red-100 text-gray-800 font-semibold transition-all duration-300 group-hover:shadow-[0_4px_15px_rgba(220,38,38,0.05)]">
                      {user.name}
                    </div>
                  </div>
                  
                  <div className="group">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2 mb-2 ml-1">
                      <Mail size={14} /> Địa chỉ Email
                    </label>
                    <div className="p-4 bg-gray-50/80 group-hover:bg-white rounded-2xl border border-gray-100 group-hover:border-red-100 text-gray-800 font-semibold transition-all duration-300 group-hover:shadow-[0_4px_15px_rgba(220,38,38,0.05)]">
                      {user.email}
                    </div>
                  </div>

                  <div className="group md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center justify-between gap-2 mb-2 ml-1">
                      <div className="flex items-center gap-2">
                        <Phone size={14} /> Số điện thoại
                      </div>
                      {!isEditingPhone && (
                        <button 
                          onClick={() => setIsEditingPhone(true)}
                          className="text-primary hover:text-red-700 flex items-center gap-1 text-[11px]"
                        >
                          <Edit2 size={12} /> Thay đổi
                        </button>
                      )}
                    </label>
                    
                    {isEditingPhone ? (
                      <div className="flex items-center gap-3">
                        <input 
                          type="text" 
                          value={phoneInput}
                          onChange={(e) => setPhoneInput(e.target.value)}
                          placeholder="Nhập số điện thoại của bạn..."
                          className="flex-1 p-4 bg-white rounded-2xl border border-red-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 text-gray-800 font-semibold transition-all duration-300 outline-none shadow-[0_4px_15px_rgba(220,38,38,0.05)]"
                          autoFocus
                        />
                        <button 
                          onClick={handleSavePhone}
                          disabled={isSaving}
                          className="px-6 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-red-700 transition-colors flex items-center gap-2 shadow-[0_4px_15px_rgba(220,38,38,0.2)] disabled:opacity-70"
                        >
                          {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                          Lưu
                        </button>
                        <button 
                          onClick={() => {
                            setIsEditingPhone(false);
                            setPhoneInput(user.phone || "");
                          }}
                          className="px-6 py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-colors"
                        >
                          Hủy
                        </button>
                      </div>
                    ) : (
                      <div className="p-4 bg-gray-50/80 group-hover:bg-white rounded-2xl border border-gray-100 group-hover:border-red-100 text-gray-800 font-semibold transition-all duration-300 group-hover:shadow-[0_4px_15px_rgba(220,38,38,0.05)]">
                        {user.phone || <span className="text-gray-400 italic font-medium">Chưa cập nhật số điện thoại</span>}
                      </div>
                    )}
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
