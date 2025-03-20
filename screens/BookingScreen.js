import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity } from "react-native";
import apiConfig from "../config/apiConfig";

const BookingScreen = ({ route, navigation }) => {
  const { vaccineId } = route.params || {}; // Get vaccineId from navigation params
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Placeholder static data (remove or replace with real API data)
  const staticAppointments = [
    {
      childId: "64f1b2c8e4b0f5a3d4f5e6a7",
      vaccineId: "67d988624d312ec0ddfad3d3",
      date: "2023-10-15T09:00:00Z",
    },
    {
      childId: "64f1b2c8e4b0f5a3d4f5e6a7",
      vaccineId: "67d988624d312ec0ddfad3d2",
      date: "2023-10-15T09:00:00Z",
    },
    {
      childId: "64f1b2c8e4b0f5a3d4f5e6a7",
      vaccineId: "67d988624d312ec0ddfad3d1",
      date: "2023-10-15T09:00:00Z",
    },
  ];

  // Uncomment and implement this if you have an API endpoint for fetching appointments
  /*
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await apiConfig.getAppointments(); // Replace with your actual API call
      if (!Array.isArray(data)) throw new Error("Dữ liệu lịch hẹn không hợp lệ");
      setAppointments(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);
  */

  // For now, use static data and append the new vaccineId if provided
  useEffect(() => {
    setAppointments(staticAppointments); // Load static data initially
    if (vaccineId) {
      // Simulate adding a new appointment (replace with actual booking logic later)
      const newAppointment = {
        childId: "64f1b2c8e4b0f5a3d4f5e6a7", // Placeholder, replace with real child ID
        vaccineId: vaccineId,
        date: new Date().toISOString(), // Current date as placeholder
      };
      setAppointments((prev) => [...prev, newAppointment]);
    }
  }, [vaccineId]);

  const renderAppointmentItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.label}>Vaccine ID</Text>
        <Text style={styles.label}>Trẻ ID</Text>
        <Text style={styles.label}>Thời gian tiêm</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.value}>{item.vaccineId}</Text>
        <Text style={styles.value}>{item.childId}</Text>
        <Text style={styles.value}>{new Date(item.date).toLocaleString()}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đặt Lịch Tiêm Phòng</Text>
      {vaccineId && (
        <Text style={styles.subtitle}>Đặt lịch cho Vaccine ID: {vaccineId}</Text>
      )}
      {loading ? (
        <ActivityIndicator size="large" color="#FF6F61" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          data={appointments}
          keyExtractor={(item) => `${item.childId}-${item.vaccineId}`}
          renderItem={renderAppointmentItem}
          ListEmptyComponent={<Text>Chưa có lịch hẹn nào.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    backgroundColor: '#FFF5F1', // Match theme from HomeScreen/VacxinList
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6F61',
    textAlign: 'center',
    marginVertical: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  card: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: '#FFD1DC',
    padding: 24,
    borderRadius: 20,
    elevation: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6F61',
    flex: 1,
    textAlign: 'center',
  },
  value: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    textAlign: 'center',
  },
  error: {
    fontSize: 16,
    color: '#FF6F61',
    textAlign: 'center',
    marginVertical: 16,
  },
});

export default BookingScreen;