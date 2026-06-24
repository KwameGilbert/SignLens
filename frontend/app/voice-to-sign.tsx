import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  useColorScheme,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { VideoView, useVideoPlayer } from "expo-video";
import { BlurView } from "expo-blur";
import * as Speech from "expo-speech";
import * as Haptics from "expo-haptics";
import Animated, {
  FadeInUp,
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

export default function VoiceToSignScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcript, setTranscript] = useState("Tap the microphone below and begin speaking...");
  const [selectedLang, setSelectedLang] = useState<"en" | "gh">("en");

  // Pulse animation for recording microphone
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0);

  useEffect(() => {
    if (isRecording) {
      pulseOpacity.value = 1;
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.3, { duration: 800, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    } else {
      pulseOpacity.value = 0;
      pulseScale.value = withTiming(1, { duration: 300 });
    }
  }, [isRecording, pulseScale, pulseOpacity]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  // Video player for Avatar Sign Tutor
  const player = useVideoPlayer(require("../assets/videos/splash_video.mp4"), (videoPlayer) => {
    videoPlayer.loop = true;
    videoPlayer.muted = true;
  });

  const handleToggleRecord = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (!isRecording) {
      setIsRecording(true);
      setTranscript("Listening carefully to your voice...");
    } else {
      setIsRecording(false);
      setIsProcessing(true);
      setTranscript("Processing spoken audio...");

      // Simulate AI Speech-to-Text & Sign Generation
      setTimeout(() => {
        setIsProcessing(false);
        const recognized = "Good afternoon, I am looking for the nearest pharmacy.";
        setTranscript(recognized);
        setIsPlaying(true);
        player.play();
        Speech.speak(recognized);
      }, 1500);
    }
  };

  const handleReset = () => {
    Haptics.selectionAsync();
    setIsRecording(false);
    setIsProcessing(false);
    setIsPlaying(false);
    setTranscript("Tap the microphone below and begin speaking...");
    player.pause();
  };

  return (
    <View className="flex-1 bg-[#F2F2EA] dark:bg-slate-950">
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Premium Header */}
      <View className="pt-14 pb-4 px-6 bg-[#FB5607] rounded-b-[28px] flex-row justify-between items-center shadow-lg shadow-black/20 z-10">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-11 h-11 bg-white/20 rounded-full justify-center items-center border border-white/30 backdrop-blur-md"
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <View className="items-center">
          <Text className="text-white text-xl font-bold tracking-wide">Voice to Sign</Text>
          <View className="flex-row items-center mt-0.5">
            <View className={`w-1.5 h-1.5 rounded-full ${isRecording ? "bg-red-300 animate-pulse" : "bg-white/70"} mr-1.5`} />
            <Text className="text-white/80 text-xs font-semibold uppercase tracking-wider">
              {isRecording ? "Live Microphone" : "Ready"}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleReset}
          className="w-11 h-11 bg-white/20 rounded-full justify-center items-center border border-white/30 backdrop-blur-md"
        >
          <Ionicons name="refresh" size={22} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 px-5 pt-3"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Avatar Video Display */}
        <Animated.View entering={FadeInUp.duration(600).springify()} className="mb-6">
          <View className="bg-slate-900 rounded-[20px] overflow-hidden border border-white/20 shadow-xl h-64 relative">
            <VideoView
              player={player}
              style={StyleSheet.absoluteFillObject}
              contentFit="cover"
            />

            {/* Top Language Pill */}
            <View className="absolute top-4 left-4 bg-black/60 px-3.5 py-1.5 rounded-full border border-white/20 flex-row items-center backdrop-blur-md">
              <Ionicons name="language" size={14} color="#FB5607" style={{ marginRight: 6 }} />
              <Text className="text-white text-xs font-bold uppercase tracking-wider">
                {selectedLang === "en" ? "English" : "Ghana Sign"}
              </Text>
            </View>

            {/* Top Audio Playback Button */}
            {isPlaying && (
              <TouchableOpacity
                onPress={() => Speech.speak(transcript)}
                className="absolute top-4 right-4 bg-black/60 px-3 py-1.5 rounded-full border border-white/20 flex-row items-center backdrop-blur-md"
              >
                <Ionicons name="volume-high" size={14} color="#FB5607" style={{ marginRight: 4 }} />
                <Text className="text-white text-xs font-bold uppercase tracking-wider">Listen</Text>
              </TouchableOpacity>
            )}

            {/* YouTube-style Subtitles Overlay */}
            {isPlaying && transcript && !transcript.startsWith("Tap") ? (
              <View className="absolute bottom-6 left-4 right-4 items-center justify-center pointer-events-none">
                <View className="bg-black/80 px-4 py-2 rounded-lg max-w-[90%] border border-white/10">
                  <Text className="text-white text-base font-bold text-center tracking-wide leading-6">
                    {transcript}
                  </Text>
                </View>
              </View>
            ) : null}
          </View>
        </Animated.View>

        {/* Live Transcription Box */}
        <Animated.View entering={FadeInDown.duration(600).delay(200).springify()} className="mb-8">
          <View className="flex-row justify-between items-center mb-2 ml-1">
            <Text className="text-slate-800 dark:text-white font-bold text-lg">
              Live Transcription
            </Text>
            {isProcessing && <ActivityIndicator size="small" color="#FB5607" />}
          </View>

          <View className={`bg-white dark:bg-slate-900 rounded-3xl p-5 border ${isRecording ? "border-[#FB5607] shadow-lg shadow-[#FB5607]/10" : "border-slate-200 dark:border-slate-800 shadow-sm shadow-black/5"} min-h-[130px] justify-between relative`}>
            <Text className={`text-base leading-7 font-medium ${transcript.startsWith("Tap") || transcript.startsWith("Listening") || transcript.startsWith("Processing") ? "text-slate-400 dark:text-slate-500 italic" : "text-slate-900 dark:text-white font-semibold"}`}>
              &quot;{transcript}&quot;
            </Text>

            <View className="flex-row justify-between items-center border-t border-slate-100 dark:border-slate-800 pt-3 mt-4">
              <View className="flex-row items-center">
                <View className={`w-2 h-2 rounded-full ${isRecording ? "bg-red-500 animate-pulse" : isPlaying ? "bg-green-500" : "bg-slate-300 dark:bg-slate-700"} mr-2`} />
                <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {isRecording ? "Recording active" : isPlaying ? "Translation ready" : "Microphone standby"}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => setSelectedLang(selectedLang === "en" ? "gh" : "en")}
                className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700"
              >
                <Text className="text-slate-700 dark:text-slate-300 text-xs font-bold">
                  Switch: {selectedLang === "en" ? "GHSL" : "EN"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Central Floating Microphone Button */}
      <View className="absolute bottom-10 left-0 right-0 items-center justify-center pointer-events-box-none z-20">
        <View className="items-center">
          {/* Animated Glow Wave */}
          <Animated.View
            className="absolute w-28 h-28 rounded-full bg-[#FB5607]/20 border-2 border-[#FB5607]/40"
            style={pulseStyle}
          />

          <TouchableOpacity
            onPress={handleToggleRecord}
            activeOpacity={0.85}
            className={`w-20 h-20 rounded-full items-center justify-center shadow-xl ${isRecording ? "bg-red-500 shadow-red-500/50" : "bg-[#FB5607] shadow-[#FB5607]/50"} border-4 border-white dark:border-slate-800`}
          >
            <MaterialCommunityIcons
              name={isRecording ? "stop" : "microphone"}
              size={36}
              color="white"
            />
          </TouchableOpacity>
        </View>
        <Text className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-widest mt-4">
          {isRecording ? "Tap to stop & translate" : "Tap to speak"}
        </Text>
      </View>
    </View>
  );
}
