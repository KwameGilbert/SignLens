import { ReactNode } from "react";
import { View, useColorScheme } from "react-native";
import { BlurView } from "expo-blur";

type GlassCardProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  intensityLight?: number;
  intensityDark?: number;
};

export default function GlassCard({
  children,
  className = "",
  contentClassName = "",
  intensityLight = 55,
  intensityDark = 28,
}: GlassCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const blurTint = isDark ? "dark" : "light";

  return (
    <View
      className={`rounded-2xl overflow-hidden border border-white/45 dark:border-white/15 shadow-sm shadow-black/10 elevation-2 ${className}`}
    >
      <BlurView
        intensity={isDark ? intensityDark : intensityLight}
        tint={blurTint}
        className={`p-4 ${contentClassName}`}
      >
        {children}
      </BlurView>
    </View>
  );
}
