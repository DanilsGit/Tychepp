import { View, Text, StyleSheet } from "react-native";
import { BaseToastProps } from "react-native-toast-message";

interface CustomToastProps extends BaseToastProps {
  text1?: string;
  text2?: string;
}

const toastConfig = {
  error: ({ text1, text2 }: CustomToastProps) => (
    <View style={[styles.container_danger, styles.container]}>
      {text1 && <Text style={styles.text_danger}>{text1}</Text>}
      {text2 && <Text style={{ color: "white" }}>{text2}</Text>}
    </View>
  ),
  success: ({ text1, text2 }: CustomToastProps) => (
    <View style={[styles.container_success, styles.container]}>
      {text1 && <Text style={styles.text_success}>{text1}</Text>}
      {text2 && <Text style={{ color: "white" }}>{text2}</Text>}
    </View>
  ),
  delete: ({ text1, text2 }: CustomToastProps) => (
    <View style={[styles.container_danger, styles.container]}>
      {text1 && <Text style={styles.text_danger}>{text1}</Text>}
      {text2 && <Text style={{ color: "white" }}>{text2}</Text>}
    </View>
  ),
  warning: ({ text1, text2 }: CustomToastProps) => (
    <View style={[styles.container_warning, styles.container]}>
      {text1 && <Text style={styles.text_warning}>{text1}</Text>}
      {text2 && <Text style={{ color: "white" }}>{text2}</Text>}
    </View>
  ),
  info: ({ text1, text2 }: CustomToastProps) => (
    <View style={[styles.container_info, styles.container]}>
      {text1 && <Text style={styles.text_info}>{text1}</Text>}
      {text2 && <Text style={{ color: "white" }}>{text2}</Text>}
    </View>
  ),
};

export default toastConfig;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "90%",
    height: 52,
    padding: 12,
    borderRadius: 8,
    position: "absolute",
    bottom: 10,
    left: "5%",
    right: "5%",
    borderWidth: 1,
    zIndex: 1000,
  },
  container_danger: {
    borderColor: "#D92D20",
    backgroundColor: "#FEF3F2",
  },
  text_danger: {
    color: "#D92D20",
    fontSize: 12,
    fontWeight: "600",
  },
  container_warning: {
    borderColor: "#FBBF24",
    backgroundColor: "#FFFBEB",
  },
  text_warning: {
    color: "#B45309",
    fontSize: 12,
    fontWeight: "600",
  },
  container_success: {
    borderColor: "#ABEFC6",
    backgroundColor: "#ECFDF3",
  },
  text_success: {
    color: "#067647",
    fontSize: 12,
    fontWeight: "600",
  },
  container_info: {
    borderColor: "#1E40AF",
    backgroundColor: "#EFF6FF",
  },
  text_info: {
    color: "#1E40AF",
    fontSize: 12,
    fontWeight: "600",
  },
});
