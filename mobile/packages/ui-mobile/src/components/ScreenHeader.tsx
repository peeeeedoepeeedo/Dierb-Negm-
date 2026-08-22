import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { color, rtl, size, space, typography } from "../tokens";

export type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
};

export function ScreenHeader({ title, subtitle, leading, trailing }: ScreenHeaderProps) {
  return (
    <View style={styles.container}>
      {leading ?? null}
      <View style={styles.copy}>
        <Text accessibilityRole="header" style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {trailing ?? null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { ...rtl.row, minHeight: size.appBar, alignItems: "center", gap: space.sm, paddingHorizontal: space.md, paddingVertical: space.sm, backgroundColor: color.canvas },
  copy: { flex: 1, alignItems: "flex-end" },
  title: { ...typography.title, ...rtl.text, color: color.text },
  subtitle: { ...typography.caption, ...rtl.text, color: color.textMuted, marginTop: space.xxs },
});

