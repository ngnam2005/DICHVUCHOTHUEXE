import React from "react";
import { TouchableOpacity, Image, Text, StyleSheet } from "react-native";
import API_BASE_URL from "../localhost/localhost"; // Nhớ chỉnh đường dẫn nếu khác

const ItemType = ({ type, onPress }) => {
    const imageUrl = type.image.startsWith("http") ? type.image : `${API_BASE_URL}${type.image}`;

    return (
        <TouchableOpacity style={styles.container} onPress={() => onPress(type)}>
            <Image source={{ uri: imageUrl }} style={styles.image} />
            <Text style={styles.name}>{type.name}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        marginRight: 12,
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 35,
        marginBottom: 5,
    },
    name: {
        fontSize: 14,
        fontWeight: "500",
    },
});

export default ItemType;
