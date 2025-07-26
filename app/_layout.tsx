import { useEffect } from "react";
import { useAuthStore } from "../src/features/login/stores/authStore";
import { AppState } from "react-native";
import { supabase } from "../src/lib/supabase";
import { Stack } from "expo-router";
import Toast from 'react-native-toast-message';
import toastConfig from "../src/lib/toastConfig";

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function RootLayout() {
  useEffect(() => {
    useAuthStore.getState().initializeAuth();
  }, []);

  return (
    <>
      <Toast config={toastConfig} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs-manager)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="menus/[id]" />
        <Stack.Screen
          name="createRestaurant"
          options={{
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="createMenu"
          options={{
            presentation: "modal",
          }}
        />
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
