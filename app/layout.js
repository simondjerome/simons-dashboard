import "./globals.css";

export const metadata = {
  title: "Simon's Dashboard",
  description: "Personal weather, Todoist tasks and CBC news dashboard",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}