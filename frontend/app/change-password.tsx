import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInUp, FadeInDown } from "react-native-reanimated";

export default function ChangePasswordScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Calculate Password Strength: 0 to 4
  const getStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const strength = getStrength(newPass);

  const strengthColors = ["#EF4444", "#F59E0B", "#3B82F6", "#10B981"];
  const strengthLabels = ["Weak", "Fair", "Good", "Excellent"];

  const handleUpdatePassword = () => {
    if (!currentPass || !newPass || !confirmPass) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    if (newPass !== confirmPass) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setIsUpdating(true);

    setTimeout(() => {
      setIsUpdating(false);
      router.back();
    }, 1200);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-[#F2F2EA] dark:bg-slate-950"
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Premium Header */}
      <View className="pt-14 pb-4 px-6 bg-[#FB5607] rounded-b-[28px] flex-row justify-between items-center shadow-lg shadow-black/20 z-10">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-11 h-11 bg-white/20 rounded-full justify-center items-center border border-white/30 backdrop-blur-md"
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold tracking-wide">Change Password</Text>
        <View className="w-11 h-11" />
      </View>

      <ScrollView
        className="flex-1 px-5 pt-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/* Shield Icon Graphic */}
        <Animated.View entering={FadeInUp.duration(600).springify()} className="items-center mb-8">
          <View className="w-28 h-28 rounded-full bg-orange-100 dark:bg-orange-950/40 border-4 border-white dark:border-slate-800 items-center justify-center shadow-lg mb-3">
            <Ionicons name="shield-checkmark" size={56} color="#FB5607" />
          </View>
          <Text className="text-slate-800 dark:text-white font-extrabold text-xl mb-1">
            Secure Your Account
          </Text>
          <Text className="text-slate-500 dark:text-slate-400 text-xs text-center px-4 leading-5">
            Ensure your account uses a strong, robust password to protect your learning progress.
          </Text>
        </Animated.View>

        {/* Input Form */}
        <Animated.View entering={FadeInDown.duration(600).delay(200).springify()}>
          {/* Current Password */}
          <View className="mb-5">
            <Text className="text-slate-700 dark:text-slate-300 font-bold text-sm mb-2 ml-1 uppercase tracking-wider">
              Current Password
            </Text>
            <View className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex-row items-center px-4 shadow-sm shadow-black/5">
              <TextInput
                value={currentPass}
                onChangeText={setCurrentPass}
                secureTextEntry={!showCurrent}
                placeholder="Enter current password"
                placeholderTextColor={isDark ? "#64748B" : "#94A3B8"}
                className="flex-1 py-4 font-medium text-slate-900 dark:text-white text-base"
              />
              <TouchableOpacity
                onPress={() => {
                  Haptics.selectionAsync();
                  setShowCurrent(!showCurrent);
                }}
                className="p-2"
              >
                <Ionicons name={showCurrent ? "eye-off" : "eye"} size={22} color="#94A3B8" />
              </TouchableOpacity>
            </View>
          </View>

          {/* New Password */}
          <View className="mb-4">
            <Text className="text-slate-700 dark:text-slate-300 font-bold text-sm mb-2 ml-1 uppercase tracking-wider">
              New Password
            </Text>
            <View className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex-row items-center px-4 shadow-sm shadow-black/5">
              <TextInput
                value={newPass}
                onChangeText={setNewPass}
                secureTextEntry={!showNew}
                placeholder="Enter new password (min. 8 chars)"
                placeholderTextColor={isDark ? "#64748B" : "#94A3B8"}
                className="flex-1 py-4 font-medium text-slate-900 dark:text-white text-base"
              />
              <TouchableOpacity
                onPress={() => {
                  Haptics.selectionAsync();
                  setShowNew(!showNew);
                }}
                className="p-2"
              >
                <Ionicons name={showNew ? "eye-off" : "eye"} size={22} color="#94A3B8" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Password Strength Indicator */}
          {newPass.length > 0 && (
            <View className="mb-6 px-1">
              <View className="flex-row justify-between items-center mb-1.5">
                <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Strength: <Text style={{ color: strengthColors[Math.max(0, strength - 1)] }}>{strengthLabels[Math.max(0, strength - 1)]}</Text>
                </Text>
                <Text className="text-xs text-slate-400 font-semibold">{strength}/4 Requirements</Text>
              </View>

              <View className="flex-row gap-1.5">
                {[1, 2, 3, 4].map((level) => (
                  <View
                    key={level}
                    className={`h-2 flex-1 rounded-full ${strength >= level ? "" : "bg-slate-200 dark:bg-slate-800"}`}
                    style={strength >= level ? { backgroundColor: strengthColors[strength - 1] } : undefined}
                  />
                ))}
              </View>
            </View>
          )}

          {/* Confirm Password */}
          <View className="mb-8">
            <Text className="text-slate-700 dark:text-slate-300 font-bold text-sm mb-2 ml-1 uppercase tracking-wider">
              Confirm New Password
            </Text>
            <View className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex-row items-center px-4 shadow-sm shadow-black/5">
              <TextInput
                value={confirmPass}
                onChangeText={setConfirmPass}
                secureTextEntry={!showConfirm}
                placeholder="Confirm your new password"
                placeholderTextColor={isDark ? "#64748B" : "#94A3B8"}
                className="flex-1 py-4 font-medium text-slate-900 dark:text-white text-base"
              />
              <TouchableOpacity
                onPress={() => {
                  Haptics.selectionAsync();
                  setShowConfirm(!showConfirm);
                }}
                className="p-2"
              >
                <Ionicons name={showConfirm ? "eye-off" : "eye"} size={22} color="#94A3B8" />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleUpdatePassword}
            disabled={isUpdating || !currentPass || !newPass || !confirmPass}
            className={`py-4 rounded-2xl items-center flex-row justify-center shadow-lg ${isUpdating || !currentPass || !newPass || !confirmPass ? "bg-slate-300 dark:bg-slate-800" : "bg-[#FB5607] shadow-[#FB5607]/40"}`}
          >
            {isUpdating ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-lg">Update Password</Text>
            )}
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
