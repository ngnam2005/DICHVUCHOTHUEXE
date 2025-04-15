import React from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const SearchBar = ({ value, onChangeText, onSearchPress, placeholder = "Search..." }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onSearchPress}>
                <Ionicons name="search" size={20} color="gray" style={styles.icon} />
            </TouchableOpacity>
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                autoCapitalize="none"
                returnKeyType="search"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f0f0f0",
        borderRadius: 10,
        paddingHorizontal: 10,
        marginHorizontal: 10,
        marginVertical: 10,
        height: 40,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
    },
});

export default SearchBar;
