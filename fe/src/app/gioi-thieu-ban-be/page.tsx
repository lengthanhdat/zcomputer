import React from "react";
import Link from "next/link";
import { Users, ShoppingCart, Gift, DollarSign, Infinity, MonitorSmartphone, Store, MessageCircle, ChevronRight, Share2, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giới thiệu bạn bè - Cùng mua sắm nhận quà | ZComputer",
  description: "Chương trình giới thiệu bạn bè mua sắm Laptop, PC tại ZComputer để nhận ngay hoa hồng tiền mặt hoặc voucher.",
};

export default function ReferFriendPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-red-600 selection:text-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 md:pt-32 md:pb-40 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[#1a0505]"></div>
        {/* Lưới chấm bi mờ ảo */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#ef4444 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        {/* Vầng sáng phía trên */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-red-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-orange-600/20 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[600px]">
            
            {/* Cột trái: Hình ảnh Composition (Mockup kiểu 3D) */}
            <div className="hidden lg:flex relative w-full h-[550px] items-center justify-center order-2 lg:order-1">
              {/* Khối nền vuông bo tròn màu đỏ tối (Frame) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] bg-gradient-to-br from-[#2a0808] to-[#1a0505] border border-red-500/20 rounded-[2.5rem] shadow-[0_0_80px_rgba(239,68,68,0.15)] z-0"></div>
              
              {/* Sparks (Tia lửa) */}
              <div className="absolute inset-0 z-0 pointer-events-none opacity-60" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, #ef4444 3px, transparent 3px), radial-gradient(circle at 80% 40%, #f97316 2px, transparent 2px), radial-gradient(circle at 30% 70%, #ef4444 4px, transparent 4px), radial-gradient(circle at 70% 80%, #f97316 2px, transparent 2px), radial-gradient(circle at 50% 10%, #ef4444 2px, transparent 2px)', backgroundSize: '150px 150px' }}></div>
              
              {/* Vầng hào quang (Glow effect) bùng nổ phía sau */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-red-600/40 via-orange-500/20 to-red-900/40 rounded-full blur-[80px] z-0 animate-pulse"></div>
              
              {/* Vòng sáng xoay nghệ thuật */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] border border-red-500/30 rounded-full z-0 animate-[spin_10s_linear_infinite]"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] border border-orange-500/20 rounded-full z-0 animate-[spin_15s_linear_infinite_reverse]"></div>

              {/* User Uploaded Hero Composition Image (Đã xóa nền & xóa sao) */}
              <div className="absolute inset-0 flex items-center justify-center z-10 animate-float">
                <div className="relative w-[145%] max-w-[150%] h-auto scale-[1.15] translate-x-4 -translate-y-4 group-img">
                  {/* Bóng đổ sáng dưới chân */}
                  <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[70%] h-[30px] bg-red-600/60 blur-[30px] rounded-[100%] animate-pulse"></div>
                  <img 
                    src="/hero-clean.png" 
                    alt="PC & Laptop" 
                    className="w-full h-full object-contain drop-shadow-[0_0_60px_rgba(239,68,68,0.7)] transition-all duration-700 hover:scale-105 hover:drop-shadow-[0_0_100px_rgba(239,68,68,1)]"
                  />
                </div>
              </div>

              {/* Float Card: Quà tặng (Góc dưới trái) */}
              <div className="absolute -left-2 bottom-[5%] z-30 bg-[#1a0505]/95 backdrop-blur-xl border border-red-500/40 p-4 pr-8 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.8)] flex items-center gap-4 hover:-translate-y-2 transition-transform duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-orange-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.4)]">
                  <Gift size={24} className="text-white" />
                </div>
                <div>
                  <div className="text-red-300 text-[10px] font-black uppercase tracking-[0.1em] mb-0.5">Quà tặng lên đến</div>
                  <div className="text-white font-black text-2xl drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">500.000<span className="text-sm text-red-500 ml-1">đ</span></div>
                </div>
              </div>
            </div>

            {/* Cột phải: Nội dung chuyên nghiệp */}
            <div className="max-w-2xl flex flex-col justify-center order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full text-sm font-bold uppercase tracking-widest mb-6 w-fit backdrop-blur-sm">
                <Sparkles size={16} /> Chương Trình Đặc Biệt
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-[70px] font-black leading-[1.1] tracking-tight mb-6">
                GIỚI THIỆU BẠN <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500">
                  NHẬN QUÀ NGAY
                </span>
              </h1>
              
              <p className="text-xl text-gray-400 mb-8 font-light leading-relaxed">
                Rủ bạn bè mua sắm PC, Laptop tại ZComputer để rinh ngay phần quà tri ân tiền mặt trị giá lên đến <strong className="text-white font-bold">500.000 VNĐ</strong> cho mỗi lượt giới thiệu thành công.
              </p>
              
              {/* Bullet Points */}
              <div className="flex flex-col gap-4 mb-10">
                <div className="flex items-center gap-3 text-gray-300 font-medium">
                  <div className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={16} />
                  </div>
                  Quà tặng tiền mặt trao tay trực tiếp trong 24h
                </div>
                <div className="flex items-center gap-3 text-gray-300 font-medium">
                  <div className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={16} />
                  </div>
                  Không giới hạn số lần giới thiệu
                </div>
                <div className="flex items-center gap-3 text-gray-300 font-medium">
                  <div className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={16} />
                  </div>
                  Áp dụng cho tất cả dòng PC và Laptop tại Shop
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link 
                  href="https://zalo.me/0977334415" 
                  target="_blank" 
                  className="w-full sm:w-auto flex items-center justify-center gap-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white px-10 py-4 rounded-lg font-bold text-lg transition-all duration-300 shadow-[0_10px_30px_rgba(239,68,68,0.4)] hover:-translate-y-1"
                >
                  <MessageCircle size={22} />
                  LIÊN HỆ NGAY
                </Link>
                <Link 
                  href="#commission-table" 
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-bold text-lg text-white hover:bg-white/5 transition-all duration-300"
                >
                  Xem thể lệ <ChevronRight size={20} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Subtle Divider */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      </section>

      {/* 3 Steps Section */}
      <section className="py-24 relative bg-[#0a0a0a]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0505] to-transparent opacity-50"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4 text-white">Quy Trình Nhận Quà</h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-red-500 to-orange-600 mx-auto rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative max-w-5xl mx-auto">
            <div className="hidden md:block absolute top-[60px] left-[15%] right-[15%] h-px bg-gradient-to-r from-red-500/0 via-red-500/50 to-red-500/0 z-0"></div>
            
            <div className="relative z-10 flex flex-col items-center group">
              <div className="w-28 h-28 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center mb-8 text-red-400 group-hover:-translate-y-2 group-hover:bg-red-500/10 group-hover:border-red-500/30 group-hover:shadow-[0_0_30px_rgba(239,68,68,0.2)] transition-all duration-500">
                <Share2 size={40} strokeWidth={1.5} />
                <div className="absolute -top-4 -right-4 w-10 h-10 bg-[#1a0505] border border-red-500/30 text-red-400 rounded-full flex items-center justify-center font-bold text-lg shadow-lg">1</div>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-center text-white">Chia sẻ & Giới thiệu</h3>
              <p className="text-gray-400 text-center px-4 leading-relaxed font-light">
                Giới thiệu bạn bè, người thân có nhu cầu mua sắm máy tính đến hệ thống ZComputer.
              </p>
            </div>

            <div className="relative z-10 flex flex-col items-center group">
              <div className="w-28 h-28 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center mb-8 text-orange-400 group-hover:-translate-y-2 group-hover:bg-orange-500/10 group-hover:border-orange-500/30 group-hover:shadow-[0_0_30px_rgba(249,115,22,0.2)] transition-all duration-500">
                <ShoppingCart size={40} strokeWidth={1.5} />
                <div className="absolute -top-4 -right-4 w-10 h-10 bg-[#1a0505] border border-orange-500/30 text-orange-400 rounded-full flex items-center justify-center font-bold text-lg shadow-lg">2</div>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-center text-white">Mua sắm thành công</h3>
              <p className="text-gray-400 text-center px-4 leading-relaxed font-light">
                Người được giới thiệu cung cấp số điện thoại của bạn khi mua hàng tại Shop.
              </p>
            </div>

            <div className="relative z-10 flex flex-col items-center group">
              <div className="w-28 h-28 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center mb-8 text-yellow-400 group-hover:-translate-y-2 group-hover:bg-yellow-500/10 group-hover:border-yellow-500/30 group-hover:shadow-[0_0_30px_rgba(234,179,8,0.2)] transition-all duration-500">
                <DollarSign size={40} strokeWidth={1.5} />
                <div className="absolute -top-4 -right-4 w-10 h-10 bg-[#1a0505] border border-yellow-500/30 text-yellow-400 rounded-full flex items-center justify-center font-bold text-lg shadow-lg">3</div>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-center text-white">Nhận Quà Tặng</h3>
              <p className="text-gray-400 text-center px-4 leading-relaxed font-light">
                ZComputer sẽ trao tặng món quà tri ân tiền mặt trực tiếp cho bạn trong vòng 24h.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Table Section */}
      <section id="commission-table" className="py-24 bg-[#1a0505] relative">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ef4444 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-4 text-white">Danh Sách Quà Tặng Chi Tiết</h2>
            <p className="text-gray-400 font-light">Giá trị quà tặng tương ứng cho mỗi đơn hàng mua thành công</p>
          </div>
          
          <div className="bg-[#1f0a0a]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <div className="grid grid-cols-3 bg-red-500/10 border-b border-red-500/20 p-5 sm:p-6 font-bold text-sm sm:text-lg text-red-400 tracking-wide uppercase">
              <div className="col-span-2">Dòng Sản Phẩm</div>
              <div className="text-right">Quà Tặng</div>
            </div>
            <div className="divide-y divide-white/5">
              <div className="grid grid-cols-3 p-5 sm:p-6 items-center hover:bg-white/5 transition-colors group">
                <div className="col-span-2 flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-red-500/20 group-hover:text-red-400 transition-colors">
                    <CheckCircle2 className="text-gray-500 group-hover:text-red-400" size={18} />
                  </div>
                  <span className="text-gray-300 group-hover:text-white transition-colors">PC Văn Phòng / Laptop Văn Phòng cơ bản</span>
                </div>
                <div className="text-right font-black text-xl text-white">100.000đ</div>
              </div>
              <div className="grid grid-cols-3 p-5 sm:p-6 items-center hover:bg-white/5 transition-colors group">
                <div className="col-span-2 flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-red-500/20 group-hover:text-red-400 transition-colors">
                    <CheckCircle2 className="text-gray-500 group-hover:text-red-400" size={18} />
                  </div>
                  <span className="text-gray-300 group-hover:text-white transition-colors">PC Gaming / Laptop Gaming (Dưới 20 triệu)</span>
                </div>
                <div className="text-right font-black text-xl text-white">200.000đ</div>
              </div>
              <div className="grid grid-cols-3 p-5 sm:p-6 items-center hover:bg-white/5 transition-colors group">
                <div className="col-span-2 flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-red-500/20 group-hover:text-red-400 transition-colors">
                    <CheckCircle2 className="text-gray-500 group-hover:text-red-400" size={18} />
                  </div>
                  <span className="text-gray-300 group-hover:text-white transition-colors">PC Đồ Họa / Laptop Gaming (Từ 20 - 40 triệu)</span>
                </div>
                <div className="text-right font-black text-xl text-white">300.000đ</div>
              </div>
              <div className="grid grid-cols-3 p-5 sm:p-6 items-center hover:bg-white/5 transition-colors bg-red-600/5 group">
                <div className="col-span-2 flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                    <CheckCircle2 size={18} />
                  </div>
                  <span className="font-bold text-red-300">PC Workstation / Laptop Cao Cấp (Trên 40 triệu)</span>
                </div>
                <div className="text-right font-black text-2xl text-red-400 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">500.000đ</div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-start gap-4 bg-red-900/20 border border-red-500/30 p-5 rounded-xl text-red-200 text-sm backdrop-blur-sm">
            <AlertCircle size={20} className="shrink-0 text-red-400 mt-0.5" />
            <p className="font-light leading-relaxed"><strong className="text-white">Lưu ý:</strong> Quà tặng không áp dụng đồng thời với các chương trình khuyến mãi giảm giá trực tiếp khác tại hệ thống.</p>
          </div>
        </div>
      </section>

      {/* Terms & Conditions Section */}
      <section className="py-20 relative bg-[#0a0a0a] border-t border-white/5">
        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight mb-4 text-white">Điều khoản & Điều kiện</h2>
            <div className="w-16 h-1 bg-red-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 sm:p-10 text-gray-300 font-light leading-relaxed space-y-5 shadow-xl">
            <p className="flex items-start gap-3">
              <CheckCircle2 size={20} className="text-red-500 shrink-0 mt-1" />
              <span>Chương trình áp dụng cho tất cả khách hàng cũ và mới giới thiệu người quen mua sắm thành công PC hoặc Laptop tại hệ thống ZComputer.</span>
            </p>
            <p className="flex items-start gap-3">
              <CheckCircle2 size={20} className="text-red-500 shrink-0 mt-1" />
              <span><strong>Đơn hàng mua sắm thành công</strong> được xác nhận khi người mua đã hoàn tất thanh toán 100% giá trị đơn hàng và nhận máy.</span>
            </p>
            <p className="flex items-start gap-3">
              <CheckCircle2 size={20} className="text-red-500 shrink-0 mt-1" />
              <span>Quà tặng tri ân sẽ được chuyển khoản trực tiếp vào tài khoản ngân hàng của người giới thiệu chậm nhất trong vòng <strong>24 giờ</strong> làm việc kể từ lúc đơn hàng hoàn tất.</span>
            </p>
            <p className="flex items-start gap-3">
              <CheckCircle2 size={20} className="text-red-500 shrink-0 mt-1" />
              <span>Chương trình không giới hạn số lượt giới thiệu. Bạn giới thiệu càng nhiều, nhận quà càng lớn.</span>
            </p>
            <p className="flex items-start gap-3">
              <CheckCircle2 size={20} className="text-red-500 shrink-0 mt-1" />
              <span>Trong mọi trường hợp phát sinh vấn đề hoặc tranh chấp, quyết định của ZComputer sẽ là quyết định cuối cùng.</span>
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative text-center bg-[#0a0a0a] overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-red-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight mb-6 text-white">
            Lan Tỏa Niềm Vui <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500">Cùng ZComputer</span>
          </h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            Mang đến những sản phẩm công nghệ chất lượng nhất cho bạn bè và nhận ngay những phần quà vô cùng ý nghĩa!
          </p>
          <Link 
            href="https://zalo.me/0977334415" 
            target="_blank" 
            className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-red-600 to-orange-600 text-white px-12 py-5 rounded-full font-black text-xl hover:from-red-500 hover:to-orange-500 transition-all duration-300 shadow-[0_10px_40px_rgba(239,68,68,0.4)] hover:shadow-[0_15px_50px_rgba(239,68,68,0.6)] hover:-translate-y-1"
          >
            <MessageCircle size={24} />
            LIÊN HỆ NGAY
          </Link>
        </div>
      </section>
    </div>
  );
}
