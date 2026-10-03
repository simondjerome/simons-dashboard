import "./globals.css";
import PWARegister from "./pwa-register";

export const metadata = {
  title: "Simon's Dashboard",
  description: "Personal weather, Todoist tasks and CBC news dashboard",
  manifest: "/manifest.webmanifest",
  themeColor: "#18202b",
  icons: {
    icon: [
      { url: "/api/icon?size=192", type: "image/png", sizes: "192x192" },
      { url: "/api/icon?size=512", type: "image/png", sizes: "512x512" }
    ],
    shortcut: "/api/icon?size=192",
    apple: "/api/icon?size=192"
  },
  appleWebApp: {
    capable: true,
    title: "Simon's Dashboard",
    statusBarStyle: "default"
  }
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#18202b"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body><PWARegister />{children}</body>
    </html>
  );
}