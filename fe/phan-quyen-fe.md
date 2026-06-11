# Kế Hoạch Cập Nhật Frontend (FE) Cho Chức Năng Phân Quyền

## Overview
Cập nhật Next.js Frontend để đồng bộ với chức năng phân quyền (RBAC) đã triển khai ở Backend. Mục tiêu là quản lý trạng thái đăng nhập (token, role), tự động gửi token trong các API request, bảo vệ các trang quản trị (Admin/Staff), và ẩn hiện các thành phần giao diện dựa theo vai trò của người dùng.

## Project Type
WEB (Next.js 16, React 19, Zustand, Tailwind CSS)

## Success Criteria
- [ ] User login thành công sẽ lưu được JWT token và thông tin User (bao gồm `role`) vào Zustand store và LocalStorage/Cookies.
- [ ] Mọi API call tới Backend đều tự động đính kèm header `Authorization: Bearer <token>`.
- [ ] Người dùng có role `customer` truy cập vào các route `/admin/*` sẽ bị văng ra (redirect) về trang chủ hoặc trang 403.
- [ ] Các nút bấm (VD: "Trang quản trị", "Thêm sản phẩm") chỉ hiển thị nếu người dùng có role hợp lệ.

## Tech Stack
- **Framework:** Next.js (App Router)
- **State Management:** Zustand
- **Styling:** Tailwind CSS

## File Structure (Dự kiến)
```
.
├── src/
│   ├── store/
│   │   └── useAuthStore.ts     # Cập nhật store lưu token & role
│   ├── utils/
│   │   └── api.ts              # Interceptor/Wrapper tự động gắn Bearer Token
│   ├── components/
│   │   └── RoleGuard.tsx       # Component bọc ngoài để ẩn/hiện theo Role
│   ├── app/
│   │   └── admin/
│   │       └── layout.tsx      # Layout bảo vệ toàn bộ route /admin
│   └── middleware.ts           # (Tùy chọn) Next.js Middleware chặn route phía server
```

## Task Breakdown

- [x] **Task 1: Cập nhật Authentiction Store (Zustand)**
  - **Agent:** `frontend-specialist` | **Skill:** `nextjs-react-expert`
  - **INPUT:** File store hiện tại (nếu có, hoặc tạo mới `useAuthStore.ts`).
  - **OUTPUT:** Store có khả năng lưu `user` (gồm `role`), `token`, và hàm `login`, `logout`. Trạng thái được persist (lưu vào localStorage).
  - **VERIFY:** Mở React DevTools, kiểm tra Zustand state sau khi login có chứa thông tin user và token.

- [x] **Task 2: Cập nhật API Client (Fetch Wrapper / Axios)**
  - **Agent:** `frontend-specialist` | **Skill:** `api-patterns`
  - **INPUT:** Các hàm gọi API hiện tại.
  - **OUTPUT:** Một utility `fetch` (hoặc cấu hình Axios) luôn đọc token từ store/localStorage và thêm vào header `Authorization`. Xử lý tự động logout nếu API trả về 401.
  - **VERIFY:** Gửi 1 request bất kỳ, mở Network tab xem có header `Authorization: Bearer ...` không.

- [x] **Task 3: Cập nhật Logic Login / Giao diện Header**
  - **Agent:** `frontend-specialist` | **Skill:** `frontend-design`
  - **INPUT:** Trang `Login` và Component `Header`.
  - **OUTPUT:** Login gọi API, nhận token + user info rồi lưu vào store. Header hiển thị tên user và nút "Trang quản trị" (nếu role là Admin/Staff).
  - **VERIFY:** Đăng nhập bằng `admin@zcomputer.com` -> Nút quản trị hiện ra. Đăng nhập bằng customer -> Nút quản trị ẩn đi.

- [x] **Task 4: Bảo vệ Admin Routes (Client/Server Guard)**
  - **Agent:** `frontend-specialist` | **Skill:** `nextjs-react-expert`
  - **INPUT:** Folder `src/app/admin`.
  - **OUTPUT:** Một HOC hoặc Layout tại `app/admin/layout.tsx` kiểm tra role từ Zustand. Nếu không phải admin/staff -> `redirect('/')`.
  - **VERIFY:** Đóng vai Customer, gõ URL `localhost:3000/admin` và bị đẩy về trang chủ.

- [x] **Task 5: Tạo Component RoleGuard (Optional but Recommended)**
  - **Agent:** `frontend-specialist` | **Skill:** `nextjs-react-expert`
  - **INPUT:** Thư mục components.
  - **OUTPUT:** Component `<RoleGuard allowedRoles={['admin']}> ... </RoleGuard>` giúp ẩn/hiện nhanh các UI nhỏ giọt.
  - **VERIFY:** Thử bọc một nút Delete bằng RoleGuard và xem nó có tàng hình với Customer không.

## ✅ PHASE X: VERIFICATION (Final Check)
- [ ] Chạy linter: `npm run lint`.
- [ ] Đăng nhập đúng/sai với các loại tài khoản khác nhau.
- [ ] Kiểm tra lỗi 401 Token Expired (tự động đá ra trang login).
- [ ] Date: [Ngày hoàn thành]
