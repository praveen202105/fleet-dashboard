import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  const cookieStore = await cookies()

  // Clear all cookies that might be session-related
  const cookieNames = ["JSESSIONID", "session", "auth-token"]

  cookieNames.forEach((name) => {
    if (cookieStore.has(name)) {
      cookieStore.delete(name)
    }
  })

  return NextResponse.json({ success: true })
}
