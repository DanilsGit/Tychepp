import { StyleSheet, View, Text } from "react-native";

export default function Empleados() {
  return (
    <View style={styles.container}>
      <Text>Empleados</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
});
