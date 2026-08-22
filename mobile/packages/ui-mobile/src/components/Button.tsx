import type { ReactNode } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { color, radius, rtl, size, space, typography } from "../tokens";

export type ButtonTone = "primary" | "secondary" | "danger" | "ghost";
export type ButtonProps = {
  label: string;
  onPress: () => void;
  tone?: ButtonTone;
  loading?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  accessibilityHint?: string;
};

export function Button({ label, onPress, tone = "primary", loading = false, disabled = false, icon, accessibilityHint }: ButtonProps) {
  const blocked = disabled || loading;
  const toneStyle = { primary: styles.primary, secondary: styles.secondary, danger: styles.danger, ghost: styles.ghost }[tone];
  const pressedStyle = { primary: styles.primaryPressed, secondary: styles.secondaryPressed, danger: styles.dangerPressed, ghost: styles.ghostPressed }[tone];
  const labelStyle = { primary: styles.primaryLabel, secondary: styles.secondaryLabel, danger: styles.dangerLabel, ghost: styles.ghostLabel }[tone];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: blocked, busy: loading }}
      disabled={blocked}
      onPress={onPress}
      style={({ pressed }) => [styles.base, toneStyle, pressed && pressedStyle, blocked && styles.disabled]}
    >
      {loading ? <ActivityIndicator color={tone === "primary" || tone === "danger" ? color.surface : color.brand}/> : <View style={styles.content}>{icon ?? null}<Text style={[styles.label, labelStyle]}>{label}</Text></View>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { minHeight: size.button, borderRadius: radius.md, alignItems: "center", justifyContent: "center", paddingHorizontal: space.lg, borderWidth: 1 },
  content: { ...rtl.row, alignItems: "center", justifyContent: "center", gap: space.xs },
  label: { ...typography.label, ...rtl.text },
  primary: { backgroundColor: color.brand, borderColor: color.brand }, primaryPressed: { backgroundColor: color.brandPressed, borderColor: color.brandPressed }, primaryLabel: { color: color.surface },
  secondary: { backgroundColor: color.surface, borderColor: color.brand }, secondaryPressed: { backgroundColor: color.brandSoft }, secondaryLabel: { color: color.brand },
  danger: { backgroundColor: color.danger, borderColor: color.danger }, dangerPressed: { backgroundColor: color.dangerPressed, borderColor: color.dangerPressed }, dangerLabel: { color: color.surface },
  ghost: { backgroundColor: "transparent", borderColor: "transparent" }, ghostPressed: { backgroundColor: color.brandSoft }, ghostLabel: { color: color.brand },
  disabled: { opacity: 0.48 },
});
