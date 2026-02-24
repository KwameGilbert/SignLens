import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import GlassCard from "../../components/ui/GlassCard";
import { getCategoryBySlug, getLessonById, getLessonNavigation } from "../../services/learnRepository";
import AvatarLessonPlayer from "../../components/learn/AvatarLessonPlayer";

export default function LearnLessonScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ lessonId?: string }>();
  const lessonId = params.lessonId ?? "";

  const lesson = getLessonById(lessonId);

  if (!lesson) {
    return (
      <View className="flex-1 bg-[#F2F2EA] items-center justify-center px-6">
        <StatusBar style="dark" />
        <Text className="text-2xl font-bold text-gray-900 mb-3">Lesson not found</Text>
        <TouchableOpacity className="bg-[#FB5607] px-6 py-3 rounded-xl" onPress={() => router.back()}>
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const category = getCategoryBySlug(lesson.categorySlug);
  const { previousLessonId, nextLessonId } = getLessonNavigation(lesson.id);

  return (
    <ScrollView className="flex-1 bg-[#F2F2EA]" contentContainerStyle={{ paddingBottom: 30 }}>
      <StatusBar style="dark" />

      <View className="px-4 pt-14 pb-4 bg-[#FB5607] rounded-b-[28px]">
        <View className="flex-row items-center justify-between mb-2">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-sm font-semibold">{category?.title}</Text>
        </View>
        <Text className="text-white text-3xl font-bold">{lesson.title}</Text>
      </View>

      <View className="px-4 mt-5">
        <AvatarLessonPlayer />

        <GlassCard contentClassName="" className="mb-4" intensityLight={60} intensityDark={28}>
          <Text className="text-slate-900 dark:text-white text-base mt-2">{lesson.description}</Text>

          <View className="h-3 rounded-full bg-gray-200 dark:bg-slate-600 mt-4 overflow-hidden">
            <View className="h-full rounded-full bg-[#FB5607]" style={{ width: `${lesson.progress}%` }} />
          </View>
          <Text className="text-[#FB5607] text-sm font-semibold mt-2">Lesson progress: {lesson.progress}%</Text>

          <View className="mt-4">
            {lesson.content.map((line) => (
              <View key={line} className="flex-row mb-2">
                <Text className="text-[#FB5607] mr-2">•</Text>
                <Text className="text-slate-900 dark:text-white flex-1">{line}</Text>
              </View>
            ))}
          </View>
        </GlassCard>

        <TouchableOpacity
          className="bg-[#FB5607] rounded-xl py-4 items-center mb-3"
          onPress={() =>
            router.push({
              pathname: "/(tabs)/learn-checkpoint",
              params: { lessonId: lesson.id },
            })
          }
        >
          <Text className="text-white text-lg font-bold">Mark Complete & Take Checkpoint</Text>
        </TouchableOpacity>

        <View className="flex-row gap-3">
          <TouchableOpacity
            className={`flex-1 rounded-xl py-3 items-center ${
              previousLessonId ? "bg-gray-800" : "bg-gray-300"
            }`}
            disabled={!previousLessonId}
            onPress={() =>
              previousLessonId &&
              router.push({
                pathname: "/(tabs)/learn-lesson",
                params: { lessonId: previousLessonId },
              })
            }
          >
            <Text className="text-white font-semibold">Previous</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-1 rounded-xl py-3 items-center ${nextLessonId ? "bg-[#FB5607]" : "bg-gray-300"}`}
            disabled={!nextLessonId}
            onPress={() =>
              nextLessonId &&
              router.push({
                pathname: "/(tabs)/learn-lesson",
                params: { lessonId: nextLessonId },
              })
            }
          >
            <Text className="text-white font-semibold">Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}