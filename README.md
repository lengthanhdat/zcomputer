# ZComputer Store

ZComputer là một hệ thống thương mại điện tử chuyên cung cấp các linh kiện máy tính, PC Gaming, Laptop và Workstation. Dự án được chia làm 2 phần chính: Frontend (Giao diện người dùng và Admin) và Backend (API Server).

## 🚀 Công nghệ sử dụng

### Frontend (`/fe`)
- **Framework:** Next.js 14 (App Router)
- **Ngôn ngữ:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Icons:** Lucide React, React Icons
- **HTTP Client:** Fetch API

### Backend (`/be`)
- **Framework:** Node.js với Express.js
- **Ngôn ngữ:** TypeScript
- **Cơ sở dữ liệu:** MongoDB (với Mongoose)
- **Bảo mật:** JWT (JSON Web Tokens), bcryptjs
- **Upload:** Multer (cấu hình thư mục `uploads`)

## 📁 Cấu trúc dự án

```text
zcomputer/
├── be/                 # Mã nguồn Backend (API, Database, Controllers, Models)
│   ├── src/            # Thư mục source backend
│   ├── uploads/        # Thư mục lưu trữ hình ảnh upload
│   └── package.json
├── fe/                 # Mã nguồn Frontend (UI Khách hàng và Admin)
│   ├── src/
│   │   ├── app/        # Next.js App Router (pages, layouts)
│   │   ├── components/ # Các components UI tái sử dụng
│   │   └── store/      # Zustand store (Auth, Cart)
│   └── package.json
└── README.md
```

## ⚙️ Hướng dẫn cài đặt và chạy dự án

### 1. Cài đặt Backend
1. Di chuyển vào thư mục `be`: `cd be`
2. Cài đặt dependencies: `npm install`
3. Cấu hình biến môi trường: Tạo file `.env` chứa các biến cần thiết (ví dụ: `PORT`, `MONGO_URI`, `JWT_SECRET`).
4. Khởi chạy server: `npm run dev` (Server sẽ chạy mặc định ở `http://localhost:5000`)
5. *(Tùy chọn) Chạy seed dữ liệu mẫu: `npx ts-node src/seed.ts`*

### 2. Cài đặt Frontend
1. Di chuyển vào thư mục `fe`: `cd fe`
2. Cài đặt dependencies: `npm install`
3. Cấu hình biến môi trường: Tạo file `.env.local` chứa đường dẫn API gốc:
   `NEXT_PUBLIC_API_URL=http://localhost:5000/api`
4. Khởi chạy Next.js app: `npm run dev` (Ứng dụng chạy ở `http://localhost:3000`)

## 🌟 Tính năng chính
- **Giao diện Khách hàng (Storefront):**
  - Xem danh sách sản phẩm, xem chi tiết, hiển thị nhãn "Hot Sale", "Hết hàng".
  - Chức năng tìm kiếm, xem theo danh mục.
  - Quản lý "Sản phẩm quan tâm" (Giỏ hàng) - Đồng bộ thông minh theo tài khoản đăng nhập.
  - Đăng ký, Đăng nhập, xem thông tin cá nhân.
  
- **Giao diện Quản trị (Admin Dashboard):**
  - Quản lý Người dùng (phân quyền User, Staff, Admin).
  - Quản lý Danh mục sản phẩm (Category).
  - Quản lý Sản phẩm (Product), đăng ảnh, chỉnh sửa giá, số lượng tồn kho (stock).

## 🛡️ Cơ chế Phân quyền
- **Admin**: Có toàn quyền kiểm soát hệ thống, có thể phân quyền cho user khác.
- **Staff**: Có quyền truy cập Admin Dashboard để quản lý Sản phẩm, nhưng không có quyền thay đổi User hoặc Role.
- **User**: Người mua hàng thông thường.

## 📝 Bản quyền
Dự án được xây dựng và tối ưu hoá cho thương hiệu ZComputer Store.
