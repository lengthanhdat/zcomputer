import React from "react";
import Link from "next/link";
import { DollarSign, Clock, ShieldCheck, Laptop, Gamepad2, MonitorPlay, Cpu, PhoneCall, CheckCircle2, ArrowRight, Zap, Recycle, RefreshCcw, FileCheck } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thu Mua Laptop, PC Cũ Giá Cao Nhất Thị Trường | ZComputer",
  description: "ZComputer chuyên thu mua Laptop, PC Gaming, Đồ họa cũ với giá cao nhất. Thu cũ đổi mới trợ giá lên đến 2 Triệu. Thanh toán 1 lần, nhanh gọn.",
};

export default function TradeInPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-primary selection:text-white font-sans">

      {/* Hero Section - Cyberpunk Vibe */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 transform scale-105 animate-[kenburns_20s_ease-in-out_infinite_alternate]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-transparent z-0"></div>
        <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] bg-primary/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

        <div className="container mx-auto px-4 lg:px-20 relative z-10">
          <div className="max-w-3xl pt-20">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 px-6 py-2 bg-primary/20 text-primary border border-primary/30 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-8 backdrop-blur-sm shadow-[0_0_20px_var(--primary-ring)]">
              <Zap size={14} className="animate-pulse" /> CHƯƠNG TRÌNH ĐẶC BIỆT
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight mb-8">
              <span className="block text-white mb-2">THU MUA</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-500 to-yellow-500 pb-2">
                PC & LAPTOP CŨ
              </span>
              <span className="block text-white text-4xl md:text-5xl mt-2">THỦ TỤC NHANH GỌN</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-400 font-medium mb-12 max-w-2xl leading-relaxed border-l-4 border-primary pl-6">
              ZComputer thu mua Laptop & PC Gaming cũ với <strong className="text-white">giá cực tốt</strong>. Đặc biệt trợ giá lên đời thêm tới <strong className="text-yellow-500">2.000.000đ</strong>.
            </p>

            {/* CTA Group */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <Link 
                href="tel:0977334415" 
                className="group relative inline-flex items-center justify-center gap-3 bg-primary hover:bg-primary text-white px-8 py-5 rounded-xl font-black text-lg transition-all duration-300 overflow-hidden shadow-[0_0_40px_var(--primary-ring)] hover:shadow-[0_0_60px_var(--primary-ring)] hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                <PhoneCall size={22} className="relative z-10 animate-bounce" />
                <span className="relative z-10 uppercase tracking-wider">Gọi Định Giá Ngay</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-50 hidden md:flex">
          <span className="text-xs font-bold tracking-widest uppercase">Khám Phá</span>
          <div className="w-1 h-8 bg-gradient-to-b from-white to-transparent rounded-full"></div>
        </div>
      </section>

      {/* Tình Trạng Nhận Thu Mua */}
      <section className="py-20 relative border-t border-white/5 bg-[#0a0a0a]">
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4 text-white">
                Thu Mua <span className="text-primary">Mọi Tình Trạng</span>
              </h2>
              <p className="text-gray-400 text-lg">Từ máy cũ, đến máy nguyên seal, ZComputer đều thu mua với giá tốt nhất.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { icon: Laptop, title: "Laptop Gaming/Văn phòng cũ", color: "from-blue-900/40 to-blue-900/10", border: "border-blue-500/20" },
              { icon: Gamepad2, title: "PC Gaming Đã Qua Sử Dụng", color: "from-primary/20 to-primary/5", border: "border-primary/20" },
              { icon: Cpu, title: "Linh Kiện Lẻ (VGA, CPU, Main)", color: "from-purple-900/40 to-purple-900/10", border: "border-purple-500/20" },
              { icon: Recycle, title: "Máy Lỗi, Hư Hỏng, Xác Máy", color: "from-orange-900/40 to-orange-900/10", border: "border-orange-500/20" }
            ].map((item, idx) => (
              <div key={idx} className={`bg-gradient-to-b ${item.color} border ${item.border} p-8 rounded-3xl text-center hover:scale-[1.03] transition-transform duration-300 cursor-pointer group`}>
                <div className="w-20 h-20 mx-auto bg-black rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:rotate-6 transition-transform">
                  <item.icon size={40} className="text-white" strokeWidth={1.5} />
                </div>
                <h4 className="font-bold text-lg md:text-xl text-white">{item.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chúng Tôi Cam Kết Section */}
      <section className="py-20 relative bg-[#050505]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4 text-white">Chúng Tôi Cam Kết</h2>
            <div className="w-20 h-1.5 bg-primary mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { icon: DollarSign, title: "Giá cao cạnh tranh", desc: "Báo giá chuẩn xác theo tình trạng máy, tuyệt đối không ép giá." },
              { icon: Clock, title: "Thu mua cực nhanh", desc: "Test máy trong 5 phút, thanh toán tiền mặt/chuyển khoản tức thì." },
              { icon: FileCheck, title: "Thủ tục đơn giản", desc: "Chỉ cần mang máy đến, mọi thủ tục chúng tôi lo." },
              { icon: ShieldCheck, title: "Bảo mật thông tin", desc: "Hỗ trợ xóa sạch dữ liệu cũ an toàn tuyệt đối 100%." }
            ].map((item, idx) => (
              <div key={idx} className="bg-[#111] border border-white/5 p-8 rounded-2xl hover:bg-white/5 transition-all duration-300 hover:-translate-y-2 group">
                <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300 group-hover:scale-110">
                  <item.icon size={32} />
                </div>
                <h4 className="text-xl font-bold mb-3 text-white">{item.title}</h4>
                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Thu Mua Đa Dạng Section */}
      <section className="py-20 bg-[#111] border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="container mx-auto px-4 relative z-10 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4 text-white">Thu Mua Đa Dạng</h2>
            <div className="w-20 h-1.5 bg-primary mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Laptop, title: "Laptop Văn Phòng", color: "text-blue-400" },
              { icon: Gamepad2, title: "Laptop Gaming", color: "text-primary" },
              { icon: MonitorPlay, title: "PC Đồ Hoạ Render", color: "text-purple-400" },
              { icon: Cpu, title: "PC Workstation", color: "text-green-400" }
            ].map((item, idx) => (
              <div key={idx} className="bg-black/50 backdrop-blur-sm border border-white/10 p-8 rounded-2xl text-center hover:bg-white/10 transition-all duration-300 group">
                <item.icon size={56} className={`mx-auto mb-6 ${item.color} group-hover:scale-110 transition-transform duration-300`} strokeWidth={1} />
                <h4 className="font-bold text-lg uppercase tracking-wider text-white">{item.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mega CTA */}
      <section className="py-32 relative overflow-hidden bg-[#0a0a0a] border-t border-primary/20">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-primary/20 blur-[120px] rounded-full opacity-50 z-0 pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-8 text-white drop-shadow-xl">
            Liên Hệ Báo Giá
          </h2>
          <p className="text-xl text-white/80 font-medium mb-12 drop-shadow-md">
            Gửi ngay thông tin cấu hình máy để nhận báo giá nhanh chóng nhất.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <Link
              href="tel:0977334415"
              className="w-full sm:w-auto bg-primary text-white hover:brightness-110 px-10 py-5 rounded-2xl font-black text-xl transition-all shadow-[0_0_30px_var(--primary-ring)] flex items-center justify-center gap-3 hover:-translate-y-2"
            >
              <PhoneCall size={24} className="text-white animate-pulse" />
              HOTLINE: 0977 334 415
            </Link>
            <Link
              href="https://zalo.me/0977334415"
              target="_blank"
              className="w-full sm:w-auto bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 px-10 py-5 rounded-2xl font-black text-xl transition-all flex items-center justify-center gap-3 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
            >
              CHAT QUA ZALO NGAY
            </Link>
          </div>
          <p className="mt-8 text-white/60 font-medium">Hỗ trợ tư vấn 24/7 - Hoàn toàn miễn phí</p>
        </div>
      </section>

    </div>
  );
}
