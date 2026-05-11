const AccountModel = require('../models/account.model');
const jwt = require('jsonwebtoken');
const hashPassword = require('../utils/hashPassword');
const comparePassword = require('../utils/comparePassword');

class AuthService {
    static async register(username, password, MaNhanVien) {
        const hashedPassword = await hashPassword(password);
        await AccountModel.createAccount(username, hashedPassword, MaNhanVien);
        return { message: 'Tạo tài khoản thành công' };
    }

    static async login(username, password) {
        const account = await AccountModel.findByUsername(username);
        
        if (!account) {
            throw { status: 401, message: 'Sai tài khoản' };
        }

        const isMatch = await comparePassword(password, account.MatKhauHash);
        
        if (!isMatch) {
            throw { status: 401, message: 'Sai mật khẩu' };
        }

        const token = jwt.sign(
            {
                MaTaiKhoan: account.MaTaiKhoan,
                TenTaiKhoan: account.TenTaiKhoan,
                MaNhanVien: account.MaNhanVien,
                TenNhanVien: account.TenNhanVien,
                VaiTro: account.VaiTro
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        return {
            token,
            user: {
                MaTaiKhoan: account.MaTaiKhoan,
                TenTaiKhoan: account.TenTaiKhoan,
                MaNhanVien: account.MaNhanVien,
                TenNhanVien: account.TenNhanVien,
                VaiTro: account.VaiTro
            }
        };
    }
}

module.exports = AuthService;