import React, { useEffect } from "react";
import { View, useColorScheme } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

export default function AnimatedBackground() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const rotation1 = useSharedValue(0);
  const rotation2 = useSharedValue(0);
  const scale1 = useSharedValue(1);

  useEffect(() => {
    rotation1.value = withRepeat(
      withTiming(360, { duration: 15000, easing: Easing.linear }),
      -1,
      false
    );
    rotation2.value = withRepeat(
      withTiming(-360, { duration: 20000, easing: Easing.linear }),
      -1,
      false
    );
    scale1.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 8000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.8, { duration: 8000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, [rotation1, rotation2, scale1]);

  const animatedStyle1 = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation1.value}deg` }, { scale: scale1.value }],
  }));

  const animatedStyle2 = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation2.value}deg` }],
  }));

  // Define dynamic colors
  const bgColor = isDark ? "#0f172a" : "#f8fafc"; // slate-900 / slate-50
  
  // Vibrant blobs
  const colors1 = (isDark
    ? ["#FB5607", "#ff006e", "transparent"]
    : ["#FB5607", "#ffbe0b", "transparent"]) as [string, string, string];
    
  const colors2 = (isDark
    ? ["#8338ec", "#3a86ff", "transparent"]
    : ["#3a86ff", "#00bbf9", "transparent"]) as [string, string, string];

  return (
    <View
      className="absolute inset-0 overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      <Animated.View
         className="absolute w-[600px] h-[600px] -top-[100px] -left-[100px] opacity-40 dark:opacity-30"
         style={[animatedStyle1]}
      >
        <LinearGradient
          colors={colors1}
          style={{ flex: 1, borderRadius: 300 }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>

      <Animated.View
         className="absolute w-[800px] h-[800px] -bottom-[200px] -right-[200px] opacity-40 dark:opacity-20"
         style={[animatedStyle2]}
      >
         <LinearGradient
          colors={colors2}
          style={{ flex: 1, borderRadius: 400 }}
          start={{ x: 1, y: 1 }}
          end={{ x: 0, y: 0 }}
        />
      </Animated.View>
      
      {/* Light noise or overlay could go here if needed, but keeping it simple */}
      <View className="absolute inset-0 bg-white/10 dark:bg-black/10" />
    </View>
  );
}
