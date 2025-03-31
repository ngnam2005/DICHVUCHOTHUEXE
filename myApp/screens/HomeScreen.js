import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, StyleSheet, FlatList, StatusBar, ActivityIndicator, RefreshControl, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { fetchTypes } from "../redux/slices/typeSlice";
import { fetchVehicles } from "../redux/slices/vehicleSlice";
import ItemVehicle from "../components/item_vehicle";
import ItemType from "../components/item_type";
import Banner from "../components/banner";
import SearchBar from "../components/searchBar";

const HomeScreen = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation(); // Sử dụng hook điều hướng
    const [refreshing, setRefreshing] = useState(false);
    const { list: types, status: statusTypes } = useSelector((state) => state.types) || { list: [], status: "idle" };
    const { list: vehicles, status: statusVehicles } = useSelector((state) => state.vehicles) || { list: [], status: "idle" };
    const loadingTypes = statusTypes === "loading";
    const loadingVehicles = statusVehicles === "loading";

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

    useEffect(() => {
        const autoLogin = async () => {
            try {
                const savedUser = await AsyncStorage.getItem("savedUser");
                if (savedUser) {
                    const { nameAccount, password } = JSON.parse(savedUser);
                    const user = await dispatch(loginUser({ nameAccount, password })).unwrap();
                    navigation.navigate("HomeScreen");
                }
            } catch (error) {
                console.log("Không thể tự động đăng nhập", error);
            }
        };

        autoLogin();
    }, [dispatch, navigation]);




    return (
        <View style={styles.container}>
            <StatusBar hidden={true} />
            <SearchBar />
            <Banner />
            <Text style={styles.sectionTitle}>Categories</Text>
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
                        <ItemType key={type._id} type={type} />
                    ))}
                </ScrollView>
            )}
            <Text style={styles.sectionTitle}>Popular Vehicles</Text>
            {loadingVehicles ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={vehicles}
                    renderItem={({ item }) => <ItemVehicle vehicle={item} />}
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
