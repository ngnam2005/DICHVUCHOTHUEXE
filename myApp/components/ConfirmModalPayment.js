import React from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';

const ConfirmPayment = ({
    paymentMethod,
    cccd,
    setCccd,
    bankName,
    setBankName,
    cardNumber,
    setCardNumber,
    user,
    onConfirm,
    loading
}) => {
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0} // nếu có header, chỉnh con số này
        >
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Thông tin xác nhận:</Text>

                    <TextInput
                        placeholder="Nhập số CCCD"
                        value={cccd}
                        onChangeText={setCccd}
                        style={styles.input}
                        keyboardType="numeric"
                    />

                    {paymentMethod === 'Chuyển khoản' && (
                        <>
                            <TextInput
                                placeholder="Tên ngân hàng"
                                value={bankName}
                                onChangeText={setBankName}
                                style={styles.input}
                            />
                            <TextInput
                                placeholder="Số thẻ"
                                value={cardNumber}
                                onChangeText={setCardNumber}
                                style={styles.input}
                                keyboardType="numeric"
                            />
                            <Text style={styles.cardHolder}>
                                Tên chủ thẻ: <Text style={{ fontWeight: 'bold' }}>{user?.fullname}</Text>
                            </Text>
                        </>
                    )}

                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: '#e67e22' }]}
                        onPress={onConfirm}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>Xác nhận thanh toán</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#fff'
    },
    section: {
        marginVertical: 20
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10
    },
    button: {
        padding: 15,
        borderRadius: 10,
        marginTop: 10,
        alignItems: 'center'
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    },
    cardHolder: {
        marginTop: 10
    }
});

export default ConfirmPayment;
