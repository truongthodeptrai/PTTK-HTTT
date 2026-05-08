const express = require('express')
const jwt = require('jsonwebtoken')
const { sql, pool } = require('../config/database')

const hashPassword = require('../utils/hashPassword')
const authMiddleware = require('../middlewares/auth.middleware')

const router = express.Router()

router.post(
    '/login',

    async (req, res) => {

        try {

            const {
                username,
                password
            } = req.body



            const db = await pool



            const result =
                await db.request()

                    .input(
                        'username',
                        sql.NVarChar,
                        username
                    )

                    .query(`
                        SELECT
                            tk.MaTaiKhoan,
                            tk.TenTaiKhoan,
                            tk.MatKhauHash,
                            tk.Salt,

                            nv.MaNhanVien,
                            nv.TenNhanVien,
                            nv.VaiTro

                        FROM TaiKhoan tk

                        INNER JOIN NhanVien nv
                        ON tk.MaNhanVien =
                           nv.MaNhanVien

                        WHERE tk.TenTaiKhoan =
                              @username
                    `)



            if (
                result.recordset.length === 0
            ) {

                return res.status(401).json({
                    message:
                        'Sai tài khoản'
                })
            }



            const account =
                result.recordset[0]



            const passwordHash =
                hashPassword(
                    password,
                    account.Salt
                )



            const isMatch =
                Buffer.compare(
                    passwordHash,
                    account.MatKhauHash
                ) === 0



            if (!isMatch) {

                return res.status(401).json({
                    message:
                        'Sai mật khẩu'
                })
            }



            const token = jwt.sign(

                {
                    MaTaiKhoan:
                        account.MaTaiKhoan,

                    TenTaiKhoan:
                        account.TenTaiKhoan,

                    MaNhanVien:
                        account.MaNhanVien,

                    TenNhanVien:
                        account.TenNhanVien,

                    VaiTro:
                        account.VaiTro
                },

                process.env.JWT_SECRET,

                {
                    expiresIn: '1d'
                }
            )



            res.json({

                token,

                user: {

                    MaTaiKhoan:
                        account.MaTaiKhoan,

                    TenTaiKhoan:
                        account.TenTaiKhoan,

                    MaNhanVien:
                        account.MaNhanVien,

                    TenNhanVien:
                        account.TenNhanVien,

                    VaiTro:
                        account.VaiTro
                }
            })
        }

        catch (err) {

            console.log(err)

            res.status(500).json({
                message: 'Server error'
            })
        }
    }
)



router.get(
    '/profile',

    authMiddleware,

    async (req, res) => {

        res.json({
            user: req.user
        })
    }
)

module.exports = router