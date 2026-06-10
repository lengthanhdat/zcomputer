import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTiktok, FaYoutube, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 font-sans mt-20 border-t-4 border-primary">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Column 1: Về ZCOMPUTER */}
          <div className="space-y-6">
            <div>
              <Link href="/" className="flex items-center gap-3">
                <Image src="/logo.webp" alt="Z" width={48} height={48} className="h-12 w-12 object-contain bg-white/10 p-1 rounded-full" />
                <span className="text-2xl font-black text-white italic tracking-tighter">ZCOMPUTER</span>
              </Link>
              <div className="text-sm mt-4 text-gray-400 leading-relaxed space-y-1.5">
                <p className="font-bold text-gray-200">CÔNG TY TNHH TM DV ZCOM</p>
                <p>MST: 0317130199</p>
                <p>Ngày cấp: 18/01/2022 - Nơi cấp: Sở KH và ĐT Thành phố Hồ Chí Minh</p>
                <p>Cung cấp linh kiện máy tính chính hãng</p>
                <p className="text-primary font-medium pt-1">Máy tính chơi Game - Máy Tính Đồ Họa - Máy Tính Văn Phòng</p>
              </div>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-primary shrink-0">
                  <FaPhoneAlt size={12} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Hotline hỗ trợ 24/7</p>
                  <p className="font-bold text-white">0977 334 415</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-primary shrink-0">
                  <FaEnvelope size={12} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email liên hệ</p>
                  <p className="font-bold text-white">truong.zvncomputer@gmail.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Hệ thống chi nhánh */}
          <div className="space-y-6">
            <h3 className="text-white font-bold text-lg uppercase tracking-wider">Hệ thống cửa hàng</h3>
            
            <div className="space-y-4">
              <div className="bg-white/5 p-4 rounded-lg border border-white/10 hover:border-primary/50 transition-colors">
                <h4 className="text-primary font-bold text-sm mb-1 flex items-center gap-2">
                  <FaMapMarkerAlt /> Chi nhánh Thủ Đức
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed mb-2">
                  23 Đường số 1, Khu phố 61, Phường Linh Xuân, TP. Thủ Đức, TP.Hồ Chí Minh
                </p>
                <a href="https://maps.google.com/?q=Z+Computer" target="_blank" rel="noreferrer" className="text-xs font-semibold text-white hover:text-primary transition-colors hover:underline">
                  Chỉ đường tới Shop &rarr;
                </a>
              </div>

              <div className="bg-white/5 p-4 rounded-lg border border-white/10 hover:border-primary/50 transition-colors">
                <h4 className="text-primary font-bold text-sm mb-1 flex items-center gap-2">
                  <FaMapMarkerAlt /> Chi nhánh Bình Thạnh
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed mb-2">
                  47/86B Bùi Đình Tuý, Phường 14, Q. Bình Thạnh, TP. Hồ Chí Minh
                </p>
                <a href="https://maps.google.com/?q=ZCOMPUTER+BÌNH+THẠNH" target="_blank" rel="noreferrer" className="text-xs font-semibold text-white hover:text-primary transition-colors hover:underline">
                  Chỉ đường tới Shop &rarr;
                </a>
              </div>
            </div>
          </div>

          {/* Column 3: Hỗ trợ khách hàng */}
          <div className="space-y-6 lg:pl-8">
            <h3 className="text-white font-bold text-lg uppercase tracking-wider">Hỗ trợ khách hàng</h3>
            <ul className="space-y-3 text-sm font-medium">
              <li><Link href="/chinh-sach-bao-mat" className="text-gray-400 hover:text-primary hover:translate-x-1 transition-transform inline-block">Chính sách bảo mật</Link></li>
              <li><Link href="/chinh-sach-van-chuyen" className="text-gray-400 hover:text-primary hover:translate-x-1 transition-transform inline-block">Chính sách vận chuyển</Link></li>
              <li><Link href="/chinh-sach-bao-hanh" className="text-gray-400 hover:text-primary hover:translate-x-1 transition-transform inline-block">Chính sách bảo hành</Link></li>
              <li><Link href="/chinh-sach-doi-tra" className="text-gray-400 hover:text-primary hover:translate-x-1 transition-transform inline-block">Chính sách đổi trả</Link></li>
              <li><Link href="/huong-dan-mua-hang" className="text-gray-400 hover:text-primary hover:translate-x-1 transition-transform inline-block">Hướng dẫn mua hàng</Link></li>
            </ul>
          </div>

          {/* Column 4: Kết nối & Thanh toán */}
          <div className="space-y-8">
            <div>
              <h3 className="text-white font-bold text-lg uppercase tracking-wider mb-4">Kết nối với chúng tôi</h3>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#1877F2] transition-colors"><FaFacebookF size={16} /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#E4405F] transition-colors"><FaInstagram size={16} /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-black transition-colors"><FaTiktok size={16} /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#FF0000] transition-colors"><FaYoutube size={16} /></a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-black/50 border-t border-white/5 py-6">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
          <p>© 2024 CÔNG TY TNHH TM DV ZCOM. MST: 0317130199. Tất cả quyền được bảo lưu.</p>
          <div className="flex gap-4 mt-4 md:mt-0 font-medium">
            <Link href="/dieu-khoan-su-dung" className="hover:text-white transition-colors">Điều khoản sử dụng</Link>
            <Link href="/chinh-sach-bao-mat" className="hover:text-white transition-colors">Bảo mật thông tin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
