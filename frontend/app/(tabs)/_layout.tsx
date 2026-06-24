import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Platform, StyleSheet, useColorScheme, View } from "react-native";
import { BlurView } from "expo-blur";

export default function TabsLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#FB5607",
        tabBarInactiveTintColor: isDark ? "#94A3B8" : "#64748B",
        tabBarBackground: () => (
          <View style={[StyleSheet.absoluteFill, { borderRadius: 35, overflow: "hidden" }]}>
            <BlurView
              tint={isDark ? "dark" : "light"}
              intensity={50}
              style={StyleSheet.absoluteFillObject}
            />
          </View>
        ),
        tabBarStyle: ["camera", "learn-category", "learn-lesson", "learn-checkpoint"].includes(route.name)
          ? { display: "none" }
          : {
              position: "absolute",
              left: 36,
              right: 36,
              bottom: 25,
              height: 64,
              borderRadius: 35,
              backgroundColor: isDark ? "rgba(15, 23, 42, 0.25)" : "rgba(255, 255, 255, 0.25)",
              borderWidth: 1,
              borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.4)",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: isDark ? 0.2 : 0.08,
              shadowRadius: 20,
              elevation: 5,
              marginHorizontal: 20,
              paddingBottom: 8,
              paddingTop: 8,
            },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 2,
        },
        tabBarItemStyle: {
          borderRadius: 12,
          paddingVertical: 0,
        },
      })}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={25}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: "Learn",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "book" : "book-outline"}
              size={25}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: "Camera",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "camera" : "camera-outline"}
              size={25}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "settings" : "settings-outline"}
              size={25}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="learn-category"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="learn-lesson"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="learn-checkpoint"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
