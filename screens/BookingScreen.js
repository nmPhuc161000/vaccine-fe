import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from "react-native";
import apiConfig from "../config/apiConfig";
import { FlatList } from "react-native-gesture-handler";

const BookingScreen = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAppointments = async () => {
    setLoading(true); // Bật loading khi bắt đầu fetch
    try {
      const data = await apiConfig.getAppointments();
      if (!Array.isArray(data)) throw new Error("Dữ liệu lịch hẹn không hợp lệ");

      setAppointments(data);
      setError(null); // Reset lỗi nếu thành công
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAppointments();
  };

  // Hàm hủy lịch hẹn
  const handleCancelAppointment = async (appointmentId) => {
    Alert.alert(
      "Xác nhận",
      "Bạn có chắc muốn hủy lịch hẹn này?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Đồng ý",
          onPress: async () => {
            try {
              await apiConfig.cancelAppointment(appointmentId);
              Alert.alert("Thành công", "Lịch hẹn đã được hủy!");
              fetchAppointments(); // Làm mới danh sách sau khi hủy
            } catch (err) {
              Alert.alert("Lỗi", err.message || "Hủy lịch hẹn thất bại");
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  // Hàm định dạng thời gian theo UTC
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");

    return `${day}/${month}/${year}, ${hours}:${minutes}`;
  };

  // Hàm định dạng giá tiền theo VNĐ
  const formatPrice = (price) => {
    return `${price.toLocaleString("vi-VN")} VNĐ`;
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#FF6F61" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : appointments.length === 0 ? (
        <Text style={styles.noAppointmentsText}>Bạn không có lịch tiêm phòng</Text>
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={(item) => item._id} // Sử dụng _id của appointment làm key
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.label}>Vaccine:</Text>
                <Text style={styles.value}>{item.vaccineId.name}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Giá:</Text>
                <Text style={styles.value}>{formatPrice(item.vaccineId.price)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Trẻ:</Text>
                <Text style={styles.value}>{item.childId.name}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Thời gian tiêm:</Text>
                <Text style={styles.value}>{formatDate(item.date)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Trạng thái:</Text>
                <Text style={styles.value}>{item.status}</Text>
              </View>
              {item.status === "pending" && (
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => handleCancelAppointment(item._id)}
                >
                  <Text style={styles.cancelButtonText}>Hủy lịch hẹn</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#FF6F61"]}
              tintColor="#FF6F61"
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    backgroundColor: "#FFF5F1",
  },
  card: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#FFD1DC",
    padding: 16,
    borderRadius: 20,
    elevation: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FF6F61",
  },
  value: {
    fontSize: 14,
    color: "#666",
  },
  error: {
    fontSize: 16,
    color: "#FF6F61",
    textAlign: "center",
    marginVertical: 16,
  },
  noAppointmentsText: {
    fontSize: 16,
    color: "#FF6F61",
    textAlign: "center",
    marginVertical: 16,
  },
  cancelButton: {
    backgroundColor: "#FF6F61",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignSelf: "flex-end",
    marginTop: 8,
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default BookingScreen;