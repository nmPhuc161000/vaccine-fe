import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const ProfileScreen = ({ setIsLoggedIn }) => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userName = await AsyncStorage.getItem("userName");
        const userEmail = await AsyncStorage.getItem("userEmail");
        setUserData({ name: userName, email: userEmail });
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu user:", error);
      }
    };
    loadUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      setIsLoggedIn(false);
      navigation.navigate("Home");
      Alert.alert("Thành công", "Bạn đã đăng xuất thành công!");
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi đăng xuất. Vui lòng thử lại.");
    }
  };

  const handleUpdateChildProfile = () => {
    navigation.navigate("UpdateChildProfile"); // Điều hướng đến màn hình cập nhật hồ sơ trẻ em
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hồ sơ cá nhân</Text>
      </View>
      <View style={styles.profileInfo}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle-outline" size={120} color="#007AFF" />
        </View>
        <Text style={styles.userName}>{userData.name || "Người dùng"}</Text>
        <Text style={styles.userEmail}>{userData.email || "email@example.com"}</Text>
      </View>
      {/* Nút cập nhật hồ sơ trẻ em */}
      <TouchableOpacity style={styles.updateButton} onPress={handleUpdateChildProfile}>
        <Ionicons name="create-outline" size={24} color="#fff" />
        <Text style={styles.updateButtonText}>Cập nhật hồ sơ trẻ em</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color="#fff" />
        <Text style={styles.logoutButtonText}>Đăng xuất</Text>
      </TouchableOpacity>
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
  profileInfo: {
    alignItems: "center",
    marginTop: 20,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
    color: "#333",
  },
  userEmail: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  updateButton: {
    flexDirection: "row",
    backgroundColor: "#28A745",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    alignSelf: "center",
  },
  updateButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  logoutButton: {
    flexDirection: "row",
    backgroundColor: "#FF3B30",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    alignSelf: "center",
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
});

export default ProfileScreen;