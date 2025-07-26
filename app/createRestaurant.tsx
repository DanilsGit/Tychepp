import { Button, Input } from "@rn-vui/base";
import { router } from "expo-router";
import { Alert, StyleSheet, Text, View } from "react-native";
import { useCreateRestaurant } from "../src/features/restaurant/hools/useCreateRestaurant";
import Screen from "../src/components/Screen";
import { useWindowDimensions } from "react-native";
import { colors, global_styles } from "../src/styles/global";

export default function CreateRestaurant() {
  const { height } = useWindowDimensions();
  const styles = getStyles(height);
  const { handleChange, parameters, handleSubmit, createLoading } =
    useCreateRestaurant();

  const handleBack = () => {
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
          label="Saludo de Bienvenida en whatsapp"
          leftIcon={{ type: "font-awesome", name: "pencil" }}
          onChangeText={(text) => handleChange("welcome_message", text)}
          value={parameters.welcome_message}
          placeholder="¡Hola! Bienvenido a nuestro restaurante..."
          autoCapitalize={"none"}
        />
        <Input
          label="Número de WhatsApp"
          leftIcon={{ type: "font-awesome", name: "phone" }}
          onChangeText={(text) => handleChange("whatsapp_number", text)}
          value={parameters.whatsapp_number}
          placeholder="+57----------"
          autoCapitalize={"none"}
          keyboardType="phone-pad"
        />
        <Button disabled={createLoading} onPress={handleSubmit}>
          <Text style={styles.text}>Crear Restaurante</Text>
        </Button>
      </View>

      <Button
        onPress={handleBack}
        buttonStyle={{ backgroundColor: colors.warning }}
      >
        <Text style={styles.text}>Cancelar</Text>
      </Button>
    </Screen>
  );
}

const getStyles = (height: number) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 20,
      width: "100%",
      height: height - 100,
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
  });
