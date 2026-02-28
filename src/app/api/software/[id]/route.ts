import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

// GET single software by ID or slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Try to find by ID first, then by slug
    let software = await db.software.findUnique({
      where: { id },
      include: {
        category: true,
        comments: {
          where: { isActive: true },
          include: {
            user: {
              select: { id: true, name: true, avatar: true }
            }
          },
          orderBy: { createdAt: "desc" },
          take: 20
        },
        _count: {
          select: { comments: true }
        }
      }
    })

    if (!software) {
      software = await db.software.findUnique({
        where: { slug: id },
        include: {
          category: true,
          comments: {
            where: { isActive: true },
            include: {
              user: {
                select: { id: true, name: true, avatar: true }
              }
            },
            orderBy: { createdAt: "desc" },
            take: 20
          },
          _count: {
            select: { comments: true }
          }
        }
      })
    }

    if (!software) {
      return NextResponse.json(
        { error: "Software tidak ditemukan" },
        { status: 404 }
      )
    }

    return NextResponse.json(software)
  } catch (error) {
    console.error("Error fetching software:", error)
    return NextResponse.json(
      { error: "Gagal mengambil data software" },
      { status: 500 }
    )
  }
}

// UPDATE software
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const {
      name,
      description,
      longDescription,
      version,
      fileSize,
      osSupport,
      developer,
      thumbnail,
      screenshots,
      filePath,
      categoryId,
      featured,
      isActive
    } = body

    const updateData: {
      name?: string
      slug?: string
      description?: string
      longDescription?: string | null
      version?: string
      fileSize?: string
      osSupport?: string
      developer?: string
      thumbnail?: string | null
      screenshots?: string | null
      filePath?: string | null
      categoryId?: string | null
      featured?: boolean
      isActive?: boolean
    } = {}

    if (name) {
      updateData.name = name
      updateData.slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
    }
    if (description) updateData.description = description
    if (longDescription !== undefined) updateData.longDescription = longDescription
    if (version) updateData.version = version
    if (fileSize) updateData.fileSize = fileSize
    if (osSupport) updateData.osSupport = osSupport
    if (developer) updateData.developer = developer
    if (thumbnail !== undefined) updateData.thumbnail = thumbnail
    if (screenshots !== undefined) updateData.screenshots = screenshots
    if (filePath !== undefined) updateData.filePath = filePath
    if (categoryId !== undefined) updateData.categoryId = categoryId || null
    if (featured !== undefined) updateData.featured = featured
    if (isActive !== undefined) updateData.isActive = isActive

    const software = await db.software.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json(software)
  } catch (error) {
    console.error("Error updating software:", error)
    return NextResponse.json(
      { error: "Gagal mengupdate software" },
      { status: 500 }
    )
  }
}

// DELETE software
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Delete related comments first
    await db.comment.deleteMany({
      where: { softwareId: id }
    })
    
    await db.software.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Software berhasil dihapus" })
  } catch (error) {
    console.error("Error deleting software:", error)
    return NextResponse.json(
      { error: "Gagal menghapus software" },
      { status: 500 }
    )
  }
}
