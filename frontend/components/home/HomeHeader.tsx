import { View, Text, TouchableOpacity, useColorScheme, StyleSheet } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { useRouter } from "expo-router";
import Animated, { FadeInUp } from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";

export default function HomeHeader() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const blurTint = colorScheme === "dark" ? "dark" : "light";

  return (
    <Animated.View 
      entering={FadeInUp.duration(800).springify()}
      className="px-6 pt-14 pb-4 rounded-b-[20px] overflow-hidden relative"
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
        <View className="flex-row justify-between items-start mb-3">
        <View>
          <Text className="text-white/85 text-md font-medium mb-1">
            Welcome back,
          </Text>
          <Text className="text-white text-2xl font-bold">
            Afriyie Anthony
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push("/profile")}
          className="bg-white/20 p-2 rounded-full border border-white/35 backdrop-blur-md"
        >
          <Ionicons name="person" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Streak Card - White Glassmorphism */}
      <View className="rounded-2xl overflow-hidden bg-white/10 border border-white/60 shadow-md shadow-black/10">
        <BlurView intensity={65} tint="light" className="p-4 flex-row justify-between items-center">
          <View className="flex-row items-center gap-3.5">
            <View className="w-11 h-11 rounded-full bg-white shadow-sm border border-white/80 items-center justify-center">
              <MaterialCommunityIcons name="fire" size={26} color="#FB5607" />
            </View>
            <View>
              <Text className="text-white/90 text-xs font-semibold tracking-wider uppercase mb-0.5">
                Daily streak
              </Text>
              <Text className="text-white text-2xl font-extrabold tracking-tight">20 Days</Text>
            </View>
          </View>
          <View className="h-9 w-[1px] bg-white/40 mx-2" />
          <View className="flex-row items-center">
             <View>
              <Text className="text-white/90 text-xs font-semibold tracking-wider uppercase text-right mb-0.5">
                Keep it up
              </Text>
              <View className="flex-row items-center justify-end bg-white/25 px-2.5 py-1 rounded-full border border-white/40">
                <MaterialCommunityIcons
                  name="fire"
                  size={16}
                  color="#FFBE0B"
                  style={{ marginRight: 4 }}
                />
                <Text className="text-white font-bold text-xs">On fire</Text>
              </View>
            </View>
          </View>
        </BlurView>
      </View>
      </View>
    </Animated.View>
  );
}
