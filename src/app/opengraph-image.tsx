import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "90px",
          background: "linear-gradient(135deg, #071a20 0%, #12333c 55%, #16474b 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <div
            style={{
              width: 76,
              height: 76,
              borderRadius: 18,
              background: "#128488",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="48" height="48" viewBox="0 0 36 36" fill="none">
              <path
                d="M18 8.5V25M18 8.5L10.5 25M18 8.5L25.5 25M6.5 25H29.5M9 25V27.5M27 25V27.5"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 42, color: "white", fontWeight: 600 }}>
              Stonebridge
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 18,
                color: "#77dad7",
                letterSpacing: 7,
                fontWeight: 500,
              }}
            >
              FINANCE
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 56,
            color: "white",
            marginTop: 60,
            maxWidth: 950,
            lineHeight: 1.15,
            fontWeight: 600,
          }}
        >
          Banking that fits in your pocket, not your way.
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 26,
            color: "rgba(255,255,255,0.6)",
            marginTop: 28,
          }}
        >
          Checking · Savings · Loans · Cards · Zelle
        </div>
      </div>
    ),
    { ...size }
  );
}
