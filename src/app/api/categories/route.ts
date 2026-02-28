import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

// GET all categories
export async function GET() {
  try {
    const categories = await db.category.findMany({
      include: {
        _count: {
          select: { software: true }
        }
      },
      orderBy: { name: "asc" }
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json(
      { error: "Gagal mengambil data kategori" },
      { status: 500 }
    )
  }
}

// CREATE new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, icon, color } = body

    if (!name) {
      return NextResponse.json(
        { error: "Nama kategori harus diisi" },
        { status: 400 }
      )
    }

    // Generate slug
    const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")

    const category = await db.category.create({
      data: {
        name,
        slug,
        description,
        icon,
        color
      }
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json(
      { error: "Gagal membuat kategori" },
      { status: 500 }
    )
  }
}
