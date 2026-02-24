import { View, ScrollView, useColorScheme } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import LearningHeader from "../../components/learn/LearningHeader";
import CategoryCard from "../../components/learn/CategoryCard";
import AnimatedBackground from "../../components/ui/AnimatedBackground";
import GlassCard from "../../components/ui/GlassCard";
import SectionTitle from "../../components/ui/SectionTitle";
import {
  getLearningCategories,
  getOverallProgress,
} from "../../services/learnRepository";

export default function LearnScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const categories = getLearningCategories();
  const overallProgress = getOverallProgress();

  return (
    <View className="flex-1 bg-[#F2F2EA] dark:bg-slate-950">
      <AnimatedBackground />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <StatusBar style={isDark ? "light" : "dark"} />

        <LearningHeader progress={overallProgress} />

        <View className="px-4 mt-6">
          <GlassCard intensityLight={60} intensityDark={28}>
            <SectionTitle 
              title="Learning Categories" 
              subtitle="Pick a category to continue your lessons"
              className="mb-4"
            />

            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/learn-category",
                    params: { category: category.slug },
                  })
                }
              />
            ))}
          </GlassCard>
        </View>
      </ScrollView>
    </View>
  );
}
