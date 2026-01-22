import { styles } from '@/app/pages/Login/auth.styles';
import { Eye, EyeOff } from 'lucide-react-native';
import { useState } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';

export default function PasswordInput(props: any) {
  const [show, setShow] = useState(false);

  return (
    <View style={styles.inputBox}>
      <View style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
        <TextInput
          {...props}
          secureTextEntry={!show}
          style={[styles.input, { flex: 1 }]}
          placeholderTextColor="#9ca3af"
        />
        <TouchableOpacity onPress={() => setShow(!show)}>
          {show ? <EyeOff size={20} color="#9ca3af" /> : <Eye size={20} color="#9ca3af" />}
        </TouchableOpacity>
      </View>
    </View>
  );
}
