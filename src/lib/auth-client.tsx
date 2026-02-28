"use client"

import { useState, useEffect, createContext, useContext, ReactNode } from "react"

// Session context
interface SessionContextType {
  user: {
    id: string
    name: string
    email: string
    role: string
  } | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
}

const SessionContext = createContext<SessionContextType | null>(null)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ id: string; name: string; email: string; role: string } | null>(null)
  const [loading, setLoading] = useState(true)

  // Check session on mount
  useEffect(() => {
    checkSession()
  }, [])

  const checkSession = async () => {
    try {
      const res = await fetch("/api/auth/me")
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setUser(data.user)
        return { success: true }
      } else {
        return { success: false, error: data.error || "Login gagal" }
      }
    } catch (error) {
      return { success: false, error: "Terjadi kesalahan" }
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()

      if (res.ok) {
        return { success: true }
      } else {
        return { success: false, error: data.error || "Registrasi gagal" }
      }
    } catch {
      return { success: false, error: "Terjadi kesalahan" }
    }
  }

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      setUser(null)
    } catch {
      setUser(null)
    }
  }

  return (
    <SessionContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </SessionContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(SessionContext)
  if (!context) {
    throw new Error("useAuth must be used within SessionProvider")
  }
  return context
}
