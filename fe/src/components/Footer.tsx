import Image from "next/image";
import Link from "next/link";
import { Playfair_Display, Montserrat } from "next/font/google";
import { FaFacebookF, FaInstagram, FaTiktok, FaYoutube, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaChevronRight, FaCcVisa, FaCcMastercard, FaMoneyBillWave, FaExchangeAlt } from "react-icons/fa";
import { BsBank2 } from "react-icons/bs";

const montserrat = Montserrat({ subsets: ["latin", "vietnamese"], weight: ["700", "900"] });
const playfair = Playfair_Display({ subsets: ["latin", "vietnamese"], weight: ["700", "900"] });

export default function Footer() {
  return (
    <footer className="relative bg-[#0b0f19] text-white/80 font-sans mt-0 border-t border-white/10 overflow-hidden">
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
                <div className="flex items-center gap-0.5 transition-opacity duration-300 hover:opacity-90">
                              <Image src="/logo_broken.png" alt="Z" width={80} height={80} priority className="h-12 w-12 sm:h-[60px] sm:w-[60px] object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-md relative z-10" />
                              <div className="flex items-center font-serif tracking-tight drop-shadow-sm select-none">
                                <span className="text-primary text-[44px] sm:text-[56px] font-black leading-none pb-[2px]">Z</span>
                                <div className="flex flex-col justify-center ml-0.5 sm:ml-1 mt-[2px]">
                                  <span className="text-white text-[22px] sm:text-[28px] font-black leading-[0.8] tracking-normal drop-shadow-md">COMPUTER</span>
                                  <div className="flex justify-between items-center w-full mt-[2px]">
                                    <span className="text-[6.5px] sm:text-[8.5px] font-black text-primary uppercase tracking-tight">PC</span>
                                    <span className="text-[6.5px] sm:text-[8.5px] font-black text-primary uppercase tracking-tight">GAMING</span>
                                    <span className="text-[6.5px] sm:text-[8.5px] font-black text-primary tracking-tight">-</span>
                                    <span className="text-[6.5px] sm:text-[8.5px] font-black text-primary uppercase tracking-tight">LAPTOP</span>
                                    <span className="text-[6.5px] sm:text-[8.5px] font-black text-primary tracking-tight">-</span>
                                    <span className="text-[6.5px] sm:text-[8.5px] font-black text-primary uppercase tracking-tight">WORKSTATION</span>
                                  </div>
                                </div>
                              </div>
                </div>
             </Link>
             
             <p className="text-[13px] text-white/70 leading-relaxed mb-6 font-medium text-justify">
               ZCOMPUTER - Hệ thống chuyên cung cấp PC, Laptop Cũ / Like New uy tín, chất lượng cao với mức giá tốt nhất tại khu vực TP.HCM.
             </p>
             
             <div>
               <p className="font-bold uppercase text-[12px] tracking-widest text-white/80 mb-4">THEO DÕI ZCOMPUTER TẠI</p>
               <div className="flex gap-3 mb-5">
                 <a href="https://zalo.me/0977334415" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0068FF] to-[#0054D6] flex items-center justify-center text-white hover:-translate-y-1.5 hover:shadow-[0_8px_20px_rgba(0,104,255,0.4)] transition-all duration-300 border border-white/10 group">
                   <span className="text-[14px] font-bold font-sans tracking-tight group-hover:scale-110 transition-transform leading-none mt-0">Zalo</span>
                 </a>
                 <a href="https://vt.tiktok.com/ZSQxHwj4q/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gradient-to-br from-[#252525] to-[#000000] flex items-center justify-center text-white hover:-translate-y-1.5 hover:shadow-[0_8px_20px_rgba(255,255,255,0.15)] transition-all duration-300 border border-white/20 group">
                   <FaTiktok size={18} className="group-hover:scale-110 transition-transform" />
                 </a>
               </div>

               {/* Custom Facebook Fanpage Widget (Tránh bị cắt chữ như iframe mặc định) */}
               <div className="rounded-lg overflow-hidden bg-white max-w-[340px] shadow-lg border border-white/10 font-sans">
                 <div className="p-2.5 flex gap-2.5">
                   <a href="https://www.facebook.com/pcgamingthuduc" target="_blank" rel="noreferrer" className="shrink-0 mt-0.5">
                     <div className="w-[50px] h-[50px] border border-gray-300 flex items-center justify-center bg-white p-0.5 shadow-sm">
                       <Image src="/logo_broken.png" alt="Z Computer" width={46} height={46} className="w-full h-full object-contain" unoptimized />
                     </div>
                   </a>
                   <div className="flex flex-col justify-start">
                     <a href="https://www.facebook.com/pcgamingthuduc" target="_blank" rel="noreferrer" className="text-[#385898] font-semibold text-[14px] leading-tight hover:underline">
                       Z Computer : Gaming.Nox.Office - All for your PC
                     </a>
                     <p className="text-[#606770] text-[12px] mt-1">3.185 người theo dõi</p>
                   </div>
                 </div>
                 <div className="bg-[#f5f6f7] border-t border-[#e9ebee] p-2 flex items-center">
                   <a href="https://www.facebook.com/pcgamingthuduc" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 bg-[#f5f6f7] border border-[#ccd0d5] hover:bg-[#ebedf0] text-[#4b4f56] font-semibold text-[12px] px-2 py-1 rounded-[3px] transition-colors">
                     <FaFacebookF size={14} className="text-[#385898]" />
                     Theo dõi Trang
                   </a>
                 </div>
               </div>
             </div>
          </div>

          {/* Col 2: DANH MỤC CŨ / LIKE NEW */}
          <div className="md:col-span-3 lg:col-span-2">
            <h4 className="font-black uppercase mb-5 text-[14px] text-white tracking-wider">
              DANH MỤC CŨ/ LIKE NEW
            </h4>
            <ul className="space-y-3 text-[13px] text-white/60 font-medium">
              <li><Link href="/search?q=PC" className="hover:text-primary transition-colors">PC Cũ</Link></li>
              <li><Link href="/search?q=Laptop" className="hover:text-primary transition-colors">Laptop Cũ</Link></li>
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
              <li><Link href="/chinh-sach-doi-tra" className="hover:text-primary transition-colors">Chính sách đổi trả</Link></li>
              <li><Link href="/chinh-sach-bao-mat" className="hover:text-primary transition-colors">Chính sách bảo mật</Link></li>
              <li><Link href="/chinh-sach-bao-hanh" className="hover:text-primary transition-colors">Chính sách bảo hành</Link></li>
              <li><Link href="/chinh-sach-thanh-toan" className="hover:text-primary transition-colors">Chính sách thanh toán</Link></li>
              <li><Link href="/chinh-sach-van-chuyen" className="hover:text-primary transition-colors">Chính sách vận chuyển</Link></li>
            </ul>
          </div>

          {/* Col 4: VỀ ZCOMPUTER */}
          <div className="md:col-span-4 lg:col-span-2">
            <h4 className="font-black uppercase mb-5 text-[14px] text-white tracking-wider">
              VỀ ZCOMPUTER
            </h4>
            <ul className="space-y-3 text-[13px] text-white/60 font-medium">
              <li><Link href="/lien-he" className="hover:text-primary transition-colors">Liên Hệ</Link></li>
              <li><Link href="/tin-tuc" className="hover:text-primary transition-colors">Tin Tức</Link></li>
              <li><Link href="/tuyen-dung" className="hover:text-primary transition-colors">Tuyển Dụng</Link></li>
              <li><Link href="/he-thong-cua-hang" className="hover:text-primary transition-colors">Hệ Thống Cửa Hàng</Link></li>
              <li><Link href="/ve-chung-toi" className="hover:text-primary transition-colors">Giới Thiệu Về ZCOMPUTER</Link></li>
            </ul>
          </div>

          {/* Col 5: CÔNG TY TNHH & THANH TOÁN */}
          <div className="md:col-span-8 lg:col-span-3 lg:pl-4 flex flex-col justify-between">
            <div>
              <h4 className="font-black uppercase mb-5 text-[14px] text-white tracking-wider">
                CÔNG TY TNHH TM DV ZCOM
              </h4>
              <div className="text-[13px] text-white/60 space-y-2 leading-relaxed font-medium mb-6">
                <p>Mã số GPKD: 0317130199 - Được cấp phép bởi Sở KH và ĐT Thành phố Hồ Chí Minh.</p>
                <p className="pt-2">Cung cấp linh kiện máy tính chính hãng</p>
                <p>Máy tính chơi Game - Máy Tính Đồ Họa - Máy Tính Văn Phòng</p>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-bold uppercase mb-4 text-[14px] text-white tracking-widest">
                HỖ TRỢ THANH TOÁN
              </h4>
              <div className="grid grid-cols-4 gap-2">
                {/* VISA */}
                <div className="bg-white rounded flex items-center justify-center py-2 px-1 shadow-sm h-[38px]">
                  <span className="text-[#1434CB] font-black italic text-[17px] tracking-tighter">VISA</span>
                </div>
                {/* Mastercard */}
                <div className="bg-white rounded flex flex-col items-center justify-center py-1 px-1 shadow-sm relative overflow-hidden h-[38px]">
                  <div className="flex -space-x-1.5 mt-0.5">
                    <div className="w-3.5 h-3.5 rounded-full bg-[#EB001B] opacity-90 mix-blend-multiply"></div>
                    <div className="w-3.5 h-3.5 rounded-full bg-[#F79E1B] opacity-90 mix-blend-multiply"></div>
                  </div>
                  <span className="text-[6px] font-bold mt-0.5 text-black">mastercard</span>
                </div>
                {/* JCB */}
                <div className="bg-white rounded flex flex-col items-center justify-center shadow-sm h-[38px]">
                  <div className="flex items-center gap-[1px]">
                    <div className="bg-[#003883] text-white font-bold text-[8px] w-3 h-4 flex items-center justify-center rounded-sm rounded-tr-none rounded-br-none pt-0.5">J</div>
                    <div className="bg-[#C11030] text-white font-bold text-[8px] w-3 h-4 flex items-center justify-center pt-0.5">C</div>
                    <div className="bg-[#007F3E] text-white font-bold text-[8px] w-3 h-4 flex items-center justify-center rounded-sm rounded-tl-none rounded-bl-none pt-0.5">B</div>
                  </div>
                </div>
                {/* AMEX */}
                <div className="bg-white rounded flex items-center justify-center p-1 shadow-sm h-[38px]">
                  <div className="bg-[#006FCF] text-white font-bold text-[7px] text-center w-full h-full rounded-sm flex items-center justify-center leading-none">
                    AM<br/>EX
                  </div>
                </div>
                {/* VNPAY */}
                <div className="bg-white rounded flex items-center justify-center p-1 shadow-sm h-[38px]">
                  <span className="font-bold text-[10px] tracking-tighter"><span className="text-[#ED1C24]">VNPAY</span><sup className="text-[5px] font-black text-[#005BAB] ml-[1px]">QR</sup></span>
                </div>
                {/* ZaloPay */}
                <div className="bg-white rounded flex items-center justify-center p-1 shadow-sm h-[38px]">
                  <span className="font-bold text-[10px] tracking-tight"><span className="text-[#0052CC]">Zalo</span><span className="text-[#00B14F]">pay</span></span>
                </div>
                {/* Napas */}
                <div className="bg-white rounded flex items-center justify-center p-1 shadow-sm h-[38px]">
                  <span className="text-[#002776] font-black italic text-[11px] tracking-tighter flex items-center">napas<span className="text-[#4E9C2D] text-[7px] ml-[1px]">★</span></span>
                </div>
                {/* Kredivo */}
                <div className="bg-white rounded flex items-center justify-center p-1 shadow-sm h-[38px]">
                  <span className="font-bold text-[10px] tracking-tight flex items-center">
                    <span className="text-[#F16522] mr-[1px] text-[13px]">K</span><span className="text-[#0072B5]">redivo</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-bold uppercase mb-4 text-[14px] text-white tracking-widest">
                HỖ TRỢ TRẢ GÓP
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {/* HD Saison */}
                <div className="bg-white border border-gray-100 rounded flex items-center justify-center shadow-sm h-[38px] hover:shadow-md transition-all overflow-hidden p-1">
                  <Image src="/HD_SAISON_logo.jpg" alt="HD SAISON" width={100} height={36} className="w-full h-full object-contain" unoptimized />
                </div>
                {/* Mirae Asset */}
                <div className="bg-white border border-gray-100 rounded flex items-center justify-center p-1 shadow-sm h-[38px] hover:shadow-md transition-all overflow-hidden">
                  <Image src="/Mirae_Asset_Logo.jpg" alt="Mirae Asset" width={100} height={36} className="w-full h-full object-contain" unoptimized />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-white/10 bg-black/80 backdrop-blur-lg py-8 z-10">
        <div className="container mx-auto px-4 flex flex-col items-center text-center">
          <h5 className="text-white font-bold text-[13px] mb-3 uppercase tracking-wider">CÔNG TY TNHH THƯƠNG MẠI DỊCH VỤ ZCOM</h5>
          <div className="text-[12px] text-white/50 space-y-2 font-medium max-w-3xl">
            <p><strong className="text-white/70">Mã số GPKD:</strong> 0317130199 - Cấp bởi Sở Kế Hoạch và Đầu Tư TP. Hồ Chí Minh.</p>
            <p><strong className="text-white/70">Địa chỉ Trụ Sở:</strong> 23 Đường số 1, Khu phố 61, Phường Linh Xuân, TP. Thủ Đức, TP.HCM.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-0 mt-1">
              <span><strong className="text-white/70">Email:</strong> truong.zvncomputer@gmail.com</span>
              <span className="hidden sm:inline mx-2 opacity-30">|</span>
              <span><strong className="text-white/70">Hotline:</strong> 0977 334 415</span>
            </div>
          </div>
          <div className="text-[12px] font-medium text-white/30 tracking-wide mt-6 pt-5 border-t border-white/5 w-full max-w-2xl">
             © 2026 <strong className="text-white/50">ZCOMPUTER</strong>. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
