import { View, Text, ScrollView, TouchableOpacity, Switch, useColorScheme, StyleSheet } from "react-native";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { BlurView } from "expo-blur";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import GlassCard from "../../components/ui/GlassCard";
import SectionTitle from "../../components/ui/SectionTitle";

type ToggleRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
};

function ToggleRow({ icon, title, subtitle, value, onValueChange }: ToggleRowProps) {
  return (
    <View className="flex-row items-center py-2.5">
      <View className="w-11 h-11 rounded-xl bg-[#FB5607]/20 items-center justify-center mr-3">
        <Ionicons name={icon} size={20} color="#FB5607" />
      </View>

      <View className="flex-1">
        <Text className="text-slate-900 dark:text-white text-base font-semibold">{title}</Text>
        <Text className="text-slate-500 dark:text-slate-300 text-xs">{subtitle}</Text>
      </View>

      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#D1D5DB", true: "#FDBA74" }}
        thumbColor={value ? "#F97316" : "#9CA3AF"}
      />
    </View>
  );
}

type InfoRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: string;
};

function InfoRow({ icon, title, value }: InfoRowProps) {
  return (
    <View className="flex-row items-center py-2.5">
      <View className="w-11 h-11 rounded-xl bg-[#FB5607]/20 items-center justify-center mr-3">
        <Ionicons name={icon} size={20} color="#FB5607" />
      </View>

      <Text className="flex-1 text-slate-900 dark:text-white text-base font-semibold">{title}</Text>
      <Text className="text-slate-500 dark:text-slate-300 text-sm">{value}</Text>
    </View>
  );
}

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const isDark = colorScheme === "dark";
  const blurTint = isDark ? "dark" : "light";

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [offlineEnabled, setOfflineEnabled] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  return (
    <View className="flex-1 bg-[#F2F2EA] dark:bg-slate-950">
      <StatusBar style={isDark ? "light" : "dark"} />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 28 }}
      >
        <View className="rounded-b-[30px] overflow-hidden relative">
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

          {/* Content */}
          <View className="relative z-10 px-5 pt-14 pb-8">
            <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white text-3xl font-bold">Settings</Text>
            <TouchableOpacity
              onPress={() => router.push("/profile")}
              className="w-10 h-10 rounded-full border border-white/35 bg-white/20 items-center justify-center"
            >
              <Ionicons name="person-outline" size={22} color="white" />
            </TouchableOpacity>
          </View>

          <View className="rounded-2xl overflow-hidden border border-white/35">
            <BlurView intensity={35} tint={blurTint} className="px-4 py-3">
              <View className="flex-row items-center justify-around">
                <View className="items-center">
                  <View className="w-9 h-9 rounded-lg bg-white/20 items-center justify-center mb-1.5">
                    <MaterialCommunityIcons name="fire" size={20} color="white" />
                  </View>
                  <Text className="text-white text-xl font-bold">12</Text>
                  <Text className="text-white/80 text-xs">Days</Text>
                </View>

                <View className="items-center">
                  <View className="w-9 h-9 rounded-lg bg-white/20 items-center justify-center mb-1.5">
                    <Ionicons name="hand-left-outline" size={20} color="white" />
                  </View>
                  <Text className="text-white text-xl font-bold">156</Text>
                  <Text className="text-white/80 text-xs">Signs</Text>
                </View>

                <View className="items-center">
                  <View className="w-9 h-9 rounded-lg bg-white/20 items-center justify-center mb-1.5">
                    <Ionicons name="time-outline" size={20} color="white" />
                  </View>
                  <Text className="text-white text-xl font-bold">12</Text>
                  <Text className="text-white/80 text-xs">Hours</Text>
                </View>
              </View>
            </BlurView>
          </View>
          </View>
        </View>

        <View className="px-4 mt-6">
          <GlassCard className="mb-4" intensityLight={55} intensityDark={26}>
              <SectionTitle title="Preferences" className="mb-1" />

              <ToggleRow
                icon="notifications"
                title="Notifications"
                subtitle="Push notifications"
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
              />
              <ToggleRow
                icon="volume-high"
                title="Voice Output"
                subtitle="Audio feedback"
                value={voiceEnabled}
                onValueChange={setVoiceEnabled}
              />
              <ToggleRow
                icon="cloud-download"
                title="Offline Mode"
                subtitle="Download content"
                value={offlineEnabled}
                onValueChange={setOfflineEnabled}
              />
              <ToggleRow
                icon="moon"
                title="Dark Mode"
                subtitle="Theme preference"
                value={darkModeEnabled}
                onValueChange={setDarkModeEnabled}
              />
          </GlassCard>

          <GlassCard intensityLight={55} intensityDark={26}>
              <SectionTitle title="General" className="mb-1" />

              <InfoRow icon="language" title="Language" value="English" />
              <InfoRow icon="globe-outline" title="Region" value="Ghana" />
              <InfoRow icon="information-circle-outline" title="App Version" value="1.0.0" />
          </GlassCard>
        </View>
      </ScrollView>
    </View>
  );
}
