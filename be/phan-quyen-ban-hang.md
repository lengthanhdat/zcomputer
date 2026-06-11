# Phân Quyền Cho Dự Án Website Bán Hàng

## Overview
Xây dựng và tích hợp chức năng phân quyền (Role-Based Access Control - RBAC) cho hệ thống Website Bán Hàng. Chức năng sẽ đảm bảo an toàn dữ liệu bằng cách giới hạn quyền truy cập của người dùng dựa trên vai trò của họ (ví dụ: Admin, Staff, Customer) trên các API và giao diện.

## Project Type
WEB & BACKEND (Tập trung chính vào Backend API Node.js và Middleware bảo vệ Route).

## Success Criteria
- [ ] Định nghĩa rõ ràng ít nhất 3 roles: `Admin`, `Staff`, `Customer`.
- [ ] Các API nhạy cảm (như thêm, sửa, xóa sản phẩm/đơn hàng) bị chặn đối với `Customer`.
- [ ] Middleware phân quyền hoạt động chính xác và trả về HTTP 403 Forbidden nếu không đủ quyền.
- [ ] Giao diện (nếu có) ẩn hiện các nút bấm/menu tương ứng với vai trò của user đăng nhập.

## Tech Stack
- **Backend:** Node.js (Express.js/NestJS tùy hệ thống hiện tại). Middleware để bảo vệ routes.
- **Database:** MongoDB/PostgreSQL (Thêm trường `role` hoặc bảng `roles`, `permissions`).
- **Bảo mật:** JWT (JSON Web Token) để mã hóa và truyền tải thông tin role của người dùng.

## File Structure
Dự kiến cấu trúc thư mục sau khi hoàn thành các task:
```
.
├── middlewares/
│   └── authorize.js       # Middleware kiểm tra quyền truy cập
├── models/
│   └── User.js            # Cập nhật model User để chứa field "role"
├── routes/
│   ├── productRoutes.js   # Bổ sung middleware phân quyền vào các endpoint
│   └── orderRoutes.js     # Bổ sung middleware phân quyền vào các endpoint
└── utils/
    └── roles.js           # File định nghĩa constants cho các Role
```

## Task Breakdown

- [x] **Task 1: Cập nhật User Database Schema**
  - **Agent:** `database-architect` | **Skill:** `database-design`
  - **INPUT:** Model `User` hiện tại.
  - **OUTPUT:** Field `role` được thêm vào bảng/collection User với giá trị mặc định là `customer`. Định nghĩa Enum (Admin, Staff, Customer).
  - **VERIFY:** Insert thử 1 user mới vào database và kiểm tra xem role mặc định có phải là `customer` không.

- [x] **Task 2: Tạo Constants cho Roles**
  - **Agent:** `backend-specialist` | **Skill:** `api-patterns`
  - **INPUT:** Thông tin các vai trò cần thiết.
  - **OUTPUT:** File `utils/roles.js` chứa các hằng số (ví dụ: `const ROLES = { ADMIN: 'Admin', STAFF: 'Staff', CUSTOMER: 'Customer' }`).
  - **VERIFY:** Import file vào terminal node và in ra được giá trị các hằng số.

- [x] **Task 3: Cập nhật JWT Token Payload**
  - **Agent:** `security-auditor` | **Skill:** `api-patterns`
  - **INPUT:** Hàm tạo token lúc login.
  - **OUTPUT:** Token JWT được sinh ra sau khi login có chứa thông tin `role` của người dùng.
  - **VERIFY:** Đăng nhập, lấy token và decode trên `jwt.io` xem có chứa field `role` hay không.

- [x] **Task 4: Xây dựng Authorization Middleware**
  - **Agent:** `security-auditor` | **Skill:** `nodejs-best-practices`
  - **INPUT:** File `utils/roles.js` và logic verify token.
  - **OUTPUT:** File `middlewares/authorize.js` chứa hàm middleware nhận vào mảng roles hợp lệ và trả về 403 nếu user role không nằm trong mảng đó.
  - **VERIFY:** Gọi hàm middleware với một mock request có role không hợp lệ, kiểm tra xem có ném ra lỗi 403 không.

- [x] **Task 5: Áp dụng Middleware vào các Routes quản trị**
  - **Agent:** `backend-specialist` | **Skill:** `api-patterns`
  - **INPUT:** Các file routes (Sản phẩm, Đơn hàng, Users).
  - **OUTPUT:** Middleware `authorize` được thêm vào các API cần bảo vệ (VD: `POST /products` chỉ cho phép Admin/Staff).
  - **VERIFY:** Dùng Postman gọi API `POST /products` với token của `Customer`, đảm bảo nhận về 403 Forbidden. Gọi với token của `Admin` nhận về 200/201.

- [x] **Task 6: Tạo dữ liệu sẵn (Seed Data) cho tài khoản Admin**
  - **Agent:** `backend-specialist` | **Skill:** `nodejs-best-practices`
  - **INPUT:** File `seed.js` hiện tại (hoặc logic khởi tạo lúc start server).
  - **OUTPUT:** Code tạo sẵn tài khoản với email `admin@zcomputer.com`, password `admin@123` (cần được hash) và role là `Admin`.
  - **VERIFY:** Chạy file seed hoặc khởi động server, dùng Postman hoặc frontend gọi API Login với tài khoản này để lấy JWT token thành công.

## ✅ PHASE X: VERIFICATION (Final Check)
- [ ] Chạy linter: `npm run lint` hoặc tương đương.
- [ ] Kiểm tra tính bảo mật (Không có lỗ hổng phân quyền ngang - Insecure Direct Object Reference).
- [ ] Build dự án thành công: `npm run build` (nếu có).
- [ ] API test: Chạy đầy đủ các test case cho từng role khác nhau trên Postman/Jest.
- [ ] Date: [Ngày hoàn thành]
