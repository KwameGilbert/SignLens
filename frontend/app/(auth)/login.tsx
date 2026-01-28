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

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Refs for scrolling
  const scrollViewRef = useRef<ScrollView>(null);
  const emailRef = useRef<View>(null);
  const passwordRef = useRef<View>(null);

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
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView 
        ref={scrollViewRef}
        className="flex-1 bg-white"
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

      {/* Login form */}
      <Animated.View className="px-6 py-10 bg-white rounded-3xl w-[95%] mx-auto -mt-40 shadow-lg shadow-black/25 elevation-5">
        <Text className="text-3xl font-bold text-center mb-6">LOGIN</Text>
        <Text className="text-lg text-[#7C7C7C] text-center mb-2">
          Welcome back! Please login to continue
        </Text>

        {/* forms  */}
        <Animated.View>
          <View ref={emailRef} className="mt-4">
            <Text className="text-lg font-semibold mb-2">Email</Text>
            <TextInput
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              onFocus={() => scrollToInput(emailRef)}
              className="border border-orange-500 rounded-full px-4 py-4"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          <View ref={passwordRef} className="mt-6">
            <Text className="text-lg font-semibold mb-2">Password</Text>
            <TextInput
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              onFocus={() => scrollToInput(passwordRef)}
              className="border border-orange-500 rounded-full px-4 py-4"
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password"
            />
          </View>

          <View className="flex-row justify-end mt-4">
            <TouchableOpacity
              onPress={() => router.push("/(auth)/forgot-password")}
            >
              <Text className="text-lg font-semibold mb-2">
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => router.replace("/(tabs)/home")}
            className="bg-[#FB5607] rounded-full px-4 py-4 mt-4"
          >
            <Text className="text-white text-center text-2xl font-semibold">
              Login
            </Text>
          </TouchableOpacity>

          <View className="flex-row justify-center gap-10 mt-6">
            <TouchableOpacity className="bg-white border border-orange-500 rounded-full p-4">
             <Ionicons name="logo-google" size={24} color="black" />
            </TouchableOpacity>

            <TouchableOpacity className="bg-white border border-orange-500 rounded-full p-4">
             <Ionicons name="logo-apple" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-center mt-6 gap-2">
            <Text className="text-lg text-[#474746] font-semibold">
              Don&apos;t have an account?
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(auth)/signup")}
            >
              <Text className="text-lg font-semibold text-[#FB5607]">
                Create one
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View> 
      </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
