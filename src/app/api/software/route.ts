import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

// GET all software with filtering
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get("search") || ""
    const category = searchParams.get("category") || ""
    const os = searchParams.get("os") || ""
    const featured = searchParams.get("featured")
    const limit = parseInt(searchParams.get("limit") || "20")
    const page = parseInt(searchParams.get("page") || "1")
    const skip = (page - 1) * limit

    const where: {
      isActive: boolean
      OR?: Array<{ name: { contains: string }; description: { contains: string } }>
      categoryId?: string
      osSupport?: { contains: string }
      featured?: boolean
    } = { isActive: true }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } }
      ]
    }

    if (category) {
      where.categoryId = category
    }

    if (os) {
      where.osSupport = { contains: os }
    }

    if (featured === "true") {
      where.featured = true
    }

    const [software, total] = await Promise.all([
      db.software.findMany({
        where,
        include: {
          category: true,
          _count: {
            select: { comments: true }
          }
        },
        orderBy: [
          { featured: "desc" },
          { createdAt: "desc" }
        ],
        take: limit,
        skip
      }),
      db.software.count({ where })
    ])

    return NextResponse.json({
      data: software,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error("Error fetching software:", error)
    return NextResponse.json(
      { error: "Gagal mengambil data software" },
      { status: 500 }
    )
  }
}

// CREATE new software
export async function POST(request: NextRequest) {
  try {
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
      featured
    } = body

    if (!name || !description || !version || !fileSize || !osSupport || !developer) {
      return NextResponse.json(
        { error: "Field yang wajib harus diisi" },
        { status: 400 }
      )
    }

    // Generate slug
    const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")

    const software = await db.software.create({
      data: {
        name,
        slug,
        description,
        longDescription,
        version,
        fileSize,
        osSupport,
        developer,
        thumbnail,
        screenshots,
        filePath,
        categoryId: categoryId || null,
        featured: featured || false
      }
    })

    return NextResponse.json(software)
  } catch (error) {
    console.error("Error creating software:", error)
    return NextResponse.json(
      { error: "Gagal membuat software" },
      { status: 500 }
    )
  }
}
