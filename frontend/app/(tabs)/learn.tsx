import { View, ScrollView, useColorScheme, ActivityIndicator, Text, RefreshControl } from "react-native";
import React, { useCallback, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import LearningHeader from "../../components/learn/LearningHeader";
import CategoryCard from "../../components/learn/CategoryCard";
import GlassCard from "../../components/ui/GlassCard";
import SectionTitle from "../../components/ui/SectionTitle";
import {
  fetchLearningCategories,
  getOverallProgress,
} from "../../services/learnRepository";

export default function LearnScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [refreshing, setRefreshing] = useState(false);

  const { data: categories = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["learningCategories"],
    queryFn: fetchLearningCategories,
  });

  const overallProgress = getOverallProgress(categories);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  return (
    <View className="flex-1 bg-[#F2F2EA] dark:bg-slate-950">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FB5607"
            colors={["#FB5607"]}
          />
        }
      >
        <StatusBar style={isDark ? "light" : "dark"} />

        <LearningHeader progress={overallProgress} />

        <View className="px-4 mt-6">
          {isLoading ? (
            <View className="py-20 items-center justify-center">
              <ActivityIndicator size="large" color="#FB5607" />
            </View>
          ) : isError ? (
            <View className="py-20 items-center justify-center">
              <Text className="text-red-500 font-bold text-center">
                Failed to load categories.{"\n"}Pull down to try again.
              </Text>
            </View>
          ) : (
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
                      params: { categoryId: category.id, categoryTitle: category.title },
                    })
                  }
                />
              ))}
            </GlassCard>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
