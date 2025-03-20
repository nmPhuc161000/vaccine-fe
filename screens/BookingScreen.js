import React, { useEffect, useState } from "react"
import { View, Text, StyleSheet, ActivityIndicator } from "react-native"
import apiConfig from "../config/apiConfig"
import { FlatList } from "react-native-gesture-handler"

const BookingScreen = () => {
  const [appointments, setAppointments] = useState([
    {
      childId: "64f1b2c8e4b0f5a3d4f5e6a7",
      vaccineId: "67d988624d312ec0ddfad3d3",
      date: "2023-10-15T09:00:00Z",
    },
    {
      childId: "64f1b2c8e4b0f5a3d4f5e6a7",
      vaccineId: "67d988624d312ec0ddfad3d2",
      date: "2023-10-15T09:00:00Z",
    },
    {
      childId: "64f1b2c8e4b0f5a3d4f5e6a7",
      vaccineId: "67d988624d312ec0ddfad3d1",
      date: "2023-10-15T09:00:00Z",
    },
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // const fetchAppointments = async () => {
  //   try {
  //     const data = await apiConfig.getAppointments()
  //     if (!Array.isArray(data)) throw new Error("Dữ liệu lịch hẹn không hợp lệ")

  //     setAppointments(data)
  //     setLoading(false)
  //   } catch (err) {
  //     console.error("Error fetching vaccines:", err)
  //     setError(err.message)
  //     setLoading(false)
  //   }
  // }

  // useEffect(() => {
  //   fetchAppointments()
  // }, [])

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          data={appointments}
          keyExtractor={(item) => `${item.childId}-${item.vaccineId}`}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.label}>Vaccine ID</Text>
                <Text style={styles.label}>Trẻ ID</Text>
                <Text style={styles.label}>Thời gian tiêm</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.value}>{item.vaccineId}</Text>
                <Text style={styles.value}>{item.childId}</Text>
                <Text style={styles.value}>
                  {new Date(item.date).toLocaleString()}
                </Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 8
  },
  card: {
    flexDirection: "row",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    padding: 24,
    justifyContent: "space-between",
    borderRadius: 5
  },
  value: {
    color: "gray",
  },
})

export default BookingScreen
