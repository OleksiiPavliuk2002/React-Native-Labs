import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { biometricManager } from '../security/BiometricManager';
import { FormField } from '../components/FormField';
import { PrimaryButton } from '../components/PrimaryButton';
import { theme } from '../theme/theme';
import { LinearGradient } from 'expo-linear-gradient';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const [passwordError, setPasswordError] = useState<string | undefined>(undefined);
  const [message, setMessage] = useState('Use password or biometrics');

  const validateForm = () => {
    let isValid = true;
    if (!email.includes('@')) {
      setEmailError('Enter a valid email address');
      isValid = false;
    } else {
      setEmailError(undefined);
    }
    if (password.length < 6) {
      setPasswordError('Password should contain at least 6 characters');
      isValid = false;
    } else {
      setPasswordError(undefined);
    }
    return isValid;
  };

  const onPasswordLogin = () => {
    if (!validateForm()) {
      setMessage('Please fix validation errors');
      return;
    }
    setMessage('Logged in successfully');
    navigation.replace('MainTabs');
  };

  const onBiometric = async () => {
    const result = await biometricManager.authenticate('Sign in to your account');
    if (result.ok) {
      navigation.replace('MainTabs');
      return;
    }
    setMessage(result.message ?? 'Authentication failed');
  };

  return (
    <LinearGradient
      colors={[theme.colors.background, '#e0f2fe']}
      style={styles.container}
    >
      <Text style={styles.title}>Login</Text>
      <Text style={styles.subtitle}>Welcome back. Please sign in.</Text>
      <FormField label="Email" placeholder="name@example.com" value={email} onChangeText={setEmail} error={emailError} />
      <FormField
        label="Password"
        placeholder="Enter password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        error={passwordError}
      />
      <PrimaryButton title="Login with Password" onPress={onPasswordLogin} />
      <View style={styles.gap} />
      <PrimaryButton title="Login with Biometrics" onPress={onBiometric} />
      <Text style={styles.message}>{message}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.md,
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  title: { 
    fontSize: 32, 
    fontWeight: '800', 
    marginBottom: 6, 
    color: theme.colors.text,
    textAlign: 'center',
  },
  subtitle: { 
    color: theme.colors.muted, 
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 16,
  },
  gap: { 
    height: 8 
  },
  message: { 
    marginTop: 8, 
    color: theme.colors.text,
    textAlign: 'center',
  },
});
