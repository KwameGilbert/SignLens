import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import FormInput from "../../components/ui/FormInput";

export default function LoginScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView 
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

      {/* Login form */}
      <View className="px-6 py-8 bg-white dark:bg-slate-900 rounded-3xl w-[95%] mx-auto -mt-40 shadow-lg shadow-black/25 dark:border dark:border-slate-800 elevation-5">
        <Text className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-2">Login</Text>
        <Text className="text-base text-slate-500 dark:text-slate-400 text-center mb-6">
          Welcome back! Please login to continue
        </Text>

        {/* Form inputs */}
        <FormInput
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />

        <FormInput
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoComplete="password"
        />

        <View className="flex-row justify-end mb-6">
          <TouchableOpacity
            onPress={() => router.push("/(auth)/forgot-password")}
          >
            <Text className="text-primary font-semibold">
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => router.replace("/(tabs)/home")}
          className="bg-primary dark:bg-primary rounded-xl px-4 py-4 mb-4 shadow-md shadow-[#FB5607]/40"
        >
          <Text className="text-white text-center text-lg font-bold">
            Login
          </Text>
        </TouchableOpacity>

        <View className="flex-row justify-center gap-4 mb-6">
          <TouchableOpacity className="flex-1 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl p-3 items-center shadow-sm">
            <Ionicons name="logo-google" size={24} color="#FB5607" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-1 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl p-3 items-center shadow-sm">
            <Ionicons name="logo-apple" size={24} color={isDark ? "#FFFFFF" : "#000000"} />
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-center gap-2">
          <Text className="text-base text-slate-600 dark:text-slate-400 font-medium">
            Don&apos;t have an account?
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/(auth)/signup")}
          >
            <Text className="text-base font-bold text-primary">
              Create one
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
