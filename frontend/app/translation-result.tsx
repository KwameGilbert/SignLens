import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator } from "react-native";
import React, { useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { VideoView, useVideoPlayer } from "expo-video";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import * as Speech from 'expo-speech';
import { BlurView } from "expo-blur";
import * as VideoThumbnails from 'expo-video-thumbnails';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
  FadeInDown,
  FadeIn
} from "react-native-reanimated";
import { usePredict } from "../hooks/usePredict";

const { height } = Dimensions.get("window");

export default function TranslationResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const videoUri = params.videoUri as string;
  const { predictImageMutation } = usePredict();

  useEffect(() => {
    async function processVideo() {
      if (!videoUri) return;
      try {
        console.log("[PREDICT] Extracting thumbnail from video:", videoUri);
        // Extract a frame from the middle/beginning of the video
        const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, {
          time: 500, // 0.5s into the video
          quality: 0.8,
        });
        console.log("[PREDICT] Thumbnail extracted:", uri);
        predictImageMutation.mutate(uri);
      } catch (e) {
        console.error("[PREDICT ERROR] Failed to extract thumbnail:", e);
      }
    }
    processVideo();
  }, [videoUri]);

  useEffect(() => {
    if (predictImageMutation.isError) {
      console.error("[PREDICT ERROR]", predictImageMutation.error);
      if ((predictImageMutation.error as any).response) {
        console.error("Response data:", (predictImageMutation.error as any).response.data);
      }
    }
    if (predictImageMutation.isSuccess) {
      console.log("[PREDICT SUCCESS]", predictImageMutation.data?.data);
    }
  }, [predictImageMutation.isError, predictImageMutation.isSuccess, predictImageMutation.error, predictImageMutation.data]);

  function VideoBackground() {
    const player = useVideoPlayer({ uri: videoUri }, (videoPlayer) => {
      videoPlayer.muted = true;
      videoPlayer.loop = true;
      videoPlayer.play();
    });

    return <VideoView player={player} style={StyleSheet.absoluteFill} contentFit="cover" />;
  }

  let translatedText = "Analyzing sign...";
  if (predictImageMutation.isPending) {
    translatedText = "Analyzing sign...";
  } else if (predictImageMutation.isError) {
    translatedText = "Failed to translate.";
  } else if (predictImageMutation.isSuccess) {
    const result = predictImageMutation.data?.data as any;
    // Format the text so it's capitalized properly if needed, but we'll just use the label
    // The backend uses 'prediction' instead of 'prediction_label' per documentation
    translatedText = result?.prediction || result?.data?.prediction || "No sign detected.";
  }

  const speak = () => {
    Speech.speak(translatedText);
  };

  return (
    <View className="flex-1 bg-black">
      <StatusBar style="light" />
      
      {/* Full Screen Video Background */}
      <View className="absolute inset-0 bg-slate-900">
        {videoUri ? (
          <>
            <VideoBackground />
            {/* Heavy Blur Overlay to make it a vibrant background */}
            <BlurView intensity={70} tint="dark" style={StyleSheet.absoluteFill} />
            <View className="absolute inset-0 bg-black/40" />
          </>
        ) : (
          <View className="flex-1 justify-center items-center">
            <Text className="text-white/50">No video source</Text>
          </View>
        )}
      </View>

      {/* Header Back Button */}
      <Animated.View entering={FadeIn.delay(300).duration(500)} className="absolute top-16 left-6 z-10">
        <TouchableOpacity
          className="w-12 h-12 bg-white/20 rounded-full justify-center items-center border border-white/30 backdrop-blur-md"
          onPress={() => router.back()}
        >
          <Ionicons name="close" size={24} color="white" />
        </TouchableOpacity>
      </Animated.View>

      {/* Glassmorphism Bottom Sheet */}
      <Animated.View 
        entering={FadeInDown.springify().damping(20).stiffness(100).delay(100)}
        className="absolute bottom-0 w-full"
      >
        <BlurView 
          intensity={50} 
          tint="dark" 
          className="rounded-t-[40px] px-8 pt-8 pb-12 border-t border-white/20 overflow-hidden shadow-2xl"
        >
          <View className="items-center mb-10 mt-2">
            <View className="w-16 h-1.5 bg-white/30 rounded-full mb-8" />
            
            <Animated.View entering={FadeInDown.springify().delay(300)} className="items-center w-full">
              <Text className="text-white/60 text-sm font-semibold uppercase tracking-[0.2em] mb-4">
                Translation
              </Text>
              
              <View className="bg-white/10 p-6 rounded-3xl border border-white/20 w-full mb-6">
                {predictImageMutation.isPending ? (
                  <ActivityIndicator size="large" color="#ffffff" className="my-2" />
                ) : (
                  <Text className="text-white text-3xl font-bold text-center leading-[40px]">
                    &quot;{translatedText}&quot;
                  </Text>
                )}
              </View>

              <TouchableOpacity 
                activeOpacity={0.7}
                onPress={speak}
                disabled={predictImageMutation.isPending || predictImageMutation.isError}
                className={`w-14 h-14 rounded-full justify-center items-center shadow-lg shadow-[#FB5607]/40 ${predictImageMutation.isPending || predictImageMutation.isError ? "bg-gray-500 opacity-50" : "bg-[#FB5607]"}`}
              >
                <Ionicons name="volume-high" size={28} color="white" />
              </TouchableOpacity>
            </Animated.View>
          </View>

          <Animated.View entering={FadeInDown.springify().delay(500)} className="space-y-4">
            <TouchableOpacity
              activeOpacity={0.8}
              className="bg-white/20 backdrop-blur-md py-4 rounded-2xl flex-row justify-center items-center border border-white/30"
              onPress={() => router.back()}
            >
              <Ionicons name="refresh" size={24} color="white" className="mr-2" />
              <Text className="text-white font-bold text-lg ml-2">Translate Another</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              className="bg-transparent py-4 rounded-2xl flex-row justify-center items-center"
              onPress={() => router.dismissTo("/")}
            >
              <Text className="text-white/80 font-semibold text-lg">Back to Home</Text>
            </TouchableOpacity>
          </Animated.View>
        </BlurView>
      </Animated.View>
      
    </View>
  );
}
