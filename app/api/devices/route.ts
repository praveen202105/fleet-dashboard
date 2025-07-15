import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()

    // Get session cookie
    const sessionCookie = cookieStore.get("JSESSIONID")

    if (!sessionCookie) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const response = await fetch("https://gps-staging.getfleet.ai/api/devices", {
      headers: {
        Cookie: `JSESSIONID=${sessionCookie.value}`,
      },
    })

    if (response.ok) {
      const data = await response.json()
      return NextResponse.json(data)
    } else {
      return NextResponse.json({ error: "Failed to fetch devices" }, { status: response.status })
    }
  } catch (error) {
    console.error("Devices API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
