import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { Button, Input } from "@rn-vui/base";
import { supabase } from "../../src/lib/supabase";
import { Image } from "react-native";
import { useRouter } from "expo-router";
import { PlatformAlert } from "../../src/components/PlatformAlert";
import { SafeAreaView } from "react-native-safe-area-context";
import Screen from "../../src/components/Screen";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });

    if (error) PlatformAlert("Error", error.message);
    setLoading(false);
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <Screen style={styles.container}>
          <View style={[styles.verticallySpaced, styles.mt20]}>
            <Image
              source={require("../../assets/icon.png")}
              style={{
                width: 100,
                height: 100,
                alignSelf: "center",
                marginBottom: 20,
                borderRadius: 50,
              }}
            />

            <Input
              label="Email"
              leftIcon={{ type: "font-awesome", name: "envelope" }}
              onChangeText={(text) => setEmail(text)}
              value={email}
              placeholder="email@address.com"
              autoCapitalize={"none"}
            />
          </View>
          <View style={styles.verticallySpaced}>
            <Input
              label="Contraseña"
              leftIcon={{ type: "font-awesome", name: "lock" }}
              onChangeText={(text) => setPassword(text)}
              value={password}
              secureTextEntry={true}
              placeholder="Contraseña"
              autoCapitalize={"none"}
            />
          </View>
          <View style={styles.buttonsContainer}>
            <Button
              title="Iniciar sesión"
              disabled={loading}
              onPress={() => signInWithEmail()}
              color="primary"
            />
            <Button
              title="Registro | Empleados"
              disabled={loading}
              onPress={() => router.push("/registerEmployee")}
              color="secondary"
            />
            <Button
              title="Registro | Dueños"
              disabled={loading}
              onPress={() => router.push("/registerManager")}
              color="secondary"
            />
          </View>
        </Screen>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
  buttonsContainer: {
    justifyContent: "space-between",
    marginTop: 20,
    gap: 15,
  },
});
