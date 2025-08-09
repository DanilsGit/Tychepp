import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  View,
  Platform,
  Image,
} from "react-native";
import { Button, Input, Text } from "@rn-vui/base";
import { global_styles } from "../../src/styles/global";
import { useRouter } from "expo-router";
import { useRegisterEmployee } from "../../src/features/employeers/hooks/useRegisterEmployee";
import { SafeAreaView } from "react-native-safe-area-context";
import Screen from "../../src/components/Screen";

export default function RegisterEmployee() {
  const { handleChange, loading, parameters, signUpWithEmail } =
    useRegisterEmployee();

  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <Screen style={styles.container}>
          <Text style={global_styles.title}>Registro | Empleado</Text>

          <Image
            source={require("../../assets/icon.png")}
            style={styles.image}
          />

          <Input
            label="Nombre de usuario (Visible para el jefe)"
            leftIcon={{ type: "font-awesome", name: "user" }}
            onChangeText={(text) => handleChange("username", text)}
            value={parameters.username}
            placeholder="Nombre de usuario"
          />

          <Input
            label="Email"
            leftIcon={{ type: "font-awesome", name: "envelope" }}
            onChangeText={(text) => handleChange("email", text)}
            value={parameters.email}
            placeholder="email@address.com"
            autoCapitalize={"none"}
          />

          <Input
            label="Contraseña"
            leftIcon={{ type: "font-awesome", name: "lock" }}
            onChangeText={(text) => handleChange("password", text)}
            value={parameters.password}
            secureTextEntry={true}
            placeholder="Contraseña"
            autoCapitalize={"none"}
          />

          <Input
            label="Repite la contraseña"
            leftIcon={{ type: "font-awesome", name: "lock" }}
            onChangeText={(text) => handleChange("repeatPassword", text)}
            value={parameters.repeatPassword}
            secureTextEntry={true}
            placeholder="Repite la contraseña"
            autoCapitalize={"none"}
          />

          <Input
            label="Código del restaurante"
            leftIcon={{ type: "font-awesome", name: "building" }}
            onChangeText={(text) => handleChange("restaurantCode", text)}
            value={parameters.restaurantCode}
            placeholder="Código del restaurante"
            autoCapitalize="none"
          />
          <Text>
            Este código lo proporciona el administrador del restaurante.
          </Text>

          <View style={[styles.verticallySpaced, styles.mt20]}>
            <Button
              title="Registrarse"
              disabled={loading}
              onPress={() => signUpWithEmail()}
            />
          </View>
          <View style={[styles.verticallySpaced, styles.mt20]}>
            <Button
              title="Volver al inicio"
              disabled={loading}
              onPress={() => router.push("/(auth)/login")}
            />
          </View>
        </Screen>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    paddingBottom: 40,
  },
  image: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginBottom: 20,
    borderRadius: 50,
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
