import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Checkbox from './checkBox';
import API_BASE_URL from '../localhost/localhost';
import { AntDesign } from '@expo/vector-icons'; // icon trái tim

const ItemCart = ({
    item,
    isSelected,
    onSelect,
    onRemove,
    onQuantityChange,
    onToggleFavorite,
    showCheckbox = true,
    showRemove = true,
    showQuantityControls = true,
    isFavorite = false,
}) => {
    const vehicle = item?.vehicleId;
    const imageUrl = vehicle?.images?.[0]
        ? `${API_BASE_URL}${vehicle.images[0]}`
        : 'https://via.placeholder.com/100';

    return (
        <View style={styles.card}>
            {onToggleFavorite && (
                <TouchableOpacity onPress={onToggleFavorite} style={styles.heartBtn}>
                    <AntDesign
                        name={isFavorite ? 'heart' : 'hearto'}
                        size={22}
                        color={isFavorite ? 'red' : '#888'}
                    />
                </TouchableOpacity>
            )}

            <View style={styles.row}>
                <Image source={{ uri: imageUrl }} style={styles.image} />
                <View style={styles.infoContainer}>
                    <View style={styles.header}>
                        {showCheckbox ? (
                            <Checkbox
                                label={vehicle?.name || 'Không tên'}
                                checked={isSelected}
                                onChange={onSelect}
                            />
                        ) : (
                            <Text style={styles.nameText}>{vehicle?.name || 'Không tên'}</Text>
                        )}
                    </View>

                    <Text style={styles.price}>
                        Giá thuê/ngày: {vehicle?.rentalPricePerDay?.toLocaleString()} VND
                    </Text>

                    <View style={styles.actions}>
                        {showQuantityControls && (
                            <>
                                <Text style={styles.label}>Số lượng:</Text>
                                <TouchableOpacity
                                    onPress={() => onQuantityChange(item.quantity - 1)}
                                    style={styles.qtyBtn}
                                >
                                    <Text style={styles.btnText}>-</Text>
                                </TouchableOpacity>
                                <Text style={styles.qtyText}>{item.quantity}</Text>
                                <TouchableOpacity
                                    onPress={() => onQuantityChange(item.quantity + 1)}
                                    style={styles.qtyBtn}
                                >
                                    <Text style={styles.btnText}>+</Text>
                                </TouchableOpacity>
                            </>
                        )}

                        {showRemove && (
                            <TouchableOpacity onPress={onRemove} style={styles.removeBtn}>
                                <Text style={styles.removeText}>Xóa</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </View>

    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        padding: 12,
        marginHorizontal: 12,
        marginVertical: 8,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        position: 'relative',
    },
    row: {
        flexDirection: 'row',
    },
    image: {
        width: 100,
        height: 70,
        borderRadius: 8,
        marginRight: 12,
    },
    infoContainer: {
        flex: 1,
        justifyContent: 'space-between',
    },
    header: {
        marginBottom: 4,
    },
    nameText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    price: {
        fontSize: 14,
        color: '#444',
        marginBottom: 6,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    label: {
        fontSize: 14,
        marginRight: 8,
    },
    qtyBtn: {
        width: 32,
        height: 32,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
    },
    btnText: {
        fontSize: 18,
        fontWeight: '600',
    },
    qtyText: {
        marginHorizontal: 10,
        fontSize: 16,
        fontWeight: '500',
    },
    removeBtn: {
        backgroundColor: '#e74c3c',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
        marginLeft: 10,
    },
    removeText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    heartBtn: {
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 5,
        zIndex: 1,
    },
});

export default ItemCart;
