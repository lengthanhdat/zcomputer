import { ShoppingCart, MousePointerClick, CreditCard, Package } from "lucide-react";

export const metadata = {
  title: "Hướng dẫn mua hàng - ZCOMPUTER",
  description: "Các bước đặt hàng và thanh toán nhanh chóng tại ZCOMPUTER.",
};

export default function BuyingGuidePage() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-gray-800 text-white rounded-2xl p-8 mb-8 flex items-center gap-6">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center shrink-0">
            <ShoppingCart size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase">Hướng dẫn mua hàng</h1>
            <p className="text-gray-300 mt-1">Các bước đặt mua linh kiện và máy tính nhanh chóng</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="p-8 border-b md:border-b-0 md:border-r border-gray-100">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                  <MousePointerClick size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Bước 1: Chọn Sản Phẩm</h3>
                <p className="text-gray-600">Tìm kiếm hoặc duyệt qua danh mục để chọn sản phẩm ưng ý. Bấm "Thêm vào giỏ hàng" hoặc "Mua ngay".</p>
              </div>
            </div>

            <div className="p-8 border-b border-gray-100">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                  <ShoppingCart size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Bước 2: Kiểm tra Giỏ Hàng</h3>
                <p className="text-gray-600">Kiểm tra lại số lượng, giá tiền. Áp dụng mã giảm giá (nếu có) và bấm "Tiến hành thanh toán".</p>
              </div>
            </div>

            <div className="p-8 border-b md:border-b-0 md:border-r border-gray-100">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                  <CreditCard size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Bước 3: Điền Thông Tin & Thanh Toán</h3>
                <p className="text-gray-600">Điền chính xác địa chỉ nhận hàng và số điện thoại. Chọn hình thức thanh toán (COD, Chuyển khoản, VNPay).</p>
              </div>
            </div>

            <div className="p-8">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
                  <Package size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Bước 4: Nhận Hàng</h3>
                <p className="text-gray-600">Hoàn tất đặt hàng! Chúng tôi sẽ gọi lại xác nhận. Sau đó, sản phẩm sẽ được đóng gói và giao đến tận nhà bạn.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-8 border-t border-gray-100">
             <h3 className="text-lg font-bold text-gray-900 mb-2">Hỗ trợ đặt hàng:</h3>
             <p className="text-gray-600">Nếu gặp khó khăn trong quá trình đặt hàng, vui lòng gọi điện thoại trực tiếp đến tổng đài <strong className="text-red-600">0977 334 415</strong> để được nhân viên hỗ trợ nhanh nhất.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
