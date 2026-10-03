export default function manifest() {
  return {
    name: "Simon's Dashboard",
    short_name: "Dashboard",
    description: "Simon's personal weather, Todoist and CBC news dashboard",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#0f141b",
    theme_color: "#18202b",
    icons: [
      {
        src: "/api/icon?size=192",
        sizes: "192x192",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/api/icon?size=512",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable"
      }
    ]
  };
}