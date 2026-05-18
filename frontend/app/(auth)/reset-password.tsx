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
  useColorScheme,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";

export default function ResetPasswordScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Refs for scrolling
  const scrollViewRef = useRef<ScrollView>(null);
  const newPasswordRef = useRef<View>(null);
  const confirmPasswordRef = useRef<View>(null);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

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
        () => {}
      );
    }, 100);
  };

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
  }, []);

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

        {/* Form Container */}
        <Animated.View
          className="px-6 py-10 bg-white dark:bg-slate-900 rounded-3xl w-[95%] mx-auto -mt-40 shadow-lg shadow-black/25 dark:border dark:border-slate-800 elevation-5"
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
            
          <Text className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-2">
            RESET PASSWORD
          </Text>
          <Text className="text-sm text-[#7C7C7C] dark:text-slate-400 text-center mb-10">
            Enter your new secure password below
          </Text>

          {/* Form Fields */}
          <View>
            <View ref={newPasswordRef} className="mb-6">
              <TextInput
                placeholder="New password"
                value={newPassword}
                onChangeText={setNewPassword}
                onFocus={() => scrollToInput(newPasswordRef)}
                className="border border-orange-500 rounded-full px-6 py-4 text-base text-slate-900 dark:text-white bg-white dark:bg-slate-800"
                secureTextEntry
                placeholderTextColor={isDark ? "#64748B" : "#9CA3AF"}
              />
            </View>

            <View ref={confirmPasswordRef} className="mb-8">
              <TextInput
                placeholder="Confirm password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                onFocus={() => scrollToInput(confirmPasswordRef)}
                className="border border-orange-500 rounded-full px-6 py-4 text-base text-slate-900 dark:text-white bg-white dark:bg-slate-800"
                secureTextEntry
                placeholderTextColor={isDark ? "#64748B" : "#9CA3AF"}
              />
            </View>

            <TouchableOpacity
              onPress={() => router.replace("/(auth)/login")}
              className="bg-[#FB5607] rounded-full py-4 items-center shadow-lg shadow-orange-500/30 elevation-5"
              activeOpacity={0.8}
            >
              <Text className="text-white text-lg font-bold">
                CHANGE PASSWORD
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
