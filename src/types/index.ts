export interface User {
  id: string
  name: string
  email: string
  role: string
  avatar?: string | null
  createdAt: string
  _count?: {
    comments: number
    articles: number
  }
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string | null
  icon?: string | null
  color?: string | null
  createdAt: string
  _count?: {
    software: number
  }
}

export interface Software {
  id: string
  name: string
  slug: string
  description: string
  longDescription?: string | null
  version: string
  fileSize: string
  osSupport: string
  developer: string
  thumbnail?: string | null
  screenshots?: string | null
  filePath?: string | null
  downloadCount: number
  rating: number
  ratingCount: number
  isActive: boolean
  featured: boolean
  categoryId?: string | null
  createdAt: string
  category?: Category | null
  comments?: Comment[]
  _count?: {
    comments: number
  }
}

export interface Comment {
  id: string
  userId: string
  softwareId: string
  comment: string
  rating: number
  isActive: boolean
  createdAt: string
  user?: {
    id: string
    name: string
    avatar?: string | null
  }
  software?: {
    id: string
    name: string
    slug: string
  }
}

export interface Article {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string | null
  thumbnail?: string | null
  authorId: string
  published: boolean
  viewCount: number
  createdAt: string
  author?: {
    id: string
    name: string
    avatar?: string | null
  }
}

export interface Stats {
  totalSoftware: number
  totalUsers: number
  totalDownloads: number
  totalCategories: number
  totalArticles: number
  totalComments: number
  recentSoftware: Software[]
  topDownloaded: Software[]
  recentComments: Comment[]
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}
