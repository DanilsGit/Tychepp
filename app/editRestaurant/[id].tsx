import { useLocalSearchParams, useRouter } from "expo-router";
import Screen from "../../src/components/Screen";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { Button, Input, Text } from "@rn-vui/base";
import { useRestaurantById } from "../../src/features/restaurant/hools/useRestaurantById";
import LoaderSpinner from "../../src/components/LoaderSpinner";
import { global_styles } from "../../src/styles/global";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Restaurant } from "../../src/types/rowTypes";

export default function EditRestaurant() {
  const { id } = useLocalSearchParams();
  const { height } = useWindowDimensions();
  const { restaurant, isLoading, updateRestaurant } = useRestaurantById(
    id.toString()
  );
  const router = useRouter();
  const styles = getStyles(height);

  const [parameters, setParameters] = useState(restaurant);

  useEffect(() => {
    setParameters(restaurant);
  }, [restaurant]);

  useEffect(() => {
    handleUpdateRestaurant(parameters);
  }, [parameters]);

  const handleUpdateRestaurant = useDebouncedCallback(
    async (newRestaurant: Partial<Restaurant> | undefined) => {
      if (!newRestaurant) return;
      if (!newRestaurant.name || !newRestaurant.whatsapp_number) return;
      if (newRestaurant === restaurant) return;
      await updateRestaurant(newRestaurant);
    },
    2000
  );

  if (isLoading || !restaurant || !parameters) {
    return <LoaderSpinner />;
  }

  return (
    <Screen style={styles.container}>
      <View style={[styles.verticallySpaced]}>
        <Text style={global_styles.title}>Editar Restaurante</Text>
        <Input
          label="Nombre del Restaurante"
          leftIcon={{ type: "font-awesome", name: "pencil" }}
          onChangeText={(text) => setParameters({ ...parameters, name: text })}
          value={parameters.name}
          placeholder="Mi restaurante"
          autoCapitalize={"none"}
        />
        <Input
          label="Saludo de Bienvenida en whatsapp"
          leftIcon={{ type: "font-awesome", name: "pencil" }}
          onChangeText={(text) =>
            setParameters({ ...parameters, welcome_message: text })
          }
          value={parameters.welcome_message || ""}
          placeholder="¡Hola! Atendemos por orden de llegada, por favor escribe tu pedido, dirección, nombre y número de contacto..."
          autoCapitalize={"none"}
          multiline
          numberOfLines={10}
        />
        <Input
          label="Número de WhatsApp con el código de país"
          leftIcon={{ type: "font-awesome", name: "phone" }}
          onChangeText={(text) =>
            setParameters({ ...parameters, whatsapp_number: Number(text) })
          }
          value={parameters.whatsapp_number.toString()}
          placeholder="57----------"
          autoCapitalize={"none"}
          keyboardType="phone-pad"
        />
      </View>

      <Button onPress={() => router.back()}>
        <Text style={styles.text}>Volver</Text>
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
