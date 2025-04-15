import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Modal from 'react-native-modal';

const ModalDate = ({ isVisible, onClose, onConfirm }) => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(null); // 'start' hoặc 'end'

    const formatDate = (date) => {
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const handleConfirm = () => {
        if (startDate >= endDate) {
            alert("Ngày trả phải sau ngày nhận.");
            return;
        }
        onConfirm({ startDate, endDate });
        onClose();
    };

    return (
        <Modal isVisible={isVisible} onBackdropPress={onClose}>
            <View style={styles.modalContainer}>
                <Text style={styles.title}>Chọn ngày thuê xe</Text>

                <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => setShowPicker('start')}
                >
                    <Text>Ngày nhận: {formatDate(startDate)}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => setShowPicker('end')}
                >
                    <Text>Ngày trả: {formatDate(endDate)}</Text>
                </TouchableOpacity>

                {showPicker && (
                    <DateTimePicker
                        value={showPicker === 'start' ? startDate : endDate}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        minimumDate={new Date()}
                        onChange={(event, selectedDate) => {
                            setShowPicker(null);
                            if (selectedDate) {
                                if (showPicker === 'start') {
                                    setStartDate(selectedDate);
                                } else {
                                    setEndDate(selectedDate);
                                }
                            }
                        }}
                    />
                )}

                <View style={styles.buttonRow}>
                    <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
                        <Text style={[styles.btnText, { color: '#333' }]}>Huỷ</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleConfirm} style={styles.confirmBtn}>
                        <Text style={styles.btnText}>Xác nhận</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default ModalDate;

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    dateButton: {
        padding: 12,
        backgroundColor: '#eee',
        borderRadius: 8,
        marginBottom: 10,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    cancelBtn: {
        padding: 12,
        backgroundColor: '#ccc',
        borderRadius: 8,
        flex: 1,
        marginRight: 10,
        alignItems: 'center',
    },
    confirmBtn: {
        padding: 12,
        backgroundColor: '#4caf50',
        borderRadius: 8,
        flex: 1,
        marginLeft: 10,
        alignItems: 'center',
    },
    btnText: {
        fontWeight: 'bold',
        color: '#fff',
    },
});
