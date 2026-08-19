import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const alt = "ImageResizeLab — image resizer and free photo tools";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#1c0a18",
          color: "white",
          padding: 72,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 36,
            left: 36,
            right: 36,
            bottom: 36,
            border: "1px solid rgba(255,255,255,0.14)",
            display: "flex",
          }}
        />
        <div
          style={{
            display: "flex",
            fontSize: 22,
            color: "#f5a524",
            letterSpacing: 6,
            fontWeight: 600,
          }}
        >
          IMAGERESIZELAB
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 68,
            fontWeight: 600,
            marginTop: 16,
            lineHeight: 1.05,
          }}
        >
          Resize in the browser.
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 28,
            marginTop: 22,
            color: "rgba(255,255,255,0.72)",
          }}
        >
          Compress · convert · crop · no upload
        </div>
      </div>
    ),
    { ...size },
  );
}
