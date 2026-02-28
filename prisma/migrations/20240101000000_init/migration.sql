-- CreateEnum
CREATE TYPE public."Role" AS ENUM ('admin', 'user');

-- CreateTable
CREATE TABLE public."User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "avatar" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE public."Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE public."Software" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "longDescription" TEXT,
    "version" TEXT NOT NULL,
    "fileSize" TEXT NOT NULL,
    "osSupport" TEXT NOT NULL,
    "developer" TEXT NOT NULL,
    "thumbnail" TEXT,
    "screenshots" TEXT,
    "filePath" TEXT,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ratingCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "categoryId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Software_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE public."Comment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "softwareId" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE public."Article" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "thumbnail" TEXT,
    "authorId" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE public."Setting" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON public."User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON public."User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON public."User"("role");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON public."Category"("slug");

-- CreateIndex
CREATE INDEX "Category_slug_idx" ON public."Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Software_slug_key" ON public."Software"("slug");

-- CreateIndex
CREATE INDEX "Software_slug_idx" ON public."Software"("slug");

-- CreateIndex
CREATE INDEX "Software_categoryId_idx" ON public."Software"("categoryId");

-- CreateIndex
CREATE INDEX "Software_featured_idx" ON public."Software"("featured");

-- CreateIndex
CREATE INDEX "Software_isActive_idx" ON public."Software"("isActive");

-- CreateIndex
CREATE INDEX "Comment_userId_idx" ON public."Comment"("userId");

-- CreateIndex
CREATE INDEX "Comment_softwareId_idx" ON public."Comment"("softwareId");

-- CreateIndex
CREATE UNIQUE INDEX "Article_slug_key" ON public."Article"("slug");

-- CreateIndex
CREATE INDEX "Article_slug_idx" ON public."Article"("slug");

-- CreateIndex
CREATE INDEX "Article_published_idx" ON public."Article"("published");

-- CreateIndex
CREATE INDEX "Article_authorId_idx" ON public."Article"("authorId");

-- CreateIndex
CREATE UNIQUE INDEX "Setting_key_key" ON public."Setting"("key");

-- CreateIndex
CREATE INDEX "Setting_key_idx" ON public."Setting"("key");

-- AddForeignKey
ALTER TABLE public."Software" ADD CONSTRAINT "Software_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE public."Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE public."Comment" ADD CONSTRAINT "Comment_softwareId_fkey" FOREIGN KEY ("softwareId") REFERENCES public."Software"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE public."Article" ADD CONSTRAINT "Article_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
