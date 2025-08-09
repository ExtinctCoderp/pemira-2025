"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Navigation } from "@/components/Navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Vote } from "lucide-react"
import Image from "next/image"

interface Candidate {
  _id: string
  name: string
  class: string
  visionMission: string
  photo: string
  votes: number
}

interface Student {
  nis: string
  name: string
  class: string
}

export default function CandidatesPage() {
  const { user, token } = useAuth()
  const router = useRouter()
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [student, setStudent] = useState<Student | null>(null)
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!user || (user.role !== "voter" && user.role !== "operator")) {
      router.push("/")
      return
    }

    const studentData = sessionStorage.getItem("currentStudent")
    if (!studentData) {
      router.push("/voting")
      return
    }

    setStudent(JSON.parse(studentData))
    fetchCandidates()
  }, [user, router])

  const fetchCandidates = async () => {
    try {
      const response = await fetch("/api/candidates")
      const data = await response.json()
      setCandidates(data.candidates)
    } catch (error) {
      setError("Failed to load candidates")
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    router.push("/voting/greeting")
  }

  const handleCandidateSelect = (candidateId: string) => {
    setSelectedCandidate(candidateId)
  }

  const handleSubmit = async () => {
    if (!selectedCandidate || !student || !token) {
      setError("Please select a candidate first")
      return
    }

    const selectedCandidateName = candidates.find((c) => c._id === selectedCandidate)?.name

    const confirmed = window.confirm(
      `Konfirmasi voting untuk ${selectedCandidateName}?\n\nSiswa: ${student.name} (${student.nis})\nKelas: ${student.class}\n\nVoting tidak dapat dibatalkan setelah dikonfirmasi.`,
    )

    if (!confirmed) return

    setSubmitting(true)
    setError("")

    try {
      console.log("Submitting vote:", { nis: student.nis, candidateId: selectedCandidate })

      const response = await fetch("/api/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nis: student.nis,
          candidateId: selectedCandidate,
        }),
      })

      const data = await response.json()
      console.log("Vote response:", data)

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`)
      }

      const successData = {
        studentName: student.name,
        candidateName: selectedCandidateName,
        timestamp: new Date().toISOString(),
      }

      sessionStorage.setItem("voteSuccess", JSON.stringify(successData))

      sessionStorage.removeItem("currentStudent")

      console.log("Redirecting to success page...")

      window.location.href = "/voting/success"
    } catch (error: any) {
      console.error("Vote submission error:", error)
      setError(`Voting failed: ${error.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  if (!user || !student) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen relative">
        <div
          className="fixed inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/voting-background.png')`,
            zIndex: -2,
          }}
        />

        <Navigation />
        <div className="pt-24 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white drop-shadow-lg">Loading candidates...</p>
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
          backgroundImage: `url('/voting-background.png')`,
          zIndex: -2,
        }}
      />

      <Navigation />

      <div className="pt-24 pb-12 relative z-10">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-2xl">Pilih Kandidat Ketua OSIS</h1>
            <p className="text-xl text-white/90 drop-shadow-lg">Pilih salah satu kandidat di bawah ini</p>
            <div className="mt-4 bg-white/10 rounded-lg p-3 inline-block">
              <p className="text-white font-medium">
                Voting untuk: <span className="text-yellow-300">{student.name}</span> ({student.class})
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-500/90 border border-red-400 text-white rounded-lg text-center shadow-lg">
              <p className="font-semibold">Error:</p>
              <p>{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-8">
            {candidates.map((candidate, index) => (
              <div key={candidate._id} className="flex flex-col items-center space-y-4">
                <div className="aspect-square relative w-[32rem] h-[32rem]">
                  <Image
                    src={candidate.photo || `/placeholder.svg?height=400&width=400&query=candidate-${candidate.name}`}
                    alt={candidate.name}
                    fill
                    className="object-contain"
                  />
                </div>

                <Button
                  onClick={() => handleCandidateSelect(candidate._id)}
                  className={`px-8 py-3 text-lg font-semibold transition-all ${
                    selectedCandidate === candidate._id
                      ? "bg-[#472952] hover:bg-[#3b2146] text-white"
                      : "bg-[#865896] hover:bg-[#7a4d89] text-white"
                  }`}
                >
                  {selectedCandidate === candidate._id ? "✓ Kandidat Terpilih" : `Pilih Kandidat ${index + 1}`}
                </Button>
              </div>
            ))}
          </div>

          <div className="flex justify-between gap-4">
            <Button
              onClick={handleBack}
              variant="outline"
              size="lg"
              className="flex items-center space-x-2 bg-white/10 border-white/30 text-white hover:bg-white hover:text-gray-900"
              disabled={submitting}
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Kembali</span>
            </Button>

            <Button
              onClick={handleSubmit}
              disabled={!selectedCandidate || submitting}
              size="lg"
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <Vote className="h-5 w-5" />
                  <span>Submit Vote</span>
                </>
              )}
            </Button>
          </div>

          {candidates.length === 0 && (
            <div className="text-center py-12">
              <p className="text-white text-lg drop-shadow-lg">Belum ada kandidat yang tersedia.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
