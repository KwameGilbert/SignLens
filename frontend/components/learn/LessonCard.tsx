import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LearnLesson } from "../../services/learnRepository";

type LessonCardProps = {
  lesson: LearnLesson;
  onPress: () => void;
};

export default function LessonCard({ lesson, onPress }: LessonCardProps) {
  return (
    <TouchableOpacity
      className="bg-white dark:bg-slate-900 rounded-2xl p-4 mb-3 shadow-sm shadow-black/10 elevation-2 border border-black/5 dark:border-slate-800"
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-4">
          <Text className="text-gray-900 dark:text-white text-lg font-bold">{lesson.title}</Text>
          <Text className="text-gray-500 dark:text-slate-400 text-sm mt-1">{lesson.description}</Text>

          <View className="h-2.5 rounded-full bg-gray-200 dark:bg-slate-800 mt-3 overflow-hidden border border-slate-300/40 dark:border-slate-700/50">
            <View
              className="h-full rounded-full bg-[#FB5607]"
              style={{ width: `${lesson.progress}%` }}
            />
          </View>
        </View>

        <View className="items-end">
          <Text className="text-[#FB5607] text-xl font-bold mb-1">{lesson.progress}%</Text>
          <Ionicons name="chevron-forward" size={22} color="#9CA3AF" />
        </View>
      </View>
    </TouchableOpacity>
  );
}