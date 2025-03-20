import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const mockHistory = [
  { id: '1', vaccine: 'Vaccine A', date: '2025-03-15', status: 'Completed' },
  { id: '2', vaccine: 'Vaccine B', date: '2025-03-18', status: 'Pending' },
];

const ViewHistoryScreen = () => {
  const renderHistoryItem = ({ item }) => (
    <View style={styles.historyItem}>
      <Text style={styles.historyText}>Vaccine: {item.vaccine}</Text>
      <Text style={styles.historyText}>Ngày: {item.date}</Text>
      <Text style={styles.historyText}>Trạng thái: {item.status}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lịch Sử Đặt Lịch</Text>
      <FlatList
        data={mockHistory}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 16,
  },
  list: {
    paddingBottom: 20,
  },
  historyItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  historyText: {
    fontSize: 16,
    color: '#212121',
    marginBottom: 4,
  },
});

export default ViewHistoryScreen;