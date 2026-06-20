import React from "react";
import Link from "next/link";
import { Gift, DollarSign, Share2, Sparkles, CheckCircle2, ChevronRight, MessageCircle, AlertCircle, Users, Cpu, ShieldCheck, Zap } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giới thiệu bạn bè - Rinh ngay tiền mặt | ZComputer",
  description: "Rủ bạn bè mua sắm tại ZComputer, cả hai cùng vui với phần quà tiền mặt lên đến 500.000đ. Nhận tiền siêu tốc trong 24h!",
};

export default function ReferFriendPage() {
  return (
    <div className="min-h-screen bg-[#030303] text-white selection:bg-red-600 selection:text-white font-sans overflow-hidden">
      
      {/* Dynamic Backgrounds */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-red-600/10 rounded-full blur-[150px] mix-blend-screen animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-orange-600/10 rounded-full blur-[150px] mix-blend-screen opacity-70"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02]"></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-32 z-10">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
            
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#111] border border-white/10 rounded-full text-xs font-black uppercase tracking-widest mb-8 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                CHƯƠNG TRÌNH: CÙNG MUA CÙNG VUI
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-6">
                GIỚI THIỆU BẠN HIỀN <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500">
                  NHẬN TIỀN LÌ XÌ LIỀN!
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-400 mb-10 font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Chỉ một câu mách nhỏ đưa bạn bè đến ZComputer sắm PC xịn, bạn sẽ được "ting ting" ngay khoản tiền cảm ơn lên đến <strong className="text-white font-black bg-red-500/20 px-2 py-0.5 rounded text-red-400">500.000 VNĐ</strong> vào tài khoản!
              </p>
              
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-12">
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-sm text-gray-300 backdrop-blur-sm">
                  <DollarSign size={16} className="text-green-500" /> Thanh toán 24h
                </div>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-sm text-gray-300 backdrop-blur-sm">
                  <Users size={16} className="text-orange-500" /> Không giới hạn lượt
                </div>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-sm text-gray-300 backdrop-blur-sm">
                  <CheckCircle2 size={16} className="text-blue-500" /> Thủ tục cực dễ
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5">
                <Link 
                  href="https://zalo.me/0977334415" 
                  target="_blank" 
                  className="w-full sm:w-auto relative group overflow-hidden flex items-center justify-center gap-3 bg-red-600 text-white px-10 py-4 rounded-xl font-black text-lg transition-all shadow-[0_0_30px_rgba(239,68,68,0.3)] hover:shadow-[0_0_50px_rgba(239,68,68,0.6)] hover:-translate-y-1"
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                  <MessageCircle size={22} className="relative z-10" />
                  <span className="relative z-10">NHẮN TIN NGAY</span>
                </Link>
                <Link 
                  href="#reward-table" 
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-lg text-gray-300 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-all"
                >
                  Xem Bảng Thưởng <ChevronRight size={20} />
                </Link>
              </div>
            </div>

            {/* Right Content - 3D Mockup */}
            <div className="flex-1 relative w-full max-w-lg lg:max-w-none mt-10 lg:mt-0">
              <div className="relative w-full aspect-square flex items-center justify-center">
                {/* Decorative Elements */}
                <div className="absolute inset-0 border border-white/10 rounded-full animate-[spin_20s_linear_infinite] opacity-50"></div>
                <div className="absolute inset-4 border border-red-500/20 rounded-full animate-[spin_15s_linear_infinite_reverse] opacity-50"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-red-600/30 rounded-full blur-[80px]"></div>
                
                {/* Floating Image */}
                <img 
                  src="/hero-clean.png" 
                  alt="PC ZComputer" 
                  className="relative z-10 w-[110%] max-w-[120%] h-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] animate-float"
                />

                {/* Floating Badge */}
                <div className="absolute -bottom-4 right-0 lg:-right-10 bg-[#111]/90 backdrop-blur-xl border border-red-500/30 p-5 rounded-2xl shadow-2xl flex items-center gap-4 z-20 hover:scale-105 transition-transform">
                  <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center text-white shadow-inner">
                    <Gift size={28} />
                  </div>
                  <div>
                    <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Tiền thưởng lên tới</div>
                    <div className="text-white font-black text-3xl">500<span className="text-lg text-red-500">K</span></div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Modern 3 Steps */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4 text-white">
              3 Bước Nhận Quà <span className="text-red-500">Thần Tốc</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">Vô cùng đơn giản, không cần tải app hay đăng ký tài khoản rườm rà.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#0f0f0f] border border-white/5 p-8 md:p-10 rounded-[2rem] hover:bg-[#151515] hover:border-red-500/30 transition-all duration-300 group">
              <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Share2 size={32} />
              </div>
              <div className="text-4xl font-black text-white/5 absolute top-8 right-8 pointer-events-none">01</div>
              <h3 className="text-2xl font-black mb-3 text-white">Rủ Bạn Bè</h3>
              <p className="text-gray-400 leading-relaxed">Gửi link sản phẩm, cửa hàng ZComputer cho bạn bè, người thân đang muốn mua sắm.</p>
            </div>

            <div className="bg-[#0f0f0f] border border-white/5 p-8 md:p-10 rounded-[2rem] hover:bg-[#151515] hover:border-orange-500/30 transition-all duration-300 group">
              <div className="w-16 h-16 bg-orange-500/10 text-orange-500 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <MessageCircle size={32} />
              </div>
              <div className="text-4xl font-black text-white/5 absolute top-8 right-8 pointer-events-none">02</div>
              <h3 className="text-2xl font-black mb-3 text-white">Báo Số Điện Thoại</h3>
              <p className="text-gray-400 leading-relaxed">Khi bạn bè của bạn thanh toán xong, chỉ cần đọc <strong>SĐT của bạn</strong> cho nhân viên tư vấn.</p>
            </div>

            <div className="bg-[#0f0f0f] border border-white/5 p-8 md:p-10 rounded-[2rem] hover:bg-[#151515] hover:border-green-500/30 transition-all duration-300 group">
              <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <DollarSign size={32} />
              </div>
              <div className="text-4xl font-black text-white/5 absolute top-8 right-8 pointer-events-none">03</div>
              <h3 className="text-2xl font-black mb-3 text-white">Ting Ting Chuyển Khoản</h3>
              <p className="text-gray-400 leading-relaxed">Shop sẽ ghi nhận và chủ động liên hệ chuyển khoản tiền thưởng trực tiếp cho bạn cực nhanh chóng.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gamified Reward Cards */}
      <section id="reward-table" className="py-24 relative z-10 bg-[#0a0a0a] border-y border-white/5">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4 text-white">
              Phần Thưởng <span className="text-red-500">Cực Ngon</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">Tùy theo cấu hình máy bạn bè chốt đơn, mức thưởng của bạn sẽ tự động nhảy số.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1 */}
            <div className="bg-gradient-to-b from-[#151515] to-black border border-white/10 rounded-[2rem] p-8 hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden group">
              <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center mb-6 text-gray-400 group-hover:bg-gray-800 transition-colors">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-2">Mức Văn Phòng</h3>
              <div className="text-3xl font-black text-white mb-6">100.000<span className="text-base text-gray-500">đ</span></div>
              <p className="text-gray-400 font-medium">Bạn bè mua <strong>PC / Laptop Văn Phòng cơ bản</strong>.</p>
            </div>

            {/* Card 2 */}
            <div className="bg-gradient-to-b from-[#1a1810] to-black border border-yellow-900/30 rounded-[2rem] p-8 hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden group">
              <div className="w-14 h-14 bg-yellow-500/10 rounded-full flex items-center justify-center mb-6 text-yellow-500 group-hover:bg-yellow-500/20 transition-colors">
                <Zap size={28} />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-yellow-600 mb-2">Mức Gaming</h3>
              <div className="text-3xl font-black text-white mb-6">200.000<span className="text-base text-yellow-600">đ</span></div>
              <p className="text-gray-400 font-medium">Bạn bè mua <strong>PC / Laptop Gaming</strong> (Dưới 20 triệu).</p>
            </div>

            {/* Card 3 */}
            <div className="bg-gradient-to-b from-[#1a1015] to-black border border-pink-900/30 rounded-[2rem] p-8 hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden group">
              <div className="w-14 h-14 bg-pink-500/10 rounded-full flex items-center justify-center mb-6 text-pink-500 group-hover:bg-pink-500/20 transition-colors">
                <Sparkles size={28} />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-pink-600 mb-2">Mức Đồ Họa</h3>
              <div className="text-3xl font-black text-white mb-6">300.000<span className="text-base text-pink-600">đ</span></div>
              <p className="text-gray-400 font-medium">Bạn bè mua <strong>PC Đồ Họa / Gaming</strong> (Từ 20 - 40 triệu).</p>
            </div>

            {/* Card 4 (Diamond/Max) */}
            <div className="bg-gradient-to-b from-red-900/20 to-black border border-red-500/50 rounded-[2rem] p-8 hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden shadow-[0_0_40px_rgba(239,68,68,0.15)] group">
              <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-black px-4 py-1.5 uppercase rounded-bl-xl shadow-lg">TRÙM CUỐI</div>
              <div className="absolute inset-0 bg-gradient-to-tr from-red-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center mb-6 text-white relative z-10 shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                <Cpu size={28} />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-red-500 mb-2 relative z-10">Mức Cao Cấp</h3>
              <div className="text-4xl font-black text-white mb-6 relative z-10">500.000<span className="text-lg text-red-500">đ</span></div>
              <p className="text-gray-300 font-bold relative z-10">Bạn bè mua <strong>PC Workstation / Laptop Cao Cấp</strong> (&gt; 40 triệu).</p>
            </div>

          </div>

          <div className="max-w-3xl mx-auto mt-12 bg-[#111] border border-white/5 p-6 rounded-2xl flex items-start gap-4">
            <AlertCircle size={24} className="text-orange-500 shrink-0" />
            <p className="text-gray-400 text-sm leading-relaxed">
              <strong className="text-white">Lưu ý nhỏ:</strong> Tiền thưởng không áp dụng chung khi sản phẩm đang chạy các chương trình xả kho, thanh lý xập xình với giá vốn (Nhân viên sẽ báo trước thông tin này cho bạn nha).
            </p>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-24 relative z-10 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-8 text-white">
            Chuẩn Bị Sẵn <span className="text-red-500">Mã QR Nhận Tiền</span> Thôi!
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Nhắn ngay cho ZComputer qua Zalo để chúng mình tư vấn cấu hình chuẩn xác nhất cho bạn bè của bạn nhé.
          </p>
          
          <Link 
            href="https://zalo.me/0977334415" 
            target="_blank"
            className="inline-flex bg-red-600 text-white hover:bg-red-500 px-12 py-5 rounded-2xl font-black text-xl transition-all shadow-[0_10px_30px_rgba(239,68,68,0.4)] hover:-translate-y-1 items-center justify-center gap-3"
          >
            <MessageCircle size={24} />
            CHAT VỚI SHOP NGAY
          </Link>
        </div>
      </section>

    </div>
  );
}
