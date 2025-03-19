import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
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
      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        <Text style={styles.headerTitle}>Hướng Dẫn Tiêm Phòng Cho Trẻ</Text>
        <Text style={styles.headerSubtitle}>Thông tin y tế chuyên sâu từ chuyên gia</Text>
      </Animated.View>

      {/* Content */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View style={[styles.contentContainer, contentAnimatedStyle]}>
          {/* Welcome Card with Image */}
          <Animated.View 
            entering={FadeInDown.duration(600)}
            style={styles.welcomeCard}
          >
            <Animated.View style={[styles.imageContainer, imageAnimatedStyle]}>
              <Image
                source={{ uri: 'https://vinmec-prod.s3.amazonaws.com/images/20191121_084920_004342_20190615_082851_259.max-1800x1800.png' }} // Hình ảnh minh họa tiêm phòng
                style={styles.welcomeImage}
              />
            </Animated.View>
            <Text style={styles.welcomeTitle}>Chào mừng đến với hướng dẫn!</Text>
            <Text style={styles.welcomeText}>
              Hướng dẫn chi tiết về quy trình tiêm phòng an toàn cho trẻ em, được biên soạn bởi các chuyên gia y tế hàng đầu.
            </Text>
          </Animated.View>

          {/* Introduction Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tại sao tiêm phòng quan trọng?</Text>
            <Text style={styles.sectionText}>
              Tiêm phòng là biện pháp hiệu quả nhất để bảo vệ trẻ em khỏi các bệnh truyền nhiễm nguy hiểm như sởi, quai bị, rubella, bại liệt và viêm gan. 
              Việc tiêm chủng đúng lịch giúp trẻ xây dựng hệ miễn dịch mạnh mẽ, giảm nguy cơ bùng phát dịch bệnh trong cộng đồng.
            </Text>
          </View>

          {/* Guide List */}
          {injectionGuides.map((guide, index) => (
            <Animated.View 
              key={guide.id}
              entering={FadeInUp.delay(index * 200)}
              style={styles.guideCard}
            >
              <TouchableOpacity style={styles.guideItem}>
                <View style={styles.iconContainer}>
                  <MaterialIcons name={guide.icon} size={24} color="#007AFF" />
                </View>
                <View style={styles.guideContent}>
                  <Text style={styles.guideTitle}>{guide.title}</Text>
                  <Text style={styles.guideDescription}>{guide.description}</Text>
                  <View style={styles.detailsContainer}>
                    {guide.details.map((detail, idx) => (
                      <View key={idx} style={styles.detailItem}>
                        <MaterialIcons name="check" size={16} color="#4CAF50" />
                        <Text style={styles.detailText}>{detail}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                <MaterialIcons name="chevron-right" size={24} color="#666" />
              </TouchableOpacity>
            </Animated.View>
          ))}

          {/* Vaccination Schedule */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Lịch tiêm chủng cơ bản</Text>
            {vaccinationSchedule.map((item, index) => (
              <Animated.View 
                key={index}
                entering={FadeInUp.delay(index * 150)}
                style={styles.scheduleItem}
              >
                <Text style={styles.scheduleAge}>{item.age}</Text>
                <Text style={styles.scheduleVaccines}>{item.vaccines.join(', ')}</Text>
              </Animated.View>
            ))}
          </View>

          {/* Useful Tips */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mẹo hữu ích cho cha mẹ</Text>
            <View style={styles.tipsContainer}>
              {tips.map((tip, index) => (
                <Animated.View 
                  key={index}
                  entering={FadeInUp.delay(index * 150)}
                  style={styles.tipItem}
                >
                  <MaterialIcons name="lightbulb" size={20} color="#FFB300" />
                  <Text style={styles.tipText}>{tip}</Text>
                </Animated.View>
              ))}
            </View>
          </View>

          {/* Emergency Contact */}
          <View style={styles.emergencyCard}>
            <Text style={styles.emergencyTitle}>Liên hệ khẩn cấp</Text>
            <Text style={styles.emergencyText}>
              Nếu trẻ có dấu hiệu nghiêm trọng (khó thở, co giật, sốt cao không giảm), hãy gọi ngay:
            </Text>
            <TouchableOpacity style={styles.emergencyButton}>
              <MaterialIcons name="phone" size={20} color="#fff" />
              <Text style={styles.emergencyButtonText}>115 - Cấp cứu y tế</Text>
            </TouchableOpacity>
          </View>

          {/* Footer Note */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Lưu ý: Thông tin này chỉ mang tính chất tham khảo. Luôn tham khảo ý kiến bác sĩ hoặc cơ sở y tế trước khi thực hiện bất kỳ quy trình nào.
            </Text>
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
  guideCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 3,
    overflow: 'hidden',
  },
  guideItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E6F0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  guideContent: {
    flex: 1,
  },
  guideTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  guideDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  detailsContainer: {
    marginTop: 12,
    gap: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#444',
    flex: 1,
  },
  scheduleItem: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
  },
  scheduleAge: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A3C34',
  },
  scheduleVaccines: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  tipsContainer: {
    gap: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tipText: {
    fontSize: 14,
    color: '#444',
    flex: 1,
  },
  emergencyCard: {
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 16,
    elevation: 3,
    alignItems: 'center',
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E65100',
    marginBottom: 8,
  },
  emergencyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E65100',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  emergencyButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  footer: {
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#E65100',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default ServiceScreen;