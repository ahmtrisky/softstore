import { PrismaClient } from '@prisma/client'
import { createHash } from 'crypto'

const prisma = new PrismaClient()

// Simple password hashing using Node.js crypto
function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex')
}

async function main() {
  console.log('🌱 Starting seed...')

  // Check if already seeded
  const existingAdmin = await prisma.user.findFirst({
    where: { role: 'admin' }
  })

  if (existingAdmin) {
    console.log('✅ Database already seeded!')
    console.log('Admin login: admin@softstore.com / admin123')
    return
  }

  // Create admin user
  const hashedPassword = hashPassword('admin123')
  const admin = await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@softstore.com',
      password: hashedPassword,
      role: 'admin'
    }
  })
  console.log('✅ Admin user created')

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Utility',
        slug: 'utility',
        description: 'Software utilitas untuk produktivitas',
        icon: 'Wrench',
        color: '#3B82F6'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Multimedia',
        slug: 'multimedia',
        description: 'Software untuk mengolah audio dan video',
        icon: 'Video',
        color: '#8B5CF6'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Security',
        slug: 'security',
        description: 'Software keamanan dan antivirus',
        icon: 'Shield',
        color: '#10B981'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Developer Tools',
        slug: 'developer-tools',
        description: 'Tools untuk pengembang software',
        icon: 'Code',
        color: '#F59E0B'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Office',
        slug: 'office',
        description: 'Aplikasi perkantoran dan produktivitas',
        icon: 'FileText',
        color: '#EF4444'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Games',
        slug: 'games',
        description: 'Game dan hiburan',
        icon: 'Gamepad2',
        color: '#EC4899'
      }
    })
  ])
  console.log('✅ Categories created:', categories.length)

  // Create sample software
  const softwareData = [
    {
      name: 'VS Code',
      slug: 'vs-code',
      description: 'Code editor ringan dan powerful dari Microsoft',
      longDescription: 'Visual Studio Code adalah editor kode sumber yang dikembangkan oleh Microsoft untuk Windows, Linux, dan macOS.',
      version: '1.85.0',
      fileSize: '95 MB',
      osSupport: 'Windows 10/11, macOS 10.15+, Linux',
      developer: 'Microsoft',
      categoryId: categories[3].id,
      featured: true,
      downloadCount: 15420
    },
    {
      name: 'VLC Media Player',
      slug: 'vlc-media-player',
      description: 'Pemutar media gratis yang mendukung hampir semua format',
      longDescription: 'VLC adalah pemutar media gratis dan open-source yang mendukung berbagai format audio dan video.',
      version: '3.0.20',
      fileSize: '45 MB',
      osSupport: 'Windows 7/8/10/11, macOS, Linux',
      developer: 'VideoLAN',
      categoryId: categories[1].id,
      featured: true,
      downloadCount: 23890
    },
    {
      name: '7-Zip',
      slug: '7-zip',
      description: 'Software kompresi file gratis dengan format 7z',
      longDescription: '7-Zip adalah software arsip gratis dan open-source dengan rasio kompresi tinggi.',
      version: '23.01',
      fileSize: '1.5 MB',
      osSupport: 'Windows 7/8/10/11, Linux',
      developer: 'Igor Pavlov',
      categoryId: categories[0].id,
      featured: true,
      downloadCount: 31250
    },
    {
      name: 'Avast Free Antivirus',
      slug: 'avast-free-antivirus',
      description: 'Antivirus gratis dengan proteksi real-time',
      longDescription: 'Avast Free Antivirus menawarkan proteksi real-time terhadap virus dan malware.',
      version: '24.1',
      fileSize: '250 MB',
      osSupport: 'Windows 10/11, macOS',
      developer: 'Avast Software',
      categoryId: categories[2].id,
      downloadCount: 18950
    },
    {
      name: 'LibreOffice',
      slug: 'libreoffice',
      description: 'Suite office gratis alternatif Microsoft Office',
      longDescription: 'LibreOffice adalah suite office gratis dan open-source yang kompatibel dengan format Microsoft Office.',
      version: '7.6.4',
      fileSize: '350 MB',
      osSupport: 'Windows 7/8/10/11, macOS, Linux',
      developer: 'The Document Foundation',
      categoryId: categories[4].id,
      downloadCount: 12780
    },
    {
      name: 'GIMP',
      slug: 'gimp',
      description: 'Editor gambar gratis alternatif Photoshop',
      longDescription: 'GIMP adalah editor grafis raster gratis dan open-source.',
      version: '2.10.36',
      fileSize: '300 MB',
      osSupport: 'Windows 7/8/10/11, macOS, Linux',
      developer: 'GIMP Team',
      categoryId: categories[1].id,
      downloadCount: 9870
    },
    {
      name: 'Node.js',
      slug: 'nodejs',
      description: 'Runtime JavaScript untuk pengembangan backend',
      longDescription: 'Node.js adalah runtime JavaScript open-source yang mengeksekusi kode JavaScript di luar browser.',
      version: '20.10.0',
      fileSize: '30 MB',
      osSupport: 'Windows 10/11, macOS, Linux',
      developer: 'OpenJS Foundation',
      categoryId: categories[3].id,
      downloadCount: 28450
    },
    {
      name: 'Audacity',
      slug: 'audacity',
      description: 'Editor audio gratis untuk rekaman dan editing',
      longDescription: 'Audacity adalah software editor audio gratis dan open-source.',
      version: '3.4.2',
      fileSize: '35 MB',
      osSupport: 'Windows 7/8/10/11, macOS, Linux',
      developer: 'Audacity Team',
      categoryId: categories[1].id,
      downloadCount: 8650
    }
  ]

  for (const sw of softwareData) {
    await prisma.software.create({ data: sw })
  }
  console.log('✅ Software created:', softwareData.length)

  // Create sample article
  await prisma.article.create({
    data: {
      title: 'Tips Memilih Software Antivirus yang Tepat',
      slug: 'tips-memilih-software-antivirus',
      content: `# Tips Memilih Software Antivirus yang Tepat

Memilih software antivirus yang tepat sangat penting untuk melindungi komputer Anda.

## 1. Pertimbangkan Kebutuhan Anda
Apakah Anda pengguna rumahan, bisnis kecil, atau enterprise?

## 2. Perhatikan Fitur Proteksi
Pilih antivirus yang menawarkan:
- Proteksi real-time
- Scanning otomatis
- Firewall terintegrasi
- Proteksi phishing

## 3. Periksa Dampak Performa
Pastikan antivirus tidak membebani sistem Anda.

## Kesimpulan
Pilihlah antivirus yang sesuai dengan kebutuhan dan budget Anda.`,
      excerpt: 'Panduan lengkap memilih software antivirus yang tepat',
      authorId: admin.id,
      published: true
    }
  })
  console.log('✅ Article created')

  console.log('\n🎉 Seed completed successfully!')
  console.log('📧 Admin login: admin@softstore.com')
  console.log('🔑 Password: admin123')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
