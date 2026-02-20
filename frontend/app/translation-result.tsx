import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Video, ResizeMode } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import * as Speech from 'expo-speech';

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
      
      {/* Video Background/Preview */}
      <View className="absolute top-0 left-0 right-0 h-1/2 bg-gray-900">
        {videoUri ? (
          <Video
            source={{ uri: videoUri }}
            style={StyleSheet.absoluteFill}
            resizeMode={ResizeMode.COVER}
            shouldPlay
            isLooping
            isMuted
          />
        ) : (
          <View className="flex-1 justify-center items-center">
            <Text className="text-white text-opacity-50">No video source</Text>
          </View>
        )}
        <View className="absolute inset-0 bg-black/20" />
      </View>

      {/* Content Container */}
      <View className="flex-1 mt-[40vh] bg-white rounded-t-[32px] px-6 pt-8 pb-10 shadow-2xl">
        <View className="items-center mb-8">
          <View className="w-12 h-1.5 bg-gray-300 rounded-full mb-6" />
          <Text className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">
            Translation
          </Text>
          <View className="flex-row items-center gap-3">
             <Text className="text-gray-900 text-3xl font-bold text-center leading-tight">
                &quot;{translatedText}&quot;
             </Text>
             <TouchableOpacity 
                onPress={speak}
                className="bg-gray-100 p-2 rounded-full"
             >
                <Ionicons name="volume-high" size={24} color="#FB5607" />
             </TouchableOpacity>
          </View>
        </View>

        <View className="flex-1 justify-end space-y-4">
          <TouchableOpacity
            className="bg-[#FB5607] py-4 rounded-xl flex-row justify-center items-center shadow-lg shadow-orange-500/30"
            onPress={() => router.back()}
          >
            <Ionicons name="refresh" size={24} color="white" className="mr-2" />
            <Text className="text-white font-bold text-lg ml-2">Translate Another</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-gray-100 py-4 rounded-xl flex-row justify-center items-center"
            onPress={() => router.dismissTo("/")}
          >
            <Ionicons name="home" size={24} color="#374151" className="mr-2" />
            <Text className="text-gray-700 font-bold text-lg ml-2">Go Home</Text>
          </TouchableOpacity>
        </View>
      </View>
      
       {/* Header Back Button */}
       <TouchableOpacity
          className="absolute top-12 left-6 w-10 h-10 bg-black/40 rounded-full justify-center items-center"
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
    </View>
  );
}
