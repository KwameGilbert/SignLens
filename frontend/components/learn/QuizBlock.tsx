import { View, Text, TouchableOpacity } from "react-native";
import { LearnQuiz } from "../../services/learnRepository";

type QuizBlockProps = {
  quiz: LearnQuiz;
  selectedIndex: number | null;
  onSelect: (index: number) => void;
};

export default function QuizBlock({ quiz, selectedIndex, onSelect }: QuizBlockProps) {
  return (
    <View className="bg-white rounded-2xl p-4 shadow-sm shadow-black/10 elevation-2">
      <Text className="text-2xl font-bold text-gray-900 mb-4">{quiz.question}</Text>

      {quiz.options.map((option, index) => {
        const isSelected = selectedIndex === index;

        return (
          <TouchableOpacity
            key={option}
            onPress={() => onSelect(index)}
            activeOpacity={0.8}
            className={`px-4 py-3 rounded-xl border mb-3 ${
              isSelected ? "border-[#FB5607] bg-orange-50" : "border-gray-200 bg-white"
            }`}
          >
            <Text className={`text-lg ${isSelected ? "text-[#FB5607] font-semibold" : "text-gray-700"}`}>
              {option}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}