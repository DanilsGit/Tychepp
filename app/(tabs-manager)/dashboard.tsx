import { StyleSheet, View, Text } from "react-native";
import { supabase } from "../../src/lib/supabase";
import { Button } from "@rn-vui/base";
import { useAuthStore } from "../../src/features/login/stores/authStore";
import { global_styles } from "../../src/styles/global";
import Screen from "../../src/components/Screen";

export default function Dashboard() {
  const { profile, logout } = useAuthStore();
  return (
    <Screen style={styles.container}>
      <Text style={global_styles.title}>Hola {profile?.username}</Text>
      <View style={styles.verticallySpaced}>
        <Button onPress={() => logout()}>
          <Text style={global_styles.text_btn}>Cerrar sesión</Text>
        </Button>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
  },
  mt20: {
    marginTop: 20,
  },
});
