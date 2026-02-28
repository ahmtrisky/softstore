import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

// POST - Upload file
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const type = formData.get("type") as string || "files" // "images" or "files"

    if (!file) {
      return NextResponse.json(
        { error: "File tidak ditemukan" },
        { status: 400 }
      )
    }

    // Validate file size (max 100MB)
    const maxSize = 100 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "Ukuran file maksimal 100MB" },
        { status: 400 }
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 8)
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
    const fileName = `${timestamp}-${randomStr}-${originalName}`

    // Create upload directory if not exists
    const uploadDir = path.join(process.cwd(), "public", "uploads", type)
    await mkdir(uploadDir, { recursive: true })

    // Write file
    const filePath = path.join(uploadDir, fileName)
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Return public URL
    const publicUrl = `/uploads/${type}/${fileName}`

    return NextResponse.json({
      message: "File berhasil diupload",
      url: publicUrl,
      fileName,
      size: file.size
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: "Gagal mengupload file" },
      { status: 500 }
    )
  }
}
