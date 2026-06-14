"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    try {
      // Giả lập gọi API gửi email khôi phục mật khẩu
      // Trong thực tế, bạn sẽ cần cấu hình Nodemailer ở backend để gửi email thật
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess(true);
      toast.success("Đã gửi hướng dẫn khôi phục mật khẩu!");
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 text-primary flex items-center justify-center rounded-full mb-4">
            <Mail size={24} />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Quên mật khẩu
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Nhập địa chỉ email của bạn và chúng tôi sẽ gửi cho bạn một liên kết để đặt lại mật khẩu.
          </p>
        </div>

        {success ? (
          <div className="mt-8 text-center space-y-6">
            <div className="p-4 bg-green-50 rounded-lg border border-green-100 text-green-800 text-sm font-medium">
              Chúng tôi đã gửi một email có chứa hướng dẫn đặt lại mật khẩu đến <strong>{email}</strong>. Vui lòng kiểm tra hộp thư đến (và cả hộp thư rác) của bạn.
            </div>
            <div>
              <Link href="/login" className="text-primary font-bold hover:underline">
                Quay lại trang đăng nhập
              </Link>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-semibold text-gray-700">Email của bạn</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2.5 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="VD: example@gmail.com"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-bold rounded-md text-white bg-primary hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50"
              >
                {loading ? "Đang gửi..." : "Gửi liên kết khôi phục"}
              </button>
            </div>

            <div className="text-center mt-4">
              <Link href="/login" className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-primary transition-colors">
                <ArrowLeft size={16} className="mr-1" />
                Quay lại trang đăng nhập
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
