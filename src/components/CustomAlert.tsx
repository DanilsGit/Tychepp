import { Button, Text } from "@rn-vui/themed";
import { Modal, View, Image, StyleSheet } from "react-native";
import { images } from "../lib/imagesMap";
import { colors } from "../styles/global";

interface Props {
  visible: boolean;
  imageSource: any; // Image source can be a local or remote image
  title: string;
  message: string;
  onOk: () => void;
  onCancel: () => void;
  warningMessage?: string;
}

export const CustomAlert = ({
  visible,
  imageSource,
  title,
  message,
  onOk,
  onCancel,
  warningMessage,
}: Props) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <Image source={images[imageSource]} style={styles.image} />
          {warningMessage && (
            <Text style={styles.warningMessage}>{warningMessage}</Text>
          )}
          <View style={styles.buttonContainer}>
            <Button onPress={onCancel}>Cancelar</Button>
            <Button onPress={onOk}>Entendido</Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

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
    width: "80%",
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 10,
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
  },
  warningMessage: {
    fontSize: 20,
    color: colors.danger,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});
