# PTTK-HTTT

homestay-dorm/
├── backend/                # Node.js + Express API
├── frontend/               # React + Vite Client
├── docs/                   # Tài liệu dự án
├── scripts/                # Script hỗ trợ (seed, backup, deploy)
├── .github/                # CI/CD pipelines & workflows
├── .vscode/                # Cấu hình IDE VS Code
├── logs/                   # Nhật ký hệ thống (tự tạo)
├── .env.example            # Mẫu cấu hình môi trường
├── .gitignore              # Các file/thư mục cần bỏ qua
├── README.md               # Tài liệu dự án
├── docker-compose.yml      # Cấu hình Docker cho môi trường dev/prod
├── package.json            # Cấu hình Monorepo gốc
└── turbo.json              # Cấu hình Turborepo

backend/
├── src/
│   ├── config/             # Cấu hình database, cloud, v.v.
│   ├── controllers/        # Xử lý logic request/response
│   ├── routes/             # Định nghĩa API endpoints
│   ├── models/             # Schema cho database (Mongoose/Sequelize)
│   ├── middlewares/        # Auth, Role, Error handling
│   ├── utils/              # Helper functions
│   └── services/           # Business logic (email, third-party)
├── server.js               # Entry point của server
└── nodemon.json            # Cấu hình auto-reload