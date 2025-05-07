import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Alert
} from 'react-native';
import API_BASE_URL from '../localhost/localhost'; 
import axios from 'axios';

const ItemOrder = ({ item, onCancel }) => {
    const handleCancel = () => {
        Alert.alert(
            "Xác nhận hủy",
            "Bạn có chắc muốn hủy đơn hàng này?",
            [
                { text: "Không" },
                {
                    text: "Có",
                    onPress: () => onCancel(item._id)
                }
            ]
        );
    };

    return (
        <View style={styles.orderItem}>
            <Text style={styles.orderTitle}>Đơn hàng - {new Date(item.createdAt).toLocaleDateString()}</Text>
            {item.vehicles.map((v, index) => {
                const imageUrl = v.image?.startsWith('http') ? v.image : `${API_BASE_URL}${v.image}`;
                console.log(imageUrl)

                return (
                    <View key={index} style={styles.vehicleItem}>
                        <Image
                            source={{ uri: imageUrl }}
                            style={styles.image}
                        />
                        <View>
                            <Text style={styles.name}>{v.name}</Text>
                            <Text>Số lượng: {v.quantity}</Text>
                            <Text>Giá thuê/ngày: {v.rentalPricePerDay.toLocaleString()} VND</Text>
                        </View>
                    </View>
                );
            })}
            <Text>Địa chỉ nhận xe: 116 Nguyễn Huy Tưởng, Liên Chiểu, Đà Nẵng</Text>
            <Text>Ngày thuê: {new Date(item.rentalStartDate).toLocaleDateString()}</Text>
            <Text>Ngày trả: {new Date(item.rentalEndDate).toLocaleDateString()}</Text>
            <Text>Trạng thái thanh toán:<Text style={{ color: item.paymentStatus === "Đã thanh toán" ? 'green' : 'red' }}>{item.paymentStatus}</Text> </Text>
            <Text style={styles.status}>Trạng thái: {item.status}</Text>
            <Text style={styles.total}>Tổng: {item.totalPrice.toLocaleString()} VND</Text>

            {item.status === 'Chờ nhận xe' && (
                <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={handleCancel}
                >
                    <Text style={styles.cancelText}>Hủy đơn hàng</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

export default ItemOrder;

const styles = StyleSheet.create({
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
