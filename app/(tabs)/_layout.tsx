import { Tabs, useRouter } from "expo-router";
import { Redirect } from "expo-router";
import { useAuthStore } from "../../src/features/login/stores/authStore";
import { Alert } from "react-native";
import { ProfileEmployee } from "../../src/types/rowTypes";
import { useUrgentOrders } from "../../src/features/orders/hooks/useUrgentOrders";
import LoaderSpinner from "../../src/components/LoaderSpinner";
import { useOrders } from "../../src/features/orders/hooks/useOrders";

export default function TabsLayout() {
  const { profile } = useAuthStore() as { profile: ProfileEmployee };
  const { session, isLoading, logout } = useAuthStore();
  const { isLoading: urgentOrdersLoading } = useUrgentOrders();
  const { isLoading: ordersLoading } = useOrders();
  const router = useRouter();

  if (isLoading || urgentOrdersLoading || ordersLoading) {
    return <LoaderSpinner />;
  }

  if (!session || !profile) {
    return <Redirect href="/login" />;
  }

  if (profile.role === 3) {
    if (profile.employee.rejected) {
      Alert.alert(
        "Cuenta rechazada",
        "Tu cuenta ha sido rechazada. Por favor, contacta con el administrador."
      );
      logout().then(() => {
        router.replace("/login");
      });
      return null;
    }
    if (!profile.employee.authorized) {
      Alert.alert(
        "Cuenta pendiente",
        "Tu cuenta está pendiente de aprobación. Por favor, espera a que sea aprobada."
      );
      logout().then(() => {
        router.replace("/login");
      });
      return null;
    }
  }

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="atencion" />
      <Tabs.Screen name="pedidos" />
      <Tabs.Screen name="configuracion" />
    </Tabs>
  );
}
