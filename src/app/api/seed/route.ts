import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { hashPassword } from "@/lib/auth"

// SEED database with initial data
// Can be called with GET or POST
export async function GET() {
  return seedDatabase()
}

export async function POST() {
  return seedDatabase()
}

async function seedDatabase() {
  try {
    // Check if already seeded
    const existingAdmin = await db.user.findFirst({
      where: { role: "admin" }
    })

    if (existingAdmin) {
      return NextResponse.json({ 
        success: true,
        message: "Database sudah di-seed sebelumnya",
        admin: {
          email: "admin@softstore.com",
          password: "admin123"
        }
      })
    }

    // Create admin user
    const hashedPassword = await hashPassword("admin123")
    const admin = await db.user.create({
      data: {
        name: "Admin",
        email: "admin@softstore.com",
        password: hashedPassword,
        role: "admin"
      }
    })

    // Create categories
    const categories = await Promise.all([
      db.category.create({
        data: {
          name: "Utility",
          slug: "utility",
          description: "Software utilitas untuk produktivitas",
          icon: "Wrench",
          color: "#3B82F6"
        }
      }),
      db.category.create({
        data: {
          name: "Multimedia",
          slug: "multimedia",
          description: "Software untuk mengolah audio dan video",
          icon: "Video",
          color: "#8B5CF6"
        }
      }),
      db.category.create({
        data: {
          name: "Security",
          slug: "security",
          description: "Software keamanan dan antivirus",
          icon: "Shield",
          color: "#10B981"
        }
      }),
      db.category.create({
        data: {
          name: "Developer Tools",
          slug: "developer-tools",
          description: "Tools untuk pengembang software",
          icon: "Code",
          color: "#F59E0B"
        }
      }),
      db.category.create({
        data: {
          name: "Office",
          slug: "office",
          description: "Aplikasi perkantoran dan produktivitas",
          icon: "FileText",
          color: "#EF4444"
        }
      }),
      db.category.create({
        data: {
          name: "Games",
          slug: "games",
          description: "Game dan hiburan",
          icon: "Gamepad2",
          color: "#EC4899"
        }
      })
    ])

    // Create sample software
    const softwareData = [
      {
        name: "VS Code",
        description: "Code editor ringan dan powerful dari Microsoft",
        longDescription: "Visual Studio Code adalah editor kode sumber yang dikembangkan oleh Microsoft untuk Windows, Linux, dan macOS. Fitur-fitur termasuk debugging, kontrol Git terintegrasi, penyelesaian kode cerdas, snippet, dan refactoring kode.",
        version: "1.85.0",
        fileSize: "95 MB",
        osSupport: "Windows 10/11, macOS 10.15+, Linux",
        developer: "Microsoft",
        categoryId: categories[3].id,
        featured: true,
        downloadCount: 15420
      },
      {
        name: "VLC Media Player",
        description: "Pemutar media gratis yang mendukung hampir semua format",
        longDescription: "VLC adalah pemutar media gratis dan open-source yang mendukung berbagai format audio dan video. Dapat memutar file, cakram, webcam, dan streaming.",
        version: "3.0.20",
        fileSize: "45 MB",
        osSupport: "Windows 7/8/10/11, macOS, Linux",
        developer: "VideoLAN",
        categoryId: categories[1].id,
        featured: true,
        downloadCount: 23890
      },
      {
        name: "7-Zip",
        description: "Software kompresi file gratis dengan format 7z",
        longDescription: "7-Zip adalah software arsip gratis dan open-source dengan rasio kompresi tinggi. Mendukung format 7z, ZIP, RAR, GZIP, dan lainnya.",
        version: "23.01",
        fileSize: "1.5 MB",
        osSupport: "Windows 7/8/10/11, Linux",
        developer: "Igor Pavlov",
        categoryId: categories[0].id,
        featured: true,
        downloadCount: 31250
      },
      {
        name: "Avast Free Antivirus",
        description: "Antivirus gratis dengan proteksi real-time",
        longDescription: "Avast Free Antivirus menawarkan proteksi real-time terhadap virus, malware, dan ancaman online lainnya. Dilengkapi dengan fitur Wi-Fi inspector dan password manager.",
        version: "24.1",
        fileSize: "250 MB",
        osSupport: "Windows 10/11, macOS",
        developer: "Avast Software",
        categoryId: categories[2].id,
        downloadCount: 18950
      },
      {
        name: "LibreOffice",
        description: "Suite office gratis alternatif Microsoft Office",
        longDescription: "LibreOffice adalah suite office gratis dan open-source yang kompatibel dengan format Microsoft Office. Termasuk Writer, Calc, Impress, dan lainnya.",
        version: "7.6.4",
        fileSize: "350 MB",
        osSupport: "Windows 7/8/10/11, macOS, Linux",
        developer: "The Document Foundation",
        categoryId: categories[4].id,
        downloadCount: 12780
      },
      {
        name: "GIMP",
        description: "Editor gambar gratis alternatif Photoshop",
        longDescription: "GIMP adalah editor grafis raster gratis dan open-source. Digunakan untuk retouching foto, editing gambar, dan desain grafis.",
        version: "2.10.36",
        fileSize: "300 MB",
        osSupport: "Windows 7/8/10/11, macOS, Linux",
        developer: "GIMP Team",
        categoryId: categories[1].id,
        downloadCount: 9870
      },
      {
        name: "Node.js",
        description: "Runtime JavaScript untuk pengembangan backend",
        longDescription: "Node.js adalah runtime JavaScript open-source yang mengeksekusi kode JavaScript di luar browser. Ideal untuk membangun aplikasi jaringan yang skalabel.",
        version: "20.10.0",
        fileSize: "30 MB",
        osSupport: "Windows 10/11, macOS, Linux",
        developer: "OpenJS Foundation",
        categoryId: categories[3].id,
        downloadCount: 28450
      },
      {
        name: "Audacity",
        description: "Editor audio gratis untuk rekaman dan editing",
        longDescription: "Audacity adalah software editor audio gratis dan open-source. Digunakan untuk merekam, mengedit, dan memanipulasi file audio.",
        version: "3.4.2",
        fileSize: "35 MB",
        osSupport: "Windows 7/8/10/11, macOS, Linux",
        developer: "Audacity Team",
        categoryId: categories[1].id,
        downloadCount: 8650
      }
    ]

    for (const sw of softwareData) {
      const slug = sw.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
      await db.software.create({
        data: {
          ...sw,
          slug
        }
      })
    }

    // Create sample article
    await db.article.create({
      data: {
        title: "Tips Memilih Software Antivirus yang Tepat",
        slug: "tips-memilih-software-antivirus",
        content: `
# Tips Memilih Software Antivirus yang Tepat

Memilih software antivirus yang tepat sangat penting untuk melindungi komputer Anda dari ancaman malware, virus, dan serangan cyber lainnya. Berikut adalah tips untuk memilih antivirus yang sesuai dengan kebutuhan Anda:

## 1. Pertimbangkan Kebutuhan Anda
Apakah Anda pengguna rumahan, bisnis kecil, atau enterprise? Setiap kategori memiliki kebutuhan yang berbeda.

## 2. Perhatikan Fitur Proteksi
Pilih antivirus yang menawarkan:
- Proteksi real-time
- Scanning otomatis
- Firewall terintegrasi
- Proteksi phishing

## 3. Periksa Dampak Performa
Pastikan antivirus tidak membebani sistem Anda. Baca review tentang penggunaan RAM dan CPU.

## 4. Pertimbangkan Harga
Ada banyak pilihan gratis yang cukup baik untuk pengguna rumahan. Untuk bisnis, pertimbangkan versi premium dengan fitur lebih lengkap.

## Kesimpulan
Pilihlah antivirus yang sesuai dengan kebutuhan dan budget Anda. Yang terpenting adalah selalu update database virus dan menjalankan scanning secara rutin.
        `,
        excerpt: "Panduan lengkap memilih software antivirus yang tepat untuk kebutuhan Anda",
        authorId: admin.id,
        published: true
      }
    })

    return NextResponse.json({
      success: true,
      message: "Database berhasil di-seed!",
      data: {
        admin: {
          email: "admin@softstore.com",
          password: "admin123"
        },
        categoriesCreated: categories.length,
        softwareCreated: softwareData.length
      }
    })
  } catch (error) {
    console.error("Seed error:", error)
    return NextResponse.json(
      { 
        success: false,
        error: "Gagal melakukan seed database",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
