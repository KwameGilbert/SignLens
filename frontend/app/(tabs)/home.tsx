import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import HomeHeader from "../../components/home/HomeHeader";
import QuickActionButton from "../../components/home/QuickActionButton";
import AchievementItem from "../../components/home/AchievementItem";
import AnimatedBackground from "../../components/ui/AnimatedBackground";
import GlassCard from "../../components/ui/GlassCard";
import SectionTitle from "../../components/ui/SectionTitle";

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View className="flex-1 bg-[#F2F2EA] dark:bg-slate-950">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <StatusBar style={isDark ? "light" : "dark"} />

        <HomeHeader />

        {/* Quick Action Section */}
        <View className="px-6 mt-3">
          <SectionTitle title="Quick Actions" className="px-1 mb-2" />
          <View className="flex-row flex-wrap justify-between">
            <QuickActionButton
              icon="camera-outline"
              label="Live camera"
              desc="Translate Signs"
              color="#FB5607"
              route="/(tabs)/camera"
            />
            <QuickActionButton
              icon="text"
              label="Text to Sign"
              desc="Convert Text"
              color="#F97316"
              iconLib="MaterialCommunityIcons"
              route="/text-to-sign"
            />
            <QuickActionButton
              icon="microphone-outline"
              label="Voice to Sign"
              desc="Speak & convert"
              color="#EA580C"
              iconLib="MaterialCommunityIcons"
              route="/voice-to-sign"
            />
            <QuickActionButton
              icon="book"
              label="Learn"
              desc="Practice Signs"
              color="#F97316"
              iconLib="Ionicons"
              route="/(tabs)/learn"
            />
          </View>
        </View>

        {/* Recent Achievements */}
        <View className="px-6 mt-1 mb-4">
          <View className="flex-row justify-between items-center mb-2 px-1">
            <SectionTitle title="Recent Achievements" />
            <TouchableOpacity>
              <Text className="text-[#FB5607] font-semibold dark:text-[#ffbe0b]">View all</Text>
            </TouchableOpacity>
          </View>

          <View className="bg-white dark:bg-slate-900 rounded-2xl px-4 py-8 shadow-sm shadow-black/5 border border-slate-200 dark:border-slate-800 items-center justify-center">
            <Text className="text-slate-500 dark:text-slate-400 text-sm font-medium">No recent achievements yet</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
