import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API_BASE_URL from "../../localhost/localhost";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async ({ nameAccount, password, rememberMe }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/accounts/login`, { nameAccount, password });
            const user = response.data.account;
            // 🔹 Lưu vào AsyncStorage nếu rememberMe được chọn
            if (rememberMe) {
                await AsyncStorage.setItem("userData", JSON.stringify(user));
            } else {
                await AsyncStorage.removeItem("userData");
            }

            return user;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Đăng nhập thất bại!" });
        }
    }
);
// ✅ Load dữ liệu từ AsyncStorage khi mở app
export const loadStoredUser = createAsyncThunk("auth/loadStoredUser", async (_, { rejectWithValue }) => {
    try {
        const userData = await AsyncStorage.getItem("userData");
        return userData ? JSON.parse(userData) : null;
    } catch (error) {
        return rejectWithValue("Không thể tải thông tin đăng nhập.");
    }
});
//Register
export const registerUser = createAsyncThunk("auth/registerUser", async (userData, { rejectWithValue }) => {
    try {
        const formData = new FormData();
        Object.keys(userData).forEach((key) => {
            if (key === "avatar" && userData.avatar) {
                formData.append("avatar", {
                    uri: userData.avatar,
                    type: "image/jpeg",
                    name: "avatar.jpg",
                });
            } else {
                formData.append(key, userData[key]);
            }
        });

        const response = await axios.post(`${API_BASE_URL}/api/accounts/register`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: "Đăng ký thất bại!" });
    }
});

// 📌 Gửi OTP quên mật khẩu
export const sendOtpForgotPassword = createAsyncThunk("auth/sendOtpForgotPassword", async (email, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/accounts/forgot-password`, { email });
        return response.data.message;
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: "Gửi OTP thất bại!" });
    }
});
// 📌 Xác thực OTP & lấy mật khẩu
export const verifyOtpAndGetPassword = createAsyncThunk("auth/verifyOtpAndGetPassword", async ({ email, otp }, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/accounts/verify-otp`, { email, otp });
        return response.data.password; // Trả về mật khẩu mã hóa
    } catch (error) {
        return rejectWithValue(error.response?.data || { message: "Xác thực OTP thất bại!" });
    }
});

// 📌 Tạo slice Redux
const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        loading: false,
        errorLogin: null,
        errorRegister: null,
        errorForgotPassword: null,
        otpSentMessage: null,
        verifiedPassword: null,
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.errorLogin = null;
            state.errorRegister = null;
            state.errorForgotPassword = null;
            state.otpSentMessage = null;
            state.verifiedPassword = null;
            AsyncStorage.removeItem("userData");
        },
        clearErrors: (state) => {
            state.errorLogin = null;
            state.errorRegister = null;
            state.errorForgotPassword = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.errorRegister = action.payload?.errors || ["Đăng ký thất bại"];
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.errorLogin = action.payload?.errors || ["Đăng nhập thất bại!"];
            })
            .addCase(sendOtpForgotPassword.rejected, (state, action) => {
                state.loading = false;
                state.errorForgotPassword = action.payload?.errors || ["Gửi OTP thất bại!"];
            })
            .addCase(verifyOtpAndGetPassword.rejected, (state, action) => {
                state.loading = false;
                state.errorForgotPassword = action.payload?.errors || ["Xác thực OTP thất bại!"];
            });
    },
});


export const { logout, clearErrors } = authSlice.actions;
export default authSlice.reducer;
