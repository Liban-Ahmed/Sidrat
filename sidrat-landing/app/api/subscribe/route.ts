import { NextResponse } from "next/server";
import { headers } from "next/headers";

const rateLimit = new Map<string, { count: number; resetTime: number }>();

export async function POST(request: Request) {
    try {
        // Get IP for rate limiting
        const headersList = await headers();
        const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown";
        
        // Rate limit: 5 requests per minute per IP
        const now = Date.now();
        const userLimit = rateLimit.get(ip);
        
        if (userLimit) {
            if (now < userLimit.resetTime) {
                if (userLimit.count >= 5) {
                    return NextResponse.json(
                        { error: "Too many requests. Please try again in a minute." },
                        { status: 429 }
                    );
                }
                userLimit.count++;
            } else {
                rateLimit.set(ip, { count: 1, resetTime: now + 60000 });
            }
        } else {
            rateLimit.set(ip, { count: 1, resetTime: now + 60000 });
        }

        // Parse and validate email
        const { email } = await request.json();

        if (!email || typeof email !== "string") {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Invalid email address" },
                { status: 400 }
            );
        }

        // Check for API key
        if (!process.env.LOOPS_API_KEY) {
            console.error("LOOPS_API_KEY is not configured");
            return NextResponse.json(
                { error: "Service temporarily unavailable" },
                { status: 503 }
            );
        }

        // Call Loops API from server
        const response = await fetch("https://app.loops.so/api/v1/contacts/create", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.LOOPS_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                source: "sidrat-landing",
                userGroup: "waitlist",
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Loops API error:", response.status, errorText);
            
            // Handle specific error cases
            if (response.status === 409) {
                return NextResponse.json(
                    { error: "This email is already on the waitlist" },
                    { status: 400 }
                );
            }
            
            return NextResponse.json(
                { error: "Failed to subscribe. Please try again later." },
                { status: response.status }
            );
        }

        const result = await response.json();
        
        return NextResponse.json({ 
            success: true,
            message: "Successfully added to waitlist" 
        });

    } catch (error) {
        console.error("Subscribe error:", error);
        return NextResponse.json(
            { error: "Something went wrong. Please try again." },
            { status: 500 }
        );
    }
}