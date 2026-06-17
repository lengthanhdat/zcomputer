import Image from "next/image";
import Link from "next/link";
import { Playfair_Display, Montserrat } from "next/font/google";
import { FaFacebookF, FaInstagram, FaTiktok, FaYoutube, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaChevronRight } from "react-icons/fa";

const montserrat = Montserrat({ subsets: ["latin", "vietnamese"], weight: ["700", "900"] });

export default function Footer() {
  return (
    <footer className="relative bg-[#0b0f19] text-white/80 font-sans mt-0 border-t border-white/10 overflow-hidden pb-24 sm:pb-0">
      {/* Ambient Glowing Backgrounds */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        
        {/* TOP ADDRESS BLOCK (Liquid Glass Card) */}
        <div className="mb-12 bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 lg:p-10 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center relative z-10">
            <div>
              <h3 className="text-xl md:text-2xl font-black text-white uppercase mb-6 flex items-center gap-3">
                HỆ THỐNG CỬA HÀNG ZCOMPUTER 
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="text-red-500 transform rotate-45"><path d="M2 21L23 12L2 3V10L17 12L2 14V21Z"/></svg>
              </h3>
              <div className="text-[15px] space-y-3.5 text-white/70">
                <p className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-red-500 mt-1 shrink-0" />
                  <span><strong className="text-white">Showroom 1:</strong> 23 Đường số 1, Khu phố 61, Phường Linh Xuân, TP. Thủ Đức, TP.HCM</span>
                </p>
                <p className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-red-500 mt-1 shrink-0" />
                  <span><strong className="text-white">Showroom 2:</strong> 47/86B Bùi Đình Tuý, Phường 14, Q. Bình Thạnh, TP.HCM</span>
                </p>
                <p className="flex items-center gap-3"><FaChevronRight className="text-red-500 text-[10px]" /> Làm việc từ 9:00 - 19:00 tất cả các ngày trong tuần.</p>
                <p className="flex items-center gap-3"><FaPhoneAlt className="text-red-500" /> Hotline Hỗ Trợ: <strong className="text-red-400 font-bold text-lg">0977.334.415</strong></p>
                <p className="flex items-center gap-3"><FaEnvelope className="text-red-500" /> Email: <strong className="text-white">truong.zvncomputer@gmail.com</strong></p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
               <div className="group/map">
                  <div className="text-sm font-bold text-white mb-3 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div> Chi nhánh Thủ Đức</div>
                  <div className="rounded-2xl overflow-hidden border border-white/10 group-hover/map:border-red-500/50 transition-colors relative">
                    <div className="absolute inset-0 bg-red-500/0 opacity-0 group-hover/map:opacity-100 transition-opacity pointer-events-none z-10 mix-blend-overlay"></div>
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.4658576162583!2d106.74981366590865!3d10.852128230492767!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752722e4c10833%3A0x6ac88810b4b7dee!2sZ%20Computer-%20Pc%20Gaming-Laptop-Workstation!5e0!3m2!1svi!2sus!4v1781670020621!5m2!1svi!2sus" width="100%" height="160" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="transition-all duration-500 group-hover/map:scale-105"></iframe>
                  </div>
               </div>
               <div className="group/map">
                  <div className="text-sm font-bold text-white mb-3 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div> Chi nhánh Bình Thạnh</div>
                  <div className="rounded-2xl overflow-hidden border border-white/10 group-hover/map:border-red-500/50 transition-colors relative">
                    <div className="absolute inset-0 bg-red-500/0 opacity-0 group-hover/map:opacity-100 transition-opacity pointer-events-none z-10 mix-blend-overlay"></div>
                    <iframe src="https://maps.google.com/maps?q=47/86B+Bùi+Đình+Tuý,+Phường+14,+Bình+Thạnh,+TP.+Hồ+Chí+Minh&t=&z=15&ie=UTF8&iwloc=&output=embed" width="100%" height="160" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="transition-all duration-500 group-hover/map:scale-105"></iframe>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* 4 COLUMNS BLOCK */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 relative z-10 pt-4">
          
          {/* Col 1: Logo & Info */}
          <div className="col-span-1 pr-4">
             <Link href="/" className="flex items-center gap-3 shrink-0 group mb-6">
               <div className="bg-white p-1 rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.2)] group-hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-shadow">
                 <Image src="/logo.png" alt="ZCOMPUTER" width={60} height={60} className="h-10 w-10 object-contain" />
               </div>
               <div className="flex flex-col items-start justify-center">
                 <div className={`${montserrat.className} flex items-center select-none group-hover:scale-[1.02] transition-transform duration-300`}>
                   <span className="text-red-500 text-3xl font-black drop-shadow-[0_0_10px_rgba(220,38,38,0.5)] leading-none">Z</span>
                   <span className="text-white text-3xl font-black uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] leading-none">COMPUTER</span>
                 </div>
                 <span className={`${montserrat.className} text-red-400 text-[9px] font-black uppercase tracking-[0.2em] mt-1.5`}>
                   PC GAMING - LAPTOP - WORKSTATION
                 </span>
               </div>
             </Link>
             <p className="text-[14px] text-white/60 leading-relaxed mb-8 font-medium">
               Laptop, PC Gaming Cũ Giá Tốt tại ZCOMPUTER - PC Gaming, PC Đồ Họa, Linh Kiện PC với đa dạng mẫu mã và chất lượng đỉnh cao!
             </p>
             <div>
               <p className="font-bold uppercase text-[12px] tracking-widest text-white/80 mb-4">Kết nối với chúng tôi</p>
               <div className="flex gap-3">
                 <a href="https://www.facebook.com/pcgamingthuduc" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/80 hover:bg-[#3b5998] hover:text-white hover:border-[#3b5998] hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(59,89,152,0.4)] transition-all duration-300"><FaFacebookF size={16} /></a>
                 <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/80 hover:bg-[#cd486b] hover:text-white hover:border-[#cd486b] hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(205,72,107,0.4)] transition-all duration-300"><FaInstagram size={16} /></a>
                 <a href="https://vt.tiktok.com/ZSQxHwj4q/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/80 hover:bg-black hover:text-white hover:border-white/20 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(0,0,0,0.4)] transition-all duration-300"><FaTiktok size={16} /></a>
                 <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/80 hover:bg-[#ff0000] hover:text-white hover:border-[#ff0000] hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(255,0,0,0.4)] transition-all duration-300"><FaYoutube size={16} /></a>
               </div>
             </div>
          </div>

          {/* Col 2: CHÍNH SÁCH KHÁCH HÀNG */}
          <div className="lg:pl-8">
            <h4 className="font-black uppercase mb-6 text-[15px] text-white tracking-widest flex items-center gap-2">
              <div className="w-1.5 h-4 bg-red-500 rounded-full"></div>
              Chính sách
            </h4>
            <ul className="space-y-4 text-[14px] text-white/60 font-medium uppercase">
              <li><Link href="/chinh-sach-bao-mat" className="hover:text-red-400 hover:translate-x-2 transition-all duration-300 flex items-center gap-2"><FaChevronRight className="text-[10px] text-red-500/50" /> CHÍNH SÁCH BẢO MẬT</Link></li>
              <li><Link href="/chinh-sach-van-chuyen" className="hover:text-red-400 hover:translate-x-2 transition-all duration-300 flex items-center gap-2"><FaChevronRight className="text-[10px] text-red-500/50" /> CHÍNH SÁCH VẬN CHUYỂN</Link></li>
              <li><Link href="/chinh-sach-bao-hanh" className="hover:text-red-400 hover:translate-x-2 transition-all duration-300 flex items-center gap-2"><FaChevronRight className="text-[10px] text-red-500/50" /> CHÍNH SÁCH BẢO HÀNH</Link></li>
              <li><Link href="/chinh-sach-doi-tra" className="hover:text-red-400 hover:translate-x-2 transition-all duration-300 flex items-center gap-2"><FaChevronRight className="text-[10px] text-red-500/50" /> CHÍNH SÁCH ĐỔI TRẢ</Link></li>
              <li><Link href="/chinh-sach-thanh-toan" className="hover:text-red-400 hover:translate-x-2 transition-all duration-300 flex items-center gap-2"><FaChevronRight className="text-[10px] text-red-500/50" /> CHÍNH SÁCH THANH TOÁN</Link></li>
            </ul>
          </div>

          {/* Col 3: CÔNG TY TNHH */}
          <div>
            <h4 className="font-black uppercase mb-6 text-[15px] text-white tracking-widest flex items-center gap-2">
              <div className="w-1.5 h-4 bg-blue-500 rounded-full"></div>
              Công ty
            </h4>
            <div className="text-[14px] text-white/60 space-y-4 leading-relaxed font-medium">
              <p className="bg-white/5 p-4 rounded-xl border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                <strong className="text-white block mb-1">CÔNG TY TNHH TM DV ZCOM</strong>
                MST: 0317130199 <br/>
                Sở KHĐT TP.HCM cấp ngày 18/01/2022
              </p>
            </div>
          </div>

          {/* Col 4: FANPAGE */}
          <div>
            <h4 className="font-black uppercase mb-6 text-[15px] text-white tracking-widest flex items-center gap-2">
              <div className="w-1.5 h-4 bg-[#1877F2] rounded-full"></div>
              Fanpage Facebook
            </h4>
            <div className="rounded-xl overflow-hidden border border-white/10 bg-white/5 h-[130px]">
              <iframe 
                src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fpcgamingthuduc&tabs=&width=340&height=130&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId" 
                width="100%" 
                height="130" 
                style={{border:"none",overflow:"hidden"}} 
                scrolling="no" 
                allowFullScreen={true} 
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              ></iframe>
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
