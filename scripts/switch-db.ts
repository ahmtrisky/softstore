#!/usr/bin/env bun

/**
 * Script untuk mengubah schema.prisma berdasarkan environment
 *
 * Penggunaan:
 * bun run scripts/switch-db.ts sqlite   # Untuk development lokal
 * bun run scripts/switch-db.ts postgres # Untuk production
 */

import { writeFileSync } from 'fs'
import { resolve } from 'path'

const schemaPath = resolve(process.cwd(), 'prisma/schema.prisma')

const sqliteSchema = `// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

// User model for authentication and role management
model User {
  id           String     @id @default(cuid())
  name         String
  email        String     @unique
  password     String
  role         String     @default("user")
  avatar       String?
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt

  comments     Comment[]
  articles     Article[]

  @@index([email])
  @@index([role])
}

model Category {
  id          String     @id @default(cuid())
  name        String
  slug        String     @unique
  description String?
  icon        String?
  color       String?
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  software    Software[]

  @@index([slug])
}

model Software {
  id             String     @id @default(cuid())
  name           String
  slug           String     @unique
  description    String
  longDescription String?
  version        String
  fileSize       String
  osSupport      String
  developer      String
  thumbnail      String?
  screenshots    String?
  filePath       String?
  downloadCount  Int        @default(0)
  rating         Float      @default(0)
  ratingCount    Int        @default(0)
  isActive       Boolean    @default(true)
  featured       Boolean    @default(false)
  categoryId     String?
  createdAt      DateTime   @default(now())
  updatedAt      DateTime   @updatedAt

  category       Category?  @relation(fields: [categoryId], references: [id], onDelete: SetNull)
  comments       Comment[]

  @@index([slug])
  @@index([categoryId])
  @@index([featured])
  @@index([isActive])
}

model Comment {
  id          String     @id @default(cuid())
  userId      String
  softwareId  String
  comment     String
  rating      Int
  isActive    Boolean    @default(true)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  user        User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  software    Software   @relation(fields: [softwareId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([softwareId])
}

model Article {
  id          String     @id @default(cuid())
  title       String
  slug        String     @unique
  content     String
  excerpt     String?
  thumbnail   String?
  authorId    String
  published   Boolean    @default(false)
  viewCount   Int        @default(0)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  author      User       @relation(fields: [authorId], references: [id], onDelete: Cascade)

  @@index([slug])
  @@index([published])
  @@index([authorId])
}

model Setting {
  id        String   @id @default(cuid())
  key       String   @unique
  value     String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([key])
}
`

const postgresSchema = `// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// User model for authentication and role management
model User {
  id           String     @id @default(cuid())
  name         String
  email        String     @unique
  password     String
  role         String     @default("user")
  avatar       String?
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt

  comments     Comment[]
  articles     Article[]

  @@index([email])
  @@index([role])
}

model Category {
  id          String     @id @default(cuid())
  name        String
  slug        String     @unique
  description String?
  icon        String?
  color       String?
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  software    Software[]

  @@index([slug])
}

model Software {
  id             String     @id @default(cuid())
  name           String
  slug           String     @unique
  description    String
  longDescription String?
  version        String
  fileSize       String
  osSupport      String
  developer      String
  thumbnail      String?
  screenshots    String?
  filePath       String?
  downloadCount  Int        @default(0)
  rating         Float      @default(0)
  ratingCount    Int        @default(0)
  isActive       Boolean    @default(true)
  featured       Boolean    @default(false)
  categoryId     String?
  createdAt      DateTime   @default(now())
  updatedAt      DateTime   @updatedAt

  category       Category?  @relation(fields: [categoryId], references: [id], onDelete: SetNull)
  comments       Comment[]

  @@index([slug])
  @@index([categoryId])
  @@index([featured])
  @@index([isActive])
}

model Comment {
  id          String     @id @default(cuid())
  userId      String
  softwareId  String
  comment     String
  rating      Int
  isActive    Boolean    @default(true)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  user        User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  software    Software   @relation(fields: [softwareId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([softwareId])
}

model Article {
  id          String     @id @default(cuid())
  title       String
  slug        String     @unique
  content     String
  excerpt     String?
  thumbnail   String?
  authorId    String
  published   Boolean    @default(false)
  viewCount   Int        @default(0)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  author      User       @relation(fields: [authorId], references: [id], onDelete: Cascade)

  @@index([slug])
  @@index([published])
  @@index([authorId])
}

model Setting {
  id        String   @id @default(cuid())
  key       String   @unique
  value     String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([key])
}
`

const dbType = process.argv[2]

if (!dbType || !['sqlite', 'postgres'].includes(dbType)) {
  console.log('Usage: bun run scripts/switch-db.ts [sqlite|postgres]')
  process.exit(1)
}

const schema = dbType === 'sqlite' ? sqliteSchema : postgresSchema

writeFileSync(schemaPath, schema)

console.log(`✅ Schema switched to ${dbType}`)
console.log(`📝 Run 'bun run db:push' to apply changes`)
