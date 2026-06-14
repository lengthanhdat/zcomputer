import Image from "next/image";
import Link from "next/link";
import { Playfair_Display, Montserrat } from "next/font/google";
import { FaFacebookF, FaInstagram, FaTiktok, FaYoutube, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaChevronRight } from "react-icons/fa";

const montserrat = Montserrat({ subsets: ["latin", "vietnamese"], weight: ["700", "900"] });
const playfair = Playfair_Display({ subsets: ["latin", "vietnamese"], weight: ["700", "900"] });

export default function Footer() {
  return (
    <footer className="bg-[#0f1115] text-gray-400 font-sans mt-20 border-t border-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-8">
          
          {/* Column 1: Về ZCOMPUTER */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3 shrink-0 group">
              <div className="bg-transparent p-0 rounded-xl">
                <Image src="/logo.webp" alt="ZCOMPUTER" width={80} height={80} className="h-14 w-14 sm:h-[68px] sm:w-[68px] object-contain drop-shadow-md" />
              </div>
              <div className="flex flex-col items-start justify-center">
                <div className={`${playfair.className} flex items-center select-none group-hover:scale-[1.02] transition-transform duration-300`}>
                  <span className="text-[#CC0000] text-[28px] sm:text-[34px] font-black drop-shadow-sm leading-none">Z</span>
                  <span className="text-white text-[28px] sm:text-[34px] font-black uppercase drop-shadow-sm leading-none">COMPUTER</span>
                </div>
                <span className={`${montserrat.className} text-[#CC0000] text-[8px] sm:text-[9.5px] font-black uppercase tracking-widest mt-1`}>
                  PC GAMING - LAPTOP - WORKSTATION
                </span>
              </div>
            </Link>
            
            <div className="text-sm leading-relaxed space-y-2">
              <p className="font-bold text-gray-200 text-base">CÔNG TY TNHH TM DV ZCOM</p>
              <p>MST: 0317130199 - Sở KHĐT TP.HCM (18/01/2022)</p>
              <p>Chuyên cung cấp linh kiện PC, Laptop & thiết bị hi-end chính hãng.</p>
            </div>
            
            <div className="space-y-4 pt-2">
              <a href="tel:0977334415" className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-gray-800/50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <FaPhoneAlt size={14} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Hotline 24/7</p>
                  <p className="font-bold text-white group-hover:text-primary transition-colors">0977 334 415</p>
                </div>
              </a>
              <a href="mailto:truong.zvncomputer@gmail.com" className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-gray-800/50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <FaEnvelope size={14} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Email liên hệ</p>
                  <p className="font-bold text-white group-hover:text-primary transition-colors">truong.zvncomputer@gmail.com</p>
                </div>
              </a>
            </div>
          </div>

          {/* Column 2: Hệ thống chi nhánh */}
          <div className="space-y-6">
            <h3 className="text-white font-bold text-lg uppercase tracking-widest relative pb-4 inline-block">
              Hệ thống cửa hàng
              <span className="absolute bottom-0 left-0 w-12 h-1 bg-primary rounded-full"></span>
            </h3>
            
            <div className="space-y-5">
              <div className="group">
                <h4 className="text-gray-200 font-bold text-sm mb-2 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-primary" /> Chi nhánh Thủ Đức
                </h4>
                <p className="text-sm leading-relaxed mb-3 group-hover:text-gray-300 transition-colors">
                  23 Đường số 1, Khu phố 61, Phường Linh Xuân, 23 Đ. số 1, Linh Xuân, Hồ Chí Minh, Việt Nam
                </p>
                <a href="https://www.google.com/maps/place/Z+Computer-+Pc+Gaming-Laptop-Workstation/@10.8522646,106.7537944,20z/data=!4m14!1m7!3m6!1s0x31752722e4c10833:0x6ac88810b4b7dee!2sZ+Computer-+Pc+Gaming-Laptop-Workstation!8m2!3d10.8521273!4d106.7538518!16s%2Fg%2F11lbjb7txf!3m5!1s0x31752722e4c10833:0x6ac88810b4b7dee!8m2!3d10.8521273!4d106.7538518!16s%2Fg%2F11lbjb7txf?entry=ttu&g_ep=EgoyMDI2MDYxMC4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noreferrer" className="text-xs font-bold text-primary hover:text-red-400 uppercase tracking-wider flex items-center gap-1 mb-3">
                  Chỉ đường tới shop <FaChevronRight size={10} />
                </a>
                <iframe 
                  src="https://maps.google.com/maps?q=Z+Computer-+Pc+Gaming-Laptop-Workstation&t=&z=16&ie=UTF8&iwloc=&output=embed" 
                  width="100%" 
                  height="120" 
                  style={{ border: 0, borderRadius: '8px' }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="shadow-sm mt-1"
                ></iframe>
              </div>

              <div className="w-full h-px bg-gray-800/50 my-4"></div>

              <div className="group">
                <h4 className="text-gray-200 font-bold text-sm mb-2 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-primary" /> Chi nhánh Bình Thạnh
                </h4>
                <p className="text-sm leading-relaxed mb-3 group-hover:text-gray-300 transition-colors">
                  47/86B Bùi Đình Tuý, Phường 14, Q. Bình Thạnh, TP. Hồ Chí Minh
                </p>
                <a href="https://maps.google.com/?q=ZCOMPUTER+BÌNH+THẠNH" target="_blank" rel="noreferrer" className="text-xs font-bold text-primary hover:text-red-400 uppercase tracking-wider flex items-center gap-1 mb-3">
                  Chỉ đường tới shop <FaChevronRight size={10} />
                </a>
                <iframe 
                  src="https://maps.google.com/maps?q=47/86B+Bùi+Đình+Tuý,+Phường+14,+Bình+Thạnh,+TP.+Hồ+Chí+Minh&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                  width="100%" 
                  height="120" 
                  style={{ border: 0, borderRadius: '8px' }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="shadow-sm mt-1"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Column 3: Kết nối & Thanh toán */}
          <div className="space-y-8">
            <div>
              <h3 className="text-white font-bold text-lg uppercase tracking-widest relative pb-4 inline-block mb-4">
                Kết nối với chúng tôi
                <span className="absolute bottom-0 left-0 w-12 h-1 bg-primary rounded-full"></span>
              </h3>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-[#1877F2] hover:-translate-y-1 transition-all duration-300 shadow-lg"><FaFacebookF size={16} /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-[#E4405F] hover:-translate-y-1 transition-all duration-300 shadow-lg"><FaInstagram size={16} /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-black hover:-translate-y-1 transition-all duration-300 shadow-lg"><FaTiktok size={16} /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-[#FF0000] hover:-translate-y-1 transition-all duration-300 shadow-lg"><FaYoutube size={16} /></a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#08090b] border-t border-gray-800/60 py-6">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
          <p>© 2024 CÔNG TY TNHH TM DV ZCOM. MST: 0317130199. Tất cả quyền được bảo lưu.</p>
          <div className="flex gap-6 mt-4 md:mt-0 font-medium uppercase tracking-wider">
            <Link href="/dieu-khoan-su-dung" className="hover:text-primary transition-colors">Điều khoản sử dụng</Link>
            <Link href="/chinh-sach-bao-mat" className="hover:text-primary transition-colors">Bảo mật thông tin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
