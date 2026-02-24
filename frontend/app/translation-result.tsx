import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import React, { useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Video, ResizeMode } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import * as Speech from 'expo-speech';
import { BlurView } from "expo-blur";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
  FadeInDown,
  FadeIn
} from "react-native-reanimated";

const { height } = Dimensions.get("window");

export default function TranslationResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const videoUri = params.videoUri as string;

  // Mock translation result
  const translatedText = "Hello, how are you?";

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
            <Video
              source={{ uri: videoUri }}
              style={StyleSheet.absoluteFill}
              resizeMode={ResizeMode.COVER}
              shouldPlay
              isLooping
              isMuted
            />
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
                <Text className="text-white text-3xl font-bold text-center leading-[40px]">
                  &quot;{translatedText}&quot;
                </Text>
              </View>

              <TouchableOpacity 
                activeOpacity={0.7}
                onPress={speak}
                className="bg-[#FB5607] w-14 h-14 rounded-full justify-center items-center shadow-lg shadow-[#FB5607]/40"
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
