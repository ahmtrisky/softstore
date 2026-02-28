import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

// GET all comments (for admin)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const softwareId = searchParams.get("softwareId")
    const userId = searchParams.get("userId")
    const limit = parseInt(searchParams.get("limit") || "20")
    const page = parseInt(searchParams.get("page") || "1")
    const skip = (page - 1) * limit

    const where: {
      softwareId?: string
      userId?: string
      isActive?: boolean
    } = { isActive: true }

    if (softwareId) where.softwareId = softwareId
    if (userId) where.userId = userId

    const [comments, total] = await Promise.all([
      db.comment.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, avatar: true }
          },
          software: {
            select: { id: true, name: true, slug: true }
          }
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip
      }),
      db.comment.count({ where })
    ])

    return NextResponse.json({
      data: comments,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json(
      { error: "Gagal mengambil data komentar" },
      { status: 500 }
    )
  }
}

// CREATE new comment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, softwareId, comment, rating } = body

    if (!userId || !softwareId || !comment || !rating) {
      return NextResponse.json(
        { error: "Field yang wajib harus diisi" },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating harus antara 1-5" },
        { status: 400 }
      )
    }

    const newComment = await db.comment.create({
      data: {
        userId,
        softwareId,
        comment,
        rating
      },
      include: {
        user: {
          select: { id: true, name: true, avatar: true }
        }
      }
    })

    // Update software rating
    const allComments = await db.comment.findMany({
      where: { softwareId, isActive: true },
      select: { rating: true }
    })

    const avgRating = allComments.reduce((sum, c) => sum + c.rating, 0) / allComments.length

    await db.software.update({
      where: { id: softwareId },
      data: {
        rating: Math.round(avgRating * 10) / 10,
        ratingCount: allComments.length
      }
    })

    return NextResponse.json(newComment)
  } catch (error) {
    console.error("Error creating comment:", error)
    return NextResponse.json(
      { error: "Gagal membuat komentar" },
      { status: 500 }
    )
  }
}
