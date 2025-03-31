import React, { useState } from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const Checkbox = ({ label, checked, onChange }) => {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => onChange(!checked)}
            activeOpacity={0.7}
        >
            <View style={[styles.checkbox, checked && styles.checked]}>
                {checked && <Icon name="check" size={14} color="white" />}
            </View>
            <Text style={styles.label}>{label}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 5,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: "#007BFF",
        borderRadius: 4,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
    },
    checked: {
        backgroundColor: "#007BFF",
        borderColor: "#007BFF",
    },
    label: {
        fontSize: 16,
        color: "#333",
    },
});

export default Checkbox;
