import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import WrapInput from "../components/inputText";
import SocialButton from "../components/soccialButton";
import CustomButton from "../components/button";
import Checkbox from "../components/checkBox";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/slices/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = ({ navigation }) => {
    const [nameAccount, setNameAccount] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const dispatch = useDispatch();
    const { loading, errorLogin } = useSelector((state) => state.auth);

    const handleLogin = async () => {
        if (!nameAccount || !password) {
            Alert.alert("Error", "Please enter your account and password!");
            return;
        }
    
        try {
            const user = await dispatch(loginUser({ nameAccount, password })).unwrap();
    
            // ✅ Lưu user duy nhất vào AsyncStorage
            await AsyncStorage.setItem("user", JSON.stringify(user));
    
            Alert.alert("Login success", `Welcome, ${user?.fullname || "User"}!`);
            navigation.replace("HomeScreen");
        } catch (err) {
            Alert.alert("Login Failed", err?.message || "Invalid credentials!");
        }
    };
    
    useEffect(() => {
        const loadSavedUser = async () => {
            try {
                const savedUser = await AsyncStorage.getItem("user");
                if (savedUser) {
                    const user = JSON.parse(savedUser);
                    setNameAccount(user.nameAccount || "");
                    setPassword(user.password || "");
                    setRememberMe(true); // nếu có dữ liệu là user, mặc định bật Remember Me
                }
            } catch (error) {
                console.error("Failed to load saved credentials", error);
            }
        };
        loadSavedUser();
    }, []);
    


    const goToForgot = () => navigation.navigate("ForgotPass");

    return (
        <View style={styles.container}>
            <Text style={styles.nameScreen}>LOGIN</Text>
            <Image source={require("../assets/loginImage.jpeg")} style={styles.image} />
            <WrapInput label="Name Account" placeholder="Enter your name account" value={nameAccount} onChangeText={setNameAccount} required />
            <WrapInput label="Password" placeholder="Enter your password" value={password} onChangeText={setPassword} required eyePass />

            <View style={styles.row}>
                <Checkbox label="Remember Me" checked={rememberMe} onChange={setRememberMe} />
                <TouchableOpacity onPress={goToForgot}>
                    <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>
            </View>

            <CustomButton title={loading ? "Logging in..." : "Login"} onPress={handleLogin} disabled={loading} />
            <SocialButton title="Login Google" iconName="google" color="#000" backgroundColor="#fff" />
            <SocialButton title="Login Facebook" iconName="facebook" color="#fff" backgroundColor="#3b5998" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", paddingHorizontal: 20, backgroundColor: "#fff" },
    image: { width: "100%", height: 200, borderRadius: 10, marginBottom: 20 },
    row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
    forgotText: { color: "#FF5722", fontSize: 14 },
    nameScreen: {
        fontSize: 29,
        fontWeight: "bold",
        color: "#FF5722",
        textTransform: "uppercase",
        letterSpacing: 2,
        textAlign: "center",
        marginBottom: 20,
    },
});

export default LoginScreen;
