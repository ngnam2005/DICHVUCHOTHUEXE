import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import API_BASE_URL from "../localhost/localhost";

const ItemVehicle = ({ vehicle }) => {
    const [isFavorite, setIsFavorite] = useState(false);

    // Lấy ảnh đầu tiên từ mảng `vehicle.images`
    const imageUrl = Array.isArray(vehicle.images) && vehicle.images.length > 0
        ? `${API_BASE_URL}${vehicle.images[0]}`
        : "https://via.placeholder.com/150"; // Ảnh mặc định

    console.log("🚗 Vehicle Image URL:", imageUrl); // Debug URL ảnh

    return (
        <View style={styles.container}>
            {/* Icon trái tim */}
            <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)} style={styles.heartIcon}>
                <MaterialIcons
                    name={isFavorite ? "favorite" : "favorite-border"}
                    size={24}
                    color={isFavorite ? "#ff4d4d" : "gray"}
                />
            </TouchableOpacity>
            <Image source={{ uri: imageUrl }} style={styles.image} />
            <Text style={styles.subTitle}>
                {typeof vehicle.type === "string" ? vehicle.type : vehicle.type?.name || "Unknown"}
            </Text>
            <Text style={styles.title}>{vehicle.name}</Text>
            <Text style={styles.price}>
                {vehicle.rentalPricePerDay
                    ? `${new Intl.NumberFormat('vi-VN').format(vehicle.rentalPricePerDay)} VND`
                    : "Liên hệ"}
            </Text>
            <TouchableOpacity style={styles.cartButton}>
                <MaterialIcons name="shopping-cart" size={20} color="white" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 12,
        width: 170,
        height: 265,
        position: "relative",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 10,
    },
    heartIcon: {
        position: "absolute",
        top: 10,
        right: 10,
    },
    image: {
        width: 110,
        height: 110,
        marginBottom: 8,
        resizeMode: "contain",
        // borderWidth: 2,        // Thêm viền
        // borderColor: "#ddd",   // Màu viền (màu xám nhạt)
        borderRadius: 8,
        marginTop: 20      // Bo góc viền nhẹ
    },
    subTitle: {
        fontSize: 13,
        color: "#666",
        // textTransform: "uppercase",
        textAlign: "center",
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        textAlign: "center",
        marginBottom: 3,
        height: 45
    },
    price: {
        fontSize: 15,
        fontWeight: "bold",
        color: "#E44D26",
    },
    cartButton: {
        position: "absolute",
        bottom: 0,
        left: 0,
        backgroundColor: "#FF9800",
        borderBottomLeftRadius: 12, // Bo góc đồng bộ với container
        borderTopRightRadius: 15,    // Bo nhẹ để tạo hiệu ứng mềm mại
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    }
});

export default ItemVehicle;
