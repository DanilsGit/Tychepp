import { StyleSheet } from "react-native";

export const colors = {
  warning: "#f0ad4e",
  danger: "#d9534f",
  success: "#5cb85c",
  primary: "#337ab7",
  gray: "#6c757d",
  black: "#000",
  white: "#fff",
};

export const global_styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    margin: 10,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginVertical: 10,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  text_btn: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    width: "100%",
    height: "100%",
  },
  picker: {
    borderBottomColor: colors.primary,
    borderBottomWidth: 1,
    marginBottom: 10,
    fontSize: 16,
  },
  mv10: {
    marginVertical: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cancelled_title: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.danger,
    marginBottom: 8,
  },
  pending_title: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.warning,
    marginBottom: 8,
  },
  confirmed_title: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.success,
    marginBottom: 8,
  },
  delivered_title: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.black,
    marginBottom: 8,
  },
});
