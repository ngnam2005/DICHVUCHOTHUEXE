import React from "react";
import { View, Text, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";





const ProfileScreen = () => {
    const navigation = useNavigation();
    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem("savedUser");
            await AsyncStorage.removeItem("userData");
            navigation.reset({
                index: 0,
                routes: [{ name: "Auth" }], 
            });
        } catch (error) {
            console.log("Lỗi khi đăng xuất:", error);
        }
    };
    return (
        <View >
            <Button title="LOG OUT" onPress={handleLogout} />
        </View>

    );
};


export default ProfileScreen;
