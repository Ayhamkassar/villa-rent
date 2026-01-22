import { API_URL } from '@/server/config';
import axios from 'axios';
import { Calendar, DollarSign, User } from 'lucide-react-native';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Booking {
  _id: string;
  userName?: string;
  userId?: { name?: string };
  from?: string;
  to?: string;
  totalPrice?: number;
  status: 'confirmed' | 'pending' | 'cancelled';
}

interface BookingItemProps {
  booking: Booking;
  refreshBookings: () => Promise<void>;
}

export const BookingItem: React.FC<BookingItemProps> = ({ booking, refreshBookings }) => {
  const statusColor = () => {
    if (booking.status === 'confirmed') return '#2a9d8f';
    if (booking.status === 'pending') return 'orange';
    return '#e63946';
  };

  const statusText = () => {
    if (booking.status === 'confirmed') return 'مؤكد';
    if (booking.status === 'pending') return 'قيد الانتظار';
    return 'ملغي';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const updateStatus = async (status: 'confirmed' | 'cancelled') => {
    try {
      await axios.put(`${API_URL}/api/bookings/${booking._id}/status`, { status });
      Alert.alert(`تم ${status === 'confirmed' ? 'تأكيد' : 'إلغاء'} الحجز`);
      await refreshBookings();
    } catch {
      Alert.alert('خطأ', 'فشل في تحديث الحجز');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userRow}>
          <User size={16} color="#0077b6" />
          <Text style={styles.userName}>{booking.userName || booking.userId?.name || '-'}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColor() }]}>
          <Text style={styles.statusText}>{statusText()}</Text>
        </View>
      </View>

      {/* Dates & Price */}
      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Calendar size={16} color="#0077b6" />
          <Text style={styles.detailText}>من: {formatDate(booking.from)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Calendar size={16} color="#0077b6" />
          <Text style={styles.detailText}>إلى: {formatDate(booking.to)}</Text>
        </View>
        {booking.totalPrice !== undefined && (
          <View style={styles.detailRow}>
            <DollarSign size={16} color="#0077b6" />
            <Text style={[styles.detailText, { fontWeight: 'bold', color: '#333' }]}>{booking.totalPrice} ريال</Text>
          </View>
        )}
      </View>

      {/* Actions */}
      {booking.status === 'pending' && (
        <View style={styles.actions}>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#2a9d8f' }]} onPress={() => updateStatus('confirmed')}>
            <Text style={styles.buttonText}>تأكيد</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#e63946' }]} onPress={() => updateStatus('cancelled')}>
            <Text style={styles.buttonText}>إلغاء</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    alignItems: 'center',
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userName: {
    fontWeight: '600',
    fontSize: 15,
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  details: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 2,
  },
  detailText: {
    fontSize: 14,
    color: '#555',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});
