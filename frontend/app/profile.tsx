import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch,
  Alert,
  useColorScheme,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import Animated, { FadeInUp, FadeInDown } from "react-native-reanimated";

const { width } = Dimensions.get("window");

export default function ProfileScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [isPrivate, setIsPrivate] = useState(false);
  const [biometrics, setBiometrics] = useState(true);

  const handleLogout = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert("Sign Out", "Are you sure you want to log out of SignLens?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: () => {
          router.replace("/welcome");
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-[#F2F2EA] dark:bg-slate-950">
      <StatusBar style="light" />

      {/* Premium Hero Section */}
      <Animated.View
        entering={FadeInUp.duration(700).springify()}
        className="pt-14 pb-5 px-6 rounded-b-[30px] overflow-hidden relative shadow-xl shadow-black/20"
      >
        {/* Background Image */}
        <Image
          source={require("../assets/images/welcome_bg.png")}
          style={StyleSheet.absoluteFillObject}
          contentFit="cover"
        />

        {/* Orange Gradient Overlay */}
        <LinearGradient
          colors={["rgba(251, 84, 7, 0.95)", "rgba(251, 84, 7, 0.88)", "rgba(234, 88, 12, 0.95)"]}
          style={StyleSheet.absoluteFillObject}
        />

        {/* Header Bar */}
        <View className="flex-row justify-between items-center mb-3 relative z-10">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-11 h-11 bg-white/20 rounded-full justify-center items-center border border-white/30 backdrop-blur-md"
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold tracking-wide">My Profile</Text>
          <TouchableOpacity
            onPress={() => {
              Haptics.selectionAsync();
              router.push("/edit-profile");
            }}
            className="w-11 h-11 bg-white/20 rounded-full justify-center items-center border border-white/30 backdrop-blur-md"
          >
            <Ionicons name="create-outline" size={22} color="white" />
          </TouchableOpacity>
        </View>

        {/* User Info & Avatar */}
        <View className="items-center relative z-10">
          <View className="relative mb-2">
            <View className="w-20 h-20 rounded-full border-2 border-white overflow-hidden shadow-lg shadow-black/30 bg-white/30 items-center justify-center">
              <Ionicons name="person" size={40} color="white" />
            </View>
            <View className="absolute bottom-1 right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-white items-center justify-center shadow-md">
              <Ionicons name="checkmark" size={12} color="white" />
            </View>
          </View>

          <Text className="text-white text-2xl font-extrabold tracking-wide mb-1">
            Afriyie Anthony
          </Text>
          <Text className="text-white/80 text-sm font-medium mb-2">
            afriyie@signlens.io
          </Text>
        </View>
      </Animated.View>

      <ScrollView
        className="flex-1 px-5 pt-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        {/* Statistics Grid */}
        <Animated.View entering={FadeInDown.duration(600).delay(200).springify()} className="mb-3">
          <Text className="text-slate-800 dark:text-white font-bold text-lg mb-2 ml-1">
            Learning Milestones
          </Text>

          <View className="flex-row justify-between gap-2">
            <View className="flex-1 bg-white dark:bg-slate-900 px-2 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm shadow-black/5 items-center">
              <View className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-950/40 items-center justify-center mb-2">
                <MaterialCommunityIcons name="fire" size={24} color="#FB5607" />
              </View>
              <Text className="text-2xl font-extrabold text-slate-900 dark:text-white">12</Text>
              <Text className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Day Streak</Text>
            </View>

            <View className="flex-1 bg-white dark:bg-slate-900 px-2 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm shadow-black/5 items-center">
              <View className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950/40 items-center justify-center mb-2">
                <Ionicons name="hand-left" size={22} color="#3B82F6" />
              </View>
              <Text className="text-2xl font-extrabold text-slate-900 dark:text-white">156</Text>
              <Text className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Signs Learnt</Text>
            </View>

            <View className="flex-1 bg-white dark:bg-slate-900 px-2 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm shadow-black/5 items-center">
              <View className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-950/40 items-center justify-center mb-2">
                <Ionicons name="trophy" size={20} color="#10B981" />
              </View>
              <Text className="text-2xl font-extrabold text-slate-900 dark:text-white">82%</Text>
              <Text className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Completion</Text>
            </View>
          </View>
        </Animated.View>

        {/* Trophies Section */}
        <Animated.View entering={FadeInDown.duration(600).delay(300).springify()} className="mb-6">
          <View className="flex-row justify-between items-center mb-2 px-1">
            <Text className="text-slate-800 dark:text-white font-bold text-lg">
              Earned Badges
            </Text>
            <TouchableOpacity
              onPress={() => {
                Haptics.selectionAsync();
                router.push("/badges");
              }}
            >
              <Text className="text-[#FB5607] text-xs font-bold uppercase tracking-wider">View All (6)</Text>
            </TouchableOpacity>
          </View>

          <View className="bg-white dark:bg-slate-900 px-4 py-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm shadow-black/5 flex-row justify-around">
            <View className="items-center">
              <View className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 items-center justify-center mb-2 shadow-sm">
                <Ionicons name="ribbon" size={30} color="#F59E0B" />
              </View>
              <Text className="text-xs font-bold text-slate-800 dark:text-slate-200">First Sign</Text>
            </View>

            <View className="items-center">
              <View className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 items-center justify-center mb-2 shadow-sm">
                <MaterialCommunityIcons name="fire" size={32} color="#FB5607" />
              </View>
              <Text className="text-xs font-bold text-slate-800 dark:text-slate-200">7 Days</Text>
            </View>

            <View className="items-center">
              <View className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 items-center justify-center mb-2 shadow-sm">
                <Ionicons name="flash" size={30} color="#8B5CF6" />
              </View>
              <Text className="text-xs font-bold text-slate-800 dark:text-slate-200">Lightning</Text>
            </View>

            <View className="items-center opacity-40">
              <View className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 items-center justify-center mb-2 shadow-sm">
                <Ionicons name="lock-closed" size={24} color="#94A3B8" />
              </View>
              <Text className="text-xs font-bold text-slate-400">Master</Text>
            </View>
          </View>
        </Animated.View>

        {/* Security & Preferences */}
        <Animated.View entering={FadeInDown.duration(600).delay(400).springify()} className="mb-4">
          <Text className="text-slate-800 dark:text-white font-bold text-lg mb-2 ml-1">
            Account Security
          </Text>

          <View className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm shadow-black/5 overflow-hidden">
            <View className="flex-row items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800/80">
              <View className="flex-row items-center flex-1 mr-3">
                <View className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 items-center justify-center mr-3">
                  <Ionicons name="shield-checkmark" size={20} color="#FB5607" />
                </View>
                <View className="flex-1">
                  <Text className="text-slate-900 dark:text-white font-bold text-base" numberOfLines={1}>Private Profile</Text>
                  <Text className="text-slate-400 text-xs" numberOfLines={1}>Hide progress from leaderboards</Text>
                </View>
              </View>
              <View className="justify-center items-end min-w-[52px]">
                <Switch
                  value={isPrivate}
                  onValueChange={(val) => {
                    Haptics.selectionAsync();
                    setIsPrivate(val);
                  }}
                  trackColor={{ false: isDark ? "#374151" : "#E5E7EB", true: "#FB5607" }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>

            <View className="flex-row items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800/80">
              <View className="flex-row items-center flex-1 mr-3">
                <View className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 items-center justify-center mr-3">
                  <Ionicons name="finger-print" size={20} color="#3B82F6" />
                </View>
                <View className="flex-1">
                  <Text className="text-slate-900 dark:text-white font-bold text-base" numberOfLines={1}>Biometric Login</Text>
                  <Text className="text-slate-400 text-xs" numberOfLines={1}>Use FaceID / TouchID to login</Text>
                </View>
              </View>
              <View className="justify-center items-end min-w-[52px]">
                <Switch
                  value={biometrics}
                  onValueChange={(val) => {
                    Haptics.selectionAsync();
                    setBiometrics(val);
                  }}
                  trackColor={{ false: isDark ? "#374151" : "#E5E7EB", true: "#3B82F6" }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={() => {
                Haptics.selectionAsync();
                router.push("/change-password");
              }}
              className="flex-row items-center justify-between p-4"
            >
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 items-center justify-center mr-3">
                  <Ionicons name="key" size={20} color="#8B5CF6" />
                </View>
                <Text className="text-slate-900 dark:text-white font-bold text-base">Change Password</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Logout Button */}
        <Animated.View entering={FadeInDown.duration(600).delay(500).springify()}>
          <TouchableOpacity
            onPress={handleLogout}
            activeOpacity={0.8}
            className="bg-red-500 dark:bg-red-950/30 border border-red-200 dark:border-red-800 py-4 rounded-2xl items-center flex-row justify-center mb-4"
          >
            <Ionicons name="log-out" size={22} color="white" style={{ marginRight: 8 }} />
            <Text className="text-white font-bold text-lg">Log Out</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
