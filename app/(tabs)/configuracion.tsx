import { useState, useEffect } from "react";
import { StyleSheet, View, Alert } from "react-native";
import { Button, Input, Text } from "@rn-vui/base";
import { supabase } from "../../src/lib/supabase";
import { useAuthStore } from "../../src/features/login/stores/authStore";
import { global_styles } from "../../src/styles/global";
import { PlatformAlert } from "../../src/components/PlatformAlert";

export default function Configuracion() {
  const { session, profile, logout } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState(profile?.username || "");

  async function updateProfile({ username }: { username: string }) {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const updates = {
        id: session?.user.id,
        username: username.trim(),
        updated_at: new Date(),
      };

      const { error } = await supabase.from("profiles").upsert(updates);

      if (error) {
        throw error;
      }
      PlatformAlert("Profile updated successfully!");
    } catch (error) {
      if (error instanceof Error) {
        PlatformAlert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={global_styles.title}>Configuración</Text>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input label="Email" value={session?.user?.email} disabled />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Username"
          value={username || ""}
          onChangeText={(text) => setUsername(text)}
        />
      </View>

      <View style={styles.verticallySpaced}>
        <Button
          title="Actualizar Perfil"
          onPress={() => updateProfile({ username })}
          loading={loading}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Button title="Cerrar sesión" onPress={() => logout()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
});
