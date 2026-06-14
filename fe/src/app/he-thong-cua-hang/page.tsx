import { Metadata } from "next";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Hệ thống cửa hàng | ZCOMPUTER",
  description: "Hệ thống showroom ZCOMPUTER tại TP.Hồ Chí Minh. Chuyên cung cấp linh kiện PC, Laptop & thiết bị hi-end chính hãng.",
};

export default function ShowroomPage() {
  const branches = [
    {
      id: 1,
      name: "Chi nhánh Thủ Đức",
      address: "23 Đường số 1, Khu phố 61, Phường Linh Xuân (Phường Linh Tây cũ), TP.Hồ Chí Minh",
      phone: "0977 334 415",
      email: "truong.zvncomputer@gmail.com",
      workingHours: "09:30 - 19:30 (Thứ 2 - Chủ Nhật)",
      mapLink: "https://www.google.com/maps/place/Z+Computer-+Pc+Gaming-Laptop-Workstation/@10.8526774,106.7527106,17.5z/data=!4m6!3m5!1s0x31752722e4c10833:0x6ac88810b4b7dee!8m2!3d10.8521273!4d106.7538518!16s%2Fg%2F11lbjb7txf?hl=vi&entry=ttu&g_ep=EgoyMDI2MDYxMC4wIKXMDSoASAFQAw%3D%3D",
      mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.4206!2d106.75127687612762!3d10.852127289301227!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752722e4c10833%3A0x6ac88810b4b7dee!2sZ%20Computer-%20Pc%20Gaming-Laptop-Workstation!5e0!3m2!1svi!2svn!4v1718000000000",
      image: "/images/store-1.jpg" // Placeholder if they want to add store image
    },
    {
      id: 2,
      name: "Chi nhánh Bình Thạnh",
      address: "47/86B Bùi Đình Tuý, Phường 14, Q. Bình Thạnh, TP. Hồ Chí Minh",
      phone: "0977 334 415",
      email: "truong.zvncomputer@gmail.com",
      workingHours: "09:30 - 19:30 (Thứ 2 - Chủ Nhật)",
      mapLink: "https://www.google.com/maps/place/ZCOMPUTER-B%C3%8CNH+TH%E1%BA%A0NH/@10.8074702,106.7012918,16z/data=!4m10!1m2!2m1!1zNDcvODZCIELDuWkgxJDDrG5oIFR1w70sIFBoxrDhu51uZyAxNCwgUS4gQsOsbmggVGjhuqFuaCwgSOG7kyBDaMOtIE1pbmg!3m6!1s0x317529000263c50f:0x1694f4d065ba8f53!8m2!3d10.8057646!4d106.7072568!15sCkc0Ny84NkIgQsO5aSDEkMOsbmggVHXDvSwgUGjGsOG7nW5nIDE0LCBRLiBCw6xuaCBUaOG6oW5oLCBI4buTIENow60gTWluaFpFIkM0NyA4NmIgYsO5aSDEkcOsbmggdHXDvSBwaMaw4budbmcgMTQgcSBiw6xuaCB0aOG6oW5oIGjhu5MgY2jDrSBtaW5okgERZWxlY3Ryb25pY3Nfc3RvcmWaAURDaTlEUVVsUlFVTnZaRU5vZEhsalJqbHZUMnBHZFZSdFRYcFRhMW94WTBoRmVrMXRTVE5SYTJSSVlWaE9VbFpZWXhBQuABAPoBBAgAED0!16s%2Fg%2F11m6djbz1k?hl=vi&entry=ttu&g_ep=EgoyMDI2MDYxMC4wIKXMDSoASAFQAw%3D%3D",
      mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.1234!2d106.70468187612711!3d10.805764589344443!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529000263c50f%3A0x1694f4d065ba8f53!2sZCOMPUTER-B%C3%8CNH%20TH%E1%BA%A0NH!5e0!3m2!1svi!2svn!4v1718000000000",
      image: "/images/store-2.jpg"
    }
  ];

  return (
    <div className="bg-[#f8f9fa] min-h-screen py-10">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Hệ thống cửa hàng</span>
        </div>

        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tight mb-4">
            HỆ THỐNG <span className="text-primary">ZCOMPUTER</span>
          </h1>
          <p className="text-gray-600 text-base md:text-lg">
            Ghé thăm trực tiếp các showroom của chúng tôi để trải nghiệm tận tay những dàn PC siêu khủng và các thiết bị công nghệ hiện đại nhất.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {branches.map((branch) => (
            <div key={branch.id} className="flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-lg transition-shadow">
              {/* Info Section */}
              <div className="p-8 flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 group-hover:text-primary transition-colors">
                  {branch.name}
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-50 text-primary flex items-center justify-center shrink-0 mt-1">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Địa chỉ</h3>
                      <p className="text-gray-600 leading-relaxed">{branch.address}</p>
                      <a href={branch.mapLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:text-red-700 mt-2">
                        Mở Google Maps &rarr;
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-1">
                      <Phone size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Hotline tư vấn</h3>
                      <a href={`tel:${branch.phone.replace(/\s/g, '')}`} className="text-gray-600 hover:text-primary font-medium text-lg">
                        {branch.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shrink-0 mt-1">
                      <Clock size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Giờ làm việc</h3>
                      <p className="text-gray-600">{branch.workingHours}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Embed Section */}
              <div className="h-[300px] w-full bg-gray-200">
                <iframe 
                  src={branch.mapEmbed} 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={false} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Bản đồ ${branch.name}`}
                ></iframe>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
