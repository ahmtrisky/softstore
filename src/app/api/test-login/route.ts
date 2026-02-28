import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { createHash } from "crypto"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    console.log("=== TEST LOGIN ===")
    console.log("Email:", email)

    if (!email || !password) {
      return NextResponse.json({ error: "Email dan password harus diisi" }, { status: 400 })
    }

    // Find user
    const user = await db.user.findUnique({
      where: { email }
    })

    if (!user) {
      console.log("User NOT found")
      return NextResponse.json({ error: "Email tidak terdaftar" }, { status: 401 })
    }

    // Hash password and compare
    const passwordHash = createHash('sha256').update(password).digest('hex')
    
    console.log("Input hash:", passwordHash)
    console.log("DB hash:  ", user.password)

    if (passwordHash !== user.password) {
      console.log("Password MISMATCH")
      return NextResponse.json({ error: "Password salah" }, { status: 401 })
    }

    console.log("Login SUCCESS for:", user.email)

    return NextResponse.json({
      success: true,
      message: "Login berhasil!",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    console.error("Test login error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
