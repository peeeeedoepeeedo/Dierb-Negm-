import type { TextStyle, ViewStyle } from "react-native";

export const palette = {
  navy950: "#081829",
  navy900: "#10243E",
  navy700: "#31506F",
  slate600: "#607086",
  slate300: "#C8D2DC",
  slate200: "#E3E9EF",
  slate100: "#EEF2F5",
  slate50: "#F6F8FA",
  white: "#FFFFFF",
  green700: "#087456",
  green600: "#0B8F68",
  green100: "#DDF3EB",
  green50: "#EAF8F3",
  amber700: "#805400",
  amber500: "#F2B84B",
  amber50: "#FFF7E5",
  red700: "#AE3030",
  red600: "#D64545",
  red50: "#FDECEC",
  overlay: "rgba(8, 24, 41, 0.52)",
} as const;

export const color = {
  brand: palette.green600,
  brandPressed: palette.green700,
  brandSoft: palette.green50,
  text: palette.navy900,
  textMuted: palette.slate600,
  canvas: palette.slate50,
  surface: palette.white,
  border: palette.slate200,
  skeleton: palette.slate100,
  success: palette.green600,
  successSoft: palette.green50,
  warning: palette.amber700,
  warningSoft: palette.amber50,
  danger: palette.red600,
  dangerPressed: palette.red700,
  dangerSoft: palette.red50,
  overlay: palette.overlay,
} as const;

export const space = { none: 0, xxs: 4, xs: 8, sm: 12, md: 16, lg: 24, xl: 32, xxl: 40, xxxl: 48 } as const;
export const radius = { xs: 8, sm: 12, md: 16, lg: 20, xl: 28, pill: 999 } as const;
export const size = { minimumTouchTarget: 44, button: 52, input: 52, appBar: 64 } as const;

export const typography = {
  display: { fontSize: 30, lineHeight: 42, fontWeight: "800" },
  title: { fontSize: 24, lineHeight: 34, fontWeight: "800" },
  heading: { fontSize: 20, lineHeight: 30, fontWeight: "700" },
  body: { fontSize: 16, lineHeight: 25, fontWeight: "400" },
  label: { fontSize: 14, lineHeight: 21, fontWeight: "700" },
  caption: { fontSize: 12, lineHeight: 18, fontWeight: "500" },
} as const satisfies Record<string, TextStyle>;

export const rtl = {
  text: { textAlign: "right", writingDirection: "rtl" } satisfies TextStyle,
  row: { flexDirection: "row-reverse" } satisfies ViewStyle,
  start: { alignItems: "flex-end" } satisfies ViewStyle,
} as const;

export const shadow = {
  card: {
    shadowColor: palette.navy950,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  } satisfies ViewStyle,
} as const;

