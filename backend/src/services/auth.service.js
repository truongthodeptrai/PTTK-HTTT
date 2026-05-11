const TaiKhoanDB = require('../repository/TaiKhoanDB');
const NhanVienDB = require('../repository/NhanVienDB');
const jwt = require('jsonwebtoken');
const comparePassword = require('../utils/comparePassword');
const hashPassword = require('../utils/hashPassword');

class AuthService {
    static async login(username, password) {
        // 1. Lấy dữ liệu tài khoản từ tầng Data
        const accountData = await TaiKhoanDB.findAccountByUsername(username);
        
        if (!accountData) {
            throw { status: 401, message: 'Tài khoản không tồn tại' };
        }

        // 2. Kiểm tra mật khẩu
        const isMatch = await comparePassword(password, accountData.MatKhauHash);
        if (!isMatch) {
            throw { status: 401, message: 'Mật khẩu không chính xác' };
        }

        // 3. Lấy thông tin chi tiết nhân viên
        const employeeData = await NhanVienDB.findEmployeeByUserName(username);

        // 4. Tạo mã Token
        const token = jwt.sign(
            {
                id: accountData.MaTaiKhoan,
                role: employeeData?.VaiTro,
                name: employeeData?.TenNhanVien
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        return { 
            token, 
            user: {
                MaNhanVien: employeeData.MaNhanVien,
                TenNhanVien: employeeData.TenNhanVien,
                VaiTro: employeeData.VaiTro 
            } 
    };
    }

    static async register(username, password, MaNhanVien) {
        const hashedPassword = await hashPassword(password);
        return await TaiKhoanDB.save(username, hashedPassword, MaNhanVien);
    }
}

module.exports = AuthService;