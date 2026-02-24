import { Text, View } from "react-native";

type SectionTitleProps = {
  title: string;
  subtitle?: string;
  className?: string;
};

export default function SectionTitle({ title, subtitle, className = "" }: SectionTitleProps) {
  return (
    <View className={className}>
      <Text className="text-slate-900 dark:text-white text-2xl font-bold mb-1">{title}</Text>
      {subtitle ? (
        <Text className="text-slate-500 dark:text-slate-300 text-sm">{subtitle}</Text>
      ) : null}
    </View>
  );
}
