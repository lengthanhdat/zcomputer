import { CreditCard, Banknote, Landmark } from "lucide-react";

export const metadata = {
  title: "Chính sách thanh toán - ZCOMPUTER",
  description: "Các phương thức thanh toán an toàn và tiện lợi tại ZCOMPUTER.",
};

export default function PaymentPolicyPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="bg-gray-800 text-white rounded-2xl p-8 mb-8 flex items-center gap-6">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center shrink-0">
            <CreditCard size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase">Chính sách thanh toán</h1>
            <p className="text-gray-300 mt-1">Hướng dẫn thanh toán an toàn, bảo mật tại ZCOMPUTER</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b pb-4">
              I. PHƯƠNG THỨC THANH TOÁN
            </h2>
            
            <div className="space-y-8">
              {/* COD */}
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0 mt-1">
                  <Banknote size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">* Thanh toán bằng tiền mặt:</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Khách hàng thanh toán bằng tiền mặt trực tiếp khi nhận hàng (Ship COD).
                  </p>
                </div>
              </div>

              {/* Bank Transfer */}
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0 mt-1">
                  <Landmark size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">* Thanh toán bằng hình thức chuyển khoản:</h3>
                  
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mt-3">
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 border-b border-gray-200 pb-2">
                        <span className="text-sm text-gray-500 w-32 font-medium">Tên tài khoản:</span>
                        <strong className="text-lg text-gray-900">CÔNG TY TNHH THƯƠNG MẠI DỊCH VỤ ZCOM</strong>
                      </li>
                      <li className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 border-b border-gray-200 pb-2">
                        <span className="text-sm text-gray-500 w-32 font-medium">Ngân hàng:</span>
                        <span className="font-medium">Ngân hàng thương mại Á Châu (ACB) – Chi nhánh Thủ Đức, HCM</span>
                      </li>
                      <li className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 border-b border-gray-200 pb-2">
                        <span className="text-sm text-gray-500 w-32 font-medium">Số tài khoản:</span>
                        <strong className="text-xl text-primary tracking-wider">923925888</strong>
                      </li>
                      <li className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 pt-2">
                        <span className="text-sm text-gray-500 w-32 font-medium shrink-0">Nội dung CK:</span>
                        <span className="font-medium bg-yellow-100 text-yellow-800 px-3 py-1 rounded">Số điện thoại mua hàng + mã đơn hàng</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                    <p className="text-sm text-blue-800 font-medium">
                      Lưu ý: Sau khi nhận được chuyển khoản chậm nhất sau 12 tiếng chúng tôi sẽ gọi điện xác nhận với khách hàng.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
