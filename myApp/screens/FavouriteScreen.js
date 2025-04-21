import React, { useState, useCallback } from "react";
import {
    View,
    FlatList,
    Text,
    StyleSheet,
    RefreshControl,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import ItemCart from "../components/item_cart_product";
import Icon from "react-native-vector-icons/FontAwesome";  // Import FontAwesome icon

const FavouriteScreen = () => {
    const [favorites, setFavorites] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation();

    const loadFavorites = async () => {
        try {
            const stored = await AsyncStorage.getItem("favorites");
            const parsed = stored ? JSON.parse(stored) : [];
            setFavorites(Array.isArray(parsed) ? parsed : []);
        } catch (error) {
            console.error("Lỗi khi load favorites:", error);
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
        try {
            const updated = favorites.filter((v) => v._id !== vehicleId);
            setFavorites(updated);
            await AsyncStorage.setItem("favorites", JSON.stringify(updated));
        } catch (error) {
            console.error("Lỗi khi xoá khỏi yêu thích:", error);
        }
    };

    const handleItemPress = (vehicle) => {
        navigation.navigate("DetailVehicleScreen", { vehicleId: vehicle._id });
    };

    const renderItem = useCallback(({ item }) => (
        <ItemCart
            item={{ vehicleId: item, quantity: 1 }}
            showCheckbox={false}
            showRemove={false}
            showQuantityControls={false}
            onToggleFavorite={() => toggleFavorite(item._id)}
            isFavorite={true}
            onPress={() => handleItemPress(item)}
        />
    ), [favorites]);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            title: "Yêu Thích",
        });
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Yêu Thích</Text>
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
                    <View style={styles.emptyContainer}>
                        {/* Icon thùng rác */}
                        <Icon name="trash" size={100} color="gray" style={styles.emptyImage} />
                        <Text style={styles.emptyText}>
                            Bạn chưa có phương tiện yêu thích.
                        </Text>
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 100,
    },
    emptyImage: {
        marginBottom: 20,
    },
    emptyText: {
        color: "gray",
        fontSize: 16,
        fontStyle: "italic",
    },
});

export default FavouriteScreen;
