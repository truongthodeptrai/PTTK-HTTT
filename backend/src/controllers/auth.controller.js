const AuthService = require('../services/auth.service');

class AuthController {
    static async register(req, res) {
        try {
            const { username, password, MaNhanVien } = req.body;
            const result = await AuthService.register(username, password, MaNhanVien);
            res.json(result);
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: err.originalError?.info?.message || 'Server error'
            });
        }
    }

    static async login(req, res) {
        try {
            const { username, password } = req.body;
            const result = await AuthService.login(username, password);
            res.json(result);
        } catch (err) {
            console.log(err);
            if (err.status) {
                return res.status(err.status).json({ message: err.message });
            }
            res.status(500).json({ message: 'Server error' });
        }
    }

    static async getProfile(req, res) {
        res.json({
            user: req.user
        });
    }
}

module.exports = AuthController;
