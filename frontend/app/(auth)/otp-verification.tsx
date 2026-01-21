import { View, Text, TouchableOpacity, Animated, StyleSheet, TextInput } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';

export default function OTPVerificationScreen() {
  const router = useRouter();
  const [otp, setOtp] = useState(['', '', '', '', '']);
  const inputRefs = useRef<Array<TextInput | null>>([]);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const iconScale = useRef(new Animated.Value(0)).current;
  
  // Individual input animations
  const inputAnims = useRef([...Array(5)].map(() => new Animated.Value(0))).current;

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

    // Staggered input box animations
    Animated.stagger(80, 
      inputAnims.map(anim => 
        Animated.spring(anim, {
          toValue: 1,
          tension: 60,
          friction: 7,
          useNativeDriver: true,
        })
      )
    ).start();
  }, []);

  const handleOtpChange = (value: string, index: number) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 4) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

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
        <Text style={styles.headerTitle}>OTP verification</Text>
      </View>

      {/* Content */}
      <Animated.View 
        className="flex-1 justify-center px-8 pb-20"
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        {/* OTP Card */}
        <View style={styles.card} className="bg-white rounded-3xl px-6 py-10">
          {/* Icon */}
          <View className="items-center mb-6">
            <Animated.View 
              style={[
                styles.iconCircle,
                {
                  transform: [{ scale: iconScale }],
                }
              ]}
            >
              <Ionicons name="checkmark" size={50} color="#FB5407" />
            </Animated.View>
          </View>

          {/* Title */}
          <Text style={styles.title}>OTP Verification</Text>
          <Text style={styles.subtitle}>
            We have sent the verification code to your email
          </Text>

          {/* OTP Input Boxes */}
          <View className="flex-row justify-center gap-3 mt-8">
            {otp.map((digit, index) => (
              <Animated.View
                key={index}
                style={{
                  transform: [{ scale: inputAnims[index] }],
                }}
              >
                <TextInput
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  style={[
                    styles.otpInput,
                    digit ? styles.otpInputFilled : null,
                  ]}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                />
              </Animated.View>
            ))}
          </View>

          {/* Verify Button */}
          <TouchableOpacity 
            style={[
              styles.verifyButton,
              otp.every(d => d) ? null : styles.verifyButtonDisabled
            ]}
            className="mt-10"
            disabled={!otp.every(d => d)}
            activeOpacity={0.9}
          >
            <Text style={styles.verifyButtonText}>Verify</Text>
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
    paddingHorizontal: 10,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    backgroundColor: '#FFFFFF',
  },
  otpInputFilled: {
    borderColor: '#FB5407',
    backgroundColor: '#FFF5F0',
  },
  verifyButton: {
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
  verifyButtonDisabled: {
    backgroundColor: '#CCCCCC',
    shadowOpacity: 0,
    elevation: 0,
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
