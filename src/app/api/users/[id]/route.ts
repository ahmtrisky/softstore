import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { hashPassword } from "@/lib/auth"

// GET single user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        createdAt: true,
        _count: {
          select: { comments: true, articles: true }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: "User tidak ditemukan" },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json(
      { error: "Gagal mengambil data user" },
      { status: 500 }
    )
  }
}

// UPDATE user
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, email, role, avatar, password } = body

    const updateData: {
      name?: string
      email?: string
      role?: string
      avatar?: string | null
      password?: string
    } = {}

    if (name) updateData.name = name
    if (email) updateData.email = email
    if (role) updateData.role = role
    if (avatar !== undefined) updateData.avatar = avatar
    if (password) updateData.password = await hashPassword(password)

    const user = await db.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true
      }
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json(
      { error: "Gagal mengupdate user" },
      { status: 500 }
    )
  }
}

// DELETE user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Delete related data
    await db.comment.deleteMany({ where: { userId: id } })
    await db.article.deleteMany({ where: { authorId: id } })
    
    await db.user.delete({
      where: { id }
    })

    return NextResponse.json({ message: "User berhasil dihapus" })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json(
      { error: "Gagal menghapus user" },
      { status: 500 }
    )
  }
}
