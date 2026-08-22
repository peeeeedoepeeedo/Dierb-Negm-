import type { ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { color, radius, shadow, space } from "../tokens";

export type CardProps = { children: ReactNode; onPress?: () => void; accessibilityLabel?: string; elevated?: boolean };

export function Card({ children, onPress, accessibilityLabel, elevated = false }: CardProps) {
  const cardStyle = [styles.base, elevated && shadow.card];
  if (!onPress) return <View style={cardStyle}>{children}</View>;
  return <Pressable accessibilityRole="button" accessibilityLabel={accessibilityLabel} onPress={onPress} style={({ pressed }) => [cardStyle, pressed && styles.pressed]}>{children}</Pressable>;
}

const styles = StyleSheet.create({
  base: { backgroundColor: color.surface, borderWidth: 1, borderColor: color.border, borderRadius: radius.lg, padding: space.md },
  pressed: { backgroundColor: color.brandSoft, borderColor: color.brand },
});

