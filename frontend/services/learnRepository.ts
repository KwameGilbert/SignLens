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
  categorySlug: string;
  title: string;
  description: string;
  mediaKey: "learn" | "scan" | "progress" | "voice";
  progress: number;
  content: string[];
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

export function getLearningCategories() {
  return categories;
}

export function getOverallProgress() {
  if (categories.length === 0) {
    return 0;
  }

  const total = categories.reduce((sum, category) => sum + category.progress, 0);
  return Math.round(total / categories.length);
}

export function getCategoryBySlug(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function getLessonsByCategory(slug: string) {
  return lessons.filter((lesson) => lesson.categorySlug === slug);
}

export function getLessonById(lessonId: string) {
  return lessons.find((lesson) => lesson.id === lessonId);
}

export function getQuizByLessonId(lessonId: string) {
  return quizzes.find((quiz) => quiz.lessonId === lessonId);
}

export function getLessonSequenceByCategory(slug: string) {
  const categoryLessons = getLessonsByCategory(slug);

  return categoryLessons.map((lesson, index) => ({
    ...lesson,
    previousLessonId: index > 0 ? categoryLessons[index - 1].id : null,
    nextLessonId: index < categoryLessons.length - 1 ? categoryLessons[index + 1].id : null,
  }));
}

export function getLessonNavigation(lessonId: string) {
  const lesson = getLessonById(lessonId);
  if (!lesson) {
    return { previousLessonId: null, nextLessonId: null };
  }

  const sequence = getLessonSequenceByCategory(lesson.categorySlug);
  const currentIndex = sequence.findIndex((item) => item.id === lessonId);

  if (currentIndex === -1) {
    return { previousLessonId: null, nextLessonId: null };
  }

  return {
    previousLessonId: sequence[currentIndex].previousLessonId,
    nextLessonId: sequence[currentIndex].nextLessonId,
  };
}