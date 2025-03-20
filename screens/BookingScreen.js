import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import apiConfig from "../config/apiConfig";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from '@react-navigation/native';

const BookingScreen = () => {
  const [appointments, setAppointments] = useState([]);
  const [vaccines, setVaccines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const route = useRoute();
  const { vaccineId } = route.params || {}; // Get vaccineId from navigation params

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = await AsyncStorage.getItem("token");
      if (!token)
        throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");

      const data = await apiConfig.getAppointments(token);
      if (!Array.isArray(data)) {
        throw new Error("Dữ liệu lịch hẹn không hợp lệ");
      }

      setAppointments(data);
    } catch (error) {
      console.error("Lỗi hiển thị lịch hẹn:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Đang tải lịch hẹn...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["left", "right", "bottom"]}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Đặt Lịch Tiêm Phòng</Text>
        {vaccineId ? (
          <Text style={styles.info}>Bạn đang đặt lịch cho vaccine ID: {vaccineId}</Text>
        ) : (
          <Text style={styles.info}>Vui lòng chọn vaccine để đặt lịch.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
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
