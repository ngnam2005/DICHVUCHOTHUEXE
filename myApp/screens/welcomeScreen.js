import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ImageBackground, Dimensions } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, { useSharedValue, withTiming, runOnJS, Easing } from "react-native-reanimated";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { height } = Dimensions.get("window");

const WelcomeScreen = ({ navigation }) => {
    const translateY = useSharedValue(0);
    const arrowY = useSharedValue(10);
    const [nextScreen, setNextScreen] = useState(null);
    useEffect(() => {
        const animateArrow = () => {
            arrowY.value = withTiming(-10, { duration: 600, easing: Easing.linear }, () => {
                arrowY.value = withTiming(10, { duration: 600, easing: Easing.linear }, runOnJS(animateArrow));
            });
        };
        animateArrow();
        const checkRememberMe = async () => {
            try {
                const savedUser = await AsyncStorage.getItem("userData");
                setNextScreen(savedUser ? "HomeScreen" : "Auth"); // Xác định màn hình tiếp theo
            } catch (error) {
                console.error("Lỗi khi kiểm tra remember me:", error);
                setNextScreen("Auth");
            }
        };

        checkRememberMe();
    }, []);

    const swipeUpGesture = Gesture.Pan()
        .onUpdate((event) => {
            if (event.translationY < -50) {
                translateY.value = withTiming(-height, { duration: 500 });
            }
        })
        .onEnd(() => {
            if (nextScreen) {
                runOnJS(navigation.replace)(nextScreen);
            }
        });

    return (
        <GestureDetector gesture={swipeUpGesture}>
            <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
                <ImageBackground
                    source={require("../assets/welcome.jpeg")}
                    style={styles.image}
                    resizeMode="cover"
                />
                <Animated.View style={[styles.overlay]}>
                    <Text style={styles.title}>Chào Mừng Đến Với</Text>
                    <Text style={styles.highlight}>Dịch Vụ Cho Thuê Xe Đà Nẵng</Text>
                    <Text style={styles.subtitle}>Vuốt lên để tiếp tục</Text>
                    <Animated.View style={{ transform: [{ translateY: arrowY }] }}>
                        <FontAwesome name="arrow-up" size={30} color="#f9a826" />
                    </Animated.View>
                </Animated.View>
            </Animated.View>
        </GestureDetector>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9a826",
    },
    image: {
        position: "absolute",
        width: "100%",
        height: "100%",
    },
    overlay: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        height: "40%",
        backgroundColor: "#fff",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
        elevation: 5,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 4 },
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#333",
        textAlign: "center",
        marginBottom: 5,
    },
    highlight: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#f9a826",
        textAlign: "center",
        marginBottom: 15,
    },
    subtitle: {
        fontSize: 16,
        color: "#555",
        textAlign: "center",
        marginBottom: 20,
    },
});

export default WelcomeScreen;
