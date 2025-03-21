import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import apiConfig from "../config/apiConfig";
import { FlatList } from "react-native-gesture-handler";

const BookingScreen = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");

  const statusOptions = [
    { label: "Tất cả", value: "all" },
    { label: "Chờ xử lý", value: "pending" },
    { label: "Đã xác nhận", value: "confirmed" },
    { label: "Hoàn thành", value: "completed" },
    { label: "Đã hủy", value: "canceled" },
  ];

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const data = await apiConfig.getAppointments();
      if (!Array.isArray(data)) throw new Error("Dữ liệu lịch hẹn không hợp lệ");

      setAppointments(data);
      filterAppointments(data, selectedStatus);
      setError(null);
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

  const filterAppointments = (data, status) => {
    if (status === "all") {
      setFilteredAppointments(data);
    } else {
      const filtered = data.filter((item) => item.status === status);
      setFilteredAppointments(filtered);
    }
  };

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
    filterAppointments(appointments, status);
  };

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
              fetchAppointments();
            } catch (err) {
              Alert.alert("Lỗi", err.message || "Hủy lịch hẹn thất bại");
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");

    return `${day}/${month}/${year}, ${hours}:${minutes}`;
  };

  const formatPrice = (price) => {
    return `${price.toLocaleString("vi-VN")} VNĐ`;
  };

  return (
    <View style={styles.container}>
      {/* Bộ lọc trạng thái */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {statusOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.filterButton,
                selectedStatus === option.value && styles.filterButtonActive,
              ]}
              onPress={() => handleStatusFilter(option.value)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedStatus === option.value && styles.filterButtonTextActive,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Nội dung chính */}
      <View style={styles.contentContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#FF6F61" />
        ) : error ? (
          <Text style={styles.error}>{error}</Text>
        ) : filteredAppointments.length === 0 ? (
          <Text style={styles.noAppointmentsText}>Không có lịch hẹn nào phù hợp</Text>
        ) : (
          <FlatList
            data={filteredAppointments}
            keyExtractor={(item) => item._id}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5F1",
  },
  filterContainer: {
    padding: 8,
    height: 60, // Giới hạn chiều cao của filter
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#FF6F61",
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center"
  },
  filterButtonActive: {
    backgroundColor: "#FF6F61",
  },
  filterButtonText: {
    fontSize: 14,
    color: "#FF6F61",
  },
  filterButtonTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  contentContainer: {
    flex: 1, // Chiếm toàn bộ không gian còn lại
    paddingHorizontal: 8,
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