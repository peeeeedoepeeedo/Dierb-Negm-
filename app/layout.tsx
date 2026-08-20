import type { Metadata } from "next";
import "./globals.css";
import "./modules.css";
import "./checkout-enhancements.css";

export const metadata: Metadata = {
  title: "ديرب نجم — كل بلدك في موبايلك",
  description: "دليل ديرب نجم المحلي للمتاجر والمطاعم والصيدليات والأطباء والخدمات والعروض.",
  applicationName: "ديرب",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){
  return <html lang="ar" dir="rtl"><body>{children}</body></html>;
}
