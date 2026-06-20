import React from "react";
import Link from "next/link";
import { Gift, DollarSign, Share2, Sparkles, CheckCircle2, ChevronRight, MessageCircle, AlertCircle, Users, Cpu, ShieldCheck, Zap, ShoppingCart } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giới thiệu bạn bè - Rinh ngay tiền mặt | ZComputer",
  description: "Rủ bạn bè mua sắm tại ZComputer, cả hai cùng vui với phần quà tiền mặt lên đến 500.000đ. Nhận tiền siêu tốc trong 24h!",
};

export default function ReferFriendPage() {
  return (
    <div className="min-h-screen bg-[#030303] text-white selection:bg-primary selection:text-white font-sans overflow-hidden">
      
      {/* Dynamic Backgrounds */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-primary/10 rounded-full blur-[150px] mix-blend-screen animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-orange-600/10 rounded-full blur-[150px] mix-blend-screen opacity-70"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02]"></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 z-10 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 bg-black">
          <div className="absolute inset-0 bg-[url('/referral-bg.png')] bg-cover bg-center opacity-60"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#030303]/80 via-[#030303]/60 to-[#030303]"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-black/50 backdrop-blur-md border border-white/10 rounded-full text-xs font-bold uppercase tracking-widest mb-8 shadow-xl">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
              CHƯƠNG TRÌNH ĐỐI TÁC GIỚI THIỆU
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight mb-8 drop-shadow-2xl">
              GIỚI THIỆU BẠN HIỀN <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-500 to-yellow-500 inline-block pb-3 pt-3">
                NHẬN TIỀN LÌ XÌ LIỀN!
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-300 mb-12 font-medium leading-relaxed max-w-3xl mx-auto drop-shadow-md">
              Trở thành đối tác giới thiệu của ZCOMPUTER. Khi giới thiệu bạn bè hoặc khách hàng mua sắm thành công các sản phẩm PC và Laptop tại hệ thống, bạn sẽ nhận ngay phần quà tri ân bằng tiền mặt lên đến <strong className="text-white font-extrabold bg-primary/30 px-3 py-1 rounded-lg text-primary border border-primary/20">500.000 VNĐ</strong>.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
              <div className="flex items-center gap-2 bg-black/40 border border-white/10 px-5 py-3 rounded-xl text-sm font-semibold text-gray-200 backdrop-blur-md">
                <DollarSign size={18} className="text-green-400" /> Thanh toán 24h
              </div>
              <div className="flex items-center gap-2 bg-black/40 border border-white/10 px-5 py-3 rounded-xl text-sm font-semibold text-gray-200 backdrop-blur-md">
                <Users size={18} className="text-orange-400" /> Không giới hạn lượt
              </div>
              <div className="flex items-center gap-2 bg-black/40 border border-white/10 px-5 py-3 rounded-xl text-sm font-semibold text-gray-200 backdrop-blur-md">
                <CheckCircle2 size={18} className="text-blue-400" /> Thủ tục cực dễ
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link 
                href="https://zalo.me/0977334415" 
                target="_blank" 
                className="w-full sm:w-auto relative group overflow-hidden flex items-center justify-center gap-3 bg-primary text-white px-10 py-4 rounded-xl font-bold text-lg transition-all shadow-[0_0_30px_var(--primary-ring)] hover:shadow-[0_0_50px_var(--primary-ring)] hover:-translate-y-1"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                <MessageCircle size={22} className="relative z-10" />
                <span className="relative z-10">NHẮN TIN NGAY</span>
              </Link>
              <Link 
                href="#reward-table" 
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-lg text-gray-300 bg-black/40 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:text-white transition-all"
              >
                Xem Bảng Thưởng <ChevronRight size={20} />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4 text-white">
              QUY TRÌNH NHẬN QUÀ
            </h2>
            <div className="w-16 h-1 bg-primary mx-auto"></div>
          </div>

          <div className="relative max-w-5xl mx-auto">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[1px] bg-primary/20 z-0"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 relative z-10">
              
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center group">
                <div className="relative mb-6">
                  <div className="w-24 h-24 bg-[#110a0a] border border-white/5 rounded-2xl flex items-center justify-center group-hover:border-primary/30 transition-colors shadow-lg">
                    <Share2 size={32} className="text-primary" />
                  </div>
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#110a0a] border border-primary/30 flex items-center justify-center text-primary font-bold text-sm shadow-md">
                    1
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Chia sẻ & Giới thiệu</h3>
                <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                  Giới thiệu bạn bè, người thân có nhu cầu mua sắm máy tính đến hệ thống ZComputer.
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center group">
                <div className="relative mb-6">
                  <div className="w-24 h-24 bg-[#110a0a] border border-white/5 rounded-2xl flex items-center justify-center group-hover:border-orange-500/30 transition-colors shadow-lg">
                    <ShoppingCart size={32} className="text-orange-500" />
                  </div>
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#110a0a] border border-orange-900/50 flex items-center justify-center text-orange-500 font-bold text-sm shadow-md">
                    2
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Mua sắm thành công</h3>
                <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                  Người được giới thiệu cung cấp số điện thoại của bạn khi mua hàng tại Shop.
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center group">
                <div className="relative mb-6">
                  <div className="w-24 h-24 bg-[#110a0a] border border-white/5 rounded-2xl flex items-center justify-center group-hover:border-yellow-500/30 transition-colors shadow-lg">
                    <DollarSign size={32} className="text-yellow-500" />
                  </div>
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#110a0a] border border-yellow-900/50 flex items-center justify-center text-yellow-500 font-bold text-sm shadow-md">
                    3
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Nhận Quà Tặng</h3>
                <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                  ZComputer sẽ trao tặng món quà tri ân tiền mặt trực tiếp cho bạn trong vòng 24h.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Reward Table Section */}
      <section id="reward-table" className="py-24 relative z-10 bg-[#0a0303] border-y border-primary/30">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-3 text-white">
              DANH SÁCH QUÀ TẶNG CHI TIẾT
            </h2>
            <p className="text-gray-400 text-base max-w-2xl mx-auto">Giá trị quà tặng tương ứng cho mỗi đơn hàng mua thành công</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-[#110505] border border-primary/30 rounded-2xl overflow-hidden shadow-2xl">
              
              {/* Table Header */}
              <div className="flex items-center justify-between p-6 md:px-8 bg-primary/10 border-b border-primary/30">
                <span className="text-primary font-bold uppercase tracking-widest text-sm">DÒNG SẢN PHẨM</span>
                <span className="text-primary font-bold uppercase tracking-widest text-sm">QUÀ TẶNG</span>
              </div>

              {/* Row 1 */}
              <div className="flex items-center justify-between p-6 md:px-8 border-b border-primary/30 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                  <CheckCircle2 size={20} className="text-gray-500" />
                  <span className="text-gray-300 font-medium text-sm md:text-base">PC Văn Phòng / Laptop Văn Phòng cơ bản</span>
                </div>
                <div className="text-white font-black text-lg md:text-xl tracking-wide">100.000đ</div>
              </div>

              {/* Row 2 */}
              <div className="flex items-center justify-between p-6 md:px-8 border-b border-primary/30 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                  <CheckCircle2 size={20} className="text-gray-500" />
                  <span className="text-gray-300 font-medium text-sm md:text-base">PC Gaming / Laptop Gaming (Dưới 20 triệu)</span>
                </div>
                <div className="text-white font-black text-lg md:text-xl tracking-wide">200.000đ</div>
              </div>

              {/* Row 3 */}
              <div className="flex items-center justify-between p-6 md:px-8 border-b border-primary/30 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                  <CheckCircle2 size={20} className="text-gray-500" />
                  <span className="text-gray-300 font-medium text-sm md:text-base">PC Đồ Họa / Laptop Gaming (Từ 20 - 40 triệu)</span>
                </div>
                <div className="text-white font-black text-lg md:text-xl tracking-wide">300.000đ</div>
              </div>

              {/* Row 4 (Highlighted) */}
              <div className="flex items-center justify-between p-6 md:px-8 bg-primary/10 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex items-center gap-4 relative z-10">
                  <CheckCircle2 size={20} className="text-primary drop-shadow-[0_0_10px_var(--primary-ring)]" />
                  <span className="text-primary font-bold text-sm md:text-base drop-shadow-sm">PC Workstation / Laptop Cao Cấp (Trên 40 triệu)</span>
                </div>
                <div className="text-primary font-black text-xl md:text-2xl tracking-wide relative z-10 drop-shadow-[0_0_10px_var(--primary-ring)]">500.000đ</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-24 relative z-10 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-8 text-white">
            KẾT NỐI VỚI <span className="text-primary">ĐỘI NGŨ ZCOMPUTER</span>
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Liên hệ ngay qua Zalo để đội ngũ chuyên viên của chúng tôi hỗ trợ tư vấn các cấu hình tối ưu và chi tiết nhất cho khách hàng của bạn.
          </p>
          
          <Link 
            href="https://zalo.me/0977334415" 
            target="_blank"
            className="inline-flex bg-primary text-white hover:bg-primary px-12 py-5 rounded-2xl font-black text-xl transition-all shadow-[0_10px_30px_var(--primary-ring)] hover:-translate-y-1 items-center justify-center gap-3"
          >
            <MessageCircle size={24} />
            LIÊN HỆ TƯ VẤN NGAY
          </Link>
        </div>
      </section>

    </div>
  );
}
