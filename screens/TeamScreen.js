import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const TeamScreen = () => {
  // Animation values
  const headerOffset = useSharedValue(-100);
  const contentOffset = useSharedValue(100);
  const scaleValue = useSharedValue(0.8);

  // Animation effect on mount
  useEffect(() => {
    headerOffset.value = withSpring(0, { damping: 15 });
    contentOffset.value = withSpring(0, { damping: 15 });
    scaleValue.value = withTiming(1, { duration: 600 });
  }, []);

  // Animated styles
  const headerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: headerOffset.value }],
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: contentOffset.value }],
  }));

  const imageAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }));

  // Team data
  const teamMembers = [
    {
      id: 1,
      name: 'BS. Nguyễn Thị Hồng Nhung',
      role: 'Bác sĩ Nhi khoa',
      experience: '15 năm kinh nghiệm trong tiêm chủng và chăm sóc trẻ em',
      specialties: ['Tiêm chủng', 'Dinh dưỡng trẻ em', 'Bệnh truyền nhiễm'],
      image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7', // Bác sĩ nữ
    },
    {
      id: 2,
      name: 'YT. Trần Văn Hùng',
      role: 'Y tá trưởng',
      experience: '10 năm kinh nghiệm hỗ trợ tiêm phòng và chăm sóc sau tiêm',
      specialties: ['Tiêm phòng an toàn', 'Xử lý phản ứng phụ', 'Hỗ trợ tâm lý trẻ'],
      image: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61', // Y tá nam
    },
    {
      id: 3,
      name: 'BS. Phạm Minh Tuấn',
      role: 'Bác sĩ Chuyên khoa Miễn dịch',
      experience: '20 năm nghiên cứu và thực hành về vắc-xin',
      specialties: ['Miễn dịch học', 'Phát triển vắc-xin', 'Tư vấn tiêm chủng'],
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d', // Bác sĩ nam
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Animated.View style={[styles.headerContainer, headerAnimatedStyle]}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Đội Ngũ Chuyên Gia</Text>
          <Text style={styles.headerSubtitle}>Gặp gỡ các bác sĩ và y tá tận tâm của chúng tôi</Text>
          <TouchableOpacity style={styles.searchButton}>
            <MaterialIcons name="info" size={24} color="#fff" />
            <Text style={styles.searchButtonText}>Tìm hiểu thêm</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View style={[styles.contentContainer, contentAnimatedStyle]}>
          {/* Welcome Card */}
          <Animated.View entering={FadeInDown.duration(600)} style={styles.welcomeCard}>
            <Animated.View style={[styles.imageContainer, imageAnimatedStyle]}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2' }} // Đội ngũ y tế
                style={styles.welcomeImage}
              />
            </Animated.View>
            <Text style={styles.welcomeTitle}>Đội ngũ chuyên nghiệp</Text>
            <Text style={styles.welcomeText}>
              Chúng tôi tự hào có đội ngũ bác sĩ và y tá giàu kinh nghiệm, luôn sẵn sàng hỗ trợ trẻ em và gia đình trong hành trình tiêm chủng.
            </Text>
          </Animated.View>

          {/* Team Members */}
          {teamMembers.map((member, index) => (
            <Animated.View
              key={member.id}
              entering={FadeInUp.delay(index * 200)}
              style={styles.memberCard}
            >
              <Image
                source={{ uri: member.image }}
                style={styles.memberImage}
                resizeMode="cover"
              />
              <View style={styles.memberContent}>
                <Text style={styles.memberName}>{member.name}</Text>
                <Text style={styles.memberRole}>{member.role}</Text>
                <Text style={styles.memberExperience}>{member.experience}</Text>
                <View style={styles.specialtiesContainer}>
                  {member.specialties.map((specialty, idx) => (
                    <Text key={idx} style={styles.specialtyText}>
                      • {specialty}
                    </Text>
                  ))}
                </View>
              </View>
            </Animated.View>
          ))}

          {/* Contact Section */}
          <Animated.View entering={FadeInUp.delay(teamMembers.length * 200)} style={styles.contactSection}>
            <Text style={styles.contactTitle}>Liên hệ với chúng tôi</Text>
            <Text style={styles.contactText}>
              Nếu bạn cần tư vấn hoặc đặt lịch hẹn, hãy liên hệ qua:
            </Text>
            <View style={styles.contactInfo}>
              <MaterialIcons name="phone" size={20} color="#FF6F61" />
              <Text style={styles.contactDetail}>Hotline: 1900 1234</Text>
            </View>
            <View style={styles.contactInfo}>
              <MaterialIcons name="email" size={20} color="#FF6F61" />
              <Text style={styles.contactDetail}>Email: support@tiemphongtreem.vn</Text>
            </View>
          </Animated.View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F1', // Soft pastel background like VacxinList
  },
  headerContainer: {
    backgroundColor: '#FF9AA2', // Warm, playful pinkish-red
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
    backgroundColor: '#FFB3BA', // Lighter pink for contrast
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
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  contentContainer: {
    gap: 16, // Consistent spacing like VacxinList
  },
  welcomeCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 2,
    borderColor: '#FFD1DC', // Soft pink border
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  welcomeImage: {
    width: '100%',
    height: 180, // Slightly smaller than original
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#FF9AA2', // Matching header color
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FF6F61', // Bright coral like VacxinList
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },
  memberCard: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#FFD1DC', // Soft pink border
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  memberImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#FF9AA2', // Matching header color
  },
  memberContent: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF6F61', // Bright coral
    marginBottom: 4,
  },
  memberRole: {
    fontSize: 12,
    color: '#FFB3BA', // Lighter pink like price in VacxinList
    fontWeight: 'bold',
    marginBottom: 4,
  },
  memberExperience: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
    lineHeight: 16,
  },
  specialtiesContainer: {
    gap: 4,
  },
  specialtyText: {
    fontSize: 12,
    color: '#888',
    fontWeight: '500',
  },
  contactSection: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 16,
    borderWidth: 2,
    borderColor: '#FFD1DC', // Soft pink border
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF6F61', // Bright coral
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  contactDetail: {
    fontSize: 14,
    color: '#FF6F61', // Bright coral for consistency
    fontWeight: '500',
  },
});

export default TeamScreen;