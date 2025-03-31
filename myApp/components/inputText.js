import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const WrapInput = ({ label, placeholder, value, onChangeText, required = false, eyePass = false, keyboardType = "default" }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label} {required && <Text style={styles.required}>*</Text>}
        </Text>
      )}
      <View style={[styles.inputContainer, isFocused ? styles.focusedBorder : styles.defaultBorder]}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor="#A0A0A0"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={eyePass && !showPassword}
          keyboardType={keyboardType}
        />
        {eyePass && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            <Icon name={showPassword ? "eye" : "eye-slash"} size={20} color="#777" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 15, width: "100%" },
  label: { fontSize: 16, fontWeight: "500", color: "#333", marginBottom: 5 },
  required: { color: "red" },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 6,
    height: 50,
    paddingHorizontal: 12,
    backgroundColor: "#F5F5F5",
  },
  defaultBorder: { borderWidth: 1, borderColor: "#C0C0C0" },
  focusedBorder: { borderWidth: 1, borderColor: "#007BFF" },
  input: { flex: 1, fontSize: 16, color: "#333" },
  eyeIcon: { marginHorizontal: 10 },
});

export default WrapInput;
