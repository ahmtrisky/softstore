import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

// Increment download count
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const software = await db.software.update({
      where: { id },
      data: {
        downloadCount: { increment: 1 }
      }
    })

    return NextResponse.json({
      message: "Download count updated",
      downloadCount: software.downloadCount,
      filePath: software.filePath
    })
  } catch (error) {
    console.error("Error updating download count:", error)
    return NextResponse.json(
      { error: "Gagal mengupdate download count" },
      { status: 500 }
    )
  }
}
