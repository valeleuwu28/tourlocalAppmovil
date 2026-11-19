import { Pressable, StyleSheet, Text } from "react-native";
import { colors } from "../../theme/colors";

export default function CategoryPill({
  label,
  active = false,
  onPress,
  icon,
  count,
}) {
  return (
    <Pressable
      style={[styles.pill, active ? styles.active : styles.inactive]}
      onPress={onPress}
    >
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <Text
        style={[styles.label, active ? styles.textActive : styles.textInactive]}
      >
        {label}
      </Text>
      {count != null && (
        <Text
          style={[
            styles.count,
            active ? styles.countActive : styles.countInactive,
          ]}
        >
          {count}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 18,
    gap: 6,
  },
  active: {
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  inactive: {
    backgroundColor: colors.infoBg,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  label: { fontSize: 14, fontWeight: "500" },
  textActive: { color: colors.surface, fontWeight: "600" },
  textInactive: { color: colors.primary },
  icon: { fontSize: 14 },
  count: {
    fontSize: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: "hidden",
  },
  countActive: {
    backgroundColor: "rgba(255,255,255,0.2)",
    color: colors.surface,
  },
  countInactive: { backgroundColor: "rgba(0,0,0,0.08)", color: colors.primary },
});
