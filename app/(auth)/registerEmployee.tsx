import { StyleSheet, View } from "react-native";
import { Button, Input, Text } from "@rn-vui/base";
import { Image } from "react-native";
import { global_styles } from "../../src/styles/global";
import { useRouter } from "expo-router";
import { useRegisterEmployee } from "../../src/features/employeers/hooks/useRegisterEmployee";

export default function RegisterEmployee() {
  const { handleChange, loading, parameters, signUpWithEmail } =
    useRegisterEmployee();

  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={global_styles.title}>Registrarse como empleado</Text>

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
        label="Nombre de usuario (Visible entre compañeros)"
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
        label="Código del restaurante"
        leftIcon={{ type: "font-awesome", name: "building" }}
        onChangeText={(text) => handleChange("restaurantCode", text)}
        value={parameters.restaurantCode}
        placeholder="Código del restaurante"
        autoCapitalize={"none"}
      />
      <Text>Este código lo proporciona el administrador del restaurante.</Text>

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
