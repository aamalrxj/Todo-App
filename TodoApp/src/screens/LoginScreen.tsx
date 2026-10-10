import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AuthLayout from '../components/AuthLayout';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import ErrorBanner from '../components/ErrorBanner';
import { useAppDispatch, useAppSelector } from '../store';
import { login, clearError } from '../store/authSlice';
import { AuthStackParamList } from '../types/navigation';
import { colors } from '../utils/theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const LoginScreen = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(s => s.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  // Clear any old server error when the screen opens
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleLogin = () => {
    if (!email.trim() || !password) {
      setFormError('Please enter your email and password');
      return;
    }
    setFormError('');
    dispatch(login({ email: email.trim(), password }));
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to continue to your tasks">
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
        placeholder="Your password"
        secureTextEntry
      />

      <ErrorBanner message={formError || error} />

      <AppButton title="Log In" onPress={handleLogin} loading={loading} />

      <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.link}>
        <Text style={styles.linkText}>
          New here? <Text style={styles.linkBold}>Create an account</Text>
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

export default LoginScreen;