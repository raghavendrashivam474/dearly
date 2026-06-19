import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendMagicLink } from "@/lib/email"

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email required" },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Find or create creator
    const creator = await prisma.creator.upsert({
      where: { email: normalizedEmail },
      update: {},
      create: { email: normalizedEmail },
    })

    // Invalidate any existing unused tokens for this creator
    await prisma.magicToken.updateMany({
      where: {
        creatorId: creator.id,
        used: false,
        expiresAt: { gt: new Date() },
      },
      data: { used: true },
    })

    // Create new token — expires in 15 minutes
    const magicToken = await prisma.magicToken.create({
      data: {
        creatorId: creator.id,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      },
    })

    // Send magic link email
    await sendMagicLink(normalizedEmail, magicToken.token)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Magic link error:", error)
    return NextResponse.json(
      { error: "Failed to send magic link" },
      { status: 500 }
    )
  }
}