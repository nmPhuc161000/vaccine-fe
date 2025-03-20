import React, { useEffect, useState } from "react"
import { View, Text, StyleSheet, ActivityIndicator, RefreshControl } from "react-native"
import apiConfig from "../config/apiConfig"
import { FlatList } from "react-native-gesture-handler"

const BookingScreen = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchAppointments = async () => {
    try {
      const data = await apiConfig.getAppointments()
      if (!Array.isArray(data)) throw new Error("Dữ liệu lịch hẹn không hợp lệ")

      setAppointments(data)
      setLoading(false)
      setRefreshing(false)
    } catch (err) {
      console.error("Error fetching vaccines:", err)
      setError(err.message)
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchAppointments()
  }, [])

  const onRefresh = () => {
    setRefreshing(true)
    fetchAppointments()
  }

  // Hàm định dạng thời gian theo UTC
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const day = String(date.getUTCDate()).padStart(2, '0') // Ngày theo UTC
    const month = String(date.getUTCMonth() + 1).padStart(2, '0') // Tháng theo UTC
    const year = date.getUTCFullYear() // Năm theo UTC
    const hours = String(date.getUTCHours()).padStart(2, '0') // Giờ theo UTC
    const minutes = String(date.getUTCMinutes()).padStart(2, '0') // Phút theo UTC

    return `${day}/${month}/${year}, ${hours}:${minutes}` // Định dạng: ngày/tháng/năm, giờ:phút
  }

  // Hàm định dạng giá tiền theo VNĐ
  const formatPrice = (price) => {
    return `${price.toLocaleString('vi-VN')} VNĐ` // Định dạng: 1,000,000 VNĐ
  }

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : appointments.length === 0 ? (
        <Text style={styles.noAppointmentsText}>Bạn không có lịch tiêm phòng</Text>
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={(item) => `${item.childId._id}-${item.vaccineId._id}`}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.label}>Vaccine:</Text>
                <Text style={styles.value}>{item.vaccineId.name}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Giá:</Text>
                <Text style={styles.value}>{formatPrice(item.vaccineId.price)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Trẻ:</Text>
                <Text style={styles.value}>{item.childId.name}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Thời gian tiêm:</Text>
                <Text style={styles.value}>{formatDate(item.date)}</Text>
              </View>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#FF6F61"]}
              tintColor="#FF6F61"
            />
          }
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    backgroundColor: '#FFF5F1',
  },
  card: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: '#FFD1DC',
    padding: 16,
    borderRadius: 20,
    elevation: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6F61',
  },
  value: {
    fontSize: 14,
    color: '#666',
  },
  error: {
    fontSize: 16,
    color: '#FF6F61',
    textAlign: 'center',
    marginVertical: 16,
  },
  noAppointmentsText: {
    fontSize: 16,
    color: '#FF6F61',
    textAlign: 'center',
    marginVertical: 16,
  },
});

export default BookingScreen;