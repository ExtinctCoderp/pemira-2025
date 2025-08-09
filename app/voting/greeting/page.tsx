"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Navigation } from '@/components/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { User, ArrowLeft, ArrowRight } from 'lucide-react'

interface Student {
  nis: string
  name: string
  class: string
}

export default function GreetingPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [student, setStudent] = useState<Student | null>(null)

  useEffect(() => {
    if (!user || (user.role !== 'voter' && user.role !== 'operator')) {
      router.push('/')
      return
    }

    const studentData = sessionStorage.getItem('currentStudent')
    if (!studentData) {
      router.push('/voting')
      return
    }

    setStudent(JSON.parse(studentData))
  }, [user, router])

  const handleNext = () => {
    router.push('/voting/candidates')
  }

  const handleBack = () => {
    sessionStorage.removeItem('currentStudent')
    router.push('/voting')
  }

  if (!user || !student) {
    return null
  }

  return (
    <div className="min-h-screen relative">
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/greeting-background.png')`,
          zIndex: -2
        }}
      />
      
      <Navigation />
      
      <div className="pt-24 pb-12 relative z-10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-2xl">
              Selamat Datang!
            </h1>
            <p className="text-xl text-white/90 drop-shadow-lg">
              Verifikasi berhasil, siap untuk melakukan voting
            </p>
          </div>

          <Card className="bg-white/95 shadow-2xl mb-8">
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-10 w-10 text-blue-600" />
              </div>
              <CardTitle className="text-3xl text-green-600 mb-2">
                Halo, {student.name}!
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-3">
                  Data Siswa Terverifikasi
                </h3>
                <div className="space-y-2 text-green-700">
                  <p><strong>Nama:</strong> {student.name}</p>
                  <p><strong>NIS:</strong> {student.nis}</p>
                  <p><strong>Kelas:</strong> {student.class}</p>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  Petunjuk Voting
                </h3>
                <p className="text-blue-700">
                  Anda akan melihat 3 kandidat Ketua OSIS. Pilih salah satu kandidat yang menurut Anda paling tepat untuk memimpin OSIS.
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 text-sm">
                  <strong>Penting:</strong> Setelah memilih kandidat, pilihan Anda tidak dapat diubah lagi.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between gap-4">
            <Button
              onClick={handleBack}
              variant="outline"
              size="lg"
              className="flex items-center space-x-2 bg-white/10 border-white/30 text-white hover:bg-white hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Kembali</span>
            </Button>
            
            <Button
              onClick={handleNext}
              size="lg"
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
            >
              <span>Lanjut ke Voting</span>
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
