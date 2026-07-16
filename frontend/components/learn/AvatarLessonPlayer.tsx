import { View, Text } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import YoutubePlayer from "react-native-youtube-iframe";
import { Ionicons } from "@expo/vector-icons";

type AvatarLessonPlayerProps = {
  videoUrl?: string | null;
};

function DirectVideoPlayer({ videoUrl }: { videoUrl: string }) {
  const player = useVideoPlayer(videoUrl, (videoPlayer) => {
    videoPlayer.loop = true;
  });

  return (
    <VideoView
      player={player}
      style={{ width: "100%", height: 220, borderRadius: 14 }}
      contentFit="cover"
      nativeControls
    />
  );
}

export default function AvatarLessonPlayer({ videoUrl }: AvatarLessonPlayerProps) {
  // Determine if it's a YouTube link
  const isYoutube = videoUrl?.includes("youtube.com") || videoUrl?.includes("youtu.be");

  // Extract YouTube ID if applicable
  let youtubeId = "";
  if (isYoutube && videoUrl) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = videoUrl.match(regExp);
    youtubeId = (match && match[2].length === 11) ? match[2] : "";
  }

  return (
    <View className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm shadow-black/10 elevation-2 mb-4 border border-slate-100 dark:border-slate-800">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-gray-900 dark:text-white text-lg font-bold">Avatar Tutor</Text>
        <Text className="text-[#FB5607] text-xs font-semibold bg-orange-100 dark:bg-orange-950/40 px-2.5 py-1 rounded-full border border-orange-200 dark:border-orange-800">
          Video Lesson
        </Text>
      </View>

      {isYoutube && youtubeId ? (
        <View style={{ borderRadius: 14, overflow: "hidden" }}>
          <YoutubePlayer
            height={220}
            play={false}
            videoId={youtubeId}
            webViewStyle={{ opacity: 0.99 }}
          />
        </View>
      ) : videoUrl ? (
        <DirectVideoPlayer videoUrl={videoUrl} />
      ) : (
        <View
          style={{ height: 220, borderRadius: 14 }}
          className="bg-slate-100 dark:bg-slate-800 items-center justify-center border border-slate-200 dark:border-slate-700"
        >
          <Ionicons name="videocam-off-outline" size={40} color="#9ca3af" />
          <Text className="text-gray-400 dark:text-slate-500 text-sm mt-2 font-medium">
            No video available for this lesson
          </Text>
        </View>
      )}

      <Text className="text-gray-500 dark:text-slate-400 text-xs mt-3">
        Follow the avatar hand movements, pause where needed, and replay until the sign is clear.
      </Text>
    </View>
  );
}