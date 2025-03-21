import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import apiConfig from '../config/apiConfig';

const { width: SCREEN_WIDTH } = Dimensions.get('window'); // Lấy chiều rộng màn hình

const DetailScreen = ({ route }) => {
    const { id } = route.params;
    const [vaccine, setVaccine] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        navigation.getParent()?.setOptions({ tabBarStyle: { display: 'none' } });
        return () => {
            navigation.getParent()?.setOptions({ tabBarStyle: { display: 'flex' } });
        };
    }, [navigation]);

    const fetchVaccineDetail = async () => {
        try {
            const data = await apiConfig.getVaccineById(id);
            setVaccine(data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVaccineDetail();
    }, [id]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={styles.loadingText}>Đang tải thông tin...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Lỗi: {error}</Text>
                <TouchableOpacity 
                    style={styles.retryBtn} 
                    onPress={fetchVaccineDetail}
                >
                    <Text style={styles.retryBtnText}>Thử lại</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                {vaccine.image && (
                    <Image 
                        source={{ uri: vaccine.image }} 
                        style={styles.image} 
                        resizeMode="contain" // Đổi sang contain để không bị cắt
                    />
                )}
                <Text style={styles.title}>{vaccine.name}</Text>
            </View>
            <View style={styles.content}>
                <View style={styles.infoSection}>
                    <Text style={styles.label}>Mô tả:</Text>
                    <Text style={styles.description}>
                        {vaccine.description || 'Không có mô tả'}
                    </Text>
                </View>
                <View style={styles.infoSection}>
                    <Text style={styles.label}>Giá:</Text>
                    <Text style={styles.price}>
                        {vaccine.price ? vaccine.price.toLocaleString() : 'Liên hệ'} VND
                    </Text>
                </View>
                <View style={styles.infoSection}>
                    <Text style={styles.label}>Độ tuổi:</Text>
                    <Text style={styles.ageRange}>
                        {vaccine.ageRange || 'Không xác định'}
                    </Text>
                </View>
                <TouchableOpacity
                    style={styles.bookBtn}
                    onPress={() => navigation.navigate('AddBooking', { vaccineId: id })}
                >
                    <Text style={styles.bookBtnText}>Đặt lịch ngay</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    header: {
        backgroundColor: '#FFFFFF',
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        width: SCREEN_WIDTH, // Đảm bảo header full width
    },
    image: {
        width: SCREEN_WIDTH, // Chiều rộng bằng màn hình
        height: 300, // Giữ chiều cao cố định
        backgroundColor: '#FFFFFF', // Nền trắng để tránh khoảng trống nếu ảnh nhỏ hơn
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2C3E50',
        textAlign: 'center',
        paddingHorizontal: 20,
        marginTop: 16,
    },
    content: {
        padding: 20,
    },
    infoSection: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#7F8C8D',
        marginBottom: 4,
    },
    description: {
        fontSize: 16,
        color: '#34495E',
        lineHeight: 24,
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#E74C3C',
    },
    ageRange: {
        fontSize: 16,
        color: '#34495E',
    },
    bookBtn: {
        backgroundColor: '#4CAF50',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 30,
        alignSelf: 'center',
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    bookBtnText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F7FA',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#4CAF50',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F7FA',
    },
    errorText: {
        fontSize: 16,
        color: '#E74C3C',
        marginBottom: 20,
        textAlign: 'center',
    },
    retryBtn: {
        backgroundColor: '#4CAF50',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    retryBtnText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default DetailScreen;