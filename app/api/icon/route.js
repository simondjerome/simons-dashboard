import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request) {
  const requested = Number(new URL(request.url).searchParams.get("size"));
  const size = requested === 192 ? 192 : 512;
  return new ImageResponse(
    {
      type: "div",
      props: {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#17212b",
          color: "white",
          fontSize: Math.round(size * 0.29),
          fontWeight: 800,
          fontFamily: "Arial, sans-serif",
          borderRadius: Math.round(size * 0.22),
          border: Math.max(6, Math.round(size * 0.04)) + "px solid #46525e"
        },
        children: "SD"
      }
    },
    { width: size, height: size }
  );
}