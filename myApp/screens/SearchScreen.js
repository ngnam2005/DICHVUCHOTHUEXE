import React, { useEffect, useState } from "react";
import {
    View,
    FlatList,
    Text,
    StyleSheet,
    ActivityIndicator,
    Image,
    TouchableOpacity,
} from "react-native";
import SearchBar from "../components/searchBar";
import axios from "axios";
import { useRoute, useNavigation } from "@react-navigation/native";
import API_BASE_URL from "../localhost/localhost";

const SearchScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const initialKeyword = route.params?.keyword || "";

    const [searchText, setSearchText] = useState(initialKeyword);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);

    const fetchSearchResults = async (keyword) => {
        if (!keyword.trim()) return;
        try {
            setLoading(true);
            const res = await axios.get(`${API_BASE_URL}/api/vehicles/search?name=${keyword}`);
            setResults(res.data);
        } catch (error) {
            console.error("Lỗi khi tìm kiếm xe:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateHistory = (keyword) => {
        if (!keyword.trim()) return;
        setHistory((prev) => {
            const newHistory = [keyword, ...prev.filter((k) => k !== keyword)];
            return newHistory.slice(0, 5);
        });
    };

    const handleSearch = () => {
        fetchSearchResults(searchText);
        updateHistory(searchText);
    };

    useEffect(() => {
        if (initialKeyword) {
            fetchSearchResults(initialKeyword);
        }
    }, [initialKeyword]);

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate("DetailVehicleScreen", { vehicleId: item._id })}>
            <View style={styles.card}>
                {item.images && item.images.length > 0 && (
                    <Image
                        source={{ uri: `${API_BASE_URL}${item.images[0]}` }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                )}
                <View style={styles.infoContainer}>
                    <Text style={styles.title}>{item.name}</Text>
                    <Text style={styles.text}>Hãng: {item.type?.name}</Text>
                    <Text style={styles.text}>Giá thuê/ngày: {item.rentalPricePerDay?.toLocaleString()}đ</Text>
                    <Text style={styles.text}>Số lượng: {item.quantity}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <SearchBar
                value={searchText}
                onChangeText={setSearchText}
                onSearchPress={handleSearch}
                placeholder="Nhập tên xe cần tìm..."
            />

            {history.length > 0 && (
                <View style={styles.historyContainer}>
                    <Text style={styles.historyTitle}>Lịch sử tìm kiếm:</Text>
                    {history.map((item, index) => (
                        <TouchableOpacity key={index} onPress={() => {
                            setSearchText(item);
                            fetchSearchResults(item);
                        }}>
                            <Text style={styles.historyItem}>• {item}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {loading ? (
                <ActivityIndicator size="large" color="#00aa99" style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={results}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                    ListEmptyComponent={<Text style={styles.empty}>Không tìm thấy kết quả</Text>}
                    contentContainerStyle={results.length === 0 && styles.center}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: 10,
    },
    card: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 10,
        marginHorizontal: 10,
        marginVertical: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    infoContainer: {
        flex: 1,
        marginLeft: 12,
        justifyContent: "space-around",
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    text: {
        fontSize: 14,
        color: "#555",
    },
    empty: {
        textAlign: "center",
        marginTop: 20,
        fontWeight: "bold",
        fontSize: 16,
    },
    historyContainer: {
        paddingHorizontal: 15,
        paddingBottom: 5,
    },
    historyTitle: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 5,
    },
    historyItem: {
        fontSize: 14,
        color: "#007bff",
        marginBottom: 3,
    },
    center: {
        flex: 1,
        justifyContent: "center",
    },
});

export default SearchScreen;
