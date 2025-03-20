import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';

const BookingScreen = () => {
  const route = useRoute();
  const { vaccineId } = route.params || {}; // Get vaccineId from navigation params

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đặt Lịch Tiêm Phòng</Text>
      {vaccineId ? (
        <Text style={styles.info}>Bạn đang đặt lịch cho vaccine ID: {vaccineId}</Text>
      ) : (
        <Text style={styles.info}>Vui lòng chọn vaccine để đặt lịch.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F2F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 16,
  },
  info: {
    fontSize: 16,
    color: '#757575',
  },
});

export default BookingScreen;