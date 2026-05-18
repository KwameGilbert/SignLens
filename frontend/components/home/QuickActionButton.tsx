import { View, Text, Pressable } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { useRouter } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

type QuickActionButtonProps = {
  icon: string;
  label: string;
  desc: string;
  color: string;
  iconLib?: "Ionicons" | "MaterialCommunityIcons";
  route?: string;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function QuickActionButton({
  icon,
  label,
  desc,
  color,
  iconLib = "Ionicons",
  route,
}: QuickActionButtonProps) {
  const router = useRouter();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 200 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handlePress = () => {
    if (route) {
      router.push(route as any);
    }
  };

  return (
    <AnimatedPressable
      className="bg-white/80 dark:bg-white/10 p-4 rounded-xl w-[48%] shadow-sm shadow-black/5 elevation-2 mb-2 border border-white/40 dark:border-white/20 backdrop-blur-md"
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      style={animatedStyle}
    >
      <View
        className={`w-12 h-12 rounded-xl justify-center items-center mb-2 shadow-sm`}
        style={{ backgroundColor: color, shadowColor: color }}
      >
        {iconLib === "Ionicons" ? (
          <Ionicons name={icon as any} size={24} color="white" />
        ) : (
          <MaterialCommunityIcons name={icon as any} size={24} color="white" />
        )}
      </View>
      <Text className="font-bold text-base text-slate-900 dark:text-white">
        {label}
      </Text>
      <Text className="text-slate-500 dark:text-slate-400 text-xs mt-1">
        {desc}
      </Text>
    </AnimatedPressable>
  );
}
