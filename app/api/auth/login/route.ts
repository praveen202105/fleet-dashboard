import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Create form data for the API
    const formData = new URLSearchParams()
    formData.append("email", email)
    formData.append("password", password)

    const response = await fetch("https://gps-staging.getfleet.ai/api/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    })

    if (response.ok) {
      // Get the Set-Cookie header from the response
      const setCookieHeader = response.headers.get("set-cookie")

      if (setCookieHeader) {
        // Parse the session cookie
        const sessionCookie = setCookieHeader.split(";")[0]
        const [name, value] = sessionCookie.split("=")

        // Set the cookie in our response
        const cookieStore = await cookies()
        cookieStore.set(name, value, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7, // 7 days
        })
      }

      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
