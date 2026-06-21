import { ShieldCheck, AlertTriangle, RefreshCw, FileText, CheckCircle, XCircle } from "lucide-react";

export const metadata = {
  title: "Quy định bảo hành - ZCOMPUTER",
  description: "Chính sách và quy định bảo hành, đổi trả sản phẩm tại ZCOMPUTER.",
};

export default function WarrantyPolicyPage() {
  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-20">
      {/* Header Banner */}
      <div className="bg-[#111] py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck size={40} className="text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-4">
              QUY ĐỊNH BẢO HÀNH TẠI <span className="text-primary">ZCOMPUTER</span>
            </h1>
            <p className="text-gray-400 text-lg">Đảm bảo quyền lợi tối đa cho khách hàng khi mua sắm tại ZComputer.</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-5xl mx-auto overflow-hidden">
          
          <div className="p-8 md:p-12 space-y-12">

            {/* Mục I */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                  <RefreshCw size={24} />
                </div>
                <h2 className="text-2xl font-black text-gray-800 uppercase">I. THỜI GIAN VÀ PHẠM VI BẢO HÀNH</h2>
              </div>
              <ul className="space-y-4 text-gray-600 ml-[52px]">
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-green-500 mt-1 shrink-0" size={18} />
                  <span><strong className="text-gray-800">Bảo hành Toàn Diện (01 Tháng):</strong> Bảo hành toàn bộ linh kiện phần cứng bao gồm: Màn hình, bàn phím, touchpad, ổ cứng (SSD), RAM, loa, webcam, các cổng kết nối và pin.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-green-500 mt-1 shrink-0" size={18} />
                  <span><strong className="text-gray-800">Bảo hành Bo Mạch & Nguồn (03 Tháng):</strong> Bảo hành mainboard (bo mạch chủ), IC nguồn, và các lỗi phần cứng trên bo mạch khiến máy không lên nguồn.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-green-500 mt-1 shrink-0" size={18} />
                  <span><strong className="text-gray-800">Đặc quyền máy cũ:</strong> * Tặng 02 lần vệ sinh máy, tra keo tản nhiệt miễn phí (áp dụng trong vòng 12 tháng kể từ ngày mua).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-green-500 mt-1 shrink-0" size={18} />
                  <span><strong className="text-gray-800">Bao test đổi máy:</strong> Trong vòng 03 ngày đầu nếu không ưng ý (yêu cầu máy giữ nguyên tình trạng ngoại hình ban đầu). Khách hàng có thể đổi sang dòng máy khác bằng tiền hoặc cao tiền hơn và bù thêm khoản chênh lệch.</span>
                </li>
              </ul>
            </section>

            <hr className="border-gray-100" />

            {/* Mục II */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                  <FileText size={24} />
                </div>
                <h2 className="text-2xl font-black text-gray-800 uppercase">II. ĐIỀU KIỆN TIẾP NHẬN BẢO HÀNH</h2>
              </div>
              <ul className="space-y-4 text-gray-600 ml-[52px]">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></div>
                  <span>Máy còn nguyên vẹn tem bảo hành của cửa hàng, không có dấu hiệu bị rách, tẩy xóa, dán đè hoặc bong tróc.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></div>
                  <span>Số Serial / Tag máy trên phiếu bảo hành phải trùng khớp với số Serial hiển thị trên máy (hoặc trong BIOS).</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></div>
                  <span>Máy được xác định lỗi do linh kiện, không có tác động phá hoại hay tai nạn từ bên ngoài.</span>
                </li>
              </ul>
            </section>

            <hr className="border-gray-100" />

            {/* Mục III */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center shrink-0">
                  <AlertTriangle size={24} />
                </div>
                <h2 className="text-2xl font-black text-gray-800 uppercase">III. CÁC TRƯỜNG HỢP TỪ CHỐI BẢO HÀNH</h2>
              </div>
              <p className="text-gray-500 mb-6 ml-[52px] italic">(Khách hàng lưu ý) Z Computer xin phép từ chối bảo hành đối với các trường hợp:</p>
              
              <ul className="space-y-4 text-gray-600 ml-[52px]">
                <li className="flex items-start gap-2">
                  <XCircle className="text-primary mt-1 shrink-0" size={18} />
                  <span><strong className="text-gray-800">Lỗi ngoại quan sau khi rời cửa hàng:</strong> Máy bị rơi rớt, va đập, cấn móp, nứt vỡ vỏ, trầy xước nặng so với tình trạng bàn giao ban đầu.</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="text-primary mt-1 shrink-0" size={18} />
                  <span><strong className="text-gray-800">Sự cố màn hình do tác động lực:</strong> Màn hình bị vỡ, chảy mực, bị sọc màn hoặc đốm trắng/đen phát sinh sau khi mua (đây là lỗi do cấn đè hoặc ngoại lực trong quá trình di chuyển).</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="text-primary mt-1 shrink-0" size={18} />
                  <span><strong className="text-gray-800">Vấn đề về Pin:</strong> Hao mòn tự nhiên (pin chai dần theo thời gian sử dụng). Cửa hàng chỉ bảo hành pin trong tháng đầu nếu pin chết hẳn, không sạc vào điện hoặc sụt nguồn đột ngột dưới 1 tiếng.</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="text-primary mt-1 shrink-0" size={18} />
                  <span><strong className="text-gray-800">Sự cố chất lỏng & Môi trường:</strong> Máy bị đổ nước, bia, chất lỏng vào; máy bị ẩm rỉ mạch do môi trường hoặc có côn trùng (gián, kiến...) chui vào gây chập cháy.</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="text-primary mt-1 shrink-0" size={18} />
                  <span><strong className="text-gray-800">Sử dụng sai cách & Can thiệp phần cứng:</strong> Chập cháy do dùng sai dòng điện, dùng sạc lô sai công suất; Khách hàng tự ý tháo máy, tự nâng cấp linh kiện hoặc rách tem niêm phong mà không có sự xác nhận của cửa hàng.</span>
                </li>
              </ul>
            </section>

          </div>

          <div className="bg-gray-50 border-t border-gray-100 p-6 text-center text-gray-500 text-sm">
            <i>(Vui lòng giữ phiếu này cẩn thận để đối chiếu khi đến bảo hành).</i>
          </div>

        </div>
      </div>
    </div>
  );
}
