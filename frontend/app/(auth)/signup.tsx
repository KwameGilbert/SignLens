import { View, Text, TouchableOpacity, Animated, StyleSheet, TextInput } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';

export default function SignUpScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  
  // Staggered animations for inputs
  const input1Anim = useRef(new Animated.Value(0)).current;
  const input2Anim = useRef(new Animated.Value(0)).current;
  const input3Anim = useRef(new Animated.Value(0)).current;
  const input4Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Staggered input animations
    Animated.stagger(100, [
      Animated.timing(input1Anim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(input2Anim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(input3Anim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(input4Anim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View className="flex-1">
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="light" />

      {/* Background Image */}
      <Image 
        source={require('../../assets/images/welcome_bg.png')}
        style={StyleSheet.absoluteFillObject}
        contentFit="cover"
      />

      {/* Gradient Overlay */}
      <LinearGradient
        colors={['rgba(251, 84, 7, 0.91)', 'rgba(251, 84, 7, 0.91)', 'rgba(251, 84, 7, 0.91)']}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Header */}
      <View className="pt-12 px-6">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center"
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <Animated.View 
        className="flex-1 justify-center px-8"
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        {/* Sign Up Card */}
        <View style={styles.card} className="bg-white rounded-3xl px-6 py-8">
          {/* Title */}
          <Text style={styles.title}>CREATE ACCOUNT</Text>
          <Text style={styles.subtitle}>Join us and start learning today</Text>

          {/* Full Name Input */}
          <Animated.View className="mt-6" style={{ opacity: input1Anim }}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="#999"
                value={fullName}
                onChangeText={setFullName}
                autoComplete="name"
              />
            </View>
          </Animated.View>

          {/* Email Input */}
          <Animated.View className="mt-4" style={{ opacity: input2Anim }}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>
          </Animated.View>

          {/* Password Input */}
          <Animated.View className="mt-4" style={{ opacity: input3Anim }}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password-new"
              />
            </View>
          </Animated.View>

          {/* Confirm Password Input */}
          <Animated.View className="mt-4" style={{ opacity: input4Anim }}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor="#999"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password-new"
              />
            </View>
          </Animated.View>

          {/* Sign Up Button */}
          <TouchableOpacity 
            style={styles.signupButton}
            className="mt-6"
            activeOpacity={0.9}
          >
            <Text style={styles.signupButtonText}>LOGIN</Text>
          </TouchableOpacity>

          {/* Social Sign Up */}
          <View className="flex-row justify-center gap-4 mt-6">
            <TouchableOpacity style={styles.socialButton} activeOpacity={0.9}>
              <Text style={styles.socialIcon}>G</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton} activeOpacity={0.9}>
              <Ionicons name="logo-apple" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Login Link */}
          <View className="flex-row justify-center mt-6">
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity 
              onPress={() => router.push('/(auth)/login')}
              activeOpacity={0.7}
            >
              <Text style={styles.linkText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
    fontWeight: '400',
  },
  inputContainer: {
    borderWidth: 1.5,
    borderColor: '#FB5407',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  input: {
    fontSize: 15,
    color: '#000',
  },
  inputLabel: {
    fontSize: 15,
    color: '#999',
  },
  signupButton: {
    backgroundColor: '#FB5407',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#FB5407',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  signupButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  socialIcon: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
  linkText: {
    fontSize: 14,
    color: '#FB5407',
    fontWeight: '600',
  },
});
