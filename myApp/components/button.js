import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const CustomButton = ({ title, onPress, backgroundColor = "#FF5722" }) => {
    return (
        <TouchableOpacity style={[styles.button, { backgroundColor }]} onPress={onPress}>
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: { padding: 12, borderRadius: 6, alignItems: "center", marginVertical: 10 },
    text: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});

export default CustomButton;
