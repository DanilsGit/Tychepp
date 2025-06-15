import { Tabs } from "expo-router";
import { Redirect } from "expo-router";
import { useAuthStore } from "../../src/features/login/stores/authStore";

export default function TabsLayout() {
  const { session, isLoading } = useAuthStore();

  if (isLoading) {
    return null;
  }

  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="pending" />
    </Tabs>
  );
}
