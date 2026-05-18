import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  useColorScheme,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";

export default function OTPVerificationScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const iconScale = useRef(new Animated.Value(0)).current;

  // Individual input animations
  const inputAnims = useRef(
    [...Array(5)].map(() => new Animated.Value(0))
  ).current;

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
    Animated.stagger(
      80,
      inputAnims.map((anim) =>
        Animated.spring(anim, {
          toValue: 1,
          tension: 60,
          friction: 7,
          useNativeDriver: true,
        })
      )
    ).start();
  }, [fadeAnim, slideAnim, iconScale, inputAnims]);

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
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 bg-[#F2F2EA] dark:bg-slate-950"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        <Stack.Screen options={{ headerShown: false }} />
        <StatusBar style="light" />

        {/* Header section */}
        <View className="flex-row justify-between px-6 pt-16 h-[40vh] overflow-hidden -mt-10">
          {/* Background Image */}
          <Image
            source={require("../../assets/images/welcome_bg.png")}
            style={StyleSheet.absoluteFillObject}
            contentFit="cover"
          />

          {/* Orange Gradient Overlay */}
          <LinearGradient
            colors={[
              "rgba(251, 84, 7, 0.91)",
              "rgba(251, 84, 7, 0.91)",
              "rgba(251, 84, 7, 0.91)",
            ]}
            style={StyleSheet.absoluteFillObject}
          />

          {/* Back Button */}
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center z-10"
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <Animated.View
          className="flex-1 justify-center px-8 pb-20"
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {/* OTP Card */}
          <View className="bg-white dark:bg-slate-900 -mt-40 rounded-3xl px-6 py-10 shadow-lg shadow-black/25 dark:border dark:border-slate-800 elevation-5">
            {/* Icon */}
            <View className="items-center mb-6">
              <Animated.View
                className="w-20 h-20 rounded-full bg-orange-100 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/60 justify-center items-center"
                style={{
                  transform: [{ scale: iconScale }],
                }}
              >
                <Ionicons name="checkmark" size={50} color="#FB5607" />
              </Animated.View>
            </View>

            {/* Title */}
            <Text className="text-2xl font-bold text-[#1F2937] dark:text-white text-center mb-2">
              OTP Verification
            </Text>
            <Text className="text-sm text-[#6B7280] dark:text-slate-400 text-center px-5">
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
                    ref={(ref) => {
                      inputRefs.current[index] = ref;
                    }}
                    className={`w-[50px] h-[50px] rounded-xl border text-2xl font-semibold text-center text-[#1F2937] dark:text-white ${
                      digit
                        ? "border-[#FB5607] bg-orange-50 dark:bg-orange-950/40"
                        : "border-[#E5E7EB] dark:border-slate-700 bg-[#F9FAFB] dark:bg-slate-800 text-slate-900 dark:text-white"
                    }`}
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
              onPress={() => router.replace("/(auth)/reset-password")}
              className={`mt-10 rounded-full py-4 items-center shadow-lg ${
                otp.every((d) => d)
                  ? "bg-[#FB5607] shadow-[#FB5607]/30 elevation-8"
                  : "bg-[#FFBca0] dark:bg-slate-800 dark:border dark:border-slate-700 shadow-none elevation-0"
              }`}
              disabled={!otp.every((d) => d)}
              activeOpacity={0.9}
            >
              <Text className={`text-lg font-bold ${otp.every((d) => d) ? "text-white" : "text-white dark:text-slate-500"}`}>Verify</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
