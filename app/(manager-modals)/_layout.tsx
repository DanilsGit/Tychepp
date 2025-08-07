import { Stack } from "expo-router";
import { Redirect } from "expo-router";
import { useAuthStore } from "../../src/features/login/stores/authStore";
import { useEffect } from "react";

export default function ManagerModals() {
  const { session, profile, isLoading, getProfile } = useAuthStore();

  useEffect(() => {
    getProfile();
  }, [session]);

  if (isLoading) {
    return null;
  }

  if (!session || !profile) {
    return <Redirect href="/login" />;
  }

  if (session && profile?.role === 3) {
    return <Redirect href="/atencion" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="createRestaurant"
        options={{
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="menus/[id]"
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
    </Stack>
  );
}
