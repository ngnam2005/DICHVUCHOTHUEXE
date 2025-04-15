import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API_BASE_URL from "../../localhost/localhost";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ nameAccount, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/accounts/login`, {
        nameAccount,
        password,
      });
      const user = response.data.account;

      // ✅ Lưu user duy nhất
      await AsyncStorage.setItem("user", JSON.stringify({ ...user, nameAccount, password }));

      return { ...user, nameAccount, password };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Đăng nhập thất bại!" }
      );
    }
  }
);

// Load stored user
export const loadStoredUser = createAsyncThunk(
  "auth/loadStoredUser",
  async (_, { rejectWithValue }) => {
    try {
      const userData = await AsyncStorage.getItem("user");
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      return rejectWithValue("Không thể tải thông tin đăng nhập.");
    }
  }
);

// Register
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
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
      return rejectWithValue(
        error.response?.data || { message: "Đăng ký thất bại!" }
      );
    }
  }
);
// Forgot password - Send OTP
export const sendOtpForgotPassword = createAsyncThunk(
  "auth/sendOtpForgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/accounts/forgot-password`,
        { email }
      );
      return response.data.message;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Gửi OTP thất bại!" }
      );
    }
  }
);

// Forgot password - Verify OTP
export const verifyOtpAndGetPassword = createAsyncThunk(
  "auth/verifyOtpAndGetPassword",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/accounts/verify-otp`,
        { email, otp }
      );
      return response.data.password;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Xác thực OTP thất bại!" }
      );
    }
  }
);

// Update Profile
export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async (form, thunkAPI) => {
    try {
      const formData = new FormData();

      formData.append("fullname", form.fullname);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("birthday", form.birthday);

      if (form.avatar && form.avatar.startsWith("file://")) {
        const filename = form.avatar.split("/").pop();
        const match = /\.(\w+)$/.exec(filename);
        const ext = match?.[1];
        const mimeType = ext ? `image/${ext}` : `image`;

        formData.append("avatar", {
          uri: form.avatar,
          name: filename,
          type: mimeType,
        });
      }

      const res = await axios.put(`${API_BASE_URL}/api/accounts/update/${form._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || { message: "Lỗi hệ thống" });
    }
  }
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async ({ email, currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/accounts/change-password`, {
        email,
        currentPassword,
        newPassword,
      });
      return response.data.message;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Đổi mật khẩu thất bại!" }
      );
    }
  }
);



// Slice
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
      state.loading = false;
      state.errorLogin = null;
      state.errorRegister = null;
      state.errorForgotPassword = null;
      state.otpSentMessage = null;
      state.verifiedPassword = null;
      AsyncStorage.removeItem("user");
    },
    clearErrors: (state) => {
      state.errorLogin = null;
      state.errorRegister = null;
      state.errorForgotPassword = null;
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.errorRegister = action.payload?.errors || ["Đăng ký thất bại"];
    })
    .addCase(registerUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    })
    .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.errorLogin = action.payload?.errors || ["Đăng nhập thất bại!"];
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(sendOtpForgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.errorForgotPassword =
          action.payload?.errors || ["Gửi OTP thất bại!"];
      })
      .addCase(verifyOtpAndGetPassword.rejected, (state, action) => {
        state.loading = false;
        state.errorForgotPassword =
          action.payload?.errors || ["Xác thực OTP thất bại!"];
      })
      .addCase(loadStoredUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = action.payload.account;
        state.loading = false;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.errorUpdate = action.payload?.errors || ["Cập nhật thất bại"];
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.errorChangePassword = action.payload?.message || "Đổi mật khẩu thất bại!";
      });
  },
});

export const { logout, clearErrors } = authSlice.actions;
export default authSlice.reducer;
