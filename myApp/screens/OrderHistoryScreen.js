import React, { useEffect, useState } from 'react';
import {
    View,
    FlatList,
    ActivityIndicator,
    Alert,
    StyleSheet
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import API_BASE_URL from '../localhost/localhost';
import ItemOrder from '../components/itemOrder';
import Header from '../components/header';

const OrderHistoryScreen = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const userData = await AsyncStorage.getItem("user");
                const parsedUser = JSON.parse(userData);
                const res = await axios.get(`${API_BASE_URL}/api/orders/getOrderById/${parsedUser.id}`);
                setOrders(res.data);
            } catch (err) {
                console.error("Lỗi lấy đơn hàng:", err);
                Alert.alert("Lỗi", "Không thể lấy đơn hàng");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleCancelOrder = async (orderId) => {
        try {
            const res = await axios.put(`${API_BASE_URL}/api/orders/cancel/${orderId}`);
            Alert.alert("Thành công", res.data.message);
            setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: 'Đã hủy' } : o));
        } catch (err) {
            Alert.alert("Lỗi", err.response?.data?.message || "Không thể hủy đơn hàng");
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 40 }} />;
    }

    return (
        <View>
            <Header hideIcon={false} hideUser={true} title={"History"} />
            <FlatList
                data={orders}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <ItemOrder item={item} onCancel={handleCancelOrder} />
                )}
                contentContainerStyle={{ padding: 20 }}
            />
        </View>
    );
};

export default OrderHistoryScreen;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20
    },
    orderItem: {
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 15,
        backgroundColor: '#f9f9f9'
    },
    orderTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10
    },
    vehicleItem: {
        flexDirection: 'row',
        marginBottom: 10
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 6,
        marginRight: 10
    },
    name: {
        fontWeight: 'bold'
    },
    total: {
        marginTop: 10,
        fontWeight: 'bold',
        color: '#e53935'
    },
    status: {
        marginTop: 5,
        fontStyle: 'italic',
        color: '#333'
    },
    cancelBtn: {
        marginTop: 10,
        backgroundColor: '#dc3545',
        paddingVertical: 8,
        borderRadius: 8
    },
    cancelText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold'
    }
});
