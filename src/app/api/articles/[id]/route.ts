import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

// GET single article by ID or slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Try to find by ID first, then by slug
    let article = await db.article.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true, avatar: true }
        }
      }
    })

    if (!article) {
      article = await db.article.findUnique({
        where: { slug: id },
        include: {
          author: {
            select: { id: true, name: true, avatar: true }
          }
        }
      })
    }

    if (!article) {
      return NextResponse.json(
        { error: "Artikel tidak ditemukan" },
        { status: 404 }
      )
    }

    // Increment view count
    await db.article.update({
      where: { id: article.id },
      data: { viewCount: { increment: 1 } }
    })

    return NextResponse.json(article)
  } catch (error) {
    console.error("Error fetching article:", error)
    return NextResponse.json(
      { error: "Gagal mengambil data artikel" },
      { status: 500 }
    )
  }
}

// UPDATE article
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, content, excerpt, thumbnail, published } = body

    const updateData: {
      title?: string
      slug?: string
      content?: string
      excerpt?: string | null
      thumbnail?: string | null
      published?: boolean
    } = {}

    if (title) {
      updateData.title = title
      updateData.slug = title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
    }
    if (content) updateData.content = content
    if (excerpt !== undefined) updateData.excerpt = excerpt
    if (thumbnail !== undefined) updateData.thumbnail = thumbnail
    if (published !== undefined) updateData.published = published

    const article = await db.article.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json(article)
  } catch (error) {
    console.error("Error updating article:", error)
    return NextResponse.json(
      { error: "Gagal mengupdate artikel" },
      { status: 500 }
    )
  }
}

// DELETE article
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await db.article.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Artikel berhasil dihapus" })
  } catch (error) {
    console.error("Error deleting article:", error)
    return NextResponse.json(
      { error: "Gagal menghapus artikel" },
      { status: 500 }
    )
  }
}
