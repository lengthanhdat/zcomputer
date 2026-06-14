import React from "react";
import Link from "next/link";
import { DollarSign, Clock, FileCheck, ShieldCheck, Laptop, Gamepad2, MonitorPlay, Cpu, PhoneCall, ChevronRight, CheckCircle2 } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thu mua Laptop, PC cũ giá cao | ZComputer",
  description: "Dịch vụ thu mua Laptop, PC văn phòng, Gaming, Đồ họa cũ với giá cao cạnh tranh, thủ tục nhanh gọn, uy tín.",
};

export default function TradeInPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-blue-600 selection:text-white">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#050505]">
        {/* Background Image - Gaming Setup Vibe */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-right opacity-20"></div>
        
        {/* Gradient Overlay để làm nổi bật text bên trái */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#030303] via-[#030303]/90 to-transparent"></div>
        
        <div className="container mx-auto px-4 lg:px-20 relative z-10">
          <div className="max-w-3xl pt-20">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-[#0A1A3A] text-blue-400 border border-blue-900/50 rounded-full text-xs font-bold uppercase tracking-widest mb-10">
              <CheckCircle2 size={14} /> THU MUA TẬN NƠI
            </div>
            
            {/* Headline */}
            <h1 className="text-5xl md:text-[80px] font-black leading-[1.05] tracking-tight mb-8">
              <div className="text-white">THU MUA</div>
              <div className="text-[#38BDF8]">LAPTOP & PC CŨ</div>
              <div className="text-white">GIÁ CAO</div>
            </h1>
            
            {/* Subtitle */}
            <div className="border-l-[3px] border-blue-500 pl-5 mb-12">
              <p className="text-xl md:text-2xl text-gray-300 font-light italic">
                "Nhanh chóng - Uy tín - Minh bạch"
              </p>
            </div>
            
            {/* CTA Button */}
            <Link 
              href="tel:0977334415" 
              className="inline-flex items-center justify-center gap-3 bg-[#0EA5E9] hover:bg-[#0284C7] text-white px-8 py-4 rounded-md font-bold text-lg transition-colors shadow-lg shadow-sky-500/30"
            >
              <PhoneCall size={20} />
              LIÊN HỆ BÁO GIÁ NGAY
            </Link>
          </div>
        </div>

        {/* Floating Action Buttons */}
        <div className="fixed right-6 bottom-6 flex flex-col gap-3 z-50">
          <Link href="tel:0977334415" className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform">
            <PhoneCall size={20} />
          </Link>
          <Link href="#" className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg font-bold text-sm hover:scale-110 transition-transform">
            Zalo
          </Link>
          <Link href="#" className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21.1 16.3C21.7 15 22 13.6 22 12c0-5.5-4.5-10-10-10S2 6.5 2 12c0 2.8 1.2 5.4 3.2 7.2.3.3.4.7.3 1.1l-.8 2.6c-.1.4.3.8.7.7l2.8-.9c.4-.1.8 0 1.1.2 1.4.8 3 1.3 4.7 1.3 1.6 0 3.1-.4 4.4-1.1M16 12l-2-2-2 2-2-2"/></svg>
          </Link>
          <Link href="#" className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform animate-pulse">
            <Gamepad2 size={20} />
          </Link>
        </div>
      </section>

      {/* Cam Kết Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4">Chúng Tôi Cam Kết</h2>
            <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { icon: DollarSign, title: "Giá cao cạnh tranh", desc: "Báo giá chuẩn xác theo tình trạng máy, tuyệt đối không ép giá." },
              { icon: Clock, title: "Thu mua cực nhanh", desc: "Test máy trong 5 phút, thanh toán tiền mặt/chuyển khoản tức thì." },
              { icon: FileCheck, title: "Thủ tục đơn giản", desc: "Chỉ cần mang máy đến, mọi thủ tục chúng tôi lo." },
              { icon: ShieldCheck, title: "Bảo mật thông tin", desc: "Hỗ trợ xóa sạch dữ liệu cũ an toàn tuyệt đối 100%." }
            ].map((item, idx) => (
              <div key={idx} className="bg-[#111] border border-white/5 p-8 rounded-2xl hover:bg-white/5 transition-all duration-300 hover:-translate-y-2 group">
                <div className="w-16 h-16 bg-blue-900/30 text-blue-400 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 group-hover:scale-110">
                  <item.icon size={32} />
                </div>
                <h4 className="text-xl font-bold mb-3">{item.title}</h4>
                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Thu Mua Đa Dạng Section */}
      <section className="py-20 bg-[#111] border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[100px]"></div>
        
        <div className="container mx-auto px-4 relative z-10 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4">Thu Mua Đa Dạng</h2>
            <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Laptop, title: "Laptop Văn Phòng", color: "text-blue-400" },
              { icon: Gamepad2, title: "Laptop Gaming", color: "text-red-400" },
              { icon: MonitorPlay, title: "PC Đồ Hoạ Render", color: "text-purple-400" },
              { icon: Cpu, title: "PC Workstation", color: "text-green-400" }
            ].map((item, idx) => (
              <div key={idx} className="bg-black/50 backdrop-blur-sm border border-white/10 p-8 rounded-2xl text-center hover:bg-white/10 transition-all duration-300 group">
                <item.icon size={56} className={`mx-auto mb-6 ${item.color} group-hover:scale-110 transition-transform duration-300`} strokeWidth={1} />
                <h4 className="font-bold text-lg uppercase tracking-wider">{item.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Note & CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 to-cyan-900/40"></div>
        <div className="container mx-auto px-4 relative z-10 max-w-5xl">
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-3xl p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl shadow-yellow-500/20 transform hover:scale-[1.02] transition-transform duration-500">
            <div className="text-yellow-950">
              <h3 className="text-3xl md:text-4xl font-black uppercase mb-4 tracking-tight">
                Không Cần Hộp <br />
                <span className="opacity-80">Không Cần Phụ Kiện</span>
              </h3>
              <p className="text-yellow-900 text-xl font-medium">Chỉ cần máy còn sử dụng là có giá! Thu cũ đổi mới trợ giá ưu đãi cực sâu.</p>
            </div>
            <Link 
              href="tel:0977334415" 
              className="shrink-0 bg-[#0a0a0a] text-white px-10 py-5 rounded-2xl font-black text-xl hover:bg-gray-800 transition-colors flex items-center gap-3 shadow-xl"
            >
              <PhoneCall size={24} />
              GỌI BÁO GIÁ NGAY
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
