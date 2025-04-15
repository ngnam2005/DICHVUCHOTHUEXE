import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import API_BASE_URL from '../localhost/localhost';
import { addVehicleToCart } from '../redux/slices/cartSlice';
import ModalDate from '../components/modalDate';
import InputComment from '../components/inputComment';
import ItemComment from '../components/itemComment';
import axios from 'axios';
import Header from '../components/header';

const DetailVehicleScreen = ({ navigation }) => {
    const route = useRoute();
    const { vehicleId } = route.params;
    const dispatch = useDispatch();
    const { list: vehicles } = useSelector((state) => state.vehicles);
    const vehicle = vehicles.find((v) => v._id === vehicleId);

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedDates, setSelectedDates] = useState(null);
    const [comments, setComments] = useState([]);
    const [showAllComments, setShowAllComments] = useState(false);

    useEffect(() => {
        if (!vehicle) {
            Alert.alert('Lỗi', 'Không tìm thấy xe');
        } else {
            fetchComments();
        }
    }, [vehicle]);

    const fetchComments = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/comments/${vehicleId}`);
            setComments(response.data.comments);
        } catch (error) {}
    };

    const handleAddToCart = () => {
        if (!vehicle) return;
        const vehicleData = {
            vehicleId: vehicle._id,
            name: vehicle.name,
            price: vehicle.rentalPricePerDay,
            image: vehicle.images[0],
            quantity: 1,
            rentalDates: selectedDates
        };
        dispatch(addVehicleToCart(vehicleData));
        navigation.navigate('Cart');
    };

    const handleCommentSent = () => {
        fetchComments();
    };

    return (
        <View style={{ flex: 1 }}>
            {/* Header không nằm trong ScrollView */}
            <Header title={vehicle?.name} hideUser={true} />

            {/* Nội dung cuộn */}
            <ScrollView contentContainerStyle={styles.container}>
                {vehicle?.images?.length > 0 && (
                    <Image
                        source={{ uri: `${API_BASE_URL}${vehicle.images[currentImageIndex]}` }}
                        style={styles.vehicleImage}
                    />
                )}

                {/* Ảnh nhỏ – không dùng FlatList */}
                <ScrollView horizontal style={styles.thumbnailList}>
                    {vehicle?.images?.map((item, index) => (
                        <TouchableOpacity key={index} onPress={() => setCurrentImageIndex(index)}>
                            <Image source={{ uri: `${API_BASE_URL}${item}` }} style={styles.thumbnailImage} />
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <Text style={styles.vehicleName}>{vehicle?.name}</Text>
                <Text style={styles.vehiclePrice}>{vehicle?.rentalPricePerDay?.toLocaleString()} VND/ngày</Text>
                <Text style={styles.vehicleDescription}>{vehicle?.description}</Text>

                <TouchableOpacity style={styles.btn} onPress={() => setModalVisible(true)}>
                    <Text style={styles.btnText}>Chọn ngày thuê</Text>
                </TouchableOpacity>

                <ModalDate
                    isVisible={isModalVisible}
                    onConfirm={(dates) => setSelectedDates(dates)}
                    onClose={() => setModalVisible(false)}
                />

                <TouchableOpacity style={styles.btn} onPress={handleAddToCart}>
                    <Text style={styles.btnText}>Thêm vào giỏ hàng</Text>
                </TouchableOpacity>

                {selectedDates && (
                    <TouchableOpacity
                        style={[styles.btn, { backgroundColor: '#28a745' }]}
                        onPress={() => {
                            if (!selectedDates?.startDate || !selectedDates?.endDate) {
                                Alert.alert("Lỗi", "Vui lòng chọn ngày thuê trước khi thanh toán");
                                return;
                            }

                            const startDate = selectedDates.startDate;
                            const endDate = selectedDates.endDate;

                            const start = new Date(startDate);
                            const end = new Date(endDate);
                            const rentalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
                            const totalPrice = rentalDays * vehicle.rentalPricePerDay;

                            const cart = {
                                vehicles: [
                                    {
                                        vehicleId: {
                                            _id: vehicle._id,
                                            name: vehicle.name,
                                            image: vehicle.images[0],
                                            rentalPricePerDay: vehicle.rentalPricePerDay,
                                            images: vehicle.images,
                                        },
                                        quantity: 1
                                    }
                                ]
                            };

                            navigation.navigate('Payment', {
                                cart,
                                startDate,
                                endDate,
                                rentalDays,
                                totalPrice
                            });
                        }}
                    >
                        <Text style={styles.btnText}>Thanh toán</Text>
                    </TouchableOpacity>
                )}

                <Text style={styles.sectionTitle}>Bình luận</Text>

                <InputComment
                    vehicleId={vehicleId}
                    vehicleName={vehicle?.name}
                    user={{ id: 'user123', fullname: 'Nguyễn Văn A', avatar: 'path/to/avatar.jpg' }}
                    onCommentSent={handleCommentSent}
                />

                {comments.length === 0 ? (
                    <Text style={styles.noComments}>Chưa có bình luận nào</Text>
                ) : (
                    (showAllComments ? comments : comments.slice(0, 5)).map((item) => (
                        <ItemComment key={item._id} comment={item} />
                    ))
                )}

                {comments.length > 5 && (
                    <TouchableOpacity onPress={() => setShowAllComments(!showAllComments)}>
                        <Text style={styles.showMore}>
                            {showAllComments ? 'Thu gọn' : 'Xem thêm bình luận'}
                        </Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 12,
        paddingBottom: 30,
        backgroundColor: '#f9f9f9',
    },
    vehicleImage: {
        width: '100%',
        height: 250,
        borderRadius: 10,
    },
    thumbnailList: {
        marginTop: 10,
    },
    thumbnailImage: {
        width: 60,
        height: 60,
        marginRight: 10,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    vehicleName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 15,
        color: '#333',
    },
    vehiclePrice: {
        fontSize: 18,
        color: '#28a745',
        marginTop: 5,
    },
    vehicleDescription: {
        fontSize: 15,
        color: '#555',
        marginTop: 8,
        lineHeight: 20,
    },
    btn: {
        backgroundColor: '#007bff',
        paddingVertical: 12,
        borderRadius: 8,
        marginVertical: 10,
        alignItems: 'center',
    },
    btnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 10,
        color: '#333',
    },
    noComments: {
        textAlign: 'center',
        fontSize: 15,
        color: '#888',
        marginTop: 10,
    },
    showMore: {
        textAlign: 'center',
        marginTop: 10,
        color: '#007bff',
        fontWeight: 'bold',
    }
});

export default DetailVehicleScreen;
