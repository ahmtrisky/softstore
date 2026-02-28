"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { signIn, signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import StarRating from "@/components/ui/star-rating"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Search,
  Download,
  Star,
  Clock,
  HardDrive,
  Monitor,
  User,
  Shield,
  ChevronRight,
  Menu,
  X,
  Package,
  LayoutDashboard,
  FileText,
  MessageSquare,
  Users,
  FolderTree,
  Settings,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Loader2,
  Home,
  Article,
  BarChart3,
  Upload,
  Save,
  RefreshCw
} from "lucide-react"
import type { Software, Category, Comment, Article, User as UserType, Stats } from "@/types"
import { siteConfig } from "@/lib/config"

export default function SoftStoreApp() {
  // NextAuth session
  const { data: session, status, update } = useSession()
  const sessionLoading = status === "loading"
  
  // State management
  const [activeView, setActiveView] = useState<"home" | "detail" | "articles" | "article-detail" | "admin">("home")
  const [selectedSoftware, setSelectedSoftware] = useState<Software | null>(null)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  
  // Data state
  const [software, setSoftware] = useState<Software[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [users, setUsers] = useState<UserType[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  
  // UI state
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "register">("login")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [adminTab, setAdminTab] = useState("dashboard")
  
  // Form state
  const [authForm, setAuthForm] = useState({ email: "", password: "", name: "" })
  const [softwareForm, setSoftwareForm] = useState({
    name: "", description: "", longDescription: "", version: "",
    fileSize: "", osSupport: "", developer: "", thumbnail: "",
    filePath: "", categoryId: "", featured: false
  })
  const [categoryForm, setCategoryForm] = useState({ name: "", description: "", icon: "", color: "" })
  const [articleForm, setArticleForm] = useState({ title: "", content: "", excerpt: "", thumbnail: "", published: false })
  const [commentForm, setCommentForm] = useState({ comment: "", rating: 5 })
  
  // Edit state
  const [editingSoftware, setEditingSoftware] = useState<Software | null>(null)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const [editingUser, setEditingUser] = useState<UserType | null>(null)
  
  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<{ type: string; id: string } | null>(null)
  
  // Toast notification
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  // Toast helper
  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  // Fetch functions
  const fetchSoftware = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.append("search", searchQuery)
      if (selectedCategory) params.append("category", selectedCategory)
      params.append("limit", "50")
      
      const res = await fetch(`/api/software?${params}`)
      const data = await res.json()
      setSoftware(data.data || [])
    } catch {
      showToast("Gagal memuat data software", "error")
    }
  }, [searchQuery, selectedCategory])

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories")
      const data = await res.json()
      setCategories(data)
    } catch {
      showToast("Gagal memuat kategori", "error")
    }
  }

  const fetchArticles = async () => {
    try {
      const res = await fetch("/api/articles?published=true")
      const data = await res.json()
      setArticles(data.data || [])
    } catch {
      showToast("Gagal memuat artikel", "error")
    }
  }

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/stats")
      const data = await res.json()
      setStats(data)
    } catch {
      showToast("Gagal memuat statistik", "error")
    }
  }

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users")
      const data = await res.json()
      setUsers(data.data || [])
    } catch {
      showToast("Gagal memuat data user", "error")
    }
  }

  const fetchComments = async () => {
    try {
      const res = await fetch("/api/comments?limit=50")
      const data = await res.json()
      setComments(data.data || [])
    } catch {
      showToast("Gagal memuat komentar", "error")
    }
  }

  const checkSession = async () => {
    // Session is now handled by useSession hook
    // This function is kept for compatibility but does nothing
  }

  // Initial load
  useEffect(() => {
    const init = async () => {
      setIsLoading(true)
      await Promise.all([fetchCategories(), fetchSoftware(), fetchArticles()])
      setIsLoading(false)
    }
    init()
  }, [fetchSoftware])

  // Admin data loading
  useEffect(() => {
    if (activeView === "admin" && session?.user?.role === "admin") {
      fetchStats()
      fetchUsers()
      fetchComments()
    }
  }, [activeView, session])

  // Auth handlers
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (authMode === "login") {
        // Direct login API call for debugging
        console.log("Attempting login with:", authForm.email)
        
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: authForm.email,
            password: authForm.password
          })
        })
        
        const data = await res.json()
        console.log("Login response:", data)
        
        if (res.ok && data.success) {
          // Now try NextAuth signIn
          const result = await signIn("credentials", {
            email: authForm.email,
            password: authForm.password,
            redirect: false,
          })
          
          setAuthModalOpen(false)
          showToast("Login berhasil!")
          await update()
        } else {
          showToast(data.error || "Email atau password salah", "error")
        }
      } else {
        // Register
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(authForm)
        })
        const data = await res.json()
        if (res.ok) {
          setAuthMode("login")
          showToast("Registrasi berhasil! Silakan login.")
        } else {
          showToast(data.error || "Registrasi gagal", "error")
        }
      }
    } catch (error) {
      console.error("Auth error:", error)
      showToast("Terjadi kesalahan", "error")
    }
  }

  const handleLogout = async () => {
    await signOut({ redirect: false })
    setActiveView("home")
    showToast("Logout berhasil")
  }

  // Software handlers
  const handleSaveSoftware = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingSoftware ? `/api/software/${editingSoftware.id}` : "/api/software"
      const method = editingSoftware ? "PUT" : "POST"
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(softwareForm)
      })
      
      if (res.ok) {
        showToast(editingSoftware ? "Software berhasil diupdate" : "Software berhasil ditambahkan")
        setSoftwareForm({ name: "", description: "", longDescription: "", version: "", fileSize: "", osSupport: "", developer: "", thumbnail: "", filePath: "", categoryId: "", featured: false })
        setEditingSoftware(null)
        fetchSoftware()
        fetchStats()
      } else {
        showToast("Gagal menyimpan software", "error")
      }
    } catch {
      showToast("Terjadi kesalahan", "error")
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    
    try {
      const res = await fetch(`/api/${deleteTarget.type}/${deleteTarget.id}`, {
        method: "DELETE"
      })
      
      if (res.ok) {
        showToast("Data berhasil dihapus")
        
        if (deleteTarget.type === "software") fetchSoftware()
        else if (deleteTarget.type === "categories") fetchCategories()
        else if (deleteTarget.type === "articles") fetchArticles()
        else if (deleteTarget.type === "users") fetchUsers()
        else if (deleteTarget.type === "comments") fetchComments()
        
        fetchStats()
      } else {
        showToast("Gagal menghapus data", "error")
      }
    } catch {
      showToast("Terjadi kesalahan", "error")
    }
    
    setDeleteTarget(null)
  }

  // Category handlers
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingCategory ? `/api/categories/${editingCategory.id}` : "/api/categories"
      const method = editingCategory ? "PUT" : "POST"
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryForm)
      })
      
      if (res.ok) {
        showToast(editingCategory ? "Kategori berhasil diupdate" : "Kategori berhasil ditambahkan")
        setCategoryForm({ name: "", description: "", icon: "", color: "" })
        setEditingCategory(null)
        fetchCategories()
      } else {
        showToast("Gagal menyimpan kategori", "error")
      }
    } catch {
      showToast("Terjadi kesalahan", "error")
    }
  }

  // Article handlers
  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user?.id) return
    
    try {
      const url = editingArticle ? `/api/articles/${editingArticle.id}` : "/api/articles"
      const method = editingArticle ? "PUT" : "POST"
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...articleForm,
          authorId: session.user.id
        })
      })
      
      if (res.ok) {
        showToast(editingArticle ? "Artikel berhasil diupdate" : "Artikel berhasil ditambahkan")
        setArticleForm({ title: "", content: "", excerpt: "", thumbnail: "", published: false })
        setEditingArticle(null)
        fetchArticles()
        fetchStats()
      } else {
        showToast("Gagal menyimpan artikel", "error")
      }
    } catch {
      showToast("Terjadi kesalahan", "error")
    }
  }

  // Comment handler
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user?.id || !selectedSoftware) return
    
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...commentForm,
          userId: session.user.id,
          softwareId: selectedSoftware.id
        })
      })
      
      if (res.ok) {
        showToast("Komentar berhasil dikirim")
        setCommentForm({ comment: "", rating: 5 })
        // Refresh software data
        const swRes = await fetch(`/api/software/${selectedSoftware.id}`)
        const swData = await swRes.json()
        setSelectedSoftware(swData)
      } else {
        showToast("Gagal mengirim komentar", "error")
      }
    } catch {
      showToast("Terjadi kesalahan", "error")
    }
  }

  // Download handler
  const handleDownload = async (sw: Software) => {
    try {
      const res = await fetch(`/api/software/download/${sw.id}`, { method: "POST" })
      const data = await res.json()
      
      if (data.filePath) {
        window.open(data.filePath, "_blank")
        showToast("Download dimulai!")
        fetchSoftware()
        fetchStats()
      } else {
        showToast("File tidak tersedia", "error")
      }
    } catch {
      showToast("Gagal memulai download", "error")
    }
  }

  // Seed database
  const handleSeed = async () => {
    try {
      const res = await fetch("/api/seed", { method: "POST" })
      const data = await res.json()
      if (res.ok) {
        showToast("Database berhasil di-seed!")
        fetchCategories()
        fetchSoftware()
        fetchArticles()
        fetchStats()
      } else {
        showToast(data.message || "Gagal melakukan seed", "error")
      }
    } catch {
      showToast("Terjadi kesalahan", "error")
    }
  }

  // Format number
  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
    if (num >= 1000) return (num / 1000).toFixed(1) + "K"
    return num.toString()
  }

  // Category icon mapping
  const getCategoryIcon = (iconName?: string | null) => {
    const icons: Record<string, React.ReactNode> = {
      Wrench: <Package className="w-5 h-5" />,
      Video: <Monitor className="w-5 h-5" />,
      Shield: <Shield className="w-5 h-5" />,
      Code: <Settings className="w-5 h-5" />,
      FileText: <FileText className="w-5 h-5" />,
      Gamepad2: <Package className="w-5 h-5" />,
    }
    return icons[iconName || ""] || <Package className="w-5 h-5" />
  }

  // ===================== RENDER COMPONENTS =====================

  // Header Component
  const Header = () => (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => { setActiveView("home"); setSelectedCategory(""); }}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
              <Download className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl hidden sm:block">{siteConfig.name}</span>
          </div>
        </div>

        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari software..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-gray-50 border-gray-200"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session.user.avatar || ""} />
                    <AvatarFallback>{session.user.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:block">{session.user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {session.user.role === "admin" && (
                  <DropdownMenuItem onClick={() => setActiveView("admin")}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Admin Panel
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => setAuthModalOpen(true)}>
              <User className="mr-2 h-4 w-4" />
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  )

  // Hero Section
  const HeroSection = () => (
    <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-16 md:py-24">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          Download Software & File Terpercaya
        </h1>
        <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          dengan Cepat dan Aman
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
            <Shield className="w-5 h-5" />
            <span>100% Aman</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
            <Download className="w-5 h-5" />
            <span>Download Cepat</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
            <CheckCircle className="w-5 h-5" />
            <span>Terscan Antivirus</span>
          </div>
        </div>
      </div>
    </section>
  )

  // Categories Section
  const CategoriesSection = () => (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-xl font-bold mb-4">Kategori</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          <Button
            variant={selectedCategory === "" ? "default" : "outline"}
            className="shrink-0"
            onClick={() => setSelectedCategory("")}
          >
            Semua
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? "default" : "outline"}
              className="shrink-0 gap-2"
              onClick={() => setSelectedCategory(cat.id)}
            >
              <span style={{ color: cat.color || undefined }}>{getCategoryIcon(cat.icon)}</span>
              {cat.name}
              <Badge variant="secondary" className="ml-1">
                {cat._count?.software || 0}
              </Badge>
            </Button>
          ))}
        </div>
      </div>
    </section>
  )

  // Software Card
  const SoftwareCard = ({ sw }: { sw: Software }) => (
    <Card
      className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-gray-200 hover:border-blue-300"
      onClick={() => {
        setSelectedSoftware(sw)
        setActiveView("detail")
      }}
    >
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start gap-3">
          <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shrink-0">
            {sw.thumbnail ? (
              <img src={sw.thumbnail} alt={sw.name} className="w-full h-full object-cover rounded-lg" />
            ) : (
              <Package className="w-7 h-7 text-gray-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate group-hover:text-blue-600 transition-colors">
              {sw.name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>v{sw.version}</span>
              <span>•</span>
              <span>{sw.fileSize}</span>
            </div>
          </div>
          {sw.featured && (
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Featured</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-gray-600 line-clamp-2">{sw.description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between border-t bg-gray-50/50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{sw.rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-500">
            <Download className="w-4 h-4" />
            <span className="text-sm">{formatNumber(sw.downloadCount)}</span>
          </div>
        </div>
        <Button size="sm" className="gap-1">
          Lihat Detail
          <ChevronRight className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  )

  // Software Grid
  const SoftwareGrid = () => (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">
            {selectedCategory
              ? categories.find((c) => c.id === selectedCategory)?.name
              : "Semua Software"}
          </h2>
          <Badge variant="secondary">{software.length} software</Badge>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="h-14 bg-gray-200 rounded mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : software.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {software.map((sw) => (
              <SoftwareCard key={sw.id} sw={sw} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Tidak ada software ditemukan</p>
          </div>
        )}
      </div>
    </section>
  )

  // Software Detail View
  const SoftwareDetailView = () => {
    if (!selectedSoftware) return null
    
    return (
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => {
            setActiveView("home")
            setSelectedSoftware(null)
          }}
        >
          <ChevronRight className="w-4 h-4 rotate-180 mr-2" />
          Kembali
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shrink-0">
                    {selectedSoftware.thumbnail ? (
                      <img src={selectedSoftware.thumbnail} alt={selectedSoftware.name} className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <Package className="w-10 h-10 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold mb-1">{selectedSoftware.name}</h1>
                    <p className="text-gray-600">{selectedSoftware.developer}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        <StarRating rating={Math.round(selectedSoftware.rating)} />
                        <span className="text-sm text-gray-500 ml-1">
                          ({selectedSoftware.ratingCount} ulasan)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 mb-6">{selectedSoftware.description}</p>

                {selectedSoftware.longDescription && (
                  <div className="prose prose-sm max-w-none mb-6">
                    <h3 className="text-lg font-semibold mb-2">Deskripsi Lengkap</h3>
                    <div className="text-gray-600 whitespace-pre-line">
                      {selectedSoftware.longDescription}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-500">Versi</p>
                    <p className="font-semibold">{selectedSoftware.version}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ukuran</p>
                    <p className="font-semibold">{selectedSoftware.fileSize}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Developer</p>
                    <p className="font-semibold">{selectedSoftware.developer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Downloads</p>
                    <p className="font-semibold">{formatNumber(selectedSoftware.downloadCount)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comments Section */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Ulasan & Komentar</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                {session?.user ? (
                  <form onSubmit={handleSubmitComment} className="space-y-3 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Rating Anda:</span>
                      <StarRating rating={commentForm.rating} interactive onChange={(r) => setCommentForm(prev => ({ ...prev, rating: r }))} />
                    </div>
                    <Textarea
                      placeholder="Tulis ulasan Anda..."
                      value={commentForm.comment}
                      onChange={(e) => setCommentForm({ ...commentForm, comment: e.target.value })}
                      required
                    />
                    <Button type="submit">Kirim Ulasan</Button>
                  </form>
                ) : (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Silakan <Button variant="link" className="p-0 h-auto" onClick={() => setAuthModalOpen(true)}>login</Button> untuk memberikan ulasan.
                    </AlertDescription>
                  </Alert>
                )}

                <Separator />

                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {selectedSoftware.comments?.map((comment) => (
                      <div key={comment.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback>{comment.user?.name?.[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{comment.user?.name}</span>
                            <StarRating rating={comment.rating} />
                          </div>
                          <p className="text-gray-600 text-sm">{comment.comment}</p>
                        </div>
                      </div>
                    ))}
                    {(!selectedSoftware.comments || selectedSoftware.comments.length === 0) && (
                      <p className="text-center text-gray-500 py-8">Belum ada ulasan</p>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card className="sticky top-20">
              <CardContent className="p-6 space-y-4">
                <Button
                  className="w-full h-14 text-lg gap-2 bg-green-600 hover:bg-green-700"
                  onClick={() => handleDownload(selectedSoftware)}
                >
                  <Download className="w-5 h-5" />
                  Download Sekarang
                </Button>

                <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg">
                  <Shield className="w-5 h-5" />
                  <span className="text-sm">File telah di-scan antivirus</span>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-semibold">Informasi File</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">OS Support</span>
                      <span className="text-right">{selectedSoftware.osSupport}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Kategori</span>
                      <span>{selectedSoftware.category?.name || "-"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Ditambahkan</span>
                      <span>{new Date(selectedSoftware.createdAt).toLocaleDateString("id-ID")}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // Articles View
  const ArticlesView = () => (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Artikel & Tutorial</h1>
        <Button variant="ghost" onClick={() => setActiveView("home")}>
          <ChevronRight className="w-4 h-4 rotate-180 mr-2" />
          Kembali
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <Card
            key={article.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => {
              setSelectedArticle(article)
              setActiveView("article-detail")
            }}
          >
            {article.thumbnail && (
              <div className="h-40 bg-gray-100 rounded-t-lg overflow-hidden">
                <img src={article.thumbnail} alt={article.title} className="w-full h-full object-cover" />
              </div>
            )}
            <CardHeader>
              <h3 className="font-semibold line-clamp-2">{article.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-2">{article.excerpt}</p>
            </CardHeader>
            <CardFooter className="text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                {formatNumber(article.viewCount)} views
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {articles.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Belum ada artikel</p>
        </div>
      )}
    </div>
  )

  // Article Detail View
  const ArticleDetailView = () => {
    if (!selectedArticle) return null
    
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => {
            setActiveView("articles")
            setSelectedArticle(null)
          }}
        >
          <ChevronRight className="w-4 h-4 rotate-180 mr-2" />
          Kembali ke Artikel
        </Button>

        <article className="prose prose-lg max-w-none">
          <h1 className="text-3xl font-bold mb-4">{selectedArticle.title}</h1>
          
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarFallback>{selectedArticle.author?.name?.[0]}</AvatarFallback>
              </Avatar>
              {selectedArticle.author?.name}
            </div>
            <span>•</span>
            <span>{new Date(selectedArticle.createdAt).toLocaleDateString("id-ID")}</span>
            <span>•</span>
            <span>{formatNumber(selectedArticle.viewCount)} views</span>
          </div>

          {selectedArticle.thumbnail && (
            <img src={selectedArticle.thumbnail} alt={selectedArticle.title} className="w-full rounded-lg mb-8" />
          )}

          <div className="whitespace-pre-line">{selectedArticle.content}</div>
        </article>
      </div>
    )
  }

  // Admin Panel
  const AdminPanel = () => {
    if (session?.user?.role !== "admin") {
      return (
        <div className="container mx-auto px-4 py-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Akses Ditolak</h1>
          <p className="text-gray-500">Anda tidak memiliki akses ke halaman ini.</p>
        </div>
      )
    }

    return (
      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r hidden md:block">
          <div className="p-4 border-b">
            <h2 className="font-bold text-lg">Admin Panel</h2>
          </div>
          <nav className="p-2">
            {[
              { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
              { id: "software", label: "Kelola Software", icon: Package },
              { id: "categories", label: "Kelola Kategori", icon: FolderTree },
              { id: "articles", label: "Kelola Artikel", icon: FileText },
              { id: "users", label: "Kelola User", icon: Users },
              { id: "comments", label: "Kelola Komentar", icon: MessageSquare },
            ].map((item) => (
              <Button
                key={item.id}
                variant={adminTab === item.id ? "secondary" : "ghost"}
                className="w-full justify-start gap-2 mb-1"
                onClick={() => setAdminTab(item.id)}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-50 overflow-auto">
          {/* Dashboard Tab */}
          {adminTab === "dashboard" && stats && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <Button onClick={handleSeed} variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Seed Demo Data
                </Button>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Total Software", value: stats.totalSoftware, icon: Package, color: "text-blue-600" },
                  { label: "Total Downloads", value: formatNumber(stats.totalDownloads), icon: Download, color: "text-green-600" },
                  { label: "Total Users", value: stats.totalUsers, icon: Users, color: "text-purple-600" },
                  { label: "Total Kategori", value: stats.totalCategories, icon: FolderTree, color: "text-orange-600" },
                ].map((item, i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">{item.label}</p>
                          <p className="text-2xl font-bold">{item.value}</p>
                        </div>
                        <item.icon className={`w-8 h-8 ${item.color}`} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <h3 className="font-semibold">Top Downloaded</h3>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {stats.topDownloaded.map((sw, i) => (
                      <div key={sw.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-lg text-gray-300">{i + 1}</span>
                          <div>
                            <p className="font-medium">{sw.name}</p>
                            <p className="text-sm text-gray-500">{formatNumber(sw.downloadCount)} downloads</p>
                          </div>
                        </div>
                        <TrendingUp className="w-5 h-5 text-green-500" />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <h3 className="font-semibold">Komentar Terbaru</h3>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {stats.recentComments.map((c) => (
                      <div key={c.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{c.user?.name}</span>
                          <span className="text-sm text-gray-500">on {c.software?.name}</span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-1">{c.comment}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Software Management Tab */}
          {adminTab === "software" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Kelola Software</h1>
                <Button
                  onClick={() => {
                    setEditingSoftware(null)
                    setSoftwareForm({ name: "", description: "", longDescription: "", version: "", fileSize: "", osSupport: "", developer: "", thumbnail: "", filePath: "", categoryId: "", featured: false })
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Software
                </Button>
              </div>

              {/* Software Form */}
              <Card>
                <CardHeader>
                  <h3 className="font-semibold">{editingSoftware ? "Edit Software" : "Tambah Software Baru"}</h3>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveSoftware} className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nama Software *</Label>
                      <Input
                        value={softwareForm.name}
                        onChange={(e) => setSoftwareForm({ ...softwareForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Versi *</Label>
                      <Input
                        value={softwareForm.version}
                        onChange={(e) => setSoftwareForm({ ...softwareForm, version: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Deskripsi Singkat *</Label>
                      <Input
                        value={softwareForm.description}
                        onChange={(e) => setSoftwareForm({ ...softwareForm, description: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Deskripsi Lengkap</Label>
                      <Textarea
                        value={softwareForm.longDescription}
                        onChange={(e) => setSoftwareForm({ ...softwareForm, longDescription: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Ukuran File *</Label>
                      <Input
                        placeholder="e.g., 25 MB"
                        value={softwareForm.fileSize}
                        onChange={(e) => setSoftwareForm({ ...softwareForm, fileSize: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Developer *</Label>
                      <Input
                        value={softwareForm.developer}
                        onChange={(e) => setSoftwareForm({ ...softwareForm, developer: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>OS Support *</Label>
                      <Input
                        placeholder="e.g., Windows 10/11, macOS, Linux"
                        value={softwareForm.osSupport}
                        onChange={(e) => setSoftwareForm({ ...softwareForm, osSupport: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Kategori</Label>
                      <Select value={softwareForm.categoryId} onValueChange={(v) => setSoftwareForm({ ...softwareForm, categoryId: v })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((c) => (
                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Thumbnail URL</Label>
                      <Input
                        placeholder="https://..."
                        value={softwareForm.thumbnail}
                        onChange={(e) => setSoftwareForm({ ...softwareForm, thumbnail: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>File Download URL</Label>
                      <Input
                        placeholder="https://..."
                        value={softwareForm.filePath}
                        onChange={(e) => setSoftwareForm({ ...softwareForm, filePath: e.target.value })}
                      />
                    </div>
                    <div className="flex items-center gap-2 md:col-span-2">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={softwareForm.featured}
                        onChange={(e) => setSoftwareForm({ ...softwareForm, featured: e.target.checked })}
                      />
                      <Label htmlFor="featured">Tandai sebagai Featured</Label>
                    </div>
                    <div className="flex gap-2 md:col-span-2">
                      <Button type="submit">
                        <Save className="w-4 h-4 mr-2" />
                        {editingSoftware ? "Update" : "Simpan"}
                      </Button>
                      {editingSoftware && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setEditingSoftware(null)
                            setSoftwareForm({ name: "", description: "", longDescription: "", version: "", fileSize: "", osSupport: "", developer: "", thumbnail: "", filePath: "", categoryId: "", featured: false })
                          }}
                        >
                          Batal
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Software List */}
              <Card>
                <CardHeader>
                  <h3 className="font-semibold">Daftar Software</h3>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="border-b">
                        <tr>
                          <th className="text-left p-2">Nama</th>
                          <th className="text-left p-2">Versi</th>
                          <th className="text-left p-2">Kategori</th>
                          <th className="text-left p-2">Downloads</th>
                          <th className="text-left p-2">Rating</th>
                          <th className="text-right p-2">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {software.map((sw) => (
                          <tr key={sw.id} className="border-b hover:bg-gray-50">
                            <td className="p-2 font-medium">{sw.name}</td>
                            <td className="p-2">{sw.version}</td>
                            <td className="p-2">{sw.category?.name || "-"}</td>
                            <td className="p-2">{formatNumber(sw.downloadCount)}</td>
                            <td className="p-2">
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                {sw.rating.toFixed(1)}
                              </div>
                            </td>
                            <td className="p-2">
                              <div className="flex justify-end gap-1">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => {
                                    setEditingSoftware(sw)
                                    setSoftwareForm({
                                      name: sw.name,
                                      description: sw.description,
                                      longDescription: sw.longDescription || "",
                                      version: sw.version,
                                      fileSize: sw.fileSize,
                                      osSupport: sw.osSupport,
                                      developer: sw.developer,
                                      thumbnail: sw.thumbnail || "",
                                      filePath: sw.filePath || "",
                                      categoryId: sw.categoryId || "",
                                      featured: sw.featured
                                    })
                                  }}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="text-red-500"
                                  onClick={() => setDeleteTarget({ type: "software", id: sw.id })}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Categories Management Tab */}
          {adminTab === "categories" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Kelola Kategori</h1>
              </div>

              <Card>
                <CardHeader>
                  <h3 className="font-semibold">{editingCategory ? "Edit Kategori" : "Tambah Kategori Baru"}</h3>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveCategory} className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nama Kategori *</Label>
                      <Input
                        value={categoryForm.name}
                        onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Icon</Label>
                      <Select value={categoryForm.icon} onValueChange={(v) => setCategoryForm({ ...categoryForm, icon: v })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih icon" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Wrench">Utility</SelectItem>
                          <SelectItem value="Video">Multimedia</SelectItem>
                          <SelectItem value="Shield">Security</SelectItem>
                          <SelectItem value="Code">Developer</SelectItem>
                          <SelectItem value="FileText">Office</SelectItem>
                          <SelectItem value="Gamepad2">Games</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Deskripsi</Label>
                      <Input
                        value={categoryForm.description}
                        onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Warna (Hex)</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="#3B82F6"
                          value={categoryForm.color}
                          onChange={(e) => setCategoryForm({ ...categoryForm, color: e.target.value })}
                        />
                        <input
                          type="color"
                          value={categoryForm.color || "#3B82F6"}
                          onChange={(e) => setCategoryForm({ ...categoryForm, color: e.target.value })}
                          className="w-10 h-10 rounded cursor-pointer"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 md:col-span-2">
                      <Button type="submit">
                        <Save className="w-4 h-4 mr-2" />
                        {editingCategory ? "Update" : "Simpan"}
                      </Button>
                      {editingCategory && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setEditingCategory(null)
                            setCategoryForm({ name: "", description: "", icon: "", color: "" })
                          }}
                        >
                          Batal
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-0">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                    {categories.map((cat) => (
                      <div key={cat.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: cat.color || "#3B82F6" }}
                          >
                            <span className="text-white">{getCategoryIcon(cat.icon)}</span>
                          </div>
                          <div>
                            <p className="font-medium">{cat.name}</p>
                            <p className="text-sm text-gray-500">{cat._count?.software || 0} software</p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              setEditingCategory(cat)
                              setCategoryForm({
                                name: cat.name,
                                description: cat.description || "",
                                icon: cat.icon || "",
                                color: cat.color || ""
                              })
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-red-500"
                            onClick={() => setDeleteTarget({ type: "categories", id: cat.id })}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Articles Management Tab */}
          {adminTab === "articles" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Kelola Artikel</h1>
              </div>

              <Card>
                <CardHeader>
                  <h3 className="font-semibold">{editingArticle ? "Edit Artikel" : "Tambah Artikel Baru"}</h3>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveArticle} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Judul *</Label>
                        <Input
                          value={articleForm.title}
                          onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Thumbnail URL</Label>
                        <Input
                          value={articleForm.thumbnail}
                          onChange={(e) => setArticleForm({ ...articleForm, thumbnail: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Excerpt</Label>
                      <Input
                        value={articleForm.excerpt}
                        onChange={(e) => setArticleForm({ ...articleForm, excerpt: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Konten *</Label>
                      <Textarea
                        value={articleForm.content}
                        onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })}
                        rows={10}
                        required
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="published"
                        checked={articleForm.published}
                        onChange={(e) => setArticleForm({ ...articleForm, published: e.target.checked })}
                      />
                      <Label htmlFor="published">Publikasikan</Label>
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit">
                        <Save className="w-4 h-4 mr-2" />
                        {editingArticle ? "Update" : "Simpan"}
                      </Button>
                      {editingArticle && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setEditingArticle(null)
                            setArticleForm({ title: "", content: "", excerpt: "", thumbnail: "", published: false })
                          }}
                        >
                          Batal
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {articles.map((article) => (
                      <div key={article.id} className="flex items-center justify-between p-4">
                        <div>
                          <p className="font-medium">{article.title}</p>
                          <p className="text-sm text-gray-500">
                            {article.published ? "Published" : "Draft"} • {formatNumber(article.viewCount)} views
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              setEditingArticle(article)
                              setArticleForm({
                                title: article.title,
                                content: article.content,
                                excerpt: article.excerpt || "",
                                thumbnail: article.thumbnail || "",
                                published: article.published
                              })
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-red-500"
                            onClick={() => setDeleteTarget({ type: "articles", id: article.id })}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Users Management Tab */}
          {adminTab === "users" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold">Kelola User</h1>

              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="border-b">
                        <tr>
                          <th className="text-left p-4">User</th>
                          <th className="text-left p-4">Email</th>
                          <th className="text-left p-4">Role</th>
                          <th className="text-left p-4">Bergabung</th>
                          <th className="text-right p-4">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id} className="border-b hover:bg-gray-50">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium">{user.name}</span>
                              </div>
                            </td>
                            <td className="p-4">{user.email}</td>
                            <td className="p-4">
                              <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                                {user.role}
                              </Badge>
                            </td>
                            <td className="p-4">
                              {new Date(user.createdAt).toLocaleDateString("id-ID")}
                            </td>
                            <td className="p-4">
                              <div className="flex justify-end gap-1">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => setEditingUser(user)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="text-red-500"
                                  onClick={() => setDeleteTarget({ type: "users", id: user.id })}
                                  disabled={user.role === "admin"}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Comments Management Tab */}
          {adminTab === "comments" && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold">Kelola Komentar</h1>

              <Card>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {comments.map((comment) => (
                      <div key={comment.id} className="p-4 flex items-start justify-between gap-4">
                        <div className="flex gap-3">
                          <Avatar>
                            <AvatarFallback>{comment.user?.name?.[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{comment.user?.name}</span>
                              <StarRating rating={comment.rating} />
                            </div>
                            <p className="text-gray-600">{comment.comment}</p>
                            <p className="text-sm text-gray-400 mt-1">
                              pada {comment.software?.name} • {new Date(comment.createdAt).toLocaleDateString("id-ID")}
                            </p>
                          </div>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-red-500 shrink-0"
                          onClick={() => setDeleteTarget({ type: "comments", id: comment.id })}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    )
  }

  // Footer Component
  const Footer = () => (
    <footer className="bg-gray-900 text-gray-300 py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <Download className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-white">{siteConfig.name}</span>
            </div>
            <p className="text-sm">
              {siteConfig.footerText}
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Kategori</h4>
            <ul className="space-y-2 text-sm">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <button
                    className="hover:text-white transition-colors"
                    onClick={() => {
                      setSelectedCategory(cat.id)
                      setActiveView("home")
                    }}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Navigasi</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  className="hover:text-white transition-colors"
                  onClick={() => setActiveView("home")}
                >
                  Beranda
                </button>
              </li>
              <li>
                <button
                  className="hover:text-white transition-colors"
                  onClick={() => setActiveView("articles")}
                >
                  Artikel
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Keamanan</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-400" />
                <span>Ter-scan Antivirus</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>100% Aman</span>
              </div>
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-green-400" />
                <span>Download Cepat</span>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-sm">
          <p>{siteConfig.copyright}</p>
        </div>
      </div>
    </footer>
  )

  // ===================== MAIN RENDER =====================

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <nav className="space-y-2 mt-4">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => { setActiveView("home"); setSidebarOpen(false); }}
            >
              <Home className="w-4 h-4" />
              Beranda
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => { setActiveView("articles"); setSidebarOpen(false); }}
            >
              <FileText className="w-4 h-4" />
              Artikel
            </Button>
            {session?.user?.role === "admin" && (
              <Button
                variant="ghost"
                className="w-full justify-start gap-2"
                onClick={() => { setActiveView("admin"); setSidebarOpen(false); }}
              >
                <LayoutDashboard className="w-4 h-4" />
                Admin Panel
              </Button>
            )}
          </nav>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1">
        {activeView === "home" && (
          <>
            <HeroSection />
            <CategoriesSection />
            <SoftwareGrid />
          </>
        )}
        {activeView === "detail" && <SoftwareDetailView />}
        {activeView === "articles" && <ArticlesView />}
        {activeView === "article-detail" && <ArticleDetailView />}
        {activeView === "admin" && <AdminPanel />}
      </main>

      {activeView !== "admin" && <Footer />}

      {/* Auth Modal */}
      <Dialog open={authModalOpen} onOpenChange={setAuthModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{authMode === "login" ? "Login" : "Registrasi"}</DialogTitle>
            <DialogDescription>
              {authMode === "login"
                ? "Masuk ke akun Anda untuk mengakses semua fitur."
                : `Buat akun baru untuk mulai menggunakan ${siteConfig.name}.`}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAuth} className="space-y-4">
            {authMode === "register" && (
              <div className="space-y-2">
                <Label>Nama</Label>
                <Input
                  value={authForm.name}
                  onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                  required
                />
              </div>
            )}
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={authForm.email}
                onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                value={authForm.password}
                onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              {authMode === "login" ? "Login" : "Registrasi"}
            </Button>
          </form>
          <div className="text-center text-sm">
            <span className="text-gray-500">
              {authMode === "login" ? "Belum punya akun?" : "Sudah punya akun?"}
            </span>
            <Button
              variant="link"
              className="ml-1 p-0"
              onClick={() => {
                setAuthMode(authMode === "login" ? "register" : "login")
                setAuthForm({ email: "", password: "", name: "" })
              }}
            >
              {authMode === "login" ? "Registrasi" : "Login"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50">
          <Alert className={toast.type === "error" ? "border-red-500 bg-red-50" : "border-green-500 bg-green-50"}>
            {toast.type === "success" ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription>{toast.message}</AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  )
}
