import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
<<<<<<< HEAD
  ActivityIndicator,
} from "react-native";
import apiConfig from "../config/apiConfig"; // Import apiConfig
=======
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
>>>>>>> 3d33f86c148b75145ad9aa3654c6b8c8c8e685a2

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
<<<<<<< HEAD
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false); // Thêm state loading

  const handleRegister = async () => {
    // Kiểm tra đầu vào
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ các trường");
      return;
    }

    // Kiểm tra mật khẩu và xác nhận mật khẩu có khớp không
    if (password !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu và xác nhận mật khẩu không khớp");
      return;
    }

    setLoading(true); // Bật loading trước khi gọi API
    try {
      // Gọi API đăng ký từ apiConfig
      const response = await apiConfig.register(name, email, password);
      console.log("Register response:", response); // Debug response

      // Hiển thị thông báo thành công và điều hướng về Login
      Alert.alert(
        "Thành công",
        "Đăng ký thành công!",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("Login"), // Chuyển về màn Login
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      // Hiển thị thông báo lỗi từ API
      Alert.alert("Lỗi", error.message || "Đăng ký thất bại");
    } finally {
      setLoading(false); // Tắt loading sau khi API trả về (thành công hoặc thất bại)
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng Ký</Text>
      <TextInput
        style={styles.input}
        placeholder="Tên"
        value={name}
        onChangeText={setName}
      />
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
      <TextInput
        style={styles.input}
        placeholder="Xác nhận mật khẩu"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" /> // Hiển thị loading khi đang gọi API
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Đăng ký</Text>
        </TouchableOpacity>
      )}
=======

  const handleRegister = () => {
    if (!name || !email || !password) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ các trường");
      return;
    }
    Alert.alert("Thành công", "Đăng ký thành công!", [
      {
        text: "OK",
        onPress: () => navigation.navigate("Login"),
      },
    ]);
    // Add your registration logic here
  };

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
        <Text style={styles.title}>Đăng ký</Text>
        <Text style={styles.subtitle}>Tạo tài khoản để bắt đầu!</Text>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(200)} style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Tên"
          value={name}
          onChangeText={setName}
          placeholderTextColor="#888"
        />
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(300)} style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#888"
        />
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(400)} style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#888"
        />
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(500)}>
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Đăng ký</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(600)} style={styles.linkContainer}>
        <Text style={styles.linkText}>
          Đã có tài khoản?{" "}
          <Text
            style={styles.link}
            onPress={() => navigation.navigate("Login")}
          >
            Đăng nhập
          </Text>
        </Text>
      </Animated.View>
>>>>>>> 3d33f86c148b75145ad9aa3654c6b8c8c8e685a2
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
<<<<<<< HEAD
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
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
=======
    backgroundColor: "#FFF5F1", // Pastel background like VacxinList
    padding: 20,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FF6F61", // Bright coral like VacxinList
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 8,
    fontStyle: "italic",
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    height: 50,
    borderColor: "#FFD1DC", // Soft pink border
    borderWidth: 2,
    borderRadius: 15, // Rounded like VacxinList
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    fontSize: 14,
    color: "#333",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  button: {
    backgroundColor: "#FF9AA2", // Matching VacxinList header
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: "center",
    elevation: 2,
>>>>>>> 3d33f86c148b75145ad9aa3654c6b8c8c8e685a2
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
<<<<<<< HEAD
=======
    fontWeight: "600",
  },
  linkContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  linkText: {
    fontSize: 14,
    color: "#666",
  },
  link: {
    color: "#FFB3BA", // Lighter pink like VacxinList
>>>>>>> 3d33f86c148b75145ad9aa3654c6b8c8c8e685a2
    fontWeight: "bold",
  },
});

export default RegisterScreen;