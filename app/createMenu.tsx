import { Button, Input } from "@rn-vui/base";
import { router } from "expo-router";
import { Alert, StyleSheet, Text, View } from "react-native";
import Screen from "../src/components/Screen";
import { useWindowDimensions } from "react-native";
import { colors, global_styles } from "../src/styles/global";
import { useCreateMenu } from "../src/features/menu/hooks/useCreateMenu";
import { Picker } from "@react-native-picker/picker";
import { useGetRestaurants } from "../src/features/restaurant/hools/useGetRestaurants";

export default function CreateRestaurant() {
  const { height } = useWindowDimensions();
  const styles = getStyles(height);
  const { handleChange, parameters, handleSubmit, createLoading } =
    useCreateMenu();
  const { restaurants } = useGetRestaurants();

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
      <View style={styles.verticallySpaced}>
        <Text style={global_styles.title}>Nuevo Menú</Text>
        <Input
          label="Nombre de la carta"
          leftIcon={{ type: "font-awesome", name: "pencil" }}
          onChangeText={(text) => handleChange("name", text)}
          value={parameters.name}
          placeholder="Carta principal"
          autoCapitalize={"none"}
        />
        <View style={global_styles.picker}>
          <Picker
            selectedValue={parameters.restaurant_id}
            onValueChange={(itemValue) =>
              handleChange("restaurant_id", Number(itemValue))
            }
          >
            <Picker.Item label="Seleccione un restaurante" value={null} />
            {restaurants.map((restaurants) => (
              <Picker.Item
                key={restaurants.id}
                label={restaurants.name}
                value={restaurants.id}
              />
            ))}
          </Picker>
        </View>

        <Button disabled={createLoading} onPress={handleSubmit}>
          <Text style={styles.text}>Crear Menú</Text>
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
