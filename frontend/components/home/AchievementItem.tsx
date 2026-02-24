import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React from "react";

type AchievementItemProps = {
  icon: string;
  title: string;
  subtitle: string;
  iconColor: string;
  IconComponent: any;
};

export default function AchievementItem({
  icon,
  title,
  subtitle,
  iconColor,
  IconComponent,
}: AchievementItemProps) {
  return (
    <TouchableOpacity 
      activeOpacity={0.7}
      className="flex-row items-center py-4 border-b border-white/20 dark:border-white/10 last:border-0"
    >
      <View className="w-12 h-12 bg-white/60 dark:bg-white/10 rounded-xl justify-center items-center mr-4 shadow-sm border border-white/40 dark:border-white/5 backdrop-blur-md">
        <IconComponent name={icon} size={24} color={iconColor} />
      </View>
      <View className="flex-1">
        <Text className="font-bold text-slate-900 dark:text-white text-base">{title}</Text>
        <Text className="text-slate-500 dark:text-slate-300 text-sm">{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );
}
