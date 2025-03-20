import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const ContactSupportScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Liên Hệ Hỗ Trợ</Text>
      <View style={styles.contactInfo}>
        <View style={styles.contactItem}>
          <MaterialIcons name="phone" size={24} color="#3F51B5" />
          <Text style={styles.contactText}>Hotline: 0123-456-789</Text>
        </View>
        <View style={styles.contactItem}>
          <MaterialIcons name="email" size={24} color="#3F51B5" />
          <Text style={styles.contactText}>Email: support@vaccine.com</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.callButton}>
        <Text style={styles.callButtonText}>Gọi Ngay</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5',
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 24,
  },
  contactInfo: {
    width: '100%',
    marginBottom: 24,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  contactText: {
    fontSize: 16,
    color: '#212121',
    marginLeft: 12,
  },
  callButton: {
    backgroundColor: '#3F51B5',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  callButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default ContactSupportScreen;