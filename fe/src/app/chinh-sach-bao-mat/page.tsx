import { Shield, Users, Clock, MapPin, Phone, Mail } from "lucide-react";

export const metadata = {
  title: "Chính sách bảo mật - ZCOMPUTER",
  description: "Chính sách bảo mật thông tin khách hàng của ZCOMPUTER.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="bg-gray-800 text-white rounded-2xl p-8 mb-8 flex items-center gap-6">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center shrink-0">
            <Shield size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase">Chính sách bảo mật</h1>
            <p className="text-gray-300 mt-1">Bảo vệ thông tin cá nhân của khách hàng</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Section 1 */}
          <div className="p-8 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center text-sm font-black shrink-0">1</span>
              <h2 className="text-xl font-bold text-gray-900">Mục đích thu thập thông tin cá nhân</h2>
            </div>
            <div className="ml-11 space-y-2 text-gray-600 leading-relaxed">
              <p className="mb-3">Mục đích của việc thu thập thông tin khách hàng nhằm phục vụ cho:</p>
              <ul className="space-y-2">
                <li className="flex gap-2"><span className="text-gray-800 font-bold">–</span> Hỗ trợ khách hàng: mua hàng, thanh toán, giao hàng.</li>
                <li className="flex gap-2"><span className="text-gray-800 font-bold">–</span> Cung cấp thông tin sản phẩm, dịch vụ và hỗ trợ theo yêu cầu của khách hàng.</li>
                <li className="flex gap-2"><span className="text-gray-800 font-bold">–</span> Gửi thông báo các chương trình, sản phẩm mới nhất.</li>
                <li className="flex gap-2"><span className="text-gray-800 font-bold">–</span> Giải quyết vấn đề phát sinh khi mua hàng.</li>
              </ul>
            </div>
          </div>

          {/* Section 2 */}
          <div className="p-8 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center text-sm font-black shrink-0">2</span>
              <h2 className="text-xl font-bold text-gray-900">Phạm vi thu thập thông tin</h2>
            </div>
            <div className="ml-11">
              <p className="text-gray-600 leading-relaxed mb-4">Chúng tôi thu thập thông tin cá nhân khi khách hàng đặt hàng trên website, bao gồm:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['Họ tên', 'Địa chỉ email', 'Số điện thoại', 'Địa chỉ'].map((item) => (
                  <div key={item} className="p-3 bg-gray-50 rounded-lg text-center text-sm font-semibold text-gray-700 border border-gray-200">{item}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="p-8 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center text-sm font-black shrink-0">3</span>
              <h2 className="text-xl font-bold text-gray-900">Thời gian lưu trữ thông tin</h2>
            </div>
            <div className="ml-11">
              <div className="p-4 bg-blue-50 rounded-xl border-l-4 border-blue-400">
                <p className="text-gray-700 leading-relaxed">Dữ liệu cá nhân của khách hàng sẽ được lưu trữ cho đến khi có yêu cầu hủy bỏ hoặc tự khách hàng đăng nhập và thực hiện hủy bỏ. Trong mọi trường hợp, thông tin cá nhân sẽ được bảo mật trên máy chủ của chúng tôi.</p>
              </div>
            </div>
          </div>

          {/* Section 4 */}
          <div className="p-8 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center text-sm font-black shrink-0">4</span>
              <h2 className="text-xl font-bold text-gray-900">Những bên có thể tiếp cận thông tin</h2>
            </div>
            <div className="ml-11 space-y-2 text-gray-600 leading-relaxed">
              <ul className="space-y-2">
                <li className="flex gap-2"><span className="text-gray-800 font-bold">–</span> <span><strong>Đơn vị vận chuyển:</strong> Cung cấp Tên, địa chỉ, số điện thoại để phục vụ giao nhận hàng hóa.</span></li>
                <li className="flex gap-2"><span className="text-gray-800 font-bold">–</span> <span><strong>Nhân viên công ty:</strong> Các bộ phận chuyên trách phục vụ chăm sóc khách hàng.</span></li>
                <li className="flex gap-2"><span className="text-gray-800 font-bold">–</span> <span><strong>Đối tác liên kết:</strong> Các chương trình hợp tác với yêu cầu bảo mật thông tin cá nhân.</span></li>
                <li className="flex gap-2"><span className="text-gray-800 font-bold">–</span> <span><strong>Yêu cầu pháp lý:</strong> Tiết lộ thông tin khi pháp luật yêu cầu.</span></li>
              </ul>
            </div>
          </div>

          {/* Section 5 */}
          <div className="p-8 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center text-sm font-black shrink-0">5</span>
              <h2 className="text-xl font-bold text-gray-900">Địa chỉ đơn vị thu thập và quản lý thông tin</h2>
            </div>
            <div className="ml-11 space-y-2 text-gray-600">
              <p><strong className="text-gray-800">Tên doanh nghiệp:</strong> CÔNG TY TNHH TM DV ZCOM</p>
              <p><strong className="text-gray-800">MST:</strong> 0317130199 – do Chi cục Thuế TP. Thủ Đức cấp ngày 18/01/2022</p>
              <p className="flex items-start gap-2"><MapPin size={16} className="text-gray-500 shrink-0 mt-0.5" /><span><strong className="text-gray-800">Trụ sở:</strong> 23 Đường số 1, Khu phố 61, Phường Linh Xuân (Phường Linh Tây cũ), TP.Hồ Chí Minh</span></p>
            </div>
          </div>

          {/* Section 6 */}
          <div className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center text-sm font-black shrink-0">6</span>
              <h2 className="text-xl font-bold text-gray-900">Phương thức và công cụ để người dùng tiếp cận và chỉnh sửa dữ liệu</h2>
            </div>
            <div className="ml-11 space-y-4">
              <p className="text-gray-600 leading-relaxed">Nếu quý khách có bất cứ về yêu cầu nào về việc tiếp cận và chỉnh sửa thông tin cá nhân đã cung cấp, quý khách có thể:</p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex gap-2"><span className="text-gray-800 font-bold">–</span> Gọi điện trực tiếp về số điện thoại: <strong>0977 334 415</strong></li>
                <li className="flex gap-2"><span className="text-gray-800 font-bold">–</span> Gửi mail: <strong>truong.zvncomputer@gmail.com</strong></li>
              </ul>
              
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h3 className="font-bold text-gray-800 mb-3 uppercase text-sm tracking-wide text-primary">* Cơ chế tiếp nhận và giải quyết khiếu nại của người tiêu dùng</h3>
                <p className="text-gray-600 leading-relaxed mb-3">Liên quan đến việc thông tin cá nhân bị sử dụng sai mục đích hoặc phạm vi đã thông báo:</p>
                <p className="text-gray-600 leading-relaxed mb-3">Tại zcomputer.vn, việc bảo vệ thông tin cá nhân của bạn là rất quan trọng, bạn được đảm bảo rằng thông tin cung cấp cho chúng tôi sẽ được bảo mật. ZCOMPUTER cam kết không chia sẻ, bán hoặc cho thuê thông tin cá nhân của bạn cho bất kỳ người nào khác. Chúng tôi cam kết chỉ sử dụng các thông tin của bạn vào các trường hợp sau:</p>
                <ul className="space-y-2 text-gray-600 mb-4">
                  <li className="flex gap-2"><span className="text-gray-800 font-bold">–</span> Nâng cao chất lượng dịch vụ dành cho khách hàng</li>
                  <li className="flex gap-2"><span className="text-gray-800 font-bold">–</span> Giải quyết các tranh chấp, khiếu nại trong vòng 3 ngày sau khi nhận được thông tin.</li>
                  <li className="flex gap-2"><span className="text-gray-800 font-bold">–</span> Khi cơ quan pháp luật có yêu cầu.</li>
                </ul>
                <p className="text-gray-600 leading-relaxed">ZCOMPUTER hiểu rằng quyền lợi của bạn trong việc bảo vệ thông tin cá nhân cũng chính là trách nhiệm của chúng tôi nên trong bất kỳ trường hợp có thắc mắc, góp ý nào liên quan đến chính sách bảo mật của chúng tôi, và liên quan đến việc thông tin cá nhân bị sử dụng sai mục đích hoặc phạm vi đã thông báo, vui lòng liên hệ qua số hotline <strong>0977 334 415</strong> hoặc email <strong>truong.zvncomputer@gmail.com</strong> để xử lý và làm việc trực tiếp với khách hàng.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
