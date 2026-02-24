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
    <View className="flex-1 bg-white">
      <AnimatedBackground />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <StatusBar style={isDark ? "light" : "dark"} />

        <HomeHeader />

        {/* Quick Action Section */}
        <View className="px-6 mt-6">
          <SectionTitle title="Quick Actions" className="px-1 mb-4" />
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
            />
            <QuickActionButton
              icon="microphone-outline"
              label="Voice to Sign"
              desc="Speak & convert"
              color="#EA580C"
              iconLib="MaterialCommunityIcons"
            />
            <QuickActionButton
              icon="book"
              label="Learn"
              desc="Practice Signs"
              color="#C2410C"
              iconLib="Ionicons"
              route="/(tabs)/learn"
            />
          </View>
        </View>

        {/* Recent Achievements */}
        <View className="px-6 mt-1">
          <View className="flex-row justify-between items-center mb-4 px-1">
            <SectionTitle title="Recent Achievements" />
            <TouchableOpacity>
              <Text className="text-[#FB5607] font-semibold dark:text-[#ffbe0b]">View all</Text>
            </TouchableOpacity>
          </View>

          <GlassCard intensityLight={60} intensityDark={30}>
              <AchievementItem
                IconComponent={Ionicons}
                icon="ribbon"
                title="First sign"
                subtitle="Unlocked recently"
                iconColor="#FFC107"
              />
              <AchievementItem
                IconComponent={MaterialCommunityIcons}
                icon="fire"
                title="7 day streak"
                subtitle="Unlocked recently"
                iconColor="#FB5607"
              />
              <AchievementItem
                IconComponent={Ionicons}
                icon="flash"
                title="Quick Learner"
                subtitle="Unlocked recently"
                iconColor="#F97316"
              />
          </GlassCard>
        </View>
      </ScrollView>
    </View>
  );
}
