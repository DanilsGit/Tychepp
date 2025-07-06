import { Button, Text } from "@rneui/themed";
import { CategoryForProduct, Product } from "../../../types/rowTypes";
import { StyleSheet, TextInput, View } from "react-native";
import { colors, global_styles } from "../../../styles/global";
import { useState } from "react";
import { Picker } from "@react-native-picker/picker";

interface Props {
  product: Product;
  saveProduct: (product: Product) => void;
  categories: CategoryForProduct[];
  deleteProduct: (product: Product) => void;
}
export default function ProductItem({
  product,
  saveProduct,
  categories,
  deleteProduct,
}: Props) {
  const [parameters, setParameters] = useState<Product>(product);

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
        autoCapitalize={"none"}
      />

      <View style={styles.picker}>
        <Picker
          selectedValue={parameters.category_id}
          onValueChange={(itemValue) =>
            setParameters({ ...parameters, category_id: itemValue })
          }
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
          onPress={() => deleteProduct(parameters)}
        />
        <Button
          containerStyle={{ flex: 1 }}
          title={`Guardar ${parameters.name}`}
          onPress={() => saveProduct(parameters)}
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
  },
  buttonsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
});
