import { Ionicons } from "@expo/vector-icons";
import {
  FlatList,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Text } from "@rn-vui/base";
import { ProductFromChat } from "../hooks/useOrderFromChat";
import { Picker } from "@react-native-picker/picker";
import { ProductCategory } from "../../../types/rowTypes";
import { colors, global_styles } from "../../../styles/global";
import { useRef } from "react";

interface Props {
  onOk: () => void;
  onCancel: () => void;
  onAddItem: () => void;
  items: ProductFromChat[];
  productsAvailable: ProductCategory[];
  handleEditFieldAtIndex: (index: number, updatedItem: ProductFromChat) => void;
  handleEditField: (index: number, field: string, value: any) => void;
  handleDeleteItem: (uuid: string) => void;
  visible: boolean;
  information: {
    address: string;
    client_name: string;
  };
  handleEditInformation: (field: string, value: string) => void;
}

export default function CreateOrderFromChatModal({
  onOk,
  onCancel,
  onAddItem,
  items,
  productsAvailable,
  handleEditFieldAtIndex,
  handleEditField,
  visible,
  information,
  handleEditInformation,
  handleDeleteItem,
}: Props) {
  const flatListRef = useRef<FlatList>(null);
  const handlePickerChange = (
    index: number,
    value: number | null,
    item: ProductFromChat
  ) => {
    if (value === null) {
      return;
    }
    const selectedProduct = productsAvailable.find((p) => p.id === value);
    if (selectedProduct) {
      // pero conserva los comentarios anteriores
      handleEditFieldAtIndex(index, {
        ...item,
        id: selectedProduct.id,
        price: selectedProduct.price,
      });
    }
  };
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onCancel} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#007AFF" />
            </TouchableOpacity>
            <Text>
              La IA puede cometer errores, dale un repaso a los productos antes
              de crear la orden
            </Text>
          </View>

          <View style={{ width: "100%" }}>
            <TextInput
              value={information.address}
              onChangeText={(text) => handleEditInformation("address", text)}
              placeholder="Dirección"
              placeholderTextColor={colors.gray}
              style={styles.input}
            />
            <View style={{ flexDirection: "row", gap: 10 }}>
              <TextInput
                value={information.client_name}
                onChangeText={(text) =>
                  handleEditInformation("client_name", text)
                }
                placeholder="Nombre del cliente"
                placeholderTextColor={colors.gray}
                style={[styles.input, { flex: 1 }]}
              />
            </View>
          </View>

          <View style={styles.itemsContainer}>
            <FlatList
              data={items}
              keyExtractor={(item) => item.uuid}
              renderItem={({ item, index }) => (
                <View style={styles.item}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Button onPress={() => handleDeleteItem(item.uuid)}>
                      <Ionicons name="trash" size={20} color={colors.white} />
                    </Button>
                    <View style={[global_styles.picker, { flex: 1 }]}>
                      <Picker
                        selectedValue={item.id}
                        onValueChange={(selectedId) =>
                          handlePickerChange(index, selectedId, item)
                        }
                        style={{
                          color: colors.black,
                        }}
                      >
                        {productsAvailable.map((product) => (
                          <Picker.Item
                            key={product.id}
                            label={`${product.category_for_product.name} - ${product.name}`}
                            value={product.id}
                          />
                        ))}
                      </Picker>
                    </View>
                    <Text style={styles.priceText}>${item.price}</Text>
                  </View>

                  <TextInput
                    value={item.comments}
                    onChangeText={(text) =>
                      handleEditField(index, "comments", text)
                    }
                    placeholder="Comentarios"
                    placeholderTextColor={colors.gray}
                    style={styles.input}
                  />
                </View>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No hay productos</Text>
              }
              showsVerticalScrollIndicator={true}
              ref={flatListRef}
              onContentSizeChange={() => {
                flatListRef.current?.scrollToEnd({ animated: true });
              }}
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button onPress={onAddItem}>Añadir producto</Button>
            <Button color="success" onPress={onOk}>
              CREAR Y CONFIRMAR ORDEN
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "space-between",
    width: "95%",
    padding: 20,
  },
  backButton: {
    paddingHorizontal: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  itemsContainer: {
    width: "100%",
    marginTop: 10,
    height: "64%",
    borderTopColor: colors.warning,
    borderTopWidth: 5,
    borderBottomColor: colors.warning,
    borderBottomWidth: 5,
  },
  emptyText: {
    textAlign: "center",
    color: "gray",
  },
  item: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  buttonContainer: {
    width: "100%",
    gap: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginTop: 10,
    width: "100%",
  },
  priceText: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 5,
  },
});
