import { TextInput, View } from 'react-native';
import { styles } from '../../app/pages/Login/login.styles';

export default function AuthInput(props: any) {
  return (
    <View style={styles.inputBox}>
      <TextInput
        {...props}
        style={styles.input}
        placeholderTextColor="#9ca3af"
      />
    </View>
  );
}
