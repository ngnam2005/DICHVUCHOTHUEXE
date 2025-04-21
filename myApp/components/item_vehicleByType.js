import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import API_BASE_URL from "../localhost/localhost";

const ItemVehicleModern = ({ vehicle, onAddToCart, isFavorite, onToggleFavorite, onPress }) => {
    const imageUrl = Array.isArray(vehicle.images) && vehicle.images.length > 0
        ? `${API_BASE_URL}${vehicle.images[0]}`
        : "https://via.placeholder.com/150";

    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <View style={styles.imageContainer}>
                <Image source={{ uri: imageUrl }} style={styles.image} />
                <TouchableOpacity style={styles.favoriteIcon} onPress={onToggleFavorite}>
                    <MaterialIcons
                        name={isFavorite ? "favorite" : "favorite-border"}
                        size={22}
                        color={isFavorite ? "#e53935" : "#999"}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.infoContainer}>
                <Text style={styles.type}>
                    {typeof vehicle.type === "string" ? vehicle.type : vehicle.type?.name || "Unknown"}
                </Text>
                <Text numberOfLines={1} style={styles.name}>{vehicle.name}</Text>
                <Text style={styles.price}>
                    {vehicle.rentalPricePerDay
                        ? `${new Intl.NumberFormat('vi-VN').format(vehicle.rentalPricePerDay)} VND/ngày`
                        : "Liên hệ"}
                </Text>
            </View>

            <TouchableOpacity style={styles.cartButton} onPress={onAddToCart}>
                <MaterialIcons name="add-shopping-cart" size={18} color="#fff" />
            </TouchableOpacity>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#f9f9f9",
        borderRadius: 14,
        margin: 10,
        width: 360,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
        overflow: "hidden",
        position: "relative",
    },
    imageContainer: {
        width: "100%",
        height: 120,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
    },
    image: {
        width: "90%",
        height: "90%",
        resizeMode: "contain",
    },
    favoriteIcon: {
        position: "absolute",
        top: 8,
        right: 8,
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 4,
    },
    infoContainer: {
        padding: 10,
    },
    type: {
        fontSize: 12,
        color: "#999",
    },
    name: {
        fontSize: 15,
        fontWeight: "bold",
        marginVertical: 4,
        color: "#333",
    },
    price: {
        fontSize: 14,
        color: "#E44D26",
    },
    cartButton: {
        position: "absolute",
        bottom: 10,
        right: 10,
        backgroundColor: "#FF9800",
        padding: 8,
        borderRadius: 20,
        elevation: 2,
    },
});

export default ItemVehicleModern;
