import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import apiConfig from "../config/apiConfig";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

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
      await AsyncStorage.setItem("token", response.token);
      setIsLoggedIn(true);

      Alert.alert("Thành công", "Đăng nhập thành công!", [
        {
          text: "OK",
          onPress: () =>
            navigation.reset({
              index: 0,
              routes: [{ name: "Home" }],
            }),
        },
      ]);
    } catch (error) {
      Alert.alert("Lỗi", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
        <Text style={styles.title}>Đăng nhập</Text>
        <Text style={styles.subtitle}>Chào mừng bạn trở lại!</Text>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(200)} style={styles.inputContainer}>
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

      <Animated.View entering={FadeInUp.delay(300)} style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#888"
        />
      </Animated.View>

      {loading ? (
        <ActivityIndicator size="large" color="#FF6F61" style={styles.loader} />
      ) : (
        <Animated.View entering={FadeInUp.delay(400)}>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Đăng nhập</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      <Animated.View entering={FadeInUp.delay(500)} style={styles.linkContainer}>
        <Text style={styles.linkText}>
          Chưa có tài khoản?{" "}
          <Text
            style={styles.link}
            onPress={() => navigation.navigate("Register")}
          >
            Đăng ký
          </Text>
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loader: {
    marginVertical: 20,
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
    fontWeight: "bold",
  },
});

export default LoginScreen;