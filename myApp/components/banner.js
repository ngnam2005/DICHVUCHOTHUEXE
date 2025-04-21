import React, { useRef, useEffect, useState } from "react";
import { View, Image, ScrollView, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const images = [
    "https://cdn.pixabay.com/photo/2020/05/17/10/35/scooter-5180947_1280.jpg",
    "https://cdn.pixabay.com/photo/2020/07/24/07/16/motorcycle-5433115_1280.jpg",
    "https://cdn.pixabay.com/photo/2019/07/18/18/17/roller-4346984_1280.jpg",
];

const Banner = () => {
    const scrollViewRef = useRef(null);
    const scrollX = useRef(0);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            if (scrollViewRef.current) {
                const nextIndex = (currentIndex + 1) % images.length;
                scrollX.current = nextIndex * width;
                scrollViewRef.current.scrollTo({ x: scrollX.current, animated: true });
                setCurrentIndex(nextIndex);
            }
        }, 2000);
        return () => clearInterval(interval);
    }, [currentIndex]);

    return (
        <View style={styles.container}>
            <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                style={styles.scrollView}
                onMomentumScrollEnd={(event) => {
                    const index = Math.round(event.nativeEvent.contentOffset.x / width);
                    setCurrentIndex(index);
                }}
            >
                {images.map((image, index) => (
                    <View key={index} style={styles.imageContainer}>
                        <Image source={{ uri: image }} style={styles.image} />
                    </View>
                ))}
            </ScrollView>
            <View style={styles.indicatorContainer}>
                {images.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.indicator,
                            currentIndex === index ? styles.activeIndicator : {},
                        ]}
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 150,
    },
    scrollView: {
        width: width,
    },
    imageContainer: {
        width: width - 20,
        height: 150,
        borderRadius: 15,
        overflow: "hidden",
        marginHorizontal: 10,
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    indicatorContainer: {
        flexDirection: "row",
        position: "absolute",
        bottom: 10,
        alignSelf: "center",
    },
    indicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#ccc",
        marginHorizontal: 5,
    },
    activeIndicator: {
        backgroundColor: "black",
        width: 10,
        height: 10,
    },
});

export default Banner;
