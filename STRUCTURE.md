homestay-dorm/
├── backend/                # Source code phía Server (Node.js + Express)
├── frontend/               # Source code phía Client (React + Vite)
├── docs/                   # Tài liệu dự án (SRS, Design, API Spec)
├── scripts/                # Script hỗ trợ (Seed data, Backup, Deploy)
├── .github/                # Cấu hình CI/CD, Github Workflows
├── .vscode/                # Cài đặt chung cho VS Code (Extensions, Settings)
├── logs/                   # Chứa các tệp log hệ thống (tự động tạo)
├── .env.example            # Tệp mẫu cấu hình biến môi trường
├── .gitignore              # Quy định các tệp không đẩy lên Git
├── README.md               # Hướng dẫn sử dụng và cài đặt dự án
├── docker-compose.yml      # Dockerization cho toàn bộ dự án
├── package.json            # Quản lý dependencies chung (Monorepo root)
└── turbo.json              # Cấu hình Turborepo (tăng tốc build/test)

backend/
├── src/
│   ├── config/             # Kết nối Database, Cloudinary, Passport...
│   ├── controllers/        # Xử lý Logic sau khi nhận Request từ Routes
│   ├── routes/             # Định nghĩa các điểm cuối (Endpoints) API
│   ├── models/             # Định nghĩa Schema (Mongoose/Sequelize) cho thực thể
│   ├── middlewares/        # Kiểm tra Auth, phân quyền Role, xử lý lỗi tập trung
│   ├── utils/              # Các hàm bổ trợ (Format response, tính toán cọc...)
│   ├── services/           # Logic nghiệp vụ phức tạp (Gửi Email, tích hợp bên thứ 3)
│   └── server.js           # Điểm khởi đầu của ứng dụng (Entry point)
├── .env                    # Biến môi trường (Secret keys, DB URL)
├── package.json            # Dependencies của riêng backend
└── nodemon.json            # Cấu hình tự động khởi động lại khi sửa code

frontend/
├── public/                 # Tài nguyên tĩnh không cần xử lý (Logo, Favicon)
├── src/
│   ├── assets/             # Hình ảnh, Fonts, Stylesheet (SCSS/CSS)
│   ├── components/         
│   │   ├── common/         # Component dùng chung (Button, Modal, Table)
│   │   ├── layout/         # Thành phần khung (Sidebar, Navbar, Footer)
│   │   └── ui/             # Các UI nhỏ, nguyên tử (Atomic components)
│   ├── features/           # Chứa logic, state, component theo nghiệp vụ cụ thể
│   │   └── auth, customer, room, booking, payment...
│   ├── pages/              # Các trang chính theo phân quyền (Role-based)
│   │   ├── sales/          # Giao diện cho nhân viên Sales
│   │   ├── accountant/     # Giao diện cho kế toán (Cọc, Thanh toán)
│   │   └── manager/        # Giao diện quản lý (Dashboard, Thống kê)
│   ├── store/              # Quản lý Global State (Redux Toolkit/Zustand)
│   ├── hooks/              # Các Custom Hooks dùng chung
│   ├── services/           # Cấu hình Axios và các hàm gọi API
│   ├── routes/             # Cấu hình định tuyến (React Router Dom)
│   ├── App.jsx             # Component gốc
│   └── main.jsx            # Điểm gắn kết React vào DOM
├── vite.config.js          # Cấu hình công cụ build Vite
├── tailwind.config.js      # Cấu hình Framework CSS Tailwind
└── package.json            # Dependencies của riêng frontend