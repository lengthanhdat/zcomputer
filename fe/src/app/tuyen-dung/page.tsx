"use client";

import { useState, useEffect } from "react";
import { Briefcase, Users, Star, Zap, DollarSign, Award, ChevronRight } from "lucide-react";
import Link from "next/link";

interface Job {
  _id: string;
  title: string;
  department: string;
  location: string;
  salary: string;
  type: string;
  deadline: string;
  isHot: boolean;
}

export default function RecruitmentPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/jobs")
      .then(res => res.json())
      .then(data => {
        setJobs(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching jobs:", err);
        setLoading(false);
      });
  }, []);
  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-20">
      {/* Header Banner */}
      <div className="bg-[#111] py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-6">
              TUYỂN DỤNG <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">ZCOMPUTER</span>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-red-600 to-orange-500 mx-auto mb-8 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.5)]"></div>
            <p className="text-gray-300 text-lg leading-relaxed">
              Gia nhập đội ngũ ZComputer ngay hôm nay! Chúng tôi luôn tìm kiếm những con người đam mê công nghệ, nhiệt huyết và khát khao khẳng định bản thân.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 relative z-20">
        
        {/* Lợi ích khi gia nhập */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center text-center transform transition-transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-6">
              <DollarSign size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3 uppercase">Thu nhập hấp dẫn</h3>
            <p className="text-gray-500 leading-relaxed text-sm">Lương cứng cạnh tranh, thưởng KPIs không giới hạn. Xét duyệt tăng lương định kỳ 6 tháng/lần.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center text-center transform transition-transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-6">
              <Star size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3 uppercase">Môi trường năng động</h3>
            <p className="text-gray-500 leading-relaxed text-sm">Làm việc trong môi trường trẻ trung, sáng tạo, tiếp xúc trực tiếp với các thiết bị công nghệ mới nhất.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center text-center transform transition-transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-6">
              <Award size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3 uppercase">Lộ trình thăng tiến</h3>
            <p className="text-gray-500 leading-relaxed text-sm">Cơ hội đào tạo chuyên sâu và thăng tiến rõ ràng lên các vị trí Trưởng nhóm, Quản lý cửa hàng.</p>
          </div>
        </div>

        {/* Danh sách việc làm */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-16">
          <div className="p-8 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Vị trí đang tuyển</h2>
              <p className="text-gray-500 mt-2">Tìm kiếm cơ hội phù hợp với năng lực của bạn.</p>
            </div>
            <Briefcase size={36} className="text-red-500 opacity-20 hidden sm:block" />
          </div>
          
          <div className="divide-y divide-gray-100 min-h-[200px] relative">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
                <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : jobs.length > 0 ? (
              jobs.map(job => (
                <div key={job._id} className="p-8 hover:bg-red-50/30 transition-colors group">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors">{job.title}</h3>
                        {job.isHot && (
                          <span className="px-2 py-1 bg-red-100 text-red-600 text-[10px] font-black uppercase rounded shadow-sm">HOT</span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 font-medium">
                        <span className="flex items-center gap-1.5"><Users size={16} className="text-gray-400" /> {job.department}</span>
                        <span className="flex items-center gap-1.5"><Zap size={16} className="text-gray-400" /> {job.type}</span>
                        <span className="flex items-center gap-1.5"><DollarSign size={16} className="text-green-600" /> {job.salary}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-8 w-full lg:w-auto">
                      <div className="text-sm">
                        <p className="text-gray-400 mb-0.5">Hạn nộp hồ sơ</p>
                        <p className="font-bold text-gray-800">{job.deadline}</p>
                      </div>
                      <Link href="/lien-he" className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-red-100 text-red-600 font-bold rounded-xl hover:bg-red-600 hover:border-red-600 hover:text-white transition-all w-full lg:w-auto shadow-sm">
                        Ứng tuyển ngay <ChevronRight size={18} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-gray-500">
                Hiện tại ZComputer đã đủ nhân sự và chưa có đợt tuyển dụng mới. Xin vui lòng quay lại sau!
              </div>
            )}
          </div>
        </div>

        {/* Thông tin nộp hồ sơ */}
        <div className="bg-gradient-to-br from-gray-900 to-[#111] rounded-2xl shadow-xl p-10 text-center relative overflow-hidden border border-gray-800">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-4">Cách thức nộp hồ sơ</h2>
            <p className="text-gray-300 max-w-2xl mx-auto mb-8">
              Gửi CV của bạn về địa chỉ Email: <span className="font-bold text-red-400">truong.zvncomputer@gmail.com</span><br/>
              Tiêu đề Email ghi rõ: <span className="text-white italic">[Vị trí ứng tuyển] - [Họ và tên]</span>
            </p>
            <p className="text-sm text-gray-400 italic">Mọi thắc mắc vui lòng liên hệ Hotline Nhân sự: 0977.334.415</p>
          </div>
        </div>

      </div>
    </div>
  );
}
