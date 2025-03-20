import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const UpdateChildProfileScreen = ({ navigation }) => {
  const [childName, setChildName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");

  const handleSave = async () => {
    if (!childName || !birthDate || !gender) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      const childProfile = {
        name: childName,
        birthDate: birthDate,
        gender: gender,
      };
      // Lưu thông tin hồ sơ trẻ em vào AsyncStorage
      await AsyncStorage.setItem("childProfile", JSON.stringify(childProfile));
      Alert.alert("Thành công", "Đã cập nhật hồ sơ trẻ em!", [
        {
          text: "OK",
          onPress: () => navigation.goBack(), // Quay lại ProfileScreen
        },
      ]);
    } catch (error) {
      console.error("Lỗi khi lưu hồ sơ trẻ em:", error);
      Alert.alert("Lỗi", "Không thể lưu thông tin. Vui lòng thử lại.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cập nhật hồ sơ trẻ em</Text>
      </View>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Tên trẻ"
          value={childName}
          onChangeText={setChildName}
        />
        <TextInput
          style={styles.input}
          placeholder="Ngày sinh (VD: 01/01/2020)"
          value={birthDate}
          onChangeText={setBirthDate}
        />
        <TextInput
          style={styles.input}
          placeholder="Giới tính (Nam/Nữ)"
          value={gender}
          onChangeText={setGender}
        />
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Ionicons name="save-outline" size={24} color="#fff" />
          <Text style={styles.saveButtonText}>Lưu</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#007AFF",
    paddingVertical: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  form: {
    padding: 20,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  saveButton: {
    flexDirection: "row",
    backgroundColor: "#28A745",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
});

export default UpdateChildProfileScreen;