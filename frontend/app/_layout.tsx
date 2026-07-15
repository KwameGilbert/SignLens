import { Stack } from "expo-router";
import QueryProvider from "../providers/QueryProvider";
import "./global.css"

export default function RootLayout() {
  return (
    <QueryProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </QueryProvider>
  );
}
