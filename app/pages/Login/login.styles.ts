import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  logoBox: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#4f46e5',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
  },

  subtitle: {
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 30,
  },

  inputBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  input: {
    textAlign: 'right',
    fontSize: 16,
    color: '#111827',
  },

  forgot: {
    color: '#4f46e5',
    textAlign: 'right',
    marginBottom: 20,
  },

  button: {
    backgroundColor: '#4f46e5',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  divider: {
    textAlign: 'center',
    marginVertical: 20,
    color: '#9ca3af',
  },

  registerBtn: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
});
