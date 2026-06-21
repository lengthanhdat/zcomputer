import { Truck, Clock, Package, FileText, Shield } from "lucide-react";

export const metadata = {
  title: "Chính sách vận chuyển - ZCOMPUTER",
  description: "Chính sách vận chuyển, giao nhận hàng hóa của ZCOMPUTER.",
};

export default function ShippingPolicyPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="bg-primary text-white rounded-2xl p-8 mb-8 flex items-center gap-6">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center shrink-0">
            <Truck size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase">Chính sách vận chuyển</h1>
            <p className="text-primary/10 mt-1">Áp dụng cho tất cả đơn hàng tại ZCOMPUTER</p>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Section 1 */}
          <div className="p-8 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-black shrink-0">1</span>
              <h2 className="text-xl font-bold text-gray-900">Phạm vi áp dụng</h2>
            </div>
            <p className="text-gray-600 leading-relaxed ml-11">
              Áp dụng cho <strong className="text-gray-900">tất cả mọi tỉnh thành trên cả nước</strong>.
            </p>
          </div>

          {/* Section 2 */}
          <div className="p-8 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-black shrink-0">2</span>
              <h2 className="text-xl font-bold text-gray-900">Thời gian giao – nhận hàng</h2>
            </div>
            <div className="ml-11 space-y-4">
              <div className="flex gap-3 p-4 bg-primary/10 rounded-xl border-l-4 border-primary">
                <Clock size={20} className="text-primary shrink-0 mt-0.5" />
                <p className="text-gray-700 leading-relaxed">Đơn hàng sau khi được tiếp nhận xử lý xong sẽ được giao ngay trong vòng <strong>24h</strong> hoặc theo tiến độ hợp đồng.</p>
              </div>
              <div className="flex gap-3 p-4 bg-blue-50 rounded-xl border-l-4 border-blue-400">
                <Clock size={20} className="text-blue-500 shrink-0 mt-0.5" />
                <p className="text-gray-700 leading-relaxed">Đối với khách hàng ở tỉnh xa, thời gian nhận hàng dự kiến từ <strong>3 – 5 ngày</strong> sau khi tiếp nhận đơn. Tùy vào điều kiện thời tiết và hàng hóa, ngày nhận hàng có thể thay đổi.</p>
              </div>
              <p className="text-gray-600 leading-relaxed">Thời gian giao hàng được tính từ lúc hoàn tất thủ tục đặt hàng với nhân viên tư vấn đến khi nhận được hàng.</p>
              <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                <p className="text-gray-700 text-sm leading-relaxed">⚠️ <strong>Lưu ý:</strong> Trường hợp phát sinh chậm trễ hoặc sản phẩm không được bán quá 10 ngày, khách hàng có thể hủy đơn mà <strong>không chịu bất kỳ chi phí nào</strong>.</p>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="p-8 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-black shrink-0">3</span>
              <h2 className="text-xl font-bold text-gray-900">Hình thức giao hàng</h2>
            </div>
            <div className="ml-11 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                <div className="p-4 bg-gray-50 rounded-xl flex items-center gap-3">
                  <Truck size={20} className="text-primary" />
                  <div>
                    <p className="font-bold text-gray-800 text-sm">Khách tỉnh xa</p>
                    <p className="text-gray-500 text-sm">Sử dụng dịch vụ giao hàng</p>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl flex items-center gap-3">
                  <Truck size={20} className="text-primary" />
                  <div>
                    <p className="font-bold text-gray-800 text-sm">Khách nội/ngoại thành</p>
                    <p className="text-gray-500 text-sm">Sử dụng dịch vụ giao hàng</p>
                  </div>
                </div>
              </div>
              <h3 className="font-bold text-gray-800 mb-3">Phân định trách nhiệm về chứng từ hàng hóa:</h3>
              <ul className="space-y-2 text-gray-600 leading-relaxed">
                <li className="flex gap-2"><span className="text-primary font-bold">–</span> Đơn vị vận chuyển có trách nhiệm cung cấp chứng từ hàng hóa trong quá trình giao nhận.</li>
                <li className="flex gap-2"><span className="text-primary font-bold">–</span> zcomputervn.com có trách nhiệm cung cấp đầy đủ và chính xác các chứng từ liên quan đến hàng hóa.</li>
                <li className="flex gap-2"><span className="text-primary font-bold">–</span> Tất cả các đơn hàng đều được đóng gói sẵn sàng trước khi vận chuyển, được niêm phong bởi zcomputervn.com.</li>
                <li className="flex gap-2"><span className="text-primary font-bold">–</span> Đơn vị vận chuyển giao hàng theo nguyên tắc "Nguyên đai, nguyên kiện".</li>
                <li className="flex gap-2"><span className="text-primary font-bold">–</span> Sau khi khách hàng xác nhận, ZCOMPUTER sẽ xuất hóa đơn điện tử và gửi qua email.</li>
              </ul>
            </div>
          </div>

          {/* Section 4 */}
          <div className="p-8">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-black shrink-0">4</span>
              <h2 className="text-xl font-bold text-gray-900">Chính sách kiểm hàng</h2>
            </div>
            <div className="ml-11 space-y-3 text-gray-600 leading-relaxed">
              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <p className="text-gray-700">✅ Khi nhận hàng, quý khách có quyền yêu cầu nhân viên giao hàng mở ra để kiểm tra trước khi nhận.</p>
              </div>
              <p>Trường hợp giao sai loại sản phẩm, quý khách có quyền <strong>trả hàng và không thanh toán</strong>.</p>
              <p>Trường hợp đã thanh toán nhưng nhận hàng sai, quý khách yêu cầu hoàn tiền hoặc giao lại đúng đơn.</p>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 mt-4">
                <p className="font-bold text-gray-800 mb-2">Liên hệ hỗ trợ:</p>
                <p className="text-sm text-gray-600">📧 Email: <a href="mailto:truong.zvncomputer@gmail.com" className="text-primary font-medium hover:underline">truong.zvncomputer@gmail.com</a></p>
                <p className="text-sm text-gray-600">📞 Hotline: <a href="tel:0977334415" className="text-primary font-medium hover:underline">0977 334 415</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
