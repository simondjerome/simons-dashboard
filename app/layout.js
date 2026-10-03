import "./globals.css";

export const metadata = {
  title: "Simon's Dashboard",
  description: "Personal weather, Todoist tasks and world news dashboard"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}