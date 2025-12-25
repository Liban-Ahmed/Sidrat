import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

// Image metadata
export const alt = "Sidrat - Islamic Curriculum for Muslim Parents";
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = "image/png";

// Image generation
export default function OGImage() {
    // Read the logo SVG and extract the embedded PNG
    const logoPath = join(process.cwd(), "public", "Logo.svg");
    const logoSvg = readFileSync(logoPath, "utf-8");
    const base64Match = logoSvg.match(/data:image\/png;base64,([^"]+)/);
    const logoBase64 = base64Match ? base64Match[1] : "";

    return new ImageResponse(
        (
            <div
                style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(135deg, #F5F5F5 0%, #FFFFFF 50%, #F5F5F5 100%)",
                    position: "relative",
                }}
            >
                {/* Background decoration */}
                <div
                    style={{
                        position: "absolute",
                        top: "10%",
                        left: "10%",
                        width: "300px",
                        height: "300px",
                        background: "rgba(12, 116, 137, 0.1)",
                        borderRadius: "50%",
                        filter: "blur(60px)",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        bottom: "10%",
                        right: "10%",
                        width: "300px",
                        height: "300px",
                        background: "rgba(72, 139, 73, 0.1)",
                        borderRadius: "50%",
                        filter: "blur(60px)",
                    }}
                />

                {/* Logo */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "40px",
                    }}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={`data:image/png;base64,${logoBase64}`}
                        width={100}
                        height={100}
                        alt="Sidrat Logo"
                        style={{ objectFit: "contain", marginRight: "20px" }}
                    />
                    <span
                        style={{
                            fontSize: "72px",
                            fontWeight: "bold",
                            background: "linear-gradient(90deg, #0C7489, #488B49)",
                            backgroundClip: "text",
                            color: "transparent",
                            fontFamily: "sans-serif",
                        }}
                    >
                        Sidrat
                    </span>
                </div>

                {/* Tagline */}
                <div
                    style={{
                        fontSize: "48px",
                        fontWeight: "bold",
                        color: "#2C3E3F",
                        textAlign: "center",
                        marginBottom: "20px",
                        fontFamily: "sans-serif",
                    }}
                >
                    Islamic Curriculum for Muslim Parents
                </div>

                {/* Description */}
                <div
                    style={{
                        fontSize: "28px",
                        color: "#6B7280",
                        textAlign: "center",
                        maxWidth: "800px",
                        fontFamily: "sans-serif",
                    }}
                >
                    Raise confident Muslim children with personalized weekly lessons
                </div>

                {/* Badge */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginTop: "40px",
                        padding: "16px 32px",
                        background: "linear-gradient(90deg, rgba(12, 116, 137, 0.1), rgba(72, 139, 73, 0.1))",
                        borderRadius: "50px",
                        border: "2px solid rgba(12, 116, 137, 0.2)",
                    }}
                >
                    <div
                        style={{
                            width: "12px",
                            height: "12px",
                            background: "#0C7489",
                            borderRadius: "50%",
                        }}
                    />
                    <span
                        style={{
                            fontSize: "24px",
                            color: "#0C7489",
                            fontWeight: "600",
                            fontFamily: "sans-serif",
                        }}
                    >
                        Join 100+ families on the waitlist
                    </span>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
