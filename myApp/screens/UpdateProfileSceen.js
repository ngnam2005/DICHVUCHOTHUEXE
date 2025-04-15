import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile } from "../redux/slices/authSlice";
import WrapInput from "../components/inputText";
import CustomButton from "../components/button";
import Header from "../components/header";
import API_BASE_URL from "../localhost/localhost";

const UpdateProfileScreen = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    _id: user?.id, // BỔ SUNG DÒNG NÀY
    fullname: user?.fullname || "",
    email: user?.email || "",
    phone: user?.phone || "",
    birthday: user?.birthday ? new Date(user.birthday) : null,
    avatar: user?.avatar || "",
  });
  
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleImagePick = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      Alert.alert("Thông báo", "Bạn cần cấp quyền truy cập ảnh.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled && result.assets.length > 0) {
      handleChange("avatar", result.assets[0].uri);
    }
  };

  const handleUpdate = async () => {
    if (!form._id) {
      Alert.alert("Lỗi", "Không tìm thấy ID người dùng!");
      return;
    }
    try {
      setLoading(true);
      const updatedData = {
        ...form,
        birthday: form.birthday?.toISOString().split("T")[0],
      };

      const result = await dispatch(updateUserProfile(updatedData));
      if (updateUserProfile.fulfilled.match(result)) {
        Alert.alert("Thành công", "Cập nhật tài khoản thành công!");
      } else {
        Alert.alert("Lỗi", result.payload?.message || "Cập nhật thất bại!");
      }
    } catch (error) {
      Alert.alert("Lỗi", "Cập nhật thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Header hideUser />
      <View style={styles.content}>
        <Text style={styles.title}>Cập nhật thông tin cá nhân</Text>

        <TouchableOpacity onPress={handleImagePick} style={styles.avatarContainer}>
          {form.avatar ? (
            <Image
              style={styles.avatar}
              source={{
                uri:
                  form.avatar.startsWith("http") || form.avatar.startsWith("file")
                    ? form.avatar
                    : `${API_BASE_URL}${form.avatar}`,
              }}
            />
          ) : (
            <Text style={styles.uploadText}>Chọn ảnh đại diện</Text>
          )}
        </TouchableOpacity>

        <WrapInput
          label="Họ và tên"
          placeholder="Nhập họ tên"
          value={form.fullname}
          onChangeText={(val) => handleChange("fullname", val)}
          required
        />
        <WrapInput
          label="Email"
          placeholder="Nhập email"
          value={form.email}
          onChangeText={(val) => handleChange("email", val)}
          keyboardType="email-address"
          required
        />
        <WrapInput
          label="Số điện thoại"
          placeholder="Nhập số điện thoại"
          value={form.phone}
          onChangeText={(val) => handleChange("phone", val)}
          keyboardType="phone-pad"
        />

        <TouchableOpacity style={styles.datePicker} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.dateLabel}>Ngày sinh</Text>
          <Text style={styles.dateText}>
            {form.birthday ? form.birthday.toISOString().split("T")[0] : "Chọn ngày sinh"}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={form.birthday || new Date()}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowDatePicker(false);
              if (date) handleChange("birthday", date);
            }}
          />
        )}

        {loading ? (
          <ActivityIndicator size="large" color="#FF5722" />
        ) : (
          <CustomButton title="Cập nhật" onPress={handleUpdate} />
        )}
      </View>
    </ScrollView>
  );
};

export default UpdateProfileScreen;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    alignSelf: "center",
  },
  avatarContainer: {
    alignSelf: "center",
    marginBottom: 20,
    borderRadius: 60,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  uploadText: {
    padding: 40,
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
  datePicker: {
    marginBottom: 15,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#C0C0C0",
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 5,
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
});
