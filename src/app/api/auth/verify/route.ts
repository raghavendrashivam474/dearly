import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/session"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.redirect(
        new URL("/auth/error?reason=missing-token", req.url)
      )
    }

    // Find token
    const magicToken = await prisma.magicToken.findUnique({
      where: { token },
      include: { creator: true },
    })

    // Token not found
    if (!magicToken) {
      return NextResponse.redirect(
        new URL("/auth/error?reason=invalid-token", req.url)
      )
    }

    // Token already used
    if (magicToken.used) {
      return NextResponse.redirect(
        new URL("/auth/error?reason=token-used", req.url)
      )
    }

    // Token expired
    if (magicToken.expiresAt < new Date()) {
      return NextResponse.redirect(
        new URL("/auth/error?reason=token-expired", req.url)
      )
    }

    // Mark token as used
    await prisma.magicToken.update({
      where: { token },
      data: { used: true },
    })

    // Set session
    const session = await getSession()
    session.creatorId = magicToken.creatorId
    session.email = magicToken.creator.email
    await session.save()

    // Redirect to dashboard
    return NextResponse.redirect(new URL("/dashboard", req.url))
  } catch (error) {
    console.error("Verify error:", error)
    return NextResponse.redirect(
      new URL("/auth/error?reason=server-error", req.url)
    )
  }
}