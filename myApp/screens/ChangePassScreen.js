import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { changePassword } from '../redux/slices/authSlice';

const ChangePassScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth.user);
  const { loading, successMessage, errorChangePassword } = useSelector((state) => state.auth);
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

  // Hiển thị thông báo sau khi đổi mật khẩu
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
    <View style={styles.container}>
      <Text style={styles.title}>Đổi mật khẩu</Text>

      <TextInput
        placeholder="Mật khẩu hiện tại"
        secureTextEntry
        value={currentPassword}
        onChangeText={setCurrentPassword}
        style={styles.input}
      />

      <TextInput
        placeholder="Mật khẩu mới"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
        style={styles.input}
      />

      <TextInput
        placeholder="Xác nhận mật khẩu"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleChangePassword} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Xác nhận</Text>}
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 25, textAlign: 'center', color: '#333' },
    input: {
      borderWidth: 1, borderColor: '#ccc',
      paddingHorizontal: 15, paddingVertical: 10,
      borderRadius: 8, marginBottom: 15
    },
    button: { backgroundColor: '#28a745', paddingVertical: 12, borderRadius: 8 },
    buttonText: { color: '#fff', fontSize: 16, textAlign: 'center' }
  });
export default ChangePassScreen;
