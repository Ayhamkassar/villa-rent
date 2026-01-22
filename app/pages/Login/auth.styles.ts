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
    marginBottom: 28,
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
    marginBottom: 28,
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

  errorBox: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
  },

  errorText: {
    color: '#dc2626',
    textAlign: 'right',
  },

  button: {
    backgroundColor: '#4f46e5',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 4,
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  link: {
    textAlign: 'center',
    marginTop: 20,
    color: '#6b7280',
  },

  linkHighlight: {
    color: '#4f46e5',
    fontWeight: 'bold',
  },
});
