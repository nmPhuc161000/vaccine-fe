import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import apiConfig from '../config/apiConfig';

const HomeScreen = ({ navigation }) => {
    const [vaccines, setVaccines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchVaccines = async () => {
        try {
            const data = await apiConfig.getVaccines();
            console.log("Data from API:", data); // Log dữ liệu từ API
            if (!Array.isArray(data)) {
                throw new Error("Dữ liệu vaccine không hợp lệ");
            }
            setVaccines(data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching vaccines:", err); // Log lỗi chi tiết
            setError(err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVaccines();
    }, []);

    const renderVaccineItem = ({ item }) => {
        if (!item || !item._id) {
            console.error("Invalid item:", item); // Log nếu item không hợp lệ
            return null;
        }
        return (
            <TouchableOpacity
                style={styles.vaccineItem}
                onPress={() => navigation.navigate('DetailScreen', { id: item._id })}
            >
                <Image
                    source={{ uri: item.image }}
                    style={styles.image}
                    resizeMode="cover"
                />
                <View style={styles.textContainer}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.description}>{item.description || 'Không có mô tả'}</Text>
                    <Text style={styles.price}>
                        {item.price ? item.price.toLocaleString() : 'Không có giá'} VND
                    </Text>
                    <Text style={styles.ageRange}>Độ tuổi: {item.ageRange || 'Không xác định'}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    if (!Array.isArray(vaccines)) {
        console.error("Vaccines is not an array:", vaccines); // Log nếu vaccines không phải là mảng
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Dữ liệu vaccine không hợp lệ</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Danh sách Vaccine</Text>
            <FlatList
                data={vaccines}
                renderItem={renderVaccineItem}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.list}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
        color: '#2c3e50',
    },
    list: {
        paddingBottom: 16,
    },
    vaccineItem: {
        flexDirection: 'row',
        padding: 12,
        marginBottom: 12,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    description: {
        fontSize: 14,
        color: '#666',
        marginVertical: 4,
    },
    price: {
        fontSize: 16,
        color: '#27ae60',
        fontWeight: 'bold',
    },
    ageRange: {
        fontSize: 14,
        color: '#888',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 16,
        color: 'red',
    },
});

export default HomeScreen;