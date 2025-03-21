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
  const [time, setTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingChildren, setIsFetchingChildren] = useState(false);

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

  // Hàm tính số ngày tối đa trong tháng
  const getMaxDaysInMonth = (month, year) => {
    if (!month || !year) return 31;
    const m = parseInt(month, 10);
    const y = parseInt(year, 10);
    if (m === 2) {
      const isLeapYear = (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0);
      return isLeapYear ? 29 : 28;
    }
    return [4, 6, 9, 11].includes(m) ? 30 : 31;
  };

  // Hàm định dạng và validate ngày
  const handleDateChange = (text) => {
    // Nếu người dùng xóa, cho phép xóa toàn bộ chuỗi
    if (text.length < date.length) {
      setDate(text);
      return;
    }

    let formattedText = text.replace(/[^0-9]/g, ""); // Chỉ giữ số khi nhập mới

    if (formattedText.length <= 2) {
      if (parseInt(formattedText, 10) > 31) return;
    } else if (formattedText.length <= 4) {
      const month = formattedText.slice(2, 4);
      if (parseInt(month, 10) > 12) return;
    } else if (formattedText.length > 4) {
      const day = formattedText.slice(0, 2);
      const month = formattedText.slice(2, 4);
      const year = formattedText.slice(4, 8);
      const maxDays = getMaxDaysInMonth(month, year);
      if (parseInt(day, 10) > maxDays) return;
    }

    // Tự động thêm "/"
    if (formattedText.length >= 2 && text.charAt(2) !== "/") {
      formattedText = formattedText.slice(0, 2) + "/" + formattedText.slice(2);
    }
    if (formattedText.length >= 5 && text.charAt(5) !== "/") {
      formattedText = formattedText.slice(0, 5) + "/" + formattedText.slice(5);
    }
    if (formattedText.length > 10) {
      formattedText = formattedText.slice(0, 10);
    }
    setDate(formattedText);
  };

  // Hàm định dạng và validate giờ
  const handleTimeChange = (text) => {
    // Nếu người dùng xóa, cho phép xóa toàn bộ chuỗi
    if (text.length < time.length) {
      setTime(text);
      return;
    }

    let formattedText = text.replace(/[^0-9]/g, ""); // Chỉ giữ số khi nhập mới

    if (formattedText.length <= 2) {
      if (parseInt(formattedText, 10) > 23) return;
    } else if (formattedText.length > 2) {
      const minutes = formattedText.slice(2, 4);
      if (parseInt(minutes, 10) > 59) return;
    }

    // Tự động thêm ":"
    if (formattedText.length >= 2 && text.charAt(2) !== ":") {
      formattedText = formattedText.slice(0, 2) + ":" + formattedText.slice(2);
    }
    if (formattedText.length > 5) {
      formattedText = formattedText.slice(0, 5);
    }
    setTime(formattedText);
  };

  const handleBookAppointment = async () => {
    if (!selectedChild || !vaccineId || !date || !time) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    const datePattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(\d{4})$/;
    if (!datePattern.test(date)) {
      Alert.alert("Lỗi", "Vui lòng nhập ngày theo định dạng DD/MM/YYYY.");
      return;
    }

    const timePattern = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timePattern.test(time)) {
      Alert.alert("Lỗi", "Vui lòng nhập giờ theo định dạng HH:MM (24h).");
      return;
    }

    const [hours, minutes] = time.split(":").map(Number);
    if (hours < 8 || hours > 17 || (hours === 17 && minutes > 0)) {
      Alert.alert("Lỗi", "Thời gian đặt lịch phải trong giờ làm việc (8:00 - 17:00).");
      return;
    }

    const [day, month, year] = date.split("/");
    const formattedDate = new Date(
      `${year}-${month}-${day}T${time}:00Z`
    ).toISOString();

    setIsLoading(true);
    try {
      await apiConfig.bookAppointment(selectedChild, vaccineId, formattedDate);
      Alert.alert("Thành công", "Đặt lịch hẹn thành công!", [
        {
          text: "OK",
          onPress: () => {
            navigation.popToTop();
            navigation.navigate("Booking");
          },
        },
      ]);
    } catch (error) {
      console.error("Lỗi khi đặt lịch:", error);
      Alert.alert("Lỗi", error.message || "Không thể đặt lịch hẹn.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đặt Lịch Tiêm Chủng</Text>
      <Text style={styles.subtitle}>
        Mã Vaccine: {vaccineId || "Không xác định"}
      </Text>

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
                key={`${child._id}-${child.name}`}
                label={`${child.name}`}
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
          onChangeText={handleDateChange}
          keyboardType="numeric"
          maxLength={10}
        />
      </View>

      {/* Nhập giờ tiêm */}
      <View style={styles.dateContainer}>
        <Text style={styles.label}>Nhập giờ tiêm (HH:MM):</Text>
        <TextInput
          style={styles.input}
          placeholder="HH:MM (8h - 17h)"
          value={time}
          onChangeText={handleTimeChange}
          keyboardType="numeric"
          maxLength={5}
        />
      </View>

      <Button
        title={isLoading ? "Đang xử lý..." : "Đặt lịch"}
        onPress={handleBookAppointment}
        disabled={isLoading || isFetchingChildren}
      />
    </View>
  );
};

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