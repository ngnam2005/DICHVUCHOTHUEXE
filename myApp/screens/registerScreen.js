import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../redux/slices/authSlice";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import CustomButton from "../components/button";
import SocialButton from "../components/soccialButton";
import Checkbox from "../components/checkBox";
import WrapInput from "../components/inputText";

const RegisterScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { loading, errorRegister } = useSelector((state) => state.auth);
  const [nameAccount, setNameAccount] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthday, setBirthday] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [role, setRole] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleRegister = () => {
    const userData = {
      nameAccount,
      email,
      password,
      fullname: `${firstName} ${lastName}`,
      phone,
      birthday: birthday ? birthday.toISOString() : null,
      role,
      avatar,
    };

    dispatch(registerUser(userData)).then((result) => {
      if (registerUser.fulfilled.match(result)) {
        setSuccessMessage("Đăng ký thành công!");
        setTimeout(() => setSuccessMessage(""), 3000);

        // Reset form
        setNameAccount("");
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhone("");
        setPassword("");
        setConfirmPassword("");
        setBirthday(null);
        setAvatar(null);
        setRole("");
      }
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Text style={styles.title}>CREATE YOUR ACCOUNT</Text>

          <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
            {avatar ? (
              <Image source={{ uri: avatar }} style={styles.avatar} />
            ) : (
              <Text style={styles.uploadText}>Chọn ảnh đại diện</Text>
            )}
          </TouchableOpacity>

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <WrapInput
                label="First Name"
                placeholder="First name"
                value={firstName}
                onChangeText={setFirstName}
                required
              />
            </View>
            <View style={styles.halfInput}>
              <WrapInput
                label="Last Name"
                placeholder="Last name"
                value={lastName}
                onChangeText={setLastName}
                required
              />
            </View>
          </View>

          <WrapInput
            label="Username"
            placeholder="Enter your username"
            value={nameAccount}
            onChangeText={setNameAccount}
            required
          />
          <WrapInput
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            required
          />
          <WrapInput
            label="Phone Number"
            placeholder="Enter your phone"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <WrapInput
            label="Password"
            placeholder="Enter password"
            value={password}
            onChangeText={setPassword}
            eyePass
            required
          />
          <WrapInput
            label="Confirm Password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            eyePass
            required
          />

          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.datePicker}
          >
            <Text style={styles.dateText}>
              {birthday ? birthday.toDateString() : "Select your birthday"}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={birthday || new Date()}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowDatePicker(false);
                if (date) setBirthday(date);
              }}
            />
          )}

          <Text style={styles.roleTitle}>Select your role</Text>
          <View style={styles.roleContainer}>
            <Checkbox
              label="Admin"
              checked={role === "Admin"}
              onChange={() => setRole("Admin")}
            />
            <Checkbox
              label="User"
              checked={role === "User"}
              onChange={() => setRole("User")}
            />
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#FF5722" />
          ) : (
            <CustomButton
              title="SIGN UP"
              onPress={handleRegister}
              backgroundColor="#FF5722"
              color="#fff"
            />
          )}

          {errorRegister ? (
            <Text style={styles.error}>{errorRegister}</Text>
          ) : successMessage ? (
            <Text style={styles.success}>{successMessage}</Text>
          ) : null}

          <SocialButton
            title="Login Google"
            iconName="google"
            color="#000"
            backgroundColor="#fff"
          />
          <SocialButton
            title="Login Facebook"
            iconName="facebook"
            color="#fff"
            backgroundColor="#3b5998"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    flex: 1,
    marginRight: 5,
  },
  datePicker: {
    padding: 10,
    backgroundColor: "#F5F5F5",
    borderRadius: 5,
    marginVertical: 5,
    alignItems: "center",
  },
  dateText: {
    color: "#333",
  },
  avatarContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  uploadText: {
    color: "#FF5722",
    fontWeight: "bold",
  },
  roleTitle: {
    marginTop: 10,
    fontWeight: "bold",
    fontSize: 16,
  },
  roleContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  success: {
    color: "green",
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  error: {
    color: "red",
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
});

export default RegisterScreen;
