# 📚 PANDUAN DEPLOYMENT SOFTSTORE

## 📋 DAFTAR ISI
1. [Persiapan Awal](#1-persiapan-awal)
2. [Deploy ke Railway (Recommended)](#2-deploy-ke-railway)
3. [Deploy ke Vercel + Database External](#3-deploy-ke-vercel)
4. [Setup Database](#4-setup-database)
5. [Troubleshooting](#5-troubleshooting)

---

## 1. PERSIAPAN AWAL

### 1.1 Yang Diperlukan
- ✅ Akun GitHub (gratis)
- ✅ Akun Railway (gratis untuk start) atau Vercel
- ✅ Kode project SoftStore

### 1.2 Upload ke GitHub

**Langkah 1: Buat Repository Baru di GitHub**
1. Buka https://github.com/new
2. Nama repository: `softstore` (atau nama lain)
3. Pilih **Public** atau **Private**
4. **JANGAN** centang "Add a README file"
5. Klik **Create repository**

**Langkah 2: Push Kode ke GitHub**
```bash
# Di folder project, jalankan:

# Inisialisasi git (jika belum)
git init

# Tambahkan semua file
git add .

# Commit pertama
git commit -m "Initial commit - SoftStore website"

# Hubungkan ke GitHub (ganti USERNAME dengan username GitHub kamu)
git remote add origin https://github.com/USERNAME/softstore.git

# Push ke GitHub
git branch -M main
git push -u origin main
```

---

## 2. DEPLOY KE RAILWAY (RECOMMENDED)

Railway adalah platform paling mudah untuk deploy Next.js + Database.

### 2.1 Buat Akun Railway
1. Buka https://railway.app
2. Klik **Start a New Project**
3. Login dengan GitHub

### 2.2 Deploy Project

**Langkah 1: Buat Project Baru**
1. Di Dashboard Railway, klik **New Project**
2. Pilih **Deploy from GitHub repo**
3. Pilih repository `softstore`
4. Klik **Deploy Now**

**Langkah 2: Tambah Database PostgreSQL**
1. Di project Railway, klik **+ Add Service**
2. Pilih **Database** → **PostgreSQL**
3. Database akan otomatis dibuat

**Langkah 3: Hubungkan Database ke App**
1. Klik service **softstore** (web app)
2. Pilih tab **Variables**
3. Klik **Add Variable**
4. Pilih **PostgreSQL** → **DATABASE_URL** (reference)
5. Klik **Add**

**Langkah 4: Tambah Environment Variables**
Di tab **Variables**, tambahkan variabel berikut:

| Variable | Value | Keterangan |
|----------|-------|------------|
| `DATABASE_URL` | (dari PostgreSQL) | Otomatis dari step sebelumnya |
| `NEXTAUTH_SECRET` | (generate) | Lihat cara generate di bawah |
| `NEXTAUTH_URL` | `https://nama-app.railway.app` | URL website kamu |

**Generate NEXTAUTH_SECRET:**
```bash
# Di terminal lokal, jalankan:
openssl rand -base64 32

# Copy hasilnya dan paste ke NEXTAUTH_SECRET
```

**Langkah 5: Deploy!**
1. Railway akan otomatis redeploy setelah menambah variables
2. Tunggu proses build selesai (±2-5 menit)
3. Klik **Settings** → **Generate Domain** untuk mendapat URL public

### 2.3 Seed Database (PENTING!)

Setelah deploy berhasil, perlu mengisi data awal:

**Cara 1: Via Railway CLI**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Connect ke project
railway link

# Jalankan seed
railway run bun run db:seed
```

**Cara 2: Via Railway Dashboard**
1. Buka project di Railway
2. Klik service **PostgreSQL**
3. Klik tab **Query**
4. Jalankan SQL insert manual (tidak recommended)

**Cara 3: Buat API Endpoint Seed (Paling Mudah)**
Tambahkan di project: `/api/admin/seed` dengan kode untuk seed database, lalu akses URL tersebut.

---

## 3. DEPLOY KE VERCEL

Vercel adalah platform resmi Next.js, tapi perlu database external.

### 3.1 Siapkan Database External

**Opsi A: Neon (PostgreSQL Gratis)**
1. Buka https://neon.tech
2. Sign up dengan GitHub
3. Buat project baru
4. Copy connection string

**Opsi B: Supabase (PostgreSQL Gratis)**
1. Buka https://supabase.com
2. Buat project baru
3. Settings → Database → Copy connection string

**Opsi C: PlanetScale (MySQL Gratis)**
1. Buka https://planetscale.com
2. Buat database
3. Copy connection string

### 3.2 Deploy ke Vercel

**Langkah 1: Import Project**
1. Buka https://vercel.com
2. Klik **Add New** → **Project**
3. Import dari GitHub → Pilih `softstore`
4. Klik **Import**

**Langkah 2: Configure Environment**
Di bagian **Environment Variables**, tambahkan:

| Name | Value |
|------|-------|
| `DATABASE_URL` | (connection string dari Neon/Supabase) |
| `NEXTAUTH_SECRET` | (generate dengan openssl rand -base64 32) |
| `NEXTAUTH_URL` | `https://nama-project.vercel.app` |

**Langkah 3: Deploy**
1. Klik **Deploy**
2. Tunggu proses selesai
3. Buka URL yang diberikan

### 3.3 Seed Database di Vercel

```bash
# Di lokal, dengan DATABASE_URL production:
DATABASE_URL="postgresql://..." bun run db:seed
```

---

## 4. SETUP DATABASE

### 4.1 Schema Database

Database akan otomatis dibuat saat pertama kali deploy dengan Prisma.

### 4.2 Data Default

Setelah seed, akan tersedia:
- **Admin User**: admin@softstore.com / admin123
- **Kategori**: Utilities, Multimedia, Productivity, dll
- **Software Sample**: Beberapa software contoh

### 4.3 Ganti Password Admin

**PENTING:** Setelah deploy, ganti password admin segera!

1. Login dengan admin@softstore.com / admin123
2. Buka menu Admin → Users
3. Edit password admin

---

## 5. TROUBLESHOOTING

### Error: "Database connection failed"
- Periksa `DATABASE_URL` sudah benar
- Pastikan database sudah dibuat
- Cek firewall/whitelist IP

### Error: "Prisma Client could not be generated"
- Tambahkan `postinstall` script di package.json:
```json
"postinstall": "prisma generate"
```

### Error: "NEXTAUTH_SECRET is required"
- Generate secret: `openssl rand -base64 32`
- Tambahkan ke environment variables

### Error: "Build failed"
- Cek log di dashboard Railway/Vercel
- Pastikan semua dependencies terinstall

### Website blank/white screen
- Buka browser console (F12)
- Cek error di console
- Pastikan `DATABASE_URL` sudah benar

### Login tidak berfungsi
- Pastikan `NEXTAUTH_URL` sesuai dengan domain
- Cek `NEXTAUTH_SECRET` sudah diset
- Clear browser cookies

---

## 📞 BUTUH BANTUAN?

Jika mengalami masalah:
1. Cek log di dashboard Railway/Vercel
2. Buka browser console untuk lihat error
3. Pastikan semua environment variables sudah benar

---

## ✅ CHECKLIST SEBELUM DEPLOY

- [ ] Kode sudah di-push ke GitHub
- [ ] `DATABASE_URL` sudah diset
- [ ] `NEXTAUTH_SECRET` sudah diset
- [ ] `NEXTAUTH_URL` sudah diset dengan domain yang benar
- [ ] Database seed sudah dijalankan
- [ ] Password admin sudah diganti

---

## 🎉 SELESAI!

Setelah semua langkah selesai, website kamu sudah live!

**URL Admin:** `https://domain-kamu.com`
**Login Admin:** `admin@softstore.com` / `admin123`

Jangan lupa ganti password admin setelah login pertama!
