import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import React, { useEffect } from 'react';
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
      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        <Text style={styles.headerTitle}>Đội Ngũ Chuyên Gia</Text>
        <Text style={styles.headerSubtitle}>Gặp gỡ các bác sĩ và y tá tận tâm của chúng tôi</Text>
      </Animated.View>

      {/* Content */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View style={[styles.contentContainer, contentAnimatedStyle]}>
          {/* Welcome Card */}
          <Animated.View 
            entering={FadeInDown.duration(600)}
            style={styles.welcomeCard}
          >
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

          {/* Team Introduction */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Về chúng tôi</Text>
            <Text style={styles.sectionText}>
              Đội ngũ của chúng tôi bao gồm các chuyên gia được đào tạo bài bản, cam kết mang đến dịch vụ y tế chất lượng cao, an toàn và thân thiện với trẻ em.
            </Text>
          </View>

          {/* Team Members */}
          {teamMembers.map((member, index) => (
            <Animated.View 
              key={member.id}
              entering={FadeInUp.delay(index * 200)}
              style={styles.memberCard}
            >
              <View style={styles.memberImageContainer}>
                <Image
                  source={{ uri: member.image }}
                  style={styles.memberImage}
                />
              </View>
              <View style={styles.memberContent}>
                <Text style={styles.memberName}>{member.name}</Text>
                <Text style={styles.memberRole}>{member.role}</Text>
                <Text style={styles.memberExperience}>{member.experience}</Text>
                <View style={styles.specialtiesContainer}>
                  {member.specialties.map((specialty, idx) => (
                    <View key={idx} style={styles.specialtyItem}>
                      <MaterialIcons name="check-circle" size={16} color="#4CAF50" />
                      <Text style={styles.specialtyText}>{specialty}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </Animated.View>
          ))}

          {/* Contact Section */}
          <View style={styles.contactSection}>
            <Text style={styles.contactTitle}>Liên hệ với chúng tôi</Text>
            <Text style={styles.contactText}>
              Nếu bạn cần tư vấn hoặc đặt lịch hẹn, hãy liên hệ qua:
            </Text>
            <View style={styles.contactInfo}>
              <MaterialIcons name="phone" size={20} color="#007AFF" />
              <Text style={styles.contactDetail}>Hotline: 1900 1234</Text>
            </View>
            <View style={styles.contactInfo}>
              <MaterialIcons name="email" size={20} color="#007AFF" />
              <Text style={styles.contactDetail}>Email: support@tiemphongtreem.vn</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1A3C34',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  contentContainer: {
    gap: 20,
  },
  welcomeCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  welcomeImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A3C34',
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 15,
    color: '#555',
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 22,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  memberCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 3,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  memberImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
  },
  memberImage: {
    width: '100%',
    height: '100%',
  },
  memberContent: {
    flex: 1,
  },
  memberName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  memberRole: {
    fontSize: 14,
    color: '#007AFF',
    marginTop: 4,
  },
  memberExperience: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  specialtiesContainer: {
    marginTop: 8,
    gap: 6,
  },
  specialtyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  specialtyText: {
    fontSize: 14,
    color: '#444',
  },
  contactSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
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
    color: '#007AFF',
  },
});

export default TeamScreen;