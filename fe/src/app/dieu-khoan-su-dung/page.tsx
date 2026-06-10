import { Shield, BookOpen, Clock, MapPin, Phone, Mail, FileText } from "lucide-react";

export const metadata = {
  title: "Điều khoản sử dụng - ZCOMPUTER",
  description: "Điều khoản sử dụng và quy định chung khi mua hàng tại ZCOMPUTER.",
};

export default function TermsOfUsePage() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="bg-gray-800 text-white rounded-2xl p-8 mb-8 flex items-center gap-6">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center shrink-0">
            <BookOpen size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase">Điều khoản sử dụng</h1>
            <p className="text-gray-300 mt-1">Các quy định chung khi sử dụng dịch vụ tại ZCOMPUTER</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Section 1 */}
          <div className="p-8 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center text-sm font-black shrink-0">1</span>
              <h2 className="text-xl font-bold text-gray-900">Quy định chung</h2>
            </div>
            <div className="ml-11 space-y-3 text-gray-600 leading-relaxed">
              <p>Chào mừng Quý khách đến với website thương mại điện tử ZCOMPUTER.</p>
              <p>Khi Quý khách truy cập vào trang web của chúng tôi, đồng nghĩa với việc Quý khách đồng ý với các điều khoản này. Trang web có quyền thay đổi, chỉnh sửa, thêm hoặc lược bỏ bất kỳ phần nào trong Điều khoản mua bán hàng hóa này, vào bất cứ lúc nào. Các thay đổi có hiệu lực ngay khi được đăng trên trang web mà không cần thông báo trước.</p>
              <p>Vui lòng kiểm tra thường xuyên để cập nhật những thay đổi của chúng tôi.</p>
            </div>
          </div>

          {/* Section 2 */}
          <div className="p-8 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center text-sm font-black shrink-0">2</span>
              <h2 className="text-xl font-bold text-gray-900">Hướng dẫn sử dụng website</h2>
            </div>
            <div className="ml-11 space-y-2 text-gray-600 leading-relaxed">
              <ul className="space-y-2">
                <li className="flex gap-2"><span className="text-gray-800 font-bold">–</span> Khi vào web của chúng tôi, khách hàng phải đảm bảo đủ 18 tuổi, hoặc truy cập dưới sự giám sát của cha mẹ hay người giám hộ hợp pháp. Khách hàng đảm bảo có đầy đủ hành vi dân sự để thực hiện các giao dịch mua bán theo quy định pháp luật Việt Nam.</li>
                <li className="flex gap-2"><span className="text-gray-800 font-bold">–</span> Nghiêm cấm sử dụng bất kỳ phần nào của trang web này với mục đích thương mại hoặc nhân danh bất kỳ đối tác thứ ba nào nếu không được chúng tôi cho phép bằng văn bản.</li>
              </ul>
            </div>
          </div>

          {/* Section 3 */}
          <div className="p-8 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center text-sm font-black shrink-0">3</span>
              <h2 className="text-xl font-bold text-gray-900">Ý kiến của khách hàng</h2>
            </div>
            <div className="ml-11">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-gray-700 leading-relaxed">Tất cả nội dung trang web và ý kiến phê bình của Quý khách đều là tài sản của chúng tôi. Nếu chúng tôi phát hiện bất kỳ thông tin giả mạo nào, chúng tôi sẽ khóa tài khoản của Quý khách ngay lập tức hoặc áp dụng các biện pháp khác theo quy định của pháp luật Việt Nam.</p>
              </div>
            </div>
          </div>

          {/* Section 4 */}
          <div className="p-8 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center text-sm font-black shrink-0">4</span>
              <h2 className="text-xl font-bold text-gray-900">Chấp nhận đơn hàng và giá cả</h2>
            </div>
            <div className="ml-11 space-y-3 text-gray-600 leading-relaxed">
              <p>Chúng tôi có quyền từ chối hoặc hủy đơn hàng của Quý khách vì bất kỳ lý do gì liên quan đến lỗi kỹ thuật, hệ thống một cách khách quan vào bất kỳ lúc nào.</p>
              <p>Chúng tôi cam kết sẽ cung cấp thông tin giá cả chính xác nhất cho người tiêu dùng. Tuy nhiên, đôi lúc vẫn có sai sót xảy ra, ví dụ như trường hợp giá sản phẩm không hiển thị chính xác trên trang web hoặc sai giá, tùy theo từng trường hợp chúng tôi sẽ liên hệ hướng dẫn hoặc thông báo hủy đơn hàng đó cho Quý khách.</p>
            </div>
          </div>

          {/* Section 5 */}
          <div className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center text-sm font-black shrink-0">5</span>
              <h2 className="text-xl font-bold text-gray-900">Giải quyết khiếu nại, tranh chấp</h2>
            </div>
            <div className="ml-11 space-y-4">
              <p className="text-gray-600 leading-relaxed">Bất kỳ tranh cãi, khiếu nại hoặc tranh chấp phát sinh từ hoặc liên quan đến giao dịch tại ZCOMPUTER hoặc các Quy định và Điều kiện này đều sẽ được giải quyết bằng hình thức thương lượng, hòa giải, trọng tài và/hoặc Tòa án theo Luật bảo vệ Người tiêu dùng.</p>
              <div className="p-5 bg-blue-50 rounded-xl border border-blue-100">
                <p className="font-bold text-gray-800 mb-3">Mọi thắc mắc, vui lòng liên hệ:</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="tel:0977334415" className="flex items-center gap-2 px-4 py-3 bg-white rounded-lg border border-blue-200 hover:border-blue-400 transition-colors text-gray-700">
                    <Phone size={16} className="text-primary" />
                    <span className="font-semibold">0977 334 415</span>
                  </a>
                  <a href="mailto:truong.zvncomputer@gmail.com" className="flex items-center gap-2 px-4 py-3 bg-white rounded-lg border border-blue-200 hover:border-blue-400 transition-colors text-gray-700">
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
