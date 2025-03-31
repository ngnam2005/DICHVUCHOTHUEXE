const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const accountSchema = new mongoose.Schema({
    nameAccount: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullname: { type: String, required: true },
    phone: { type: String, required: true },
    birthday: { type: Date, required: true },
    role: { type: String, default: 'User' },
    avatar: { type: String, default: '' }
});

// Hash mật khẩu trước khi lưu
accountSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

const Account = mongoose.model('Account', accountSchema);
module.exports = Account;
