"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LogOut, User, Lock } from "lucide-react"

export function Navigation() {
  const { user, login, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [loginForm, setLoginForm] = useState({ username: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await login(loginForm.username, loginForm.password)
      setIsOpen(false)
      setLoginForm({ username: "", password: "" })
      router.push("/")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleNavClick = (href: string, e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault()
      router.push("/")
      return
    }

    if (href === "/results" && user.role !== "operator") {
      e.preventDefault()
      return
    }
  }

  const canAccess = (page: string) => {
    if (!user) return false
    if (page === "results") return user.role === "operator"
    return true 
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 w-full">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <img src="/favicon.png" alt="PEMIRA 2025" className="h-8 w-8" />
              <span className="text-xl font-bold text-gray-900">PEMIRA 2025</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8 flex-1 justify-center">
            <Link
              href="/voting"
              onClick={(e) => handleNavClick("/voting", e)}
              className={`font-medium transition-colors ${
                canAccess("voting") ? "text-gray-700 hover:text-blue-600" : "text-gray-400 cursor-not-allowed"
              } ${pathname === "/voting" ? "text-blue-600" : ""}`}
            >
              Voting
            </Link>
            <Link
              href="/tutorial"
              onClick={(e) => handleNavClick("/tutorial", e)}
              className={`font-medium transition-colors ${
                canAccess("tutorial") ? "text-gray-700 hover:text-blue-600" : "text-gray-400 cursor-not-allowed"
              } ${pathname === "/tutorial" ? "text-blue-600" : ""}`}
            >
              Tutorial
            </Link>
            <Link
              href="/results"
              onClick={(e) => handleNavClick("/results", e)}
              className={`font-medium transition-colors ${
                canAccess("results") ? "text-gray-700 hover:text-blue-600" : "text-gray-400 cursor-not-allowed"
              } ${pathname === "/results" ? "text-blue-600" : ""}`}
            >
              Result
            </Link>
          </div>

          <div className="flex-shrink-0">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-700">{user.username}</span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      user.role === "operator" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {user.role === "operator" ? "Operator Admin" : "Voter Admin"}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="flex items-center space-x-2 bg-transparent"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center space-x-2">
                    <Lock className="h-4 w-4" />
                    <span>Admin Login</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Admin Login</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        type="text"
                        value={loginForm.username}
                        onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        required
                      />
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Logging in..." : "Login"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
