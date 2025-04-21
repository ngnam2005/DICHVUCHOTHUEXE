import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Checkbox from './checkBox';
import API_BASE_URL from '../localhost/localhost';
import { AntDesign, Feather } from '@expo/vector-icons';

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
    onPress,
}) => {
    const vehicle = item?.vehicleId;
    const imageUrl = vehicle?.images?.[0]
        ? `${API_BASE_URL}${vehicle.images[0]}`
        : 'https://via.placeholder.com/100';

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
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
                        <View style={styles.topSection}>
                            {showCheckbox ? (
                                <Checkbox
                                    label={vehicle?.name || 'Không tên'}
                                    checked={isSelected}
                                    onChange={onSelect}
                                />
                            ) : (
                                <Text style={styles.nameText}>{vehicle?.name || 'Không tên'}</Text>
                            )}
                            <Text style={styles.price}>
                                Giá thuê/ngày: {vehicle?.rentalPricePerDay?.toLocaleString()} VND
                            </Text>
                        </View>

                        <View style={styles.actions}>
                            {showQuantityControls && (
                                <View style={styles.qtyContainer}>
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
                                </View>
                            )}

                            {showRemove && (
                                <TouchableOpacity onPress={onRemove} style={styles.iconRemoveBtn}>
                                    <Feather name="trash-2" size={20} color="#fff" />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
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
    topSection: {
        marginBottom: 8,
    },
    nameText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    price: {
        fontSize: 14,
        color: '#444',
        marginTop: 4,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'nowrap',
    },
    qtyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
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
    iconRemoveBtn: {
        backgroundColor: '#e74c3c',
        padding: 8,
        borderRadius: 6,
        marginLeft: 12,
        justifyContent: 'center',
        alignItems: 'center',
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
