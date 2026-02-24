import { View, Text } from "react-native";
import { Video, ResizeMode } from "expo-av";

export default function AvatarLessonPlayer() {
  return (
    <View className="bg-white rounded-2xl p-4 shadow-sm shadow-black/10 elevation-2 mb-4">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-gray-900 text-lg font-bold">Avatar Tutor</Text>
        <Text className="text-[#FB5607] text-xs font-semibold bg-orange-100 px-2 py-1 rounded-full">
          Video Lesson
        </Text>
      </View>

      <Video
        source={require("../../assets/videos/splash_video.mp4")}
        style={{ width: "100%", height: 220, borderRadius: 14 }}
        resizeMode={ResizeMode.COVER}
        useNativeControls
        shouldPlay={false}
        isLooping
      />

      <Text className="text-gray-500 text-xs mt-3">
        Follow the avatar hand movements, pause where needed, and replay until the sign is clear.
      </Text>
    </View>
  );
}