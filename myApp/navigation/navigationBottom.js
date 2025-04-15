import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Provider, useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import store from "../redux/store";
import { loadStoredUser } from "../redux/slices/authSlice";

import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import CartScreen from "../screens/CartScreen";
import FavouriteScreen from "../screens/FavouriteScreen";

const Tab = createBottomTabNavigator();

const AppTabs = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadStoredUser()); // Load user từ AsyncStorage vào Redux store
    }, []);

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName;
                    if (route.name === "Home") iconName = "home";
                    else if (route.name === "Favourite") iconName = "heart-outline";
                    else if (route.name === "Cart") iconName = "cart-outline";
                    else if (route.name === "Profile") iconName = "person";
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: "blue",
                tabBarInactiveTintColor: "gray",
                headerShown: false,
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Cart" component={CartScreen} />
            <Tab.Screen name="Favourite" component={FavouriteScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
};

const Navigation = () => {
    return (
        <Provider store={store}>
                <AppTabs />
        </Provider>
    );
};

export default Navigation;
