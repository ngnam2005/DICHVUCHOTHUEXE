import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const SocialButton = ({ title, iconName, color, backgroundColor, onPress }) => {
    return (
        <TouchableOpacity style={[styles.button, { backgroundColor }]} onPress={onPress}>
            <View style={styles.iconContainer}>
                <Icon name={iconName} size={20} color={color} />
            </View>
            <Text style={[styles.text, { color }]}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: { flexDirection: "row", alignItems: "center", padding: 12, borderRadius: 6, marginVertical: 5 },
    iconContainer: { marginRight: 30 },
    text: { fontSize: 16, fontWeight: "bold" },
});

export default SocialButton;
