"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Navigation } from '@/components/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { User, Upload } from 'lucide-react'

interface Student {
  nis: string
  name: string
  class: string
}

export default function VotingPage() {
  const { user, token } = useAuth()
  const router = useRouter()
  const [nis, setNis] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showUpload, setShowUpload] = useState(false)
  const [uploadFile, setUploadFile] = useState<File | null>(null)

  useEffect(() => {
    if (!user || (user.role !== 'voter' && user.role !== 'operator')) {
      router.push('/')
      return
    }
  }, [user, router])

  const handleNISVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/students/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nis })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      sessionStorage.setItem('currentStudent', JSON.stringify(data.student))
      router.push('/voting/greeting')
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadFile || !token) return

    const formData = new FormData()
    formData.append('file', uploadFile)

    try {
      const response = await fetch('/api/students/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      alert(`Successfully uploaded ${data.count} students`)
      setShowUpload(false)
      setUploadFile(null)
    } catch (error: any) {
      setError(error.message)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen relative">
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/nis-background.png')`,
          zIndex: -2
        }}
      />
      
      <Navigation />
      
      <div className="pt-24 pb-12 relative z-10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-2xl">
              Voting Ketua OSIS 2025
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto drop-shadow-lg">
            </p>
          </div>

          {user.role === 'operator' && (
            <div className="mb-8 text-center">
              <Button
                onClick={() => setShowUpload(true)}
                variant="outline"
                className="flex items-center space-x-2 bg-white/10 border-white/30 text-white hover:bg-white hover:text-gray-900"
              >
                <Upload className="h-4 w-4" />
                <span>Upload Student Data (CSV)</span>
              </Button>
            </div>
          )}

          {error && (
            <div className="mb-8 p-4 bg-red-500/90 border border-red-400 text-white rounded-lg text-center shadow-lg">
              {error}
            </div>
          )}

          <Card className="bg-white/95 shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-center justify-center">
                <User className="h-5 w-5" />
                <span>Verifikasi NIS Siswa</span>
              </CardTitle>
              <CardDescription className="text-center">
                Masukkan NIS siswa yang akan melakukan voting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleNISVerification} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="nis" className="text-lg">NIS (Nomor Induk Siswa)</Label>
                  <Input
                    id="nis"
                    type="text"
                    value={nis}
                    onChange={(e) => setNis(e.target.value)}
                    placeholder="Contoh: 2024001"
                    className="text-lg py-3"
                    required
                  />
                </div>
                <Button type="submit" className="w-full py-3 text-lg" disabled={loading}>
                  {loading ? 'Memverifikasi...' : 'Verifikasi NIS'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showUpload} onOpenChange={setShowUpload}>
        <DialogContent className="bg-white/95">
          <DialogHeader>
            <DialogTitle>Upload Student Data</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFileUpload} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="csvFile">CSV File</Label>
              <Input
                id="csvFile"
                type="file"
                accept=".csv"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                required
              />
              <p className="text-sm text-gray-600">
                Format: NIS, Name, Class (with header row)
              </p>
            </div>
            <Button type="submit" className="w-full" disabled={!uploadFile}>
              Upload
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
