
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import HomeHeader from "../../components/home/HomeHeader";
import QuickActionButton from "../../components/home/QuickActionButton";
import AchievementItem from "../../components/home/AchievementItem";

export default function HomeScreen() {
  return (
    <ScrollView
      className="flex-1 bg-[#FDFDFD]"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <StatusBar style="light" />

      <HomeHeader />

      {/* Quick Action Section */}
      <View className="px-6 mt-8">
        <Text className="text-xl font-bold text-gray-900 mb-4 px-1">
          Quick Action
        </Text>
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
            color="#FB5607"
            iconLib="MaterialCommunityIcons"
          />
          <QuickActionButton
            icon="microphone-outline"
            label="Voice to Sign"
            desc="Speak & convert"
            color="#FB5607"
            iconLib="MaterialCommunityIcons"
          />
          <QuickActionButton
            icon="book-open-outline"
            label="Learn"
            desc="Practice Signs"
            color="#FB5607"
            iconLib="Ionicons"
            route="/(tabs)/learn"
          />
        </View>
      </View>

      {/* Recent Achievements */}
      <View className="px-6 mt-2">
        <View className="flex-row justify-between items-center mb-4 px-1">
          <Text className="text-xl font-bold text-gray-900">
            Recent Achievements
          </Text>
          <TouchableOpacity>
            <Text className="text-[#FB5607] font-semibold">View all</Text>
          </TouchableOpacity>
        </View>

        <View className="bg-white rounded-3xl p-4 shadow-sm shadow-black/10 elevation-2">
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
            iconColor="#FB5607"
          />
        </View>
      </View>
    </ScrollView>
  );
}
