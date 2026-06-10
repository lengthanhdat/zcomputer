import { ShieldCheck, AlertTriangle, RefreshCw, Phone, Mail } from "lucide-react";

export const metadata = {
  title: "Chính sách bảo hành - ZCOMPUTER",
  description: "Chính sách bảo hành, đổi trả sản phẩm tại ZCOMPUTER.",
};

export default function WarrantyPolicyPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-red-700 text-white rounded-2xl p-8 mb-8 flex items-center gap-6">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center shrink-0">
            <ShieldCheck size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase">Chính sách bảo hành & đổi trả</h1>
            <p className="text-red-100 mt-1">Cam kết bảo hành chính hãng từ ZCOMPUTER</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Section 1 & 2: Warranty */}
          <div className="p-8 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
              <ShieldCheck className="text-primary" size={22} /> Chính sách bảo hành
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-red-50 rounded-xl border-l-4 border-primary">
                <p className="font-bold text-gray-800 mb-1">Thời gian bảo hành</p>
                <p className="text-gray-600 text-sm">Tùy theo từng mặt hàng có thời gian bảo hành khác nhau. Vui lòng hỏi nhân viên tư vấn khi mua hàng.</p>
              </div>

              <h3 className="font-bold text-gray-800 mt-5 mb-3">Điều kiện được bảo hành:</h3>
              <div className="space-y-3">
                <div className="flex gap-3 items-start">
                  <span className="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5">✓</span>
                  <p className="text-gray-600 leading-relaxed">Bảo hành tất cả sản phẩm đối với các lỗi thuộc về khâu <strong>sản xuất</strong>.</p>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5">✓</span>
                  <p className="text-gray-600 leading-relaxed">Hàng hóa bảo hành phải còn nguyên <strong>tem bảo hành, tem sản phẩm</strong> và giấy biên nhận chứng minh mua hàng tại ZCOMPUTER.</p>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200 mt-4">
                <p className="font-bold text-gray-800 mb-2 flex items-center gap-2"><AlertTriangle size={16} className="text-yellow-600" /> Các trường hợp KHÔNG được bảo hành:</p>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• Làm vỡ, làm hỏng, gây biến dạng</li>
                  <li>• Để lửa gây hư hại</li>
                  <li>• Rách tem bảo hành</li>
                  <li>• Lỗi do người dùng và các trường hợp tương tự</li>
                </ul>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="font-bold text-gray-800 mb-2">Yêu cầu bảo hành:</p>
                <p className="text-gray-600 text-sm leading-relaxed">Liên hệ bộ phận chăm sóc khách hàng qua hotline <a href="tel:0977334415" className="text-primary font-bold hover:underline">0977 334 415</a>. Chúng tôi luôn sẵn sàng hỗ trợ bạn.</p>
              </div>
            </div>
          </div>

          {/* Section: Return Policy */}
          <div className="p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
              <RefreshCw className="text-primary" size={22} /> Chính sách đổi trả
            </h2>

            <div className="space-y-5">
              <div className="p-4 bg-red-50 rounded-xl border-l-4 border-primary">
                <p className="font-bold text-gray-800 mb-1">Phạm vi áp dụng đổi trả</p>
                <p className="text-gray-600 text-sm">Áp dụng đổi trả hàng trong vòng <strong>1 ngày</strong> đối với các sản phẩm bị hư hỏng do lỗi nhà sản xuất.</p>
              </div>

              <h3 className="font-bold text-gray-800 mb-3">Điều kiện đổi trả:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { text: "Thời gian đổi trả trong vòng 7 ngày kể từ ngày yêu cầu", ok: true },
                  { text: "Giữ nguyên bao bì, tem mác của sản phẩm", ok: true },
                  { text: "Số lần đổi trả cho 1 sản phẩm là 1 lần", ok: true },
                  { text: "Sản phẩm đã hết thời gian đổi trả không được chấp nhận", ok: false },
                ].map((item, idx) => (
                  <div key={idx} className={`p-3 rounded-lg border flex items-start gap-2 ${item.ok ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <span className={`font-bold text-sm mt-0.5 ${item.ok ? 'text-green-600' : 'text-red-500'}`}>{item.ok ? '✓' : '✗'}</span>
                    <p className="text-gray-700 text-sm leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-4 mt-4">
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="font-bold text-gray-800 mb-2">Đối với hàng chưa giao:</p>
                  <p className="text-gray-600 text-sm leading-relaxed">Khách hàng có thể gọi điện cho nhân viên kinh doanh để thỏa thuận chuyển sang mặt hàng khác.</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="font-bold text-gray-800 mb-3">Đối với hàng đã giao:</p>
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold text-green-700 text-sm mb-1">✓ Sản phẩm bị lỗi do nhà cung cấp:</p>
                      <p className="text-gray-600 text-sm leading-relaxed ml-4">Quý khách có quyền yêu cầu đổi hàng mới. Toàn bộ chi phí do công ty chịu.</p>
                    </div>
                    <div>
                      <p className="font-semibold text-red-600 text-sm mb-1">✗ Sản phẩm bị lỗi do khách hàng:</p>
                      <p className="text-gray-600 text-sm leading-relaxed ml-4">Nhà cung cấp không chịu trách nhiệm đổi hàng.</p>
                    </div>
                    <div>
                      <p className="font-semibold text-yellow-700 text-sm mb-1">↔ Khách muốn đổi sang sản phẩm khác (không lỗi):</p>
                      <ul className="text-gray-600 text-sm leading-relaxed ml-4 space-y-1">
                        <li>• Hàng vẫn phải nguyên đai nguyên kiện</li>
                        <li>• Kiểm tra xem có phải hàng đặc chủng không</li>
                        <li>• Mọi chi phí phát sinh (phí vận chuyển,...) khách hàng phải chịu</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="p-5 bg-primary/5 rounded-xl border border-primary/20 mt-6">
                <p className="font-bold text-gray-800 mb-3">Mọi thắc mắc, yêu cầu hỗ trợ vui lòng liên hệ:</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="tel:0977334415" className="flex items-center gap-2 px-4 py-3 bg-white rounded-lg border border-gray-200 hover:border-primary transition-colors text-gray-700">
                    <Phone size={16} className="text-primary" />
                    <span className="font-semibold">0977 334 415</span>
                    <span className="text-xs text-gray-400">(giờ hành chính)</span>
                  </a>
                  <a href="mailto:truong.zvncomputer@gmail.com" className="flex items-center gap-2 px-4 py-3 bg-white rounded-lg border border-gray-200 hover:border-primary transition-colors text-gray-700">
                    <Mail size={16} className="text-primary" />
                    <span className="font-semibold">truong.zvncomputer@gmail.com</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
