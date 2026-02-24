import { View, Text, TouchableOpacity, useColorScheme, StyleSheet } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import Animated, { FadeInUp } from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";

export default function HomeHeader() {
  const colorScheme = useColorScheme();
  const blurTint = colorScheme === "dark" ? "dark" : "light";

  return (
    <Animated.View 
      entering={FadeInUp.duration(800).springify()}
      className="px-6 pt-16 pb-8 rounded-b-[30px] overflow-hidden relative"
    >
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
      <View className="relative z-10">
        <View className="flex-row justify-between items-start mb-6">
        <View>
          <Text className="text-white/85 text-lg font-medium mb-1">
            Welcome back,
          </Text>
          <Text className="text-white text-3xl font-bold">
            Afriyie Anthony
          </Text>
        </View>
        <TouchableOpacity className="bg-white/20 p-2 rounded-full border border-white/35 backdrop-blur-md">
          <Ionicons name="person" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Streak Card - Glassmorphism */}
      <View className="rounded-3xl overflow-hidden shadow-sm shadow-black/10 elevation-2 border border-white/30">
        <BlurView intensity={40} tint={blurTint} className="p-5 flex-row justify-between">
          <View className="flex-row items-center gap-4">
            <View className="w-12 h-12 rounded-full bg-white/25 border border-white/30 items-center justify-center">
              <MaterialCommunityIcons name="fire" size={28} color="#FB5607" />
            </View>
            <View>
              <Text className="text-white/75 text-xs font-medium">
                Daily streak
              </Text>
              <Text className="text-white text-2xl font-bold">20 days</Text>
            </View>
          </View>
          <View className="h-full w-[1px] bg-white/25 mx-2" />
          <View className="flex-row items-center gap-3">
             <View>
              <Text className="text-white/75 text-xs font-medium text-right">
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
        </BlurView>
      </View>
      </View>
    </Animated.View>
  );
}
