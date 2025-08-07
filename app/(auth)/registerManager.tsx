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
import { SafeAreaView } from "react-native-safe-area-context";
import Screen from "../../src/components/Screen";
import { useRegisterManager } from "../../src/features/employeers/hooks/useRegisterManager";

export default function RegisterManager() {
  const { handleChange, loading, parameters, signUpWithEmail } =
    useRegisterManager();

  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <Screen style={styles.container}>
          <Text style={global_styles.title}>
            Registro | Dueño de restaurantes
          </Text>

          <Image
            source={require("../../assets/icon.png")}
            style={styles.image}
          />

          <Input
            label="Nombre completo"
            leftIcon={{ type: "font-awesome", name: "user" }}
            onChangeText={(text) => handleChange("fullname", text)}
            value={parameters.fullname}
            placeholder="Nombre completo"
            autoCapitalize={"words"}
          />

          <Input
            label="Número de teléfono personal | Incluir código de país"
            leftIcon={{ type: "font-awesome", name: "phone" }}
            onChangeText={(text) => handleChange("phone", text)}
            value={parameters.phone}
            placeholder="+57 --- --- -- --"
            autoCapitalize={"none"}
            keyboardType="phone-pad"
          />

          <Input
            label="Email"
            leftIcon={{ type: "font-awesome", name: "envelope" }}
            onChangeText={(text) => handleChange("email", text)}
            value={parameters.email}
            placeholder="email@ejemplo.com"
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
