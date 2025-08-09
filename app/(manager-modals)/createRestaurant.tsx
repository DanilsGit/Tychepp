import { Button, Input } from "@rn-vui/base";
import { router } from "expo-router";
import { Alert, Platform, StyleSheet, Text, View } from "react-native";
import { useCreateRestaurant } from "../../src/features/restaurant/hools/useCreateRestaurant";
import Screen from "../../src/components/Screen";
import { colors, global_styles } from "../../src/styles/global";

export default function CreateRestaurant() {
  const { handleChange, parameters, handleSubmit, createLoading } =
    useCreateRestaurant();

  const handleBack = () => {
    if (Platform.OS === "web") {
      router.back();
    } else {
      Alert.alert(
        "¿Estás seguro?",
        "Si sales de esta pantalla, se perderán los cambios no guardados.",
        [
          {
            text: "Salir",
            onPress: () => router.back(),
            style: "destructive",
          },
          {
            text: "Continuar",
            style: "default",
          },
        ],
        {
          cancelable: true,
        }
      );
    }
  };

  return (
    <Screen style={styles.container}>
      <View style={[styles.verticallySpaced]}>
        <Text style={global_styles.title}>Nuevo Restaurante</Text>
        <Input
          label="Nombre del Restaurante"
          leftIcon={{ type: "font-awesome", name: "pencil" }}
          onChangeText={(text) => handleChange("name", text)}
          value={parameters.name}
          placeholder="Mi restaurante"
          autoCapitalize={"none"}
        />
        <Input
          label="Dirección del Restaurante"
          leftIcon={{ type: "font-awesome", name: "pencil" }}
          onChangeText={(text) => handleChange("address", text)}
          value={parameters.address}
          placeholder="Calle 12-34, Barrio Ciudad"
          autoCapitalize={"none"}
        />
        <Input
          label="Saludo de Bienvenida en whatsapp"
          leftIcon={{ type: "font-awesome", name: "pencil" }}
          onChangeText={(text) => handleChange("welcome_message", text)}
          value={parameters.welcome_message}
          placeholder="¡Hola! Atendemos por orden de llegada, por favor escribe tu pedido, dirección, nombre y número de contacto..."
          autoCapitalize={"none"}
          multiline
          numberOfLines={10}
        />
        <Input
          label="Número de WhatsApp con el código de país"
          leftIcon={{ type: "font-awesome", name: "phone" }}
          onChangeText={(text) => handleChange("whatsapp_number", text)}
          value={parameters.whatsapp_number}
          placeholder="+57---------- Sin espacios ni guiones"
          autoCapitalize={"none"}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button loading={createLoading} onPress={handleSubmit}>
          <Text style={styles.text}>Crear Restaurante</Text>
        </Button>
        <Button
          onPress={handleBack}
          buttonStyle={{ backgroundColor: colors.warning }}
        >
          <Text style={styles.text}>Cancelar</Text>
        </Button>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    width: "100%",
    justifyContent: "space-between",
  },
  verticallySpaced: {
    gap: 10,
  },
  text: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonContainer: {
    marginTop: 20,
    gap: 15,
  },
});
