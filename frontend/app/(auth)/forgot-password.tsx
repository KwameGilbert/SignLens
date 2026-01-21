import { View, Text, TouchableOpacity, Animated, StyleSheet, TextInput } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const iconScale = useRef(new Animated.Value(0)).current;
  const iconPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Card entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 40,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Icon pop animation
    Animated.spring(iconScale, {
      toValue: 1,
      tension: 60,
      friction: 6,
      delay: 300,
      useNativeDriver: true,
    }).start();

    // Icon pulse loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(iconPulse, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(iconPulse, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
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
      <View className="pt-12 px-6 pb-6">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center"
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Forgot password</Text>
      </View>

      {/* Content */}
      <Animated.View 
        className="flex-1 justify-center px-8 pb-20"
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        {/* Forgot Password Card */}
        <View style={styles.card} className="bg-white rounded-3xl px-6 py-10">
          {/* Icon */}
          <View className="items-center mb-6">
            <Animated.View 
              style={[
                styles.iconCircle,
                {
                  transform: [
                    { scale: iconScale },
                    { scale: iconPulse },
                  ],
                }
              ]}
            >
              <Text style={styles.iconText}>❓</Text>
            </Animated.View>
          </View>

          {/* Title */}
          <Text style={styles.title}>Reset password</Text>
          <Text style={styles.subtitle}>
            Enter your email address and we'll send you a link to reset your password
          </Text>

          {/* Email Input */}
          <View className="mt-8">
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
          </View>

          {/* Continue Button */}
          <TouchableOpacity 
            style={styles.continueButton}
            className="mt-8"
            onPress={() => router.push('/(auth)/otp-verification')}
            activeOpacity={0.9}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 20,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FFE8D6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 20,
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
  continueButton: {
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
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
