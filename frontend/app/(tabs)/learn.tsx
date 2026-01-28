import { View, Text } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";

export default function LearnScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-[#FDFDFD]">
      <StatusBar style="dark" />
      <Text className="text-xl font-bold text-gray-900">Learn Screen</Text>
    </View>
  );
}
