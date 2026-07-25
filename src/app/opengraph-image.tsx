import { ImageResponse } from "next/og";
import { brand } from "@/lib/brand";

export const alt = `${brand.displayName} — ${brand.tagline}`;
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
          justifyContent: "center",
          padding: "0 88px",
          backgroundColor: "#241722",
          backgroundImage:
            "linear-gradient(135deg, #3A2130 0%, #241722 48%, #1E1318 100%)",
          color: "#F6ECEC",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 22,
            letterSpacing: 8,
            color: "#D0A85F",
          }}
        >
          <div
            style={{
              width: 56,
              height: 2,
              marginRight: 16,
              backgroundColor: "#D0A85F",
            }}
          />
          ADULTS ONLY · 18+
        </div>

        <div style={{ display: "flex", marginTop: 34, fontSize: 104, letterSpacing: 6 }}>
          <div style={{ display: "flex" }}>FERU</div>
          <div style={{ display: "flex", color: "#D0A85F" }}>TOYS</div>
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 26,
            fontSize: 38,
            color: "#D8C4CB",
            maxWidth: 820,
            lineHeight: 1.35,
          }}
        >
          {brand.tagline} Body-safe pleasure, wellness and lingerie — shipped
          discreetly across Europe.
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 44,
            fontSize: 24,
            letterSpacing: 3,
            color: "#8C7681",
          }}
        >
          {brand.domain}
        </div>
      </div>
    ),
    size,
  );
}
