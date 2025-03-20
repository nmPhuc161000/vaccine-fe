import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import apiConfig from "../config/apiConfig"; // Import apiConfig từ folder config

// Hàm giải mã token JWT (không cần thư viện bên ngoài)
const decodeJWT = (token) => {
  try {
    const base64Url = token.split(".")[1]; // Lấy phần payload từ token
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload); // Trả về object đã giải mã
  } catch (error) {
    console.error("Lỗi khi giải mã token:", error);
    return null;
  }
};

const LoginScreen = ({ navigation, setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const isValidEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    if (!email || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập email và mật khẩu");
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert("Lỗi", "Email không hợp lệ");
      return;
    }

    setLoading(true);
    try {
      const response = await apiConfig.login(email, password);
      const token = response.token;

      // Lưu token vào AsyncStorage
      await AsyncStorage.setItem("token", token);

      // Giải mã token để lấy thông tin user
      const decodedToken = decodeJWT(token);
      if (!decodedToken || !decodedToken.user) {
        throw new Error("Token không hợp lệ hoặc không chứa thông tin user");
      }

      const user = decodedToken.user;

      // Lưu các field của user vào AsyncStorage
      await AsyncStorage.multiSet([
        ["userId", user.id],
        ["userEmail", user.email],
        ["userName", user.name],
        ["userRole", user.role],
      ]);

      // Cập nhật trạng thái đăng nhập
      setIsLoggedIn(true);

      Alert.alert("Thành công", "Đăng nhập thành công!", [
        {
          text: "OK",
          onPress: () => {
            // Reset navigation stack và chuyển đến màn hình Home
            navigation.reset({
              index: 0,
              routes: [{ name: "Home" }],
            });
          },
        },
      ]);
    } catch (error) {
      Alert.alert("Lỗi", error.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng nhập</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Đăng nhập" onPress={handleLogin} />
      )}

      <Text
        style={styles.link}
        onPress={() => navigation.navigate("Register")}
      >
        Chưa có tài khoản? Đăng ký
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  link: {
    color: "#007AFF",
    textAlign: "center",
    marginTop: 15,
  },
});

export default LoginScreen;