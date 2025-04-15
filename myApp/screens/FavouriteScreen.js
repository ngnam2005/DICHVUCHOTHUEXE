import React, { useState, useCallback } from "react";
import {
    View,
    FlatList,
    Text,
    StyleSheet,
    RefreshControl,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import ItemCart from "../components/item_cart_product";

const FavouriteScreen = () => {
    const [favorites, setFavorites] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const loadFavorites = async () => {
        try {
            const stored = await AsyncStorage.getItem("favorites");
            if (stored) {
                const parsed = JSON.parse(stored);
                setFavorites(Array.isArray(parsed) ? parsed : []);
            } else {
                setFavorites([]);
            }
        } catch (error) {
            console.error("Lỗi load favorites:", error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadFavorites();
        }, [])
    );

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadFavorites();
        setRefreshing(false);
    };

    const toggleFavorite = async (vehicleId) => {
        const updated = favorites.filter((v) => v._id !== vehicleId);
        setFavorites(updated);
        await AsyncStorage.setItem("favorites", JSON.stringify(updated));
    };

    const renderItem = ({ item }) => {
        return (
            <ItemCart
                item={{ vehicleId: item, quantity: 1 }}
                showCheckbox={false}
                showRemove={false}
                showQuantityControls={false}
                onToggleFavorite={() => toggleFavorite(item._id)}
                isFavorite={true}
            />
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={favorites}
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                    />
                }
                ListEmptyComponent={
                    <Text style={styles.emptyText}>
                        Bạn chưa có phương tiện yêu thích.
                    </Text>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: "#fff",
    },
    emptyText: {
        textAlign: "center",
        marginTop: 20,
        color: "gray",
        fontSize: 16,
    },
});

export default FavouriteScreen;
