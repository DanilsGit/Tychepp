import { useEffect } from "react";
import { useAuthStore } from "../src/features/login/stores/authStore";
import { Stack } from "expo-router";

export default function RootLayout() {
  useEffect(() => {
    useAuthStore.getState().initializeAuth();
  }, []);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs-manager)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen
          name="chatUrgentOrder/[id]"
          options={{
            presentation: "modal",
          }}
        />
      </Stack>
    </>
  );
}
