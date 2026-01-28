import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert } from "react-native";
import React, { useState, useRef } from "react";
import { CameraView, CameraType, FlashMode, useCameraPermissions } from "expo-camera";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Image } from "expo-image";

const { width } = Dimensions.get("window");

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [flash, setFlash] = useState<FlashMode>("off");
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View className="flex-1 justify-center items-center bg-[#FDFDFD] px-6">
        <Text className="text-center text-lg font-semibold mb-4 text-gray-900">
          We need your permission to show the camera
        </Text>
        <TouchableOpacity
          className="bg-[#FB5607] py-3 px-6 rounded-xl"
          onPress={requestPermission}
        >
          <Text className="text-white font-bold">Grant Permission</Text>
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

  async function takePicture() {
    if (cameraRef.current) {
      try {
        const photoData = await cameraRef.current.takePictureAsync();
        if (photoData?.uri) {
          setPhoto(photoData.uri);
        }
      } catch (error) {
        console.error("Failed to take picture:", error);
        Alert.alert("Error", "Failed to take picture.");
      }
    }
  }

  if (photo) {
    return (
      <View className="flex-1 bg-black">
         <StatusBar style="light" />
        <Image source={{ uri: photo }} style={StyleSheet.absoluteFill} contentFit="contain" />
        
        <View className="flex-1 justify-between py-12 px-6">
          <View className="flex-row justify-between items-center mt-4">
             <TouchableOpacity
              className="w-10 h-10 bg-black/40 rounded-full justify-center items-center"
              onPress={() => setPhoto(null)}
            >
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-center items-center mb-6">
             <TouchableOpacity
              className="bg-[#FB5607] py-3 px-8 rounded-full"
              onPress={() => setPhoto(null)}
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

          <Text className="text-white text-lg font-medium">Live camera</Text>

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
            className="border-4 border-[#FB5607] rounded-[30px] justify-center items-center"
            style={{ width: width * 0.8, height: width * 0.8 }}
          >
            <View className="bg-black/40 px-4 py-2 rounded-lg items-center">
              <Ionicons name="camera" size={32} color="white" className="opacity-80" />
              <Text className="text-white text-xs mt-1 font-medium opacity-80">
                Camera view
              </Text>
            </View>
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
            className="w-20 h-20 bg-[#FB5607] rounded-full justify-center items-center shadow-lg shadow-[#FB5607]/40"
            activeOpacity={0.8}
            onPress={takePicture}
          >
            <Ionicons name="play" size={40} color="white" style={{ marginLeft: 4 }} />
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
