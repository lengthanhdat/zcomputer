"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Giả lập gửi form
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSuccess(true);
    toast.success("Đã gửi tin nhắn thành công!");
    
    // Reset sau 3 giây
    setTimeout(() => {
      setIsSuccess(false);
      setFormData({ name: "", email: "", phone: "", message: "" });
    }, 3000);
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-20">
      {/* Header Banner */}
      <div className="bg-[#111] py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-6">
              LIÊN HỆ <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">ZCOMPUTER</span>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-red-600 to-orange-500 mx-auto mb-8 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.5)]"></div>
            <p className="text-gray-300 text-lg leading-relaxed">
              Chúng tôi luôn sẵn sàng lắng nghe và giải đáp mọi thắc mắc của bạn. Đừng ngần ngại liên hệ với ZComputer qua các kênh dưới đây hoặc để lại tin nhắn cho chúng tôi.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Thông tin liên hệ */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col gap-8 h-full">
              <div>
                <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight mb-6">Thông Tin Liên Hệ</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Chi nhánh Thủ Đức</h4>
                      <p className="text-gray-600 text-sm leading-relaxed mb-3">23 Đường số 1, Phường Linh Xuân, Thủ Đức, TP.HCM</p>
                      
                      <h4 className="font-bold text-gray-900 mb-1">Chi nhánh Bình Thạnh</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">47/86B Bùi Đình Tuý, Phường 14, Q. Bình Thạnh, TP.HCM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                      <Phone size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Hotline tư vấn</h4>
                      <p className="text-gray-600 text-sm leading-relaxed font-bold text-red-600 text-lg">0977 334 415</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                      <Mail size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Email hỗ trợ</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">truong.zvncomputer@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                      <Clock size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Giờ làm việc</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">8:30 - 20:30 (Thứ 2 - Chủ nhật)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Liên Hệ */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 h-full">
              <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight mb-2">Gửi Tin Nhắn Cho Chúng Tôi</h2>
              <p className="text-gray-500 mb-8">Vui lòng điền thông tin vào form bên dưới, đội ngũ tư vấn sẽ liên hệ lại với bạn trong thời gian sớm nhất.</p>

              {isSuccess ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-8 flex flex-col items-center justify-center text-center h-[350px]">
                  <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-green-800 mb-2">Gửi Thành Công!</h3>
                  <p className="text-green-600 max-w-md">Cảm ơn bạn đã liên hệ với ZComputer. Chúng tôi đã nhận được thông tin và sẽ phản hồi trong vòng 24 giờ tới.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Họ và tên <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all bg-gray-50 focus:bg-white"
                        placeholder="Nhập họ và tên của bạn"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Số điện thoại <span className="text-red-500">*</span></label>
                      <input 
                        type="tel" 
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all bg-gray-50 focus:bg-white"
                        placeholder="Nhập số điện thoại"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Email</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all bg-gray-50 focus:bg-white"
                      placeholder="Nhập địa chỉ email của bạn (không bắt buộc)"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Nội dung tin nhắn <span className="text-red-500">*</span></label>
                    <textarea 
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all bg-gray-50 focus:bg-white resize-none"
                      placeholder="Bạn đang quan tâm đến sản phẩm nào hoặc cần hỗ trợ vấn đề gì?"
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full py-4 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-500/30 flex items-center justify-center gap-2 transition-all hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0"
                  >
                    {isSubmitting ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <><Send size={20} /> Gửi Tin Nhắn Ngay</>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Bản đồ */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg border border-gray-100 p-2 overflow-hidden h-[400px]">
          <iframe 
            src="https://maps.google.com/maps?q=Z+Computer-+Pc+Gaming-Laptop-Workstation&t=&z=16&ie=UTF8&iwloc=&output=embed" 
            width="100%" 
            height="100%" 
            style={{ border: 0, borderRadius: '12px' }} 
            allowFullScreen={true} 
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
