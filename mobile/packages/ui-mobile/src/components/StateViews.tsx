import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Button } from "./Button";
import { color, radius, rtl, space, typography } from "../tokens";

type ActionStateProps = { title: string; message: string; actionLabel?: string; onAction?: () => void };
type StateViewProps = ActionStateProps & { mark: string; tone?: "brand" | "danger" | "warning" };

function StateView({ mark, title, message, actionLabel, onAction, tone = "brand" }: StateViewProps) {
  const markTone = { brand: styles.brandMark, danger: styles.dangerMark, warning: styles.warningMark }[tone];
  const textTone = { brand: styles.brandText, danger: styles.dangerText, warning: styles.warningText }[tone];
  return (
    <View style={styles.container}>
      <View accessible={false} style={[styles.mark, markTone]}><Text style={[styles.markText, textTone]}>{mark}</Text></View>
      <Text accessibilityRole="header" style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {actionLabel && onAction ? <View style={styles.action}><Button label={actionLabel} onPress={onAction} tone="secondary"/></View> : null}
    </View>
  );
}

export function LoadingState({ label = "جارٍ تحميل البيانات…" }: { label?: string }) {
  return <View accessibilityLabel={label} accessibilityRole="progressbar" style={styles.container}><ActivityIndicator size="large" color={color.brand}/><Text style={styles.message}>{label}</Text><View style={styles.skeletonWide}/><View style={styles.skeletonShort}/></View>;
}

export function EmptyState(props: ActionStateProps) { return <StateView mark="＋" tone="brand" {...props}/>; }
export function ErrorState(props: ActionStateProps) { return <StateView mark="!" tone="danger" {...props}/>; }
export function OfflineState({ onRetry, message = "راجع اتصال الإنترنت وحاول مرة تانية. أي بيانات كتبتها تفضل محفوظة." }: { onRetry: () => void; message?: string }) { return <StateView mark="↻" tone="warning" title="مفيش اتصال بالإنترنت" message={message} actionLabel="حاول تاني" onAction={onRetry}/>; }

const styles = StyleSheet.create({
  container: { minHeight: 280, alignItems: "center", justifyContent: "center", padding: space.xl },
  mark: { width: 56, height: 56, borderRadius: radius.pill, alignItems: "center", justifyContent: "center", marginBottom: space.md },
  brandMark: { backgroundColor: color.brandSoft }, dangerMark: { backgroundColor: color.dangerSoft }, warningMark: { backgroundColor: color.warningSoft },
  markText: { fontSize: 28, lineHeight: 34, fontWeight: "800" }, brandText: { color: color.brand }, dangerText: { color: color.danger }, warningText: { color: color.warning },
  title: { ...typography.heading, ...rtl.text, color: color.text, textAlign: "center" },
  message: { ...typography.body, ...rtl.text, color: color.textMuted, textAlign: "center", maxWidth: 360, marginTop: space.xs },
  action: { width: "100%", maxWidth: 280, marginTop: space.lg },
  skeletonWide: { width: "82%", height: 14, borderRadius: radius.pill, backgroundColor: color.skeleton, marginTop: space.xl },
  skeletonShort: { width: "56%", height: 14, borderRadius: radius.pill, backgroundColor: color.skeleton, marginTop: space.sm },
});
