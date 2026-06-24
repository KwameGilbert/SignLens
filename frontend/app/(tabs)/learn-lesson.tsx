import { View, Text, TouchableOpacity, ScrollView, useColorScheme, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import GlassCard from "../../components/ui/GlassCard";
import { getCategoryBySlug, getLessonById, getLessonNavigation } from "../../services/learnRepository";
import AvatarLessonPlayer from "../../components/learn/AvatarLessonPlayer";

function LessonContent() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  const params = useLocalSearchParams<{ lessonId?: string }>();
  const lessonId = params.lessonId ?? "";

  const lesson = getLessonById(lessonId);
  const category = getCategoryBySlug(lesson?.categorySlug ?? "");
  const { previousLessonId, nextLessonId } = getLessonNavigation(lesson?.id ?? "");

  if (!isReady) {
    return null;
  }

  if (!lesson) {
    return (
      <View className="flex-1 bg-[#F2F2EA] dark:bg-slate-950 items-center justify-center px-6">
        <StatusBar style={isDark ? "light" : "dark"} />
        <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Lesson not found</Text>
        <TouchableOpacity className="bg-[#FB5607] px-6 py-3 rounded-xl" onPress={() => router.back()}>
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-[#F2F2EA] dark:bg-slate-950 pb-40" contentContainerStyle={{ paddingBottom: 30 }}>
      <StatusBar style="light" />

      <View className="px-4 pt-14 pb-2 bg-[#FB5607] rounded-b-[20px] shadow-lg shadow-black/20">
        <View className="flex-row items-center justify-between mb-1">
          <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 rounded-full bg-white/20 items-center justify-center border border-white/30 backdrop-blur-md">
            <Ionicons name="arrow-back" size={22} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-sm font-semibold">{category?.title}</Text>
          <View className="w-10 h-10" />
        </View>
        <Text className="text-white text-2xl font-bold">{lesson.title}</Text>
      </View>

      <View className="px-4 mt-3">
        <AvatarLessonPlayer />

        <GlassCard contentClassName="" className="mb-2" intensityLight={60} intensityDark={28}>
          <Text className="text-slate-900 dark:text-white text-base mt-1">{lesson.description}</Text>

          <View className="h-3 rounded-full bg-gray-200 dark:bg-slate-800 mt-2 overflow-hidden border border-slate-300/50 dark:border-slate-700/50">
            <View className="h-full rounded-full bg-[#FB5607]" style={{ width: `${lesson.progress}%` }} />
          </View>
          <Text className="text-[#FB5607] text-sm font-semibold mt-1">Lesson progress: {lesson.progress}%</Text>

          <View className="mt-1">
            {lesson.content.map((line) => (
              <View key={line} className="flex-row mb-1">
                <Text className="text-[#FB5607] mr-2 font-bold">•</Text>
                <Text className="text-slate-900 dark:text-white text-md flex-1 font-medium">{line}</Text>
              </View>
            ))}
          </View>
        </GlassCard>

        <TouchableOpacity
          className="bg-[#FB5607] rounded-xl py-4 items-center mb-2 shadow-md shadow-[#FB5607]/40"
          onPress={() =>
            router.push({
              pathname: "/(tabs)/learn-checkpoint",
              params: { lessonId: lesson.id },
            })
          }
        >
          <Text className="text-white text-lg font-bold uppercase tracking-wider">Mark Complete</Text>
        </TouchableOpacity>

        <View className="flex-row gap-3 pb-20">
          <TouchableOpacity
            className={`flex-1 rounded-xl py-3.5 items-center border ${
              previousLessonId ? "bg-slate-800 dark:bg-slate-900 border-slate-700 dark:border-slate-800 shadow-sm" : "bg-gray-300 dark:bg-slate-900 border-gray-400/30 dark:border-slate-800/60 opacity-50"
            }`}
            disabled={!previousLessonId}
            onPress={() =>
              previousLessonId &&
              router.replace({
                pathname: "/(tabs)/learn-lesson",
                params: { lessonId: previousLessonId },
              })
            }
          >
            <Text className={`font-bold ${previousLessonId ? "text-white" : "text-gray-500 dark:text-slate-500"}`}>Previous</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-1 rounded-xl py-3.5 items-center border ${nextLessonId ? "bg-[#FB5607] border-orange-600 shadow-sm shadow-[#FB5607]/40" : "bg-gray-300 dark:bg-slate-900 border-gray-400/30 dark:border-slate-800/60 opacity-50"}`}
            disabled={!nextLessonId}
            onPress={() =>
              nextLessonId &&
              Alert.alert(
                "Next Lesson",
                `Moving to next lesson\nLesson ID: ${nextLessonId}\nCurrent: ${lesson.id}`,
                [{ text: "OK" }]
              )
            }
          >
            <Text className={`font-bold ${nextLessonId ? "text-white" : "text-gray-500 dark:text-slate-500"}`}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

export default function LearnLessonScreen() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  if (!isReady) {
    return <View style={{ flex: 1, backgroundColor: "#F2F2EA" }} />;
  }

  return <LessonContent />;
}