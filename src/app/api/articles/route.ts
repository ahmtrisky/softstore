import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

// GET all articles
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get("search") || ""
    const published = searchParams.get("published")
    const limit = parseInt(searchParams.get("limit") || "10")
    const page = parseInt(searchParams.get("page") || "1")
    const skip = (page - 1) * limit

    const where: {
      published?: boolean
      OR?: Array<{ title: { contains: string }; content: { contains: string } }>
    } = {}

    if (published === "true") {
      where.published = true
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } }
      ]
    }

    const [articles, total] = await Promise.all([
      db.article.findMany({
        where,
        include: {
          author: {
            select: { id: true, name: true, avatar: true }
          }
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip
      }),
      db.article.count({ where })
    ])

    return NextResponse.json({
      data: articles,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error("Error fetching articles:", error)
    return NextResponse.json(
      { error: "Gagal mengambil data artikel" },
      { status: 500 }
    )
  }
}

// CREATE new article
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, excerpt, thumbnail, authorId, published } = body

    if (!title || !content || !authorId) {
      return NextResponse.json(
        { error: "Field yang wajib harus diisi" },
        { status: 400 }
      )
    }

    // Generate slug
    const slug = title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")

    const article = await db.article.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        thumbnail,
        authorId,
        published: published || false
      },
      include: {
        author: {
          select: { id: true, name: true }
        }
      }
    })

    return NextResponse.json(article)
  } catch (error) {
    console.error("Error creating article:", error)
    return NextResponse.json(
      { error: "Gagal membuat artikel" },
      { status: 500 }
    )
  }
}
