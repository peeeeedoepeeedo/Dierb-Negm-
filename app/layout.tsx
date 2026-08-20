import type { Metadata } from "next";
import "./globals.css";
import "./modules.css";
import "./checkout-enhancements.css";

export const metadata: Metadata = {
  title: "ديرب أونلاين — كل بلدك في موبايلك",
  description: "ديرب أونلاين: دليل ديرب نجم المحلي للمتاجر والمنتجات والخدمات والمجتمع والإعلانات.",
  applicationName: "ديرب أونلاين",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){
  return <html lang="ar" dir="rtl"><body>{children}</body></html>;
}
