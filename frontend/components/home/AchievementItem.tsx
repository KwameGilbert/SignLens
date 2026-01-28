
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
    <TouchableOpacity className="flex-row items-center py-4 border-b border-gray-100 last:border-0">
      <View className="w-12 h-12 bg-gray-50 rounded-xl justify-center items-center mr-4 shadow-sm">
        <IconComponent name={icon} size={24} color={iconColor} />
      </View>
      <View className="flex-1">
        <Text className="font-bold text-gray-900 text-base">{title}</Text>
        <Text className="text-gray-500 text-sm">{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );
}
