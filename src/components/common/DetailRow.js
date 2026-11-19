import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../theme/colors";

export default function DetailRow({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 32,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  label: { fontSize: 14, color: colors.muted },
  value: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
    textAlign: "right",
  },
});
