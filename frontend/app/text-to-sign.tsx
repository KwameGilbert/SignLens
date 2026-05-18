import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { VideoView, useVideoPlayer } from "expo-video";
import { BlurView } from "expo-blur";
import * as Speech from "expo-speech";
import * as Haptics from "expo-haptics";
import Animated, { FadeInUp, FadeInDown } from "react-native-reanimated";

const quickPhrases = [
  "Hello, how are you?",
  "Thank you very much",
  "Nice to meet you",
  "Where is the train station?",
  "I love sign language",
];

export default function TextToSignScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [text, setText] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [currentSignWord, setCurrentSignWord] = useState<string>("Ready");

  // Video player for Avatar Sign Tutor
  const player = useVideoPlayer(require("../assets/videos/splash_video.mp4"), (videoPlayer) => {
    videoPlayer.loop = true;
    videoPlayer.muted = true;
  });

  const handleGenerateSign = () => {
    if (!text.trim()) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsPlaying(true);
      player.play();
      Speech.speak(text);
      setCurrentSignWord(text);
    }, 1200);
  };

  const handleClear = () => {
    Haptics.selectionAsync();
    setText("");
    setIsPlaying(false);
    setCurrentSignWord("Ready");
    player.pause();
  };

  const handlePhraseChip = (phrase: string) => {
    Haptics.selectionAsync();
    setText(phrase);
  };

  const toggleSpeed = () => {
    Haptics.selectionAsync();
    const nextSpeed = playbackSpeed === 1 ? 1.5 : playbackSpeed === 1.5 ? 0.75 : 1;
    setPlaybackSpeed(nextSpeed);
    player.playbackRate = nextSpeed;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-[#F2F2EA] dark:bg-slate-950"
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Premium Header */}
      <View className="pt-14 pb-4 px-6 bg-[#FB5607] rounded-b-[28px] flex-row justify-between items-center shadow-lg shadow-black/20 z-10">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-11 h-11 bg-white/20 rounded-full justify-center items-center border border-white/30 backdrop-blur-md"
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold tracking-wide">Text to Sign</Text>
        <TouchableOpacity
          onPress={handleClear}
          className="w-11 h-11 bg-white/20 rounded-full justify-center items-center border border-white/30 backdrop-blur-md"
        >
          <Ionicons name="trash-outline" size={22} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 px-5 pt-3"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Avatar Video Display */}
        <Animated.View entering={FadeInUp.duration(600).springify()} className="mb-3">
          <View className="bg-slate-900 rounded-[20px] overflow-hidden border border-white/20 shadow-xl h-64 relative">
            <VideoView
              player={player}
              style={StyleSheet.absoluteFillObject}
              contentFit="cover"
            />

            {/* Top Status Badge */}
            <View className="absolute top-4 right-4 bg-black/60 px-3 py-1.5 rounded-full border border-white/20 flex-row items-center backdrop-blur-md">
              <View className={`w-2 h-2 rounded-full ${isPlaying ? "bg-green-400" : "bg-orange-400"} mr-2`} />
              <Text className="text-white text-xs font-semibold uppercase tracking-wider">
                {isPlaying ? "Signing" : "Standby"}
              </Text>
            </View>

            {/* YouTube-style Subtitles Overlay */}
            {currentSignWord && currentSignWord !== "Ready" ? (
              <View className="absolute bottom-6 left-4 right-4 items-center justify-center pointer-events-none">
                <View className="bg-black/80 px-4 py-2 rounded-lg max-w-[75%] border border-white/10">
                  <Text className="text-white text-base font-bold text-center tracking-wide leading-6">
                    {currentSignWord}
                  </Text>
                </View>
              </View>
            ) : null}

            {/* Bottom Right Speed Badge */}
            <TouchableOpacity
              onPress={toggleSpeed}
              activeOpacity={0.7}
              className="absolute bottom-4 right-4 bg-black/60 px-3 py-1.5 rounded-full border border-white/20 flex-row items-center backdrop-blur-md"
            >
              <Ionicons name="speedometer-outline" size={14} color="white" style={{ marginRight: 4 }} />
              <Text className="text-white text-xs font-bold">{playbackSpeed}x</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Text Input Container */}
        <Animated.View entering={FadeInDown.duration(600).delay(200).springify()} className="mb-1">
          <Text className="text-slate-800 dark:text-white font-bold text-lg mb-1 ml-1">
            Enter your text
          </Text>

          <View className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm shadow-black/5 min-h-[140px] justify-between relative">
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Type anything to translate into sign language..."
              placeholderTextColor={isDark ? "#64748B" : "#94A3B8"}
              multiline
              textAlignVertical="top"
              className="text-slate-900 dark:text-white text-base leading-6 h-24 font-medium"
            />

            <View className="flex-row justify-between items-center border-t border-slate-100 dark:border-slate-800 pt-3 mt-2">
              <Text className="text-xs text-slate-400 font-semibold">{text.length} characters</Text>
              <TouchableOpacity
                onPress={() => Speech.speak(text)}
                disabled={!text}
                className={`flex-row items-center px-3 py-1.5 rounded-full border ${text ? "bg-orange-50 border-orange-200 dark:bg-orange-950/30 dark:border-orange-800" : "bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700"}`}
              >
                <Ionicons name="volume-medium" size={16} color={text ? "#FB5607" : "#94A3B8"} />
                <Text className={`text-xs font-bold ml-1 ${text ? "text-[#FB5607]" : "text-slate-400"}`}>
                  Listen
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* Quick Phrases */}
        <Animated.View entering={FadeInDown.duration(600).delay(300).springify()} className="mb-6">
          <Text className="text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider mb-2 ml-1">
            Quick demonstration phrases
          </Text>

          <View className="flex-row flex-wrap gap-2">
            {quickPhrases.map((phrase, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => handlePhraseChip(phrase)}
                className="bg-white dark:bg-slate-900 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm flex-row items-center"
              >
                <MaterialCommunityIcons name="lightning-bolt" size={16} color="#FB5607" style={{ marginRight: 4 }} />
                <Text className="text-slate-800 dark:text-slate-200 font-semibold text-sm">
                  {phrase}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Generate Action Button */}
        <Animated.View entering={FadeInDown.duration(600).delay(400).springify()}>
          <TouchableOpacity
            onPress={handleGenerateSign}
            disabled={!text.trim() || isProcessing}
            activeOpacity={0.8}
            className={`py-4 rounded-2xl items-center shadow-lg flex-row justify-center ${text.trim() ? "bg-[#FB5607] shadow-[#FB5607]/40" : "bg-slate-300 dark:bg-slate-800 shadow-transparent"}`}
          >
            {isProcessing ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <MaterialCommunityIcons name="hand-wave" size={24} color="white" style={{ marginRight: 8 }} />
                <Text className="text-white font-bold text-lg">Generate Sign Animation</Text>
              </>
            )}
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
