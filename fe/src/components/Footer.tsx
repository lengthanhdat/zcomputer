import Image from "next/image";
import Link from "next/link";
import { Playfair_Display, Montserrat } from "next/font/google";
import { FaFacebookF, FaInstagram, FaTiktok, FaYoutube, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaChevronRight } from "react-icons/fa";

const montserrat = Montserrat({ subsets: ["latin", "vietnamese"], weight: ["700", "900"] });
const playfair = Playfair_Display({ subsets: ["latin", "vietnamese"], weight: ["700", "900"] });

export default function Footer() {
  return (
    <footer className="relative bg-[#0b0f19] text-white/80 font-sans mt-0 border-t border-white/10 overflow-hidden pb-24 sm:pb-0">
      {/* Ambient Glowing Backgrounds */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        
        {/* TOP ADDRESS BLOCK (Liquid Glass Card) */}
        <div className="mb-12 bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 lg:p-10 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center relative z-10">
            <div>
              <h3 className="text-xl md:text-2xl font-black text-white uppercase mb-6 flex items-center gap-3">
                HỆ THỐNG CỬA HÀNG ZCOMPUTER 
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="text-primary transform rotate-45"><path d="M2 21L23 12L2 3V10L17 12L2 14V21Z"/></svg>
              </h3>
              <div className="text-[15px] space-y-3.5 text-white/70">
                <p className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-primary mt-1 shrink-0" />
                  <span><strong className="text-white">Showroom 1:</strong> 23 Đường số 1, Khu phố 61, Phường Linh Xuân, TP. Thủ Đức, TP.HCM</span>
                </p>
                <p className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-primary mt-1 shrink-0" />
                  <span><strong className="text-white">Showroom 2:</strong> 47/86B Bùi Đình Tuý, Phường 14, Q. Bình Thạnh, TP.HCM</span>
                </p>
                <p className="flex items-center gap-3"><FaChevronRight className="text-primary text-[10px]" /> Làm việc từ 9:00 - 19:00 tất cả các ngày trong tuần.</p>
                <p className="flex items-center gap-3"><FaPhoneAlt className="text-primary" /> Hotline Hỗ Trợ: <strong className="text-primary font-bold text-lg">0977.334.415</strong></p>
                <p className="flex items-center gap-3"><FaEnvelope className="text-primary" /> Email: <strong className="text-white">truong.zvncomputer@gmail.com</strong></p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
               <div className="group/map">
                  <div className="text-sm font-bold text-white mb-3 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div> Chi nhánh Thủ Đức</div>
                  <div className="rounded-2xl overflow-hidden border border-white/10 group-hover/map:border-primary/50 transition-colors relative">
                    <div className="absolute inset-0 bg-primary opacity-0 group-hover/map:opacity-100 transition-opacity pointer-events-none z-10 mix-blend-overlay"></div>
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.4658576162583!2d106.74981366590865!3d10.852128230492767!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752722e4c10833%3A0x6ac88810b4b7dee!2sZ%20Computer-%20Pc%20Gaming-Laptop-Workstation!5e0!3m2!1svi!2sus!4v1781670020621!5m2!1svi!2sus" width="100%" height="160" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="transition-all duration-500 group-hover/map:scale-105"></iframe>
                  </div>
               </div>
               <div className="group/map">
                  <div className="text-sm font-bold text-white mb-3 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div> Chi nhánh Bình Thạnh</div>
                  <div className="rounded-2xl overflow-hidden border border-white/10 group-hover/map:border-primary/50 transition-colors relative">
                    <div className="absolute inset-0 bg-primary opacity-0 group-hover/map:opacity-100 transition-opacity pointer-events-none z-10 mix-blend-overlay"></div>
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.072361586463!2d106.70468187588394!3d10.805769858649997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529000263c50f%3A0x1694f4d065ba8f53!2zWkNPTVBVVEVSLULDjE5IIFRI4bqgTkg!5e0!3m2!1svi!2sus!4v1782088223445!5m2!1svi!2sus" width="100%" height="160" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="transition-all duration-500 group-hover/map:scale-105"></iframe>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* 5 COLUMNS BLOCK */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8 relative z-10 pt-10 border-t border-white/10">
          
          {/* Col 1: Logo & Info */}
          <div className="md:col-span-6 lg:col-span-3 pr-0 lg:pr-4">
             <Link href="/" className="flex flex-col items-start shrink-0 group mb-6">
               <div className="flex items-center gap-1.5 bg-white p-2 sm:p-3 rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.2)] group-hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-shadow">
                 <Image src="/logo_broken.png" alt="Z" width={50} height={50} className="h-10 sm:h-12 w-auto object-contain" />
                 <Image src="/logo-full.png" alt="ZCOMPUTER" width={240} height={60} className="h-8 sm:h-10 w-auto object-contain" />
               </div>
             </Link>
             
             <p className="text-[13px] text-white/70 leading-relaxed mb-6 font-medium text-justify">
               ZCOMPUTER - Hệ thống chuyên cung cấp PC, Laptop Cũ / Like New uy tín, chất lượng cao với mức giá tốt nhất tại khu vực TP.HCM.
             </p>
             
             <div>
               <p className="font-bold uppercase text-[12px] tracking-widest text-white/80 mb-3">THEO DÕI ZCOMPUTER TẠI</p>
               <div className="flex gap-2">
                 <a href="https://www.facebook.com/pcgamingthuduc" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-[#3b5998] flex items-center justify-center text-white hover:-translate-y-1 hover:shadow-[0_5px_15px_rgba(59,89,152,0.4)] transition-all duration-300"><FaFacebookF size={14} /></a>
                 <a href="https://zalo.me/0977334415" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-[#0068FF] flex items-center justify-center text-white hover:-translate-y-1 hover:shadow-[0_5px_15px_rgba(0,104,255,0.4)] transition-all duration-300">
                   <span className="text-[11px] font-black tracking-wide mt-0.5">Zalo</span>
                 </a>
                 <a href="https://vt.tiktok.com/ZSQxHwj4q/" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-black border border-white/20 flex items-center justify-center text-white hover:-translate-y-1 hover:shadow-[0_5px_15px_rgba(0,0,0,0.4)] transition-all duration-300"><FaTiktok size={14} /></a>
               </div>
             </div>
          </div>

          {/* Col 2: DANH MỤC CŨ / LIKE NEW */}
          <div className="md:col-span-3 lg:col-span-2">
            <h4 className="font-black uppercase mb-5 text-[14px] text-white tracking-wider">
              DANH MỤC CŨ/ LIKE NEW
            </h4>
            <ul className="space-y-3 text-[13px] text-white/60 font-medium">
              <li><Link href="/search?q=Laptop" className="hover:text-primary transition-colors">Laptop Cũ</Link></li>
              <li><Link href="/search?q=PC" className="hover:text-primary transition-colors">PC Cũ</Link></li>
              <li><Link href="/search?q=Màn+Hình" className="hover:text-primary transition-colors">Màn Hình Cũ</Link></li>
              <li><Link href="/search?q=Linh+Kiện" className="hover:text-primary transition-colors">Linh Kiện Cũ</Link></li>
            </ul>
          </div>



          {/* Col 3: CHÍNH SÁCH TỔNG HỢP */}
          <div className="md:col-span-3 lg:col-span-2">
            <h4 className="font-black uppercase mb-5 text-[14px] text-white tracking-wider">
              CHÍNH SÁCH TỔNG HỢP
            </h4>
            <ul className="space-y-3 text-[13px] text-white/60 font-medium">
              <li><Link href="/chinh-sach-bao-mat" className="hover:text-primary transition-colors">Chính sách bảo mật</Link></li>
              <li><Link href="/chinh-sach-van-chuyen" className="hover:text-primary transition-colors">Chính sách vận chuyển</Link></li>
              <li><Link href="/chinh-sach-bao-hanh" className="hover:text-primary transition-colors">Chính sách bảo hành</Link></li>
              <li><Link href="/chinh-sach-doi-tra" className="hover:text-primary transition-colors">Chính sách đổi trả</Link></li>
              <li><Link href="/chinh-sach-thanh-toan" className="hover:text-primary transition-colors">Chính sách thanh toán</Link></li>
            </ul>
          </div>

          {/* Col 4: VỀ ZCOMPUTER */}
          <div className="md:col-span-4 lg:col-span-2">
            <h4 className="font-black uppercase mb-5 text-[14px] text-white tracking-wider">
              VỀ ZCOMPUTER
            </h4>
            <ul className="space-y-3 text-[13px] text-white/60 font-medium">
              <li><Link href="/ve-chung-toi" className="hover:text-primary transition-colors">Giới Thiệu Về ZCOMPUTER</Link></li>
              <li><Link href="/lien-he" className="hover:text-primary transition-colors">Liên Hệ</Link></li>
              <li><Link href="/tuyen-dung" className="hover:text-primary transition-colors">Tuyển Dụng</Link></li>
              <li><Link href="/he-thong-cua-hang" className="hover:text-primary transition-colors">Hệ Thống Cửa Hàng</Link></li>
              <li><Link href="/tin-tuc" className="hover:text-primary transition-colors">Tin Tức</Link></li>
            </ul>
          </div>

          {/* Col 5: CÔNG TY TNHH */}
          <div className="md:col-span-8 lg:col-span-3 lg:pl-4">
            <h4 className="font-black uppercase mb-5 text-[14px] text-white tracking-wider">
              CÔNG TY TNHH TM DV ZCOM
            </h4>
            <div className="text-[13px] text-white/60 space-y-2 leading-relaxed font-medium mb-6">
              <p>Mã số GPKD: 0317130199 - Được cấp phép bởi Sở KH và ĐT Thành phố Hồ Chí Minh.</p>
              <p className="pt-2">Cung cấp linh kiện máy tính chính hãng</p>
              <p>Máy tính chơi Game - Máy Tính Đồ Họa - Máy Tính Văn Phòng</p>
            </div>
            
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-white/10 bg-black/50 backdrop-blur-lg py-5 z-10">
        <div className="container mx-auto px-4 text-center text-[13px] font-medium text-white/40 tracking-wide">
           © 2026 <strong className="text-white/60">ZCOMPUTER</strong>.
        </div>
      </div>
    </footer>
  );
}
