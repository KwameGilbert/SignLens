import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from "react-native";
import React, { useState, useRef } from "react";
import {
  CameraView,
  CameraType,
  FlashMode,
  useCameraPermissions,
  useMicrophonePermissions,
} from "expo-camera";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Video, ResizeMode } from "expo-av";

const { width } = Dimensions.get("window");

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [flash, setFlash] = useState<FlashMode>("off");
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [microphonePermission, requestMicrophonePermission] =
    useMicrophonePermissions();
  const [video, setVideo] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();

  if (!cameraPermission || !microphonePermission) {
    // Permissions are still loading.
    return <View />;
  }

  if (!cameraPermission.granted || !microphonePermission.granted) {
    // Permissions are not granted yet.
    return (
      <View className="flex-1 justify-center items-center bg-[#FDFDFD] px-6">
        <Text className="text-center text-lg font-semibold mb-4 text-gray-900">
          We need your permission to show the camera and record audio
        </Text>
        <TouchableOpacity
          className="bg-[#FB5607] py-3 px-6 rounded-xl"
          onPress={() => {
            requestCameraPermission();
            requestMicrophonePermission();
          }}
        >
          <Text className="text-white font-bold">Grant Permissions</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  function toggleFlash() {
    setFlash((current) => (current === "off" ? "on" : "off"));
  }

  async function recordVideo() {
    if (cameraRef.current) {
      if (isRecording) {
        setIsRecording(false);
        cameraRef.current.stopRecording();
      } else {
        setIsRecording(true);
        try {
          const videoData = await cameraRef.current.recordAsync();
          if (videoData?.uri) {
            setVideo(videoData.uri);
          }
        } catch (error) {
          console.error("Failed to record video:", error);
          Alert.alert("Error", "Failed to record video.");
          setIsRecording(false);
        }
      }
    }
  }

  if (video) {
    return (
      <View className="flex-1 bg-black">
        <StatusBar style="light" />
        <Video
          source={{ uri: video }}
          style={StyleSheet.absoluteFill}
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          isLooping
          shouldPlay
        />

        <View className="flex-1 justify-between py-12 px-6" pointerEvents="box-none">
          <View className="flex-row justify-between items-center mt-4">
            <TouchableOpacity
              className="w-10 h-10 bg-black/40 rounded-full justify-center items-center"
              onPress={() => setVideo(null)}
            >
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              className="px-6 py-2 bg-white/20 rounded-full backdrop-blur-sm"
              onPress={() => {
                router.push({
                  pathname: "/translation-result",
                  params: { videoUri: video }
                });
                setVideo(null);
              }}
            >
               <Text className="text-white font-medium">Translate Sign</Text>
            </TouchableOpacity>

            <View className="w-10" /> 
          </View>

          <View className="flex-row justify-center items-center mb-6">
            <TouchableOpacity
              className="bg-[#FB5607] py-3 px-8 rounded-full"
              onPress={() => setVideo(null)}
            >
              <Text className="text-white font-bold text-lg">Retake</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <StatusBar style="light" />

      {/* Camera View */}
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        mode="video"
        facing={facing}
        flash={flash}
      />

      {/* Overlay UI */}
      <View className="flex-1 justify-between py-12 px-6">
        {/* Header */}
        <View className="flex-row justify-between items-center mt-4">
          <TouchableOpacity
            className="w-10 h-10 bg-black/40 rounded-full justify-center items-center"
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>

          <Text className="text-white text-lg font-medium">
            {isRecording ? "Recording..." : "Video mode"}
          </Text>

          <TouchableOpacity
            className="w-10 h-10 bg-black/40 rounded-full justify-center items-center"
            onPress={toggleFlash}
          >
            <Ionicons
              name={flash === "on" ? "flash" : "flash-off"}
              size={24}
              color="white"
            />
          </TouchableOpacity>
        </View>

        {/* Center Frame */}
        <View className="items-center justify-center">
          <View
            className={`border-4 ${isRecording ? "border-red-500" : "border-[#FB5607]"} rounded-[30px] justify-center items-center`}
            style={{ width: width * 0.8, height: width * 0.8 }}
          >
            {!isRecording && (
              <View className="bg-black/40 px-4 py-2 rounded-lg items-center">
                <Ionicons
                  name="videocam"
                  size={32}
                  color="white"
                  className="opacity-80"
                />
                <Text className="text-white text-xs mt-1 font-medium opacity-80">
                  Video view
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Footer Controls */}
        <View className="flex-row justify-between items-center mb-6 px-4">
          <TouchableOpacity
            className="w-12 h-12 bg-black/40 rounded-full justify-center items-center"
            onPress={() => {}}
          >
            <MaterialIcons name="history" size={28} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            className={`w-20 h-20 rounded-full justify-center items-center shadow-lg ${isRecording ? "bg-red-500 shadow-red-500/40" : "bg-[#FB5607] shadow-[#FB5607]/40"}`}
            activeOpacity={0.8}
            onPress={recordVideo}
          >
            {isRecording ? (
              <Ionicons name="stop" size={40} color="white" />
            ) : (
              <Ionicons
                name="videocam"
                size={40}
                color="white"
                style={{ marginLeft: 4 }}
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            className="w-12 h-12 bg-black/40 rounded-full justify-center items-center"
            onPress={toggleCameraFacing}
          >
            <Ionicons name="camera-reverse-outline" size={28} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
