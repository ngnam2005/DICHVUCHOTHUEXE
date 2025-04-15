import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Image,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_BASE_URL from '../localhost/localhost';

const PaymentScreen = ({ route, navigation }) => {
    const { cart, startDate, endDate, rentalDays, totalPrice } = route.params;
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const getUser = async () => {
            const userData = await AsyncStorage.getItem("user");
            if (userData) setUser(JSON.parse(userData));
        };
        getUser();
    }, []);

    const handlePayment = async (method) => {
        setLoading(true);
        try {
            const orderData = {
                user: {
                    _id: user.id,
                    fullname: user.fullname,
                    avatar: user.avatar
                },
                vehicles: cart.vehicles.map(({ vehicleId, quantity }) => ({
                    vehicleId: vehicleId._id,
                    name: vehicleId.name,
                    image: vehicleId.image || vehicleId.images?.[0] || '',
                    rentalPricePerDay: vehicleId.rentalPricePerDay,
                    quantity
                })),
                rentalStartDate: startDate,
                rentalEndDate: endDate,
                rentalDays,
                totalPrice,
                paymentMethod: method
            };

            await axios.post(`${API_BASE_URL}/api/orders/create`, orderData);

            Alert.alert("Thành công", "Đơn hàng đã được thanh toán", [
                {
                    text: "OK", onPress: async () => {
                        await AsyncStorage.removeItem('cart');
                        navigation.navigate("HomeScreen");
                    }
                }
            ]);
        } catch (err) {
            console.error("Lỗi thanh toán:", err);
            Alert.alert("Lỗi", "Thanh toán thất bại");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Thông tin đơn hàng</Text>

            {user && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Người thuê:</Text>
                    <View style={styles.userInfo}>
                        <Image
                            source={user?.avatar
                                ? { uri: `${API_BASE_URL}${user?.avatar}` }
                                : { uri: "https://i.pravatar.cc/150?img=3" }
                            }
                            style={styles.avatar}
                        />
                        <Text style={styles.name}>{user.fullname}</Text>
                    </View>
                </View>
            )}

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Sản phẩm thuê:</Text>
                {cart.vehicles.map((item, index) => {
                    const imagePath = item.vehicleId?.image || item.vehicleId?.images?.[0] || '';
                    const imageUrl = imagePath.startsWith('http') ? imagePath : `${API_BASE_URL}${imagePath}`;
                    return (
                        <View key={index} style={styles.vehicleItem}>
                            <Image source={{ uri: imageUrl }} style={styles.vehicleImage} />
                            <View style={styles.vehicleInfo}>
                                <Text style={styles.vehicleName}>{item.vehicleId.name}</Text>
                                <Text>Giá thuê/ngày: {item.vehicleId.rentalPricePerDay.toLocaleString()} VND</Text>
                                <Text>Số lượng: {item.quantity}</Text>
                            </View>
                        </View>
                    );
                })}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Thời gian thuê:</Text>
                <Text>Ngày thuê: {new Date(startDate).toLocaleDateString()}</Text>
                <Text>Ngày trả: {new Date(endDate).toLocaleDateString()}</Text>
                <Text>Số ngày thuê: {rentalDays} ngày</Text>
                <Text style={styles.totalPrice}>Tổng tiền: {totalPrice.toLocaleString()} VND</Text>
            </View>

            {loading && (
                <View style={{ alignItems: 'center', marginBottom: 10 }}>
                    <ActivityIndicator size="large" color="#28a745" />
                    <Text>Đang xử lý thanh toán...</Text>
                </View>
            )}

            <Text style={styles.title}>Chọn phương thức thanh toán</Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() => handlePayment("Tiền mặt")}
                disabled={loading}
            >
                <Text style={styles.buttonText}>Thanh toán tiền mặt</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, { backgroundColor: "#007bff" }]}
                onPress={() => handlePayment("Chuyển khoản")}
                disabled={loading}
            >
                <Text style={styles.buttonText}>Chuyển khoản ngân hàng</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff'
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginVertical: 20,
        textAlign: 'center'
    },
    section: {
        marginBottom: 20
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10
    },
    name: {
        fontSize: 16
    },
    vehicleItem: {
        flexDirection: 'row',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingBottom: 10
    },
    vehicleImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 10
    },
    vehicleInfo: {
        flex: 1
    },
    vehicleName: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    totalPrice: {
        marginTop: 10,
        fontWeight: 'bold',
        fontSize: 16,
        color: '#e53935'
    },
    button: {
        backgroundColor: '#28a745',
        padding: 15,
        borderRadius: 10,
        marginVertical: 10,
        alignItems: 'center'
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: "bold"
    }
});

export default PaymentScreen;
