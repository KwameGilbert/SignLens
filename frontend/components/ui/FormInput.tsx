import { View, Text, TextInput, TextInputProps, useColorScheme } from "react-native";

type FormInputProps = TextInputProps & {
  label: string;
  error?: string;
};

export default function FormInput({ label, error, ...props }: FormInputProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View className="mb-4">
      <Text className="text-slate-900 dark:text-white text-base font-semibold mb-2">
        {label}
      </Text>
      <TextInput
        className={`border rounded-xl px-4 py-3.5 text-base font-medium ${
          error
            ? "border-red-500 dark:border-red-400"
            : "border-primary dark:border-primary dark:border-opacity-50"
        } ${
          isDark
            ? "bg-slate-800 text-white placeholder:text-slate-500"
            : "bg-white text-slate-900 placeholder:text-slate-400"
        }`}
        placeholderTextColor={isDark ? "#64748B" : "#A0AEC0"}
        {...props}
      />
      {error && (
        <Text className="text-red-500 dark:text-red-400 text-xs mt-1">
          {error}
        </Text>
      )}
    </View>
  );
}
