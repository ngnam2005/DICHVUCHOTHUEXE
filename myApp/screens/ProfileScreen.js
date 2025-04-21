import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Switch,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logout } from "../redux/slices/authSlice";
import { useTheme } from "../components/darkScreen";
import { useSelector, useDispatch } from 'react-redux';
import API_BASE_URL from "../localhost/localhost";


const ProfileScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { isDarkMode, toggleTheme, colors } = useTheme();
    const user = useSelector((state) => state.auth.user);
    console.log("Thông tin user:", user);
    console.log(`${API_BASE_URL}${user?.avatar}`);

    const handleLogout = async () => {
        try {
            await AsyncStorage.clear();
            dispatch(logout());
            navigation.reset({ index: 0, routes: [{ name: "Auth" }] });
        } catch (error) {
            console.log("Lỗi khi đăng xuất:", error);
        }
    };
    const handleScreen = (name) => {
        navigation.navigate(name);
    };


    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.profileInfo}>
                <Image
                    source={
                        user?.avatar
                            ? { uri: `${API_BASE_URL}${user?.avatar}` }
                            : { uri: "https://i.pravatar.cc/150?img=3" }
                    }
                    style={styles.avatar}
                />
                <Text style={styles.username}>{user?.fullname || 'Người dùng'}</Text>
            </View>

            <TouchableOpacity style={[styles.option, { borderBottomColor: colors.border }]} onPress={() => handleScreen("ChangePass")}>
                <Text style={{ color: colors.text }}>Đổi mật khẩu</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.option, { borderBottomColor: colors.border }]} onPress={() => handleScreen("UpdateProfile")}>
                <Text style={{ color: colors.text }}>Thông tin người dùng</Text>
            </TouchableOpacity>

            <View style={[styles.optionRow, { borderBottomColor: colors.border }]}>
                <Text style={{ color: colors.text }}>Chế độ tối</Text>
                <Switch value={isDarkMode} onValueChange={toggleTheme} />
            </View>

            <TouchableOpacity style={[styles.option, { borderBottomColor: colors.border }]} onPress={() => handleScreen("Notification")}>
                <Text style={{ color: colors.text }}>Thông báo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.option, { borderBottomColor: colors.border }]} onPress={() => handleScreen("OrderHistory")}>
                <Text style={{ color: colors.text }}>Lịch sử đặt hàng</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.logoutBtn, { backgroundColor: colors.logout }]}
                onPress={handleLogout}
            >
                <Text style={styles.logoutText}>Đăng xuất</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        paddingTop: 50,
    },
    profileInfo: {
        alignItems: 'center',
        marginBottom: 20,
    },

    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
        borderWidth: 2,
        borderColor: '#ccc',
    },

    username: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    option: {
        width: "90%",
        padding: 15,
        borderBottomWidth: 1,
    },
    optionRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "90%",
        padding: 15,
        borderBottomWidth: 1,
    },
    logoutBtn: {
        marginTop: 30,
        padding: 15,
        borderRadius: 10,
        width: "90%",
        alignItems: "center",
    },
    logoutText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default ProfileScreen;
