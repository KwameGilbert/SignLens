import learningContent from "../data/learning-content.json";

export type LearnCategory = {
  id: string;
  slug: string;
  title: string;
  icon: string;
  lessonCount: number;
  progress: number;
};

export type LearnLesson = {
  id: string;
  categoryId: string;
  categorySlug: string;
  title: string;
  description: string;
  mediaKey: "learn" | "scan" | "progress" | "voice";
  progress: number;
  content: string[];
  videoUrl?: string | null;
};

export type LearnQuiz = {
  lessonId: string;
  question: string;
  options: string[];
  correctIndex: number;
};

const categories = learningContent.categories as LearnCategory[];
const lessons = learningContent.lessons as LearnLesson[];
const quizzes = learningContent.quizzes as LearnQuiz[];

import apiClient from "./apiClient";

export async function fetchLearningCategories(): Promise<LearnCategory[]> {
  const response = await apiClient.get('/lesson-categories');
  const apiCategories = response.data.data;
  
  return apiCategories.map((cat: any) => ({
    id: String(cat.id),
    slug: cat.slug,
    title: cat.name,
    icon: cat.icon,
    lessonCount: 0,
    progress: 0,
  }));
}

export function getOverallProgress(categoryList: LearnCategory[] = []) {
  if (categoryList.length === 0) {
    return 0;
  }

  const total = categoryList.reduce((sum, category) => sum + category.progress, 0);
  return Math.round(total / categoryList.length);
}

// NOTE: getCategoryBySlug needs to be refactored to an API call later.
// Currently returning undefined since dummy categories are empty.
export function getCategoryBySlug(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export async function fetchLessonsByCategory(categoryId: string): Promise<LearnLesson[]> {
  const response = await apiClient.get(`/lessons?categoryId=${categoryId}`);
  const apiLessons = response.data.data || [];
  
  return apiLessons.map((lesson: any) => ({
    id: String(lesson.id),
    categorySlug: lesson.slug, // Just matching the type, though we use categoryId now
    categoryId: String(lesson.categoryId),
    title: lesson.title,
    description: lesson.description || "",
    mediaKey: lesson.type || "learn",
    progress: 0,
    content: parseInstructions(lesson.instructions),
    videoUrl: lesson.lessonUrl || lesson.videoUrl || lesson.video_url || null,
  }));
}

export async function fetchLessonById(lessonId: string): Promise<LearnLesson> {
  const response = await apiClient.get(`/lessons/${lessonId}`);
  const lesson = response.data.data;
  
  return {
    id: String(lesson.id),
    categorySlug: lesson.slug,
    categoryId: String(lesson.categoryId),
    title: lesson.title,
    description: lesson.description || "",
    mediaKey: lesson.type || "learn",
    progress: 0,
    content: parseInstructions(lesson.instructions),
    videoUrl: lesson.lessonUrl || lesson.videoUrl || lesson.video_url || null,
  };
}

export async function fetchQuizByLessonId(lessonId: string): Promise<LearnQuiz | null> {
  const response = await apiClient.get(`/quizzes?lessonId=${lessonId}`);
  const quizzes = response.data.data || [];
  
  if (quizzes.length === 0) return null;
  const apiQuiz = quizzes[0];
  
  const options = (apiQuiz.options || []).map((opt: any) => opt.name);
  const correctIndex = Math.max(0, (apiQuiz.options || []).findIndex((opt: any) => opt.isCorrect));
  
  return {
    lessonId: String(apiQuiz.lessonId),
    question: apiQuiz.question,
    options,
    correctIndex,
  };
}

export async function fetchLessonNavigation(categoryId: string, lessonId: string) {
  // Fetch all lessons for the category to determine sequence
  const categoryLessons = await fetchLessonsByCategory(categoryId);
  const currentIndex = categoryLessons.findIndex((item) => item.id === String(lessonId));

  if (currentIndex === -1) {
    return { previousLessonId: null, nextLessonId: null };
  }

  return {
    previousLessonId: currentIndex > 0 ? categoryLessons[currentIndex - 1].id : null,
    nextLessonId: currentIndex < categoryLessons.length - 1 ? categoryLessons[currentIndex + 1].id : null,
  };
}

// Helper to safely parse instructions from backend
function parseInstructions(instructions: any): string[] {
  if (!instructions) return [];
  
  let parsedArray: any[] = [];
  
  if (Array.isArray(instructions)) {
    parsedArray = instructions;
  } else if (typeof instructions === 'string') {
    try {
      const parsed = JSON.parse(instructions);
      if (Array.isArray(parsed)) {
        parsedArray = parsed;
      } else {
        return instructions.split('\n').map((line) => line.trim()).filter((line) => line.length > 0);
      }
    } catch (e) {
      // If it's not valid JSON, treat it as a newline-separated string
      return instructions.split('\n').map((line) => line.trim()).filter((line) => line.length > 0);
    }
  } else {
    return [String(instructions)];
  }

  // Ensure we return an array of strings
  return parsedArray.map(item => {
    if (typeof item === 'string') return item;
    if (item && typeof item === 'object' && item.text) return String(item.text);
    return JSON.stringify(item);
  });
}