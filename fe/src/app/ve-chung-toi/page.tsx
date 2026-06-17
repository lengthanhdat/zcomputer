import { ShieldCheck, Monitor, Cpu, Users, Award, Phone, Mail, MapPin, Zap, Clock, Wrench } from "lucide-react";
import Image from "next/image";

export const metadata = {
  title: "Về ZCOMPUTER",
  description: "Tìm hiểu về ZCOMPUTER - Cửa hàng PC Gaming, Laptop, Workstation hàng đầu. Giá không phải là tất cả, hỗ trợ sau bán hàng mới quan trọng!",
};

export default function AboutUsPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 md:pt-32 md:pb-36 overflow-hidden">
        <div className="absolute inset-0 bg-gray-900">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1593640495253-23196b27a87f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/20 shadow-[0_0_40px_rgba(220,38,38,0.3)] transform -rotate-3 hover:rotate-0 transition-transform duration-500">
              <Image src="/logo.png" alt="ZComputer Logo" width={60} height={60} className="object-contain" />
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight mb-6 drop-shadow-lg">
              Định hình đẳng cấp <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-primary">Góc Máy Của Bạn</span>
            </h1>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-white font-bold flex items-center gap-2">
                <Monitor size={18} className="text-primary" /> PC GAMING
              </div>
              <div className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-white font-bold flex items-center gap-2">
                <Cpu size={18} className="text-primary" /> PC WORKSTATION
              </div>
              <div className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-white font-bold flex items-center gap-2">
                <Zap size={18} className="text-primary" /> LAPTOP
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase leading-tight">
                Khởi nguồn <br />
              </h2>
              <div className="w-20 h-1 bg-primary rounded-full"></div>
              <p className="text-gray-600 text-lg leading-relaxed pt-4">
                Được thành lập với niềm đam mê mãnh liệt dành cho công nghệ và phần cứng máy tính, <strong>ZCOMPUTER</strong> thấu hiểu rằng mỗi bộ máy tính không chỉ là một cỗ máy làm việc, mà còn là người bạn đồng hành, là vũ khí chiến đấu, và là tác phẩm nghệ thuật thể hiện cá tính của người sở hữu.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Chúng tôi không chỉ bán một bộ máy tính. Chúng tôi mang đến <strong className="text-gray-900">giải pháp tối ưu nhất</strong> cho ngân sách của bạn, đi kèm với dịch vụ hậu mãi xuất sắc. Đó là lý do triết lý của chúng tôi luôn là bảo vệ quyền lợi khách hàng sau khi mua hàng.
              </p>
            </div>
            <div className="flex-1 relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-3xl transform translate-x-4 translate-y-4"></div>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <Image 
                  src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="ZComputer Store" 
                  width={600} 
                  height={800} 
                  className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
                  unoptimized
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black uppercase inline-block relative">
              Giá trị cốt lõi
              <div className="absolute -bottom-4 left-1/4 w-1/2 h-1 bg-primary rounded-full"></div>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: ShieldCheck, title: "Sản phẩm chính hãng", desc: "100% linh kiện được phân phối chính hãng, minh bạch nguồn gốc, đầy đủ giấy tờ bảo hành từ nhà sản xuất." },
              { icon: Users, title: "Tư vấn tận tâm", desc: "Đội ngũ kỹ thuật viên giàu kinh nghiệm, không tư vấn theo hướng nhồi nhét, luôn tối ưu cấu hình chuẩn xác theo nhu cầu thực tế." },
              { icon: Wrench, title: "Hậu mãi hàng đầu", desc: "Chính sách bảo hành và hỗ trợ kỹ thuật siêu tốc. Xử lý sự cố nhanh chóng, bảo vệ quyền lợi khách hàng tối đa." },
              { icon: Award, title: "Chất lượng lắp ráp", desc: "Quy trình đi dây (cable management) chuẩn mực, tối ưu tản nhiệt, biến mỗi bộ PC thành một tác phẩm nghệ thuật." },
              { icon: Clock, title: "Tốc độ xử lý", desc: "Lắp ráp, cài đặt và giao hàng hỏa tốc trong khu vực. Xử lý các yêu cầu bảo hành không để khách hàng chờ đợi lâu." },
              { icon: Zap, title: "Liên tục đổi mới", desc: "Luôn cập nhật những xu hướng linh kiện công nghệ mới nhất trên thế giới để mang về phục vụ Game thủ Việt." },
            ].map((item, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-colors group">
                <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <item.icon className="text-red-400" size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Branches */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 uppercase">Hệ thống showroom</h2>
            <p className="text-gray-500 mt-3">Trực tiếp trải nghiệm sức mạnh công nghệ tại các chi nhánh của ZCOMPUTER</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:border-red-100 transition-all duration-300 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-black text-xl shadow-lg">1</div>
                <h3 className="text-xl font-bold text-gray-900">Chi nhánh 1 (Trụ sở)</h3>
              </div>
              <p className="flex items-start gap-3 text-gray-600 mb-4">
                <MapPin className="text-primary shrink-0 mt-1" size={20} />
                <span>23 Đường số 1, Khu phố 61, Phường Linh Xuân (Phường Linh Tây cũ), TP.Thủ Đức, TP.Hồ Chí Minh</span>
              </p>
              <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between items-center">
                <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="text-primary font-bold text-sm hover:underline">Xem bản đồ &rarr;</a>
              </div>
            </div>

            <div className="border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:border-red-100 transition-all duration-300 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-black text-xl shadow-lg">2</div>
                <h3 className="text-xl font-bold text-gray-900">Chi nhánh 2</h3>
              </div>
              <p className="flex items-start gap-3 text-gray-600 mb-4">
                <MapPin className="text-primary shrink-0 mt-1" size={20} />
                <span>47/86B Bùi Đình Tuý, Phường 14, Quận Bình Thạnh, TP.Hồ Chí Minh</span>
              </p>
              <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between items-center">
                <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="text-primary font-bold text-sm hover:underline">Xem bản đồ &rarr;</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-gradient-to-br from-primary to-red-700 rounded-3xl p-10 md:p-14 text-white text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/20 rounded-full blur-3xl"></div>
            
            <h2 className="text-3xl md:text-4xl font-black mb-4 relative z-10">Bạn đã sẵn sàng để xây dựng cỗ máy trong mơ?</h2>
            <p className="text-red-100 text-lg mb-10 max-w-2xl mx-auto relative z-10">Chuyên viên ZCOMPUTER luôn sẵn sàng hỗ trợ tư vấn và cấu hình hoàn toàn miễn phí, bám sát nhu cầu và ngân sách của bạn.</p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
              <a href="tel:0977334415" className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary rounded-xl font-black text-lg hover:bg-gray-100 transition-colors shadow-lg hover:-translate-y-1 duration-300">
                <Phone size={22} />
                0977 334 415
              </a>
              <a href="mailto:truong.zvncomputer@gmail.com" className="flex items-center justify-center gap-2 px-8 py-4 bg-black/20 text-white rounded-xl font-bold text-lg hover:bg-black/30 transition-colors border border-white/20 backdrop-blur-sm hover:-translate-y-1 duration-300">
                <Mail size={22} />
                Gửi Email Cho Chúng Tôi
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
