import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AuthLayout from '../components/AuthLayout';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import ErrorBanner from '../components/ErrorBanner';
import { useAppDispatch, useAppSelector } from '../store';
import { register, clearError } from '../store/authSlice';
import { AuthStackParamList } from '../types/navigation';
import { colors } from '../utils/theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const RegisterScreen = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(s => s.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Validate on the device first, so we don't send obviously bad data
  const handleRegister = () => {
    if (!EMAIL_REGEX.test(email.trim())) {
      setFormError('Please enter a valid email address');
      return;
    }
    if (password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirm) {
      setFormError('Passwords do not match');
      return;
    }
    setFormError('');
    dispatch(register({ email: email.trim(), password }));
  };

  return (
    <AuthLayout title="Create account" subtitle="Sign up and start organizing your day">
      <AppInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <AppInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="At least 6 characters"
        secureTextEntry
      />
      <AppInput
        label="Confirm password"
        value={confirm}
        onChangeText={setConfirm}
        placeholder="Repeat your password"
        secureTextEntry
      />

      <ErrorBanner message={formError || error} />

      <AppButton title="Create Account" onPress={handleRegister} loading={loading} />

      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.link}>
        <Text style={styles.linkText}>
          Already have an account? <Text style={styles.linkBold}>Log in</Text>
        </Text>
      </TouchableOpacity>
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  link: { marginTop: 22, alignItems: 'center' },
  linkText: { color: colors.muted, fontSize: 14 },
  linkBold: { color: colors.primary, fontWeight: '800' },
});

export default RegisterScreen;