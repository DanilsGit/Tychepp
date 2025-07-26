import { Button, Text } from "@rn-vui/base";
import { StyleSheet, View } from "react-native";
import { colors, global_styles } from "../../../styles/global";
import { EmployeeProfile } from "../../../types/rowTypes";
import { useState } from "react";
import { useEmployeeItem } from "../hooks/useEmployeeItem";

interface Props {
  employee: EmployeeProfile;
}
export default function EmployeeItem({ employee: item }: Props) {
  const { employee, handleAuthorization, handleCancellation, removeRejected } =
    useEmployeeItem(item);

  return (
    <View style={[global_styles.card, employee.rejected && styles.disabled]}>
      {!employee.authorized && !employee.rejected && (
        <Text style={[global_styles.itemTitle, styles.warning]}>
          Nueva solicitud
        </Text>
      )}

      <Text>
        Nombre de usuario:{" "}
        <Text style={styles.bold}>{employee.profiles.username}</Text>
      </Text>
      <Text>
        Se unió el:{" "}
        <Text style={styles.bold}>
          {new Date(employee.created_at).toLocaleString()}
        </Text>
      </Text>

      {!employee.authorized && !employee.rejected && (
        <View style={styles.buttonsContainer}>
          <Button
            title="Cancelar solicitud"
            type="outline"
            containerStyle={{ flex: 1, marginRight: 5 }}
            onPress={handleCancellation}
          />
          <Button
            title="Autorizar"
            type="solid"
            containerStyle={{ flex: 1, marginLeft: 5 }}
            onPress={handleAuthorization}
          />
        </View>
      )}

      {employee.rejected && (
        <Button
          title="Eliminar rechazo"
          type="clear"
          containerStyle={{ flex: 1 }}
          onPress={removeRejected}
        />
      )}

      {employee.authorized && (
        <Button
          title="Deshabilitar empleado"
          type="outline"
          containerStyle={{ marginTop: 10 }}
          onPress={handleCancellation}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bold: {
    fontWeight: "bold",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  warning: {
    color: colors.warning,
  },
  disabled: {
    opacity: 0.5,
    backgroundColor: colors.gray,
  },
});
