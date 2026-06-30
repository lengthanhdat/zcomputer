"use client";

import { X } from "lucide-react";
import Image from "next/image";

type InstallmentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  bank: 'HD_SAISON' | 'MIRAE_ASSET' | null;
};

export default function InstallmentModal({ isOpen, onClose, bank }: InstallmentModalProps) {
  if (!isOpen || !bank) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-300">
        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex justify-between items-center z-10">
          <h3 className="text-lg font-bold text-gray-800 uppercase">Thông tin trả góp</h3>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6">
          <div className="text-center mb-6 border-b border-gray-100 pb-6">
            <h4 className="text-md sm:text-lg font-bold text-primary mb-4 uppercase">
              Dịch vụ trả góp qua ngân hàng tài chính {bank === 'HD_SAISON' ? 'HD SAISON' : 'MIRAE ASSET'}
            </h4>
            <div className="flex justify-center">
              {bank === 'HD_SAISON' ? (
                <Image 
                  src="/HD_SAISON_logo.jpg" 
                  alt="HD SAISON" 
                  width={200} 
                  height={70} 
                  className="object-contain"
                  unoptimized
                />
              ) : (
                <Image 
                  src="/Mirae_Asset_Logo.jpg" 
                  alt="MIRAE ASSET" 
                  width={200} 
                  height={70} 
                  className="object-contain"
                  unoptimized
                />
              )}
            </div>
          </div>

          <div className="space-y-6 text-[15px]">
            {bank === 'HD_SAISON' ? (
              <>
                {/* Thủ tục hồ sơ */}
                <div>
                  <h5 className="font-bold text-gray-800 uppercase mb-3 text-[16px]">Thủ tục hồ sơ cần thiết</h5>
                  <ul className="space-y-2 text-gray-600 list-disc pl-5">
                    <li><strong className="text-gray-800">CMND + Bằng Lái xe</strong> hoặc <strong className="text-gray-800">CMND + Sổ hộ khẩu</strong></li>
                    <li><strong className="text-gray-800">Từ 21 tuổi trở lên</strong> – Dưới 21 tuổi Cần Cha và mẹ nghe điện thoại để bảo lãnh</li>
                    <li><strong className="text-gray-800">2 Số điện thoại người thân</strong> để xác minh lý lịch nhân thân</li>
                    <li><strong className="text-gray-800">Số tiền trả góp tối thiểu</strong> từ 3 Triệu trở lên</li>
                    <li><strong className="text-gray-800">Trả trước 10%</strong> đối với đơn hàng dưới 15tr</li>
                    <li><strong className="text-gray-800">Trả trước 20% đến 30%</strong> đối với các đơn hàng có giá trị cao hơn</li>
                    <li>Giấy tờ tùy thân là bản gốc còn thời hạn pháp lý</li>
                    <li><strong className="text-gray-800">Thời gian trả góp thấp nhất</strong> từ 7 tháng trở lên</li>
                  </ul>
                </div>

                {/* Quy trình */}
                <div>
                  <h5 className="font-bold text-primary uppercase mb-3 text-[16px]">Quy trình mua hàng trả góp</h5>
                  <ul className="space-y-2 text-gray-600 list-none">
                    <li><strong className="text-gray-800">Bước 1:</strong> Chọn mua sản phẩm</li>
                    <li><strong className="text-gray-800">Bước 2:</strong> Liên hệ với Nhân viên tư vấn Trả Góp</li>
                    <li><strong className="text-gray-800">Bước 3:</strong> Đem hồ sơ đầy đủ đến Z Computer Thủ Đức</li>
                    <li><strong className="text-gray-800">Bước 4:</strong> Chọn Thời gian Trả Góp Thấp nhất từ 7 Tháng trở lên</li>
                    <li><strong className="text-gray-800">Bước 5:</strong> Hoàn tất thủ tục Hồ sơ – nhận hàng</li>
                  </ul>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">Thông tin hướng dẫn thủ tục trả góp qua <strong>Mirae Asset</strong> đang được chúng tôi cập nhật...</p>
                <p className="text-gray-500 italic">Vui lòng liên hệ trực tiếp qua số Hotline bên dưới để được tư vấn hồ sơ nhanh nhất.</p>
              </div>
            )}

            {/* Tư vấn miễn phí */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex flex-col items-center sm:items-start text-center sm:text-left mt-4">
              <h5 className="font-bold text-gray-800 uppercase mb-1">Tư vấn miễn phí</h5>
              <p className="text-gray-600">Hotline: <strong className="text-primary text-xl">0977.334415</strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
