import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

// Image metadata
export const size = {
    width: 180,
    height: 180,
};
export const contentType = "image/png";

// Image generation
export default function AppleIcon() {
    // Read the logo SVG and extract the embedded PNG
    const logoPath = join(process.cwd(), "public", "Logo.svg");
    const logoSvg = readFileSync(logoPath, "utf-8");
    const base64Match = logoSvg.match(/data:image\/png;base64,([^"]+)/);
    const logoBase64 = base64Match ? base64Match[1] : "";

    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "transparent",
                }}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={`data:image/png;base64,${logoBase64}`}
                    width={180}
                    height={180}
                    alt="Sidrat"
                    style={{ objectFit: "contain" }}
                />
            </div>
        ),
        {
            ...size,
        }
    );
}
