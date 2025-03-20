import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Linking } from 'react-native';
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

const ServiceScreen = () => {
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

  // Handle opening the external URL
  const handleLearnMorePress = async () => {
    const url = 'https://vnvc.vn/cam-nang-tiem-chung/quy-trinh-tiem-chung/';
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      console.error("Don't know how to open this URL: " + url);
    }
  };

  // Medical guide data
  const injectionGuides = [
    {
      id: 1,
      title: 'Chuẩn bị trước khi tiêm',
      description: 'Hướng dẫn chuẩn bị tâm lý và vật dụng cần thiết cho trẻ',
      icon: 'medical-services',
      details: [
        'Giữ trẻ thoải mái và bình tĩnh bằng cách trò chuyện nhẹ nhàng',
        'Mang theo sổ tiêm chủng và giấy tờ tùy thân',
        'Chuẩn bị đồ chơi hoặc sách yêu thích để đánh lạc hướng trẻ',
      ],
    },
    {
      id: 2,
      title: 'Quy trình tiêm phòng',
      description: 'Các bước thực hiện tiêm phòng an toàn cho trẻ',
      icon: 'vaccines',
      details: [
        'Kiểm tra sức khỏe tổng quát trước khi tiêm (nhiệt độ, tiền sử dị ứng)',
        'Thực hiện tiêm bởi nhân viên y tế được đào tạo',
        'Theo dõi phản ứng tại chỗ trong 30 phút sau tiêm',
      ],
    },
    {
      id: 3,
      title: 'Chăm sóc sau tiêm',
      description: 'Cách xử lý các phản ứng phụ thường gặp',
      icon: 'health-and-safety',
      details: [
        'Theo dõi nhiệt độ cơ thể mỗi 4-6 giờ',
        'Xử lý sốt nhẹ bằng khăn ấm và paracetamol theo liều bác sĩ',
        'Liên hệ bác sĩ nếu trẻ quấy khóc kéo dài hoặc có dấu hiệu bất thường',
      ],
    },
  ];

  // Vaccination schedule
  const vaccinationSchedule = [
    { age: 'Sơ sinh', vaccines: ['BCG (Lao)', 'Viêm gan B'] },
    { age: '2 tháng', vaccines: ['DPT-VGB-Hib (Bạch hầu, Ho gà, Uốn ván, Viêm gan B, Hib)', 'Polio uống'] },
    { age: '12 tháng', vaccines: ['Sởi', 'Viêm não Nhật Bản'] },
  ];

  // Useful tips
  const tips = [
    'Cho trẻ bú hoặc ăn nhẹ trước khi tiêm để giảm căng thẳng',
    'Mặc quần áo thoải mái, dễ cởi để tiện cho việc tiêm',
    'Ghi lại các phản ứng sau tiêm để báo cáo cho bác sĩ',
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Animated.View style={[styles.headerContainer, headerAnimatedStyle]}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Hướng Dẫn Tiêm Phòng Cho Trẻ</Text>
          <Text style={styles.headerSubtitle}>Thông tin y tế chuyên sâu từ chuyên gia</Text>
          <TouchableOpacity style={styles.searchButton} onPress={handleLearnMorePress}>
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
                source={{ uri: 'https://vinmec-prod.s3.amazonaws.com/images/20191121_084920_004342_20190615_082851_259.max-1800x1800.png' }}
                style={styles.welcomeImage}
                resizeMode="cover"
              />
            </Animated.View>
            <Text style={styles.welcomeTitle}>Chào mừng đến với hướng dẫn!</Text>
            <Text style={styles.welcomeText}>
              Hướng dẫn chi tiết về quy trình tiêm phòng an toàn cho trẻ em, được biên soạn bởi các chuyên gia y tế hàng đầu.
            </Text>
          </Animated.View>

          {/* Introduction Section */}
          <Animated.View entering={FadeInUp.delay(100)} style={styles.section}>
            <Text style={styles.sectionTitle}>Tại sao tiêm phòng quan trọng?</Text>
            <Text style={styles.sectionText}>
              Tiêm phòng là biện pháp hiệu quả nhất để bảo vệ trẻ em khỏi các bệnh truyền nhiễm nguy hiểm như sởi, quai bị, rubella, bại liệt và viêm gan.
            </Text>
          </Animated.View>

          {/* Guide List */}
          {injectionGuides.map((guide, index) => (
            <Animated.View
              key={guide.id}
              entering={FadeInUp.delay(index * 200 + 200)}
              style={styles.guideCard}
            >
              <TouchableOpacity style={styles.guideItem}>
                <MaterialIcons name={guide.icon} size={40} color="#FF6F61" style={styles.icon} />
                <View style={styles.guideContent}>
                  <Text style={styles.guideTitle}>{guide.title}</Text>
                  <Text style={styles.guideDescription} numberOfLines={2}>{guide.description}</Text>
                  <View style={styles.detailsContainer}>
                    {guide.details.map((detail, idx) => (
                      <Text key={idx} style={styles.detailText}>• {detail}</Text>
                    ))}
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}

          {/* Vaccination Schedule */}
          <Animated.View entering={FadeInUp.delay(injectionGuides.length * 200 + 200)} style={styles.section}>
            <Text style={styles.sectionTitle}>Lịch tiêm chủng cơ bản</Text>
            {vaccinationSchedule.map((item, index) => (
              <Animated.View
                key={index}
                entering={FadeInUp.delay(index * 150 + injectionGuides.length * 200 + 300)}
                style={styles.scheduleItem}
              >
                <Text style={styles.scheduleAge}>{item.age}</Text>
                <Text style={styles.scheduleVaccines}>{item.vaccines.join(', ')}</Text>
              </Animated.View>
            ))}
          </Animated.View>

          {/* Useful Tips */}
          <Animated.View entering={FadeInUp.delay((injectionGuides.length + vaccinationSchedule.length) * 200 + 300)} style={styles.section}>
            <Text style={styles.sectionTitle}>Mẹo hữu ích cho cha mẹ</Text>
            <View style={styles.tipsContainer}>
              {tips.map((tip, index) => (
                <Animated.View
                  key={index}
                  entering={FadeInUp.delay(index * 150 + (injectionGuides.length + vaccinationSchedule.length) * 200 + 400)}
                  style={styles.tipItem}
                >
                  <MaterialIcons name="lightbulb" size={20} color="#FFB3BA" />
                  <Text style={styles.tipText}>{tip}</Text>
                </Animated.View>
              ))}
            </View>
          </Animated.View>

          {/* Emergency Contact */}
          <Animated.View entering={FadeInUp.delay((injectionGuides.length + vaccinationSchedule.length + tips.length) * 200 + 400)} style={styles.emergencyCard}>
            <Text style={styles.emergencyTitle}>Liên hệ khẩn cấp</Text>
            <Text style={styles.emergencyText}>
              Nếu trẻ có dấu hiệu nghiêm trọng, hãy gọi ngay:
            </Text>
            <TouchableOpacity style={styles.emergencyButton}>
              <MaterialIcons name="phone" size={20} color="#fff" />
              <Text style={styles.emergencyButtonText}>115 - Cấp cứu y tế</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Footer Note */}
          <Animated.View entering={FadeInUp.delay((injectionGuides.length + vaccinationSchedule.length + tips.length + 1) * 200 + 400)} style={styles.footer}>
            <Text style={styles.footerText}>
              Lưu ý: Luôn tham khảo ý kiến bác sĩ trước khi thực hiện.
            </Text>
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
    height: 180, // Slightly smaller
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
  section: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 12,
    borderWidth: 2,
    borderColor: '#FFD1DC', // Soft pink border
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF6F61', // Bright coral
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  guideCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 12,
    borderWidth: 2,
    borderColor: '#FFD1DC', // Soft pink border
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  guideItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
  },
  guideContent: {
    flex: 1,
  },
  guideTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF6F61', // Bright coral
    marginBottom: 4,
  },
  guideDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
    lineHeight: 16,
  },
  detailsContainer: {
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#888',
    fontWeight: '500',
  },
  scheduleItem: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#FFF5F1',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFD1DC',
  },
  scheduleAge: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF6F61',
  },
  scheduleVaccines: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  tipsContainer: {
    marginTop: 8,
    gap: 8,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tipText: {
    fontSize: 12,
    color: '#888',
    flex: 1,
  },
  emergencyCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 12,
    borderWidth: 2,
    borderColor: '#FFD1DC', // Soft pink border
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center',
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF6F61', // Bright coral
    marginBottom: 8,
  },
  emergencyText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF9AA2', // Consistent with header
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 8,
    elevation: 2,
  },
  emergencyButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  footer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 12,
    borderWidth: 2,
    borderColor: '#FFD1DC', // Soft pink border
    elevation: 3,
  },
  footerText: {
    fontSize: 12,
    color: '#FF6F61', // Bright coral
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default ServiceScreen;