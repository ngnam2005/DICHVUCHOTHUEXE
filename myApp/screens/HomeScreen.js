import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, StyleSheet, FlatList, StatusBar, ActivityIndicator, RefreshControl, Alert } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { fetchTypes } from "../redux/slices/typeSlice";
import { fetchVehicles } from "../redux/slices/vehicleSlice";
import { getCartByUserId, addVehicleToCart } from "../redux/slices/cartSlice";
import ItemVehicle from "../components/item_vehicle";
import ItemType from "../components/item_type";
import Banner from "../components/banner";
import SearchBar from "../components/searchBar";
import axios from "axios";
import API_BASE_URL from "../localhost/localhost";

const HomeScreen = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [refreshing, setRefreshing] = useState(false);
    const { list: types, status: statusTypes } = useSelector((state) => state.types) || { list: [], status: "idle" };
    const { list: vehicles, status: statusVehicles } = useSelector((state) => state.vehicles) || { list: [], status: "idle" };
    const loadingTypes = statusTypes === "loading";
    const loadingVehicles = statusVehicles === "loading";
    const [favorites, setFavorites] = useState([]);
    const { user } = useSelector((state) => state.auth);
    const [searchText, setSearchText] = useState("");
    console.log({ ItemVehicle, ItemType, Banner, SearchBar });


    useFocusEffect(
        React.useCallback(() => {
            const fetchFavorites = async () => {
                const stored = await AsyncStorage.getItem("favorites");
                if (stored) {
                    setFavorites(JSON.parse(stored));
                } else {
                    setFavorites([]);
                }
            };
            fetchFavorites();
        }, [])
    );

    const toggleFavorite = async (vehicle) => {
        let updatedFavorites;
        if (favorites.find((v) => v._id === vehicle._id)) {
            updatedFavorites = favorites.filter((v) => v._id !== vehicle._id);
        } else {
            updatedFavorites = [...favorites, vehicle];
        }
        setFavorites(updatedFavorites);
        await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    };


    useEffect(() => {
        if (statusTypes === "idle") dispatch(fetchTypes());
        if (statusVehicles === "idle") dispatch(fetchVehicles());
    }, [dispatch, statusTypes, statusVehicles]);

    const onRefresh = () => {
        setRefreshing(true);
        dispatch(fetchTypes());
        dispatch(fetchVehicles());
        setTimeout(() => setRefreshing(false), 1000);
    };

    const handleAddToCart = async (vehicleId) => {
        if (!user || !user.id) {
            Alert.alert("Thông báo", "Bạn cần đăng nhập để thêm vào giỏ hàng.");
            return;
        }

        const vehicle = vehicles.find((v) => v._id === vehicleId);
        if (!vehicle) {
            Alert.alert("Lỗi", "Xe không tồn tại");
            return;
        }

        const vehicleData = {
            vehicleId: vehicle._id,
            name: vehicle.name,
            image: vehicle.images[0],
            rentalPricePerDay: vehicle.rentalPricePerDay,
            quantity: 1,
            rentalStartDate: new Date().toISOString(),
            rentalEndDate: new Date().toISOString(),
        };

        try {

            const response = await dispatch(addVehicleToCart({ userId: user.id, vehicleData }));

            if (response?.meta?.requestStatus === "fulfilled") {
                Alert.alert("Thành công", "Đã thêm vào giỏ hàng!");
                dispatch(getCartByUserId(user.id));
            } else {
                Alert.alert("Lỗi", "Sản phẩm trong giỏ hàng đã đạt đến giới hạn trong kho.");
            }
        } catch (err) {
            Alert.alert("Lỗi", "Không thể thêm vào giỏ hàng.");
        }
    };

    const navigateToDetail = (vehicleId) => {
        navigation.navigate("DetailVehicleScreen", { vehicleId });
    };
    const handleSearchPress = () => {
        navigation.navigate("SearchScreen", { keyword: searchText });
    };
    const handleTypePress = (type) => {
        navigation.navigate("VehicleByType", { typeId: type._id, typeName: type.name });
    };


    return (
        <View style={styles.container}>
            <StatusBar hidden={true} />
            <SearchBar
                value={searchText}
                onChangeText={setSearchText}
                onSearchPress={handleSearchPress}
                placeholder="Tìm kiếm xe..."
            />
            <Banner />
            <Text style={styles.sectionTitle}>Types</Text>
            {loadingTypes ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.typeContainer}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                >
                    {types.map((type) => (
                        <ItemType key={type._id} type={type} onPress={handleTypePress} />
                    ))}
                </ScrollView>
            )}
            <Text style={styles.sectionTitle}>Popular Vehicles</Text>
            {loadingVehicles ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={vehicles}
                    renderItem={({ item }) => (
                        <ItemVehicle
                            vehicle={item}
                            onAddToCart={() => handleAddToCart(item._id)}
                            onToggleFavorite={() => toggleFavorite(item)}
                            isFavorite={favorites.some((v) => v._id === item._id)}
                            onPress={() => navigateToDetail(item._id)}
                        />
                    )}
                    keyExtractor={(item) => item._id.toString()}
                    numColumns={2}
                    columnWrapperStyle={styles.vehicleRow}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.vehicleList}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginVertical: 10,
        marginHorizontal: 15,
    },
    typeContainer: {
        paddingHorizontal: 15,
        paddingBottom: 10,
        marginBottom: 20
    },
    vehicleRow: {
        justifyContent: "space-between",
        paddingHorizontal: 17,
        marginTop: 12,
    },
    vehicleList: {
        paddingBottom: 20,
    },
});

export default HomeScreen;
