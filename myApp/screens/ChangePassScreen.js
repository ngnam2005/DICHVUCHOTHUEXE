import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { changePassword } from '../redux/slices/authSlice';
import Header from '../components/header';
import WrapInput from '../components/inputText';

const ChangePassScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user: userInfo, loading, successMessage, errorChangePassword } = useSelector((state) => state.auth);
  const email = userInfo?.email;

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = () => {
    if (!email) return Alert.alert("Lỗi", "Không tìm thấy email người dùng!");
    if (!currentPassword || !newPassword || !confirmPassword) {
      return Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin!');
    }
    if (newPassword !== confirmPassword) {
      return Alert.alert('Lỗi', 'Mật khẩu xác nhận không trùng khớp!');
    }
    if (newPassword.length < 6) {
      return Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự!');
    }

    dispatch(changePassword({ email, currentPassword, newPassword }));
  };

  useEffect(() => {
    if (successMessage) {
      Alert.alert('Thành công', successMessage, [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    }
    if (errorChangePassword) {
      Alert.alert('Lỗi', errorChangePassword);
    }
  }, [successMessage, errorChangePassword]);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header title="Đổi mật khẩu" hideUser />
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Thay đổi mật khẩu</Text>

        <WrapInput
          placeholder="Mật khẩu hiện tại"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry
          eyePass
        />

        <WrapInput
          placeholder="Mật khẩu mới"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          eyePass
        />

        <WrapInput
          placeholder="Xác nhận mật khẩu"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          eyePass
        />

        <TouchableOpacity style={styles.button} onPress={handleChangePassword} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Xác nhận</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
    color: '#333',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ChangePassScreen;
