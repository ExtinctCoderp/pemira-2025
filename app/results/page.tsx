"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Navigation } from '@/components/Navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Trophy, Users, RefreshCw, BarChart3, TrendingUp } from 'lucide-react'

interface Result {
  id: string
  name: string
  class: string
  votes: number
  percentage: string
}

export default function ResultsPage() {
  const { user, token } = useAuth()
  const router = useRouter()
  const [results, setResults] = useState<Result[]>([])
  const [totalVotes, setTotalVotes] = useState(0)
  const [totalStudents, setTotalStudents] = useState(0)
  const [turnout, setTurnout] = useState('0')
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user || user.role !== 'operator') {
      router.push('/')
      return
    }

    fetchResults()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchResults, 30000)
    return () => clearInterval(interval)
  }, [user, router, token])

  const fetchResults = async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true)
    
    try {
      const response = await fetch('/api/results', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      setResults(data.results)
      setTotalVotes(data.totalVotes)
      setTotalStudents(data.totalStudents)
      setTurnout(data.turnout)
      setError('')
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    fetchResults(true)
  }

  if (!user || user.role !== 'operator') {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen relative">
        <div 
          className="fixed inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/results-background.png')`,
            zIndex: -2
          }}
        />
        
        <Navigation />
        <div className="pt-24 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white drop-shadow-lg">Loading results...</p>
          </div>
        </div>
      </div>
    )
  }

  const winner = results[0]
  const maxVotes = Math.max(...results.map(r => r.votes))

  return (
    <div className="min-h-screen relative">
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/results-background.png')`,
          zIndex: -2
        }}
      />
      
      
      <Navigation />
      
      <div className="pt-24 pb-12 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-2xl">
                Hasil Voting Ketua OSIS 2025
              </h1>
              <p className="text-xl text-white/90 drop-shadow-lg">
                Hasil real-time pemilihan Ketua OSIS
              </p>
            </div>
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              variant="outline"
              className="flex items-center space-x-2 bg-white/10 border-white/30 text-white hover:bg-white hover:text-gray-900"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-500/90 border border-red-400 text-white rounded-lg text-center shadow-lg">
              {error}
            </div>
          )}

          {/* Summary Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <Card className="bg-white/95 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalStudents}</div>
                <p className="text-xs text-muted-foreground">
                  Siswa terdaftar
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/95 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalVotes}</div>
                <p className="text-xs text-muted-foreground">
                  Suara masuk
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/95 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Turnout</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{turnout}%</div>
                <p className="text-xs text-muted-foreground">
                  Partisipasi voting
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/95 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pemenang Sementara</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{winner?.name || 'N/A'}</div>
                <p className="text-xs text-muted-foreground">
                  {winner?.percentage || '0'}% suara
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Results Chart */}
          <Card className="mb-8 bg-white/95 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Distribusi Suara</span>
              </CardTitle>
              <CardDescription>
                Visualisasi hasil voting real-time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {results.map((result, index) => (
                  <div key={result.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <Badge variant={index === 0 ? "default" : "secondary"}>
                          #{index + 1}
                        </Badge>
                        <div>
                          <span className="font-medium text-lg">{result.name}</span>
                          <p className="text-sm text-gray-600">{result.class}</p>
                        </div>
                        {index === 0 && result.votes > 0 && (
                          <Trophy className="h-5 w-5 text-yellow-500" />
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">{result.votes} suara</div>
                        <div className="text-sm text-gray-600">{result.percentage}%</div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${
                          index === 0 ? 'bg-blue-600' : 
                          index === 1 ? 'bg-green-500' : 'bg-purple-500'
                        }`}
                        style={{
                          width: totalVotes > 0 ? `${(result.votes / maxVotes) * 100}%` : '0%'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 shadow-xl">
            <CardHeader>
              <CardTitle>Hasil Detail</CardTitle>
              <CardDescription>
                Breakdown lengkap statistik voting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Peringkat</th>
                      <th className="text-left py-3 px-4">Kandidat</th>
                      <th className="text-left py-3 px-4">Kelas</th>
                      <th className="text-right py-3 px-4">Suara</th>
                      <th className="text-right py-3 px-4">Persentase</th>
                      <th className="text-right py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result, index) => (
                      <tr key={result.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <Badge variant={index === 0 ? "default" : "secondary"}>
                            #{index + 1}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 font-medium">{result.name}</td>
                        <td className="py-3 px-4">{result.class}</td>
                        <td className="py-3 px-4 text-right font-bold">{result.votes}</td>
                        <td className="py-3 px-4 text-right">{result.percentage}%</td>
                        <td className="py-3 px-4 text-right">
                          {index === 0 && result.votes > 0 ? (
                            <Badge className="bg-yellow-100 text-yellow-800">
                              Memimpin
                            </Badge>
                          ) : (
                            <Badge variant="outline">
                              Kandidat
                            </Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {totalVotes === 0 && (
            <div className="text-center py-12">
              <p className="text-white text-lg drop-shadow-lg">Belum ada suara yang masuk.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
