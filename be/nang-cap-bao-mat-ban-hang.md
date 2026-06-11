# Kế Hoạch Nâng Cấp Kiến Trúc Bảo Mật & Phân Quyền (RBAC Nâng Cao)

## Overview
Bản kế hoạch này nhằm đáp ứng yêu cầu tái cấu trúc hệ thống phân quyền từ cơ bản (Enum) sang cơ sở dữ liệu động (Role & Permissions), thiết lập cơ chế Refresh Token/Access Token, bảo vệ API với Middleware chống Injection/IDOR, và nâng cấp bảo mật FE/BE toàn diện.

## Project Type
Fullstack (Next.js FE + Node.js/Express BE)

## Success Criteria
- [ ] BE: Cấu trúc CSDL mới với `Users`, `Roles`, `Permissions`. Populate thành công khi Login.
- [ ] BE: Triển khai Access Token (trả về JSON) và Refresh Token (lưu HttpOnly Cookie).
- [ ] BE: Thêm `requirePermission` middleware và áp dụng bảo vệ an toàn API.
- [ ] BE: Chống Injection, Helmet headers, Rate Limiting hoạt động.
- [ ] FE: Zustand lưu `permissions`, Component `<CanAccess>` hoạt động.
- [ ] FE: Next.js middleware.ts chặn route dựa trên token.

## Phase 1: Kiến trúc Cơ sở dữ liệu (BE)
- [x] **Task 1.1:** Tạo Model `Permission` (name, code).
- [x] **Task 1.2:** Tạo Model `Role` (name, permissions ref).
- [x] **Task 1.3:** Cập nhật Model `User` để tham chiếu `role` tới Collection Role.
- [x] **Task 1.4:** Cập nhật `seed.ts` để khởi tạo sẵn Permissions (VD: CREATE_PRODUCT, DELETE_USER) và Roles (ADMIN, STAFF, CUSTOMER).

## Phase 2: Bảo Mật Cốt Lõi (BE)
- [x] **Task 2.1:** Cài đặt các thư viện bảo mật: `express-mongo-sanitize`, `helmet`, `express-rate-limit`, `cookie-parser`.
- [x] **Task 2.2:** Tích hợp Helmet, Rate Limiter, Sanitize vào `src/index.ts`.
- [x] **Task 2.3:** Cập nhật hàm Login (`authController.ts`) để tạo Access Token (15m) & Refresh Token (7d). Set Refresh Token vào HttpOnly Cookie. Trả về mảng `permissions` bằng cách `populate`.
- [x] **Task 2.4:** Tạo API `/api/auth/refresh` để xin lại Access Token.

## Phase 3: Authorization Middleware & IDOR (BE)
- [x] **Task 3.1:** Viết lại `authorize.ts` thành `requirePermission(permissionCode)`.
- [x] **Task 3.2:** Áp dụng `requirePermission` cho các routes.
- [x] **Task 3.3:** Sửa API Order (`orderController.ts`) để chặn IDOR (người dùng chỉ xem/sửa đơn hàng của chính mình nếu không phải là Admin).

## Phase 4: Xử lý Giao diện FE
- [x] **Task 4.1:** Cập nhật Zustand Store (`useAuthStore`) để lưu `permissions`.
- [x] **Task 4.2:** Cập nhật API client (`api.ts`) để tự động gọi endpoint `/refresh` khi token hết hạn (interceptors).
- [x] **Task 4.3:** Tạo Component `<CanAccess permission="CODE">`. Cập nhật giao diện ẩn/hiện nút Sửa/Xóa.
- [x] **Task 4.4:** Tạo `middleware.ts` ở thư mục gốc Next.js để chặn `/admin` nếu không có cookie.

## ✅ PHASE X: VERIFICATION
- [ ] Test luồng tạo user/login.
- [ ] Test refresh token tự động gia hạn.
- [ ] Test injection và rate limiting.
- [ ] Date: [Ngày hoàn thành]
