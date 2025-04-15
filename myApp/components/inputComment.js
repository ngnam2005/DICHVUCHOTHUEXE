import React, { useState, useEffect } from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    Text,
    ScrollView,
    StyleSheet,
    Alert,
    Image
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import API_BASE_URL from '../localhost/localhost';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

const InputComment = ({ vehicleId, vehicleName, onCommentSent }) => {
    const user = useSelector(state => state.auth.user); // Fetch user from Redux store
    const [content, setContent] = useState('');
    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const getPermissions = async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Permission to access media library is required!');
            }
        };

        getPermissions();
    }, []);

    const pickImages = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1
        });

        if (!result.canceled) {
            const selected = result.assets.map(asset => asset.uri);
            // Use functional setState to ensure proper state update
            setImages(prevImages => [...prevImages, ...selected]);
        }
    };

    // const uploadImages = async () => {
    //     const uploads = images.map(uri => {
    //         const formData = new FormData();
    //         formData.append("images", {
    //             uri,
    //             name: "image.jpg",  // Đảm bảo tên ảnh hợp lệ
    //             type: "image/jpeg"  // Đảm bảo kiểu ảnh chính xác
    //         });

    //         return axios.post(`${API_BASE_URL}/api/upload`, formData, {
    //             headers: { "Content-Type": "multipart/form-data" }
    //         });
    //     });

    //     try {
    //         const results = await Promise.all(uploads);
    //         return results.map(res => res.data.urls[0]); // Đảm bảo trả về URL đúng
    //     } catch (error) {
    //         Alert.alert("Lỗi", "Không thể tải ảnh lên.");
    //         console.error("Lỗi tải ảnh:", error);
    //         return [];
    //     }
    // };


    const handleSend = async () => {
        if (!content.trim()) return Alert.alert("Lỗi", "Vui lòng nhập nội dung bình luận.");

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("userId", user.id);
            formData.append("vehicleId", vehicleId);
            formData.append("content", content);

            images.forEach((uri, index) => {
                formData.append("images", {
                    uri,
                    name: `image${index}.jpg`,
                    type: "image/jpeg"
                });
            });

            const response = await axios.post(`${API_BASE_URL}/api/comments`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.status === 201) {
                setContent('');
                setImages([]);
                onCommentSent?.();
            } else {
                Alert.alert("Lỗi", "Không thể gửi bình luận.");
            }
        } catch (error) {
            Alert.alert("Không thể bình luận", "Bạn chưa thuê này bao giờ !");
            // console.error("Lỗi gửi bình luận:", error);
        } finally {
            setUploading(false);
        }
    };


    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Nhập bình luận..."
                value={content}
                onChangeText={setContent}
                multiline
                style={styles.input}
            />

            <ScrollView horizontal style={styles.imageRow}>
                {images.map((uri, idx) => (
                    <View key={idx} style={styles.imageIconContainer}>
                        <Image source={{ uri }} style={styles.imageThumbnail} />
                    </View>
                ))}
            </ScrollView>

            <View style={styles.buttons}>
                <TouchableOpacity style={styles.btn} onPress={pickImages}>
                    <Ionicons name="add-circle-outline" size={24} color="#fff" />
                    <Text style={styles.btnText}>Thêm ảnh</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.btn, { backgroundColor: "#28a745" }]}
                    onPress={handleSend}
                    disabled={uploading}
                >
                    <Text style={styles.btnText}>{uploading ? "Đang gửi..." : "Gửi"}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 12,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderColor: '#eee',
        marginTop: 10,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        minHeight: 60,
        backgroundColor: '#fafafa',
        fontSize: 14,
    },
    imageRow: {
        marginTop: 10,
        flexDirection: 'row',
    },
    imageIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 6,
        overflow: 'hidden',
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    imageThumbnail: {
        width: '100%',
        height: '100%',
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 8,
    },
    btnText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 6,
        fontSize: 14,
    },
});


export default InputComment;
