import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Alert,
  ScrollView,
  FlatList,
} from "react-native";
import apiConfig from "../config/apiConfig";

const statusOptions = [
  { label: "Tất cả", value: "all" },
  { label: "Chờ xử lý", value: "pending" },
  { label: "Đã xác nhận", value: "confirmed" },
  { label: "Hoàn thành", value: "completed" },
  { label: "Đã hủy", value: "canceled" },
];

const BookingScreen = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiConfig.getAppointments();
      if (!Array.isArray(data)) throw new Error("Dữ liệu lịch hẹn không hợp lệ");
      setAppointments(data);
      filterAppointments(data, selectedStatus);
    } catch (err) {
      Alert.alert("Lỗi", err.message || "Không thể tải dữ liệu");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedStatus]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAppointments();
  };

  const filterAppointments = (data, status) => {
    setFilteredAppointments(status === "all" ? data : data.filter((item) => item.status === status));
  };

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
    filterAppointments(appointments, status);
  };

  const handleCancelAppointment = async (appointmentId) => {
    Alert.alert("Xác nhận", "Bạn có chắc muốn hủy lịch hẹn này?", [
      { text: "Hủy", style: "cancel" },
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
    ]);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price) => `${price.toLocaleString("vi-VN")} VNĐ`;

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {[
        { label: "Vaccine", value: item.vaccineId.name },
        { label: "Giá", value: formatPrice(item.vaccineId.price) },
        { label: "Trẻ", value: item.childId.name },
        { label: "Thời gian tiêm", value: formatDate(item.date) },
        { label: "Trạng thái", value: item.status },
      ].map((field, index) => (
        <View style={styles.row} key={index}>
          <Text style={styles.label}>{field.label}:</Text>
          <Text style={styles.value}>{field.value}</Text>
        </View>
      ))}
      {item.status === "pending" && (
        <TouchableOpacity style={styles.cancelButton} onPress={() => handleCancelAppointment(item._id)}>
          <Text style={styles.cancelButtonText}>Hủy lịch hẹn</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderEmptyComponent = () => {
    if (loading)
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6F61" />
        </View>
      );
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.noAppointmentsText}>Không có lịch hẹn nào phù hợp</Text>
      </View>
    );
  };

  return (
    <FlatList
      ListHeaderComponent={
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
          {statusOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[styles.filterButton, selectedStatus === option.value && styles.filterButtonActive]}
              onPress={() => handleStatusFilter(option.value)}
            >
              <Text
                style={[styles.filterButtonText, selectedStatus === option.value && styles.filterButtonTextActive]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      }
      data={filteredAppointments}
      keyExtractor={(item) => item._id}
      renderItem={renderItem}
      ListEmptyComponent={renderEmptyComponent}
      ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#FF6F61"]} />}
      contentContainerStyle={styles.flatListContent}
      style={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF5F1" },
  filterContainer: { padding: 8, height: 60 },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#FF6F61",
    marginRight: 8,
    alignItems: "center", // Căn giữa ngang
    justifyContent: "center", // Căn giữa dọc
    minWidth: 90, // Đảm bảo kích thước đồng đều
    height: 40, // Thiết lập chiều cao cố định
  },
  filterButtonActive: { backgroundColor: "#FF6F61" },
  filterButtonText: {
    fontSize: 14,
    color: "#FF6F61",
    fontWeight: "600",
    textAlign: "center", // Căn giữa văn bản
  },
  filterButtonTextActive: { color: "#fff", fontWeight: "600" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", minHeight: 200 },
  card: { backgroundColor: "white", borderWidth: 2, borderColor: "#FFD1DC", padding: 16, borderRadius: 20, elevation: 4 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  label: { fontSize: 14, fontWeight: "600", color: "#FF6F61" },
  value: { fontSize: 14, color: "#666" },
  noAppointmentsText: { fontSize: 16, color: "#FF6F61", textAlign: "center", marginVertical: 16 },
  cancelButton: { backgroundColor: "#FF6F61", paddingVertical: 8, paddingHorizontal: 16, borderRadius: 10, alignSelf: "flex-end", marginTop: 8 },
  cancelButtonText: { color: "#fff", fontSize: 14, fontWeight: "600" },
  flatListContent: { paddingHorizontal: 8, paddingBottom: 16, flexGrow: 1 },
});

export default BookingScreen;
