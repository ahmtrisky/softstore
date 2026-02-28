# 🚀 SoftStore - Platform Download Software

Website download software modern dengan tampilan seperti toko online/marketplace.

## ✨ Fitur

### Frontend (User)
- 🏠 Hero banner dengan search bar
- 📦 Grid software seperti etalase marketplace
- 🗂️ Kategori dengan filter
- ⭐ Sistem rating dan komentar
- 📝 Artikel/Blog
- 📱 Responsif (mobile-friendly)

### Admin Panel
- 📊 Dashboard statistik
- 📦 Kelola Software (CRUD)
- 🗂️ Kelola Kategori
- 📝 Kelola Artikel
- 👥 Kelola User
- 💬 Kelola Komentar

### Keamanan
- 🔐 Authentication dengan NextAuth.js
- 🔒 Password hashing
- 🛡️ Proteksi role-based access

## 🛠️ Tech Stack

- **Framework**: Next.js 16 + TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **UI**: Tailwind CSS + shadcn/ui
- **Auth**: NextAuth.js

## 📋 Prasyarat

- Node.js 18+
- Git
- PostgreSQL (untuk production)

## 🚀 Instalasi Lokal

```bash
# Clone repository
git clone https://github.com/USERNAME/softstore.git
cd softstore

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env dengan database PostgreSQL Anda

# Setup database
npm run db:push

# Jalankan development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## 🔐 Login Admin

Setelah seed data (klik "Seed Demo Data" di admin panel):
- Email: `admin@softstore.com`
- Password: `admin123`

---

## 🚂 Deploy ke Railway (RECOMMENDED)

Railway menyediakan hosting gratis dengan database PostgreSQL!

### Langkah 1: Siapkan GitHub

```bash
# Inisialisasi Git
git init
git add .
git commit -m "Initial commit"

# Push ke GitHub (ganti USERNAME)
git remote add origin https://github.com/USERNAME/softstore.git
git branch -M main
git push -u origin main
```

### Langkah 2: Buat Akun Railway

1. Buka **[railway.app](https://railway.app)**
2. Login dengan GitHub

### Langkah 3: Deploy Project

1. Klik **"+ New Project"**
2. Pilih **"Deploy from GitHub repo"**
3. Pilih repository `softstore`
4. Klik **"Deploy Now"**

### Langkah 4: Tambah PostgreSQL Database

1. Di project Railway, klik **"+ New"**
2. Pilih **"Database"** → **"Add PostgreSQL"**
3. Railway akan otomatis membuat database

### Langkah 5: Hubungkan Database ke App

1. Buka variabel PostgreSQL (klik database → Variables)
2. Copy `DATABASE_URL` dan `DIRECT_URL`
3. Buka web app → Variables
4. Tambahkan:
   ```
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   DIRECT_DATABASE_URL=${{Postgres.DIRECT_URL}}
   NEXTAUTH_SECRET=your-super-secret-key-min-32-characters
   NEXTAUTH_URL=https://your-app.up.railway.app
   ```
5. Klik **"Apply"** untuk redeploy

### Langkah 6: Generate Domain

1. Buka web app → Settings
2. Klik **"Generate Domain"**
3. Website akan live di `https://your-app.up.railway.app`

---

## 📁 Struktur Folder

```
softstore/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── migrations/        # Database migrations
├── public/
│   └── uploads/           # File uploads
├── src/
│   ├── app/
│   │   ├── api/           # API routes
│   │   ├── globals.css    # Global styles
│   │   ├── layout.tsx     # Root layout
│   │   └── page.tsx       # Main page
│   ├── components/ui/     # UI components
│   ├── lib/
│   │   ├── auth.ts        # NextAuth config
│   │   ├── config.ts      # Site configuration
│   │   └── db.ts          # Database client
│   └── types/             # TypeScript types
├── railway.toml           # Railway config
├── nixpacks.toml          # Build config
├── .env.example           # Environment template
└── package.json
```

## ⚙️ Konfigurasi

Edit `src/lib/config.ts` untuk mengubah:
- Nama website
- Tagline
- Deskripsi
- Email admin
- Warna tema

## 🌐 Alternatif Hosting

| Platform | Database | Kelebihan |
|----------|----------|-----------|
| **Railway** | ✅ PostgreSQL | Termasuk DB, gratis $5/bulan |
| **Vercel** | ❌ Perlu eksternal | Paling mudah untuk Next.js |
| **Render** | ✅ PostgreSQL | Gratis, support backend |
| **Fly.io** | ✅ PostgreSQL | Gratis, global CDN |

## 🔧 Troubleshooting

### Error: Database connection failed
- Pastikan `DATABASE_URL` benar
- Railway: Gunakan `${{Postgres.DATABASE_URL}}`

### Error: Prisma Client not found
```bash
npm run db:generate
```

### Error: Migration failed
```bash
npx prisma migrate reset
```

## 📄 License

MIT License
