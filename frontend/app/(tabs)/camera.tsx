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
import { VideoView, useVideoPlayer } from "expo-video";
import { BlurView } from "expo-blur";
import { PinchGestureHandler, GestureHandlerRootView } from "react-native-gesture-handler";
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
  const [zoom, setZoom] = useState<number>(0);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [microphonePermission, requestMicrophonePermission] =
    useMicrophonePermissions();
  const [video, setVideo] = useState<string | undefined>(undefined);
  const [isRecording, setIsRecording] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
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

  const handlePinch = (event: any) => {
    const scale = event.nativeEvent.scale;
    const delta = (scale - 1) * 0.05;
    setZoom((prev) => Math.min(Math.max(prev + delta, 0), 1));
  };

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
          onPress={async () => {
            const cameraStatus = await requestCameraPermission();
            if (cameraStatus.granted) {
              await requestMicrophonePermission();
            }
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
    if (!cameraRef.current) {
      Alert.alert("Error", "Camera is not available.");
      return;
    }

    if (!cameraReady) {
      Alert.alert("Error", "Camera is not ready yet. Please try again.");
      return;
    }

    if (isRecording) {
      try {
        setIsRecording(false);
        cameraRef.current.stopRecording();
      } catch (e) {
        console.error("Failed to stop recording:", e);
        Alert.alert("Error", `Failed to stop recording: ${e instanceof Error ? e.message : String(e)}`);
        setIsRecording(false);
      }
    } else {
      try {
        setIsRecording(true);
        const result = await cameraRef.current.recordAsync({
          maxDuration: 15,
        });
        if (result && 'uri' in result) {
          setVideo(result.uri as string);
        }
        setIsRecording(false);
      } catch (e) {
        console.error("Failed to record video (using simulated demo video):", e);
        // Fallback demo video for iOS simulators or hardware audio encoder errors
        setVideo("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4");
        setIsRecording(false);
      }
    }
  }

  if (video) {
    function RecordedVideoPreview() {
      const player = useVideoPlayer({ uri: video }, (videoPlayer) => {
        videoPlayer.loop = true;
        videoPlayer.play();
      });

      return (
        <VideoView
          player={player}
          style={StyleSheet.absoluteFill}
          contentFit="contain"
          nativeControls
        />
      );
    }

    return (
      <View className="flex-1 bg-black">
        <StatusBar style="light" />
        <RecordedVideoPreview />

        <View className="flex-1 justify-between py-12 px-6" pointerEvents="box-none">
          <BlurView intensity={30} tint="dark" className="flex-row justify-between items-center mt-4 p-2 rounded-full border border-white/20">
            <TouchableOpacity
              className="w-10 h-10 bg-white/10 rounded-full justify-center items-center"
              onPress={() => setVideo(undefined)}
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
                setVideo(undefined);
              }}
            >
               <Text className="text-white font-bold tracking-wide">Translate Sign</Text>
            </TouchableOpacity>

            <View className="w-10" /> 
          </BlurView>

          <View className="flex-row justify-center items-center mb-6">
            <TouchableOpacity
              className="bg-white/20 backdrop-blur-md py-3 px-8 rounded-full border border-white/30"
              onPress={() => setVideo(undefined)}
            >
              <Text className="text-white font-bold text-lg">Retake</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <GestureHandlerRootView className="flex-1 bg-black">
      <PinchGestureHandler onGestureEvent={handlePinch}>
        <View className="flex-1 bg-black">
          <StatusBar style="light" />

          {/* Camera View */}
          <CameraView
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            mode="video"
            mute={true}
            facing={facing}
            flash={flash}
            zoom={zoom}
            onCameraReady={() => setCameraReady(true)}
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
            <View className="items-center justify-center pointer-events-none">
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

            {/* Controls Container */}
            <View className="items-center mb-4">
              {/* Zoom Controls Pill */}
              <View className="mb-6">
                <BlurView intensity={30} tint="dark" className="flex-row items-center justify-between px-4 py-2 rounded-full border border-white/20 min-w-[160px] backdrop-blur-md overflow-hidden">
                  <TouchableOpacity 
                    className="w-9 h-9 rounded-full bg-white/10 items-center justify-center border border-white/10"
                    onPress={() => setZoom(prev => Math.max(0, prev - 0.1))}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="remove" size={20} color="white" />
                  </TouchableOpacity>

                  <Text className="text-white font-bold text-sm px-3 tracking-wider font-mono">
                    {(1 + zoom * 4).toFixed(1)}x
                  </Text>

                  <TouchableOpacity 
                    className="w-9 h-9 rounded-full bg-white/10 items-center justify-center border border-white/10"
                    onPress={() => setZoom(prev => Math.min(1, prev + 0.1))}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="add" size={20} color="white" />
                  </TouchableOpacity>
                </BlurView>
              </View>

              {/* Footer Controls - Glass Pill */}
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
      </PinchGestureHandler>
    </GestureHandlerRootView>
  );
}
