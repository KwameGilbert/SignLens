import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  useColorScheme,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import Animated, { FadeInUp, FadeInDown } from "react-native-reanimated";

const { width } = Dimensions.get("window");

type Badge = {
  id: string;
  title: string;
  desc: string;
  icon: string;
  iconLib: "Ionicons" | "MaterialCommunityIcons";
  color: string;
  bg: string;
  border: string;
  date?: string;
  unlocked: boolean;
  progress?: string;
};

const allBadges: Badge[] = [
  {
    id: "1",
    title: "First Sign",
    desc: "Translated your very first sign language gesture using live AI camera.",
    icon: "ribbon",
    iconLib: "Ionicons",
    color: "#F59E0B",
    bg: "bg-amber-50 dark:bg-amber-950/40",
    border: "border-amber-200 dark:border-amber-800",
    date: "May 12, 2026",
    unlocked: true,
  },
  {
    id: "2",
    title: "7-Day Streak",
    desc: "Maintained an active daily learning streak for 7 consecutive days.",
    icon: "fire",
    iconLib: "MaterialCommunityIcons",
    color: "#FB5607",
    bg: "bg-orange-50 dark:bg-orange-950/40",
    border: "border-orange-200 dark:border-orange-800",
    date: "May 15, 2026",
    unlocked: true,
  },
  {
    id: "3",
    title: "Quick Learner",
    desc: "Successfully completed 5 practice lessons with 100% perfect accuracy.",
    icon: "flash",
    iconLib: "Ionicons",
    color: "#8B5CF6",
    bg: "bg-purple-50 dark:bg-purple-950/40",
    border: "border-purple-200 dark:border-purple-800",
    date: "May 17, 2026",
    unlocked: true,
  },
  {
    id: "4",
    title: "Vocabulary Master",
    desc: "Learned and reviewed over 150 unique sign language gestures.",
    icon: "book",
    iconLib: "Ionicons",
    color: "#3B82F6",
    bg: "bg-blue-50 dark:bg-blue-950/40",
    border: "border-blue-200 dark:border-blue-800",
    date: "May 18, 2026",
    unlocked: true,
  },
  {
    id: "5",
    title: "30-Day Legend",
    desc: "Commit to continuous learning and practice everyday for a full month.",
    icon: "trophy",
    iconLib: "Ionicons",
    color: "#10B981",
    bg: "bg-slate-100 dark:bg-slate-800",
    border: "border-slate-300 dark:border-slate-700",
    unlocked: false,
    progress: "12 / 30 Days",
  },
  {
    id: "6",
    title: "Community Pioneer",
    desc: "Submit new regional sign language variations or participate in peer reviews.",
    icon: "earth",
    iconLib: "Ionicons",
    color: "#06B6D4",
    bg: "bg-slate-100 dark:bg-slate-800",
    border: "border-slate-300 dark:border-slate-700",
    unlocked: false,
    progress: "In Progress",
  },
];

