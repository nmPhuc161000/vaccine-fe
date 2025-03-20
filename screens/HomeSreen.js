import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import apiConfig from '../config/apiConfig';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [vaccines, setVaccines] = useState([]);
  const [filteredVaccines, setFilteredVaccines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const headerOpacity = useSharedValue(0);

  const services = [
    { id: '1', title: 'Vaccine Trẻ Em', desc: 'Bảo vệ bé từ 0-12 tuổi', image: 'https://via.placeholder.com/300x150' },
    { id: '2', title: 'Vaccine Người Lớn', desc: 'Sức khỏe cho mọi lứa tuổi', image: 'https://via.placeholder.com/300x150' },
    { id: '3', title: 'Tư Vấn Online', desc: 'Hỗ trợ 24/7 từ chuyên gia', image: 'https://via.placeholder.com/300x150' },
  ];

  const quickActions = [
    { id: '1', title: 'Đặt Lịch Nhanh', icon: 'calendar-today', action: () => navigation.navigate('Booking') },
    { id: '2', title: 'Xem Lịch Sử', icon: 'history', action: () => console.log('View History') },
    { id: '3', title: 'Liên Hệ', icon: 'phone', action: () => console.log('Contact Support') },
  ];

  const fetchVaccines = async () => {
    try {
      const data = await apiConfig.getVaccines();
      console.log("Data from API:", data);
      if (!Array.isArray(data)) throw new Error("Dữ liệu vaccine không hợp lệ");
      setVaccines(data);
      setFilteredVaccines(data.slice(0, 3)); // Limit to 3 vaccines initially
      setLoading(false);
      headerOpacity.value = withSpring(1);
    } catch (err) {
      console.error("Error fetching vaccines:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVaccines();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredVaccines(vaccines.slice(0, 3)); // Reset to 3 vaccines when search is cleared
    } else {
      const filtered = vaccines.filter((vaccine) =>
        vaccine.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredVaccines(filtered.slice(0, 3)); // Limit filtered results to 3
    }
  };

  const renderVaccineItem = ({ item, index }) => {
    if (!item || !item._id) {
      console.error("Invalid item:", item);
      return null;
    }
    return (
      <Animated.View entering={FadeInUp.delay(index * 100).duration(500)}>
        <TouchableOpacity
          style={styles.vaccineCard}
          onPress={() => navigation.navigate('DetailScreen', { id: item._id })}
        >
          <Image
            source={{ uri: item.image || 'https://via.placeholder.com/100' }}
            style={styles.vaccineImage}
            resizeMode="cover"
          />
          <View style={styles.vaccineInfo}>
            <Text style={styles.vaccineName}>{item.name}</Text>
            <Text style={styles.vaccineDesc} numberOfLines={2}>
              {item.description || 'Không có mô tả'}
            </Text>
            <View style={styles.vaccineDetails}>
              <View style={styles.vaccineDetailsLeft}>
                <Text style={styles.vaccineAge}>Tuổi: {item.ageRange || 'N/A'}</Text>
                <Text style={styles.vaccinePrice}>
                  {item.price ? item.price.toLocaleString() : 'Liên hệ'} VND
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.bookBtn}
              onPress={() => navigation.navigate('AddBooking', { vaccineId: item._id })}
            >
              <Text style={styles.bookBtnText}>Đặt lịch</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderServiceItem = ({ item, index }) => (
    <Animated.View entering={FadeInDown.delay(index * 200).duration(600)}>
      <TouchableOpacity style={styles.serviceCard}>
        <Image source={{ uri: item.image }} style={styles.serviceImage} resizeMode="cover" />
        <View style={styles.serviceTextContainer}>
          <Text style={styles.serviceTitle}>{item.title}</Text>
          <Text style={styles.serviceDesc}>{item.desc}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderQuickAction = ({ item }) => (
    <TouchableOpacity style={styles.quickActionBtn} onPress={item.action}>
      <MaterialIcons name={item.icon} size={24} color="#FF6F61" />
      <Text style={styles.quickActionText}>{item.title}</Text>
    </TouchableOpacity>
  );

  const animatedHeaderStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: withSpring(headerOpacity.value * 20 - 20) }],
  }));

  const renderFooter = () => (
    <TouchableOpacity
      style={styles.viewMoreBtn}
      onPress={() => navigation.navigate('VacxinList')}
    >
      <Text style={styles.viewMoreText}>Xem thêm vaccine</Text>
      <MaterialIcons name="arrow-forward" size={20} color="#fff" />
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View>
      <Animated.View style={[styles.header, animatedHeaderStyle]}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Vaccine Booking</Text>
          <TouchableOpacity style={styles.profileBtn}>
            <MaterialIcons name="person" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSubtitle}>Bảo vệ sức khỏe gia đình bạn với dịch vụ tiêm phòng tốt nhất!</Text>
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color="#757575" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm vaccine hoặc dịch vụ..."
            value={searchQuery}
            onChangeText={handleSearch}
            placeholderTextColor="#757575"
          />
        </View>
      </Animated.View>
      <Animated.View entering={FadeInDown.duration(600).delay(200)}>
        <Text style={styles.sectionTitle}>Dịch Vụ Nổi Bật</Text>
        <FlatList
          data={services}
          renderItem={renderServiceItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.serviceList}
          snapToInterval={SCREEN_WIDTH * 0.8 + 16}
          decelerationRate="fast"
        />
      </Animated.View>
      <Animated.View entering={FadeInDown.duration(600).delay(400)} style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Hành Động Nhanh</Text>
        <FlatList
          data={quickActions}
          renderItem={renderQuickAction}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickActionList}
        />
      </Animated.View>
      <Text style={styles.sectionTitle}>Danh Sách Vaccine</Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <View style={styles.customLoader}>
          <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={48} color="#FF6F61" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={fetchVaccines}>
          <Text style={styles.retryBtnText}>Thử lại</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredVaccines}
        renderItem={renderVaccineItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F1', // Soft pastel background
  },
  header: {
    backgroundColor: '#FF9AA2', // Playful pinkish-red
    padding: 20,
    paddingTop: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 4,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  profileBtn: {
    padding: 8,
    backgroundColor: '#FFB3BA', // Lighter pink
    borderRadius: 20,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 10,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#212121',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6F61', // Coral for a playful touch
    marginLeft: 16,
    marginTop: 20,
    marginBottom: 12,
  },
  serviceList: {
    paddingHorizontal: 16,
  },
  serviceCard: {
    width: SCREEN_WIDTH * 0.8,
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#FFD1DC', // Soft pink border
  },
  serviceImage: {
    width: '100%',
    height: 150,
  },
  serviceTextContainer: {
    padding: 16,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF6F61', // Matching section title
    marginBottom: 4,
  },
  serviceDesc: {
    fontSize: 14,
    color: '#666',
  },
  quickActions: {
    marginBottom: 20,
  },
  quickActionList: {
    paddingHorizontal: 16,
  },
  quickActionBtn: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 15,
    marginRight: 16,
    elevation: 3,
    width: 120,
    borderWidth: 2,
    borderColor: '#FFD1DC',
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6F61',
    marginTop: 8,
    textAlign: 'center',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  vaccineCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    elevation: 4,
    borderWidth: 2,
    borderColor: '#FFD1DC',
  },
  vaccineImage: {
    width: 100,
    height: 100,
    borderRadius: 15,
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#FF9AA2',
  },
  vaccineInfo: {
    flex: 1,
  },
  vaccineName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF6F61',
    marginBottom: 4,
  },
  vaccineDesc: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  vaccineDetails: {
    marginBottom: 12,
  },
  vaccineDetailsLeft: {
    flexDirection: 'column',
  },
  vaccinePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFB3BA', // Lighter pink for price
    marginTop: 4,
  },
  vaccineAge: {
    fontSize: 14,
    color: '#888',
  },
  bookBtn: {
    backgroundColor: '#FF9AA2',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  bookBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  viewMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF9AA2',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginVertical: 20,
    elevation: 2,
  },
  viewMoreText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF5F1',
  },
  customLoader: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
  },
  loadingText: {
    fontSize: 16,
    color: '#FF6F61',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF5F1',
  },
  errorText: {
    fontSize: 16,
    color: '#FF6F61',
    marginVertical: 16,
    textAlign: 'center',
  },
  retryBtn: {
    backgroundColor: '#FF9AA2',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  retryBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;