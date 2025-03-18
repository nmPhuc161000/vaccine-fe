import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import apiConfig from '../config/apiConfig';

const DetailScreen = ({ route }) => {
    const { id } = route.params;
    const [vaccine, setVaccine] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{vaccine.name}</Text>
            {vaccine.image && (
                <Image source={{ uri: vaccine.image }} style={styles.image} />
            )}
            <Text style={styles.description}>{vaccine.description || 'Không có mô tả'}</Text>
            <Text style={styles.price}>
                Giá: {vaccine.price ? vaccine.price.toLocaleString() : 'Không có giá'} VND
            </Text>
            <Text style={styles.ageRange}>Độ tuổi: {vaccine.ageRange || 'Không xác định'}</Text>
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
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 16,
    },
    description: {
        fontSize: 16,
        color: '#666',
        marginBottom: 12,
    },
    price: {
        fontSize: 18,
        color: '#2ecc71',
        marginBottom: 8,
    },
    ageRange: {
        fontSize: 16,
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

export default DetailScreen;