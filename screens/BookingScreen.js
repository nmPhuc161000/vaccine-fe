import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native"
import React, { useEffect, useState } from "react"
import apiConfig from "../config/apiConfig"
import { SafeAreaView } from "react-native-safe-area-context"
import { ScrollView } from "react-native-gesture-handler"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import AsyncStorage from "@react-native-async-storage/async-storage"

const BookingScreen = () => {
  const [appointments, setAppointments] = useState([])
  const [vaccines, setVaccines] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      setError(null)

      const token = await AsyncStorage.getItem("token")
      if (!token)
        throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.")

      const data = await apiConfig.getAppointments(token)
      if (!Array.isArray(data)) {
        throw new Error("Dữ liệu lịch hẹn không hợp lệ")
      }

      setAppointments(data)
    } catch (error) {
      console.error("Lỗi hiển thị lịch hẹn:", error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchVaccines = async () => {
    try {
      const data = await apiConfig.getVaccines()
      if (!Array.isArray(data)) {
        throw new Error("Dữ liệu vaccine không hợp lệ")
      }

      setVaccines(data)
      setLoading(false)
    } catch (err) {
      console.error("Error fetching vaccines:", err)
      setError(err.message)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAppointments()
    fetchVaccines()
  }, [])

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Đang tải lịch hẹn...</Text>
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={48} color="#E74C3C" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            fetchAppointments()
            fetchVaccines()
          }}
        >
          <Text style={styles.retryButtonText}>Thử lại</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }

  const getVaccineName = (vaccineId) => {
    const vaccine = vaccines.find((v) => v._id === vaccineId)
    return vaccine ? vaccine.name : "Không xác định"
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["left", "right", "bottom"]}>
      <ScrollView contentContainerStyle={styles.container}>
        {appointments.length > 0 ? (
          appointments.map((appointment, index) => (
            <View key={index} style={styles.card}>
              <View>
                <Text style={styles.label}>Tên Trẻ</Text>
                <Text style={styles.label}>Tên Vaccine</Text>
                <Text style={styles.label}>Ngày Tiêm</Text>
              </View>

              <View>
                <Text style={styles.value}>{appointment.childId}</Text>
                <Text style={styles.value}>
                  {getVaccineName(appointment.vaccineId)}
                </Text>
                <Text style={styles.value}>
                  {new Date(appointment.date).toLocaleDateString()}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text>Không có lịch hẹn nào</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#E74C3C",
    textAlign: "center",
    marginVertical: 16,
  },
  retryButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  container: {
    gap: 8,
    margin: 8,
  },
  card: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 5,
    backgroundColor: "white",
    padding: 24,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  value: {
    color: "gray",
  },
})

export default BookingScreen
