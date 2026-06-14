import { ShieldCheck, Monitor, Cpu, Users, Award, Phone, Mail } from "lucide-react";
import Image from "next/image";

export const metadata = {
  title: "Về ZCOMPUTER",
  description: "Tìm hiểu về ZCOMPUTER - Cửa hàng PC Gaming, Laptop, Workstation hàng đầu.",
};

export default function AboutUsPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-black text-white rounded-2xl overflow-hidden mb-8 relative border border-gray-800">
          <div className="absolute inset-0 bg-[url('/hero-composition.jpg')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
          <div className="relative p-10 md:p-16 flex flex-col items-center text-center z-10">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.3)] mb-6">
              <Image src="/logo.png" alt="ZComputer Logo" width={60} height={60} className="object-contain" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">
              Về <span className="text-primary">ZCOMPUTER</span>
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl leading-relaxed">
              Tự hào là đơn vị cung cấp giải pháp PC Gaming, Laptop, Máy trạm Workstation chuyên nghiệp và uy tín hàng đầu. 
              Mang đến sức mạnh công nghệ tối thượng cho góc máy của bạn.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="p-8 md:p-12">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-black text-gray-900 uppercase inline-block relative">
                Câu chuyện của chúng tôi
                <div className="absolute -bottom-3 left-1/4 w-1/2 h-1 bg-primary rounded-full"></div>
              </h2>
            </div>
            <div className="space-y-6 text-gray-600 leading-relaxed">
              <p>
                Được thành lập với niềm đam mê mãnh liệt dành cho công nghệ và phần cứng máy tính, <strong>ZCOMPUTER</strong> khởi nguồn từ một nhóm kỹ sư trẻ nhiệt huyết. Chúng tôi thấu hiểu rằng mỗi bộ máy tính không chỉ là một cỗ máy làm việc, mà còn là người bạn đồng hành, là vũ khí chiến đấu, và là tác phẩm nghệ thuật thể hiện cá tính của người sở hữu.
              </p>
              <p>
                Với phương châm <span className="font-bold text-gray-900">"Chất lượng tạo nên uy tín - Dịch vụ tạo nên khác biệt"</span>, ZCOMPUTER luôn tiên phong cập nhật những xu hướng linh kiện mới nhất, mang đến cho khách hàng trải nghiệm tối ưu với mức giá cạnh tranh nhất thị trường.
              </p>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { icon: Award, title: "Sản phẩm chính hãng", desc: "100% linh kiện được phân phối chính hãng, đầy đủ giấy tờ bảo hành từ nhà sản xuất." },
            { icon: Users, title: "Tư vấn tận tâm", desc: "Đội ngũ kỹ thuật viên giàu kinh nghiệm, tư vấn cấu hình chuẩn xác theo nhu cầu và ngân sách." },
            { icon: ShieldCheck, title: "Bảo hành hỏa tốc", desc: "Chính sách bảo hành và hỗ trợ kỹ thuật siêu tốc, giúp bạn an tâm sử dụng lâu dài." },
          ].map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-5">
                <item.icon className="text-primary" size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Contact info block */}
        <div className="bg-gray-900 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 border border-gray-800">
          <div>
            <h3 className="text-xl font-bold mb-2">Bạn cần tư vấn cấu hình?</h3>
            <p className="text-gray-400 text-sm">Đừng ngần ngại liên hệ, chuyên viên ZCOMPUTER luôn sẵn sàng hỗ trợ bạn 24/7.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="tel:0977334415" className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-red-700 rounded-xl font-bold transition-colors">
              <Phone size={18} />
              <span>0977 334 415</span>
            </a>
            <a href="mailto:truong.zvncomputer@gmail.com" className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-colors">
              <Mail size={18} />
              <span>Gửi Email</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
