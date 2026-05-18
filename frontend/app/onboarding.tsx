import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState, useRef } from "react";
import { Image } from "expo-image";

const { width } = Dimensions.get("window");

const onboardingData = [
  {
    id: "1",
    title: "Real-Time Sign Language\nTranslation",
    description:
      "Use your camera to instantly translate sign language into text and voice",
    image: require("../assets/images/Scan.png"),
  },
  {
    id: "2",
    title: "Learn Sign Language\nEasily",
    description:
      "Master alphabets, numbers, phrases and conversations at your own pace",
    image: require("../assets/images/Learn.png"),
  },
  {
    id: "3",
    title: "Track Your Progress",
    description:
      "Monitor your learning journey with detailed statistics and achievements",
    image: require("../assets/images/progress.png"),
  },
  {
    id: "4",
    title: "Text & Voice to Sign",
    description: "Convert your text or speech into sign language animations",
    image: require("../assets/images/Voice.png"),
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleContinue = () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      // Navigate to welcome screen
      router.push("/welcome");
    }
  };

  const handleSkip = () => {
    // Navigate to welcome screen
    router.push("/welcome");
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const renderItem = ({ item }: { item: (typeof onboardingData)[0] }) => (
    <View style={{ width }} className="flex-1 px-6 justify-center items-center">
      {/* Image */}
      <View className="w-full h-1/2 items-center justify-center mb-8">
        <Image
          source={item.image}
          style={{ width: "100%", height: "100%" }}
          contentFit="contain"
        />
      </View>

      {/* Title */}
      <Text className="text-slate-900 text-3xl font-bold text-center mb-4 leading-10">
        {item.title}
      </Text>

      {/* Description */}
      <Text className="text-slate-600 text-base text-center px-4 leading-6">
        {item.description}
      </Text>
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="dark" />

      {/* Skip Button */}
      {currentIndex < onboardingData.length - 1 && (
        <TouchableOpacity
          className="absolute top-12 right-6 z-10 py-2 px-4"
          onPress={handleSkip}
        >
          <Text className="text-gray-600 font-semibold">Skip</Text>
        </TouchableOpacity>
      )}

      {/* Carousel */}
      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />

      {/* Bottom Section */}
      <View className="px-6 pb-12">
        {/* Pagination Dots */}
        <View className="flex-row justify-center mb-8">
          {onboardingData.map((_, index) => (
            <View
              key={index}
              className={`h-2 rounded-full mx-1 transition-all ${
                index === currentIndex ? "bg-primary w-8" : "bg-slate-300 w-2"
              }`}
            />
          ))}
        </View>

        {/* Continue/Get Started Button */}
        <TouchableOpacity
          className="bg-primary py-4 rounded-xl items-center active:opacity-90"
          onPress={handleContinue}
        >
          <Text className="text-white font-bold text-lg">
            {currentIndex === onboardingData.length - 1
              ? "Get Started"
              : "Continue"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
