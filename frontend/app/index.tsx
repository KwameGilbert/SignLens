import { View, Text } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

export default function SplashScreen() {
  const router = useRouter();
  const player = useVideoPlayer(require('../assets/videos/splash_video.mp4'), (videoPlayer) => {
    videoPlayer.muted = true;
    videoPlayer.loop = true;
    videoPlayer.play();
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/onboarding');
    }, 6000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View className="flex-1 relative">
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="light" />
      
      <VideoView
        player={player}
        style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0 }}
        contentFit="cover"
      />

      {/* Overlay Content */}
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="items-center px-4 w-full max-w-md">
            <Text className="text-white text-4xl font-bold mb-2 text-center">SignLens</Text>
            <Text className="text-white/80 text-lg text-center">
                Bridge communication gaps with real-time sign language translation.
            </Text>
        </View>
      </View>
    </View>
  );
}