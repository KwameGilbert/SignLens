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

export default function EditProfileScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [name, setName] = useState("Afriyie Anthony");
  const [email, setEmail] = useState("afriyie@signlens.io");
  const [bio, setBio] = useState("Passionate sign language learner from Ghana! Dedicated to mastering GHSL.");
  const [location, setLocation] = useState("Accra, Ghana");
  const [isSaving, setIsSaving] = useState(false);

  // Profile Avatar Switcher State
  const [avatarIcon, setAvatarIcon] = useState("person");
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const availableAvatars = [
    { name: "person", color: "#3B82F6", bg: "bg-blue-50 dark:bg-blue-950/40" },
    { name: "happy", color: "#10B981", bg: "bg-green-50 dark:bg-green-950/40" },
    { name: "school", color: "#8B5CF6", bg: "bg-purple-50 dark:bg-purple-950/40" },
    { name: "planet", color: "#06B6D4", bg: "bg-cyan-50 dark:bg-cyan-950/40" },
    { name: "heart", color: "#EC4899", bg: "bg-pink-50 dark:bg-pink-950/40" },
    { name: "rocket", color: "#F59E0B", bg: "bg-amber-50 dark:bg-amber-950/40" },
    { name: "star", color: "#EAB308", bg: "bg-yellow-50 dark:bg-yellow-950/40" },
    { name: "color-wand", color: "#6366F1", bg: "bg-indigo-50 dark:bg-indigo-950/40" },
  ];

  const selectedAvatarObj = availableAvatars.find((a) => a.name === avatarIcon) || availableAvatars[0];

  const handleSelectAvatar = (iconName: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setAvatarIcon(iconName);
    setShowAvatarModal(false);
  };

  const handleSave = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      router.back();
    }, 1000);
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
        <Text className="text-white text-xl font-bold tracking-wide">Edit Profile</Text>
        <TouchableOpacity
          onPress={handleSave}
          disabled={isSaving}
          className="bg-white px-4 py-2 rounded-full shadow-sm"
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="#FB5607" />
          ) : (
            <Text className="text-[#FB5607] font-bold text-sm uppercase tracking-wider">Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 px-5 pt-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/* Avatar Photo Editor */}
        <Animated.View entering={FadeInUp.duration(600).springify()} className="items-center mb-4">
          <View className="relative">
            <View className={`w-32 h-32 rounded-full border-4 border-white dark:border-slate-800 shadow-xl shadow-black/20 overflow-hidden ${selectedAvatarObj.bg} items-center justify-center`}>
              <Ionicons name={avatarIcon as any} size={70} color={selectedAvatarObj.color} />
            </View>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setShowAvatarModal(true);
              }}
              className="absolute bottom-1 right-1 bg-[#FB5607] w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 items-center justify-center shadow-lg"
            >
              <Ionicons name="camera" size={20} color="white" />
            </TouchableOpacity>
          </View>
          <Text className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mt-3">
            Tap camera to change photo
          </Text>
        </Animated.View>

        {/* Input Fields Form */}
        <Animated.View entering={FadeInDown.duration(600).delay(200).springify()}>
          <View className="mb-3">
            <Text className="text-slate-700 dark:text-slate-300 font-bold text-sm mb-1 ml-1 uppercase tracking-wider">
              Full Name
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Enter your full name"
              placeholderTextColor={isDark ? "#64748B" : "#94A3B8"}
              className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 font-semibold text-slate-900 dark:text-white text-base shadow-sm shadow-black/5"
            />
          </View>

          <View className="mb-3">
            <Text className="text-slate-700 dark:text-slate-300 font-bold text-sm mb-1 ml-1 uppercase tracking-wider">
              Email Address
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="Enter your email"
              placeholderTextColor={isDark ? "#64748B" : "#94A3B8"}
              className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 font-semibold text-slate-900 dark:text-white text-base shadow-sm shadow-black/5"
            />
          </View>

          <View className="mb-3">
            <Text className="text-slate-700 dark:text-slate-300 font-bold text-sm mb-1 ml-1 uppercase tracking-wider">
              Location
            </Text>
            <TextInput
              value={location}
              onChangeText={setLocation}
              placeholder="City, Country"
              placeholderTextColor={isDark ? "#64748B" : "#94A3B8"}
              className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 font-semibold text-slate-900 dark:text-white text-base shadow-sm shadow-black/5"
            />
          </View>

          <View className="mb-8">
            <View className="flex-row justify-between items-center mb-1 ml-1">
              <Text className="text-slate-700 dark:text-slate-300 font-bold text-sm uppercase tracking-wider">
                Personal Bio
              </Text>
              <Text className="text-slate-400 text-xs font-semibold">{bio.length}/150</Text>
            </View>
            <TextInput
              value={bio}
              onChangeText={setBio}
              multiline
              maxLength={150}
              textAlignVertical="top"
              placeholder="Write a brief bio about your sign language journey..."
              placeholderTextColor={isDark ? "#64748B" : "#94A3B8"}
              className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 font-medium text-slate-900 dark:text-white text-base leading-6 h-28 shadow-sm shadow-black/5"
            />
          </View>

          <TouchableOpacity
            onPress={handleSave}
            disabled={isSaving}
            className={`py-4 rounded-2xl items-center flex-row justify-center shadow-lg ${isSaving ? "bg-slate-300 dark:bg-slate-800" : "bg-[#FB5607] shadow-[#FB5607]/40"}`}
          >
            {isSaving ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-lg">Save Changes</Text>
            )}
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>

      {/* Change Photo / Avatar Selector Backdrop Overlay */}
      {showAvatarModal && (
        <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/70 justify-end px-4 pb-10 z-50 backdrop-blur-md">
          <Animated.View entering={FadeInDown.duration(400).springify()} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-white/20 shadow-2xl">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-extrabold text-slate-900 dark:text-white">
                Choose Profile Avatar
              </Text>
              <TouchableOpacity
                onPress={() => setShowAvatarModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center"
              >
                <Ionicons name="close" size={18} color={isDark ? "white" : "black"} />
              </TouchableOpacity>
            </View>

            <View className="flex-row flex-wrap justify-around gap-y-6 mb-8">
              {availableAvatars.map((item) => (
                <TouchableOpacity
                  key={item.name}
                  onPress={() => handleSelectAvatar(item.name)}
                  className={`w-16 h-16 rounded-2xl ${avatarIcon === item.name ? "border-4 border-slate-900 dark:border-white shadow-lg" : "border border-slate-200 dark:border-slate-700"} ${item.bg} items-center justify-center`}
                >
                  <Ionicons name={item.name as any} size={32} color={item.color} />
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              onPress={() => setShowAvatarModal(false)}
              className="w-full bg-slate-100 dark:bg-slate-800 py-4 rounded-2xl items-center border border-slate-200 dark:border-slate-700"
            >
              <Text className="text-slate-700 dark:text-slate-300 font-bold text-base uppercase tracking-wider">Cancel</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}
