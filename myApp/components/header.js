import React from "react";
import { TouchableOpacity, View, Text, StyleSheet, Image } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";

const Header = ({ title, hideIcon, hideTitle, user, hideUser }) => {
    const navigation = useNavigation(); // 🛠️ Lấy navigation từ React Navigation

    return (
        <View style={styles.headerContainer}>
            <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
                {!hideIcon && <Icon size={24} name="chevron-left" color="black" />}
            </TouchableOpacity>
            {!hideTitle && <Text style={styles.headerTitle}>{title}</Text>}
            {!hideUser && (
                <TouchableOpacity style={styles.userContainer}>
                    {user?.image ? (
                        <Image source={{ uri: user.image }} style={styles.userImage} />
                    ) : (
                        <Icon size={24} name="user" color="black" />
                    )}
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: "#f8f8f8",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        flex: 1,
        textAlign: "center",
    },
    back: {
        padding: 8,
    },
    userContainer: {
        padding: 8,
    },
    userImage: {
        width: 32,
        height: 32,
        borderRadius: 16,
    },
});

export default Header;
