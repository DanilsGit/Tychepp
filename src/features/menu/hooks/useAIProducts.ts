import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { generateProductsByAI } from "../apis/menu";
import { CategoryForProduct, Product } from "../../../types/rowTypes";
import { Alert } from "react-native";
import { useMenuProductsStore } from "../storages/menuProductsStorage";

interface Props {
  menu_id: string;
  categories: CategoryForProduct[];
}
export const useAIProducts = ({ menu_id, categories }: Props) => {
  const [images, setImages] = useState<string[] | null>(null);
  const [productsGenerated, setProductsGenerated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const { saveAndAddProduct } = useMenuProductsStore();

  const MAX_SIZE_BYTES = 1024 * 1024; // 1 MB

  const manipulateImage = async (uris: string[]) => {
    try {
      const processedImages = [];

      for (const uri of uris) {
        let compress = 1;
        let width = 800;
        let base64Image = "";
        let sizeInBytes = Infinity;

        while (compress >= 0.1) {
          const result = await ImageManipulator.manipulateAsync(
            uri,
            [{ resize: { width } }],
            {
              compress,
              format: ImageManipulator.SaveFormat.JPEG, // JPEG comprime mejor que PNG
              base64: true,
            }
          );

          base64Image = result.base64 || "";
          sizeInBytes = Math.ceil((base64Image.length * 3) / 4); // estimación tamaño base64

          if (sizeInBytes <= MAX_SIZE_BYTES) {
            processedImages.push(result);
            break;
          }

          compress -= 0.1;
        }

        if (sizeInBytes > MAX_SIZE_BYTES) {
          console.warn("No se pudo reducir suficiente la imagen:", uri);
        }
      }

      setImages(processedImages.map((img) => img.uri));
      return processedImages.map(
        (img) => img.base64?.split(",")[1] || img.base64
      );
    } catch (error) {
      console.error(error);
      return uris;
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
      base64: false,
      allowsMultipleSelection: false,
    });

    if (!result.canceled) {
      const base64Image = await manipulateImage(
        result.assets.map((asset) => asset.uri)
      );

      await textFromMenus(base64Image[0]);
    }
  };

  const textFromMenus = async (base64String: string | undefined) => {
    setLoading(true);
    try {
      const res = await generateProductsByAI(base64String, menu_id, categories);

      const products = res.data as Product[];
      let generated = 0;
      setProductsGenerated(
        products.map((p) => {
          const id = new Date().getTime() + generated++;
          return {
            ...p,
            id: p.id || id,
          } as Product;
        })
      );

      if (products.length === 0) {
        Alert.alert(
          "No se encontraron productos",
          "La IA no pudo extraer productos del menú. Por favor, intenta con otra imagen o revisa la calidad de la imagen."
        );
      } else {
        Alert.alert(
          "La IA puede cometer errores",
          `Se han generado ${products.length} productos. Por favor, revisa bien el cada uno antes de guardarlos.`
        );
      }
    } catch (error) {
      console.error("Error al obtener el texto del menú:", error);
      Alert.alert(
        "Servicio no disponible",
        "No se pudo procesar la imagen. Por favor, intenta más tarde."
      );
      setImages(null);
    } finally {
      setLoading(false);
    }
  };

  const saveAIProducts = async (product: Product) => {
    await saveAndAddProduct(product, Number(menu_id));
    const newProducts = productsGenerated.filter((p) => p.id !== product.id);
    setProductsGenerated(newProducts);
  };

  const deleteAIProduct = (product: Product) => {
    const newProducts = productsGenerated.filter((p) => p.id !== product.id);
    setProductsGenerated(newProducts);
  };

  return {
    images,
    productsGenerated,
    loading,
    pickImage,
    saveAIProducts,
    deleteAIProduct,
  };
};
