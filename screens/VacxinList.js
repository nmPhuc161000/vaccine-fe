import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import apiConfig from '../config/apiConfig';

const ITEMS_PER_PAGE = 6; // 6 items per page

const VacxinList = ({ navigation }) => {
  const [vaccines, setVaccines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // For bottom refresh
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasRefreshedAtBottom, setHasRefreshedAtBottom] = useState(false); // Flag to limit refresh

  const fetchVaccines = useCallback(async () => {
    try {
      const data = await apiConfig.getVaccines();
      console.log("Data from API:", data);
      if (!Array.isArray(data)) {
        throw new Error("Dữ liệu vaccine không hợp lệ");
      }
      setVaccines(data);
      setLoading(false);
      setRefreshing(false);
    } catch (err) {
      console.error("Error fetching vaccines:", err);
      setError(err.message);
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchVaccines();
  }, [fetchVaccines]);

  // Handle refresh when scrolling to the bottom (only once)
  const handleEndReached = useCallback(() => {
    if (!refreshing && !hasRefreshedAtBottom) {
      setRefreshing(true);
      setHasRefreshedAtBottom(true); // Mark as refreshed
      fetchVaccines();
    }
  }, [refreshing, hasRefreshedAtBottom, fetchVaccines]);

  // Reset the refresh flag when scrolling away from the bottom
  const handleScroll = useCallback((event) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const isNearTop = contentOffset.y < 50; // Reset when scrolled near the top
    if (isNearTop && hasRefreshedAtBottom) {
      setHasRefreshedAtBottom(false); // Allow refresh again when user scrolls back to bottom
    }
  }, [hasRefreshedAtBottom]);

  // Calculate paginated data
  const totalPages = Math.ceil(vaccines.length / ITEMS_PER_PAGE);
  const paginatedVaccines = vaccines.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const renderVaccineItem = ({ item, index }) => {
    if (!item || !item._id) {
      console.error("Invalid item:", item);
      return null;
    }
    return (
      <Animated.View entering={FadeInUp.delay(index * 100).duration(500)}>
        <TouchableOpacity
          style={styles.vaccineItem}
          onPress={() => navigation.navigate('DetailScreen', { id: item._id })}
        >
          <Image
            source={{ uri: item.image || 'https://via.placeholder.com/80' }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.textContainer}>
            <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.description} numberOfLines={2}>
              {item.description || 'Không có mô tả'}
            </Text>
            <View style={styles.infoColumn}>
              <Text style={styles.ageRange}>Tuổi: {item.ageRange || 'N/A'}</Text>
              <Text style={styles.price}>
                {item.price ? item.price.toLocaleString() : 'Liên hệ'} VND
              </Text>
            </View>
            <TouchableOpacity
              style={styles.bookButton}
              onPress={() =>
                navigation.navigate('Home', {
                  screen: 'Booking',
                  params: { vaccineId: item._id },
                })
              }
            >
              <Text style={styles.bookButtonText}>Đặt lịch</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderHeader = () => (
    <Animated.View entering={FadeInDown.duration(600)} style={styles.headerContainer}>
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>Vaccine Cho Bé</Text>
        <Text style={styles.headerSubtitle}>
          Giữ bé yêu khỏe mạnh với các vaccine an toàn nhất!
        </Text>
        <TouchableOpacity style={styles.searchButton}>
          <MaterialIcons name="search" size={24} color="#fff" />
          <Text style={styles.searchButtonText}>Tìm vaccine cho bé</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const renderFooter = () => (
    <View style={styles.footerContainer}>
      <View style={styles.paginationContainer}>
        <TouchableOpacity
          style={[styles.pageButton, currentPage === 1 && styles.disabledButton]}
          onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <MaterialIcons name="chevron-left" size={24} color={currentPage === 1 ? '#ccc' : '#FF6F61'} />
        </TouchableOpacity>
        <Text style={styles.pageText}>
          Trang {currentPage} / {totalPages}
        </Text>
        <TouchableOpacity
          style={[styles.pageButton, currentPage === totalPages && styles.disabledButton]}
          onPress={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          <MaterialIcons name="chevron-right" size={24} color={currentPage === totalPages ? '#ccc' : '#FF6F61'} />
        </TouchableOpacity>
      </View>
      {refreshing && (
        <ActivityIndicator size="small" color="#FF6F61" style={styles.refreshIndicator} />
      )}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6F61" />
        <Text style={styles.loadingText}>Đang tải danh sách vaccine...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={48} color="#FF6F61" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchVaccines}>
          <Text style={styles.retryButtonText}>Thử lại</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!Array.isArray(vaccines)) {
    console.error("Vaccines is not an array:", vaccines);
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Dữ liệu vaccine không hợp lệ</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={paginatedVaccines}
        renderItem={renderVaccineItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.1} // Trigger when 10% from bottom
        onScroll={handleScroll} // Detect scroll position to reset flag
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F1',
  },
  headerContainer: {
    backgroundColor: '#FF9AA2',
    padding: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFB3BA',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    gap: 10,
    elevation: 2,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  list: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 20,
  },
  vaccineItem: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#FFD1DC',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#FF9AA2',
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF6F61',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
    lineHeight: 16,
  },
  infoColumn: {
    flexDirection: 'column',
    marginBottom: 6,
  },
  price: {
    fontSize: 14,
    color: '#FFB3BA',
    fontWeight: 'bold',
    marginTop: 2,
  },
  ageRange: {
    fontSize: 12,
    color: '#888',
    fontWeight: '500',
  },
  bookButton: {
    backgroundColor: '#FF9AA2',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
    elevation: 2,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF5F1',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#FF6F61',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF5F1',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF6F61',
    textAlign: 'center',
    marginVertical: 16,
  },
  retryButton: {
    backgroundColor: '#FF9AA2',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    elevation: 2,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerContainer: {
    alignItems: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  pageButton: {
    padding: 8,
    marginHorizontal: 16,
  },
  disabledButton: {
    opacity: 0.5,
  },
  pageText: {
    fontSize: 16,
    color: '#FF6F61',
    fontWeight: '600',
  },
  refreshIndicator: {
    marginTop: 8,
  },
});

export default VacxinList;