import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #071a20 0%, #16474b 100%)",
        }}
      >
        <svg width="118" height="118" viewBox="0 0 36 36" fill="none">
          <path
            d="M18 8.5V25M18 8.5L10.5 25M18 8.5L25.5 25M6.5 25H29.5M9 25V27.5M27 25V27.5"
            stroke="white"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
