import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Candidate from '@/models/Candidate'

export async function GET() {
  try {
    await dbConnect()
    const candidates = await Candidate.find({}).sort({ createdAt: 1 })
    return NextResponse.json({ candidates })
  } catch (error) {
    console.error('Error fetching candidates:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
