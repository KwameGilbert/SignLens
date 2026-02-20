import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  // Refs for scrolling
  const scrollViewRef = useRef<ScrollView>(null);
  const emailRef = useRef<View>(null);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const iconScale = useRef(new Animated.Value(0)).current;
  const iconPulse = useRef(new Animated.Value(1)).current;

  const scrollToInput = (ref: React.RefObject<View | null>) => {
    setTimeout(() => {
      ref.current?.measureLayout(
        scrollViewRef.current as any,
        (x, y) => {
          scrollViewRef.current?.scrollTo({
            y: y - 100,
            animated: true,
          });
        },
        () => {},
      );
    }, 100);
  };

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
      ]),
    ).start();
  }, [fadeAnim, iconPulse, iconScale, slideAnim]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScrollView
        ref={scrollViewRef}
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        <Stack.Screen options={{ headerShown: false }} />
        <StatusBar style="light" />

        {/* Header section */}
        <View className="flex-row justify-between px-6 pt-16 h-[40vh] overflow-hidden">
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

        <View className="flex-1 items-center justify-center bg-white px-6 py-10 rounded-3xl w-[95%] mx-auto -mt-40 shadow-lg shadow-black/25 elevation-5">
          <View className="bg-orange-100 h-20 w-20 p-2 rounded-full flex items-center justify-center">
            <Ionicons name="key-outline" size={40} color="orange" />
          </View>

          <Text className="text-2xl font-bold mt-4">Reset Password</Text>
          <Text className="text-gray-600 mt-2 text-center text-lg px-4">
            Enter your email address and we&apos;ll send you a link to reset
            your password
          </Text>

          {/* form */}
          <View className="mt-5">
            <TextInput
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              onFocus={() => scrollToInput(emailRef)}
              className="border border-orange-500 rounded-full px-4 w-80 h-16"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />

            <TouchableOpacity
              onPress={() => router.push("/(auth)/otp-verification")}
              className="w-80 h-16 items-center justify-center z-10 bg-orange-500 rounded-full mt-5"
              activeOpacity={0.7}
            >
              <Text className="text-white text-xl font-bold">Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
