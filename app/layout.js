import "./globals.css";
import PWARegister from "./pwa-register";

export const metadata = {
  title: "Simon's Dashboard",
  description: "Personal weather, Todoist tasks and CBC news dashboard",
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
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="icon" href="/api/icon?size=192" sizes="192x192" type="image/png" />
        <link rel="apple-touch-icon" href="/api/icon?size=192" />
        <meta name="theme-color" content="#18202b" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Simon's Dashboard" />
      </head>
      <body><PWARegister />{children}</body>
    </html>
  );
}
