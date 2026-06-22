"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X, Briefcase, DollarSign, Users, Calendar } from "lucide-react";
import toast from "react-hot-toast";

interface Job {
  _id: string;
  title: string;
  department: string;
  location: string;
  salary: string;
  type: string;
  deadline: string;
  isHot: boolean;
  createdAt?: string;
}

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    department: "",
    location: "",
    salary: "",
    type: "Toàn thời gian",
    deadline: "",
    isHot: false
  });

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/jobs");
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
      }
    } catch (error) {
      toast.error("Không thể tải danh sách tuyển dụng");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingJob 
        ? `/api/jobs/${editingJob._id}` 
        : "/api/jobs";
      const method = editingJob ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        toast.success(editingJob ? "Cập nhật thành công!" : "Thêm mới thành công!");
        setIsModalOpen(false);
        fetchJobs();
      } else {
        toast.error("Có lỗi xảy ra");
      }
    } catch (error) {
      toast.error("Lỗi kết nối server");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa tin tuyển dụng này?")) {
      try {
        const res = await fetch(`/api/jobs/${id}`, {
          method: "DELETE"
        });
        if (res.ok) {
          toast.success("Xóa thành công!");
          fetchJobs();
        }
      } catch (error) {
        toast.error("Không thể xóa");
      }
    }
  };

  const openModal = (job: Job | null = null) => {
    if (job) {
      setEditingJob(job);
      setFormData({
        title: job.title,
        department: job.department,
        location: job.location,
        salary: job.salary,
        type: job.type,
        deadline: job.deadline,
        isHot: job.isHot
      });
    } else {
      setEditingJob(null);
      setFormData({
        title: "",
        department: "",
        location: "TP. Hồ Chí Minh",
        salary: "",
        type: "Toàn thời gian",
        deadline: "",
        isHot: false
      });
    }
    setIsModalOpen(true);
  };

  if (isLoading) return <div className="p-4 md:p-8 text-center">Đang tải...</div>;

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Tuyển dụng</h1>
          <p className="text-gray-500">Thêm, sửa, xóa các vị trí đang tuyển</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-primary hover:bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} /> Thêm vị trí mới
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="whitespace-nowrap min-w-max w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm">
            <tr>
              <th className="p-4 font-semibold">Vị trí tuyển dụng</th>
              <th className="p-4 font-semibold">Phòng ban / Lương</th>
              <th className="p-4 font-semibold">Thời hạn</th>
              <th className="p-4 font-semibold">Trạng thái</th>
              <th className="p-4 font-semibold text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {jobs.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 md:p-8 text-center text-gray-500">Chưa có dữ liệu tuyển dụng</td>
              </tr>
            ) : (
              jobs.map(job => (
                <tr key={job._id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-gray-800 flex items-center gap-2">
                      {job.title}
                      {job.isHot && <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded uppercase">HOT</span>}
                    </p>
                    <p className="text-xs text-gray-500">{job.location} • {job.type}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-gray-800 flex items-center gap-1"><Users size={14} className="text-gray-400"/> {job.department}</p>
                    <p className="text-sm font-bold text-green-600 flex items-center gap-1"><DollarSign size={14} className="text-green-500"/> {job.salary}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-gray-800 flex items-center gap-1"><Calendar size={14} className="text-gray-400"/> {job.deadline}</p>
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">Đang tuyển</span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button 
                      onClick={() => openModal(job)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Sửa"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(job._id)}
                      className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      title="Xóa"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Thêm / Sửa */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Briefcase className="text-primary" />
                {editingJob ? "Cập nhật vị trí" : "Thêm vị trí tuyển dụng"}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:bg-gray-100 p-2 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-4 md:p-6 overflow-y-auto">
              <form id="jobForm" onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Chức danh / Vị trí *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    placeholder="VD: Nhân viên Kinh doanh (Sales)"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Phòng ban *</label>
                    <input 
                      type="text" 
                      required
                      value={formData.department}
                      onChange={(e) => setFormData({...formData, department: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                      placeholder="VD: Phòng Kinh Doanh"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Mức lương *</label>
                    <input 
                      type="text" 
                      required
                      value={formData.salary}
                      onChange={(e) => setFormData({...formData, salary: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                      placeholder="VD: 10 - 20 Triệu + Thưởng"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Địa điểm làm việc</label>
                    <input 
                      type="text" 
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Hình thức</label>
                    <select 
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    >
                      <option value="Toàn thời gian">Toàn thời gian</option>
                      <option value="Bán thời gian">Bán thời gian</option>
                      <option value="Thực tập sinh">Thực tập sinh</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Hạn nộp hồ sơ *</label>
                    <input 
                      type="text" 
                      required
                      value={formData.deadline}
                      onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                      placeholder="VD: 30/07/2026"
                    />
                  </div>
                  <div className="flex items-center mt-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formData.isHot}
                        onChange={(e) => setFormData({...formData, isHot: e.target.checked})}
                        className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary"
                      />
                      <span className="text-sm font-semibold text-gray-700">Đánh dấu Tuyển Gấp (HOT)</span>
                    </label>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="p-4 md:p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors font-medium"
              >
                Hủy bỏ
              </button>
              <button 
                type="submit"
                form="jobForm"
                className="px-6 py-2 bg-primary hover:bg-primary text-white rounded-lg transition-colors font-medium"
              >
                {editingJob ? "Lưu thay đổi" : "Thêm mới"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
