import { Stack } from "expo-router";
import { Redirect } from "expo-router";
import { useAuthStore } from "../../src/features/login/stores/authStore";
import { useEffect } from "react";

export default function AuthLayout() {
  const { session, profile, isLoading, getProfile } = useAuthStore();

  useEffect(() => {
    getProfile();
  }, [session]);

  if (isLoading) {
    return null;
  }

  if (session && profile?.role === 2) {
    return <Redirect href="/(tabs-manager)/dashboard" />;
  }

  if (session && profile?.role === 3) {
    return <Redirect href="/(tabs)/pending" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
