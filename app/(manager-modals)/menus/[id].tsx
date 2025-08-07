import { StyleSheet, TextInput, View } from "react-native";
import Screen from "../../../src/components/Screen";
import { colors, global_styles } from "../../../src/styles/global";
import { useLocalSearchParams } from "expo-router";
import { Button, Icon, Image, Text } from "@rn-vui/base";
import { useEffect, useRef, useState } from "react";
import { CustomAlert } from "../../../src/components/CustomAlert";
import { useAIProducts } from "../../../src/features/menu/hooks/useAIProducts";
import { useGetCategories } from "../../../src/features/menu/hooks/useGetCategories";
import { useGetMenuProductsById } from "../../../src/features/menu/hooks/useGetProductsMenuById";
import LoaderSpinner from "../../../src/components/LoaderSpinner";
import { useMenuProductsStore } from "../../../src/features/menu/storages/menuProductsStorage";
import ProductAIList from "../../../src/features/menu/components/ProductAIList";
import { useDebouncedCallback } from "use-debounce";
import ProductByCategoryList from "../../../src/features/menu/components/ProductsByCategory";

export default function AddProduct() {
  const { id } = useLocalSearchParams();
  const { categories, loading: loadingCategories } = useGetCategories();
  const { loading } = useGetMenuProductsById(id.toString());
  const [alertVisible, setAlertVisible] = useState(false);
  const { products, addProduct, saveAnnotations, annotations, setAnnotations } =
    useMenuProductsStore();

  const {
    pickImage,
    images,
    loading: loadingAI,
    productsGenerated,
    saveAIProducts,
    deleteAIProduct,
  } = useAIProducts({
    menu_id: id.toString(),
    categories,
  });

  useEffect(() => {
    handleSaveAnnotations(annotations);
  }, [annotations]);

  const handleSaveAnnotations = useDebouncedCallback(
    async (newAnnotations: string) => {
      await saveAnnotations(newAnnotations, Number(id));
    },
    2000
  );

  const showAlert = () => {
    setAlertVisible(true);
  };

  const handleOk = () => {
    setAlertVisible(false);
    pickImage();
  };

  const handleCancel = () => {
    setAlertVisible(false);
  };

  if (loadingAI || loading || loadingCategories) {
    return <LoaderSpinner />;
  }

  return (
    <Screen style={styles.container}>
      <Text style={global_styles.title}>Anotaciones del menú</Text>
      <TextInput
        style={global_styles.input}
        placeholder="Escribe aquí las anotaciones generales del menú, por ejemplo: Todas las picadas llevan papas a la francesa, yuca, tomate... Todos los asados llevan... Todos los platos de mariscos llevan..."
        placeholderTextColor={colors.gray}
        multiline
        numberOfLines={10}
        onChangeText={(text) => setAnnotations(text)}
        value={annotations}
      />

      <Text style={global_styles.title}>Productos del menú</Text>

      <Button onPress={showAlert}>
        <Icon type="font-awesome" name="camera" /> Generar productos con foto
      </Button>

      <CustomAlert
        visible={alertVisible}
        imageSource={"wrong_menu"}
        title="Selecciona una foto escaneada"
        message="Sube el menú legible, sin reflejos y sin objetos que lo tapen."
        warningMessage="Preferiblemente una foto escaneada"
        onOk={handleOk}
        onCancel={handleCancel}
      />

      {images && images.length > 0 && (
        <View style={{ gap: 20 }}>
          <Text style={global_styles.subTitle}>Imágenes seleccionadas</Text>
          <View style={styles.images_container}>
            {images.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={{ width: 300, height: 500 }}
                resizeMode="contain"
              />
            ))}
          </View>
          <Text style={global_styles.subTitle}>Productos generados</Text>
          <Text>
            La IA puede cometer errores, por favor revisa los productos antes de
            guardarlos con el botón azul de cada producto.
          </Text>
          <ProductAIList
            products={productsGenerated}
            saveAIProducts={saveAIProducts}
            deleteAIProduct={deleteAIProduct}
          />
        </View>
      )}

      <View>
        <Text style={global_styles.subTitle}>Productos actuales</Text>
        <Text>
          Puedes editar los productos actuales, o agregar nuevos productos
        </Text>
        <ProductByCategoryList products={products} categories={categories} />
        <Button
          onPress={() => addProduct(Number(id))}
          icon={<Icon type="font-awesome" name="plus" />}
          title="Agregar nuevo producto"
        />
      </View>
      <View style={{ marginBottom: 500 }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    width: "100%",
    justifyContent: "space-between",
    gap: 30,
  },
  images_container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
});
