"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
  id: string
  username: string
  role: 'voter' | 'operator'
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('AuthProvider: Initializing...')
    
    try {
      const savedToken = localStorage.getItem('token')
      const savedUser = localStorage.getItem('user')
      
      console.log('AuthProvider: Saved token exists:', !!savedToken)
      console.log('AuthProvider: Saved user exists:', !!savedUser)
      
      if (savedToken && savedUser) {
        const parsedUser = JSON.parse(savedUser)
        console.log('AuthProvider: Restoring user:', parsedUser)
        setToken(savedToken)
        setUser(parsedUser)
      } else {
        console.log('AuthProvider: No saved auth data found')
      }
    } catch (error) {
      console.error('AuthProvider: Error restoring auth data:', error)
      // Clear corrupted data
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
    
    setLoading(false)
    console.log('AuthProvider: Initialization complete')
  }, [])

  const login = async (username: string, password: string) => {
    console.log('AuthProvider: Login attempt for:', username)
    
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('AuthProvider: Login failed:', data.error)
      throw new Error(data.error || 'Login failed')
    }

    console.log('AuthProvider: Login successful:', data.user)
    
    setToken(data.token)
    setUser(data.user)
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
  }

  const logout = () => {
    console.log('AuthProvider: Logging out user:', user?.username)
    
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    
    sessionStorage.removeItem('currentStudent')
    sessionStorage.removeItem('voteSuccess')
  }

  const contextValue = {
    user,
    token,
    login,
    logout,
    loading
  }

  console.log('AuthProvider: Current state:', {
    user: user?.username || 'none',
    hasToken: !!token,
    loading
  })

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
