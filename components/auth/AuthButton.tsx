import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { styles } from '../../app/pages/Login/login.styles';

export default function AuthButton({ loading, title, onPress }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      style={[styles.button, loading && { opacity: 0.7 }]}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}
