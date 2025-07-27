import { Button, Text } from "@rn-vui/base";
import { CategoryForProduct, Product } from "../../../types/rowTypes";
import {
  Alert,
  Animated,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, global_styles } from "../../../styles/global";
import { useEffect, useRef, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { useMenuProductsStore } from "../storages/menuProductsStorage";
import { useDebouncedCallback } from "use-debounce";

interface Props {
  product: Product;
}
export default function ProductItem({ product }: Props) {
  const isEmptyName = product.name.trim() === "";
  const [parameters, setParameters] = useState<Product>(product);
  const { saveProduct, deleteProduct, categories } = useMenuProductsStore();
  const [expanded, setExpanded] = useState(isEmptyName);
  const animation = useRef(new Animated.Value(isEmptyName ? 1 : 0)).current;

  const heightInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 280], // altura máxima del formulario
  });

  const styles = createStyles(heightInterpolate);

  useEffect(() => {
    modifyProduct(parameters);
  }, [parameters]);

  const modifyProduct = useDebouncedCallback(async (productEdited: Product) => {
    if (productEdited === product) return;
    if (
      !productEdited.name.trim() ||
      !productEdited.price ||
      !productEdited.category_id
    )
    return;
    console.log("Modifying product:", productEdited);

    await saveProduct(productEdited);
  }, 1000);

  const handleDelete = async () => {
    Alert.alert(
      "Eliminar producto",
      "¿Estás seguro de que quieres eliminar este producto?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: () => deleteProduct(parameters),
          style: "destructive",
        },
      ]
    );
  };

  const toggleExpand = () => {
    Animated.timing(animation, {
      toValue: expanded ? 0 : 1,
      duration: 250,
      useNativeDriver: false,
    }).start();
    setExpanded(!expanded);
  };

  return (
    <View style={{ marginVertical: 10 }}>
      <TouchableOpacity
        onPress={toggleExpand}
        style={global_styles.row_between}
      >
        <Text style={global_styles.itemTitle}>{product.name}</Text>
        <Text>{expanded ? "▼" : "▲"}</Text>
      </TouchableOpacity>
      
      <Animated.View style={styles.container}>
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 3 }}>
            <TextInput
              style={global_styles.input}
              onChangeText={(text) =>
                setParameters({ ...parameters, name: text })
              }
              value={parameters.name}
              placeholder="Nombre del producto"
              placeholderTextColor={colors.gray}
              autoCapitalize={"words"}
            />
          </View>
          <View style={{ flex: 1 }}>
            <TextInput
              style={global_styles.input}
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
          style={global_styles.input}
          onChangeText={(text) =>
            setParameters({ ...parameters, description: text })
          }
          value={parameters.description || ""}
          placeholder="Descripción del producto (opcional)"
          placeholderTextColor={colors.gray}
          multiline
          numberOfLines={4}
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
        </View>
      </Animated.View>
    </View>
  );
}

const createStyles = (animatedHeight: Animated.AnimatedInterpolation<number>) =>
  StyleSheet.create({
    container: {
      borderBottomWidth: 4,
      borderLeftWidth: 4,
      borderLeftColor: "#ccc",
      borderBottomColor: "#ccc",
      marginVertical: 5,
      padding: 5,
      height: animatedHeight,
      overflow: "hidden",
    },
    picker: {
      borderBottomColor: colors.purple,
      borderBottomWidth: 1,
      fontSize: 10,
      marginBottom: 10,
    },
    buttonsContainer: {
      marginTop: 10,
      flexDirection: "row",
    },
  });
