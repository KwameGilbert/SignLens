
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { useRouter } from "expo-router";

type QuickActionButtonProps = {
  icon: string;
  label: string;
  desc: string;
  color: string;
  iconLib?: "Ionicons" | "MaterialCommunityIcons";
  route?: string;
};

export default function QuickActionButton({
  icon,
  label,
  desc,
  color,
  iconLib = "Ionicons",
  route,
}: QuickActionButtonProps) {
  const router = useRouter();

  return (
    <TouchableOpacity
      className="bg-white p-4 rounded-2xl w-[48%] shadow-sm shadow-black/10 elevation-2 mb-4"
      activeOpacity={0.7}
      onPress={() => route && router.push(route as any)}
    >
      <View
        className={`w-12 h-12 rounded-xl justify-center items-center mb-3`}
        style={{ backgroundColor: color }}
      >
        {iconLib === "Ionicons" ? (
          <Ionicons name={icon as any} size={24} color="white" />
        ) : (
          <MaterialCommunityIcons name={icon as any} size={24} color="white" />
        )}
      </View>
      <Text className="font-bold text-base text-gray-900">{label}</Text>
      <Text className="text-gray-500 text-xs mt-1">{desc}</Text>
    </TouchableOpacity>
  );
}
