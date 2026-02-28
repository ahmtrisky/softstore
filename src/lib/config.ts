// ========================================
// KONFIGURASI WEBSITE
// ========================================
// File ini berisi semua konfigurasi yang bisa diubah
// untuk menyesuaikan nama, warna, dan tampilan website
// ========================================

export const siteConfig = {
  // ========================================
  // GANTI NAMA WEBSITE DI SINI
  // ========================================
  name: "SoftStore",
  
  // Tagline di hero section
  tagline: "Download Software & File Terpercaya",
  subTagline: "dengan Cepat dan Aman",
  
  // Deskripsi untuk SEO
  description: "Platform download software terpercaya dengan koleksi lengkap dan aman. Download aplikasi gratis dengan cepat dan terjamin keamanannya.",
  
  // Email admin default (untuk seed data)
  adminEmail: "admin@softstore.com",
  adminPassword: "admin123",
  
  // ========================================
  // WARNA TEMA - GANTI DI SINI
  // ========================================
  // Pilih tema warna: "blue", "green", "purple", "red", "orange", "teal", "pink", "indigo"
  // Atau gunakan custom untuk warna sendiri
  colorTheme: "blue" as ColorTheme,
  
  // Jika ingin custom, isi warna di bawah (format: hex code)
  customColors: {
    primary: "#2563eb",    // Warna utama (tombol, link, dll)
    secondary: "#16a34a",  // Warna sekunder (badge, aksen)
    accent: "#8b5cf6",     // Warna aksen
  },
  
  // ========================================
  // PILIHAN WARNA YANG TERSEDIA
  // ========================================
  colorThemes: {
    blue: {
      primary: "#2563eb",    // Biru
      secondary: "#16a34a",  // Hijau
      accent: "#8b5cf6",     // Ungu
      name: "Biru (Default)"
    },
    green: {
      primary: "#16a34a",    // Hijau
      secondary: "#2563eb",  // Biru
      accent: "#059669",     // Hijau tua
      name: "Hijau"
    },
    purple: {
      primary: "#8b5cf6",    // Ungu
      secondary: "#6366f1",  // Indigo
      accent: "#a855f7",     // Pink
      name: "Ungu"
    },
    red: {
      primary: "#dc2626",    // Merah
      secondary: "#ea580c",  // Orange
      accent: "#f59e0b",     // Kuning
      name: "Merah"
    },
    orange: {
      primary: "#ea580c",    // Orange
      secondary: "#dc2626",  // Merah
      accent: "#f59e0b",     // Kuning
      name: "Orange"
    },
    teal: {
      primary: "#0d9488",    // Teal
      secondary: "#06b6d4",  // Cyan
      accent: "#14b8a6",     // Teal terang
      name: "Teal"
    },
    pink: {
      primary: "#db2777",    // Pink
      secondary: "#ec4899",  // Pink terang
      accent: "#f472b6",     // Pink muda
      name: "Pink"
    },
    indigo: {
      primary: "#4f46e5",    // Indigo
      secondary: "#6366f1",  // Indigo terang
      accent: "#818cf8",     // Indigo muda
      name: "Indigo"
    },
    dark: {
      primary: "#374151",    // Abu-abu gelap
      secondary: "#4b5563",  // Abu-abu
      accent: "#6b7280",     // Abu-abu terang
      name: "Gelap"
    },
    emerald: {
      primary: "#059669",    // Emerald
      secondary: "#10b981",  // Emerald terang
      accent: "#34d399",     // Emerald muda
      name: "Emerald"
    }
  } as Record<string, ColorScheme>,
  
  // ========================================
  // FITUR YANG DITAMPILKAN DI HERO
  // ========================================
  features: [
    { icon: "Shield", text: "100% Aman" },
    { icon: "Download", text: "Download Cepat" },
    { icon: "CheckCircle", text: "Terscan Antivirus" },
  ],
  
  // Footer text
  footerText: "Platform download software terpercaya dengan koleksi lengkap dan aman.",
  
  // Copyright
  copyright: `© ${new Date().getFullYear()} SoftStore. All rights reserved.`,
}

// ========================================
// TIPE UNTUK TYPESCRIPT
// ========================================
export type ColorTheme = "blue" | "green" | "purple" | "red" | "orange" | "teal" | "pink" | "indigo" | "dark" | "emerald" | "custom"

export interface ColorScheme {
  primary: string
  secondary: string
  accent: string
  name: string
}

// Helper function untuk mendapatkan warna aktif
export function getActiveColors() {
  if (siteConfig.colorTheme === "custom") {
    return siteConfig.customColors
  }
  return siteConfig.colorThemes[siteConfig.colorTheme] || siteConfig.colorThemes.blue
}

export type SiteConfig = typeof siteConfig