export default function BadgesScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const handleSelectBadge = (b: Badge) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedBadge(b);
  };

  return (
    <View className="flex-1 bg-[#F2F2EA] dark:bg-slate-950">
      <StatusBar style="light" />

      {/* Premium Header */}
      <View className="pt-14 pb-8 px-6 bg-[#FB5607] rounded-b-[36px] shadow-lg shadow-black/20">
        <View className="flex-row justify-between items-center mb-6">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-11 h-11 bg-white/20 rounded-full justify-center items-center border border-white/30 backdrop-blur-md"
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold tracking-wide">Trophy Room</Text>
          <View className="w-11 h-11 rounded-full bg-white/10 border border-white/20 items-center justify-center">
            <Ionicons name="trophy" size={20} color="#FFD166" />
          </View>
        </View>

        <View className="items-center">
          <Text className="text-white/80 text-xs font-semibold uppercase tracking-widest mb-1">
            Total Accomplishments
          </Text>
          <Text className="text-white text-3xl font-extrabold tracking-wider">
            1,250 XP
          </Text>
          <View className="bg-white/20 px-4 py-1.5 rounded-full mt-3 border border-white/30 backdrop-blur-md">
            <Text className="text-white text-xs font-bold uppercase tracking-wider">
              4 / 6 Badges Unlocked
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-5 pt-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        <Text className="text-slate-800 dark:text-white font-bold text-lg mb-4 ml-1">
          All Achievements
        </Text>

        <View className="flex-row flex-wrap justify-between gap-y-4">
          {allBadges.map((badge, idx) => (
            <Animated.View
              key={badge.id}
              entering={FadeInDown.duration(500)
                .delay(idx * 100)
                .springify()}
              className="w-[48%]"
            >
              <TouchableOpacity
                onPress={() => handleSelectBadge(badge)}
                activeOpacity={0.8}
                className={`bg-white dark:bg-slate-900 rounded-3xl p-5 items-center border ${badge.unlocked ? "border-slate-200 dark:border-slate-800 shadow-sm shadow-black/5" : "border-dashed border-slate-300 dark:border-slate-800 opacity-60"} relative min-h-[180px] justify-center`}
              >
                <View
                  className={`w-16 h-16 rounded-2xl ${badge.unlocked ? badge.bg : "bg-slate-100 dark:bg-slate-800"} ${badge.border} items-center justify-center mb-3 shadow-sm`}
                >
                  {badge.iconLib === "Ionicons" ? (
                    <Ionicons
                      name={badge.icon as any}
                      size={32}
                      color={badge.unlocked ? badge.color : "#94A3B8"}
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name={badge.icon as any}
                      size={36}
                      color={badge.unlocked ? badge.color : "#94A3B8"}
                    />
                  )}
                </View>

                <Text className="text-slate-900 dark:text-white font-extrabold text-base text-center mb-1">
                  {badge.title}
                </Text>

                {badge.unlocked ? (
                  <Text className="text-xs text-green-600 dark:text-green-400 font-bold uppercase tracking-wider mt-1">
                    Unlocked
                  </Text>
                ) : (
                  <View className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full mt-1 border border-slate-200 dark:border-slate-700">
                    <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      {badge.progress}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </ScrollView>

      {/* Badge Detail Overlay */}
      {selectedBadge && (
        <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/70 justify-center items-center px-6 z-50 backdrop-blur-md">
          <Animated.View
            entering={FadeInUp.duration(400).springify()}
            className="bg-white dark:bg-slate-900 w-full rounded-3xl p-6 items-center border border-white/20 shadow-2xl relative"
          >
            <TouchableOpacity
              onPress={() => setSelectedBadge(null)}
              className="absolute top-4 right-4 w-9 h-9 bg-slate-100 dark:bg-slate-800 rounded-full items-center justify-center border border-slate-200 dark:border-slate-700"
            >
              <Ionicons name="close" size={20} color={isDark ? "white" : "black"} />
            </TouchableOpacity>

            <View
              className={`w-24 h-24 rounded-3xl ${selectedBadge.unlocked ? selectedBadge.bg : "bg-slate-100 dark:bg-slate-800"} ${selectedBadge.border} items-center justify-center mb-4 shadow-md`}
            >
              {selectedBadge.iconLib === "Ionicons" ? (
                <Ionicons
                  name={selectedBadge.icon as any}
                  size={50}
                  color={selectedBadge.unlocked ? selectedBadge.color : "#94A3B8"}
                />
              ) : (
                <MaterialCommunityIcons
                  name={selectedBadge.icon as any}
                  size={56}
                  color={selectedBadge.unlocked ? selectedBadge.color : "#94A3B8"}
                />
              )}
            </View>

            <Text className="text-2xl font-extrabold text-slate-900 dark:text-white text-center mb-2">
              {selectedBadge.title}
            </Text>

            {selectedBadge.unlocked ? (
              <View className="bg-green-100 dark:bg-green-950/40 px-3 py-1 rounded-full border border-green-200 dark:border-green-800 mb-3">
                <Text className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-widest">
                  Unlocked on {selectedBadge.date}
                </Text>
              </View>
            ) : (
              <View className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 mb-3">
                <Text className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Locked • {selectedBadge.progress}
                </Text>
              </View>
            )}

            <Text className="text-slate-600 dark:text-slate-300 text-center font-medium leading-6 text-sm mb-6 px-2">
              {selectedBadge.desc}
            </Text>

            <TouchableOpacity
              onPress={() => setSelectedBadge(null)}
              className="w-full bg-[#FB5607] py-4 rounded-2xl items-center shadow-lg shadow-[#FB5607]/40"
            >
              <Text className="text-white font-bold text-base tracking-wide uppercase">
                Awesome!
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}
    </View>
  );
}
