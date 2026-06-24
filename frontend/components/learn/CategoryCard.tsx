import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LearnCategory } from "../../services/learnRepository";

type CategoryCardProps = {
  category: LearnCategory;
  onPress: () => void;
};

export default function CategoryCard({ category, onPress }: CategoryCardProps) {
  return (
    <TouchableOpacity
      className="bg-white/65 dark:bg-white/10 rounded-2xl px-4 py-3 mb-3 shadow-sm shadow-black/10 elevation-2 border border-white/45 dark:border-white/15"
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View className="flex-row items-center">
        <View className="w-10 h-10 rounded-lg bg-[#FB5607] items-center justify-center mr-3">
          <Text className="text-white text-xl font-bold">{category.icon}</Text>
        </View>

        <View className="flex-1">
          <View className="flex-row justify-between items-center">
            <Text className="text-gray-900 dark:text-white text-lg font-bold">{category.title}</Text>
            <Text className="text-[#FB5607] text-2xl font-extrabold">{category.progress}%</Text>
          </View>

          <Text className="text-gray-500 dark:text-slate-300 text-sm mt-0.5">{category.lessonCount} lessons</Text>

          <View className="h-2.5 rounded-full bg-gray-200/80 dark:bg-white/15 mt-2.5 overflow-hidden">
            <View
              className="h-full rounded-full bg-[#FB5607]"
              style={{ width: `${category.progress}%` }}
            />
          </View>
        </View>

        <Ionicons name="chevron-forward" size={20} color="#FB5607" style={{ marginLeft: 8 }} />
      </View>
    </TouchableOpacity>
  );
}