import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import API_BASE_URL from "../localhost/localhost"; // Import đường dẫn API

const ItemType = ({ type }) => {
    // Kiểm tra đường dẫn ảnh
    const imageUrl = type.image.startsWith("http") ? type.image : `${API_BASE_URL}${type.image}`;
    console.log("🛑 Type Image URL:", imageUrl);

    return (
        <View style={styles.container}>
            <Image source={{ uri: imageUrl }} style={styles.image} />
            <Text style={styles.name}>{type.name}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        margin: 10,
        height: 150,
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginBottom: 5,
        resizeMode: "contain",
    },
    name: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#333",
    },
});

export default ItemType;
