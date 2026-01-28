
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";

export default function HomeHeader() {
  return (
    <View className="h-[240px] overflow-hidden rounded-b-[40px] relative">
      <Image
        source={require("../../assets/images/welcome_bg.png")}
        style={StyleSheet.absoluteFillObject}
        contentFit="cover"
      />
      <LinearGradient
        colors={[
          "rgba(251, 84, 7, 0.89)",
          "rgba(251, 84, 7, 0.89)",
          "rgba(251, 84, 7, 0.89)",
        ]}
        style={StyleSheet.absoluteFillObject}
      />

      <View className="px-6 pt-16 flex-1">
        <View className="flex-row justify-between items-start mb-6">
          <View>
            <Text className="text-white/80 text-lg font-medium mb-1">
              Welcome back,
            </Text>
            <Text className="text-white text-3xl font-bold">
              Afriyie Anthony
            </Text>
          </View>
          <TouchableOpacity className="bg-white/20 p-2 rounded-full border border-white/30">
            <Ionicons name="person" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Streak Card */}
        <View className="bg-white/10 border border-white/20 rounded-3xl p-5 flex-row justify-between backdrop-blur-md">
          <View className="flex-row items-center gap-4">
            <View className="w-12 h-12 rounded-full bg-white/20 items-center justify-center">
              <MaterialCommunityIcons name="fire" size={28} color="white" />
            </View>
            <View>
              <Text className="text-white/70 text-xs font-medium">
                Daily streak
              </Text>
              <Text className="text-white text-2xl font-bold">20 days</Text>
            </View>
          </View>
          <View className="h-full w-[1px] bg-white/20 mx-2" />
          <View className="flex-row items-center gap-3">
            <View>
              <Text className="text-white/70 text-xs font-medium text-right">
                Keep it up
              </Text>
              <View className="flex-row items-center mt-1">
                <MaterialCommunityIcons
                  name="fire"
                  size={16}
                  color="#FFC107"
                  style={{ marginRight: 4 }}
                />
                <Text className="text-white font-semibold">On fire</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
