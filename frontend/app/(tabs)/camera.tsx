import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
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
import { BlurView } from "expo-blur";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  withSpring,
} from "react-native-reanimated";

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

  // Animation values
  const recordButtonScale = useSharedValue(1);
  const recordButtonBorderRadius = useSharedValue(40);
  const recordingPulse = useSharedValue(1);

  useEffect(() => {
    if (isRecording) {
      recordButtonScale.value = withSpring(0.6);
      recordButtonBorderRadius.value = withTiming(12, { duration: 300 });
      recordingPulse.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 800, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.95, { duration: 800, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    } else {
      recordButtonScale.value = withSpring(1);
      recordButtonBorderRadius.value = withTiming(40, { duration: 300 });
      recordingPulse.value = withTiming(1, { duration: 300 });
    }
  }, [isRecording, recordButtonScale, recordButtonBorderRadius, recordingPulse]);

  const recordIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: recordButtonScale.value }],
    borderRadius: recordButtonBorderRadius.value,
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: recordingPulse.value }],
    opacity: isRecording ? 1 : 0,
  }));

  if (!cameraPermission || !microphonePermission) {
    // Permissions are still loading.
    return <View />;
  }

  if (!cameraPermission.granted || !microphonePermission.granted) {
    return (
      <View className="flex-1 justify-center items-center bg-[#FDFDFD] dark:bg-slate-900 px-6">
        <Text className="text-center text-lg font-semibold mb-4 text-slate-900 dark:text-white">
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
          <BlurView intensity={30} tint="dark" className="flex-row justify-between items-center mt-4 p-2 rounded-full border border-white/20">
            <TouchableOpacity
              className="w-10 h-10 bg-white/10 rounded-full justify-center items-center"
              onPress={() => setVideo(null)}
            >
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              className="px-6 py-2 bg-[#FB5607]/80 rounded-full border border-white/20"
              onPress={() => {
                router.push({
                  pathname: "/translation-result",
                  params: { videoUri: video }
                });
                setVideo(null);
              }}
            >
               <Text className="text-white font-bold tracking-wide">Translate Sign</Text>
            </TouchableOpacity>

            <View className="w-10" /> 
          </BlurView>

          <View className="flex-row justify-center items-center mb-6">
            <TouchableOpacity
              className="bg-white/20 backdrop-blur-md py-3 px-8 rounded-full border border-white/30"
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
      <View className="flex-1 justify-between py-16 px-6">
        {/* Header - Glass */}
        <BlurView intensity={20} tint="dark" className="flex-row justify-between items-center px-2 py-2 rounded-full border border-white/20 overflow-hidden">
          <TouchableOpacity
            className="w-10 h-10 bg-white/10 rounded-full justify-center items-center"
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>

          <View className="flex-row items-center">
            {isRecording && <View className="w-2 h-2 rounded-full bg-red-500 mr-2" />}
            <Text className="text-white text-sm font-semibold tracking-widest uppercase">
              {isRecording ? "Recording" : "Video"}
            </Text>
          </View>

          <TouchableOpacity
            className="w-10 h-10 bg-white/10 rounded-full justify-center items-center"
            onPress={toggleFlash}
          >
            <Ionicons
              name={flash === "on" ? "flash" : "flash-off"}
              size={20}
              color={flash === "on" ? "#ffbe0b" : "white"}
            />
          </TouchableOpacity>
        </BlurView>

        {/* Center Frame */}
        <View className="items-center justify-center">
          <Animated.View
            className={`absolute justify-center items-center rounded-3xl border-2 border-[#FB5607]/40`}
            style={[{ width: width * 0.85, height: width * 0.85 }, pulseStyle]}
          />
          <View
            className={`border border-white/30 rounded-[35px] justify-center items-center ${isRecording ? "border-transparent" : "border-white/30"}`}
            style={{ width: width * 0.8, height: width * 0.8 }}
          >
            {/* Corner Bracket TL */}
            <View className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-white/60 rounded-tl-3xl" />
            {/* Corner Bracket TR */}
            <View className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-white/60 rounded-tr-3xl" />
            {/* Corner Bracket BL */}
            <View className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-white/60 rounded-bl-3xl" />
            {/* Corner Bracket BR */}
            <View className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-white/60 rounded-br-3xl" />

            {!isRecording && (
              <BlurView intensity={40} tint="dark" className="px-5 py-3 rounded-full overflow-hidden flex-row border border-white/20 items-center justify-center">
                <Ionicons
                  name="scan-outline"
                  size={20}
                  color="white"
                  className="opacity-80 mr-2"
                />
                <Text className="text-white text-xs font-semibold uppercase tracking-wider opacity-90">
                  Align Subject
                </Text>
              </BlurView>
            )}
          </View>
        </View>

        {/* Footer Controls - Glass Pill */}
        <View className="items-center mb-4">
          <BlurView intensity={30} tint="dark" className="flex-row justify-between items-center px-8 py-5 rounded-[40px] border border-white/20 overflow-hidden w-full backdrop-blur-lg">
            <TouchableOpacity
              className="w-12 h-12 bg-white/10 rounded-full justify-center items-center border border-white/10"
              onPress={() => {}}
            >
              <MaterialIcons name="photo-library" size={24} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              className="w-20 h-20 items-center justify-center"
              activeOpacity={0.8}
              onPress={recordVideo}
            >
              {/* Outer Ring */}
              <View className="absolute w-[72px] h-[72px] rounded-full border-[3px] border-white/60" />
              {/* Animated Inner Button */}
              <Animated.View 
                className={`bg-[#FB5607]`}
                style={[{ width: 56, height: 56 }, recordIconStyle]}
              />
            </TouchableOpacity>

            <TouchableOpacity
              className="w-12 h-12 bg-white/10 rounded-full justify-center items-center border border-white/10"
              onPress={toggleCameraFacing}
            >
              <Ionicons name="camera-reverse-outline" size={24} color="white" />
            </TouchableOpacity>
          </BlurView>
        </View>
      </View>
    </View>
  );
}
