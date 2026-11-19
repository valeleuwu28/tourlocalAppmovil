import { Pressable, StyleSheet, Text } from "react-native";
import { colors } from "../../theme/colors";

export default function Button({
  children,
  onPress,
  variant = "primary",
  disabled = false,
  style,
}) {
  return (
    <Pressable
      style={[
        styles.button,
        styles[variant],
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text
        style={[styles.text, variant === "secondary" && styles.textSecondary]}
      >
        {children}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
    width: "100%",
  },
  primary: { backgroundColor: colors.primary },
  danger: { backgroundColor: colors.danger },
  secondary: { backgroundColor: colors.surface, borderColor: colors.primary },
  disabled: { backgroundColor: colors.disabled, borderColor: colors.border },
  text: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  textSecondary: { color: colors.primary },
});
