import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

// GET all users (admin only)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const role = searchParams.get("role")
    const search = searchParams.get("search") || ""
    const limit = parseInt(searchParams.get("limit") || "20")
    const page = parseInt(searchParams.get("page") || "1")
    const skip = (page - 1) * limit

    const where: {
      role?: string
      OR?: Array<{ name: { contains: string }; email: { contains: string } }>
    } = {}

    if (role) where.role = role

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } }
      ]
    }

    const [users, total] = await Promise.all([
      db.user.findMany({
        where,
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
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip
      }),
      db.user.count({ where })
    ])

    return NextResponse.json({
      data: users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      { error: "Gagal mengambil data user" },
      { status: 500 }
    )
  }
}
