"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Navigation } from "@/components/Navigation"
import Image from "next/image"

export default function TutorialPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user || (user.role !== "voter" && user.role !== "operator")) {
      router.push("/")
      return
    }
  }, [user, router])

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen relative">

      <div className="fixed inset-0 bg-cover bg-center bg-no-repeat" style={{backgroundImage: `url('/tutorial-background.png')`,zIndex: -2,}}/>

      <Navigation />
      <div className="pt-24 pb-12 relative z-10">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-2xl">Panduan Voting</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">

            <div className="flex justify-center">
                <div className="aspect-[4/3] lg:aspect-[3/4] relative h-[28rem] lg:h-[36rem]">
                  <Image src="/tutorial-1.png" alt="Tutorial Step 1" fill className="object-cover" priority />
                </div>
            </div>

            <div className="flex justify-center">
                <div className="aspect-[4/3] lg:aspect-[3/4] relative h-[28rem] lg:h-[36rem]">
                  <Image src="/tutorial-2.png" alt="Tutorial Step 2" fill className="object-cover" />
                </div>
            </div>

            <div className="flex justify-center">
                <div className="aspect-[4/3] lg:aspect-[3/4] relative h-[28rem] lg:h-[36rem]">
                  <Image src="/tutorial-3.png" alt="Tutorial Step 3" fill className="object-cover" />
                </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
