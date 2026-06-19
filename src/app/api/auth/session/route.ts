import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"

// GET — read current session
export async function GET() {
  try {
    const session = await getSession()

    if (!session.creatorId) {
      return NextResponse.json({ authenticated: false })
    }

    return NextResponse.json({
      authenticated: true,
      creatorId: session.creatorId,
      email: session.email,
    })
  } catch (error) {
    console.error("Session error:", error)
    return NextResponse.json({ authenticated: false })
  }
}

// DELETE — sign out
export async function DELETE() {
  try {
    const session = await getSession()
    session.destroy()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Sign out error:", error)
    return NextResponse.json(
      { error: "Failed to sign out" },
      { status: 500 }
    )
  }
}