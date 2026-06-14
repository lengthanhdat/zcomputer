import { ShieldCheck, RefreshCw, AlertTriangle, CheckCircle } from "lucide-react";

export const metadata = {
  title: "Chính sách đổi trả - ZCOMPUTER",
  description: "Quy định về đổi trả sản phẩm, hoàn tiền tại ZCOMPUTER.",
};

export default function ReturnPolicyPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-gray-800 text-white rounded-2xl p-8 mb-8 flex items-center gap-6">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center shrink-0">
            <RefreshCw size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase">Chính sách đổi trả</h1>
            <p className="text-gray-300 mt-1">Đảm bảo quyền lợi tối đa cho khách hàng mua sắm tại ZCOMPUTER</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="text-green-500" size={24} /> 1. Điều kiện đổi trả
            </h2>
            <ul className="list-disc ml-6 space-y-2 text-gray-600 leading-relaxed">
              <li>Sản phẩm phát sinh lỗi kỹ thuật do nhà sản xuất trong vòng <strong>07 ngày</strong> kể từ ngày nhận hàng.</li>
              <li>Sản phẩm còn nguyên vẹn, không bị móp méo, trầy xước, vào nước hay chập cháy do lỗi người dùng.</li>
              <li>Sản phẩm phải còn đầy đủ hộp, phụ kiện, sách hướng dẫn, và quà tặng kèm theo (nếu có).</li>
              <li>Phải có hóa đơn mua hàng hoặc phiếu bảo hành hợp lệ của ZCOMPUTER.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="text-yellow-500" size={24} /> 2. Trường hợp không được đổi trả
            </h2>
            <ul className="list-disc ml-6 space-y-2 text-gray-600 leading-relaxed">
              <li>Sản phẩm đã quá thời hạn 07 ngày đổi trả.</li>
              <li>Lỗi do người sử dụng (rơi vỡ, tự ý tháo ráp, sử dụng sai điện áp...).</li>
              <li>Sản phẩm mất hộp, thiếu phụ kiện, vỏ hộp rách nát.</li>
              <li>Sản phẩm là phần mềm bản quyền hoặc có tem niêm phong đã bị rách.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ShieldCheck className="text-blue-500" size={24} /> 3. Quy trình thực hiện
            </h2>
            <p className="text-gray-600 mb-3">Quy trình xử lý đổi trả diễn ra trong 3 bước:</p>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="font-bold text-gray-800">Bước 1: Liên hệ hỗ trợ</p>
                <p className="text-gray-600 mt-1">Khách hàng gọi Hotline: <strong>0977 334 415</strong> để thông báo tình trạng lỗi.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="font-bold text-gray-800">Bước 2: Gửi trả sản phẩm</p>
                <p className="text-gray-600 mt-1">Gửi sản phẩm kèm toàn bộ phụ kiện về địa chỉ cửa hàng ZCOMPUTER gần nhất.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="font-bold text-gray-800">Bước 3: Thẩm định và hoàn tất</p>
                <p className="text-gray-600 mt-1">Kỹ thuật viên kiểm tra lỗi (1-3 ngày làm việc) và tiến hành đổi sản phẩm mới hoặc hoàn tiền theo yêu cầu.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
