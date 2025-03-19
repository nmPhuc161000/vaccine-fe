import { View, Text, Button, StyleSheet } from "react-native";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfileScreen = ({ setIsLoggedIn }) => {
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token"); // Xóa token khỏi AsyncStorage
      setIsLoggedIn(false); // Cập nhật trạng thái đăng xuất
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Screen</Text>
      <Button title="Đăng xuất" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default ProfileScreen;