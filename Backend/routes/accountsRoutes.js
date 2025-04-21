const express = require('express');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const Account = require('../models/Account');
const upload = require('../config/multer');
const jwt = require("jsonwebtoken");

const Notification = require("../models/Notification");

require("dotenv").config();

const router = express.Router();
const otpStorage = {};
const JWT_SECRET = process.env.JWT_SECRET;

// Debug JWT_SECRET
console.log("JWT_SECRET:", JWT_SECRET);

//API Đăng nhập
router.post('/login', async (req, res) => {
    try {
        const { nameAccount, password } = req.body;
        const account = await Account.findOne({ nameAccount });

        if (!account) return res.status(404).json({ message: 'Tài khoản không tồn tại!' });

        console.log('Mật khẩu nhập vào:', password);
        console.log('Mật khẩu từ database:', account.password);

        const isMatch = await bcrypt.compare(password, account.password);
        console.log("Kết quả so sánh mật khẩu:", isMatch);
        if (!isMatch) return res.status(400).json({ message: 'Sai mật khẩu!' });


        const token = jwt.sign({ id: account._id, nameAccount: account.nameAccount }, JWT_SECRET, { expiresIn: '2h' });
        const loginNoti = new Notification({
            userId: account._id,
            title: "Đăng nhập thành công",
            message: `Bạn đã đăng nhập vào lúc ${new Date().toLocaleString()}`
          });
        await loginNoti.save();
        res.json({
            message: 'Đăng nhập thành công!',
            token,
            account: {
                id: account._id,
                nameAccount: account.nameAccount,
                email: account.email,
                fullname: account.fullname,
                avatar: account.avatar,
                phone: account.phone,
                birthday: account.birthday,
                role: account.role
            },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


//API Đăng ký tài khoản
router.post('/register', upload.single('avatar'), async (req, res) => {
    try {
        console.log("File nhận được:", req.file);
        console.log("Dữ liệu nhận được:", req.body);

        const { nameAccount, email, password, fullname, phone, birthday, role } = req.body;
        let errors = [];

        if (!nameAccount) errors.push("- Tên tài khoản không được để trống.\n");
        if (!email) errors.push("- Email không được để trống.\n");
        if (!password) errors.push("- Mật khẩu không được để trống.\n");
        if (!fullname) errors.push("- Họ và tên không được để trống.\n");
        if (!phone) errors.push("- Số điện thoại không được để trống.\n");
        if (!birthday) errors.push("- Ngày sinh không được để trống.\n");

        if (nameAccount && nameAccount.length < 3) {
            errors.push("- Tên tài khoản phải có ít nhất 3 ký tự.\n");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailRegex.test(email)) {
            errors.push("- Email không hợp lệ.\n");
        }

        if (password && password.length < 6) {
            errors.push("- Mật khẩu phải có ít nhất 6 ký tự.\n");
        }

        const phoneRegex = /^0\d{9,10}$/;
        if (phone && !phoneRegex.test(phone)) {
            errors.push("- Số điện thoại không hợp lệ.\n");
        }

        if (role && role !== "User" && role !== "Admin") {
            errors.push("- Vai trò không hợp lệ, chỉ chấp nhận 'User' hoặc 'Admin'.\n");
        }

        const existingAccount = await Account.findOne({
            $or: [{ nameAccount }, { email }]
        });

        if (existingAccount) {
            errors.push("- Tên tài khoản hoặc email đã được sử dụng, vui lòng thử lại!\n");
        }

        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        const avatar = req.file ? `/uploads/${req.file.filename}` : '';


        const newAccount = new Account({
            nameAccount,
            email,
            password,
            fullname,
            phone,
            birthday,
            avatar,
            role: role || 'User'
        });

        await newAccount.save();

        res.status(201).json({ message: 'Đăng ký thành công!', account: { ...newAccount.toObject(), password: undefined } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// API Quên mật khẩu (Gửi OTP)
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const account = await Account.findOne({ email });

        if (!account)
            return res.status(404).json({ message: 'Email không tồn tại!' });

        // Tạo OTP 6 số
        const otp = crypto.randomInt(100000, 999999).toString();
        otpStorage[email] = otp;

        // Cấu hình gửi email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Mã OTP quên mật khẩu',
            text: `Mã OTP của bạn là: ${otp}`
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: 'OTP đã gửi về email!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//API Xác thực OTP và đặt lại mật khẩu
router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!otpStorage[email]) return res.status(400).json({ message: 'OTP đã hết hạn hoặc không tồn tại!' });
        if (otpStorage[email] !== otp) return res.status(400).json({ message: 'OTP không hợp lệ!' });

        delete otpStorage[email];
        const account = await Account.findOne({ email });
        if (!account) return res.status(404).json({ message: 'Email không tồn tại!' });

        const newPassword = Math.random().toString(36).slice(-8);
        // const hashedPassword = await bcrypt.hash(newPassword, 10);
        account.password = newPassword;
        await account.save();

        console.log('Mật khẩu mới:', newPassword);
        console.log('Mật khẩu đã mã hóa:', account.password);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Mật khẩu mới của bạn',
            text: `Mật khẩu mới của bạn là: ${newPassword}. Vui lòng đăng nhập và đổi lại mật khẩu mới!`
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: 'Mật khẩu mới đã được gửi về email!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


//API Gửi Mật Khẩu Mới Sau Khi Xác Thực OTP
router.post('/reset-password', async (req, res) => {
    try {
        const { email, otp } = req.body;
        // Kiểm tra OTP
        if (otpStorage[email] !== otp)
            return res.status(400).json({ message: 'OTP không hợp lệ!' });
        // Kiểm tra tài khoản có tồn tại không
        const account = await Account.findOne({ email });
        if (!account)
            return res.status(404).json({ message: 'Email không tồn tại!' });
        // Tạo mật khẩu mới ngẫu nhiên
        const newPassword = crypto.randomBytes(6).toString('hex');
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        // Cập nhật mật khẩu mới trong database
        await Account.findOneAndUpdate({ email }, { password: hashedPassword });
        // Xóa OTP sau khi sử dụng
        delete otpStorage[email];
        // Cấu hình gửi email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Mật khẩu mới của bạn',
            text: `Mật khẩu mới của bạn là: ${newPassword}. Vui lòng đăng nhập và đổi lại mật khẩu mới!`
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: 'Mật khẩu mới đã được gửi về email!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
//API Đổi mật khẩu với OTP
router.post('/change-password', async (req, res) => {
    try {
        const { email, currentPassword, newPassword } = req.body;

        if (!email || !currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Thiếu thông tin bắt buộc!' });
        }

        // Kiểm tra tài khoản
        const account = await Account.findOne({ email });
        if (!account) {
            return res.status(404).json({ message: 'Email không tồn tại!' });
        }

        // So sánh mật khẩu hiện tại
        const isMatch = await bcrypt.compare(currentPassword, account.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Mật khẩu hiện tại không đúng!' });
        }

        // Cập nhật mật khẩu mới
        // const hashedPassword = await bcrypt.hash(newPassword, 10);
        account.password = newPassword;
        await account.save();

        return res.json({ message: 'Mật khẩu đã được cập nhật thành công!' });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});


//API Cập nhật tài khoản (Không cho phép cập nhật mật khẩu)
router.put('/update/:id', upload.single("avatar"), async (req, res) => {
    // console.log("BODY:", req.body);
    // console.log("FILE:", req.file);
    try {
        const updates = { ...req.body };

        // Không cho phép cập nhật mật khẩu từ đây
        if ('password' in updates) {
            delete updates.password;
        }

        // Nếu có file avatar mới
        if (req.file) {
            updates.avatar = `/uploads/${req.file.filename}`;
        }

        const updatedAccount = await Account.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true }
        );

        if (!updatedAccount)
            return res.status(404).json({ message: 'Tài khoản không tồn tại!' });

        const accountWithoutPassword = updatedAccount.toObject();
        delete accountWithoutPassword.password;

        res.json({
            message: 'Cập nhật thành công!',
            account: accountWithoutPassword
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//API Xác thực Token (Validate Token)
router.post('/validate-token', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) return res.status(401).json({ message: "Không có token!" });

        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) return res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });

            res.json({ message: "Token hợp lệ!", user: decoded });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//API Làm mới Token (Refresh Token)
router.post('/refresh-token', async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) return res.status(401).json({ message: "Không có refresh token!" });

        jwt.verify(refreshToken, JWT_SECRET, async (err, decoded) => {
            if (err) return res.status(401).json({ message: "Refresh token không hợp lệ hoặc đã hết hạn!" });

            const account = await Account.findById(decoded.id);
            if (!account) return res.status(404).json({ message: "Tài khoản không tồn tại!" });

            // Cấp lại token mới
            const newToken = jwt.sign({ id: account._id, nameAccount: account.nameAccount }, JWT_SECRET, { expiresIn: '2h' });

            res.json({ message: "Cấp lại token thành công!", token: newToken });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
