import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    RefreshControl,
    Alert,
    ActivityIndicator
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@react-navigation/native';
import ModalDate from '../components/modalDate';
import {
    clearCart,
    getCartByUserId,
    removeVehicleFromCart,
    updateVehicleQuantity
} from '../redux/slices/cartSlice';
import ItemCart from '../components/item_cart_product';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CartScreen = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { colors } = useTheme();

    const cart = useSelector(state => state.cart.cart);
    const status = useSelector(state => state.cart.status);

    const [refreshing, setRefreshing] = useState(false);
    const [showModalDate, setShowModalDate] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [selectedVehicles, setSelectedVehicles] = useState([]);

    const getUserId = useCallback(async () => {
        try {
            const userData = await AsyncStorage.getItem("user");
            const user = JSON.parse(userData);
            return user?.id || null;
        } catch (err) {
            console.error("Lỗi khi lấy userId:", err);
            return null;
        }
    }, []);

    const fetchCartData = useCallback(async () => {
        const userId = await getUserId();
        if (userId) {
            dispatch(getCartByUserId(userId));
        }
    }, [dispatch, getUserId]);

    useEffect(() => {
        fetchCartData();
    }, [fetchCartData]);

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchCartData();
        setRefreshing(false);
    };

    const removeVehicle = useCallback(async (vehicleId) => {
        const userId = await getUserId();
        if (!vehicleId) return Alert.alert("Lỗi", "Xe không tồn tại trong giỏ hàng.");
        try {
            await dispatch(removeVehicleFromCart({ userId, vehicleId })).unwrap();
            fetchCartData();
        } catch {
            Alert.alert("Lỗi", "Không thể xoá xe khỏi giỏ hàng.");
        }
    }, [dispatch, fetchCartData, getUserId]);

    const updateQuantityHandler = useCallback(async (vehicleId, quantity) => {
        const userId = await getUserId();
        if (quantity <= 0) {
            return Alert.alert("Xác nhận", "Bạn muốn xóa xe này khỏi giỏ hàng?", [
                { text: "Huỷ" },
                { text: "Xoá", onPress: () => removeVehicle(vehicleId) }
            ]);
        }

        try {
            const currentVehicle = cart?.vehicles?.find(item => item?.vehicleId?._id === vehicleId);
            if (currentVehicle && currentVehicle.quantity !== quantity) {
                await dispatch(updateVehicleQuantity({ userId, vehicleId, quantity })).unwrap();
                fetchCartData();
            }
        } catch {
            Alert.alert("Lỗi", "Số lượng loại xe trong kho không đủ.");
        }
    }, [cart?.vehicles, dispatch, fetchCartData, getUserId, removeVehicle]);

    const calculateRentalDays = (startDate, endDate) => {
        if (!startDate || !endDate) return 0;

        const start = new Date(startDate);
        const end = new Date(endDate);

        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);

        const diff = end - start;
        return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
    };

    const rentalDays = calculateRentalDays(startDate, endDate);

    const selectedCartItems = cart?.vehicles?.filter(item =>
        selectedVehicles.includes(item?.vehicleId?._id)
    );

    const totalPrice = selectedCartItems?.reduce((sum, item) => {
        const pricePerDay = item?.vehicleId?.rentalPricePerDay || 0;
        const quantity = item.quantity || 0;
        return sum + pricePerDay * quantity * (rentalDays || 1);
    }, 0) || 0;

    const navigateToPaymentScreen = () => {
        if (selectedCartItems.length === 0) {
            Alert.alert("Thông báo", "Vui lòng chọn ít nhất 1 xe để thanh toán.");
            return;
        }

        navigation.navigate('Payment', {
            cart: { ...cart, vehicles: selectedCartItems },
            startDate,
            endDate,
            rentalDays,
            totalPrice,
            selectedVehicles: selectedVehicles,
        });
    };

    const toggleVehicleSelection = (vehicleId) => {
        setSelectedVehicles(prev => {
            if (prev.includes(vehicleId)) {
                return prev.filter(id => id !== vehicleId);
            } else {
                return [...prev, vehicleId];
            }
        });
    };

    const handleClearCart = useCallback(async () => {
        const userId = await getUserId();
        if (!userId) return;

        Alert.alert("Xác nhận", "Bạn muốn xoá toàn bộ giỏ hàng?", [
            { text: "Huỷ" },
            {
                text: "Xoá",
                onPress: async () => {
                    try {
                        await dispatch(clearCart(userId)).unwrap();
                        fetchCartData();
                    } catch {
                        Alert.alert("Lỗi", "Không thể xoá giỏ hàng.");
                    }
                }
            }
        ]);
    }, [dispatch, getUserId, fetchCartData]);

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <Text style={[styles.title, { color: colors.text }]}>Giỏ Hàng</Text>
                <TouchableOpacity onPress={handleClearCart}>
                    <Icon name="delete-sweep" size={28} color={colors.text} />
                </TouchableOpacity>
            </View>

            {status === 'loading' ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <>
                    <FlatList
                        data={cart?.vehicles || []}
                        renderItem={({ item }) => (
                            <ItemCart
                                item={item}
                                onRemove={() => removeVehicle(item?.vehicleId?._id)}
                                onQuantityChange={(qty) => updateQuantityHandler(item?.vehicleId?._id, qty)}
                                isSelected={selectedVehicles.includes(item?.vehicleId?._id)}
                                onSelect={() => toggleVehicleSelection(item?.vehicleId?._id)}
                            />
                        )}
                        keyExtractor={(item, index) =>
                            item?.vehicleId?._id?.toString() || `item-${index}`
                        }
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Icon name="remove-shopping-cart" size={100} color="gray" />
                                <Text style={styles.emptyText}>Giỏ hàng của bạn đang trống.</Text>
                            </View>
                        }
                    />

                    {startDate && endDate && (
                        <Text style={{ color: colors.text, marginVertical: 5 }}>
                            Ngày thuê: {new Date(startDate).toLocaleDateString('vi-VN')} - {new Date(endDate).toLocaleDateString('vi-VN')} ({rentalDays} ngày)
                        </Text>
                    )}

                    <Text style={[styles.total, { color: colors.text }]}>
                        Tổng cộng: {totalPrice.toLocaleString()} VND
                    </Text>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => setShowModalDate(true)}
                    >
                        <Text style={styles.buttonText}>Chọn ngày thuê</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: startDate && endDate ? '#4CAF50' : '#9E9E9E' }]}
                        onPress={navigateToPaymentScreen}
                        disabled={!startDate || !endDate}
                    >
                        <Text style={styles.buttonText}>Thanh toán</Text>
                    </TouchableOpacity>

                    <ModalDate
                        isVisible={showModalDate}
                        onClose={() => setShowModalDate(false)}
                        onConfirm={({ startDate, endDate }) => {
                            setStartDate(startDate);
                            setEndDate(endDate);
                        }}
                    />
                </>
            )}
        </View>
    );
};

const styles = {
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    total: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60,
    },
    emptyText: {
        marginTop: 10,
        fontSize: 16,
        color: '#888',
    },
};

export default CartScreen;
