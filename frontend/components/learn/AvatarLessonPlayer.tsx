import { View, Text } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";

export default function AvatarLessonPlayer() {
  const player = useVideoPlayer(require("../../assets/videos/splash_video.mp4"), (videoPlayer) => {
    videoPlayer.loop = true;
  });

  return (
    <View className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm shadow-black/10 elevation-2 mb-4 border border-slate-100 dark:border-slate-800">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-gray-900 dark:text-white text-lg font-bold">Avatar Tutor</Text>
        <Text className="text-[#FB5607] text-xs font-semibold bg-orange-100 dark:bg-orange-950/40 px-2.5 py-1 rounded-full border border-orange-200 dark:border-orange-800">
          Video Lesson
        </Text>
      </View>

      <VideoView
        player={player}
        style={{ width: "100%", height: 220, borderRadius: 14 }}
        contentFit="cover"
        nativeControls
      />

      <Text className="text-gray-500 dark:text-slate-400 text-xs mt-3">
        Follow the avatar hand movements, pause where needed, and replay until the sign is clear.
      </Text>
    </View>
  );
}