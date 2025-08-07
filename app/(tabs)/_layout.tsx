import { Tabs, useRouter } from "expo-router";
import { Redirect } from "expo-router";
import { useAuthStore } from "../../src/features/login/stores/authStore";
import { Alert } from "react-native";
import { ProfileEmployee } from "../../src/types/rowTypes";
import { useUrgentOrders } from "../../src/features/orders/hooks/useUrgentOrders";
import LoaderSpinner from "../../src/components/LoaderSpinner";
import { useOrders } from "../../src/features/orders/hooks/useOrders";
import { Ionicons } from "@expo/vector-icons";
import { PlatformAlert } from "../../src/components/PlatformAlert";

export default function TabsLayout() {
  const { profile } = useAuthStore() as { profile: ProfileEmployee };
  const { session, isLoading, logout } = useAuthStore();
  const { isLoading: urgentOrdersLoading } = useUrgentOrders();
  const { isLoading: ordersLoading } = useOrders();
  const router = useRouter();

  if (isLoading) {
    return <LoaderSpinner />;
  }

  if (!session || !profile || !profile?.employee) {
    console.log("No session or profile found, redirecting to login");
    return <Redirect href="/login" />;
  }

  if (profile.role === 3) {
    if (profile.employee.rejected) {
      PlatformAlert(
        "Cuenta rechazada",
        "Tu cuenta ha sido rechazada. Por favor, contacta con el administrador."
      );
      logout().then(() => {
        router.replace("/login");
      });
      return null;
    }
    if (!profile.employee.authorized) {
      PlatformAlert(
        "Cuenta no autorizada",
        "Tu cuenta no está autorizada. Por favor, contacta con el administrador."
      );
      logout().then(() => {
        router.replace("/login");
      });
      return null;
    }
  }

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="atencion"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="chatbubbles" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="pedidos"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="list" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="configuracion"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
