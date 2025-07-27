import { Button } from "@rn-vui/base";
import { CategoryForProduct, Product } from "../../../types/rowTypes";
import { Alert, StyleSheet, TextInput, View } from "react-native";
import { colors } from "../../../styles/global";
import { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { useMenuProductsStore } from "../storages/menuProductsStorage";

interface Props {
  product: Product;
  saveAIProducts: (product: Product) => Promise<void>;
  deleteAIProduct: (product: Product) => void;
}
export default function ProductAIItem({
  product,
  saveAIProducts,
  deleteAIProduct,
}: Props) {
  const [parameters, setParameters] = useState<Product>(product);
  const [loading, setLoading] = useState(false);
  const { categories } = useMenuProductsStore();

  const handleDelete = async () => {
    Alert.alert(
      "Descartar producto",
      "¿Deseas descartar este producto de IA?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: () => deleteAIProduct(parameters),
          style: "destructive",
        },
      ]
    );
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      if (!parameters.name || !parameters.price || !parameters.category_id) {
        Alert.alert(
          "Campos incompletos",
          "Por favor, completa todos los campos obligatorios."
        );
        return;
      }

      await saveAIProducts(parameters);
    } catch (error) {
      Alert.alert(
        "Error",
        "Ocurrió un error al guardar el producto. Por favor, inténtalo de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row" }}>
        <View style={{ flex: 3 }}>
          <TextInput
            style={styles.input}
            onChangeText={(text) =>
              setParameters({ ...parameters, name: text })
            }
            value={parameters.name}
            placeholder="Nombre del producto"
            placeholderTextColor={colors.gray}
            autoCapitalize={"none"}
          />
        </View>
        <View style={{ flex: 1 }}>
          <TextInput
            style={styles.input}
            onChangeText={(text) =>
              setParameters({ ...parameters, price: Number(text) })
            }
            value={parameters.price.toString()}
            placeholder="Precio del producto"
            placeholderTextColor={colors.gray}
            autoCapitalize={"none"}
            keyboardType="numeric"
          />
        </View>
      </View>

      <TextInput
        style={styles.input}
        onChangeText={(text) =>
          setParameters({ ...parameters, description: text })
        }
        value={parameters.description || ""}
        placeholder="Descripción del producto (opcional)"
        placeholderTextColor={colors.gray}
        multiline
        numberOfLines={5}
        autoCapitalize={"none"}
      />

      <View style={styles.picker}>
        <Picker
          selectedValue={parameters.category_id}
          onValueChange={(itemValue) =>
            setParameters({ ...parameters, category_id: itemValue })
          }
          style={{ color: "black" }}
        >
          <Picker.Item label="Categoría" value={null} />
          {categories.map((c) => (
            <Picker.Item key={c.id} label={c.name} value={c.id} />
          ))}
        </Picker>
      </View>

      <View style={styles.buttonsContainer}>
        <Button
          icon={{ type: "font-awesome", name: "trash" }}
          buttonStyle={{ backgroundColor: colors.danger }}
          onPress={handleDelete}
        />
        <Button
          icon={{ type: "font-awesome", name: "save" }}
          title="Guardar"
          onPress={handleSave}
          loading={loading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderLeftColor: "#ccc",
    borderBottomColor: "#ccc",
    marginVertical: 5,
    padding: 5,
  },
  picker: {
    borderBottomColor: colors.primary,
    borderBottomWidth: 1,
    fontSize: 10,
    marginBottom: 10,
  },
  input: {
    borderBottomColor: colors.primary,
    borderBottomWidth: 1,
    fontSize: 16,
    marginBottom: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    width: "90%",
    color: colors.black,
  },
  buttonsContainer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
