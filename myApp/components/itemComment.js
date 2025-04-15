import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import moment from 'moment';
import API_BASE_URL from '../localhost/localhost';


const ItemComment = ({ comment }) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={{ uri: `${API_BASE_URL}${comment.user.avatar}` }} style={styles.avatar} />
                <View style={styles.info}>
                    <Text style={styles.name}>{comment.user.name}</Text>
                    <Text style={styles.time}>
                        {moment(comment.createdAt).fromNow()} {/* ví dụ: "2 giờ trước" */}
                    </Text>
                </View>
            </View>



            {comment.images.length > 0 && (
                <ScrollView horizontal style={styles.imageRow}>
                    {comment.images.map((uri, index) => (
                        <Image key={index} source={{ uri }} style={styles.commentImage} />
                    ))}
                </ScrollView>
            )}
            <Text style={styles.content}>{comment.content}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        padding: 10,
        marginVertical: 5,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd'
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10
    },
    info: {
        flexDirection: 'column'
    },
    name: {
        fontWeight: 'bold',
        fontSize: 16
    },
    time: {
        color: '#777',
        fontSize: 12
    },
    content: {
        marginTop: 5,
        fontSize: 14,
        color: '#333'
    },
    imageRow: {
        marginTop: 10,
        flexDirection: 'row'
    },
    commentImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 10
    }
});

export default ItemComment;
