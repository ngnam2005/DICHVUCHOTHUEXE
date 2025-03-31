import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import store from '../redux/store';
import { Provider } from 'react-redux';
import CartScreen from "../screens/CartScreen";
import FavouriteScreen from "../screens/FavouriteScreen";
const Tab = createBottomTabNavigator();

const Navigation = () => {
    return (
        <Provider store={store}>

            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ color, size }) => {
                        let iconName;
                        if (route.name === "Home") iconName = "home";
                        else if (route.name === "Favourite") iconName = "heart-outline";
                        else if (route.name === "Cart") iconName = "cart-outline";
                        else if (route.name === "Profile") iconName = "person";
                        ;
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
        </Provider>

    );
};

export default Navigation;
