import { NextResponse } from "next/server"
import { db } from "@/lib/db"

// GET dashboard statistics
export async function GET() {
  try {
    const [
      totalSoftware,
      totalUsers,
      totalDownloads,
      totalCategories,
      totalArticles,
      totalComments,
      recentSoftware,
      topDownloaded,
      recentComments
    ] = await Promise.all([
      db.software.count({ where: { isActive: true } }),
      db.user.count(),
      db.software.aggregate({
        _sum: { downloadCount: true }
      }),
      db.category.count(),
      db.article.count({ where: { published: true } }),
      db.comment.count({ where: { isActive: true } }),
      db.software.findMany({
        where: { isActive: true },
        include: { category: true },
        orderBy: { createdAt: "desc" },
        take: 5
      }),
      db.software.findMany({
        where: { isActive: true },
        include: { category: true },
        orderBy: { downloadCount: "desc" },
        take: 5
      }),
      db.comment.findMany({
        where: { isActive: true },
        include: {
          user: { select: { name: true } },
          software: { select: { name: true } }
        },
        orderBy: { createdAt: "desc" },
        take: 5
      })
    ])

    return NextResponse.json({
      totalSoftware,
      totalUsers,
      totalDownloads: totalDownloads._sum.downloadCount || 0,
      totalCategories,
      totalArticles,
      totalComments,
      recentSoftware,
      topDownloaded,
      recentComments
    })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json(
      { error: "Gagal mengambil statistik" },
      { status: 500 }
    )
  }
}
