import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import axios from "axios";
import API_BASE_URL from "../localhost/localhost";
import ItemVehicleModern from "../components/item_vehicleByType";
import Header from "../components/header";

const VehicleByTypeScreen = ({ route, navigation }) => {
    const { typeId } = route.params; // Get typeId from navigation params
    const [vehicles, setVehicles] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [typeName, setTypeName] = useState(""); // State to store type name

    useEffect(() => {
        // Fetch vehicles based on typeId
        const fetchVehicles = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/vehicles/getByType/${typeId}`);
                setVehicles(response.data);
            } catch (error) {
                // console.error("Lỗi khi lấy danh sách xe:", error);
            }
        };

        // Fetch type name based on typeId
        const fetchTypeName = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/types/getById/${typeId}`);
                setTypeName(response.data.name);
            } catch (error) {
                console.log("Lỗi khi lấy tên loại xe:", error);
            }
        };

        fetchVehicles();
        fetchTypeName();
    }, [typeId]);

    const handleAddToCart = (vehicle) => {
        console.log("🛒 Thêm vào giỏ:", vehicle.name);
    };

    const handleToggleFavorite = (vehicleId) => {
        if (favorites.includes(vehicleId)) {
            setFavorites(favorites.filter(id => id !== vehicleId));
        } else {
            setFavorites([...favorites, vehicleId]);
        }
    };

    const handlePressVehicle = (vehicle) => {
        navigation.navigate("DetailVehicleScreen", { vehicleId: vehicle._id });
    };

    return (
        <View style={styles.container}>

            <Header title={typeName || "Loại xe"} hideUser={true} />
            <FlatList
                data={vehicles}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.listContainer}
                renderItem={({ item }) => (
                    <ItemVehicleModern
                        vehicle={item}
                        onAddToCart={() => handleAddToCart(item)}
                        isFavorite={favorites.includes(item._id)}
                        onToggleFavorite={() => handleToggleFavorite(item._id)}
                        onPress={() => handlePressVehicle(item)}
                    />
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>Không có xe nào.</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f2f2f2",
    },
    listContainer: {
        paddingHorizontal: 10,
        paddingBottom: 20,
    },
    emptyText: {
        textAlign: "center",
        marginTop: 50,
        color: "#999",
    },
});

export default VehicleByTypeScreen;
