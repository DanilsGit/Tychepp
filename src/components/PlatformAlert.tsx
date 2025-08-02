import { Alert, Platform } from "react-native";

export const PlatformAlert = (title: string, message?: string) => {
  return Platform.OS === "web"
    ? alert(title + (message ? `: ${message}` : ""))
    : message
    ? Alert.alert(title, message)
    : Alert.alert(title);
};
