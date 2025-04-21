import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useDispatch } from "react-redux";
import { verifyOtpAndGetPassword } from "../redux/slices/authSlice";
import OTPInput from "../components/otpInput";
import CustomButton from "../components/button";
import { sendOtpForgotPassword } from "../redux/slices/authSlice";

const VerifyOtpScreen = ({ navigation, route }) => {
    const { email } = route.params || {};
    const [otp, setOtp] = useState("");
    const [verificationStatus, setVerificationStatus] = useState(null);
    const dispatch = useDispatch();

    const handleVerify = async () => {
        if (otp.length !== 6) {
            Alert.alert("Lỗi", "Mã OTP phải có 6 số!");
            return;
        }

        try {
            const password = await dispatch(verifyOtpAndGetPassword({ email, otp })).unwrap();
            setVerificationStatus("success"); // Đặt trạng thái thành công
            // Alert.alert("Thành công", `Mật khẩu của bạn: ${password}`, [
            //     { text: "OK", onPress: () => navigation.navigate("Auth") },
            // ]);
            setTimeout(() => {
                navigation.navigate("Auth");
            }, 3000);
        } catch (error) {
            setVerificationStatus("error"); 
        }
    };

    const handleResendOtp = () => {
        Alert.alert("OTP Resent",
            "Do you want to resend OTP now ?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "OK",
                    onPress: async () => {
                        try {
                            await dispatch(sendOtpForgotPassword(email)).unwrap();
                        } catch (error) {
                            Alert.alert("Error", error.message || "Unable to resend OTP. Please try again!")

                        }
                    }
                }
            ]

        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Verify your email</Text>
            <Text style={styles.subtitle}>We just sent a 6-digit code to {email}, enter it below:</Text>
            <OTPInput otp={otp} setOtp={setOtp} />
            <CustomButton title="Verify OTP" onPress={handleVerify} backgroundColor="#FF5722" color="#fff" />

            {verificationStatus === "success" && <Text style={styles.successText}>✅ OTP hợp lệ! Đang chuyển hướng...</Text>}
            {verificationStatus === "error" && <Text style={styles.errorText}>❌ OTP không hợp lệ!</Text>}

            <View style={styles.resendContainer}>
                <Text style={styles.resendText}>Not received OTP?</Text>
                <TouchableOpacity onPress={handleResendOtp}>
                    <Text style={styles.resendLink}> Resend OTP</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
    resendContainer: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 10 },
    title: { fontSize: 22, fontWeight: "bold", color: "#333", marginBottom: 10 },
    subtitle: { fontSize: 16, color: "#666", textAlign: "center", marginBottom: 20 },
    resendText: { fontSize: 16, color: "#666" },
    resendLink: { fontSize: 16, color: "#FF5722", fontWeight: "bold" },
    successText: { fontSize: 16, color: "green", fontWeight: "bold", marginTop: 10 },
    errorText: { fontSize: 16, color: "red", fontWeight: "bold", marginTop: 10 },
});

export default VerifyOtpScreen;
