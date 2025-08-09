"use client"

import { useEffect, useState } from 'react'
import { Navigation } from '@/components/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Vote, Users, Trophy, BookOpen, Shield, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0)
  const { user } = useAuth()

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/school-background.png')`,
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        />
        
        {/* Gradient Overlay 
        <div 
          className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-purple-900/70 to-indigo-900/80"
          style={{
            transform: `translateY(${scrollY * 0.3}px)`,
          }}
        /> */}
        
        {/* Dark overlay   
        <div className="absolute inset-0 bg-black/40" /> */}
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in drop-shadow-2xl">
            A Forest of Voices,<br></br>
            a Future of Vision
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 drop-shadow-lg">
            Selamat Datang di Website PEMIRA 2025
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link href="/voting">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 shadow-xl">
                  <Vote className="mr-2 h-5 w-5" />
                  Mulai Voting
                </Button>
              </Link>
            ) : (
              <div className="text-center">
                <p className="text-lg mb-4 opacity-90 drop-shadow-lg">
                  Admin harus login untuk mengakses sistem voting
                </p>
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 shadow-xl" disabled>
                  <Shield className="mr-2 h-5 w-5" />
                  Login Required
                </Button>
              </div>
            )}
          </div>
        </div>
      </section> 

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Sistem Voting Digital yang Aman
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Platform voting modern dengan verifikasi NIS untuk memastikan setiap suara siswa terhitung dengan akurat.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Verifikasi NIS</h3>
                <p className="text-gray-600">
                  Setiap siswa diverifikasi melalui NIS untuk memastikan hanya siswa terdaftar yang dapat voting.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Satu Siswa Satu Suara</h3>
                <p className="text-gray-600">
                  Sistem mencegah voting ganda dengan tracking status voting setiap siswa.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Trophy className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Hasil Real-time</h3>
                <p className="text-gray-600">
                  Operator dapat melihat hasil voting secara real-time dengan statistik lengkap.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Peran Admin dalam Sistem
            </h2>
            <p className="text-lg text-gray-600">
              Dua jenis admin dengan akses yang berbeda untuk menjalankan proses voting
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6 border-blue-200 bg-blue-50">
              <CardContent className="pt-0">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-blue-900">Voter Admin</h3>
                    <p className="text-blue-700">Petugas Voting</p>
                  </div>
                </div>
                <ul className="space-y-2 text-blue-800">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Akses halaman Voting
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Akses halaman Tutorial
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Membantu siswa melakukan voting
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="p-6 border-purple-200 bg-purple-50">
              <CardContent className="pt-0">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mr-4">
                    <Trophy className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-900">Operator Admin</h3>
                    <p className="text-purple-700">Pengawas Pemilu</p>
                  </div>
                </div>
                <ul className="space-y-2 text-purple-800">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Akses halaman Voting
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Akses halaman Tutorial
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Akses halaman Result
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Upload data siswa (CSV)
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <img src="/favicon.png" alt="PEMIRA 2025" className="h-8 w-8" />
              <span className="text-2xl font-bold">PEMIRA 2025</span>
            </div>
            <p className="text-gray-400 mb-4">
              Sistem Pemilihan Ketua OSIS Digital yang Aman dan Terpercaya
            </p>
            <p className="text-sm text-gray-500">
              ©SMAN 24 Bandung. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
