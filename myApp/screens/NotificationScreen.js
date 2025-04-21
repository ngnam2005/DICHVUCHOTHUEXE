import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_BASE_URL from '../localhost/localhost';


const NotificationScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const fetchUserId = async () => {
      const user = await AsyncStorage.getItem('user');
      if (user) {
        const parsed = JSON.parse(user);
        setUserId(parsed.id);
        fetchNotifications(parsed.id);
      }
    };
    fetchUserId();
  }, []);

  const fetchNotifications = async (userId) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/notifications/${userId}`);
      setNotifications(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`${API_BASE_URL}/api/notifications/read/${id}`);
      fetchNotifications(userId);
    } catch (err) {
      console.error(err);
    }
  };

  const showNotification = async (title, body) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
      },
      trigger: null,
    });
  };

  useEffect(() => {
    if (notifications.length > 0) {
      const unread = notifications.find((n) => !n.isRead);
      if (unread) {
        showNotification(unread.title, unread.message);
      }
    }
  }, [notifications]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.item, item.isRead ? styles.read : styles.unread]}
      onPress={() => markAsRead(item._id)}
    >
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.message}>{item.message}</Text>
      <Text style={styles.time}>{new Date(item.createdAt).toLocaleString()}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      
      <Text style={styles.header}>Thông báo</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  item: {
    padding: 14,
    marginBottom: 12,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    borderLeftWidth: 4,
  },
  unread: {
    borderLeftColor: '#007aff',
    backgroundColor: '#e6f0ff',
  },
  read: {
    borderLeftColor: '#ccc',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  message: {
    fontSize: 14,
    marginTop: 4,
  },
  time: {
    fontSize: 12,
    color: '#888',
    marginTop: 6,
  },
});
