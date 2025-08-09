"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Navigation } from '@/components/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Home, ArrowLeft } from 'lucide-react'

interface VoteSuccess {
  studentName: string
  candidateName: string
  timestamp: string
}

export default function SuccessPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [voteData, setVoteData] = useState<VoteSuccess | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    console.log('Success page loaded')
    console.log('Auth loading:', authLoading)
    console.log('User:', user)
    
    if (authLoading) {
      console.log('Still loading auth, waiting...')
      return
    }
    
    if (!user) {
      console.log('No user found')
      setError('Please login as admin to access this page')
      setLoading(false)
      return
    }

    if (user.role !== 'voter' && user.role !== 'operator') {
      console.log('User role not authorized:', user.role)
      setError(`Role '${user.role}' not authorized for voting`)
      setLoading(false)
      return
    }

    console.log('User authorized:', user.username, user.role)
    const successData = sessionStorage.getItem('voteSuccess')
    console.log('Success data from storage:', successData)
    
    if (!successData) {
      console.log('No success data found')
      setError('No vote data found. Please complete the voting process first.')
      setLoading(false)
      return
    }

    try {
      const parsedData = JSON.parse(successData)
      setVoteData(parsedData)
      console.log('Vote data set successfully:', parsedData)
      setError('') 
    } catch (parseError) {
      console.error('Error parsing success data:', parseError)
      setError('Invalid vote data format')
    }
    
    setLoading(false)
  }, [user, authLoading]) 

  const handleBackToVoting = () => {
    console.log('Navigating back to voting')
    sessionStorage.removeItem('voteSuccess')
    sessionStorage.removeItem('currentStudent')
    router.push('/voting')
  }

  const handleBackToHome = () => {
    console.log('Navigating back to home')
    sessionStorage.removeItem('voteSuccess')
    sessionStorage.removeItem('currentStudent')
    router.push('/')
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen relative">
        <div 
          className="fixed inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/success-background.png')`,
            zIndex: -2
          }}
        />
        
        <Navigation />
        <div className="pt-24 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white drop-shadow-lg">
              {authLoading ? 'Loading authentication...' : 'Loading success page...'}
            </p>
          </div>
        </div>
      </div>
    )
  }


  if (error || !user || !voteData) {
    return (
      <div className="min-h-screen relative">
        <div 
          className="fixed inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/success-background.png')`,
            zIndex: -2
          }}
        />
        
        <Navigation />
        <div className="pt-24 flex items-center justify-center">
          <div className="max-w-md mx-auto px-4">
            <Card className="bg-white/95 shadow-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-red-600 mb-2">
                  Cannot Load Success Page
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700 font-medium mb-2">Error Details:</p>
                  <p className="text-red-600 text-sm">
                    {error || 'Unknown error occurred'}
                  </p>
                </div>
                
                {process.env.NODE_ENV === 'development' && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-left">
                    <p className="text-gray-700 font-medium mb-2">Debug Info:</p>
                    <div className="text-xs text-gray-600 space-y-1">
                      <p>User: {user ? `${user.username} (${user.role})` : 'Not logged in'}</p>
                      <p>Auth Loading: {authLoading ? 'Yes' : 'No'}</p>
                      <p>Vote Data: {sessionStorage.getItem('voteSuccess') ? 'Present' : 'Missing'}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => router.push('/voting')} className="bg-blue-600 hover:bg-blue-700">
                    Back to Voting
                  </Button>
                  <Button onClick={() => router.push('/')} variant="outline">
                    Back to Home
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/success-background.png')`,
          zIndex: -2
        }}
      />
      
      <Navigation />
      
      <div className="pt-24 pb-12 relative z-10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-2xl">
              🎉 Vote Berhasil! 🎉
            </h1>
            <p className="text-xl text-white/90 drop-shadow-lg">
              Terima kasih telah berpartisipasi dalam pemilihan Ketua OSIS
            </p>
          </div>

          <Card className="bg-white/95 shadow-2xl mb-8">
            <CardHeader className="text-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-16 w-16 text-green-600" />
              </div>
              <CardTitle className="text-3xl text-green-600 mb-2">
                Vote Tersimpan dengan Sukses!
              </CardTitle>
              <p className="text-gray-600">
                Suara Anda telah dicatat dan akan dihitung dalam hasil akhir
              </p>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-3">
                  📋 Detail Voting
                </h3>
                <div className="space-y-3 text-green-700">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Nama Siswa:</span>
                    <span className="font-bold">{voteData.studentName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Kandidat Terpilih:</span>
                    <span className="font-bold text-blue-600">{voteData.candidateName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Waktu Voting:</span>
                    <span className="font-bold">{new Date(voteData.timestamp).toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">
                  ℹ️ Informasi Penting
                </h3>
                <div className="space-y-2 text-blue-700 text-sm">
                  <p>✅ Vote Anda telah tersimpan dengan aman di database</p>
                  <p>✅ Siswa ini tidak dapat melakukan voting lagi</p>
                  <p>✅ Hasil akan diumumkan setelah pemilihan selesai</p>
                  <p>✅ Data voting dilindungi dan bersifat rahasia</p>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 text-sm">
                  <strong>⚠️ Catatan:</strong> Vote tidak dapat diubah atau dibatalkan setelah disimpan. 
                  Pastikan pilihan Anda sudah benar.
                </p>
              </div>

            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleBackToVoting}
              size="lg"
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-8 py-3"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Voting Siswa Lain</span>
            </Button>
            
            <Button
              onClick={handleBackToHome}
              size="lg"
              variant="outline"
              className="flex items-center space-x-2 bg-white/10 border-white/30 text-white hover:bg-white hover:text-gray-900 px-8 py-3"
            >
              <Home className="h-5 w-5" />
              <span>Kembali ke Menu</span>
            </Button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-white/80 text-sm drop-shadow-lg">
              Jika ada pertanyaan atau masalah teknis, hubungi Operator Admin
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
