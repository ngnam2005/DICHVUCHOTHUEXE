import React, { useRef } from "react";
import { View, TextInput, StyleSheet } from "react-native";

const OTPInput = ({ otp, setOtp }) => {
    const inputs = useRef([]);

    const handleChange = (text, index) => {
        let newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp.join(""));

        // Chuyển focus sang ô tiếp theo nếu có nhập số
        if (text && index < 5) {
            inputs.current[index + 1].focus();
        }
    };

    const handleKeyPress = (e, index) => {
        if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
            inputs.current[index - 1].focus();
        }
    };

    return (
        <View style={styles.container}>
            {Array(6).fill("").map((_, index) => (
                <TextInput
                    key={index}
                    ref={(el) => (inputs.current[index] = el)}
                    style={styles.input}
                    keyboardType="number-pad"
                    maxLength={1}
                    value={otp[index] || ""}
                    onChangeText={(text) => handleChange(text, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
    },
    input: {
        width: 50,
        height: 50,
        borderWidth: 2,
        borderColor: "#FF5722", 
        textAlign: "center",
        fontSize: 20,
        marginHorizontal: 5,
        borderRadius: 10,
    },
});

export default OTPInput;
