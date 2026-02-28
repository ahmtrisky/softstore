import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

// DELETE comment
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const comment = await db.comment.findUnique({
      where: { id },
      select: { softwareId: true, rating: true }
    })

    if (!comment) {
      return NextResponse.json(
        { error: "Komentar tidak ditemukan" },
        { status: 404 }
      )
    }

    // Soft delete
    await db.comment.update({
      where: { id },
      data: { isActive: false }
    })

    // Update software rating
    const allComments = await db.comment.findMany({
      where: { softwareId: comment.softwareId, isActive: true },
      select: { rating: true }
    })

    const avgRating = allComments.length > 0 
      ? allComments.reduce((sum, c) => sum + c.rating, 0) / allComments.length 
      : 0

    await db.software.update({
      where: { id: comment.softwareId },
      data: {
        rating: Math.round(avgRating * 10) / 10,
        ratingCount: allComments.length
      }
    })

    return NextResponse.json({ message: "Komentar berhasil dihapus" })
  } catch (error) {
    console.error("Error deleting comment:", error)
    return NextResponse.json(
      { error: "Gagal menghapus komentar" },
      { status: 500 }
    )
  }
}
