import { View, Text, TouchableOpacity, ScrollView, useColorScheme } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import SectionTitle from "../../components/ui/SectionTitle";
import LessonCard from "../../components/learn/LessonCard";
import { getCategoryBySlug, getLessonsByCategory } from "../../services/learnRepository";

export default function LearnCategoryScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const params = useLocalSearchParams<{ category?: string }>();
  const categorySlug = params.category ?? "";

  const category = getCategoryBySlug(categorySlug);
  const lessons = getLessonsByCategory(categorySlug);

  if (!category) {
    return (
      <View className="flex-1 bg-[#F2F2EA] dark:bg-slate-950 items-center justify-center px-6">
        <StatusBar style={isDark ? "light" : "dark"} />
        <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Category not found</Text>
        <TouchableOpacity
          className="bg-[#FB5607] px-6 py-3 rounded-xl shadow-md shadow-[#FB5607]/40"
          onPress={() => router.back()}
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-[#F2F2EA] dark:bg-slate-950" contentContainerStyle={{ paddingBottom: 24 }}>
      <StatusBar style="light" />

      <View className="px-4 pt-14 pb-5 bg-[#FB5607] rounded-b-[28px] shadow-lg shadow-black/20">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 rounded-full bg-white/20 items-center justify-center border border-white/30 backdrop-blur-md mr-3">
            <Ionicons name="arrow-back" size={22} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold">{category.title}</Text>
        </View>
        <View className="bg-white/15 border border-white/20 rounded-xl px-3 py-2">
          <Text className="text-white/95 text-sm font-semibold">
            {category.lessonCount} lessons • {category.progress}% complete
          </Text>
        </View>
      </View>

      <View className="px-4 mt-5">
        <SectionTitle title="Lessons" className="mb-3" />
        {lessons.map((lesson) => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            onPress={() =>
              router.push({
                pathname: "/(tabs)/learn-lesson",
                params: { lessonId: lesson.id },
              })
            }
          />
        ))}
      </View>
    </ScrollView>
  );
}