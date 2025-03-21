import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  Alert,
  ActivityIndicator,
  StyleSheet,
  TextInput,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import apiConfig from "../config/apiConfig";

const AddBookingScreen = ({ navigation, route }) => {
  const { vaccineId } = route.params || {};
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [date, setDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingChildren, setIsFetchingChildren] = useState(false);

  // Fetch danh sách trẻ em khi component được mount
  useEffect(() => {
    const fetchChildren = async () => {
      setIsFetchingChildren(true);
      try {
        const data = await apiConfig.getChildren();
        setChildren(data);
        if (data.length > 0) setSelectedChild(data[0]._id);
        else Alert.alert("Thông báo", "Không tìm thấy thông tin trẻ em.");
      } catch (error) {
        Alert.alert("Lỗi", "Không thể tải danh sách trẻ em.");
        console.error("Lỗi khi tải danh sách trẻ em:", error);
      }
      setIsFetchingChildren(false);
    };
    fetchChildren();
  }, []);

  // Xử lý đặt lịch hẹn
  const handleBookAppointment = async () => {
    if (!selectedChild || !vaccineId || !date) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    // Kiểm tra định dạng ngày
    const datePattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(\d{4})$/;
    if (!datePattern.test(date)) {
      Alert.alert("Lỗi", "Vui lòng nhập ngày theo định dạng DD/MM/YYYY.");
      return;
    }

    // Chuyển đổi ngày sang định dạng ISO
    const [day, month, year] = date.split("/");
    const formattedDate = new Date(
      `${year}-${month}-${day}T09:00:00Z`
    ).toISOString();

    setIsLoading(true);
    try {
      // Gọi API đặt lịch hẹn
      await apiConfig.bookAppointment(selectedChild, vaccineId, formattedDate);
      Alert.alert("Thành công", "Đặt lịch hẹn thành công!", [
        {
          text: "OK",
          onPress: () => {
            navigation.popToTop(); // Quay về màn hình đầu tiên trong stack
            navigation.navigate("Booking"); // Chuyển đến màn hình Booking
          },
        },
      ]);
    } catch (error) {
      // Hiển thị thông báo lỗi chi tiết
      console.error("Lỗi khi đặt lịch:", error);
      Alert.alert("Lỗi", error.message || "Không thể đặt lịch hẹn.");
    } finally {
      setIsLoading(false); // Dừng loading dù có lỗi hay không
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đặt Lịch Tiêm Chủng</Text>
      <Text style={styles.subtitle}>
        Mã Vaccine: {vaccineId || "Không xác định"}
      </Text>

      {/* Hiển thị danh sách trẻ em */}
      {isFetchingChildren ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : children.length === 0 ? (
        <Text style={styles.errorText}>Không có dữ liệu trẻ em</Text>
      ) : (
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Chọn trẻ:</Text>
          <Picker
            selectedValue={selectedChild}
            onValueChange={setSelectedChild}
            style={styles.picker}
          >
            {children.map((child) => (
              <Picker.Item
                key={`${child._id}-${child.name}`} // Đảm bảo key là duy nhất
                label={`${child.name} (${child.dateOfBirth || "N/A"})`}
                value={child._id}
              />
            ))}
          </Picker>
        </View>
      )}

      {/* Nhập ngày tiêm */}
      <View style={styles.dateContainer}>
        <Text style={styles.label}>Nhập ngày tiêm (DD/MM/YYYY):</Text>
        <TextInput
          style={styles.input}
          placeholder="DD/MM/YYYY"
          value={date}
          onChangeText={setDate}
          keyboardType="numeric"
          maxLength={10}
        />
      </View>

      {/* Nút đặt lịch */}
      <Button
        title={isLoading ? "Đang xử lý..." : "Đặt lịch"}
        onPress={handleBookAppointment}
        disabled={isLoading || isFetchingChildren}
      />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 16, marginBottom: 20 },
  label: { fontSize: 16, marginBottom: 5 },
  pickerContainer: { marginBottom: 20 },
  picker: { height: 50, width: "100%" },
  dateContainer: { marginBottom: 20 },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  errorText: { color: "red", textAlign: "center" },
});

export default AddBookingScreen;