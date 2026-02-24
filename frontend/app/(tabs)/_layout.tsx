import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#FB5607",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 0,
          elevation: 5,
          height: 80,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={30}
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
              size={30}
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
              size={30}
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
              size={30}
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
