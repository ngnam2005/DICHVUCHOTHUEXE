import React, { useState } from "react";
import { View, Text, StyleSheet, StatusBar } from "react-native";
import { useDispatch } from "react-redux";
import { sendOtpForgotPassword } from "../redux/slices/authSlice";
import WrapInput from "../components/inputText";
import CustomButton from "../components/button";
import Header from "../components/header";

const ForgotPasswordScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState(null);
    const [messageColor, setMessageColor] = useState("black");
    const dispatch = useDispatch();

    const handleForgotPassword = async () => {
        if (!email) {
            setMessage("Vui lòng nhập email của bạn!");
            setMessageColor("red");
            return;
        }

        try {
            const response = await dispatch(sendOtpForgotPassword(email)).unwrap();
            setMessage(response);
            setMessageColor("green");
            setTimeout(() => {
                navigation.navigate("VerifyOTP", { email });
            }, 3000)

        } catch (error) {
            setMessage(error?.message || "Gửi OTP thất bại!");
            setMessageColor("red");
        }
    };


    return (
        <View style={styles.container}>
            <StatusBar hidden={true} />
            <Header title="Forgot Password" hideIcon={false} hideTitle={false} hideUser={true} />
            <View style={styles.content}>
                <Text style={styles.title}>Forgot Password</Text>
                <Text style={styles.description}>Enter your email to reset your password</Text>
                <WrapInput
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    style={styles.input}
                />
                <CustomButton title="Send Reset Link" onPress={handleForgotPassword} />
                {message && <Text style={[styles.message, { color: messageColor }]}>{message}</Text>}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    content: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, marginTop: 60 },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
    description: { fontSize: 16, color: "#666", marginBottom: 20, textAlign: "center" },
    input: { backgroundColor: "#F5F5F5", padding: 10, borderRadius: 5, marginVertical: 5 },
    message: { fontSize: 16, marginTop: 10, textAlign: "center" }, // ✅ Thêm style cho thông báo
});

export default ForgotPasswordScreen;
