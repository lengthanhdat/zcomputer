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
      <section className="bg-gray-900 pt-32 md:pt-40">
        <div className="container mx-auto px-4 relative z-20 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight mb-4 drop-shadow-lg leading-tight md:leading-[1.15] flex flex-col items-center">
              <span className="text-center">Hệ thống cung cấp <span className="inline-block">PC & Laptop</span></span>
              <span className="text-primary text-center mt-2 drop-shadow-md">UY TÍN HÀNG ĐẦU TP.HCM</span>
            </h1>
            <p className="text-gray-300 text-base md:text-lg mb-8 font-medium">Chất lượng thực - Giá trị thực. Đồng hành cùng bạn trên mọi nẻo đường công nghệ.</p>
            <div className="flex flex-wrap justify-center gap-4 mb-12 md:mb-20">
              <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-full text-white font-bold flex items-center gap-2">
                <Monitor size={18} className="text-primary" /> PC GAMING
              </div>
              <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-full text-white font-bold flex items-center gap-2">
                <Cpu size={18} className="text-primary" /> PC WORKSTATION
              </div>
              <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-full text-white font-bold flex items-center gap-2">
                <Zap size={18} className="text-primary" /> LAPTOP
              </div>
            </div>
          </div>
        </div>

        {/* Full-width Team Photo */}
        <div className="relative w-full h-[350px] sm:h-[450px] md:h-[600px] lg:h-[700px] overflow-hidden">
          {/* Fade transition from the dark text section into the photo */}
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-gray-900 to-transparent z-10 pointer-events-none"></div>
          
          <Image 
            src="/z7928384029201_d0a9c852f9f92f48cafec57ed43ee412.jpg" 
            alt="ZCOMPUTER Storefront" 
            fill 
            priority
            className="object-cover object-[center_20%]"
            unoptimized
          />
          
          {/* Fade transition from the photo into the white section below */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-gray-50 to-transparent z-10 pointer-events-none"></div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase leading-tight">
                Về ZCOMPUTER <br />
              </h2>
              <div className="w-20 h-1 bg-primary rounded-full"></div>
              <p className="text-gray-600 text-lg leading-relaxed pt-4">
                <strong>ZCOMPUTER</strong> được thành lập với mục tiêu mang đến cho khách hàng những sản phẩm PC và Laptop chất lượng cao với mức giá vô cùng hợp lý. Chúng tôi tự hào là điểm đến tin cậy của học sinh, sinh viên, dân văn phòng và anh em game thủ tại khu vực TP.HCM.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Với phương châm <strong className="text-gray-900">"Chất lượng thực - Giá trị thực"</strong>, ZCOMPUTER chuyên cung cấp các dòng máy PC, Laptop Cũ / Like New được kiểm định kỹ thuật khắt khe. Chúng tôi hiểu rằng, một chiếc máy tính tốt không nhất thiết phải đắt tiền nhất, mà là chiếc máy tính đáp ứng hoàn hảo nhất nhu cầu và ngân sách của bạn.
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
              { icon: ShieldCheck, title: "Chất lượng đảm bảo", desc: "100% sản phẩm bán ra đều trải qua quy trình kiểm tra phần cứng nghiêm ngặt để đảm bảo máy hoạt động ổn định và bền bỉ." },
              { icon: Award, title: "Giá cả cạnh tranh", desc: "Tối ưu hóa quy trình để mang đến mức giá cực kỳ tốt cho các sản phẩm PC và Laptop Like New tại thị trường TP.HCM." },
              { icon: Wrench, title: "Hậu mãi tận tâm", desc: "Chế độ bảo hành dài hạn, hỗ trợ xử lý sự cố phần mềm và phần cứng chu đáo, giúp khách hàng yên tâm tuyệt đối sau khi mua." },
              { icon: Users, title: "Tư vấn trung thực", desc: "Đội ngũ nhân viên tư vấn đúng nhu cầu, đúng ngân sách, tuyệt đối không chèo kéo hay vẽ thêm chi phí không cần thiết." },
              { icon: Zap, title: "Kỹ thuật chuyên nghiệp", desc: "Kỹ thuật viên am hiểu sâu về máy tính, lắp ráp đi dây chuẩn mực và hỗ trợ nâng cấp linh kiện dễ dàng, nhanh gọn." },
              { icon: Monitor, title: "Đa dạng sản phẩm", desc: "Cung cấp đầy đủ các cấu hình từ máy văn phòng cơ bản đến PC Gaming, Đồ họa chuyên nghiệp và Laptop các hãng nổi tiếng." },
            ].map((item, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-colors group">
                <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <item.icon className="text-primary" size={28} />
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
            <div className="border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:border-primary/10 transition-all duration-300 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-500"></div>
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

            <div className="border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:border-primary/10 transition-all duration-300 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-500"></div>
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
          <div className="bg-gradient-to-br from-primary to-primary rounded-3xl p-10 md:p-14 text-white text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/20 rounded-full blur-3xl"></div>

            <h2 className="text-3xl md:text-4xl font-black mb-4 relative z-10">Bạn cần tìm một bộ máy tính phù hợp?</h2>
            <p className="text-primary/10 text-lg mb-10 max-w-2xl mx-auto relative z-10">Hãy liên hệ ngay với ZCOMPUTER để được tư vấn cấu hình tối ưu nhất cho nhu cầu học tập, làm việc và giải trí của bạn.</p>

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
