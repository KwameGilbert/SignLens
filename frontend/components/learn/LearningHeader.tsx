import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";

type LearningHeaderProps = {
  progress: number;
};

export default function LearningHeader({ progress }: LearningHeaderProps) {
  return (
    <View className="rounded-b-[30px] overflow-hidden relative">
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
      <View className="relative z-10 px-5 pt-14 pb-7">
      <Text className="text-white text-[34px] font-bold">Learning Center</Text>

      <View className="bg-white/15 border border-white/20 rounded-2xl px-4 py-4 mt-5">
        <View className="flex-row items-center justify-between mb-2.5">
          <Text className="text-white text-base font-semibold">Overall Progress</Text>
          <Text className="text-white text-[34px] font-extrabold">{progress}%</Text>
        </View>

        <View className="h-3.5 rounded-full bg-white/25 overflow-hidden">
          <View
            className="h-full rounded-full bg-white"
            style={{ width: `${progress}%` }}
          />
        </View>
      </View>
      </View>
    </View>
  );
}