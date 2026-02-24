import { useMemo, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import QuizBlock from "../../components/learn/QuizBlock";
import { getLessonById, getLessonNavigation, getQuizByLessonId } from "../../services/learnRepository";

export default function LearnCheckpointScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ lessonId?: string }>();
  const lessonId = params.lessonId ?? "";

  const lesson = getLessonById(lessonId);
  const quiz = getQuizByLessonId(lessonId);
  const { nextLessonId } = getLessonNavigation(lessonId);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const isCorrect = useMemo(() => {
    if (!quiz || selectedIndex === null) {
      return false;
    }

    return selectedIndex === quiz.correctIndex;
  }, [quiz, selectedIndex]);

  if (!lesson || !quiz) {
    return (
      <View className="flex-1 bg-[#F2F2EA] items-center justify-center px-6">
        <StatusBar style="dark" />
        <Text className="text-2xl font-bold text-gray-900 mb-3">Checkpoint not available</Text>
        <TouchableOpacity className="bg-[#FB5607] px-6 py-3 rounded-xl" onPress={() => router.back()}>
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-[#F2F2EA]" contentContainerStyle={{ paddingBottom: 24 }}>
      <StatusBar style="dark" />

      <View className="px-4 pt-14 pb-4 bg-[#FB5607] rounded-b-[28px]">
        <View className="flex-row items-center mb-2">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold">Checkpoint</Text>
        </View>
        <Text className="text-white/90 text-base">{lesson.title}</Text>
      </View>

      <View className="px-4 mt-5">
        <QuizBlock quiz={quiz} selectedIndex={selectedIndex} onSelect={setSelectedIndex} />

        {!submitted ? (
          <TouchableOpacity
            className={`rounded-xl py-4 items-center mt-4 ${selectedIndex === null ? "bg-gray-300" : "bg-[#FB5607]"}`}
            disabled={selectedIndex === null}
            onPress={() => setSubmitted(true)}
          >
            <Text className="text-white text-lg font-bold">Submit Answer</Text>
          </TouchableOpacity>
        ) : (
          <>
            <View
              className={`rounded-xl p-4 mt-4 border ${isCorrect ? "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-600" : "bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-600"}`}
            >
              <Text className={`font-bold text-lg ${isCorrect ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}>
                {isCorrect ? "Great work! Correct answer." : "Not quite. Review and continue."}
              </Text>
            </View>

            <TouchableOpacity
              className="rounded-xl py-4 items-center mt-4 bg-[#FB5607]"
              onPress={() => {
                if (nextLessonId) {
                  router.push({
                    pathname: "/(tabs)/learn-lesson",
                    params: { lessonId: nextLessonId },
                  });
                  return;
                }

                router.push({
                  pathname: "/(tabs)/learn-category",
                  params: { category: lesson.categorySlug },
                });
              }}
            >
              <Text className="text-white text-lg font-bold">
                {nextLessonId ? "Continue to Next Lesson" : "Back to Category"}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
}