import { Tabs } from "expo-router";
import { Redirect } from "expo-router";
import { useAuthStore } from "../../src/features/login/stores/authStore";

export default function TabsLayout() {
  const { session, isLoading, profile } = useAuthStore();

  if (isLoading) {
    return null;
  }

  if (!session || !profile) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="dashboard" />
      <Tabs.Screen name="restaurantes" />
      <Tabs.Screen name="empleados" />
      <Tabs.Screen name="configuraciones" />
    </Tabs>
  );
}
