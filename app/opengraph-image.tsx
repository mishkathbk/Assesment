import { ImageResponse } from "next/og";

export const alt = "Lead Manager";
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
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
          background: "#f5f4f0",
        }}
      >
        <svg width="160" height="160" viewBox="0 0 32 32">
          <rect width="32" height="32" rx="8" fill="#1f4d40" />
          <path
            d="M11 9v14h10"
            stroke="#e8a33d"
            strokeWidth="3.2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 72, fontWeight: 700, color: "#1c1c1a" }}>Lead Manager</div>
          <div style={{ fontSize: 32, color: "#6e6c66" }}>Manage your sales leads in one place</div>
        </div>
      </div>
    ),
    size
  );
}
